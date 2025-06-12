import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { FiLink, FiZap } from 'react-icons/fi';

interface WebhookData {
  config: {
    isListening?: boolean;
  };
}

function WebhookNode({ data, selected }: NodeProps<WebhookData>) {
  const isListening = (data?.config as { isListening?: boolean })?.isListening;

  return (
    <div
      className={`webhook-node bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 shadow flex flex-col items-center ${selected ? 'ring-2 ring-primary-500' : ''}`}
    >
      <div className="relative flex items-center justify-center">
        <FiLink className="w-6 h-6 text-primary-500" />
        {isListening && (
          <FiZap className="w-4 h-4 text-orange-500 absolute -right-2 -top-2" />
        )}
      </div>
      <div className="text-xs mt-1 text-gray-800 dark:text-gray-100 text-center">Webhook</div>
      <Handle type="source" position={Position.Right} id="output" className="w-3 h-3" />
    </div>
  );
}

export default memo(WebhookNode);
