"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm({ locale }: { locale: string }) {
  const [email, setEmail] = useState("admin@crm.local");
  const [password, setPassword] = useState("Admin12345!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await signIn("credentials", {
      email,
      password,
      callbackUrl: `/${locale}/dashboard`,
      redirect: false,
    });

    if (!response?.ok) {
      setError("Credenciales inválidas o usuario no registrado");
      setLoading(false);
      return;
    }

    window.location.href = `/${locale}/dashboard`;
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <h1 className="text-2xl font-black text-slate-900">Acceso CRM</h1>
      <p className="mt-1 text-sm text-slate-500">Email/password, Google o Microsoft.</p>

      <form className="mt-4 space-y-3" onSubmit={handleCredentialsLogin}>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
        />
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />

        {error ? <p className="text-xs text-rose-600">{error}</p> : null}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          type="submit"
        >
          {loading ? "Ingresando..." : "Ingresar con credenciales"}
        </button>
      </form>

      <div className="mt-3 grid gap-2">
        <button
          onClick={() => signIn("google", { callbackUrl: `/${locale}/dashboard` })}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
        >
          Continuar con Google
        </button>
        <button
          onClick={() => signIn("azure-ad", { callbackUrl: `/${locale}/dashboard` })}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
        >
          Continuar con Microsoft
        </button>
      </div>
    </section>
  );
}
