import type { Node, Edge } from 'reactflow';

export type NodeType = 'httpRequest' | 'delay' | 'setVariable' | 'condition' | 'webhook';

export interface WorkflowNodeData {
  label: string;
  config: Record<string, any>;
}

export type WorkflowNode = Node<WorkflowNodeData> & {
  type: NodeType;
};

export type WorkflowEdge = Edge & {
  label?: string;
};

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: string | null;
  undoStack: Array<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }>;
  redoStack: Array<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }>;
  sidebarOpen: boolean;
}

export interface WorkflowStore extends WorkflowState {
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  setSelectedNode: (nodeId: string | null) => void;
  addNode: (node: WorkflowNode) => void;
  updateNode: (nodeId: string, data: Partial<WorkflowNode>) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  deleteEdge: (edgeId: string) => void;
  undo: () => void;
  redo: () => void;
  clearWorkflow: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}
