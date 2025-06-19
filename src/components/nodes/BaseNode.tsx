import React, { memo, useState } from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import type { WorkflowNodeData } from "../../types/workflow";
import { useWorkflowStore } from "../../store/workflowStore";
import NodeResult from "./NodeResult";
import {
  FiGlobe,
  FiClock,
  FiSliders,
  FiGitBranch,
  FiLink,
  FiCode,
  FiGitMerge,
  FiCpu,
  FiMail,
  FiGrid,
  FiTrash2,
} from "react-icons/fi";

function BaseNode({ id, data }: NodeProps<WorkflowNodeData>) {
  const openSidebar = useWorkflowStore((state) => state.openSidebar);
  const setPendingConnection = useWorkflowStore(
    (state) => state.setPendingConnection
  );
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const status = useWorkflowStore((s) => s.nodeStatus[id]);
  const [hovered, setHovered] = useState(false);

  const borderColor =
    status === 'error'
      ? '#f87171'
      : status === 'success'
      ? '#4ade80'
      : status === 'pending'
      ? '#facc15'
      : '#D1D5DB';

  const IconMap = {
    httpRequest: FiGlobe,
    delay: FiClock,
    // setVariable: FiSliders,
    // condition: FiGitBranch,
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

  const Icon = IconMap[data.type];

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingConnection({ source: id, sourceHandle: null });
    openSidebar();
  };

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative" }}
    >
      <div
        className="relative bg-white dark:bg-gray-800 border rounded-md px-3 py-2 shadow"
        style={{ position: 'relative', border: `2px solid ${borderColor}` }}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="w-2 h-4 !rounded-none"
        />
        <Icon className="w-6 h-6 text-primary-500" />
        {hovered && (
          <FiTrash2
            onClick={(e) => {
              e.stopPropagation();
              deleteNode(id);
            }}
            style={{
              position: "absolute",
              top: 3,
              right: 2,
              cursor: "pointer",
              color: "#333",
              fontSize: 10,
              zIndex: 10,
              background: "transparent",
              border: "none",
              outline: "none",
              padding: 0,
            }}
            title="Delete node"
            tabIndex={0}
          />
        )}
        <div className="absolute -right-2 top-1/2 -translate-y-1/2">
          <Handle
            type="source"
            position={Position.Right}
            className="w-3 h-3"
            onDoubleClick={onAdd}
          />
        </div>
      </div>
      <div className="text-xs mt-1 text-gray-800 dark:text-gray-100 text-center">
        {data.label}
        <NodeResult id={id} />
      </div>
    </div>
  );
}

export default memo(BaseNode);
