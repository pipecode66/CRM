import { NextResponse } from "next/server";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";

function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export async function GET(request: Request) {
  const auth = await requireSession("reports:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const branchId = url.searchParams.get("branchId") ?? auth.session.user.branchIds[0];
  const from = parseDate(url.searchParams.get("from"));
  const to = parseDate(url.searchParams.get("to"));

  const messageWhere = {
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: to } : {}),
          },
        }
      : {}),
    conversation: {
      ...(branchId ? { branchId } : {}),
    },
  };

  const [leadsByChannel, conversationsByAdvisor, templateResponses, aiPerformance, recoveries] = await Promise.all([
    db.lead.groupBy({
      by: ["sourceChannel"],
      where: branchId ? { branchId } : undefined,
      _count: { _all: true },
    }),
    db.conversation.groupBy({
      by: ["assignedToId"],
      where: branchId ? { branchId } : undefined,
      _count: { _all: true },
    }),
    db.message.groupBy({
      by: ["templateId"],
      where: {
        ...messageWhere,
        templateId: {
          not: null,
        },
      },
      _count: { _all: true },
    }),
    db.aIAgentDecision.groupBy({
      by: ["action"],
      _count: { _all: true },
      _avg: { confidence: true },
    }),
    db.campaignDelivery.groupBy({
      by: ["status"],
      _count: { _all: true },
      where: {
        campaign: {
          ...(branchId ? { branchId } : {}),
        },
      },
    }),
  ]);

  return NextResponse.json({
    data: {
      leadsByChannel,
      conversationsByAdvisor,
      templateResponses,
      aiPerformance,
      recoveries,
    },
  });
}

