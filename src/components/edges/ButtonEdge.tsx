import { EdgeLabelRenderer, getBezierPath } from 'reactflow';
import type { EdgeProps } from 'reactflow';
import { Plus, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { WorkflowEdgeData } from '../../types/workflow';

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
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="flex items-center gap-0.5 bg-background rounded px-0.5 shadow"
          >
            <button
              onClick={onAdd}
              className="w-4 h-4 flex items-center justify-center border border-red-500 text-red-500 rounded"
              aria-label="add node"
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={onDelete}
              className="w-4 h-4 flex items-center justify-center border border-gray-400 text-gray-400 rounded"
              aria-label="delete edge"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default ButtonEdge;
