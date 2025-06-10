import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { WorkflowNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';
import { FiGlobe, FiClock, FiSliders, FiGitBranch, FiLink } from 'react-icons/fi';

function BaseNode({ id, data }: NodeProps<WorkflowNodeData>) {
  const openSidebar = useWorkflowStore((state) => state.openSidebar);
  const setPendingConnection = useWorkflowStore((state) => state.setPendingConnection);

  const IconMap = {
    httpRequest: FiGlobe,
    delay: FiClock,
    setVariable: FiSliders,
    condition: FiGitBranch,
    webhook: FiLink,
  } as const;

  const Icon = IconMap[data.type];

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingConnection({ source: id, sourceHandle: null });
    openSidebar();
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 shadow">
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-4 !rounded-none" />
      <div className="flex flex-col items-center">
        <Icon className="w-6 h-6 text-primary-500" />
        <div className="text-xs mt-1 text-gray-800 dark:text-gray-100">{data.label}</div>
      </div>
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex items-center">
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3"
          onDoubleClick={onAdd}
        />
        <button
          onClick={onAdd}
          className="ml-1 w-4 h-4 flex items-center justify-center text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 rounded"
          aria-label="Add node"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default memo(BaseNode); 