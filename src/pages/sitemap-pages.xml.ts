import type { APIRoute } from "astro";
import { CATEGORY_SLUGS, INDEXED_LOCALES, LOCALE_CODES, SITE_URL } from "../lib/site";

const href = (l: string, r: string) => `${SITE_URL}/${l}${r ? `/${r}` : ""}`;

function urls(routes: string[], locales: readonly string[], changefreq: string, priority: string) {
  return routes.flatMap((r) =>
    locales.map(
      (l) =>
        `<url><loc>${href(l, r)}</loc>${locales.map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${href(a, r)}"/>`).join("")}<xhtml:link rel="alternate" hreflang="x-default" href="${href("en", r)}"/><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
    )
  );
}

/** Translated pages exist in all languages; channel hubs only where issues are native. */
export const GET: APIRoute = () => {
  const all = [
    ...urls([""], LOCALE_CODES, "daily", "1.0"),
    ...urls(["about", "privacy"], LOCALE_CODES, "monthly", "0.5"),
    ...urls(CATEGORY_SLUGS.map((s) => `category/${s}`), INDEXED_LOCALES, "daily", "0.9"),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${all.join("")}</urlset>`,
    { headers: { "content-type": "application/xml; charset=utf-8" } }
  );
};
