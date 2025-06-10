import { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type OnConnectStartParams,
} from 'reactflow';
import type { Connection, ReactFlowInstance } from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../store/workflowStore';
import { FiPlus } from 'react-icons/fi';
import type { WorkflowNode, WorkflowEdge, WorkflowNodeData, NodeType } from '../types/workflow';
import BaseNode from './nodes/BaseNode';
import GlobalAddButton from './GlobalAddButton';
import EdgeControls from './edges/EdgeControls';
import { getNodeId } from '../utils/getNodeId';

const nodeTypes = {
  httpRequest: BaseNode,
  delay: BaseNode,
  setVariable: BaseNode,
  condition: BaseNode,
  webhook: BaseNode,
};

const edgeTypes = {
  controls: EdgeControls,
};

export function WorkflowEditor() {
  const {
    nodes: initialNodes,
    edges: initialEdges,
    setNodes: setStoreNodes,
    addNode,
    addEdge: addStoreEdge,
    pendingConnection,
    setPendingConnection,
    openSidebar,
    closeSidebar,
    nodeToAdd,
    setNodeToAdd,
  } = useWorkflowStore();

  const [nodes, setNodes, onNodesChange] =
    useNodesState<WorkflowNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<WorkflowEdge>(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const connectStart = useRef<OnConnectStartParams | null>(null);

  useEffect(() => {
    if (!nodeToAdd) return;

    const lastNode = nodes[nodes.length - 1];
    const position = lastNode
      ? { x: lastNode.position.x + 200, y: lastNode.position.y }
      : { x: 50, y: 50 };

    const newNode: WorkflowNode = {
      id: getNodeId(),
      type: nodeToAdd,
      position,
      data: {
        label: nodeToAdd.charAt(0).toUpperCase() + nodeToAdd.slice(1),
        config: {},
        type: nodeToAdd,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    addNode(newNode);

    if (lastNode) {
      const newEdge: WorkflowEdge = {
        id: `edge-${lastNode.id}-${newNode.id}`,
        source: lastNode.id,
        target: newNode.id,
        type: 'controls',
      };
      setEdges((eds) => addEdge(newEdge, eds));
      addStoreEdge(newEdge);
    }

    setNodeToAdd(null);
  }, [nodeToAdd, nodes, setNodes, addNode, setEdges, addStoreEdge, setNodeToAdd]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      const newEdge: WorkflowEdge = {
        ...connection,
        id: `edge-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        type: 'controls',
      };
      setEdges((eds) => addEdge(newEdge, eds));
      addStoreEdge(newEdge);
    },
    [setEdges, addStoreEdge]
  );

  const onNodeDragStop = useCallback(() => {
    setStoreNodes(nodes as WorkflowNode[]);
  }, [nodes, setStoreNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnectStart = useCallback(
    (_: React.MouseEvent | React.TouchEvent, params: OnConnectStartParams) => {
      connectStart.current = params;
    },
    []
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element;
      const droppedOnPane = target.classList.contains('react-flow__pane');

      if (droppedOnPane && connectStart.current) {
        setPendingConnection({
          source: connectStart.current.nodeId || '',
          sourceHandle: connectStart.current.handleId,
        });
        openSidebar();
      }
      connectStart.current = null;
    },
    [openSidebar, setPendingConnection]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type || !reactFlowInstance.current) return;
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      const position = reactFlowInstance.current.project({
        x: event.clientX - (bounds?.left ?? 0),
        y: event.clientY - (bounds?.top ?? 0),
      });
      const newNode: WorkflowNode = {
        id: getNodeId(),
        type,
        position,
        data: {
          label: type.charAt(0).toUpperCase() + type.slice(1),
          config: {},
          type,
        },
      };
      setNodes((nds) => nds.concat(newNode));
      addNode(newNode);

      if (pendingConnection) {
        const newEdge: WorkflowEdge = {
          id: `edge-${pendingConnection.source}-${newNode.id}`,
          source: pendingConnection.source,
          sourceHandle: pendingConnection.sourceHandle ?? undefined,
          target: newNode.id,
          type: 'controls',
        };
        setEdges((eds) => addEdge(newEdge, eds));
        addStoreEdge(newEdge);
        setPendingConnection(null);
      }
      closeSidebar();
    },
    [setNodes, addNode, pendingConnection, addStoreEdge, setEdges, setPendingConnection, closeSidebar]
  );

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        onInit={instance => (reactFlowInstance.current = instance)}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      {nodes.length === 0 && (
        <button
          onClick={openSidebar}
          className="absolute inset-0 m-auto flex flex-col items-center text-gray-500 dark:text-gray-300"
        >
          <div className="w-28 h-28 border-2 border-dashed rounded-lg flex items-center justify-center bg-white/70 dark:bg-gray-800/70">
            <FiPlus className="w-12 h-12" />
          </div>
          <span className="mt-2 text-sm">Add first step…</span>
        </button>
      )}
      <GlobalAddButton />
    </div>
  );
}
