import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const SUPABASE_FALLBACK_DATABASE_URL =
  "postgresql://postgres.project_ref:replace_with_password@aws-0-us-east-1.pooler.supabase.com:6543/postgres";

function isSupabaseConnectionString(url: string): boolean {
  return url.includes("supabase.com") || url.includes("supabase.co");
}

const connectionString =
  process.env.DATABASE_URL ??
  process.env.DIRECT_URL ??
  SUPABASE_FALLBACK_DATABASE_URL;

if (process.env.NODE_ENV !== "test" && !isSupabaseConnectionString(connectionString)) {
  console.warn(
    "DATABASE_URL/DIRECT_URL does not look like Supabase. This CRM is configured to run with Supabase Postgres.",
  );
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

