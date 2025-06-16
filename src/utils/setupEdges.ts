import type { WorkflowEdge } from '../types/workflow';

export interface EdgeHandlers {
  onAdd: (source: string, sourceHandle: string | null) => void;
  onDelete: (id: string) => void;
}

export function setupEdges(
  edges: WorkflowEdge[],
  handlers: EdgeHandlers
): WorkflowEdge[] {
  return edges.map((edge) => ({
    ...edge,
    type: 'buttonedge',
    data: {
      onAddEdgeClick: () =>
        handlers.onAdd(edge.source, edge.sourceHandle ?? null),
      onDeleteEdgeClick: () => handlers.onDelete(edge.id),
    },
  }));
}
