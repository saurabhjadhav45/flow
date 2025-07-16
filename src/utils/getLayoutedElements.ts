import dagre from '@dagrejs/dagre';
import type { Node, Edge, Position } from 'reactflow';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

export function getLayoutedElements<N, E>(
  nodes: Node<N>[],
  edges: Edge<E>[],
  direction: 'TB' | 'LR' = 'LR',
): { nodes: Node<N>[]; edges: Edge<E>[] } {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    return {
      ...node,
      sourcePosition: (isHorizontal ? 'right' : 'bottom') as Position,
      targetPosition: (isHorizontal ? 'left' : 'top') as Position,
      position: {
        x: dagreNode.x - nodeWidth / 2,
        y: dagreNode.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
