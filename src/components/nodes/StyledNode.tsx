import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { WorkflowNodeData } from '../../types/workflow';
import {
  FiGlobe,
  FiClock,
  FiSliders,
  FiGitBranch,
  FiLink,
  FiPlus,
} from 'react-icons/fi';
import { useWorkflowStore } from '../../store/workflowStore';

interface StyledNodeProps extends NodeProps<WorkflowNodeData> {
  darkMode?: boolean;
}

function StyledNode({ id, data, darkMode = false }: StyledNodeProps) {
  // Access the global edges to know if this node already has an outgoing
  // connection. The plus button is hidden whenever at least one edge starts
  // from this node.
  const edges = useWorkflowStore((state) => state.edges);
  const hasOutgoing = edges.some((e) => e.source === id);
  const colors = {
    background: darkMode ? '#1E2235' : '#FFFFFF',
    border: darkMode ? 'rgba(255,255,255,0.2)' : '#C1C1C1',
    shadow: darkMode ? '0 1px 4px rgba(0,0,0,0.5)' : '0 1px 4px rgba(0,0,0,0.1)',
    text: darkMode ? '#FFFFFF' : '#333333',
  };

  const IconMap = {
    httpRequest: FiGlobe,
    delay: FiClock,
    setVariable: FiSliders,
    condition: FiGitBranch,
    webhook: FiLink,
  } as const;

  const Icon = IconMap[data.type] ?? FiGlobe;

  return (
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: 8,
        border: `2px solid ${colors.border}`,
        background: colors.background,
        boxShadow: colors.shadow,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 8,
          height: 8,
          borderRadius: 0,
          border: `2px solid ${colors.border}`,
          background: colors.background,
        }}
      />
      <Icon style={{ width: 40, height: 40, color: colors.text }} />
      <div
        style={{
          marginTop: 4,
          fontSize: 12,
          fontWeight: 500,
          textAlign: 'center',
          color: colors.text,
        }}
      >
        {data.label}
      </div>
      {/*
        Single output handle. It grows to a square with a plus icon when there
        are no outgoing connections. Once an edge is created, it shrinks back to
        the standard circular handle and the plus icon disappears.
      */}
      <Handle
        type="source"
        id="out"
        position={Position.Right}
        style={{
          width: hasOutgoing ? 10 : 24,
          height: hasOutgoing ? 10 : 24,
          borderRadius: hasOutgoing ? '50%' : 4,
          border: `2px solid ${colors.border}`,
          background: colors.background,
          right: hasOutgoing ? 0 : -32,
          top: '50%',
          transform: 'translate(50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.text,
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {!hasOutgoing && <FiPlus style={{ pointerEvents: 'none' }} />}
      </Handle>
    </div>
  );
}

export default memo(StyledNode);
