import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { FiChevronDown, FiTrash } from 'react-icons/fi';

export type NodeKind =
  | 'Webhook'
  | 'API'
  | 'ML'
  | 'Decision'
  | 'Action'
  | 'Trigger';

interface SidebarPanelProps {
  nodeType: NodeKind;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function SidebarPanel({ nodeType }: SidebarPanelProps) {
  const [activeTab, setActiveTab] = useState<'Parameters' | 'Settings' | 'Docs'>('Parameters');
  const [sendBody, setSendBody] = useState(false);

  const renderParameters = () => {
    switch (nodeType) {
      case 'Webhook':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Test URL</label>
              <input
                className="w-full h-8 px-3 border border-gray-300 rounded"
                placeholder="https://example.com/test"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Production URL</label>
              <input
                className="w-full h-8 px-3 border border-gray-300 rounded"
                placeholder="https://example.com/prod"
              />
            </div>
            <div>
              <label className="text-sm font-medium">HTTP Method</label>
              <select className="w-full h-8 px-3 border border-gray-300 rounded">
                {['GET', 'POST', 'PUT', 'DELETE'].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Path</label>
              <input
                className="w-full h-8 px-3 border border-gray-300 rounded"
                placeholder="/api/webhook"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Respond</label>
              <select className="w-full h-8 px-3 border border-gray-300 rounded">
                <option>Immediately</option>
                <option>After Workflow</option>
              </select>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
              Listen for test event
            </button>
          </div>
        );
      case 'API':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">HTTP Method</label>
              <select className="w-full h-8 px-3 border border-gray-300 rounded">
                {['GET', 'POST', 'PUT', 'DELETE'].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-1">
                URL <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full h-8 px-3 border border-gray-300 rounded"
                placeholder="https://api.example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Authentication</label>
              <select className="w-full h-8 px-3 border border-gray-300 rounded">
                <option>None</option>
                <option>Basic</option>
                <option>Bearer</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600"
                checked={sendBody}
                onChange={(e) => setSendBody(e.target.checked)}
              />
              <label className="text-sm">Send Body</label>
            </div>
            {sendBody && (
              <Disclosure defaultOpen>
                {({ open }) => (
                  <div>
                    <Disclosure.Button className="flex justify-between w-full px-2 py-1 border rounded-md">
                      <span className="text-sm font-semibold">Body</span>
                      <FiChevronDown className={classNames('w-4 h-4 transition-transform', open ? 'rotate-180' : '')} />
                    </Disclosure.Button>
                    <Disclosure.Panel className="border border-gray-200 rounded-md p-3 mt-2">
                      <select className="w-full h-8 px-3 border border-gray-300 rounded mb-2">
                        <option>JSON</option>
                        <option>Form</option>
                        <option>Raw</option>
                      </select>
                      <textarea className="w-full h-24 px-3 py-2 border border-gray-300 rounded" />
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>
            )}
          </div>
        );
      case 'ML':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Model</label>
              <select className="w-full h-8 px-3 border border-gray-300 rounded">
                <option>Fraud Model</option>
                <option>Churn Model</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Input Mapping</label>
              <textarea className="w-full h-24 px-3 py-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="text-sm font-medium">Threshold</label>
              <input type="range" className="w-full" />
            </div>
          </div>
        );
      case 'Decision':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Data Type</label>
              <input className="w-full h-8 px-3 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="text-sm font-medium">Condition</label>
              <input className="w-full h-8 px-3 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="text-sm font-medium">Comparison</label>
              <select className="w-full h-8 px-3 border border-gray-300 rounded">
                <option>=</option>
                <option>&gt;</option>
                <option>&lt;</option>
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Add Condition</button>
          </div>
        );
      case 'Action':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">To</label>
              <input className="w-full h-8 px-3 border border-gray-300 rounded" placeholder="email@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <input className="w-full h-8 px-3 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="text-sm font-medium">Body</label>
              <textarea className="w-full h-24 px-3 py-2 border border-gray-300 rounded" />
            </div>
          </div>
        );
      case 'Trigger':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Test URL</label>
              <input className="w-full h-8 px-3 border border-gray-300 rounded" value="https://example.com/test" readOnly />
            </div>
            <div>
              <label className="text-sm font-medium">Prod URL</label>
              <input className="w-full h-8 px-3 border border-gray-300 rounded" value="https://example.com/prod" readOnly />
            </div>
            <div>
              <label className="text-sm font-medium">Path</label>
              <input className="w-full h-8 px-3 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="text-sm font-medium">Method</label>
              <select className="w-full h-8 px-3 border border-gray-300 rounded">
                {['GET', 'POST'].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">Listen for test event</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-80 md:w-96 bg-white dark:bg-gray-800 shadow-md rounded-md p-5 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{nodeType} Node</h2>
        <button className="text-gray-500 hover:text-red-600">
          <FiTrash className="w-5 h-5" />
        </button>
      </div>
      <div className="flex space-x-4 text-xs uppercase border-b">
        {['Parameters', 'Settings', 'Docs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={classNames(
              'pb-2',
              activeTab === tab ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500',
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === 'Parameters' && renderParameters()}
      {activeTab === 'Docs' && (
        <div className="text-sm text-gray-500">Documentation coming soon…</div>
      )}
      {activeTab === 'Settings' && (
        <div className="text-sm text-gray-500">No settings available.</div>
      )}
      <div className="flex space-x-2 pt-4 border-t mt-auto">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Save</button>
        <button className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md">Test</button>
        <button className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md">Cancel</button>
      </div>
    </div>
  );
}

export default SidebarPanel;
