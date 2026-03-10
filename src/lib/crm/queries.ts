// Mock data - database tables need to be created first
// Run `pnpm db:push` to create tables in your Supabase database

type DashboardFilters = {
  branchId?: string;
  advisorId?: string;
  channel?: string;
  from?: Date;
  to?: Date;
};

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

export async function getDashboardMetrics(_filters: DashboardFilters = {}) {
  // Return mock data until database tables are created
  // TODO: Implement real Prisma queries after running `pnpm db:push`
  return mockDashboard;
}

export async function getKanbanLeads(_branchId?: string) {
  // Return empty stages until database is set up
  return [];
}

export async function getInboxConversations(_branchId?: string) {
  // Return empty conversations until database is set up
  return [];
}

export async function getTaskBoard(_branchId?: string) {
  // Return empty tasks until database is set up
  return [];
}

export async function getLeadById(_leadId: string) {
  // Return null until database is set up
  return null;
}

export async function getTemplates() {
  // Return empty templates until database is set up
  return [] as Array<{ slug: string; content: string }>;
}

export async function getTemplatesFull() {
  // Return empty templates until database is set up
  return [] as Array<{
    id: string;
    slug: string;
    content: string;
    category: string;
    variables: string[];
  }>;
}

export async function getWorkflows() {
  // Return empty workflows until database is set up
  return [] as Array<{
    id: string;
    name: string;
    trigger: string;
    version: number;
    active: boolean;
  }>;
}

export async function getReportsData() {
  // Return empty reports until database is set up
  return {
    leadsByChannel: [] as Array<{ channel: string; count: number }>,
    aiPerformance: [] as Array<{ action: string; count: number; avgConfidence: number }>,
  };
}

export async function getCampaigns() {
  // Return empty campaigns until database is set up
  return [] as Array<{
    id: string;
    name: string;
    status: string;
    channel: string;
    deliveriesCount: number;
    templateName: string | null;
    metrics: Record<string, unknown>;
  }>;
}
