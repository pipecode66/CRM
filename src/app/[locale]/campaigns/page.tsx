import { db } from "@/lib/db";

export default async function CampaignsPage() {
  const campaigns = await db.campaign.findMany({
    include: {
      template: true,
      deliveries: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  }).catch(() => []);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">CampaÃ±as omnicanal</h2>
        <p className="text-sm text-slate-500">WhatsApp masivo, seguimiento postventa y reactivaciÃ³n de leads frÃ­os.</p>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">{campaign.name}</h3>
              <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                {campaign.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Canal: {campaign.channel} Â· Entregas: {campaign.deliveries.length}
            </p>
            <p className="mt-2 text-sm text-slate-700">Plantilla: {campaign.template?.name ?? "Sin plantilla"}</p>
            <pre className="mt-2 overflow-auto rounded-lg bg-slate-50 p-2 text-xs text-slate-500">
              {JSON.stringify(campaign.metrics ?? {}, null, 2)}
            </pre>
          </article>
        ))}
        {campaigns.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-400">
            No hay campaÃ±as creadas.
          </p>
        ) : null}
      </div>
    </section>
  );
}
