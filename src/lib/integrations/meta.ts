import crypto from "crypto";

import { env } from "@/lib/env";

export function verifyMetaSignature(rawBody: string, signature: string | null): boolean {
  if (!signature || !env.META_APP_SECRET) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", env.META_APP_SECRET)
    .update(rawBody)
    .digest("hex");

  const received = signature.replace("sha256=", "");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export type MetaIncomingEvent = {
  channel: "INSTAGRAM" | "FACEBOOK";
  externalThreadId: string;
  senderId: string;
  message?: string;
  comment?: string;
  timestamp: number;
};

export function extractMetaEvents(payload: Record<string, unknown>): MetaIncomingEvent[] {
  const events: MetaIncomingEvent[] = [];
  const entries = Array.isArray(payload.entry) ? payload.entry : [];

  for (const entry of entries) {
    const safeEntry = entry as Record<string, unknown>;
    const messaging = Array.isArray(safeEntry.messaging) ? safeEntry.messaging : [];

    for (const item of messaging) {
      const messageItem = item as Record<string, unknown>;
      const sender = messageItem.sender as { id?: string } | undefined;
      const recipient = messageItem.recipient as { id?: string } | undefined;
      const message = messageItem.message as { text?: string } | undefined;

      if (sender?.id && recipient?.id) {
        events.push({
          channel: "FACEBOOK",
          externalThreadId: `${sender.id}:${recipient.id}`,
          senderId: sender.id,
          message: message?.text,
          timestamp: Number(messageItem.timestamp ?? Date.now()),
        });
      }
    }

    const changes = Array.isArray(safeEntry.changes) ? safeEntry.changes : [];
    for (const change of changes) {
      const safeChange = change as Record<string, unknown>;
      const value = safeChange.value as Record<string, unknown> | undefined;

      if (!value) continue;

      if (typeof value.comment_id === "string") {
        events.push({
          channel: "INSTAGRAM",
          externalThreadId: String(value.comment_id),
          senderId: String(value.from?.toString?.() ?? "unknown"),
          comment: String(value.text ?? ""),
          timestamp: Date.now(),
        });
      }
    }
  }

  return events;
}
