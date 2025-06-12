import { useCallback, useRef, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type OnConnectStartParams,
} from "reactflow";
import type { Connection, ReactFlowInstance, NodeTypes, Node } from "reactflow";
import "reactflow/dist/style.css";
import { useWorkflowStore } from "../store/workflowStore";
import { FiPlus } from "react-icons/fi";
import type {
  WorkflowNode,
  WorkflowEdge,
  WorkflowEdgeData,
  WorkflowNodeData,
  NodeType,
} from "../types/workflow";
import StyledNode from "./nodes/StyledNode";
import WebhookNode from "./nodes/WebhookNode";
import WebhookSettingsModal from "./WebhookSettingsModal";
import type { WebhookSettings } from "./WebhookSettingsModal";
import GlobalAddButton from "./GlobalAddButton";
import EdgeControls from "./edges/EdgeControls";
import ButtonEdge from "./edges/ButtonEdge";
import { getNodeId } from "../utils/getNodeId";
import PropertiesPanel from "./PropertiesPanel";
import HttpRequestNode from "./nodes/HttpRequestNode";

const nodeTypes: NodeTypes = {
  httpRequest: HttpRequestNode,
  delay: StyledNode,
  setVariable: StyledNode,
  condition: StyledNode,
  webhook: WebhookNode,
};

const edgeTypes = {
  controls: EdgeControls,
  buttonedge: ButtonEdge,
};

export function WorkflowEditor() {
  const {
    nodes: initialNodes,
    edges: initialEdges,
    setNodes: setStoreNodes,
    addNode,
    addEdge: addStoreEdge,
    deleteEdge,
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
    useEdgesState<WorkflowEdgeData>(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const connectStart = useRef<OnConnectStartParams | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = selectedNodeId
    ? nodes.find((node) => node.id === selectedNodeId) || null
    : null;

  const updateNodeData = useCallback(
    (nodeId: string, newData: Record<string, unknown>) => {
      // console.log("Updating node data", nodeId, newData);

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, ...newData } };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

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
    if (newNode.type === 'webhook') {
      setEditingNodeId(newNode.id);
      setModalOpen(true);
    }

    if (lastNode) {
      const edgeId = `edge-${lastNode.id}-${newNode.id}`;
      const newEdge: WorkflowEdge = {
        id: edgeId,
        source: lastNode.id,
        target: newNode.id,
        type: "buttonedge",
        data: {
          onAddEdgeClick: () => {
            setPendingConnection({ source: lastNode.id, sourceHandle: null });
            openSidebar();
          },
          onDeleteEdgeClick: () => deleteEdge(edgeId),
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      addStoreEdge(newEdge);
    }

    setNodeToAdd(null);
  }, [
    nodeToAdd,
    nodes,
    setNodes,
    addNode,
    setEdges,
    addStoreEdge,
    setNodeToAdd,
    setPendingConnection,
    openSidebar,
    deleteEdge,
    setModalOpen,
    setEditingNodeId,
  ]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      const edgeId = `edge-${connection.source}-${connection.target}`;
      const newEdge: WorkflowEdge = {
        ...connection,
        id: edgeId,
        source: connection.source,
        target: connection.target,
        type: "buttonedge",
        data: {
          onAddEdgeClick: () => {
            setPendingConnection({
              source: connection.source as string,
              sourceHandle: connection.sourceHandle ?? null,
            });
            openSidebar();
          },
          onDeleteEdgeClick: () => deleteEdge(edgeId),
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      addStoreEdge(newEdge);
    },
    [setEdges, addStoreEdge, setPendingConnection, openSidebar, deleteEdge]
  );
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === 'webhook') {
      setEditingNodeId(node.id);
      setModalOpen(true);
    }
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);
  const onNodeDragStop = useCallback(() => {
    setStoreNodes(nodes as WorkflowNode[]);
  }, [nodes, setStoreNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
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
      const droppedOnPane = target.classList.contains("react-flow__pane");

      if (droppedOnPane && connectStart.current) {
        setPendingConnection({
          source: connectStart.current.nodeId || "",
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
      const type = event.dataTransfer.getData(
        "application/reactflow"
      ) as NodeType;
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
      if (type === 'webhook') {
        setEditingNodeId(newNode.id);
        setModalOpen(true);
      }

      if (pendingConnection) {
        const edgeId = `edge-${pendingConnection.source}-${newNode.id}`;
        const newEdge: WorkflowEdge = {
          id: edgeId,
          source: pendingConnection.source,
          sourceHandle: pendingConnection.sourceHandle ?? undefined,
          target: newNode.id,
          type: "buttonedge",
          data: {
            onAddEdgeClick: () => {
              setPendingConnection({
                source: pendingConnection.source,
                sourceHandle: pendingConnection.sourceHandle,
              });
              openSidebar();
            },
            onDeleteEdgeClick: () => deleteEdge(edgeId),
          },
        };
        setEdges((eds) => addEdge(newEdge, eds));
        addStoreEdge(newEdge);
        setPendingConnection(null);
      }
      closeSidebar();
    },
    [
      setNodes,
      addNode,
      pendingConnection,
      addStoreEdge,
      setEdges,
      setPendingConnection,
      closeSidebar,
      openSidebar,
      deleteEdge,
      setModalOpen,
      setEditingNodeId,
    ]
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
        onInit={(instance) => (reactFlowInstance.current = instance)}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={onPaneClick}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      {nodes.length === 0 && (
        <button
          onClick={openSidebar}
          className="bg-white/70 dark:bg-gray-800/70 absolute inset-0 m-auto w-28 h-28 border-2 border-dashed rounded-lg flex flex-col items-center text-gray-500 dark:text-gray-300"
        >
          <FiPlus className="w-12 h-12" />
          <span className="mt-2 text-sm">Add first step…</span>
        </button>
      )}
      <GlobalAddButton />
      {selectedNode && (
        <PropertiesPanel
          node={selectedNode}
          onUpdateNode={updateNodeData}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
      {modalOpen && (
        <WebhookSettingsModal
          open={modalOpen}
          initialData={nodes.find((n) => n.id === editingNodeId)?.data as Partial<WebhookSettings>}
          onSave={(data) => {
            if (!editingNodeId) return;
            setNodes((nds) =>
              nds.map((n) => (n.id === editingNodeId ? { ...n, data: { ...n.data, ...data } } : n))
            );
            setModalOpen(false);
            setEditingNodeId(null);
          }}
          onClose={() => {
            setModalOpen(false);
            setEditingNodeId(null);
          }}
        />
      )}
    </div>
  );
}
