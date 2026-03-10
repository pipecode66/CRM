import { env } from "@/lib/env";
import { safeJsonFetch } from "@/lib/integrations/http";

const whatsappBase = "https://graph.facebook.com/v21.0";

export type SendWhatsAppMessageInput = {
  to: string;
  body: string;
};

export async function sendWhatsAppMessage(input: SendWhatsAppMessageInput) {
  if (!env.WHATSAPP_PHONE_NUMBER_ID || !env.WHATSAPP_ACCESS_TOKEN) {
    return { ok: false, error: "WhatsApp credentials missing" };
  }

  const url = `${whatsappBase}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to: input.to,
    type: "text",
    text: {
      body: input.body,
    },
  };

  const response = await safeJsonFetch<{ messages?: Array<{ id: string }>; error?: { message: string } }>(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response || response.error) {
    return { ok: false, error: response?.error?.message ?? "Unknown WhatsApp send error" };
  }

  return {
    ok: true,
    messageId: response.messages?.[0]?.id,
  };
}

export function verifyMetaWebhook(mode: string | null, token: string | null, challenge: string | null) {
  if (mode === "subscribe" && token && env.META_VERIFY_TOKEN && token === env.META_VERIFY_TOKEN) {
    return challenge;
  }
  return null;
}
