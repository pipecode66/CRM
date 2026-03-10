import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";
import { executeWorkflow } from "@/lib/workflows/engine";

const runSchema = z.object({
  leadId: z.string().optional(),
  conversationId: z.string().optional(),
  branchId: z.string().optional(),
  message: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request, context: { params: Promise<{ workflowId: string }> }) {
  const auth = await requireSession("workflows:write");
  if (!auth.ok) return auth.response;

  const { workflowId } = await context.params;

  const payload = runSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const workflow = await db.workflow.findUnique({ where: { id: workflowId } });

  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  const result = await executeWorkflow(workflowId, workflow.definition, {
    leadId: payload.data.leadId,
    conversationId: payload.data.conversationId,
    branchId: payload.data.branchId,
    message: payload.data.message,
    actorUserId: auth.session.user.id,
    payload: payload.data.payload,
  });

  return NextResponse.json({ data: result });
}
