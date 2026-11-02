import type { APIRoute } from "astro";
import { INDEXED_LOCALES, SITE_URL } from "../lib/site";

/** Sitemap index: static pages + one issue sitemap per indexed language. */
export const GET: APIRoute = () => {
  const now = new Date().toISOString();
  const maps = ["sitemap-pages.xml", ...INDEXED_LOCALES.map((l) => `sitemap-issues-${l}.xml`)];
  const body = maps.map((m) => `<sitemap><loc>${SITE_URL}/${m}</loc><lastmod>${now}</lastmod></sitemap>`).join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`,
    { headers: { "content-type": "application/xml; charset=utf-8" } }
  );
};
