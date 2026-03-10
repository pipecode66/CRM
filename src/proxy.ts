import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { locales } from "@/lib/i18n/dictionaries";

function hasLocale(pathname: string): boolean {
  return locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (hasLocale(pathname)) {
    return NextResponse.next();
  }

  const locale = request.cookies.get("locale")?.value ?? "es";
  const safeLocale = locales.includes(locale as (typeof locales)[number]) ? locale : "es";

  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = `/${safeLocale}${pathname}`;
  return NextResponse.redirect(nextUrl);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
