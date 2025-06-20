export type ExecutorContext = {
  node: import('../types/workflow').WorkflowNode;
  config: Record<string, unknown>;
  input: unknown[];
};

export type Executor = (
  ctx: ExecutorContext,
) => Promise<unknown[]> | unknown[];

import { useWorkflowStore } from '../store/workflowStore';
import type {
  WorkflowNode,
  WorkflowEdge,
  NodeType,
} from '../types/workflow';
import evaluateExpression from '../utils/evaluateExpression';

function resolveConfig(
  data: Record<string, unknown>,
  item: unknown,
  input: unknown[],
): Record<string, unknown> {
  const config: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (['label', 'description', 'type', 'config', 'runPerItem'].includes(key)) {
      continue;
    }
    if (typeof value === 'string') {
      config[key] = evaluateExpression(value, {
        $json: item,
        $input: input,
      });
    } else {
      config[key] = value;
    }
  }
  return config;
}

export function buildExecutionOrder(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): string[] {
  const inDegree: Record<string, number> = {};
  for (const node of nodes) inDegree[node.id] = 0;
  for (const edge of edges) {
    inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
  }
  const queue = Object.keys(inDegree).filter((id) => inDegree[id] === 0);
  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    for (const edge of edges) {
      if (edge.source === id) {
        inDegree[edge.target] -= 1;
        if (inDegree[edge.target] === 0) queue.push(edge.target);
      }
    }
  }
  return order;
}

async function httpRequestExecutor({ config }: ExecutorContext): Promise<unknown[]> {
  const { method, url } = config as Record<string, string>;
  try {
    const res = await fetch(String(url || '')); // may fail in restricted env
    const data = await res.json();
    return [data];
  } catch {
    return [{ status: 'mock', method, url }];
  }
}

function setExecutor({ config, input }: ExecutorContext): unknown[] {
  const mappings = (config.mappings as Array<{ field: string; value: unknown }>) || [];
  const keepOnly = Boolean(config.keepOnlySetFields);
  return input.map((item) => {
    const base = keepOnly ? {} : { ...(item as Record<string, unknown>) };
    for (const m of mappings) {
      base[m.field] = m.value;
    }
    return base;
  });
}

async function delayExecutor({ config, input }: ExecutorContext): Promise<unknown[]> {
  const duration = Number(config.duration) || 0;
  if (duration > 0) {
    await new Promise((r) => setTimeout(r, duration));
  }
  return input;
}

const executors: Record<NodeType, Executor> = {
  httpRequest: httpRequestExecutor,
  set: setExecutor,
  delay: delayExecutor,
  webhook: async ({ input }) => input,
  code: async ({ input }) => input,
  merge: async ({ input }) => input,
  if: async ({ input }) => input,
  function: async ({ input }) => input,
  functionItem: async ({ input }) => input,
  email: async ({ input }) => input,
  airtable: async ({ input }) => input,
};

export async function runWorkflow(): Promise<void> {
  const state = useWorkflowStore.getState();
  const { nodes, edges } = state;
  const order = buildExecutionOrder(nodes, edges);
  const {
    setInputForNode,
    setOutputForNode,
    setNodeError,
    setNodeStatus,
  } = useWorkflowStore.getState();
  const outputMap: Record<string, unknown[]> = {};

  // reset statuses and errors
  for (const n of nodes) {
    setNodeError(n.id, null);
    setNodeStatus(n.id, 'pending');
  }

  for (const nodeId of order) {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) continue;
    const incoming = edges.filter((e) => e.target === nodeId);
    let input: unknown[] = [];
    if (incoming.length === 0) {
      input = state.inputByNode[nodeId] || [{}];
    } else {
      for (const e of incoming) {
        input.push(...(outputMap[e.source] || []));
      }
    }

    setInputForNode(nodeId, input);

    const dataRecord = node.data as unknown as Record<string, unknown>;
    const runPerItem = dataRecord.runPerItem !== false;
    const executor = executors[node.type] as Executor | undefined;

    let output: unknown[] = [];
    try {
      if (!executor) {
        output = input;
      } else if (runPerItem) {
        for (const item of input) {
          const config = resolveConfig(dataRecord, item, input);
          const res = await executor({ node, config, input: [item] });
          output.push(...res);
        }
      } else {
        const config = resolveConfig(dataRecord, input[0] || {}, input);
        output = await executor({ node, config, input });
      }
      outputMap[nodeId] = output;
      setOutputForNode(nodeId, output);
      setNodeStatus(nodeId, 'success');
    } catch (err) {
      setNodeError(nodeId, String(err));
      setNodeStatus(nodeId, 'failed');
      setOutputForNode(nodeId, []);
      // mark remaining nodes as idle
      const remaining = order.slice(order.indexOf(nodeId) + 1);
      for (const r of remaining) setNodeStatus(r, 'idle');
      break;
    }
  }

  // any nodes not run yet should be marked idle
  const finalStatus = useWorkflowStore.getState().nodeStatus;
  for (const n of nodes) {
    if (!outputMap[n.id] && finalStatus[n.id] === 'pending') {
      setNodeStatus(n.id, 'idle');
    }
  }
}

export async function runNode(nodeId: string): Promise<void> {
  const state = useWorkflowStore.getState();
  const node = state.nodes.find((n) => n.id === nodeId);
  if (!node) return;
  const {
    setInputForNode,
    setOutputForNode,
    setNodeError,
    setNodeStatus,
  } = useWorkflowStore.getState();
  const input = state.inputByNode[nodeId] || [];
  setNodeStatus(nodeId, 'pending');
  setNodeError(nodeId, null);

  const dataRecord = node.data as Record<string, unknown>;
  const runPerItem = dataRecord.runPerItem !== false;
  const executor = executors[node.type] as Executor | undefined;

  setInputForNode(nodeId, input);

  let output: unknown[] = [];
  try {
    if (!executor) {
      output = input;
    } else if (runPerItem) {
      for (const item of input) {
        const config = resolveConfig(dataRecord, item, input);
        const res = await executor({ node, config, input: [item] });
        output.push(...res);
      }
    } else {
      const config = resolveConfig(dataRecord, input[0] || {}, input);
      output = await executor({ node, config, input });
    }
    setOutputForNode(nodeId, output);
    setNodeStatus(nodeId, 'success');
  } catch (err) {
    setOutputForNode(nodeId, []);
    setNodeError(nodeId, String(err));
    setNodeStatus(nodeId, 'failed');
  }
}
