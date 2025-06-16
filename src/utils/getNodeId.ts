let id = 0;

export const getNodeId = () => `node_${id++}`;

export const initializeNodeId = (nodes: { id: string }[]) => {
  let maxId = -1;
  for (const node of nodes) {
    const match = node.id.match(/^node_(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxId) maxId = num;
    }
  }
  id = maxId + 1;
};
