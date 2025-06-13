import type { NodeType } from "../types/workflow";
import { useWorkflowStore } from "../store/workflowStore";
import {
  FiGlobe,
  FiClock,
  FiSliders,
  FiGitBranch,
  FiLink,
  FiCode,
  FiGitMerge,
  FiFilter,
  FiZap,
  FiList,
  FiMail,
  FiSettings,
} from "react-icons/fi";
import { SiAirtable } from "react-icons/si";
import type { IconType } from "react-icons";

interface NodeTypeItem {
  type: NodeType;
  label: string;
  description: string;
  Icon: IconType;
}

const nodeTypes: NodeTypeItem[] = [
  {
    type: "httpRequest",
    label: "HTTP Request",
    description: "Make HTTP requests to external APIs",
    Icon: FiGlobe,
  },
  {
    type: "delay",
    label: "Delay",
    description: "Add a delay between steps",
    Icon: FiClock,
  },
  // {
  //   type: 'setVariable',
  //   label: 'Set Variable',
  //   description: 'Set or update workflow variables',
  //   Icon: FiSliders,
  // },
  // {
  //   type: 'condition',
  //   label: 'Condition',
  //   description: 'Add conditional logic to your workflow',
  //   Icon: FiGitBranch,
  // },
  {
    type: "webhook",
    label: "Webhook",
    description: "Trigger workflow from external events",
    Icon: FiLink,
  },
  {
    type: "code",
    label: "Code",
    description: "Execute custom code snippets",
    Icon: FiCode,
  },
  {
    type: "set",
    label: "Set",
    description: "Assign values within the workflow",
    Icon: FiSettings,
  },
  {
    type: "merge",
    label: "Merge",
    description: "Combine multiple branches",
    Icon: FiGitMerge,
  },
  {
    type: "if",
    label: "If",
    description: "Conditional branching logic",
    Icon: FiFilter,
  },
  {
    type: "function",
    label: "Function",
    description: "Reusable workflow function",
    Icon: FiZap,
  },
  {
    type: "functionItem",
    label: "Function Item",
    description: "Step inside a function",
    Icon: FiList,
  },
  {
    type: "email",
    label: "Email",
    description: "Send an email message",
    Icon: FiMail,
  },
  {
    type: "airtable",
    label: "Airtable",
    description: "Interact with Airtable records",
    Icon: SiAirtable,
  },
];

function DraggableNode({ nodeType }: { nodeType: NodeTypeItem }) {
  const setNodeToAdd = useWorkflowStore((state) => state.setNodeToAdd);
  const pendingConnection = useWorkflowStore(
    (state) => state.pendingConnection
  );
  const closeSidebar = useWorkflowStore((state) => state.closeSidebar);

  const onClick = () => {
    if (!pendingConnection) {
      setNodeToAdd(nodeType.type);
      closeSidebar();
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/reactflow", nodeType.type);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={onClick}
      className="p-4 mb-2 rounded-lg border cursor-move hover:bg-gray-50 transition-colors flex items-center gap-2"
    >
      <nodeType.Icon className="w-5 h-5" />
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          {nodeType.label}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {nodeType.description}
        </p>
      </div>
    </div>
  );
}

export function NodePalette() {
  const sidebarOpen = useWorkflowStore((state) => state.sidebarOpen);
  const closeSidebar = useWorkflowStore((state) => state.closeSidebar);

  return (
    <div
      className={`fixed top-14 bottom-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto transform transition-transform duration-300 z-10 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        onClick={closeSidebar}
        className="btn-icon absolute top-2 right-2"
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
