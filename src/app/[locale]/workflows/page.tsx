import { WorkflowBuilder } from "@/components/crm/workflow-builder";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { db } from "@/lib/db";

export default async function WorkflowsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = getDictionary(locale);

  const workflows = await db.workflow.findMany({
    orderBy: { updatedAt: "desc" },
    take: 10,
  }).catch(() => []);

  const latest = workflows[0];

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">{dictionary.workflows.title}</h2>
        <p className="text-sm text-slate-500">{dictionary.workflows.subtitle}</p>
      </header>

      <WorkflowBuilder
        workflowName={latest?.name ?? "Flujo demo: atenciÃ³n + clasificaciÃ³n + seguimiento"}
      />

      <article className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-bold text-slate-700">Flujos activos</h3>
        <div className="mt-3 space-y-2">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="rounded-lg bg-slate-50 p-2 text-sm text-slate-700">
              {workflow.name} Â· {workflow.trigger} Â· v{workflow.version} Â· {workflow.active ? "activo" : "pausado"}
            </div>
          ))}
          {workflows.length === 0 ? <p className="text-sm text-slate-400">Sin flujos creados aÃºn.</p> : null}
        </div>
      </article>
    </section>
  );
}
