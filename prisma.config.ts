import "dotenv/config";

import { defineConfig } from "prisma/config";

const SUPABASE_FALLBACK_DATABASE_URL =
  "postgresql://postgres.project_ref:replace_with_password@aws-0-us-east-1.pooler.supabase.com:6543/postgres";

function isSupabaseConnectionString(url: string): boolean {
  return url.includes("supabase.com") || url.includes("supabase.co");
}

const datasourceUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  SUPABASE_FALLBACK_DATABASE_URL;

if (!isSupabaseConnectionString(datasourceUrl)) {
  console.warn("Prisma datasource URL does not look like Supabase. Expected Supabase Postgres connection string.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});

