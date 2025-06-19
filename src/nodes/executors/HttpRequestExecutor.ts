import type { Item } from '../../types/workflow';

export async function runHttpRequest(config: Record<string, any>): Promise<Item[]> {
  const method = config.method || 'GET';
  const url = config.url as string;
  let headers: Record<string, string> = {};
  if (config.headers) {
    try {
      headers = JSON.parse(config.headers as string);
    } catch {
      // ignore parse errors
    }
  }
  let body: BodyInit | undefined;
  if (method !== 'GET' && config.body) {
    try {
      body = JSON.stringify(JSON.parse(config.body));
    } catch {
      body = String(config.body);
    }
  }
  const res = await fetch(url, { method, headers, body });
  const text = await res.text();
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }
  return [{ json: parsed }];
}
