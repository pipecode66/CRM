import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

export const supabaseBrowserClient =
  env.SUPABASE_URL && env.SUPABASE_ANON_KEY
    ? createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
    : null;

export const realtimeChannelName = "crm-events";
