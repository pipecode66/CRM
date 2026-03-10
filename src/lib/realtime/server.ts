import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

type BroadcastPayload = {
  type: string;
  branchId?: string;
  data: Record<string, unknown>;
};

const serverClient =
  env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function publishRealtimeEvent(payload: BroadcastPayload) {
  if (!serverClient) {
    return { ok: false, reason: "Supabase service role client not configured" };
  }

  const channel = serverClient.channel("crm-events", {
    config: {
      broadcast: {
        self: false,
      },
    },
  });

  await channel.subscribe();

  const response = await channel.send({
    type: "broadcast",
    event: payload.type,
    payload,
  });

  await channel.unsubscribe();

  return {
    ok: response === "ok",
  };
}
