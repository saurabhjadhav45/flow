import React, { useEffect, memo } from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import { FiLink, FiPlus, FiZap, FiTrash2 } from "react-icons/fi";
import type { WorkflowNodeData } from "../../types/workflow";
import { useWorkflowStore } from "../../store/workflowStore";

function WebhookNode({ id, data }: NodeProps<WorkflowNodeData>) {
  const [darkMode, setDarkMode] = React.useState(false);
  const isListening = (data as { isListening?: boolean })?.isListening;

  const colors = {
    background: darkMode ? "#1e2235" : "#fff",
    border: darkMode ? "rgba(255,255,255,0.2)" : "#C1C1C1",
    shadow: darkMode
      ? "0 1px 4px rgba(0,0,0,0.5)"
      : "0 1px 4px rgba(0,0,0,0.1)",
    text: darkMode ? "#FFFFFF" : "#333333",
  };

  const edges = useWorkflowStore((state) => state.edges);
  const draggingNodeId = useWorkflowStore((state) => state.draggingNodeId);
  const openSidebar = useWorkflowStore((state) => state.openSidebar);
  const setPendingConnection = useWorkflowStore(
    (state) => state.setPendingConnection
  );
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const [hovered, setHovered] = React.useState(false);
  const hasOutgoing = edges.some((e) => e.source === id);
  const showPlus = !hasOutgoing && draggingNodeId !== id;
  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingConnection({ source: id, sourceHandle: "out" });
    openSidebar();
  };

  useEffect(() => {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
  }, []);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative" }}
    >
      <div
        className={`flex items-center p-4 shadow-lg border-1 bg-[${colors.background}] rounded-r-sm rounded-l-3xl`}
        style={{ position: "relative" }}
      >
        <FiLink className="w-6 h-6 text-blue-600" />
        {isListening && (
          <FiZap className="w-3 h-3 text-orange-500 absolute -right-1 -top-1" />
        )}
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
              color: colors.text,
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
      </div>
      <div className="flex-1 absolute bottom-0 translate-y-[calc(100%+2px)] text-center w-full">
        <div className="font-medium text-[8px]">Webhook</div>
      </div>

      <Handle
        type="source"
        id="out"
        position={Position.Right}
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          border: `2px solid ${colors.border}`,
          background: colors.background,
          right: 0,
          top: "50%",
          transform: "translate(50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: colors.text,
          fontSize: 14,
        }}
      >
        {showPlus && (
          <>
            <div
              style={{
                position: "absolute",
                right: -30,
                top: "50%",
                width: 30,
                height: 2,
                background: colors.border,
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
            <FiPlus
              onClick={onAdd}
              style={{
                position: "absolute",
                right: -45,
                top: "50%",
                transform: "translateY(-50%)",
                width: 20,
                height: 20,
                border: `2px solid ${colors.border}`,
                borderRadius: 4,
                padding: 2,
                background: colors.background,
                color: colors.text,
                cursor: "pointer",
              }}
            />
          </>
        )}
      </Handle>
    </div>
  );
}

export default memo(WebhookNode);
