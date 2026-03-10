import { NextResponse } from "next/server";

import { seedDemoData } from "../../../../prisma/seed-runtime";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden in production" }, { status: 403 });
  }

  const result = await seedDemoData();
  return NextResponse.json({ data: result });
}

