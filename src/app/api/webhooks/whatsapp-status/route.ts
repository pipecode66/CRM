import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
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
  const payload = (await request.json()) as Record<string, unknown>;

  await db.webhookEvent.create({
    data: {
      provider: "whatsapp",
      eventType: "whatsapp.status",
      payload: payload as Prisma.InputJsonValue,
      processed: false,
    },
  });

  return NextResponse.json({ received: true });
}
