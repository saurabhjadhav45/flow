import { useCallback, useRef, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type OnConnectStartParams,
  MarkerType,
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
// import StyledNode from "./nodes/StyledNode";
import WebhookNode from "./nodes/WebhookNode";
import CodeNode from "./nodes/CodeNode";
import SetNode from "./nodes/SetNode";
import DelayNode from "./nodes/DelayNode";
import MergeNode from "./nodes/MergeNode";
import IfNode from "./nodes/IfNode";
import FunctionNode from "./nodes/FunctionNode";
import FunctionItemNode from "./nodes/FunctionItemNode";
import EmailNode from "./nodes/EmailNode";
import AirtableNode from "./nodes/AirtableNode";
import GlobalAddButton from "./GlobalAddButton";
import ButtonEdge from "./edges/ButtonEdge";
import { getNodeId } from "../utils/getNodeId";
import { setupEdges } from "../utils/setupEdges";
import { v4 as uuidv4 } from "uuid";
import PropertiesPanel from "./PropertiesPanel";
import HttpRequestNode from "./nodes/HttpRequestNode";

function getDefaultData(type: NodeType) {
  if (type === "webhook") {
    const id = uuidv4();
    return {
      path: id,
      method: "GET",
      auth: "None",
      respond: "Immediately",
      testUrl: `https://example.com/webhook-test/${id}`,
      prodUrl: `https://example.com/webhook/${id}`,
      notes: "",
      displayNote: false,
    };
  }

  switch (type) {
    case "httpRequest":
      return { method: "GET", url: "", headers: "", body: "" };
    case "delay":
      return { duration: 1000, until: "" };
    // case "setVariable":
    //   return { variableName: "", value: "" };
    // case "condition":
    //   return { condition: "" };
    case "code":
    case "function":
    case "functionItem":
      return {
        language: "javascript",
        mode: "full",
        code: "// TODO: implement",
      };
    case "set":
      return { mappings: [], keepOnlySetFields: false };
    case "merge":
      return { mergeMode: "append", mergeFields: "", inputCount: 2 };
    case "if":
      return { conditions: [], andOr: "AND" };
    case "email":
      return {
        smtpHost: "",
        smtpPort: 587,
        smtpSecure: false,
        smtpUser: "",
        smtpPass: "",
        from: "",
        to: "",
        subject: "",
        body: "",
        attachments: "",
      };
    case "airtable":
      return {
        apiKey: "",
        baseId: "",
        table: "",
        operation: "select",
        fields: "",
        filter: "",
      };
    default:
      return {};
  }
}

const nodeTypes: NodeTypes = {
  httpRequest: HttpRequestNode,
  delay: DelayNode,
  // setVariable: StyledNode,
  // condition: StyledNode,
  webhook: WebhookNode,
  code: CodeNode,
  set: SetNode,
  merge: MergeNode,
  if: IfNode,
  function: FunctionNode,
  functionItem: FunctionItemNode,
  email: EmailNode,
  airtable: AirtableNode,
};

const edgeTypes = {
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
    setDraggingNodeId,
  } = useWorkflowStore();

  const [nodes, setNodes, onNodesChange] =
    useNodesState<WorkflowNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<WorkflowEdgeData>(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const connectStart = useRef<OnConnectStartParams | null>(null);
  const connectionMade = useRef(false);

  const isValidConnection = useCallback(
    (connection: Connection) => {
      if (!connection.target) return false;
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (!targetNode) return true;
      if (targetNode.type === "merge") return true;
      return !edges.some((e) => e.target === connection.target);
    },
    [nodes, edges]
  );

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = selectedNodeId
    ? nodes.find((node) => node.id === selectedNodeId) || null
    : null;

  const handleEdgeDelete = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
      deleteEdge(edgeId);
    },
    [setEdges, deleteEdge]
  );

  const hydrateEdges = useCallback(
    (rawEdges: WorkflowEdge[]) =>
      setupEdges(rawEdges, {
        onAdd: ({ source, sourceHandle, target, edgeId }) => {
          setPendingConnection({
            source,
            sourceHandle,
            target,
            edgeId,
          });
          openSidebar();
        },
        onDelete: handleEdgeDelete,
      }),
    [setPendingConnection, openSidebar, handleEdgeDelete]
  );

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

    const defaults = getDefaultData(nodeToAdd);

    const newNode: WorkflowNode = {
      id: getNodeId(),
      type: nodeToAdd,
      position,
      data: {
        label: nodeToAdd.charAt(0).toUpperCase() + nodeToAdd.slice(1),
        config: {},
        type: nodeToAdd,
        ...defaults,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    addNode(newNode);
    setSelectedNodeId(newNode.id);

    if (lastNode && nodeToAdd !== "webhook") {
      const edgeId = `edge-${lastNode.id}-${newNode.id}`;

      let sourceHandle: string | undefined = undefined;
      if (lastNode.type === "if") {
        const hasTrue = edges.some(
          (e) => e.source === lastNode.id && e.sourceHandle === "true"
        );
        const hasFalse = edges.some(
          (e) => e.source === lastNode.id && e.sourceHandle === "false"
        );
        if (!hasTrue) {
          sourceHandle = "true";
        } else if (!hasFalse) {
          sourceHandle = "false";
        }
      }

      const newEdge: WorkflowEdge = {
        id: edgeId,
        source: lastNode.id,
        sourceHandle,
        target: newNode.id,
        type: "buttonedge",
        markerEnd: { type: MarkerType.ArrowClosed },
        data: {
          onAddEdgeClick: () => {
            setPendingConnection({
              source: lastNode.id,
              sourceHandle,
              target: newNode.id,
              edgeId,
            });
            openSidebar();
          },
          onDeleteEdgeClick: () => handleEdgeDelete(edgeId),
        },
      };
      if (!sourceHandle && lastNode.type === "if") {
        // both handles occupied, don't auto connect
      } else {
        setEdges((eds) => addEdge(newEdge, eds));
        addStoreEdge(newEdge);
      }
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
    edges,
    setPendingConnection,
    openSidebar,
    handleEdgeDelete,
  ]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      if (!isValidConnection(connection)) return;
      connectionMade.current = true;
      const edgeId = `edge-${connection.source}-${connection.target}`;
      const newEdge: WorkflowEdge = {
        ...connection,
        id: edgeId,
        source: connection.source,
        target: connection.target,
        type: "buttonedge",
        markerEnd: { type: MarkerType.ArrowClosed },
        data: {
          onAddEdgeClick: () => {
            setPendingConnection({
              source: connection.source as string,
              sourceHandle: connection.sourceHandle ?? null,
              target: connection.target as string,
              edgeId,
            });
            openSidebar();
          },
          onDeleteEdgeClick: () => handleEdgeDelete(edgeId),
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      addStoreEdge(newEdge);
      setDraggingNodeId(null);
    },
    [
      setEdges,
      addStoreEdge,
      setPendingConnection,
      openSidebar,
      handleEdgeDelete,
      setDraggingNodeId,
      isValidConnection,
    ]
  );
  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
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
      setDraggingNodeId(params.nodeId || null);
    },
    [setDraggingNodeId]
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element;
      const droppedOnPane = target.classList.contains("react-flow__pane");

      if (!connectionMade.current && droppedOnPane && connectStart.current) {
        setPendingConnection({
          source: connectStart.current.nodeId || "",
          sourceHandle: connectStart.current.handleId,
        });
        openSidebar();
      }
      connectionMade.current = false;
      connectStart.current = null;
      setDraggingNodeId(null);
    },
    [openSidebar, setPendingConnection, setDraggingNodeId]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData(
        "application/reactflow"
      ) as NodeType;
      if (!type || !reactFlowInstance.current) return;
      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const defaults = getDefaultData(type);

      const newNode: WorkflowNode = {
        id: getNodeId(),
        type,
        position,
        data: {
          label: type.charAt(0).toUpperCase() + type.slice(1),
          config: {},
          type,
          ...defaults,
        },
      };
      setNodes((nds) => nds.concat(newNode));
      addNode(newNode);
      setSelectedNodeId(newNode.id);

      if (pendingConnection) {
        if (type !== "webhook") {
          if (pendingConnection.target && pendingConnection.edgeId) {
            // insert between existing edge
            handleEdgeDelete(pendingConnection.edgeId);

            const edgeId1 = `edge-${pendingConnection.source}-${newNode.id}`;
            const newEdge1: WorkflowEdge = {
              id: edgeId1,
              source: pendingConnection.source,
              sourceHandle: pendingConnection.sourceHandle ?? undefined,
              target: newNode.id,
              type: "buttonedge",
              markerEnd: { type: MarkerType.ArrowClosed },
              data: {
                onAddEdgeClick: () => {
                  setPendingConnection({
                    source: pendingConnection.source,
                    sourceHandle: pendingConnection.sourceHandle,
                    target: newNode.id,
                    edgeId: edgeId1,
                  });
                  openSidebar();
                },
                onDeleteEdgeClick: () => handleEdgeDelete(edgeId1),
              },
            };

            const edgeId2 = `edge-${newNode.id}-${pendingConnection.target}`;
            const newEdge2: WorkflowEdge = {
              id: edgeId2,
              source: newNode.id,
              target: pendingConnection.target,
              type: "buttonedge",
              markerEnd: { type: MarkerType.ArrowClosed },
              data: {
                onAddEdgeClick: () => {
                  setPendingConnection({
                    source: newNode.id,
                    sourceHandle: null,
                    target: pendingConnection.target,
                    edgeId: edgeId2,
                  });
                  openSidebar();
                },
                onDeleteEdgeClick: () => handleEdgeDelete(edgeId2),
              },
            };

            setEdges((eds) => addEdge(newEdge2, addEdge(newEdge1, eds)));
            addStoreEdge(newEdge1);
            addStoreEdge(newEdge2);
          } else {
            const edgeId = `edge-${pendingConnection.source}-${newNode.id}`;
            const newEdge: WorkflowEdge = {
              id: edgeId,
              source: pendingConnection.source,
              sourceHandle: pendingConnection.sourceHandle ?? undefined,
              target: newNode.id,
              type: "buttonedge",
              markerEnd: { type: MarkerType.ArrowClosed },
              data: {
                onAddEdgeClick: () => {
                  setPendingConnection({
                    source: pendingConnection.source,
                    sourceHandle: pendingConnection.sourceHandle,
                    target: newNode.id,
                    edgeId,
                  });
                  openSidebar();
                },
                onDeleteEdgeClick: () => handleEdgeDelete(edgeId),
              },
            };
            setEdges((eds) => addEdge(newEdge, eds));
            addStoreEdge(newEdge);
          }
        }
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
      handleEdgeDelete,
    ]
  );

  // Sync local state with Zustand store for node/edge deletion
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);
  useEffect(() => {
    setEdges(hydrateEdges(initialEdges));
  }, [initialEdges, hydrateEdges, setEdges]);

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
        isValidConnection={isValidConnection}
        fitView
        onInit={(instance) => (reactFlowInstance.current = instance)}
        onDrop={onDrop}
        onDragOver={onDragOver}
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
    </div>
  );
}
