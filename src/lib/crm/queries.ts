import { LeadStatus, Prisma } from "@prisma/client";

import { db } from "@/lib/db";

type DashboardFilters = {
  branchId?: string;
  advisorId?: string;
  channel?: string;
  from?: Date;
  to?: Date;
};

function defaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return { start, end };
}

function buildWhere(filters: DashboardFilters): Prisma.MessageWhereInput {
  const range = defaultDateRange();

  return {
    ...(filters.channel ? { conversation: { channel: filters.channel as never } } : {}),
    ...(filters.branchId ? { conversation: { branchId: filters.branchId } } : {}),
    createdAt: {
      gte: filters.from ?? range.start,
      lte: filters.to ?? range.end,
    },
  };
}

const mockDashboard = {
  incomingMessages: 312,
  openChats: 48,
  unanswered: 17,
  avgResponseMinutes: 5.2,
  activeLeads: 126,
  wonLeads: 33,
  pendingTasks: 41,
  conversionRate: 26.1,
};

export async function getDashboardMetrics(filters: DashboardFilters = {}) {
  try {
    const where = buildWhere(filters);

    const [incomingMessages, openChats, unanswered, responseSamples, activeLeads, wonLeads, pendingTasks] =
      await Promise.all([
        db.message.count({ where: { ...where, direction: "INBOUND" } }),
        db.conversation.count({ where: { status: "OPEN", ...(filters.branchId ? { branchId: filters.branchId } : {}) } }),
        db.conversation.count({
          where: {
            status: "OPEN",
            unreadCount: { gt: 0 },
            ...(filters.branchId ? { branchId: filters.branchId } : {}),
          },
        }),
        db.message.findMany({
          where: {
            ...where,
            direction: "OUTBOUND",
          },
          select: {
            metadata: true,
          },
          take: 200,
        }),
        db.lead.count({
          where: {
            status: {
              in: [LeadStatus.NEW, LeadStatus.QUALIFIED, LeadStatus.PROPOSAL, LeadStatus.NEGOTIATION],
            },
            ...(filters.branchId ? { branchId: filters.branchId } : {}),
          },
        }),
        db.lead.count({
          where: {
            status: LeadStatus.WON,
            ...(filters.branchId ? { branchId: filters.branchId } : {}),
          },
        }),
        db.task.count({
          where: {
            status: { in: ["TODO", "IN_PROGRESS"] },
            ...(filters.branchId ? { branchId: filters.branchId } : {}),
          },
        }),
      ]);

    const conversionRate = activeLeads > 0 ? Number(((wonLeads / (activeLeads + wonLeads)) * 100).toFixed(1)) : 0;
    const responseTimes = responseSamples
      .map((item) => {
        const metadata = item.metadata as { responseTimeMs?: number } | null;
        return metadata?.responseTimeMs;
      })
      .filter((value): value is number => typeof value === "number");
    const avgResponseMinutes = responseTimes.length
      ? Number((responseTimes.reduce((total, value) => total + value, 0) / responseTimes.length / 60000).toFixed(1))
      : 0;

    return {
      incomingMessages,
      openChats,
      unanswered,
      avgResponseMinutes,
      activeLeads,
      wonLeads,
      pendingTasks,
      conversionRate,
    };
  } catch {
    return mockDashboard;
  }
}

export async function getKanbanLeads(branchId?: string) {
  try {
    const stages = await db.pipelineStage.findMany({
      orderBy: { order: "asc" },
      include: {
        leads: {
          where: branchId ? { branchId } : undefined,
          include: {
            assignedTo: {
              select: { id: true, name: true, email: true },
            },
            tasks: {
              where: { status: { in: ["TODO", "IN_PROGRESS"] } },
              select: { id: true },
            },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    return stages;
  } catch {
    return [];
  }
}

export async function getInboxConversations(branchId?: string) {
  try {
    return await db.conversation.findMany({
      where: {
        ...(branchId ? { branchId } : {}),
      },
      include: {
        lead: {
          select: {
            id: true,
            fullName: true,
            tags: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            direction: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch {
    return [];
  }
}

export async function getTaskBoard(branchId?: string) {
  try {
    return await db.task.findMany({
      where: {
        ...(branchId ? { branchId } : {}),
      },
      include: {
        lead: {
          select: { id: true, fullName: true },
        },
        assignedTo: {
          select: { id: true, name: true },
        },
      },
      orderBy: [{ dueAt: "asc" }, { priority: "desc" }],
    });
  } catch {
    return [];
  }
}

export type LeadDetailRecord = Prisma.LeadGetPayload<{
  include: {
    assignedTo: {
      select: { id: true; name: true; email: true };
    };
    stage: true;
    tasks: true;
    leadNotes: true;
    purchases: true;
    conversations: {
      include: {
        messages: true;
      };
    };
  };
}>;

export async function getLeadById(leadId: string): Promise<LeadDetailRecord | null> {
  try {
    return await db.lead.findUnique({
      where: { id: leadId },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        stage: true,
        tasks: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        leadNotes: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        purchases: {
          orderBy: { purchasedAt: "desc" },
          take: 20,
        },
        conversations: {
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 30,
            },
          },
          orderBy: { updatedAt: "desc" },
          take: 3,
        },
      },
    });
  } catch {
    return null;
  }
}
