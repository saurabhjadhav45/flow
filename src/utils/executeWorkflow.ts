import type { WorkflowEdge, WorkflowNode, NodeType, Item } from '../types/workflow';

function topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] {
  const indegree = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of nodes) {
    indegree.set(n.id, 0);
    adj.set(n.id, []);
  }
  for (const e of edges) {
    if (!indegree.has(e.target)) continue;
    indegree.set(e.target, (indegree.get(e.target) || 0) + 1);
    const list = adj.get(e.source);
    if (list) list.push(e.target);
  }
  const queue: string[] = [];
  for (const [id, deg] of indegree.entries()) {
    if (deg === 0) queue.push(id);
  }
  const sorted: WorkflowNode[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    const node = nodes.find((n) => n.id === id);
    if (node) sorted.push(node);
    for (const next of adj.get(id) || []) {
      indegree.set(next, (indegree.get(next) || 0) - 1);
      if (indegree.get(next) === 0) queue.push(next);
    }
  }
  if (sorted.length !== nodes.length) {
    throw new Error('Graph has cycles');
  }
  return sorted;
}

function getInputsForNode(
  node: WorkflowNode,
  edges: WorkflowEdge[],
  results: Record<string, Item[]>
) {
  const incoming = edges.filter((e) => e.target === node.id);
  const items: Item[] = [];
  for (const edge of incoming) {
    const arr = results[edge.source];
    if (Array.isArray(arr)) items.push(...arr);
  }
  return items;
}

export async function executeWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  getNodeConfig: (node: WorkflowNode) => any,
  runNode: (type: NodeType, config: any, input: Item[]) => Promise<Item[]>,
  setNodeResult: (id: string, result: Item[]) => void,
  setNodeError: (id: string, error: any) => void,
  setNodeInput: (id: string, input: Item[]) => void,
  setNodeStatus: (id: string, status: 'pending' | 'success' | 'error') => void
) {
  const sorted = topologicalSort(nodes, edges);
  const results: Record<string, Item[]> = {};
  for (const node of sorted) {
    const input = getInputsForNode(node, edges, results);
    setNodeInput(node.id, input);
    setNodeStatus(node.id, 'pending');
    const config = getNodeConfig(node);
    try {
      const output = await runNode(node.type, config, input);
      results[node.id] = output;
      setNodeResult(node.id, output);
      setNodeStatus(node.id, 'success');
    } catch (err) {
      setNodeError(node.id, err instanceof Error ? err.message : String(err));
      setNodeStatus(node.id, 'error');
      break;
    }
  }
  return results;
}

export { topologicalSort, getInputsForNode };
