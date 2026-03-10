"use client";

type LeadCard = {
  id: string;
  fullName: string;
  sourceChannel: string;
  tags: string[];
  potentialValue: string | null;
  assignedTo?: { name: string | null } | null;
  tasks: Array<{ id: string }>;
};

type StageColumn = {
  id: string;
  name: string;
  color: string;
  leads: LeadCard[];
};

export function LeadKanban({ columns }: { columns: StageColumn[] }) {
  return (
    <div className="grid gap-4 overflow-x-auto pb-2 lg:grid-cols-3 xl:grid-cols-4">
      {columns.map((column) => (
        <section key={column.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <header className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700" style={{ color: column.color }}>
              {column.name}
            </h3>
            <span className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">
              {column.leads.length}
            </span>
          </header>

          <div className="space-y-2">
            {column.leads.map((lead) => (
              <article
                key={lead.id}
                className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5"
              >
                <h4 className="text-sm font-bold text-slate-900">{lead.fullName}</h4>
                <p className="text-xs text-slate-500">{lead.sourceChannel}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {lead.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-md bg-teal-50 px-2 py-0.5 text-[11px] text-teal-700">
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  {lead.assignedTo?.name ? `Asesor: ${lead.assignedTo.name}` : "Sin asesor"}
                </p>
                <p className="text-xs text-slate-600">Tareas pendientes: {lead.tasks.length}</p>
                {lead.potentialValue ? (
                  <p className="mt-2 text-xs font-semibold text-emerald-700">Valor: ${lead.potentialValue}</p>
                ) : null}
              </article>
            ))}
            {column.leads.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
                Sin leads en esta etapa
              </p>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}
