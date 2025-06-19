import type { NodeType, Item } from '../../types/workflow';
import { runWebhook } from './WebhookExecutor';
import { runHttpRequest } from './HttpRequestExecutor';
import { runFunction } from './FunctionExecutor';

export async function runNode(
  type: NodeType,
  config: any,
  input: Item[]
): Promise<Item[]> {
  switch (type) {
    case 'webhook':
      return runWebhook(config);
    case 'httpRequest':
      return runHttpRequest(config);
    case 'function':
      return runFunction(config, input);
    default:
      return input;
  }
}
