import Link from "next/link";
import { MessageCircle, LayoutDashboard, Users, CheckSquare, FileText, Megaphone, BarChart3, GitBranch, Bot } from "lucide-react";

import type { AppLocale, Dictionary } from "@/lib/i18n/dictionaries";

const iconClass = "h-4 w-4";

const navItems = [
  { key: "dashboard", icon: <LayoutDashboard className={iconClass} />, href: "dashboard" },
  { key: "inbox", icon: <MessageCircle className={iconClass} />, href: "inbox" },
  { key: "leads", icon: <Users className={iconClass} />, href: "leads" },
  { key: "tasks", icon: <CheckSquare className={iconClass} />, href: "tasks" },
  { key: "templates", icon: <FileText className={iconClass} />, href: "templates" },
  { key: "campaigns", icon: <Megaphone className={iconClass} />, href: "campaigns" },
  { key: "reports", icon: <BarChart3 className={iconClass} />, href: "reports" },
  { key: "workflows", icon: <GitBranch className={iconClass} />, href: "workflows" },
  { key: "ai", icon: <Bot className={iconClass} />, href: "ai" },
] as const;

export function AppShell({
  locale,
  dictionary,
  children,
}: {
  locale: AppLocale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const secondaryLocale = locale === "es" ? "en" : "es";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f5f2_0%,#f4f9fd_40%,#f9fafb_100%)] text-slate-900">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-4 p-4 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-teal-200/70 bg-white/85 p-4 shadow-[0_12px_40px_rgba(14,116,144,0.08)] backdrop-blur">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h1 className="text-xl font-black tracking-tight text-teal-900">{dictionary.common.appName}</h1>
            <p className="text-sm text-slate-500">{dictionary.common.subtitle}</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}/${item.href}`}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-900"
              >
                {item.icon}
                {dictionary.nav[item.key]}
              </Link>
            ))}
          </nav>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-semibold uppercase tracking-wide text-slate-600">{dictionary.common.language}</p>
            <div className="mt-2 flex items-center gap-2">
              <Link
                href={`/${secondaryLocale}/dashboard`}
                className="rounded-md bg-slate-900 px-2 py-1 font-semibold text-white"
              >
                {secondaryLocale.toUpperCase()}
              </Link>
              <span>{locale.toUpperCase()}</span>
            </div>
          </div>
        </aside>

        <main className="space-y-4 rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          {children}
        </main>
      </div>
    </div>
  );
}
