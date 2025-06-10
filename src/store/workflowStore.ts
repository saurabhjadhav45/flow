import { create } from 'zustand';
import type { WorkflowStore } from '../types/workflow';

const initialState = {
  nodes: [],
  edges: [],
  selectedNode: null,
  undoStack: [],
  redoStack: [],
  sidebarOpen: false,
  pendingConnection: null,
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  ...initialState,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNode: (nodeId) => set({ selectedNode: nodeId }),

  addNode: (node) => {
    const { nodes } = get();
    set({ nodes: [...nodes, node] });
  },

  updateNode: (nodeId, data) => {
    const { nodes } = get();
    set({
      nodes: nodes.map((node) =>
        node.id === nodeId ? { ...node, ...data } : node
      ),
    });
  },

  deleteNode: (nodeId) => {
    const { nodes, edges } = get();
    set({
      nodes: nodes.filter((node) => node.id !== nodeId),
      edges: edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },

  addEdge: (edge) => {
    const { edges } = get();
    set({ edges: [...edges, edge] });
  },

  deleteEdge: (edgeId) => {
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
  setPendingConnection: (connection) => set({ pendingConnection: connection }),
}));
