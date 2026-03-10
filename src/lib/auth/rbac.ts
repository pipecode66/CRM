import type { Role } from "@prisma/client";

export type ResourceAction =
  | "dashboard:read"
  | "inbox:read"
  | "inbox:reply"
  | "leads:read"
  | "leads:write"
  | "tasks:read"
  | "tasks:write"
  | "templates:read"
  | "templates:write"
  | "campaigns:read"
  | "campaigns:write"
  | "reports:read"
  | "workflows:read"
  | "workflows:write"
  | "ai:read"
  | "ai:write"
  | "admin:manage_users"
  | "admin:manage_integrations";

export const permissionMatrix: Record<Role, ResourceAction[]> = {
  ADMIN: [
    "dashboard:read",
    "inbox:read",
    "inbox:reply",
    "leads:read",
    "leads:write",
    "tasks:read",
    "tasks:write",
    "templates:read",
    "templates:write",
    "campaigns:read",
    "campaigns:write",
    "reports:read",
    "workflows:read",
    "workflows:write",
    "ai:read",
    "ai:write",
    "admin:manage_users",
    "admin:manage_integrations",
  ],
  SUPERVISOR: [
    "dashboard:read",
    "inbox:read",
    "inbox:reply",
    "leads:read",
    "leads:write",
    "tasks:read",
    "tasks:write",
    "templates:read",
    "templates:write",
    "campaigns:read",
    "campaigns:write",
    "reports:read",
    "workflows:read",
    "workflows:write",
    "ai:read",
    "ai:write",
  ],
  SALES_ADVISOR: [
    "dashboard:read",
    "inbox:read",
    "inbox:reply",
    "leads:read",
    "leads:write",
    "tasks:read",
    "tasks:write",
    "templates:read",
    "campaigns:read",
    "ai:read",
  ],
  CUSTOMER_SUPPORT: [
    "dashboard:read",
    "inbox:read",
    "inbox:reply",
    "leads:read",
    "tasks:read",
    "tasks:write",
    "templates:read",
    "ai:read",
  ],
  MARKETING: [
    "dashboard:read",
    "leads:read",
    "templates:read",
    "templates:write",
    "campaigns:read",
    "campaigns:write",
    "reports:read",
    "ai:read",
    "workflows:read",
  ],
};

export function hasPermission(role: Role, action: ResourceAction): boolean {
  return permissionMatrix[role].includes(action);
}

export function assertPermission(role: Role, action: ResourceAction): void {
  if (!hasPermission(role, action)) {
    throw new Error(`Forbidden: ${role} cannot perform ${action}`);
  }
}
