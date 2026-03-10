import { webAllowlist } from "@/lib/env";

export type WebCitation = {
  url: string;
  title: string;
  excerpt: string;
};

function isAllowedUrl(rawUrl: string): boolean {
  try {
    const { hostname } = new URL(rawUrl);
    return webAllowlist.some((allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`));
  } catch {
    return false;
  }
}

function extractTitle(html: string): string {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  return titleMatch?.[1]?.trim() ?? "Untitled";
}

function extractPlainText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function researchAllowedWeb(urls: string[], query: string): Promise<WebCitation[]> {
  const citations: WebCitation[] = [];

  for (const url of urls) {
    if (!isAllowedUrl(url)) {
      continue;
    }

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "CRM-Omnicanal-IA/1.0",
        },
      });

      if (!response.ok) {
        continue;
      }

      const html = await response.text();
      const title = extractTitle(html);
      const plainText = extractPlainText(html);

      const queryIndex = plainText.toLowerCase().indexOf(query.toLowerCase());
      const start = Math.max(0, queryIndex === -1 ? 0 : queryIndex - 120);
      const excerpt = plainText.slice(start, start + 240);

      citations.push({
        url,
        title,
        excerpt,
      });
    } catch {
      continue;
    }
  }

  return citations;
}
