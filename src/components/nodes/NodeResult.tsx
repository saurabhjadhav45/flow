import { useWorkflowStore } from '../../store/workflowStore';

export default function NodeResult({ id }: { id: string }) {
  const result = useWorkflowStore((s) => s.nodeResults[id]);
  const error = useWorkflowStore((s) => s.errorResults[id]);

  if (error) {
    return (
      <div className="text-[6px] text-red-500 mt-1 max-w-[120px] truncate" title={String(error)}>
        {String(error)}
      </div>
    );
  }

  if (result !== undefined) {
    const text = typeof result === 'string' ? result : JSON.stringify(result);
    return (
      <div className="text-[6px] text-green-600 mt-1 max-w-[120px] truncate" title={text}>
        {text}
      </div>
    );
  }
  return null;
}
