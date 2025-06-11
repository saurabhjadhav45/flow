import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type NodeAddChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import WebhookNode, { WebhookNodeData } from './nodes/WebhookNode';
import WebhookSettingsModal from './WebhookSettingsModal';

const nodeTypes = {
  webhook: WebhookNode,
};

export default function FlowCanvas() {
  const [nodes, setNodes] = useState<Node<WebhookNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const baseTestUrl = 'https://your-app.com/webhook-test/';
  const baseProdUrl = 'https://your-app.com/webhook/';

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => {
      const updated = applyNodeChanges(changes, nds);
      changes.forEach((c) => {
        if (c.type === 'add') {
          const item = (c as NodeAddChange<WebhookNodeData>).item;
          if (item?.type === 'webhook') {
            setEditingId(item.id);
          }
        }
      });
      return updated;
    });
  }, []);

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const onNodeDoubleClick = useCallback(
    (_e: React.MouseEvent, node: Node) => {
      if (node.type === 'webhook') {
        setEditingId(node.id);
      }
    },
    []
  );

  const handleSave = (data: WebhookNodeData) => {
    setNodes((nds) => nds.map((n) => (n.id === editingId ? { ...n, data } : n)));
  };

  const editingNode = nodes.find((n) => n.id === editingId);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      {editingNode && (
        <WebhookSettingsModal
          data={editingNode.data}
          baseTestUrl={baseTestUrl}
          baseProdUrl={baseProdUrl}
          onSave={handleSave}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
}
