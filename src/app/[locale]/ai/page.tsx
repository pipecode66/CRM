import { AIAgentPanel } from "@/components/crm/ai-agent-panel";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function AIPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = getDictionary(locale);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">{dictionary.ai.title}</h2>
        <p className="text-sm text-slate-500">{dictionary.ai.subtitle}</p>
      </header>

      <AIAgentPanel />

      <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <h3 className="font-bold">Guardrails crÃ­ticos activos</h3>
        <p className="mt-1">
          Si la IA detecta pagos, descuentos, datos sensibles o credenciales, marca la respuesta como pendiente de
          aprobaciÃ³n humana.
        </p>
      </article>
    </section>
  );
}
