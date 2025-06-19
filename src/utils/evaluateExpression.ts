export function evaluateExpression(
  expr: string,
  context: Record<string, unknown>,
): unknown {
  const fullExpr = expr.match(/^\s*{{([\s\S]*?)}}\s*$/);
  if (fullExpr) {
    return runExpression(fullExpr[1], context);
  }

  const regex = /{{\s*([\s\S]*?)\s*}}/g;
  return expr.replace(regex, (_, code: string) => {
    const result = runExpression(code, context);
    return result !== undefined && result !== null ? String(result) : '';
  });
}

function runExpression(code: string, context: Record<string, unknown>): unknown {
  const fn = new Function('$json', '$input', '$', `return ${code}`);
  return fn(context.$json, context.$input, context);
}
export default evaluateExpression;
