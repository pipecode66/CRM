import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";

const createConversationSchema = z.object({
  leadId: z.string().min(1),
  branchId: z.string().min(1),
  channel: z.enum(["WHATSAPP", "INSTAGRAM", "FACEBOOK", "TIKTOK", "EMAIL", "WEB"]),
  externalThreadId: z.string().optional(),
});

export async function GET(request: Request) {
  const auth = await requireSession("inbox:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversationId");
  const leadId = url.searchParams.get("leadId");

  if (conversationId) {
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        lead: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({ data: conversation });
  }

  const conversations = await db.conversation.findMany({
    where: {
      ...(leadId ? { leadId } : {}),
      ...(auth.session.user.branchIds.length
        ? {
            branchId: {
              in: auth.session.user.branchIds,
            },
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ data: conversations });
}

export async function POST(request: Request) {
  const auth = await requireSession("inbox:reply");
  if (!auth.ok) return auth.response;

  const payload = createConversationSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const conversation = await db.conversation.create({
    data: {
      ...payload.data,
      assignedToId: auth.session.user.id,
      status: "OPEN",
      lastMessageAt: new Date(),
    },
  });

  return NextResponse.json({ data: conversation }, { status: 201 });
}
