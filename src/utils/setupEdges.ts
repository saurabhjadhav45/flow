import type { WorkflowEdge } from '../types/workflow';
import { MarkerType } from 'reactflow';

export interface EdgeHandlers {
  onAdd: (info: {
    source: string;
    sourceHandle: string | null;
    target: string;
    edgeId: string;
  }) => void;
  onDelete: (id: string) => void;
}

export function setupEdges(
  edges: WorkflowEdge[],
  handlers: EdgeHandlers
): WorkflowEdge[] {
  return edges.map((edge) => ({
    ...edge,
    type: 'buttonedge',
    markerEnd: { type: MarkerType.ArrowClosed },
    data: {
      onAddEdgeClick: () =>
        handlers.onAdd({
          source: edge.source,
          sourceHandle: edge.sourceHandle ?? null,
          target: edge.target,
          edgeId: edge.id,
        }),
      onDeleteEdgeClick: () => handlers.onDelete(edge.id),
    },
  }));
}
