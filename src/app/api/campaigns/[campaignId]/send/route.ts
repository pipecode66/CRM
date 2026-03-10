import { NextResponse } from "next/server";

import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";
import { renderTemplate } from "@/lib/channels/template-variables";
import { sendWhatsAppMessage } from "@/lib/integrations/whatsapp";

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export async function POST(_request: Request, context: { params: Promise<{ campaignId: string }> }) {
  const auth = await requireSession("campaigns:write");
  if (!auth.ok) return auth.response;

  const { campaignId } = await context.params;

  const campaign = await db.campaign.findUnique({
    where: { id: campaignId },
    include: {
      template: true,
    },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const segment = (campaign.segment ?? {}) as {
    tags?: string[];
    status?: string[];
    inactiveDays?: number;
  };

  const leads = await db.lead.findMany({
    where: {
      branchId: campaign.branchId,
      ...(segment.tags?.length
        ? {
            tags: {
              hasSome: segment.tags,
            },
          }
        : {}),
      ...(segment.status?.length
        ? {
            status: {
              in: segment.status as never,
            },
          }
        : {}),
      ...(segment.inactiveDays
        ? {
            OR: [{ lastMessageAt: null }, { lastMessageAt: { lte: daysAgo(segment.inactiveDays) } }],
          }
        : {}),
    },
    take: 500,
  });

  await db.campaign.update({
    where: { id: campaign.id },
    data: {
      status: "RUNNING",
      startedAt: new Date(),
    },
  });

  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    const content = campaign.template
      ? renderTemplate(campaign.template.content, {
          nombre: lead.fullName,
          empresa: lead.company,
          ciudad: lead.city,
        })
      : `Hola ${lead.fullName}, tenemos una actualización para ti.`;

    const delivery = await db.campaignDelivery.create({
      data: {
        campaignId: campaign.id,
        leadId: lead.id,
        status: "QUEUED",
      },
    });

    if (campaign.channel === "WHATSAPP") {
      const response = await sendWhatsAppMessage({
        to: lead.phone ?? "",
        body: content,
      });

      await db.campaignDelivery.update({
        where: { id: delivery.id },
        data: {
          status: response.ok ? "SENT" : "FAILED",
          errorMessage: response.ok ? null : response.error,
        },
      });

      if (response.ok) {
        sent += 1;
      } else {
        failed += 1;
      }
    }
  }

  await db.campaign.update({
    where: { id: campaign.id },
    data: {
      status: "FINISHED",
      finishedAt: new Date(),
      metrics: {
        sent,
        failed,
        totalLeads: leads.length,
      },
    },
  });

  return NextResponse.json({
    data: {
      campaignId: campaign.id,
      sent,
      failed,
      total: leads.length,
    },
  });
}
