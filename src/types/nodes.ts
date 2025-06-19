export type NodeType = 'integration' | 'model' | 'rule' | 'trigger' | 'action';

export type InputType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'dropdown'
  | 'toggle'
  | 'range';

export interface NodeField {
  name: string;
  label: string;
  type: InputType;
  required?: boolean;
  options?: string[];
}

export interface Tab {
  id: string;
  label: string;
}

export interface NodeConfig {
  [key: string]: unknown;
}

export interface Node {
  id: string;
  type: NodeType;
  config: NodeConfig;
}
