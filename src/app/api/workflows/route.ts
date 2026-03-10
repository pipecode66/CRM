import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";
import { workflowDslSchema } from "@/lib/workflows/dsl";

const workflowSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  trigger: z.enum([
    "MESSAGE_RECEIVED",
    "SOCIAL_COMMENT",
    "STAGE_CHANGED",
    "LEAD_INACTIVE",
    "CAMPAIGN_EVENT",
    "TASK_OVERDUE",
    "MANUAL",
  ]),
  active: z.boolean().default(true),
  definition: workflowDslSchema,
});

export async function GET() {
  const auth = await requireSession("workflows:read");
  if (!auth.ok) return auth.response;

  const workflows = await db.workflow.findMany({
    include: {
      runs: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ data: workflows, meta: { total: workflows.length } });
}

export async function POST(request: Request) {
  const auth = await requireSession("workflows:write");
  if (!auth.ok) return auth.response;

  const payload = workflowSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const workflow = await db.workflow.create({
    data: {
      name: payload.data.name,
      description: payload.data.description,
      trigger: payload.data.trigger,
      active: payload.data.active,
      definition: payload.data.definition,
      createdById: auth.session.user.id,
    },
  });

  return NextResponse.json({ data: workflow }, { status: 201 });
}
