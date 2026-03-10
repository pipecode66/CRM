import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { extractMetaEvents, verifyMetaSignature } from "@/lib/integrations/meta";
import { verifyMetaWebhook } from "@/lib/integrations/whatsapp";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const challenge = verifyMetaWebhook(
    url.searchParams.get("hub.mode"),
    url.searchParams.get("hub.verify_token"),
    url.searchParams.get("hub.challenge"),
  );

  if (!challenge) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return new NextResponse(challenge, { status: 200 });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyMetaSignature(rawBody, signature)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(rawBody) as Record<string, unknown>;
  const events = extractMetaEvents(payload);
  const defaultBranch =
    (await db.branch.findFirst({ orderBy: { createdAt: "asc" } })) ??
    (await db.branch.create({
      data: {
        name: "Default Branch",
        code: "DEFAULT",
      },
    }));

  await db.webhookEvent.create({
    data: {
      provider: "meta",
      eventType: "meta.batch",
      payload: payload as Prisma.InputJsonValue,
      processed: false,
    },
  });

  for (const event of events) {
    const existingLead = await db.lead.findFirst({
      where: {
        sourceChannel: event.channel,
        socialHandle: event.senderId,
      },
    });

    const lead = existingLead
      ? await db.lead.update({
          where: { id: existingLead.id },
          data: {
            lastMessageAt: new Date(event.timestamp),
          },
        })
      : await db.lead.create({
          data: {
            fullName: `Social ${event.senderId}`,
            sourceChannel: event.channel,
            sourceDetail: "social-webhook",
            socialHandle: event.senderId,
            branchId: defaultBranch.id,
            lastMessageAt: new Date(event.timestamp),
          },
        });

    const conversation = await db.conversation.findFirst({
      where: {
        externalThreadId: event.externalThreadId,
      },
    });

    const conversationRecord =
      conversation ??
      (await db.conversation.create({
        data: {
          leadId: lead.id,
          branchId: lead.branchId,
          channel: event.channel,
          externalThreadId: event.externalThreadId,
          status: "OPEN",
        },
      }));

    await db.message.create({
      data: {
        conversationId: conversationRecord.id,
        leadId: lead.id,
        direction: "INBOUND",
        status: "RECEIVED",
        content: event.message ?? event.comment ?? "",
        metadata: event as unknown as Prisma.InputJsonValue,
      },
    });
  }

  return NextResponse.json({ received: true });
}
