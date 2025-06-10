import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { WorkflowNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';

function BaseNode({ id, data }: NodeProps<WorkflowNodeData>) {
  const openSidebar = useWorkflowStore((state) => state.openSidebar);
  const setPendingConnection = useWorkflowStore((state) => state.setPendingConnection);

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingConnection({ source: id, sourceHandle: null });
    openSidebar();
  };

  return (
    <div className="relative flex items-center px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-4 !rounded-none"
      />
      <div className="flex items-center flex-1">
        <div className="rounded-full w-3 h-3 bg-primary-500 mr-2" />
        <div className="font-medium">{data.label}</div>
      </div>
      <div className="flex items-center">
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3"
          onDoubleClick={onAdd}
        />
        <button
          onClick={onAdd}
          className="ml-1 w-4 h-4 flex items-center justify-center text-xs bg-gray-200 rounded"
          aria-label="Add node"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default memo(BaseNode); 