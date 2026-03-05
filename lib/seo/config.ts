import type { Locale } from "../i18n/locales";
import { LOCALE_CODES } from "../i18n/locales";

export const SITE_URL = "https://thenode.tech";
export const SITE_NAME = "TheNode.tech";
export const SITE_TAGLINE = "Your Daily Dose of Tech";
export const SITE_DESCRIPTION =
  "AI-powered tech newsletter. Get the most impactful stories from AI, Engineering, Security, Business, and more — summarized daily in your language.";
export const SITE_TWITTER_HANDLE = "@thenodetech";

/** Default OG image URL — served by the dynamic /api/og route */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent(SITE_NAME)}&description=${encodeURIComponent(SITE_DESCRIPTION)}`;

/** Maps locale codes to BCP-47 og:locale values */
export const LOCALE_TO_OG: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  ja: "ja_JP",
  zh: "zh_CN",
  pt: "pt_BR",
  it: "it_IT",
  ko: "ko_KR",
};

/** Alternate og:locale values for a given primary locale */
export function getAlternateOgLocales(primary: Locale): string[] {
  return (LOCALE_CODES as readonly Locale[])
    .filter((l) => l !== primary)
    .map((l) => LOCALE_TO_OG[l]);
}

/**
 * Build a page title in the pattern "Section — TheNode.tech".
 * When no section is provided, returns the default full title.
 */
export function buildPageTitle(section?: string): string {
  if (!section) return `${SITE_NAME} — ${SITE_TAGLINE}`;
  return `${section} — ${SITE_NAME}`;
}

/** Canonical URL for a given locale-prefixed path */
export function buildCanonicalUrl(localizedPath: string): string {
  return `${SITE_URL}${localizedPath}`;
}

/** Full hreflang alternates map for a given path-without-locale */
export function buildHreflangAlternates(
  pathWithoutLocale: string
): Record<string, string> {
  const cleanPath =
    pathWithoutLocale && pathWithoutLocale !== "/" ? pathWithoutLocale : "";
  const result: Record<string, string> = {
    "x-default": `${SITE_URL}/en${cleanPath}`,
  };
  for (const code of LOCALE_CODES) {
    result[code] = `${SITE_URL}/${code}${cleanPath}`;
  }
  return result;
}

/** Organization data used for JSON-LD */
export const ORGANIZATION = {
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    "https://twitter.com/thenodetech",
    "https://www.linkedin.com/company/thenodetech",
  ],
} as const;
