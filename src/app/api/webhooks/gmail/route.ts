import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(request: Request) {
  const payload = (await request.json()) as Record<string, unknown>;

  await db.webhookEvent.create({
    data: {
      provider: "gmail",
      eventType: "gmail.notification",
      payload: payload as Prisma.InputJsonValue,
      processed: false,
    },
  });

  return NextResponse.json({ received: true });
}
