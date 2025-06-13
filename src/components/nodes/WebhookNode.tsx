import { memo } from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import { FiLink, FiPlus, FiZap } from "react-icons/fi";
import type { WorkflowNodeData } from "../../types/workflow";
import { useWorkflowStore } from "../../store/workflowStore";

function WebhookNode({ id, data }: NodeProps<WorkflowNodeData>) {
  const isListening = (data as { isListening?: boolean })?.isListening;


  const edges = useWorkflowStore((state) => state.edges);
  const draggingNodeId = useWorkflowStore((state) => state.draggingNodeId);
  const openSidebar = useWorkflowStore((state) => state.openSidebar);
  const setPendingConnection = useWorkflowStore(
    (state) => state.setPendingConnection
  );
  const hasOutgoing = edges.some((e) => e.source === id);
  const showPlus = !hasOutgoing && draggingNodeId !== id;
  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingConnection({ source: id, sourceHandle: "out" });
    openSidebar();
  };


  return (
    <div>
      <div
        className="flex items-center p-4 shadow-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-r-sm rounded-l-3xl"
      >
        <FiLink className="w-6 h-6 text-blue-600" />
        {isListening && (
          <FiZap className="w-3 h-3 text-orange-500 absolute -right-1 -top-1" />
        )}
      </div>
      <div className="flex-1 absolute bottom-0 translate-y-[calc(100%+2px)] text-center w-full">
        <div className="font-medium text-[8px]">Webhook</div>
      </div>

      <Handle
        type="source"
        id="out"
        position={Position.Right}
        className="w-2.5 h-2.5 rounded-full border-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 flex items-center justify-center absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-[14px]"
      >
        {showPlus && (
          <>
            <div className="absolute right-[30px] top-1/2 w-[30px] h-[2px] -translate-y-1/2 pointer-events-none bg-gray-300 dark:bg-gray-600" />
            <FiPlus
              onClick={onAdd}
              className="absolute right-[45px] top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-[2px] cursor-pointer"
            />
          </>
        )}
      </Handle>
    </div>
  );
}

export default memo(WebhookNode);
