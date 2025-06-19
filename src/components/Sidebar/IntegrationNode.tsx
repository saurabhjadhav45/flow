import { Disclosure } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';
import { useNodesStore } from '../../store/nodes';

export default function IntegrationNode({ id }: { id: string }) {
  const node = useNodesStore((s) => s.nodes.find((n) => n.id === id));
  const update = useNodesStore((s) => s.update);
  if (!node) return null;
  const cfg = node.config as Record<string, any>;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">HTTP Method</label>
        <select
          value={cfg.method}
          onChange={(e) => update(id, { method: e.target.value })}
          className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {['GET','POST','PUT','DELETE'].map((m)=> (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">URL</label>
        <input
          className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cfg.url}
          placeholder="https://api.example.com"
          onChange={(e)=>update(id,{url:e.target.value})}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Authentication</label>
        <select
          value={cfg.auth}
          onChange={(e)=>update(id,{auth:e.target.value})}
          className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {['None','Basic','OAuth'].map(a=>(<option key={a} value={a}>{a}</option>))}
        </select>
      </div>
      <Disclosure>
        {({ open }) => (
          <div>
            <Disclosure.Button className="flex items-center justify-between w-full text-sm font-medium">
              Advanced
              <FiChevronDown className={`ml-2 ${open ? 'ui-open:rotate-180 ui-open:transform transition-transform' : ''}`} />
            </Disclosure.Button>
            <Disclosure.Panel className="p-3 mt-2 border border-gray-200 rounded-md space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Pagination</label>
                <input
                  className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={cfg.pagination || ''}
                  onChange={(e)=>update(id,{pagination:e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Batching</label>
                <input
                  className="w-full h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={cfg.batching || ''}
                  onChange={(e)=>update(id,{batching:e.target.value})}
                />
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
      <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2">
        Test Request
      </button>
    </div>
  );
}
