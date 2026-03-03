/**
 * Single source of truth for supported locale codes.
 * Used by middleware (Edge) and app for routing and validation.
 */
export const LOCALE_CODES = [
  "en",
  "es",
  "fr",
  "de",
  "ja",
  "zh",
  "pt",
  "it",
  "ko",
] as const;

export type Locale = (typeof LOCALE_CODES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isValidLocale(value: string): value is Locale {
  return (LOCALE_CODES as readonly string[]).includes(value);
}

/**
 * Parse Accept-Language and return best matching locale or default.
 */
export function getLocaleFromAcceptLanguage(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const parts = acceptLanguage.split(",").map((p) => {
    const [code, q] = p.trim().split(";q=");
    return { code: code.slice(0, 2).toLowerCase(), q: q ? parseFloat(q) : 1 };
  });
  parts.sort((a, b) => b.q - a.q);
  for (const { code } of parts) {
    if (isValidLocale(code)) return code;
  }
  return DEFAULT_LOCALE;
}
