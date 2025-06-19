import React, { useEffect, memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { WorkflowNodeData } from '../../types/workflow';
import { FiGitBranch, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useWorkflowStore } from '../../store/workflowStore';
import NodeResult from './NodeResult';

interface IfNodeProps extends NodeProps<WorkflowNodeData> {
  darkMode?: boolean;
}

function IfNode({ id, data, darkMode = false }: IfNodeProps) {
  const [isDark, setIsDark] = React.useState(darkMode);

  const edges = useWorkflowStore((state) => state.edges);
  const draggingNodeId = useWorkflowStore((state) => state.draggingNodeId);
  const openSidebar = useWorkflowStore((state) => state.openSidebar);
  const setPendingConnection = useWorkflowStore((state) => state.setPendingConnection);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  const hasOutgoingTrue = edges.some((e) => e.source === id && e.sourceHandle === 'true');
  const hasOutgoingFalse = edges.some((e) => e.source === id && e.sourceHandle === 'false');
  const showPlusTrue = !hasOutgoingTrue && draggingNodeId !== id;
  const showPlusFalse = !hasOutgoingFalse && draggingNodeId !== id;

  const onAdd = (handleId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingConnection({ source: id, sourceHandle: handleId });
    openSidebar();
  };

  const colors = {
    background: isDark ? '#1e2235' : '#fff',
    border: isDark ? 'rgba(255,255,255,0.2)' : '#C1C1C1',
    shadow: isDark ? '0 1px 4px rgba(0,0,0,0.5)' : '0 1px 4px rgba(0,0,0,0.1)',
    text: isDark ? '#FFFFFF' : '#333333',
  };

  useEffect(() => {
    if (!darkMode) {
      const prefersDark =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, [darkMode]);

  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-600"
      />

      <div className={`flex items-center p-4 shadow-lg rounded-sm border-1 bg-[${colors.background}]`} style={{ position: 'relative' }}>
        <FiGitBranch className="w-6 h-6 text-blue-600" />
        {hovered && (
          <FiTrash2
            onClick={e => { e.stopPropagation(); deleteNode(id); }}
            style={{
              position: 'absolute',
              top: 3,
              right: 2,
              cursor: 'pointer',
              color: colors.text,
              fontSize: 10,
              zIndex: 10,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: 0,
            }}
            title="Delete node"
            tabIndex={0}
          />
        )}
      </div>

      <div className="flex-1 absolute bottom-0 translate-y-[calc(100%+2px)] text-center w-full">
        <div className="font-medium text-[8px]">{data.label}</div>
        {data.description && (
          <div className="text-[6px] text-gray-500 whitespace-pre-wrap break-words max-h-[40px] overflow-auto">
            {data.description}
          </div>
        )}
        <NodeResult id={id} />
      </div>

      <Handle
        type="source"
        id="true"
        position={Position.Right}
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          border: `2px solid ${colors.border}`,
          background: colors.background,
          right: 0,
          top: '35%',
          transform: 'translate(50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.text,
          fontSize: 14,
        }}
      >
         <span style={{ position: 'absolute', zIndex:9, padding:2, fontSize:6, background:'#fff', left: 12, top: '50%', transform: 'translateY(-50%)', color: colors.text }}>true</span>
        {showPlusTrue && (
          <>
            <div
              style={{
                position: 'absolute',
                right: -30,
                top: '50%',
                width: 30,
                height: 2,
                background: colors.border,
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
            <FiPlus
              onClick={onAdd('true')}
              style={{
                position: 'absolute',
                right: -45,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 20,
                height: 20,
                border: `2px solid ${colors.border}`,
                borderRadius: 4,
                padding: 2,
                background: colors.background,
                color: colors.text,
                cursor: 'pointer',
              }}
            />
          </>
        )}
      </Handle>

      <Handle
        type="source"
        id="false"
        position={Position.Right}
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          border: `2px solid ${colors.border}`,
          background: colors.background,
          right: 0,
          top: '65%',
          transform: 'translate(50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.text,
          fontSize: 14,
        }}
      >
        <span style={{ position: 'absolute', zIndex:9, padding:2, fontSize:6, background:'#fff', left: 12, top: '50%', transform: 'translateY(-50%)', color: colors.text }}>false</span>
        {showPlusFalse && (
          <>
            <div
              style={{
                position: 'absolute',
                right: -30,
                top: '50%',
                width: 30,
                height: 2,
                background: colors.border,
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
            <FiPlus
              onClick={onAdd('false')}
              style={{
                position: 'absolute',
                right: -45,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 20,
                height: 20,
                border: `2px solid ${colors.border}`,
                borderRadius: 4,
                padding: 2,
                background: colors.background,
                color: colors.text,
                cursor: 'pointer',
              }}
            />
          </>
        )}
      </Handle>
    </div>
  );
}

export default memo(IfNode);
