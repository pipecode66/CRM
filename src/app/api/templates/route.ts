import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";
import { extractTemplateVariables } from "@/lib/channels/template-variables";

const templateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.enum([
    "WELCOME",
    "SALES",
    "MENU",
    "CATALOG",
    "PRICING",
    "PAYMENTS",
    "LOCATION",
    "FOLLOW_UP",
    "CLOSING",
    "POST_SALE",
    "REACTIVATION",
  ]),
  language: z.enum(["es", "en"]).default("es"),
  content: z.string().min(2),
  isActive: z.boolean().default(true),
});

export async function GET(request: Request) {
  const auth = await requireSession("templates:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const category = url.searchParams.get("category");

  const templates = await db.template.findMany({
    where: {
      ...(category ? { category: category as never } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ data: templates, meta: { total: templates.length } });
}

export async function POST(request: Request) {
  const auth = await requireSession("templates:write");
  if (!auth.ok) return auth.response;

  const payload = templateSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const template = await db.template.create({
    data: {
      ...payload.data,
      variables: extractTemplateVariables(payload.data.content),
      createdById: auth.session.user.id,
    },
  });

  return NextResponse.json({ data: template }, { status: 201 });
}
