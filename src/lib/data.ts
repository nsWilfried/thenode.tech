import { api } from "../../convex/_generated/api";
import type { NewsletterWithSections } from "../../lib/types/newsletter";
import { CATEGORY_SLUGS, convex, type CategorySlug, type Locale } from "./site";

export type Issue = NewsletterWithSections & { _id: string };

/** Latest issue per channel in the page language, falling back to English. */
export async function latestPerChannel(locale: Locale): Promise<Partial<Record<CategorySlug, Issue>>> {
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
