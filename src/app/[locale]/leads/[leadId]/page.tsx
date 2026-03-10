import { notFound } from "next/navigation";

import { getLeadById } from "@/lib/crm/queries";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ locale: string; leadId: string }>;
}) {
  const { leadId } = await params;
  const lead = await getLeadById(leadId);

  if (!lead) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-2xl font-black text-slate-900">{lead.fullName}</h2>
        <p className="text-sm text-slate-500">
          {lead.email ?? "Sin email"} Â· {lead.phone ?? "Sin telÃ©fono"} Â· {lead.sourceChannel}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {lead.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-teal-50 px-2 py-1 text-xs text-teal-700">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-black text-slate-900">Conversaciones</h3>
          <div className="mt-3 space-y-3">
            {lead.conversations.map((conversation) => (
              <div key={conversation.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">
                  {conversation.channel} Â· {conversation.status}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {conversation.messages[0]?.content ?? "Sin mensajes recientes"}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-black text-slate-900">Tareas y compras</h3>
          <div className="mt-3 space-y-2">
            {lead.tasks.map((task) => (
              <div key={task.id} className="rounded-lg border border-slate-100 p-2 text-sm text-slate-700">
                {task.title} Â· {task.status}
              </div>
            ))}
            {lead.tasks.length === 0 ? <p className="text-sm text-slate-400">Sin tareas pendientes</p> : null}
          </div>

          <h4 className="mt-4 text-sm font-bold text-slate-700">Historial de compras</h4>
          <div className="mt-2 space-y-2">
            {lead.purchases.map((purchase) => (
              <div key={purchase.id} className="rounded-lg border border-emerald-100 bg-emerald-50 p-2 text-sm text-emerald-700">
                {purchase.productName} Â· ${purchase.total.toString()}
              </div>
            ))}
            {lead.purchases.length === 0 ? <p className="text-sm text-slate-400">Sin compras registradas</p> : null}
          </div>
        </article>
      </div>
    </section>
  );
}
