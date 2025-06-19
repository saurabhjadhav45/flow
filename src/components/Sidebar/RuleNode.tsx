import { useNodesStore } from '../../store/nodes';

export default function RuleNode({ id }: { id: string }) {
  const node = useNodesStore((s) => s.nodes.find((n) => n.id === id));
  const update = useNodesStore((s) => s.update);
  if (!node) return null;
  const cfg = node.config as Record<string, any>;

  const types = ['String','Number','Date'];
  const ops = ['equals','contains','>','<'];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Data Type</label>
        <select
          value={cfg.dataType}
          onChange={(e)=>update(id,{dataType:e.target.value})}
          className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {types.map(t=>(<option key={t} value={t}>{t}</option>))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Operator</label>
        <select
          value={cfg.operator}
          onChange={(e)=>update(id,{operator:e.target.value})}
          className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ops.map(o=>(<option key={o} value={o}>{o}</option>))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Value</label>
        <input
          className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cfg.value}
          onChange={(e)=>update(id,{value:e.target.value})}
        />
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2">Validate</button>
    </div>
  );
}
