"use client";

import { useState } from "react";

type Citation = {
  type: "knowledge" | "web";
  title: string;
  excerpt: string;
  url?: string;
};

type AgentResponse = {
  reply: string;
  confidence: number;
  requiresApproval: boolean;
  citations: Citation[];
};

export function AIAgentPanel() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);

    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        language: "es",
        webUrls: ["https://developers.facebook.com/docs/whatsapp"],
      }),
    });

    const payload = (await response.json()) as { data?: AgentResponse };
    setResult(payload.data ?? null);
    setLoading(false);
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <article className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-black text-slate-900">Prompt del cliente</h3>
        <textarea
          className="mt-3 h-36 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm focus:border-teal-400 focus:outline-none"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Escribe una consulta para que responda el agente IA..."
        />
        <button
          onClick={handleRun}
          disabled={loading || message.trim().length === 0}
          className="mt-3 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          {loading ? "Ejecutando..." : "Ejecutar agente"}
        </button>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-lg font-black text-slate-900">Resultado</h3>
        {result ? (
          <div className="mt-2 space-y-3">
            <p className="rounded-lg bg-white p-3 text-sm text-slate-700">{result.reply}</p>
            <p className="text-xs text-slate-500">Confianza: {(result.confidence * 100).toFixed(1)}%</p>
            <p className="text-xs text-slate-500">
              Guardrail crÃ­tico: {result.requiresApproval ? "Requiere aprobaciÃ³n humana" : "No requerido"}
            </p>
            <div className="space-y-2">
              {result.citations.map((citation, index) => (
                <div key={`${citation.title}-${index}`} className="rounded-md border border-slate-200 bg-white p-2 text-xs">
                  <p className="font-semibold text-slate-700">{citation.title}</p>
                  <p className="text-slate-500">{citation.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Sin ejecuciÃ³n todavÃ­a.</p>
        )}
      </article>
    </section>
  );
}
