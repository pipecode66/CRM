const blockedPatterns = [
  /transferencia/i,
  /cuenta bancaria/i,
  /tarjeta/i,
  /descuento/i,
  /password/i,
  /contraseÃ±a/i,
  /documento de identidad/i,
  /token/i,
];

export function requiresCriticalApproval(message: string): boolean {
  return blockedPatterns.some((regex) => regex.test(message));
}

export function sanitizePrompt(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .trim();
}
