import { describe, expect, it } from "vitest";

import { requiresCriticalApproval, sanitizePrompt } from "@/lib/ai/guardrails";

describe("AI guardrails", () => {
  it("flags sensitive terms", () => {
    expect(requiresCriticalApproval("te doy 20% de descuento y datos de tarjeta")).toBe(true);
  });

  it("sanitizes script injections", () => {
    expect(sanitizePrompt("hola<script>alert(1)</script>")).toBe("hola");
  });
});
