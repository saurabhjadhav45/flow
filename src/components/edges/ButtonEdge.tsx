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
            className="flex items-center gap-0.5"
          >
            <button
              onClick={onAdd}
              aria-label="Add node"
              title="Add node"
              className="btn-icon bg-gray-800 border border-white/20 text-white"
            >
              <FiPlus size={5} />
            </button>

            {/* trash button */}
            <button
              onClick={onDelete}
              aria-label="Delete edge"
              title="Delete edge"
              className="btn-icon bg-gray-800 border border-white/20 text-white flex items-center justify-center"
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
