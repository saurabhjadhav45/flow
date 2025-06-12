import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { FiLink, FiZap } from 'react-icons/fi';
import type { WorkflowNodeData } from '../../types/workflow';

function WebhookNode({ data, selected }: NodeProps<WorkflowNodeData>) {
  const isListening = (data as { isListening?: boolean })?.isListening;
  return (
    <div className={`webhook-node flex flex-col items-center ${selected ? 'selected' : ''}`}> 
      <div className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 shadow flex flex-col items-center">
        <FiLink className="w-6 h-6" />
        {isListening && <FiZap className="w-3 h-3 text-orange-500 absolute -right-1 -top-1" />}
        <div className="text-xs mt-1 text-gray-800 dark:text-gray-100">Webhook</div>
      </div>
      <Handle type="source" position={Position.Right} id="output" className="w-2 h-4 !rounded-none" />
    </div>
  );
}

export default memo(WebhookNode);
