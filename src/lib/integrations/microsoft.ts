import { safeJsonFetch } from "@/lib/integrations/http";

export async function sendMicrosoftMail(input: {
  accessToken: string;
  to: string;
  subject: string;
  body: string;
}) {
  const response = await safeJsonFetch<{ error?: { message: string } }>(
    "https://graph.microsoft.com/v1.0/me/sendMail",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.accessToken}`,
      },
      body: JSON.stringify({
        message: {
          subject: input.subject,
          body: {
            contentType: "Text",
            content: input.body,
          },
          toRecipients: [
            {
              emailAddress: {
                address: input.to,
              },
            },
          ],
        },
        saveToSentItems: true,
      }),
    },
  );

  if (!response || response.error) {
    return { ok: false, error: response?.error?.message ?? "Unable to send Outlook message" };
  }

  return { ok: true };
}
