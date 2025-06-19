export async function runFunction(config: Record<string, any>, input: any) {
  const code = String(config.code || '');
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const fn = new AsyncFunction('input', code);
  return await fn(input);
}
