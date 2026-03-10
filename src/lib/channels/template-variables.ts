export type TemplateVariables = Record<string, string | number | null | undefined>;

const VARIABLE_REGEX = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;

export function extractTemplateVariables(content: string): string[] {
  const matches = [...content.matchAll(VARIABLE_REGEX)].map((match) => match[1]);
  return Array.from(new Set(matches));
}

export function renderTemplate(content: string, variables: TemplateVariables): string {
  return content.replace(VARIABLE_REGEX, (_, token: string) => {
    const value = variables[token];
    return value === null || value === undefined ? "" : String(value);
  });
}
