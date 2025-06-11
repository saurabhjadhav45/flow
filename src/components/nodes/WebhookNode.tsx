import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { FiLink, FiZap } from 'react-icons/fi';
import { useThemeStore } from '../../store/themeStore';

export interface WebhookNodeData {
  path: string;
  method: string;
  auth: string;
  respond: string;
  testUrl: string;
  prodUrl: string;
  notes: string;
  displayNote: boolean;
  isListening: boolean;
}

/**
 * Renders a square webhook node. When the node is actively listening for
 * requests a small orange lightning bolt is displayed in the corner.
 */
function WebhookNode({ data }: NodeProps<WebhookNodeData>) {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className={`webhook-node ${theme === 'dark' ? 'dark' : ''}`}>
      {data.isListening && (
        <FiZap className="absolute top-1 left-1 w-3 h-3 text-orange-500" />
      )}
      <FiLink className="w-6 h-6" />
      <div className="text-xs mt-1">Webhook</div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-4 !rounded-none source-handle"
      />
    </div>
  );
}

export default memo(WebhookNode);
