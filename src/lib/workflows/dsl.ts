import { z } from "zod";

export const triggerTypeSchema = z.enum([
  "message.received",
  "social.comment.received",
  "lead.stage.changed",
  "lead.inactive",
  "campaign.event",
  "task.overdue",
  "manual",
]);

export const actionTypeSchema = z.enum([
  "message.reply",
  "lead.assign",
  "lead.move_stage",
  "task.create",
  "lead.tag",
  "campaign.trigger",
  "human.handoff",
  "ai.invoke",
]);

export const workflowNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["trigger", "condition", "action", "delay"]),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.string(), z.any()).default({}),
});

export const workflowEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  label: z.string().optional(),
  condition: z.record(z.string(), z.any()).optional(),
});

export const workflowDslSchema = z.object({
  version: z.literal("v1"),
  trigger: triggerTypeSchema,
  retries: z.number().int().min(0).max(10).default(1),
  timeoutMs: z.number().int().min(1000).max(120000).default(15000),
  nodes: z.array(workflowNodeSchema).min(1),
  edges: z.array(workflowEdgeSchema),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type WorkflowDSL = z.infer<typeof workflowDslSchema>;

export type WorkflowContext = {
  leadId?: string;
  conversationId?: string;
  message?: string;
  branchId?: string;
  actorUserId?: string;
  payload?: Record<string, unknown>;
};
