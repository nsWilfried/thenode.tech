import type { APIRoute } from "astro";
import { buildCategoryNewsletterHTML } from "../../../../convex/email/categoryNewsletterHtml";
import { getEmailTranslations } from "../../../../convex/emailTranslations";
import { issueById, CACHE_HEADER } from "../../../lib/data";
import { localeFromParam } from "../../../lib/site";

export const prerender = false;

/** "Read online": the issue exactly as it was emailed. */
export const GET: APIRoute = async ({ params, rewrite }) => {
  const locale = localeFromParam(params.lang);
  const nl = locale && params.id ? await issueById(params.id) : null;
  if (!locale || !nl) return rewrite("/404");

  const language = nl.language || "en";
  const html = buildCategoryNewsletterHTML({
    newsletter: nl as never,
    date: nl.date,
    t: getEmailTranslations(language),
    isPremium: false,
    language,
  }).replace("<head>", `<head><link rel="canonical" href="https://thenode.tech/${locale}/issue/${nl._id}"><link rel="icon" href="/favicon.svg" type="image/svg+xml">`);

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": CACHE_HEADER },
  });
};
