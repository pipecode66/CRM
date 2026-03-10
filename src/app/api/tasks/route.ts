import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";

const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  branchId: z.string().min(1),
  leadId: z.string().optional(),
  assignedToId: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueAt: z.string().datetime().optional(),
});

export async function GET(request: Request) {
  const auth = await requireSession("tasks:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const branchId = url.searchParams.get("branchId") ?? auth.session.user.branchIds[0];
  const status = url.searchParams.get("status");

  const tasks = await db.task.findMany({
    where: {
      ...(branchId ? { branchId } : {}),
      ...(status ? { status: status as never } : {}),
    },
    include: {
      lead: {
        select: { id: true, fullName: true },
      },
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: [{ dueAt: "asc" }, { priority: "desc" }],
  });

  return NextResponse.json({ data: tasks, meta: { total: tasks.length } });
}

export async function POST(request: Request) {
  const auth = await requireSession("tasks:write");
  if (!auth.ok) return auth.response;

  const payload = taskSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const task = await db.task.create({
    data: {
      ...payload.data,
      dueAt: payload.data.dueAt ? new Date(payload.data.dueAt) : undefined,
      createdById: auth.session.user.id,
      assignedToId: payload.data.assignedToId ?? auth.session.user.id,
    },
  });

  return NextResponse.json({ data: task }, { status: 201 });
}
