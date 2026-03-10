import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";

const updateTaskSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assignedToId: z.string().nullable().optional(),
  dueAt: z.string().datetime().nullable().optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ taskId: string }> }) {
  const auth = await requireSession("tasks:write");
  if (!auth.ok) return auth.response;

  const { taskId } = await context.params;
  const payload = updateTaskSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const task = await db.task.update({
    where: { id: taskId },
    data: {
      ...payload.data,
      dueAt:
        payload.data.dueAt === undefined
          ? undefined
          : payload.data.dueAt === null
            ? null
            : new Date(payload.data.dueAt),
    },
  });

  return NextResponse.json({ data: task });
}
