import type { APIRoute } from "astro";
import { allIssues, MIN_INDEXABLE_WORDS, XML_CACHE_HEADER } from "../lib/data";
import { CATEGORY_SLUGS, isIndexedLocale, issuePath, localeFromParam, SITE_URL } from "../lib/site";

export const prerender = false;

/** Every indexable issue of one language (thin issues excluded; they are noindex). */
export const GET: APIRoute = async ({ params, rewrite }) => {
  const locale = localeFromParam(params.lang);
  if (!locale || !isIndexedLocale(locale)) return rewrite("/404");
  const seen = new Set<string>();
  const rows = (await allIssues(locale))
    .filter((r) => r.words >= MIN_INDEXABLE_WORDS && (CATEGORY_SLUGS as readonly string[]).includes(r.category))
    .sort((a, b) => b.createdAt - a.createdAt)
    .filter((r) => {
      const k = `${r.category}/${r.date}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  const body = rows
    .map((r) => `<url><loc>${SITE_URL}${issuePath(locale, r.category, r.date)}</loc><lastmod>${new Date(r.createdAt).toISOString()}</lastmod></url>`)
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
    { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": XML_CACHE_HEADER } }
  );
};
