import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { runAIAgent } from "@/lib/ai/agent";

const aiSchema = z.object({
  leadId: z.string().optional(),
  conversationId: z.string().optional(),
  message: z.string().min(1),
  language: z.enum(["es", "en"]).default("es"),
  webUrls: z.array(z.string().url()).default([]),
});

export async function POST(request: Request) {
  const auth = await requireSession("ai:write");
  if (!auth.ok) return auth.response;

  const payload = aiSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const result = await runAIAgent(payload.data);

  return NextResponse.json({ data: result });
}
