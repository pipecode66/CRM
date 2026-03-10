import { describe, expect, it } from "vitest";

import { extractTemplateVariables, renderTemplate } from "@/lib/channels/template-variables";

describe("template variables", () => {
  it("extracts dynamic placeholders", () => {
    const content = "Hola {{nombre}}, soy {{asesor}}. Pago: {{link_pago}}";
    expect(extractTemplateVariables(content)).toEqual(["nombre", "asesor", "link_pago"]);
  });

  it("renders placeholders with provided values", () => {
    const content = "Hola {{nombre}}";
    const output = renderTemplate(content, { nombre: "Ana" });
    expect(output).toBe("Hola Ana");
  });
});
