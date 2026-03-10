import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";

const channelAccountSchema = z.object({
  branchId: z.string().min(1),
  channel: z.enum(["WHATSAPP", "INSTAGRAM", "FACEBOOK", "TIKTOK", "EMAIL"]),
  displayName: z.string().min(2),
  externalAccountId: z.string().min(2),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function GET(request: Request) {
  const auth = await requireSession("admin:manage_integrations");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const branchId = url.searchParams.get("branchId");

  const accounts = await db.channelAccount.findMany({
    where: {
      ...(branchId ? { branchId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: accounts });
}

export async function POST(request: Request) {
  const auth = await requireSession("admin:manage_integrations");
  if (!auth.ok) return auth.response;

  const payload = channelAccountSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const account = await db.channelAccount.create({
    data: {
      ...payload.data,
      expiresAt: payload.data.expiresAt ? new Date(payload.data.expiresAt) : undefined,
    },
  });

  return NextResponse.json({ data: account }, { status: 201 });
}
