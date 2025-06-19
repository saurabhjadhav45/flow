import { create } from 'zustand';
import type {
  WorkflowStore,
  WorkflowNode,
  WorkflowEdge,
  PendingConnection,
  NodeType,
  WorkflowState,
  Item,
} from '../types/workflow';

const initialState = {
  nodes: [],
  edges: [],
  variables: [],
  selectedNode: null,
  undoStack: [],
  redoStack: [],
  sidebarOpen: false,
  pendingConnection: null,
  nodeToAdd: null,
  draggingNodeId: null,
  nodeResults: {},
  errorResults: {},
  nodeInputs: {},
  nodeStatus: {},
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  ...initialState,

  setNodes: (nodes: WorkflowNode[]) => set({ nodes }),
  setEdges: (edges: WorkflowEdge[]) => set({ edges }),
  setSelectedNode: (nodeId: string | null) => set({ selectedNode: nodeId }),

  addNode: (node: WorkflowNode) => {
    const { nodes, variables } = get();
    const label = node.data.label || node.type;
    const expr = `$(${JSON.stringify(label)}).first().json`;
    const newVars = variables.includes(expr) ? variables : [...variables, expr];
    set({ nodes: [...nodes, node], variables: newVars });
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
    const { nodes, edges, variables } = get();
    const node = nodes.find((n) => n.id === nodeId);
    const label = node?.data.label || node?.type;
    const expr = `$(${JSON.stringify(label)}).first().json`;
    set({
      nodes: nodes.filter((node) => node.id !== nodeId),
      edges: edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      variables: variables.filter((v) => v !== expr),
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
  setNodeResult: (nodeId: string, result: Item[]) =>
    set((state: WorkflowState) => ({
      nodeResults: { ...state.nodeResults, [nodeId]: result },
      nodeStatus: { ...state.nodeStatus, [nodeId]: 'success' },
    })),
  setNodeError: (nodeId: string, error: unknown) =>
    set((state: WorkflowState) => ({
      errorResults: { ...state.errorResults, [nodeId]: error },
      nodeStatus: { ...state.nodeStatus, [nodeId]: 'error' },
    })),
  setNodeInput: (nodeId: string, input: Item[]) =>
    set((state: WorkflowState) => ({
      nodeInputs: { ...state.nodeInputs, [nodeId]: input },
    })),
  setNodeStatus: (nodeId: string, status: 'pending' | 'success' | 'error') =>
    set((state: WorkflowState) => ({
      nodeStatus: { ...state.nodeStatus, [nodeId]: status },
    })),
  clearResults: () =>
    set({ nodeResults: {}, errorResults: {}, nodeInputs: {}, nodeStatus: {} }),
}));
