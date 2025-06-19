import { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { runNode } from '../../nodes/executors';
import JsonViewer from '../JsonViewer';

export default function NodeResult({ id }: { id: string }) {
  const nodes = useWorkflowStore((s) => s.nodes);
  const input = useWorkflowStore((s) => s.nodeInputs[id]);
  const result = useWorkflowStore((s) => s.nodeResults[id]);
  const error = useWorkflowStore((s) => s.errorResults[id]);
  const setNodeResult = useWorkflowStore((s) => s.setNodeResult);
  const setNodeError = useWorkflowStore((s) => s.setNodeError);
  const setNodeStatus = useWorkflowStore((s) => s.setNodeStatus);
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    const node = nodes.find((n) => n.id === id);
    if (!node || input === undefined) return;
    setRunning(true);
    setNodeStatus(id, 'pending');
    try {
      const output = await runNode(node.type, node.data, input);
      setNodeResult(id, output);
      setNodeStatus(id, 'success');
    } catch (err) {
      setNodeError(id, err instanceof Error ? err.message : String(err));
      setNodeStatus(id, 'error');
    } finally {
      setRunning(false);
    }
  };

  if (running) {
    return <div className="text-[6px] text-yellow-600 mt-1">Running...</div>;
  }

  if (error) {
    return (
      <div className="text-[6px] text-red-500 mt-1 max-w-[120px] truncate" title={String(error)}>
        {String(error)}
      </div>
    );
  }

  if (result !== undefined) {
    return (
      <div className="text-[6px] text-green-600 mt-1 max-w-[120px]">
        <button onClick={handleRun} className="underline mr-1">
          run
        </button>
        <JsonViewer data={result} />
      </div>
    );
  }

  if (input !== undefined) {
    return (
      <div className="text-[6px] text-gray-500 mt-1">
        <button onClick={handleRun} className="underline mr-1">run</button>
        <JsonViewer data={input} />
      </div>
    );
  }

  return null;
}
