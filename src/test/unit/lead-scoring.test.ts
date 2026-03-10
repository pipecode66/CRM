import { describe, expect, it } from "vitest";

import { scoreLead } from "@/lib/ai/lead-scoring";

describe("lead scoring", () => {
  it("scores engaged lead higher", () => {
    const score = scoreLead(
      {
        id: "1",
        fullName: "Lead",
        sourceChannel: "WHATSAPP",
        status: "NEGOTIATION",
        branchId: "b1",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: null,
        lastName: null,
        phone: null,
        email: null,
        socialHandle: null,
        company: null,
        city: null,
        sourceDetail: null,
        stageId: null,
        assignedToId: null,
        potentialValue: null,
        notes: null,
        lastMessageAt: null,
      },
      {
        unreadMessages: 4,
        keywordsMatched: 2,
        lastInteractionMinutes: 10,
        hasPhone: true,
        hasEmail: true,
        estimatedValue: 800,
      },
    );

    expect(score).toBeGreaterThan(70);
  });
});
