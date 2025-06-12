import React, { useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import {
  FiGlobe,
  FiPlus,
} from "react-icons/fi";
import { useWorkflowStore } from "../../store/workflowStore";

export default function HttpRequestNode({ id, data, selected }: NodeProps) {
  const[darkMode, setDarkMode] = React.useState(false);
  const methodColors = {
    GET: 'bg-green-500',
    POST: 'bg-blue-500',
    PUT: 'bg-yellow-500',
    DELETE: 'bg-red-500',
    PATCH: 'bg-purple-500',
  };

  const method = data.method || 'GET';

    const colors = {
    background: darkMode ? "#1e2235" : "#fff",
    border: darkMode ? "rgba(255,255,255,0.2)" : "#C1C1C1",
    shadow: darkMode
      ? "0 1px 4px rgba(0,0,0,0.5)"
      : "0 1px 4px rgba(0,0,0,0.1)",
    text: darkMode ? "#FFFFFF" : "#333333",
  };

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
  useEffect(() => {
    let darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false
    setDarkMode(darkMode);
  }, []);

  return (
    <div className={``}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-600"
      />
      
      <div className={`flex items-center p-4 shadow-lg rounded-sm border-1 bg-[${colors.background}]`}>
        <FiGlobe className="w-6 h-6 text-blue-600" />
      </div>
      <div className="flex-1 absolute bottom-0 translate-y-[calc(100%+2px)] text-center w-full">
          <div className="font-medium text-[8px]">HTTP Request</div>
          <div className="flex justify-center">
            <span className={`text-[6px]`}>
              {method}:&nbsp;
            </span>
            {data.url && (
              <span className="text-[6px] truncate max-w-[120px] tracking-[0.5px]" title={data.url}>
                {data.url}
              </span>
            )}
          </div>
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