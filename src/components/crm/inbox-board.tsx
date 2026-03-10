"use client";

import { useMemo, useState } from "react";

type InboxMessage = {
  id: string;
  content: string;
  createdAt: string;
  direction: string;
};

type InboxConversation = {
  id: string;
  channel: string;
  status: string;
  unreadCount: number;
  lead: {
    id: string;
    fullName: string;
    tags: string[];
  };
  messages: InboxMessage[];
};

type TemplateItem = {
  slug: string;
  content: string;
};

export function InboxBoard({
  conversations,
  templates,
}: {
  conversations: InboxConversation[];
  templates: TemplateItem[];
}) {
  const [draft, setDraft] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(conversations[0]?.id ?? null);

  const suggestions = useMemo(() => {
    if (!draft.startsWith("/")) return [];
    const token = draft.slice(1).toLowerCase();
    return templates.filter((template) => template.slug.toLowerCase().includes(token)).slice(0, 5);
  }, [draft, templates]);

  const activeConversation = conversations.find((conversation) => conversation.id === selectedConversation) ?? null;

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <aside className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => setSelectedConversation(conversation.id)}
            className={`w-full rounded-xl border px-3 py-2 text-left transition ${
              selectedConversation === conversation.id
                ? "border-teal-300 bg-teal-50"
                : "border-slate-200 bg-white hover:border-teal-200"
            }`}
          >
            <p className="text-sm font-bold text-slate-900">{conversation.lead.fullName}</p>
            <p className="text-xs text-slate-500">{conversation.channel}</p>
            <p className="mt-1 line-clamp-1 text-xs text-slate-600">{conversation.messages[0]?.content ?? "Sin mensajes"}</p>
          </button>
        ))}
      </aside>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        {activeConversation ? (
          <>
            <header className="mb-3 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">{activeConversation.lead.fullName}</h3>
              <p className="text-xs text-slate-500">{activeConversation.channel} · {activeConversation.status}</p>
            </header>

            <div className="mb-4 max-h-[360px] space-y-2 overflow-auto rounded-xl border border-slate-100 bg-slate-50 p-3">
              {activeConversation.messages.map((message) => (
                <article key={message.id} className="rounded-xl border border-slate-200 bg-white p-2 text-sm">
                  <p>{message.content}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{message.direction}</p>
                </article>
              ))}
            </div>

            <div className="rounded-xl border border-slate-200 p-3">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Escribe /menu para usar plantillas rápidas"
                className="h-24 w-full resize-none rounded-md border border-slate-200 p-2 text-sm focus:border-teal-400 focus:outline-none"
              />

              {suggestions.length > 0 ? (
                <div className="mt-2 space-y-1">
                  {suggestions.map((template) => (
                    <button
                      key={template.slug}
                      onClick={() => setDraft(template.content)}
                      className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-left text-xs text-slate-700 hover:bg-teal-50"
                    >
                      /{template.slug}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500">Selecciona una conversación.</p>
        )}
      </section>
    </div>
  );
}
