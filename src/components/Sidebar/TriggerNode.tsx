import { useNodesStore } from '../../store/nodes';

export default function TriggerNode({ id }: { id: string }) {
  const node = useNodesStore((s) => s.nodes.find((n) => n.id === id));
  const update = useNodesStore((s) => s.update);
  if (!node) return null;
  const cfg = node.config as Record<string, any>;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Webhook Path</label>
        <input
          className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cfg.path}
          onChange={(e)=>update(id,{path:e.target.value})}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Method</label>
        <select
          value={cfg.method}
          onChange={(e)=>update(id,{method:e.target.value})}
          className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {['GET','POST'].map(m=>(<option key={m} value={m}>{m}</option>))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Authentication</label>
        <select
          value={cfg.auth}
          onChange={(e)=>update(id,{auth:e.target.value})}
          className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {['None','Basic'].map(a=>(<option key={a} value={a}>{a}</option>))}
        </select>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2">Listen for Test Event</button>
    </div>
  );
}
