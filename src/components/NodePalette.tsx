import type { NodeType } from '../types/workflow';

interface NodeTypeItem {
  type: NodeType;
  label: string;
  description: string;
}

const nodeTypes: NodeTypeItem[] = [
  {
    type: 'httpRequest',
    label: 'HTTP Request',
    description: 'Make HTTP requests to external APIs',
  },
  {
    type: 'delay',
    label: 'Delay',
    description: 'Add a delay between steps',
  },
  {
    type: 'setVariable',
    label: 'Set Variable',
    description: 'Set or update workflow variables',
  },
  {
    type: 'condition',
    label: 'Condition',
    description: 'Add conditional logic to your workflow',
  },
  {
    type: 'webhook',
    label: 'Webhook',
    description: 'Trigger workflow from external events',
  },
];

function DraggableNode({ nodeType }: { nodeType: NodeTypeItem }) {
  return (
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.setData('application/reactflow', nodeType.type);
        e.dataTransfer.effectAllowed = 'move';
      }}
      className="p-4 mb-2 rounded-lg border cursor-move hover:bg-gray-50 transition-colors"
    >
      <h3 className="font-medium text-gray-900">{nodeType.label}</h3>
      <p className="text-sm text-gray-500">{nodeType.description}</p>
    </div>
  );
}

export function NodePalette() {
  return (
    <div className="w-64 h-full bg-white border-r p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Nodes</h2>
      <div className="space-y-2">
        {nodeTypes.map((nodeType) => (
          <DraggableNode key={nodeType.type} nodeType={nodeType} />
        ))}
      </div>
    </div>
  );
} 