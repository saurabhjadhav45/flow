export async function runHttpRequest(config: Record<string, any>) {
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
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
