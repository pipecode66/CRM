import { db } from "@/lib/db";

export default async function ReportsPage() {
  let leadsByChannel: Array<{ sourceChannel: string; _count: { _all: number } }> = [];
  let aiPerformance: Array<{ action: string; _count: { _all: number }; _avg: { confidence: number | null } }> = [];

  try {
    [leadsByChannel, aiPerformance] = await Promise.all([
      db.lead.groupBy({
        by: ["sourceChannel"],
        _count: { _all: true },
      }),
      db.aIAgentDecision.groupBy({
        by: ["action"],
        _count: { _all: true },
        _avg: { confidence: true },
      }),
    ]);
  } catch {
    // Keep empty report arrays when DB is unavailable.
  }

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Reportes accionables</h2>
        <p className="text-sm text-slate-500">ConversiÃ³n, rendimiento por canal y efectividad del agente IA.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-700">Leads por canal</h3>
          <div className="mt-3 space-y-2">
            {leadsByChannel.map((row) => (
              <div key={row.sourceChannel} className="rounded-lg bg-slate-50 p-2 text-sm text-slate-700">
                {row.sourceChannel}: {row._count._all}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-700">Rendimiento del agente IA</h3>
          <div className="mt-3 space-y-2">
            {aiPerformance.map((row) => (
              <div key={row.action} className="rounded-lg bg-slate-50 p-2 text-sm text-slate-700">
                {row.action}: {row._count._all} acciones Â· confianza media {(row._avg.confidence ?? 0).toFixed(2)}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
