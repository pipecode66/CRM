import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";

const campaignSchema = z.object({
  name: z.string().min(2),
  channel: z.enum(["WHATSAPP", "EMAIL", "INSTAGRAM", "FACEBOOK"]).default("WHATSAPP"),
  branchId: z.string().min(1),
  templateId: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  segment: z
    .object({
      tags: z.array(z.string()).optional(),
      status: z.array(z.string()).optional(),
      inactiveDays: z.number().int().optional(),
    })
    .optional(),
});

export async function GET(request: Request) {
  const auth = await requireSession("campaigns:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const branchId = url.searchParams.get("branchId") ?? auth.session.user.branchIds[0];

  const campaigns = await db.campaign.findMany({
    where: {
      ...(branchId ? { branchId } : {}),
    },
    include: {
      template: true,
      deliveries: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ data: campaigns, meta: { total: campaigns.length } });
}

export async function POST(request: Request) {
  const auth = await requireSession("campaigns:write");
  if (!auth.ok) return auth.response;

  const payload = campaignSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const campaign = await db.campaign.create({
    data: {
      name: payload.data.name,
      channel: payload.data.channel,
      branchId: payload.data.branchId,
      templateId: payload.data.templateId,
      createdById: auth.session.user.id,
      scheduledAt: payload.data.scheduledAt ? new Date(payload.data.scheduledAt) : undefined,
      status: payload.data.scheduledAt ? "SCHEDULED" : "DRAFT",
      segment: payload.data.segment,
    },
  });

  return NextResponse.json({ data: campaign }, { status: 201 });
}
