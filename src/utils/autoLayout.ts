import dagre from '@dagrejs/dagre';
import type { Edge, Node } from 'reactflow';
import { Position } from 'reactflow';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export function getLayoutedElements<T, U>(
  nodes: Node<T>[],
  edges: Edge<U>[],
  direction: 'TB' | 'LR' = 'LR',
): { nodes: Node<T>[]; edges: Edge<U>[] } {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 172, height: 36 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    node.position = {
      x: dagreNode.x - 172 / 2,
      y: dagreNode.y - 36 / 2,
    };

    return node;
  });

  return { nodes: layoutedNodes, edges };
}
