import { useNodesStore } from '../../store/nodes';

export default function MLModelNode({ id }: { id: string }) {
  const node = useNodesStore((s) => s.nodes.find((n) => n.id === id));
  const update = useNodesStore((s) => s.update);
  if (!node) return null;
  const cfg = node.config as Record<string, any>;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Model</label>
        <select
          value={cfg.model}
          onChange={(e) => update(id, { model: e.target.value })}
          className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {['Cashflow Score','Fraud Model'].map(m=>(<option key={m} value={m}>{m}</option>))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Threshold</label>
        <input
          type="range"
          min="0"
          max="100"
          value={cfg.threshold}
          onChange={(e) => update(id, { threshold: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="text-sm text-gray-500">{cfg.threshold}</div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Mock Data</label>
        <input
          type="checkbox"
          className="w-4 h-4 ml-2"
          checked={cfg.mock || false}
          onChange={(e)=>update(id,{mock:e.target.checked})}
        />
      </div>
      <div className="p-3 mt-2 border border-gray-200 rounded-md font-mono text-sm bg-gray-50">
        Output: score preview
      </div>
    </div>
  );
}
