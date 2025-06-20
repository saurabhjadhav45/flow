import type { Node, Edge } from "reactflow";

export type NodeType =
  | "httpRequest"
  | "delay"
  // | "setVariable"
  // | "condition"
  | "webhook"
  | "code"
  | "set"
  | "merge"
  | "if"
  | "function"
  | "functionItem"
  | "email"
  | "airtable";

export interface WorkflowNodeData {
  label: string;
  description?: string;
  config: Record<string, unknown>;
  type: NodeType;
}

export type WorkflowNode = Node<WorkflowNodeData> & {
  type: NodeType;
};

export interface WorkflowEdgeData {
  onAddEdgeClick?: () => void;
  onDeleteEdgeClick?: () => void;
}

export type WorkflowEdge = Edge<WorkflowEdgeData>;

export interface PendingConnection {
  source: string;
  sourceHandle: string | null;
  target?: string;
  edgeId?: string;
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  /** List of variables available for expression pickers */
  variables: string[];
  /** Map of nodeId -> array of input items */
  inputByNode: Record<string, unknown[]>;
  /** Map of nodeId -> array of output items */
  outputByNode: Record<string, unknown[]>;
  /** Map of nodeId -> error message */
  nodeErrors: Record<string, string | null>;
  /** Map of nodeId -> execution status */
  nodeStatus: Record<string, 'idle' | 'pending' | 'success' | 'failed'>;
  selectedNode: string | null;
  undoStack: Array<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }>;
  redoStack: Array<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }>;
  sidebarOpen: boolean;
  pendingConnection: PendingConnection | null;
  nodeToAdd: NodeType | null;
  draggingNodeId: string | null;
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
  setPendingConnection: (connection: PendingConnection | null) => void;
  setNodeToAdd: (type: NodeType | null) => void;
  setDraggingNodeId: (id: string | null) => void;
  addVariable: (name: string) => void;
  removeVariable: (name: string) => void;
  setInputForNode: (nodeId: string, items: unknown[]) => void;
  setOutputForNode: (nodeId: string, items: unknown[]) => void;
  setNodeError: (nodeId: string, error: string | null) => void;
  setNodeStatus: (
    nodeId: string,
    status: 'idle' | 'pending' | 'success' | 'failed',
  ) => void;
}
