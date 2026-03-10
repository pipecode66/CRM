import { db } from "@/lib/db";

export default async function TemplatesPage() {
  const templates = await db.template.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
  }).catch(() => []);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Mensajes rÃ¡pidos y plantillas</h2>
        <p className="text-sm text-slate-500">Atajos tipo `/menu`, variables dinÃ¡micas y categorÃ­as comerciales.</p>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        {templates.map((template) => (
          <article key={template.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">/{template.slug}</h3>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                {template.category}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{template.content}</p>
            <p className="mt-2 text-xs text-slate-400">Variables: {template.variables.join(", ") || "-"}</p>
          </article>
        ))}
        {templates.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-400">
            AÃºn no hay plantillas guardadas.
          </p>
        ) : null}
      </div>
    </section>
  );
}
