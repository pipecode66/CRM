import { describe, expect, it } from "vitest";

import { workflowDslSchema } from "@/lib/workflows/dsl";

describe("workflow dsl", () => {
  it("validates n8n-like flow shape", () => {
    const parsed = workflowDslSchema.safeParse({
      version: "v1",
      trigger: "message.received",
      retries: 2,
      timeoutMs: 12000,
      nodes: [
        { id: "n1", type: "trigger", position: { x: 0, y: 0 }, data: {} },
        {
          id: "n2",
          type: "action",
          position: { x: 200, y: 0 },
          data: { actionType: "ai.invoke" },
        },
      ],
      edges: [{ id: "e1", source: "n1", target: "n2" }],
    });

    expect(parsed.success).toBe(true);
  });
});
