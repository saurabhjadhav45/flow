import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';
import type { EdgeProps } from 'reactflow';
import { Plus, Trash2 } from 'lucide-react';
import type { WorkflowEdgeData } from '../../types/workflow';

export function ButtonEdge({ id, data, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, style }: EdgeProps<WorkflowEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    data?.onAddEdgeClick?.();
  };

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    data?.onDeleteEdgeClick?.();
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{ position: 'absolute', transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }}
          className="flex items-center gap-1 bg-background rounded-md px-1"
        >
          <button
            onClick={onAdd}
            className="w-5 h-5 flex items-center justify-center border border-red-500 text-red-500 rounded"
            aria-label="add node"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="w-5 h-5 flex items-center justify-center border border-gray-400 text-gray-400 rounded"
            aria-label="delete edge"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default ButtonEdge;
