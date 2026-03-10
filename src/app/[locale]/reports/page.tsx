import { getReportsData } from "@/lib/crm/queries";

export default async function ReportsPage() {
  const { leadsByChannel, aiPerformance } = await getReportsData();

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Reportes accionables</h2>
        <p className="text-sm text-slate-500">Conversión, rendimiento por canal y efectividad del agente IA.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-700">Leads por canal</h3>
          <div className="mt-3 space-y-2">
            {leadsByChannel.map((row) => (
              <div key={row.channel} className="rounded-lg bg-slate-50 p-2 text-sm text-slate-700">
                {row.channel}: {row.count}
              </div>
            ))}
            {leadsByChannel.length === 0 ? (
              <p className="text-sm text-slate-400">Sin datos disponibles.</p>
            ) : null}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-700">Rendimiento del agente IA</h3>
          <div className="mt-3 space-y-2">
            {aiPerformance.map((row) => (
              <div key={row.action} className="rounded-lg bg-slate-50 p-2 text-sm text-slate-700">
                {row.action}: {row.count} acciones · confianza media {row.avgConfidence.toFixed(2)}
              </div>
            ))}
            {aiPerformance.length === 0 ? (
              <p className="text-sm text-slate-400">Sin datos disponibles.</p>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
