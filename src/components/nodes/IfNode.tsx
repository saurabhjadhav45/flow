import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { WorkflowNodeData } from '../../types/workflow';
import { FiGitBranch, FiPlus } from 'react-icons/fi';
import { useWorkflowStore } from '../../store/workflowStore';

function IfNode({ id, data }: NodeProps<WorkflowNodeData>) {

  const edges = useWorkflowStore((state) => state.edges);
  const draggingNodeId = useWorkflowStore((state) => state.draggingNodeId);
  const openSidebar = useWorkflowStore((state) => state.openSidebar);
  const setPendingConnection = useWorkflowStore((state) => state.setPendingConnection);

  const hasOutgoingTrue = edges.some((e) => e.source === id && e.sourceHandle === 'true');
  const hasOutgoingFalse = edges.some((e) => e.source === id && e.sourceHandle === 'false');
  const showPlusTrue = !hasOutgoingTrue && draggingNodeId !== id;
  const showPlusFalse = !hasOutgoingFalse && draggingNodeId !== id;

  const onAdd = (handleId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingConnection({ source: id, sourceHandle: handleId });
    openSidebar();
  };


  return (
    <div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-600"
      />

      <div className="flex items-center p-4 shadow-lg rounded-sm border bg-white dark:bg-[#1e2235] border-gray-300 dark:border-white/20">
        <FiGitBranch className="w-6 h-6 text-blue-600" />
      </div>

      <div className="flex-1 absolute bottom-0 translate-y-[calc(100%+2px)] text-center w-full">
        <div className="font-medium text-[8px]">{data.label}</div>
      </div>

      <Handle
        type="source"
        id="true"
        position={Position.Right}
        style={{ top: '35%' }}
        className="w-2.5 h-2.5 rounded-full border-2 bg-white dark:bg-[#1e2235] border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-100 flex items-center justify-center absolute right-0 translate-x-1/2 -translate-y-1/2 top-[35%] text-[14px]"
      >
        {showPlusTrue && (
          <>
            <div className="absolute right-[30px] top-1/2 w-[30px] h-[2px] -translate-y-1/2 pointer-events-none bg-gray-300 dark:bg-white/20" />
            <FiPlus
              onClick={onAdd('true')}
              className="absolute right-[45px] top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-gray-300 dark:border-white/20 bg-white dark:bg-[#1e2235] text-gray-800 dark:text-gray-100 rounded p-[2px] cursor-pointer"
            />
          </>
        )}
      </Handle>

      <Handle
        type="source"
        id="false"
        position={Position.Right}
        style={{ top: '65%' }}
        className="w-2.5 h-2.5 rounded-full border-2 bg-white dark:bg-[#1e2235] border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-100 flex items-center justify-center absolute right-0 translate-x-1/2 -translate-y-1/2 top-[65%] text-[14px]"
      >
        {showPlusFalse && (
          <>
            <div className="absolute right-[30px] top-1/2 w-[30px] h-[2px] -translate-y-1/2 pointer-events-none bg-gray-300 dark:bg-white/20" />
            <FiPlus
              onClick={onAdd('false')}
              className="absolute right-[45px] top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-gray-300 dark:border-white/20 bg-white dark:bg-[#1e2235] text-gray-800 dark:text-gray-100 rounded p-[2px] cursor-pointer"
            />
          </>
        )}
      </Handle>
    </div>
  );
}

export default memo(IfNode);
