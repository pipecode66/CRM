import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { researchAllowedWeb } from "@/lib/ai/web-research";

const webResearchSchema = z.object({
  query: z.string().min(2),
  urls: z.array(z.string().url()).min(1),
});

export async function POST(request: Request) {
  const auth = await requireSession("ai:read");
  if (!auth.ok) return auth.response;

  const payload = webResearchSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const citations = await researchAllowedWeb(payload.data.urls, payload.data.query);

  return NextResponse.json({
    data: {
      citations,
      total: citations.length,
    },
  });
}
