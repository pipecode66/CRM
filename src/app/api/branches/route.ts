import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";

const branchSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const auth = await requireSession("dashboard:read");
  if (!auth.ok) return auth.response;

  const branches = await db.branch.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: branches });
}

export async function POST(request: Request) {
  const auth = await requireSession("admin:manage_users");
  if (!auth.ok) return auth.response;

  const payload = branchSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const branch = await db.branch.create({
    data: payload.data,
  });

  return NextResponse.json({ data: branch }, { status: 201 });
}
