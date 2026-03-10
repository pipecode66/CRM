import { Prisma } from "@prisma/client";
import OpenAI from "openai";

import { requiresCriticalApproval, sanitizePrompt } from "@/lib/ai/guardrails";
import { retrieveKnowledge } from "@/lib/ai/knowledge";
import { researchAllowedWeb } from "@/lib/ai/web-research";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

export type AgentInput = {
  leadId?: string;
  conversationId?: string;
  message: string;
  language?: "es" | "en";
  webUrls?: string[];
};

export type AgentOutput = {
  reply: string;
  confidence: number;
  requiresApproval: boolean;
  citations: Array<{
    type: "knowledge" | "web";
    title: string;
    url?: string;
    excerpt: string;
  }>;
};

const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

function composeSystemPrompt(language: "es" | "en") {
  if (language === "en") {
    return `You are an autonomous CRM AI agent for sales/support.
- Be concise, commercial, and polite.
- Ask for missing lead qualification fields.
- If user asks for sensitive actions (payments/discounts/private data), mention human validation is required.
- Always include source references from supplied context.`;
  }

  return `Eres un agente IA autÃ³nomo de CRM para ventas/soporte.
- Responde de forma breve, comercial y cordial.
- Solicita datos faltantes para calificar leads.
- Si hay acciones sensibles (pagos/descuentos/datos privados), indica que requiere validaciÃ³n humana.
- Incluye referencias de las fuentes de contexto entregadas.`;
}

export async function runAIAgent(input: AgentInput): Promise<AgentOutput> {
  const language = input.language ?? "es";
  const cleanMessage = sanitizePrompt(input.message);
  const approvalNeeded = requiresCriticalApproval(cleanMessage);

  const [knowledge, webCitations] = await Promise.all([
    retrieveKnowledge(cleanMessage, 5),
    input.webUrls?.length ? researchAllowedWeb(input.webUrls, cleanMessage) : Promise.resolve([]),
  ]);

  const contextLines = [
    ...knowledge.map((item) => `[KNOWLEDGE] ${item.title}: ${item.content.slice(0, 380)}`),
    ...webCitations.map((item) => `[WEB] ${item.title} (${item.url}): ${item.excerpt}`),
  ];

  let reply =
    language === "en"
      ? "I got your request. I can help with details, pricing, and next steps."
      : "RecibÃ­ tu solicitud. Te puedo ayudar con detalles, precios y prÃ³ximos pasos.";
  let confidence = 0.62;

  if (client) {
    const completion = await client.responses.create({
      model: env.OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: composeSystemPrompt(language),
        },
        {
          role: "user",
          content: `Mensaje cliente: ${cleanMessage}\n\nContexto:\n${contextLines.join("\n")}`,
        },
      ],
      temperature: 0.3,
    });

    reply = completion.output_text || reply;
    confidence = approvalNeeded ? 0.5 : 0.83;
  }

  const citations = [
    ...knowledge.slice(0, 3).map((item) => ({
      type: "knowledge" as const,
      title: item.title,
      excerpt: item.content.slice(0, 140),
      ...(item.sourceUrl ? { url: item.sourceUrl } : {}),
    })),
    ...webCitations.slice(0, 3).map((item) => ({
      type: "web" as const,
      title: item.title,
      excerpt: item.excerpt,
      url: item.url,
    })),
  ];

  await db.aIAgentDecision
    .create({
      data: {
        leadId: input.leadId,
        conversationId: input.conversationId,
        action: "AUTO_REPLY",
        confidence,
        reasoning: "Autonomous response generated",
        requiresApproval: approvalNeeded,
        citations: citations as Prisma.InputJsonValue,
        metadata: {
          language,
        } as Prisma.InputJsonValue,
      },
    })
    .catch(() => undefined);

  return {
    reply,
    confidence,
    requiresApproval: approvalNeeded,
    citations,
  };
}
