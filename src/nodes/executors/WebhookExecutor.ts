export async function runWebhook(config: Record<string, unknown>) {
  if (config.useMockData && config.mockRequest) {
    const text = String(config.mockRequest);
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  // Placeholder implementation representing a real request
  return { status: 'received' };
}
