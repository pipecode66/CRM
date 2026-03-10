import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";
import { publishRealtimeEvent } from "@/lib/realtime/server";

const createLeadSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fullName: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  sourceChannel: z.enum(["WHATSAPP", "INSTAGRAM", "FACEBOOK", "TIKTOK", "EMAIL", "WEB"]),
  branchId: z.string().min(1),
  stageId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  potentialValue: z.number().optional(),
});

export async function GET(request: Request) {
  const auth = await requireSession("leads:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const branchId = url.searchParams.get("branchId") ?? auth.session.user.branchIds[0];

  const leads = await db.lead.findMany({
    where: {
      ...(branchId ? { branchId } : {}),
    },
    include: {
      stage: true,
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      tasks: {
        where: { status: { in: ["TODO", "IN_PROGRESS"] } },
        select: { id: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ data: leads, meta: { total: leads.length } });
}

export async function POST(request: Request) {
  const auth = await requireSession("leads:write");
  if (!auth.ok) return auth.response;

  const payload = createLeadSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const lead = await db.lead.create({
    data: {
      ...payload.data,
      potentialValue: payload.data.potentialValue,
      assignedToId: auth.session.user.id,
      sourceDetail: "manual-create",
    },
    include: {
      stage: true,
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      tasks: {
        where: { status: { in: ["TODO", "IN_PROGRESS"] } },
        select: { id: true },
      },
    },
  });

  await publishRealtimeEvent({
    type: "lead.created",
    branchId: lead.branchId,
    data: {
      leadId: lead.id,
      fullName: lead.fullName,
    },
  });

  return NextResponse.json({ data: lead }, { status: 201 });
}
