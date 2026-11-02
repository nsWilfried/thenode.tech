import { ConvexHttpClient } from "convex/browser";
import { LOCALE_CODES, isValidLocale, type Locale } from "../../lib/i18n/locales";
import { translations } from "../../lib/i18n/translations";
import { getSiteStrings } from "../../lib/i18n/siteStrings";
import { CATEGORY_SLUGS, type CategorySlug } from "../../lib/constants/categories";
import {
  getCategoryName,
  getCategoryShortName,
  getCategoryDescription,
} from "../../lib/i18n/categoryHelpers";

export { LOCALE_CODES, isValidLocale, type Locale, CATEGORY_SLUGS, type CategorySlug };

export const SITE_URL = "https://thenode.tech";
export const CONVEX_URL: string =
  import.meta.env.PUBLIC_CONVEX_URL ?? import.meta.env.NEXT_PUBLIC_CONVEX_URL;

/** Lucide icon (self-hosted in /public/icons) per channel. */
export const CHANNEL_ICONS: Record<CategorySlug, string> = {
  ai: "brain-circuit",
  eng: "code-xml",
  sec: "shield-check",
  biz: "briefcase-business",
  tech: "cpu",
  "cloud-devops": "cloud-cog",
  "web3-crypto": "link",
  "design-ux-frontend": "pen-tool",
  "emerging-tech-science": "flask-conical",
  "opensource-languages": "git-branch",
};

/** v3 channel colours (icon discs). */
export const CHANNEL_HUES: Record<CategorySlug, string> = {
  ai: "#7c3aed",
  eng: "#0f766e",
  sec: "#dc2626",
  biz: "#b45309",
  tech: "#334155",
  "cloud-devops": "#2563eb",
  "web3-crypto": "#4f46e5",
  "design-ux-frontend": "#db2777",
  "emerging-tech-science": "#0891b2",
  "opensource-languages": "#16a34a",
};

export const icon = (name: string) => `/icons/${name}.svg`;

/** Split a sentence's final full stop off so it can be painted orange ("Pick yours" + "."). */
export function splitStop(text: string): [string, string] {
  const m = /([.。！!])$/.exec(text.trim());
  return m ? [text.trim().slice(0, -1), m[1]] : [text, ""];
}

export function localeFromParam(value: string | undefined): Locale | null {
  return value && isValidLocale(value) ? value : null;
}

export function path(locale: Locale, p = ""): string {
  const clean = p.replace(/^\/+/, "");
  return `/${locale}${clean ? `/${clean}` : ""}`;
}

/** Everything a page needs to render text in one locale. */
export function strings(locale: Locale) {
  return { t: translations[locale] ?? translations.en, s: getSiteStrings(locale) };
}

export function channels(locale: Locale) {
  const { t, s } = strings(locale);
  return CATEGORY_SLUGS.map((slug, i) => ({
    slug,
    num: String(i + 1).padStart(2, "0"),
    hue: CHANNEL_HUES[slug],
    name: getCategoryName(t.categories, slug),
    short: getCategoryShortName(t.categories, slug),
    long: getCategoryDescription(t.categories, slug),
    blurb: s.channelBlurbs[slug],
    icon: icon(CHANNEL_ICONS[slug]),
    href: path(locale, `category/${slug}`),
  }));
}

export function staticLocalePaths() {
  return LOCALE_CODES.map((lang) => ({ params: { lang } }));
}

let client: ConvexHttpClient | null = null;
export function convex(): ConvexHttpClient {
  client ??= new ConvexHttpClient(CONVEX_URL);
  return client;
}

/** "2 Nov" style date in the page locale, from a YYYY-MM-DD string. */
export function shortDate(date: string, locale: Locale): string {
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" }).format(d);
}

/** Reading time in minutes from a newsletter document. */
export function readingMinutes(nl: {
  summary?: string;
  editorialContent?: { body: string }[];
  deepDives?: { summary: string }[];
  articles?: { summary: string }[];
}): number {
  const text = [
    nl.summary ?? "",
    ...(nl.editorialContent ?? []).map((s) => s.body),
    ...(nl.deepDives ?? []).map((d) => d.summary),
    ...(nl.articles ?? []).map((a) => a.summary),
  ].join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** First usable image of a newsletter (editorial → deep dives → media). */
export function newsletterImage(nl: {
  editorialContent?: { imageUrl?: string }[];
  deepDives?: { imageUrl?: string }[];
  mediaItems?: { type: string; url: string }[];
}): string | undefined {
  return (
    nl.editorialContent?.find((s) => s.imageUrl)?.imageUrl ??
    nl.deepDives?.find((d) => d.imageUrl)?.imageUrl ??
    nl.mediaItems?.find((m) => m.type === "image")?.url
  );
}

/** Headline of a newsletter: first editorial heading or first deep-dive title. */
export function newsletterTitle(nl: {
  editorialContent?: { heading: string }[];
  deepDives?: { title: string }[];
  articles?: { title: string }[];
}): string {
  return (
    nl.editorialContent?.[0]?.heading ?? nl.deepDives?.[0]?.title ?? nl.articles?.[0]?.title ?? ""
  );
}

export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  zh: "中文",
  pt: "Português",
  it: "Italiano",
  ko: "한국어",
};

/**
 * Languages whose channel/issue pages are indexed: they have native issues.
 * Other languages keep working for visitors but those pages are noindex (English content).
 * Keep in sync with the IndexNow hook in convex/mutations/newsletters.ts.
 */
export const INDEXED_LOCALES = ["en", "fr"] as const satisfies readonly Locale[];
export function isIndexedLocale(l: Locale): boolean {
  return (INDEXED_LOCALES as readonly string[]).includes(l);
}
/** Language whose issues a page in `locale` shows (native, else English). */
export function contentLanguage(l: Locale): Locale {
  return isIndexedLocale(l) ? l : "en";
}

export const issuePath = (locale: Locale, slug: string, date: string) => path(locale, `category/${slug}/${date}`);

/** "2 November 2026" style date. */
export function longDate(date: string, locale: Locale): string {
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

export const isIsoDate = (s: string | undefined): s is string => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
