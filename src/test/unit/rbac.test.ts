import { describe, expect, it } from "vitest";

import { hasPermission } from "@/lib/auth/rbac";

describe("rbac matrix", () => {
  it("allows admin integrations", () => {
    expect(hasPermission("ADMIN", "admin:manage_integrations")).toBe(true);
  });

  it("blocks marketing from inbox reply", () => {
    expect(hasPermission("MARKETING", "inbox:reply")).toBe(false);
  });
});
