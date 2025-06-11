import { EdgeLabelRenderer, getBezierPath } from 'reactflow';
import type { EdgeProps } from 'reactflow';
import { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';

const foreignObjectSize = 40;

export default function EdgeControls({
  id,
  source,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  selected,
  sourceHandleId,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [hovered, setHovered] = useState(false);
  const deleteEdge = useWorkflowStore((state) => state.deleteEdge);
  const openSidebar = useWorkflowStore((state) => state.openSidebar);
  const setPendingConnection = useWorkflowStore(
    (state) => state.setPendingConnection,
  );

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteEdge(id);
  };

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingConnection({
      source,
      sourceHandle: sourceHandleId ?? null,
    });
    openSidebar();
  };

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {(hovered || selected) && (
        <EdgeLabelRenderer>
          <foreignObject
            width={foreignObjectSize}
            height={20}
            x={labelX - foreignObjectSize / 2}
            y={labelY - 10}
            requiredExtensions="http://www.w3.org/1999/xhtml"
          >
            <div className="flex gap-1 bg-white dark:bg-gray-800 rounded shadow px-1">
              <button onClick={onAdd} className="btn-icon text-xs p-0.5" aria-label="Add edge">
                +
              </button>
              <button onClick={onDelete} className="btn-icon text-xs p-0.5" aria-label="Delete edge">
                ×
              </button>
            </div>
          </foreignObject>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
