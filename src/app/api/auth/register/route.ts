import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z
    .enum(["ADMIN", "SUPERVISOR", "SALES_ADVISOR", "CUSTOMER_SUPPORT", "MARKETING"])
    .default("SALES_ADVISOR"),
  locale: z.enum(["es", "en"]).default("es"),
  branchId: z.string().min(1),
});

export async function POST(request: Request) {
  const payload = registerSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const existing = await db.user.findUnique({
    where: {
      email: payload.data.email.toLowerCase(),
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await hash(payload.data.password, 12);

  const user = await db.user.create({
    data: {
      email: payload.data.email.toLowerCase(),
      name: payload.data.name,
      passwordHash,
      role: payload.data.role,
      locale: payload.data.locale,
      branches: {
        create: {
          branchId: payload.data.branchId,
          isDefault: true,
        },
      },
    },
    select: {
      id: true,
      email: true,
      role: true,
      locale: true,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
