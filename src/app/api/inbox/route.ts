import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";
import { publishRealtimeEvent } from "@/lib/realtime/server";

const sendMessageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1),
  status: z.enum(["SENT", "DELIVERED", "SEEN", "FAILED"]).default("SENT"),
});

export async function GET(request: Request) {
  const auth = await requireSession("inbox:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const branchId = url.searchParams.get("branchId") ?? auth.session.user.branchIds[0];

  const conversations = await db.conversation.findMany({
    where: {
      ...(branchId ? { branchId } : {}),
    },
    include: {
      lead: {
        select: {
          id: true,
          fullName: true,
          tags: true,
          phone: true,
          sourceChannel: true,
        },
      },
      assignedTo: {
        select: { id: true, name: true },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ data: conversations, meta: { total: conversations.length } });
}

export async function POST(request: Request) {
  const auth = await requireSession("inbox:reply");
  if (!auth.ok) return auth.response;

  const payload = sendMessageSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const conversation = await db.conversation.findUnique({
    where: { id: payload.data.conversationId },
    select: { id: true, leadId: true, branchId: true },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const message = await db.message.create({
    data: {
      conversationId: conversation.id,
      leadId: conversation.leadId,
      direction: "OUTBOUND",
      status: payload.data.status,
      content: payload.data.content,
      sentByUserId: auth.session.user.id,
      sentAt: new Date(),
    },
  });

  await db.conversation.update({
    where: { id: conversation.id },
    data: {
      lastMessageAt: message.createdAt,
      updatedAt: new Date(),
    },
  });

  await publishRealtimeEvent({
    type: "message.sent",
    branchId: conversation.branchId,
    data: {
      conversationId: conversation.id,
      messageId: message.id,
      content: message.content,
    },
  });

  return NextResponse.json({ data: message }, { status: 201 });
}
