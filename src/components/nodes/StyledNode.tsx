import React, { useEffect, memo } from "react";
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
} from "react-icons/fi";
import { useWorkflowStore } from "../../store/workflowStore";

interface StyledNodeProps extends NodeProps<WorkflowNodeData> {
  darkMode?: boolean;
}

function StyledNode({ id, data, darkMode = false }: StyledNodeProps) {
  const [isDark, setIsDark] = React.useState(darkMode);

  // Access the global edges to know if this node already has an outgoing
  // connection. The plus button is hidden whenever at least one edge starts
  // from this node.
  const edges = useWorkflowStore((state) => state.edges);
  const openSidebar = useWorkflowStore((state) => state.openSidebar);
  const setPendingConnection = useWorkflowStore(
    (state) => state.setPendingConnection
  );
  const hasOutgoing = edges.some((e) => e.source === id);
  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingConnection({ source: id, sourceHandle: "out" });
    openSidebar();
  };
  const colors = {
    background: isDark ? "#1e2235" : "#fff",
    border: isDark ? "rgba(255,255,255,0.2)" : "#C1C1C1",
    shadow: isDark
      ? "0 1px 4px rgba(0,0,0,0.5)"
      : "0 1px 4px rgba(0,0,0,0.1)",
    text: isDark ? "#FFFFFF" : "#333333",
  };

  useEffect(() => {
    if (!darkMode) {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
    }
  }, [darkMode]);

  const IconMap = {
    httpRequest: FiGlobe,
    delay: FiClock,
    setVariable: FiSliders,
    condition: FiGitBranch,
    webhook: FiLink,
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
        className={`flex items-center p-4 shadow-lg rounded-sm border-1 bg-[${colors.background}]`}
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
        {!hasOutgoing && (
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

export default memo(StyledNode);
