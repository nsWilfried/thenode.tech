import { DEFAULT_LOCALE, getLocaleFromAcceptLanguage, isValidLocale, type Locale } from "../../lib/i18n/locales";

/** Saved choice (cookie set by the language switcher) wins, then Accept-Language, then English. */
export function preferredLocale(request: Request): Locale {
  const cookie = request.headers.get("cookie") ?? "";
  const saved = /(?:^|;\s*)lang=([a-z]{2})/.exec(cookie)?.[1];
  if (saved && isValidLocale(saved)) return saved;
  return getLocaleFromAcceptLanguage(request.headers.get("accept-language")) ?? DEFAULT_LOCALE;
}

export function localeRedirect(request: Request, pathAfter: string): Response {
  const url = new URL(request.url);
  const target = `/${preferredLocale(request)}${pathAfter ? `/${pathAfter}` : ""}${url.search}${url.hash}`;
  return new Response(null, {
    status: 307,
    headers: { location: target, vary: "accept-language, cookie", "cache-control": "private, no-store" },
  });
}
