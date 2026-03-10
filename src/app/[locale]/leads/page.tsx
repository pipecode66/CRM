import Link from "next/link";

import { LeadKanban } from "@/components/crm/lead-kanban";
import { getKanbanLeads } from "@/lib/crm/queries";

export default async function LeadsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const stages = await getKanbanLeads();

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Pipeline de Leads</h2>
          <p className="text-sm text-slate-500">Visual tipo Kanban por etapas, canal y prioridad comercial.</p>
        </div>
        <Link
          href={`/${locale}/inbox`}
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Ir a inbox
        </Link>
      </header>

      <LeadKanban
        columns={stages.map((stage) => ({
          id: stage.id,
          name: stage.name,
          color: stage.color,
          leads: stage.leads.map((lead) => ({
            id: lead.id,
            fullName: lead.fullName,
            sourceChannel: lead.sourceChannel,
            tags: lead.tags,
            potentialValue: lead.potentialValue?.toString() ?? null,
            assignedTo: lead.assignedTo,
            tasks: lead.tasks,
          })),
        }))}
      />
    </section>
  );
}
