import { useNodesStore } from '../../store/nodes';
import type { ActionConfig } from '../../types/nodes';

export default function ActionNode({ id }: { id: string }) {
  const node = useNodesStore((s) => s.nodes.find((n) => n.id === id));
  const update = useNodesStore((s) => s.update);
  if (!node) return null;
  const cfg = node.config as ActionConfig;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">To / Assignee</label>
        <input
          className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cfg.to}
          onChange={(e)=>update(id,{to:e.target.value})}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject</label>
        <input
          className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cfg.subject}
          onChange={(e)=>update(id,{subject:e.target.value})}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Body</label>
        <textarea
          className="w-full h-24 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cfg.body}
          onChange={(e)=>update(id,{body:e.target.value})}
        />
      </div>
    </div>
  );
}
