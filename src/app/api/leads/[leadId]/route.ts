import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";
import { publishRealtimeEvent } from "@/lib/realtime/server";

const updateLeadSchema = z.object({
  stageId: z.string().nullable().optional(),
  status: z
    .enum(["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST", "POST_SALE"])
    .optional(),
  assignedToId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export async function GET(_request: Request, context: { params: Promise<{ leadId: string }> }) {
  const auth = await requireSession("leads:read");
  if (!auth.ok) return auth.response;

  const { leadId } = await context.params;

  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: {
      stage: true,
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      tasks: true,
      leadNotes: {
        orderBy: { createdAt: "desc" },
      },
      purchases: {
        orderBy: { purchasedAt: "desc" },
      },
      conversations: {
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 50,
          },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ data: lead });
}

export async function PATCH(request: Request, context: { params: Promise<{ leadId: string }> }) {
  const auth = await requireSession("leads:write");
  if (!auth.ok) return auth.response;

  const { leadId } = await context.params;
  const payload = updateLeadSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const lead = await db.lead.update({
    where: { id: leadId },
    data: payload.data,
  });

  await publishRealtimeEvent({
    type: "lead.updated",
    branchId: lead.branchId,
    data: {
      leadId: lead.id,
      stageId: lead.stageId,
      status: lead.status,
    },
  });

  return NextResponse.json({ data: lead });
}
