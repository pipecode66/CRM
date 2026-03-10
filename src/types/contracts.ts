import type {
  AIAgentDecision,
  Branch,
  Campaign,
  CampaignDelivery,
  ChannelAccount,
  Conversation,
  KnowledgeDocument,
  Lead,
  Message,
  PipelineStage,
  Task,
  Template,
  Workflow,
  WorkflowRun,
} from "@prisma/client";

export type LeadWithRelations = Lead & {
  stage: PipelineStage | null;
  assignedTo: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  tasks: Task[];
};

export type ConversationWithMessages = Conversation & {
  lead: Pick<Lead, "id" | "fullName" | "phone" | "email" | "tags">;
  messages: Message[];
};

export type CampaignWithDeliveries = Campaign & {
  deliveries: CampaignDelivery[];
};

export type WorkflowWithRuns = Workflow & {
  runs: WorkflowRun[];
};

export type CRMApiResponse<T> = {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
};

export type CRMEntities = {
  Lead: Lead;
  Conversation: Conversation;
  Message: Message;
  PipelineStage: PipelineStage;
  Task: Task;
  Template: Template;
  Campaign: Campaign;
  Workflow: Workflow;
  WorkflowRun: WorkflowRun;
  AIAgentDecision: AIAgentDecision;
  KnowledgeDocument: KnowledgeDocument;
  ChannelAccount: ChannelAccount;
  Branch: Branch;
};
