import { api } from "../../convex/_generated/api";
import type { NewsletterWithSections } from "../../lib/types/newsletter";
import { CATEGORY_SLUGS, contentLanguage, convex, type CategorySlug, type Locale } from "./site";

export type Issue = NewsletterWithSections & { _id: string };

/** Latest issue per channel in the page language, falling back to English. */
export async function latestPerChannel(pageLocale: Locale): Promise<Partial<Record<CategorySlug, Issue>>> {
  const locale = contentLanguage(pageLocale);
  const client = convex();
  const get = (language: string) =>
    client
      .query(api.queries.newsletters.getLatestAllCategories, { limit: 1, language })
      .catch(() => ({}) as Record<string, Issue[]>) as Promise<Record<string, Issue[]>>;
  const [local, en] = await Promise.all([get(locale), locale === "en" ? Promise.resolve(null) : get("en")]);
  const out: Partial<Record<CategorySlug, Issue>> = {};
  for (const slug of CATEGORY_SLUGS) {
    const nl = local[slug]?.[0] ?? en?.[slug]?.[0];
    if (nl) out[slug] = nl;
  }
  return out;
}

/** Past issues for a channel in the page language, falling back to English. */
export async function channelIssues(slug: CategorySlug, locale: Locale, limit = 12): Promise<Issue[]> {
  const client = convex();
  const get = (language: string) =>
    client
      .query(api.queries.newsletters.getLatestByCategory, { category: slug, limit, language })
      .catch(() => [] as Issue[]) as Promise<Issue[]>;
  const local = await get(locale);
  if (local.length > 0 || locale === "en") return local;
  return get("en");
}

export async function issueById(id: string): Promise<Issue | null> {
  try {
    return (await convex().query(api.queries.newsletters.getByIdPublic, { id: id as never })) as Issue | null;
  } catch {
    return null;
  }
}

/** CDN cache for SSR pages: fresh for 10 min, serve stale up to a day while revalidating. */
export const CACHE_HEADER = "public, max-age=0, s-maxage=600, stale-while-revalidate=86400";

/** Canonical issue for a channel/day in a language (null if none). */
export async function issueByDate(slug: CategorySlug, date: string, language: string): Promise<Issue | null> {
  try {
    return (await convex().query(api.queries.newsletters.getByCategoryDate, { category: slug, date, language })) as Issue | null;
  } catch {
    return null;
  }
}

export async function neighbors(slug: CategorySlug, date: string, language: string) {
  try {
    return await convex().query(api.queries.newsletters.getNeighbors, { category: slug, date, language });
  } catch {
    return { prev: null, next: null };
  }
}

/** One archive page of a channel, newest first, strictly older than `before`. */
export async function archivePage(slug: CategorySlug, language: string, before?: string, limit = 30): Promise<Issue[]> {
  try {
    return (await convex().query(api.queries.newsletters.listByCategoryBefore, { category: slug, language, before, limit })) as Issue[];
  } catch {
    return [];
  }
}

export type SitemapEntry = { category: string; date: string; createdAt: number; words: number };

/** Every issue of a language (slim fields), following Convex pagination. */
export async function allIssues(language: string): Promise<SitemapEntry[]> {
  const out: SitemapEntry[] = [];
  let cursor: string | null = null;
  for (let i = 0; i < 100; i++) {
    const res: { page: SitemapEntry[]; isDone: boolean; continueCursor: string } = await convex().query(
      api.queries.newsletters.listForSitemap,
      { language, cursor, numItems: 250 }
    );
    out.push(...res.page);
    if (res.isDone) break;
    cursor = res.continueCursor;
  }
  return out;
}

/** Thin issues stay reachable but are not indexed. */
export const MIN_INDEXABLE_WORDS = 250;

/** Long CDN cache for crawler-facing XML (6h fresh, a day stale). */
export const XML_CACHE_HEADER = "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400";
