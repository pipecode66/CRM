import { InboxBoard } from "@/components/crm/inbox-board";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { db } from "@/lib/db";
import { getInboxConversations } from "@/lib/crm/queries";

export default async function InboxPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = getDictionary(locale);

  const [conversations, templates] = await Promise.all([
    getInboxConversations(),
    db.template.findMany({
      where: { isActive: true },
      take: 30,
      select: {
        slug: true,
        content: true,
      },
      orderBy: { updatedAt: "desc" },
    }).catch(() => []),
  ]);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">{dictionary.inbox.title}</h2>
        <p className="text-sm text-slate-500">
          WhatsApp, Instagram, Facebook y Email en una sola bandeja con historial por lead.
        </p>
      </header>

      <InboxBoard
        conversations={conversations.map((conversation) => ({
          ...conversation,
          messages: conversation.messages.map((message) => ({
            ...message,
            createdAt: message.createdAt.toISOString(),
          })),
        }))}
        templates={templates}
      />
    </section>
  );
}
