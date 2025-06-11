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
  // Access edges from global workflow store to determine if this node already has
  // an outgoing connection. The component re-renders automatically when edges
  // change, so the icon visibility updates in realtime.
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
      <Handle
        type="source"
        id="out"
        position={Position.Right}
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: `2px solid ${colors.border}`,
          background: colors.background,
          right: -8,
          top: '50%',
          transform: 'translate(50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* The plus icon is rendered inside the same handle and hidden once an
            outgoing connection exists. */}
        {!hasOutgoing && (
          <FiPlus style={{ width: 10, height: 10, pointerEvents: 'none', color: colors.text }} />
        )}
      </Handle>
    </div>
  );
}

export default memo(StyledNode);
