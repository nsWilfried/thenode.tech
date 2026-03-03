import type { Locale } from "./locales";

/**
 * Build a path with locale prefix. Use for internal navigation.
 * localePath("/pricing", "fr") => "/fr/pricing"
 * localePath("pricing", "fr") => "/fr/pricing"
 */
export function localePath(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `/${locale}${normalized ? `/${normalized}` : ""}`;
}
