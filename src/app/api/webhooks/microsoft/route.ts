import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const validationToken = url.searchParams.get("validationToken");

  if (validationToken) {
    return new NextResponse(validationToken, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Record<string, unknown>;

  await db.webhookEvent.create({
    data: {
      provider: "microsoft",
      eventType: "graph.notification",
      payload: payload as Prisma.InputJsonValue,
      processed: false,
    },
  });

  return NextResponse.json({ received: true });
}
