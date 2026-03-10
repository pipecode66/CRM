import { flags } from "@/lib/env";

export function isTikTokEnabled() {
  return flags.tiktokEnabled;
}

export async function processTikTokWebhook(payload: unknown) {
  if (!isTikTokEnabled()) {
    return {
      ok: false,
      reason: "TikTok adapter disabled by feature flag",
      payload,
    };
  }

  // TODO: Map TikTok events into conversations/leads once credentials are available.
  return {
    ok: true,
    received: payload,
  };
}
