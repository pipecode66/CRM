import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { processTikTokWebhook } from "@/lib/integrations/tiktok";

export async function POST(request: Request) {
  const payload = (await request.json()) as Record<string, unknown>;

  await db.webhookEvent.create({
    data: {
      provider: "tiktok",
      eventType: "tiktok.event",
      payload: payload as Prisma.InputJsonValue,
      processed: false,
    },
  });

  const result = await processTikTokWebhook(payload);

  return NextResponse.json({ data: result });
}
