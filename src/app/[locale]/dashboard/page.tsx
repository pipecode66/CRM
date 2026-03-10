import { StatCard } from "@/components/crm/stat-card";
import { getDashboardMetrics } from "@/lib/crm/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = getDictionary(locale);
  const metrics = await getDashboardMetrics();

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">{dictionary.dashboard.title}</h2>
        <p className="text-sm text-slate-500">{dictionary.dashboard.subtitle}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title={dictionary.dashboard.metrics.incoming} value={metrics.incomingMessages} />
        <StatCard title={dictionary.dashboard.metrics.openChats} value={metrics.openChats} />
        <StatCard title={dictionary.dashboard.metrics.noReply} value={metrics.unanswered} />
        <StatCard title={dictionary.dashboard.metrics.avgResponse} value={`${metrics.avgResponseMinutes} min`} />
        <StatCard title={dictionary.dashboard.metrics.activeLeads} value={metrics.activeLeads} />
        <StatCard title={dictionary.dashboard.metrics.wonLeads} value={metrics.wonLeads} />
        <StatCard title={dictionary.dashboard.metrics.pendingTasks} value={metrics.pendingTasks} />
        <StatCard title={dictionary.dashboard.metrics.conversion} value={`${metrics.conversionRate}%`} />
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-700">{dictionary.dashboard.sla.title}</h3>
          <div className="mt-3 h-40 rounded-xl bg-[linear-gradient(120deg,#99f6e4_0%,#0f766e_100%)] p-4 text-white">
            <p className="text-xs uppercase tracking-wider">{dictionary.dashboard.sla.avgTime}</p>
            <p className="text-3xl font-black">{metrics.avgResponseMinutes} min</p>
            <p className="mt-2 text-xs">{dictionary.dashboard.sla.target}</p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-700">{dictionary.dashboard.funnel.title}</h3>
          <div className="mt-3 space-y-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
              {dictionary.dashboard.funnel.activeLeads}: {metrics.activeLeads}
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
              {dictionary.dashboard.funnel.wonLeads}: {metrics.wonLeads}
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
              {dictionary.dashboard.funnel.totalConversion}: {metrics.conversionRate}%
            </div>
          </div>
        </article>
      </section>
    </section>
  );
}
