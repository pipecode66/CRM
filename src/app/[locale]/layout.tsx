import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getDictionary, locales } from "@/lib/i18n/dictionaries";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <AppShell locale={locale as "es" | "en"} dictionary={dictionary}>
      {children}
    </AppShell>
  );
}
