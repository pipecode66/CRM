import { Prisma } from "@prisma/client";

import { runAIAgent } from "@/lib/ai/agent";
import { renderTemplate } from "@/lib/channels/template-variables";
import { db } from "@/lib/db";
import { workflowDslSchema, type WorkflowContext, type WorkflowDSL } from "@/lib/workflows/dsl";

export type WorkflowExecutionResult = {
  runId: string;
  status: "SUCCESS" | "FAILED";
  executedActions: string[];
  error?: string;
};

type ActionHandler = (ctx: WorkflowContext, nodeData: Record<string, unknown>, runId: string) => Promise<void>;

const actionHandlers: Record<string, ActionHandler> = {
  "message.reply": async (ctx, nodeData, runId) => {
    if (!ctx.conversationId || !ctx.leadId) return;

    const template = String(nodeData.template ?? "");
    const message = renderTemplate(template, {
      nombre: String(nodeData.nombre ?? "Cliente"),
      asesor: String(nodeData.asesor ?? "Equipo CRM"),
      producto: String(nodeData.producto ?? ""),
    });

    await db.message.create({
      data: {
        conversationId: ctx.conversationId,
        leadId: ctx.leadId,
        direction: "OUTBOUND",
        status: "SENT",
        content: message,
        workflowRunId: runId,
      },
    });
  },
  "lead.assign": async (ctx, nodeData) => {
    if (!ctx.leadId) return;

    const advisorId = String(nodeData.assignedToId ?? "");
    if (!advisorId) return;

    await db.lead.update({
      where: { id: ctx.leadId },
      data: { assignedToId: advisorId },
    });
  },
  "lead.move_stage": async (ctx, nodeData) => {
    if (!ctx.leadId) return;

    const stageId = String(nodeData.stageId ?? "");
    if (!stageId) return;

    await db.lead.update({
      where: { id: ctx.leadId },
      data: { stageId },
    });
  },
  "task.create": async (ctx, nodeData, runId) => {
    if (!ctx.branchId) return;

    await db.task.create({
      data: {
        title: String(nodeData.title ?? "Seguimiento automÃ¡tico"),
        description: String(nodeData.description ?? ""),
        branchId: ctx.branchId,
        leadId: ctx.leadId,
        assignedToId: (nodeData.assignedToId as string | undefined) ?? null,
        dueAt: nodeData.dueInHours
          ? new Date(Date.now() + Number(nodeData.dueInHours) * 60 * 60 * 1000)
          : null,
        isAutomated: true,
        workflowRunId: runId,
      },
    });
  },
  "lead.tag": async (ctx, nodeData) => {
    if (!ctx.leadId) return;

    const tag = String(nodeData.tag ?? "").trim();
    if (!tag) return;

    const lead = await db.lead.findUnique({ where: { id: ctx.leadId }, select: { tags: true } });
    const tags = Array.from(new Set([...(lead?.tags ?? []), tag]));

    await db.lead.update({
      where: { id: ctx.leadId },
      data: { tags },
    });
  },
  "campaign.trigger": async () => {
    return;
  },
  "human.handoff": async (ctx) => {
    if (!ctx.conversationId) return;

    await db.conversation.update({
      where: { id: ctx.conversationId },
      data: { status: "PENDING" },
    });
  },
  "ai.invoke": async (ctx, nodeData) => {
    if (!ctx.message) return;

    await runAIAgent({
      leadId: ctx.leadId,
      conversationId: ctx.conversationId,
      message: ctx.message,
      language: (nodeData.language as "es" | "en" | undefined) ?? "es",
      webUrls: Array.isArray(nodeData.webUrls)
        ? nodeData.webUrls.map((value) => String(value))
        : [],
    });
  },
};

function resolveExecutionOrder(workflow: WorkflowDSL): string[] {
  const triggerNode = workflow.nodes.find((node) => node.type === "trigger");
  if (!triggerNode) return [];

  const order: string[] = [triggerNode.id];
  const visited = new Set(order);
  let current = triggerNode.id;

  while (true) {
    const edge = workflow.edges.find((item) => item.source === current);
    if (!edge || visited.has(edge.target)) break;
    order.push(edge.target);
    visited.add(edge.target);
    current = edge.target;
  }

  return order;
}

export async function executeWorkflow(
  workflowId: string,
  rawDefinition: unknown,
  context: WorkflowContext,
): Promise<WorkflowExecutionResult> {
  const parsed = workflowDslSchema.safeParse(rawDefinition);

  const run = await db.workflowRun.create({
    data: {
      workflowId,
      leadId: context.leadId,
      conversationId: context.conversationId,
      status: "RUNNING",
      triggerPayload: (context.payload ?? {}) as Prisma.InputJsonValue,
      startedAt: new Date(),
    },
  });

  if (!parsed.success) {
    await db.workflowRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        error: parsed.error.message,
        finishedAt: new Date(),
      },
    });

    return { runId: run.id, status: "FAILED", executedActions: [], error: parsed.error.message };
  }

  const executionOrder = resolveExecutionOrder(parsed.data);
  const executedActions: string[] = [];

  try {
    for (const nodeId of executionOrder) {
      const node = parsed.data.nodes.find((item) => item.id === nodeId);
      if (!node) continue;

      if (node.type === "delay") {
        const delayMs = Number(node.data.delayMs ?? 500);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      if (node.type !== "action") {
        continue;
      }

      const actionType = String(node.data.actionType ?? "");
      const handler = actionHandlers[actionType];

      if (!handler) {
        continue;
      }

      await handler(context, node.data, run.id);
      executedActions.push(actionType);
    }

    await db.workflowRun.update({
      where: { id: run.id },
      data: {
        status: "SUCCESS",
        finishedAt: new Date(),
        logs: { executedActions } as Prisma.InputJsonValue,
      },
    });

    return {
      runId: run.id,
      status: "SUCCESS",
      executedActions,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Workflow execution failed";

    await db.workflowRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        error: errorMessage,
        finishedAt: new Date(),
        logs: { executedActions } as Prisma.InputJsonValue,
      },
    });

    return {
      runId: run.id,
      status: "FAILED",
      executedActions,
      error: errorMessage,
    };
  }
}
