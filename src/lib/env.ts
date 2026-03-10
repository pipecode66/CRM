import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  APP_NAME: z.string().default("CRM Omnicanal IA"),
  DATABASE_URL: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(16).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  META_APP_SECRET: z.string().optional(),
  META_VERIFY_TOKEN: z.string().optional(),
  META_PAGE_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  GMAIL_CLIENT_ID: z.string().optional(),
  GMAIL_CLIENT_SECRET: z.string().optional(),
  GMAIL_REDIRECT_URI: z.string().url().optional(),
  MICROSOFT_TENANT_ID: z.string().optional(),
  WEB_RESEARCH_ALLOWLIST: z.string().default("wikipedia.org,developers.facebook.com,developers.google.com"),
  ENABLE_TIKTOK: z.enum(["true", "false"]).default("false"),
  QUEUE_PROVIDER: z.enum(["memory", "upstash"]).default("memory"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn("Environment partially invalid, using safe fallbacks", parsed.error.flatten().fieldErrors);
}

export const env = parsed.success
  ? parsed.data
  : envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      APP_URL: process.env.APP_URL,
      APP_NAME: process.env.APP_NAME,
      OPENAI_MODEL: process.env.OPENAI_MODEL,
      WEB_RESEARCH_ALLOWLIST: process.env.WEB_RESEARCH_ALLOWLIST,
      ENABLE_TIKTOK: process.env.ENABLE_TIKTOK,
      QUEUE_PROVIDER: process.env.QUEUE_PROVIDER,
      LOG_LEVEL: process.env.LOG_LEVEL,
    });

export const flags = {
  tiktokEnabled: env.ENABLE_TIKTOK === "true",
};

export const webAllowlist = env.WEB_RESEARCH_ALLOWLIST.split(",")
  .map((domain) => domain.trim().toLowerCase())
  .filter(Boolean);
