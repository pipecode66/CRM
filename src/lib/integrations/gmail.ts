import { google } from "googleapis";

import { env } from "@/lib/env";

function createOAuthClient() {
  if (!env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REDIRECT_URI) {
    return null;
  }

  return new google.auth.OAuth2(env.GMAIL_CLIENT_ID, env.GMAIL_CLIENT_SECRET, env.GMAIL_REDIRECT_URI);
}

export async function sendGmailMessage(params: { accessToken: string; to: string; subject: string; text: string }) {
  const auth = createOAuthClient();
  if (!auth) {
    return { ok: false, error: "Gmail OAuth credentials missing" };
  }

  auth.setCredentials({ access_token: params.accessToken });
  const gmail = google.gmail({ version: "v1", auth });

  const rawMessage = Buffer.from(
    `To: ${params.to}\r\nSubject: ${params.subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${params.text}`,
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  try {
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: rawMessage },
    });

    return { ok: true, id: response.data.id };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to send Gmail message",
    };
  }
}
