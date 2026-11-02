import type { APIRoute } from "astro";
import { archivePage, XML_CACHE_HEADER } from "../../../../lib/data";
import { channels, contentLanguage, issuePath, localeFromParam, newsletterTitle, SITE_URL } from "../../../../lib/site";

export const prerender = false;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 feed of a channel's latest 30 issues. */
export const GET: APIRoute = async ({ params, rewrite }) => {
  const locale = localeFromParam(params.lang);
  const ch = locale ? channels(locale).find((c) => c.slug === params.slug) : undefined;
  if (!locale || !ch) return rewrite("/404");
  const lang = contentLanguage(locale);
  const issues = await archivePage(ch.slug, lang, undefined, 30);
  const items = issues
    .map((nl) => {
      const link = `${SITE_URL}${issuePath(locale, ch.slug, nl.date)}`;
      return `<item><title>${esc(newsletterTitle(nl) || ch.name)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><pubDate>${new Date(nl.createdAt).toUTCString()}</pubDate><description>${esc(nl.summary ?? "")}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(`${ch.name} — TheNode`)}</title><link>${SITE_URL}${ch.href}</link><description>${esc(ch.long)}</description><language>${lang}</language><atom:link href="${SITE_URL}${ch.href}/rss.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": XML_CACHE_HEADER } });
};
