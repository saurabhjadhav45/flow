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
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-primary-500 mr-2" />
        <div className="font-medium">{data.label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3"
        onDoubleClick={onAdd}
      />
    </div>
  );
}

export default memo(BaseNode); 