import React, { useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import {
  FiGlobe,
  FiPlus,
  FiTrash2
} from "react-icons/fi";
import { useWorkflowStore } from "../../store/workflowStore";
import NodeResult from "./NodeResult";

export default function HttpRequestNode({ id, data, selected}: NodeProps) {
  const [darkMode, setDarkMode] = React.useState(false);

  const method = data.method || 'GET';

  const colors = {
    background: darkMode ? "#1e2235" : "#fff",
    border: darkMode ? "#fff" : "#C1C1C1",
    shadow: darkMode
      ? "0 1px 4px rgba(0,0,0,0.5)"
      : "0 1px 4px rgba(0,0,0,0.1)",
    text: darkMode ? "#fff" : "#333",
  };
  const borderColor =
    status === 'error'
      ? '#f87171'
      : status === 'success'
      ? '#4ade80'
      : status === 'pending'
      ? '#facc15'
      : colors.border;

  const edges = useWorkflowStore((state) => state.edges);
  const status = useWorkflowStore((s) => s.nodeStatus[id]);
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
    const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };
  const draggingNodeId = useWorkflowStore((state) => state.draggingNodeId);
  const showPlus = !hasOutgoing && draggingNodeId !== id;
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className={``}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      <div className='d-none bg-[#fff] bg-[#1e2235]'></div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-600"
      />
      <div className={`flex items-center p-4 shadow-lg rounded-sm border-1 bg-[${colors.background}] ${selected ? 'custom-shadow':''}`} style={{ position: 'relative', border: `2px solid ${borderColor}` }}>
        <FiGlobe className="w-6 h-6 text-blue-600" />
        {hovered && (
          <FiTrash2
            onClick={e => { e.stopPropagation(); onDelete(e); }}
            style={{
              position: 'absolute',
              top: 3,
              right: 2,
              cursor: 'pointer',
              color: colors.text,
              fontSize: 10,
              zIndex: 10,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: 0,
            }}
            title="Delete node"
            tabIndex={0}
          />
        )}
      </div>
      <div className="flex-1 absolute bottom-0 translate-y-[calc(100%+4px)] text-center w-full">
          <div className="font-medium text-[8px]">{data.label}</div>
          {data.description && (
            <div className="text-[6px] text-gray-500 whitespace-pre-wrap">
              {data.description}
            </div>
          )}
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
          <NodeResult id={id} />
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