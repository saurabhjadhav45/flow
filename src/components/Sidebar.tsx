import { useState } from 'react';
import { useNodesStore } from '../store/nodes';
import IntegrationNode from './Sidebar/IntegrationNode';
import MLModelNode from './Sidebar/MLModelNode';
import RuleNode from './Sidebar/RuleNode';
import TriggerNode from './Sidebar/TriggerNode';
import ActionNode from './Sidebar/ActionNode';
import type { NodeType } from '../types/nodes';

const tabs = [
  { id: 'params', label: 'Parameters' },
  { id: 'settings', label: 'Settings' },
  { id: 'docs', label: 'Docs' },
];

function NodeContent({ id, type }: { id: string; type: NodeType }) {
  switch (type) {
    case 'integration':
      return <IntegrationNode id={id} />;
    case 'model':
      return <MLModelNode id={id} />;
    case 'rule':
      return <RuleNode id={id} />;
    case 'trigger':
      return <TriggerNode id={id} />;
    case 'action':
      return <ActionNode id={id} />;
    default:
      return null;
  }
}

export function Sidebar() {
  const selected = useNodesStore((s) => s.selected);
  const nodes = useNodesStore((s) => s.nodes);
  const select = useNodesStore((s) => s.select);
  const [activeTab, setActiveTab] = useState('params');
  const node = nodes.find((n) => n.id === selected);

  if (!node) return null;

  return (
    <div className="fixed top-14 bottom-0 right-0 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col space-y-4 z-20">
      <div className="flex space-x-4 border-b">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-2 ${activeTab === t.id ? 'text-red-600 border-red-600 border-b-2' : 'text-gray-500'}`}
          >
            {t.label}
          </button>
        ))}
        <button onClick={() => select(null)} className="ml-auto text-gray-500">×</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <NodeContent id={node.id} type={node.type} />
      </div>
    </div>
  );
}
