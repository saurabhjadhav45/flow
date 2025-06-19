import { create } from 'zustand';
import type { Node, NodeType } from '../types/nodes';

interface NodesState {
  nodes: Node[];
  selected: string | null;
  select: (id: string | null) => void;
  update: (id: string, config: Partial<Node['config']>) => void;
}

const dummyNodes: Node[] = [
  {
    id: '1',
    type: 'integration',
    config: { method: 'GET', url: '', auth: 'None' },
  },
  {
    id: '2',
    type: 'model',
    config: { model: 'Cashflow Score', threshold: 50 },
  },
  {
    id: '3',
    type: 'rule',
    config: { dataType: 'String', operator: 'equals', value: '' },
  },
  {
    id: '4',
    type: 'action',
    config: { to: '', subject: '', body: '' },
  },
  {
    id: '5',
    type: 'trigger',
    config: { path: '/webhook', method: 'POST', auth: 'None' },
  },
];

export const useNodesStore = create<NodesState>((set) => ({
  nodes: dummyNodes,
  selected: null,
  select: (id) => set({ selected: id }),
  update: (id, config) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, config: { ...n.config, ...config } } : n
      ),
    })),
}));
