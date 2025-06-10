import type { NodeType } from '../types/workflow';
import { useWorkflowStore } from '../store/workflowStore';

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
  const sidebarOpen = useWorkflowStore((state) => state.sidebarOpen);
  const closeSidebar = useWorkflowStore((state) => state.closeSidebar);

  return (
    <div
      className={`fixed top-14 bottom-0 left-0 w-64 bg-white border-r p-4 overflow-y-auto transform transition-transform duration-300 z-10 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <button
        onClick={closeSidebar}
        className="absolute top-2 right-2 text-gray-500"
        aria-label="Close sidebar"
      >
        ×
      </button>
      <h2 className="text-lg font-semibold mb-4">Nodes</h2>
      <div className="space-y-2">
        {nodeTypes.map((nodeType) => (
          <DraggableNode key={nodeType.type} nodeType={nodeType} />
        ))}
      </div>
    </div>
  );
}
