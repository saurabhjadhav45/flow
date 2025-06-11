import { EdgeLabelRenderer, getBezierPath } from "reactflow";
import type { EdgeProps } from "reactflow";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import type { WorkflowEdgeData } from "../../types/workflow";

export function ButtonEdge({
  id,
  data,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  selected,
  style,
}: EdgeProps<WorkflowEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [hovered, setHovered] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    data?.onAddEdgeClick?.();
  };

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    data?.onDeleteEdgeClick?.();
  };

  const handleMouseEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => setHovered(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {(hovered || selected) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="flex items-center gap-0.5 bg-background"
          >
            <button
              onClick={onAdd}
              aria-label="Add node"
              title="Add node"
              style={{
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: 4,
                padding: 2,
                background: "#1E2235",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              <FiPlus size={5} />
            </button>

            {/* trash button */}
            <button
              onClick={onDelete}
              aria-label="Delete edge"
              title="Delete edge"
              className=" flex items-center justify-center "
              style={{
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: 4,
                padding: 2,
                background: "#1E2235",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              <FiTrash2 size={5} />
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default ButtonEdge;
