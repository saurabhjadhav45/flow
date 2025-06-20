import { create } from 'zustand';
import type {
  WorkflowStore,
  WorkflowNode,
  WorkflowEdge,
  PendingConnection,
  NodeType,
  WorkflowState,
} from '../types/workflow';

const initialState = {
  nodes: [],
  edges: [],
  variables: [],
  inputByNode: {},
  outputByNode: {},
  nodeErrors: {},
  nodeStatus: {},
  selectedNode: null,
  undoStack: [],
  redoStack: [],
  sidebarOpen: false,
  pendingConnection: null,
  nodeToAdd: null,
  draggingNodeId: null,
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  ...initialState,

  setNodes: (nodes: WorkflowNode[]) => set({ nodes }),
  setEdges: (edges: WorkflowEdge[]) => set({ edges }),
  setSelectedNode: (nodeId: string | null) => set({ selectedNode: nodeId }),

  addNode: (node: WorkflowNode) => {
    const { nodes } = get();
    set({ nodes: [...nodes, node] });
  },

  updateNode: (nodeId: string, data: Partial<WorkflowNode>) => {
    const { nodes } = get();
    set({
      nodes: nodes.map((node) =>
        node.id === nodeId ? { ...node, ...data } : node
      ),
    });
  },

  deleteNode: (nodeId: string) => {
    const { nodes, edges } = get();
    set({
      nodes: nodes.filter((node) => node.id !== nodeId),
      edges: edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },

  addEdge: (edge: WorkflowEdge) => {
    const { edges } = get();
    set({ edges: [...edges, edge] });
  },

  deleteEdge: (edgeId: string) => {
    const { edges } = get();
    set({ edges: edges.filter((edge) => edge.id !== edgeId) });
  },

  undo: () => {
    const { undoStack, nodes, edges } = get();
    if (undoStack.length === 0) return;

    const previousState = undoStack[undoStack.length - 1];
    set({
      nodes: previousState.nodes,
      edges: previousState.edges,
      undoStack: undoStack.slice(0, -1),
      redoStack: [...get().redoStack, { nodes, edges }],
    });
  },

  redo: () => {
    const { redoStack, nodes, edges } = get();
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    set({
      nodes: nextState.nodes,
      edges: nextState.edges,
      redoStack: redoStack.slice(0, -1),
      undoStack: [...get().undoStack, { nodes, edges }],
    });
  },

  clearWorkflow: () => set(initialState),

  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  setPendingConnection: (connection: PendingConnection | null) =>
    set({ pendingConnection: connection }),
  setNodeToAdd: (type: NodeType | null) => set({ nodeToAdd: type }),
  setDraggingNodeId: (id: string | null) => set({ draggingNodeId: id }),
  addVariable: (name: string) =>
    set((state: WorkflowState) =>
      state.variables.includes(name)
        ? {}
        : { variables: [...state.variables, name] }
    ),
  removeVariable: (name: string) =>
    set((state: WorkflowState) => ({
      variables: state.variables.filter((v: string) => v !== name),
    })),

  setInputForNode: (nodeId: string, items: unknown[]) =>
    set((state: WorkflowState) => ({
      inputByNode: { ...state.inputByNode, [nodeId]: items },
    })),

  setOutputForNode: (nodeId: string, items: unknown[]) =>
    set((state: WorkflowState) => ({
      outputByNode: { ...state.outputByNode, [nodeId]: items },
    })),

  setNodeError: (nodeId: string, error: string | null) =>
    set((state: WorkflowState) => ({
      nodeErrors: { ...state.nodeErrors, [nodeId]: error },
    })),

  setNodeStatus: (
    nodeId: string,
    status: 'idle' | 'pending' | 'success' | 'failed',
  ) =>
    set((state: WorkflowState) => ({
      nodeStatus: { ...state.nodeStatus, [nodeId]: status },
    })),
}));
