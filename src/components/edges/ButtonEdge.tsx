import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from 'shadcn/ui/button';

export function ButtonEdge({ id, data, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, style }: EdgeProps<Record<string, unknown>>): JSX.Element {
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
          <Button size="icon" variant="outline" className="border-red-500 text-red-500" onClick={onAdd}>
            <Plus className="w-3 h-3" />
          </Button>
          <Button size="icon" variant="outline" className="border-gray-400 text-gray-400" onClick={onDelete}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default ButtonEdge;
