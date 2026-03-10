import type { Lead } from "@prisma/client";

export type LeadSignal = {
  unreadMessages: number;
  keywordsMatched: number;
  lastInteractionMinutes: number;
  hasPhone: boolean;
  hasEmail: boolean;
  estimatedValue?: number;
};

export function scoreLead(lead: Lead, signal: LeadSignal): number {
  let score = 0;

  score += Math.min(signal.unreadMessages * 4, 20);
  score += Math.min(signal.keywordsMatched * 8, 24);
  score += signal.lastInteractionMinutes < 30 ? 20 : signal.lastInteractionMinutes < 180 ? 10 : 0;
  score += signal.hasPhone ? 12 : 0;
  score += signal.hasEmail ? 8 : 0;
  score += signal.estimatedValue && signal.estimatedValue > 0 ? Math.min(signal.estimatedValue / 50, 16) : 0;

  if (lead.status === "NEGOTIATION") score += 8;
  if (lead.status === "QUALIFIED") score += 5;

  return Math.min(Math.round(score), 100);
}
