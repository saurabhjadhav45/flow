import type { Item } from '../../types/workflow';

export async function runFunction(
  config: Record<string, any>,
  input: Item[]
): Promise<Item[]> {
  const code = String(config.code || '');
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const fn = new AsyncFunction('items', code);
  const result = await fn(input);
  if (Array.isArray(result)) {
    return result.map((r) => (typeof r === 'object' && 'json' in r ? r : { json: r }));
  }
  return [{ json: result }];
}
