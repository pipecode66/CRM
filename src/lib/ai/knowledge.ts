import { db } from "@/lib/db";

export type RetrievedKnowledge = {
  id: string;
  title: string;
  sourceType: string;
  sourceUrl: string | null;
  content: string;
};

export async function retrieveKnowledge(query: string, limit = 6): Promise<RetrievedKnowledge[]> {
  try {
    return await db.knowledgeDocument.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        sourceType: true,
        sourceUrl: true,
        content: true,
      },
    });
  } catch {
    return [];
  }
}
