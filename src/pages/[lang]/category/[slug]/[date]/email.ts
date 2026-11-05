import type { APIRoute } from "astro";
import { buildCategoryNewsletterHTML } from "../../../../../../convex/email/categoryNewsletterHtml";
import { getEmailTranslations } from "../../../../../../convex/emailTranslations";
import { issueByDate, CACHE_HEADER } from "../../../../../lib/data";
import { CATEGORY_SLUGS, contentLanguage, isIsoDate, issuePath, localeFromParam, SITE_URL, type CategorySlug } from "../../../../../lib/site";

export const prerender = false;

/** The issue exactly as emailed (homepage preview iframe). Not indexed: canonical is the article page. */
export const GET: APIRoute = async ({ params, rewrite }) => {
  const locale = localeFromParam(params.lang);
  const slug = params.slug as CategorySlug;
  if (!locale || !(CATEGORY_SLUGS as readonly string[]).includes(slug) || !isIsoDate(params.date)) return rewrite("/404");
  const nl = await issueByDate(slug, params.date, contentLanguage(locale));
  if (!nl) return rewrite("/404");

  const language = nl.language || "en";
  const canonical = `${SITE_URL}${issuePath(locale, slug, nl.date)}`;
  const html = buildCategoryNewsletterHTML({
    newsletter: nl as never,
    date: nl.date,
    t: getEmailTranslations(language),
    language,
  }).replace(
    "<head>",
    `<head><link rel="canonical" href="${canonical}"><meta name="robots" content="noindex, follow"><link rel="icon" href="/favicon.svg" type="image/svg+xml">`
  );
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": CACHE_HEADER, "x-robots-tag": "noindex, follow" },
  });
};
