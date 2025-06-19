import type { Item } from '../../types/workflow';

export async function runWebhook(config: Record<string, unknown>): Promise<Item[]> {
  let payload: any;
  if (config.useMockData && config.mockRequest) {
    const text = String(config.mockRequest);
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  } else {
    payload = { status: 'received' };
  }
  return [{ json: payload }];
}
