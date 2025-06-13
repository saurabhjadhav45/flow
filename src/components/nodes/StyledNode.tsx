import { memo } from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import type { WorkflowNodeData } from "../../types/workflow";
import {
  FiGlobe,
  FiClock,
  FiSliders,
  FiGitBranch,
  FiLink,
  FiPlus,
  FiCode,
  FiGitMerge,
  FiCpu,
  FiMail,
  FiGrid,
} from "react-icons/fi";
import { useWorkflowStore } from "../../store/workflowStore";

function StyledNode({ id, data }: NodeProps<WorkflowNodeData>) {

  // Access the global edges to know if this node already has an outgoing
  // connection. The plus button is hidden whenever at least one edge starts
  // from this node.
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

  const IconMap = {
    httpRequest: FiGlobe,
    delay: FiClock,
    setVariable: FiSliders,
    condition: FiGitBranch,
    webhook: FiLink,
    code: FiCode,
    set: FiSliders,
    merge: FiGitMerge,
    if: FiGitBranch,
    function: FiCpu,
    functionItem: FiCpu,
    email: FiMail,
    airtable: FiGrid,
  } as const;

  const Icon = IconMap[data.type] ?? FiGlobe;

  return (
    <div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-600"
      />

      <div
        className="flex items-center p-4 shadow-lg rounded-sm border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
      >
        <Icon className="w-6 h-6 text-blue-600" />
      </div>

      <div className="flex-1 absolute bottom-0 translate-y-[calc(100%+2px)] text-center w-full">
        <div className="font-medium text-[8px]">{data.label}</div>
      </div>

      {/*
        The single output handle acts as the true connection point. The plus
        button is visually offset from the handle with a short line connecting
        them. When clicked, the button opens the sidebar and starts a pending
        connection from this handle. Once an outgoing edge exists the entire
        plus UI (icon and connecting line) is hidden.
      */}
      <Handle
        type="source"
        id="out"
        position={Position.Right}
        className="w-2.5 h-2.5 rounded-full border-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 flex items-center justify-center absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-[14px]"
      >
        {showPlus && (
          <>
            <div
              className="absolute right-[30px] top-1/2 w-[30px] h-[2px] -translate-y-1/2 pointer-events-none bg-gray-300 dark:bg-gray-600"
            />
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

export default memo(StyledNode);
