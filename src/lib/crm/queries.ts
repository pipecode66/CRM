// Mock data - database tables need to be created first.
// Run `pnpm db:push` to create tables in your Supabase database.

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

export type KanbanLeadRecord = {
  id: string;
  fullName: string;
  sourceChannel: string;
  tags: string[];
  potentialValue: number | null;
  assignedTo: { id: string; name: string | null; email: string } | null;
  tasks: Array<{ id: string }>;
};

export type KanbanStageRecord = {
  id: string;
  name: string;
  color: string;
  leads: KanbanLeadRecord[];
};

export type InboxConversationRecord = {
  id: string;
  channel: string;
  status: string;
  unreadCount: number;
  lead: {
    id: string;
    fullName: string;
    tags: string[];
  };
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
    direction: string;
  }>;
};

export type TaskBoardRecord = {
  id: string;
  title: string;
  priority: string;
  status: string;
  dueAt: Date | null;
  lead: { fullName: string } | null;
  assignedTo: { name: string | null } | null;
};

export type LeadDetailRecord = {
  fullName: string;
  email: string | null;
  phone: string | null;
  sourceChannel: string;
  tags: string[];
  conversations: Array<{
    id: string;
    channel: string;
    status: string;
    messages: Array<{ content: string }>;
  }>;
  tasks: Array<{ id: string; title: string; status: string }>;
  purchases: Array<{ id: string; productName: string; total: { toString(): string } }>;
};

export async function getDashboardMetrics(_filters: DashboardFilters = {}) {
  // Return mock data until database tables are created.
  return mockDashboard;
}

export async function getKanbanLeads(_branchId?: string): Promise<KanbanStageRecord[]> {
  // Return empty stages until database is set up.
  return [];
}

export async function getInboxConversations(_branchId?: string): Promise<InboxConversationRecord[]> {
  // Return empty conversations until database is set up.
  return [];
}

export async function getTaskBoard(_branchId?: string): Promise<TaskBoardRecord[]> {
  // Return empty tasks until database is set up.
  return [];
}

export async function getLeadById(_leadId: string): Promise<LeadDetailRecord | null> {
  // Return null until database is set up.
  return null;
}

export async function getTemplates() {
  // Return empty templates until database is set up.
  return [] as Array<{ slug: string; content: string }>;
}

export async function getTemplatesFull() {
  // Return empty templates until database is set up.
  return [] as Array<{
    id: string;
    slug: string;
    content: string;
    category: string;
    variables: string[];
  }>;
}

export async function getWorkflows() {
  // Return empty workflows until database is set up.
  return [] as Array<{
    id: string;
    name: string;
    trigger: string;
    version: number;
    active: boolean;
  }>;
}

export async function getReportsData() {
  // Return empty reports until database is set up.
  return {
    leadsByChannel: [] as Array<{ channel: string; count: number }>,
    aiPerformance: [] as Array<{ action: string; count: number; avgConfidence: number }>,
  };
}

export async function getCampaigns() {
  // Return empty campaigns until database is set up.
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
