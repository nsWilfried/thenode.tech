import type { APIRoute } from "astro";
import { CATEGORY_SLUGS, LOCALE_CODES, SITE_URL } from "../lib/site";

const ROUTES = ["", "pricing", "privacy", ...CATEGORY_SLUGS.map((s) => `category/${s}`)];

export const GET: APIRoute = () => {
  const href = (l: string, r: string) => `${SITE_URL}/${l}${r ? `/${r}` : ""}`;
  const urls = ROUTES.flatMap((r) =>
    LOCALE_CODES.map(
      (l) =>
        `<url><loc>${href(l, r)}</loc>${LOCALE_CODES.map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${href(a, r)}"/>`).join("")}<xhtml:link rel="alternate" hreflang="x-default" href="${href("en", r)}"/><changefreq>${r.startsWith("category") || r === "" ? "daily" : "monthly"}</changefreq></url>`
    )
  );
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join("")}</urlset>`,
    { headers: { "content-type": "application/xml; charset=utf-8" } }
  );
};
