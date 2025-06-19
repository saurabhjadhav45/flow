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

export interface IntegrationConfig {
  method: string;
  url: string;
  auth: string;
  pagination?: string;
  batching?: string;
}

export interface ModelConfig {
  model: string;
  threshold: number;
  mock?: boolean;
}

export interface RuleConfig {
  dataType: string;
  operator: string;
  value: string;
}

export interface ActionConfig {
  to: string;
  subject: string;
  body: string;
}

export interface TriggerConfig {
  path: string;
  method: string;
  auth: string;
}

export type NodeConfig =
  | IntegrationConfig
  | ModelConfig
  | RuleConfig
  | ActionConfig
  | TriggerConfig;

export interface Node {
  id: string;
  type: NodeType;
  config: NodeConfig;
}
