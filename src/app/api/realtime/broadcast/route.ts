import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { publishRealtimeEvent } from "@/lib/realtime/server";

const broadcastSchema = z.object({
  type: z.string().min(1),
  branchId: z.string().optional(),
  data: z.record(z.string(), z.unknown()),
});

export async function POST(request: Request) {
  const auth = await requireSession("dashboard:read");
  if (!auth.ok) return auth.response;

  const payload = broadcastSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const result = await publishRealtimeEvent(payload.data);

  return NextResponse.json({ data: result });
}
