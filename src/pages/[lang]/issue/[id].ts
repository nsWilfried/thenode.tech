import type { APIRoute } from "astro";
import { issueById } from "../../../lib/data";
import { issuePath, localeFromParam, CATEGORY_SLUGS } from "../../../lib/site";

export const prerender = false;

/** Legacy "/<lang>/issue/<convex id>" links (already in sent emails) → canonical issue URL. */
export const GET: APIRoute = async ({ params, rewrite }) => {
  const locale = localeFromParam(params.lang);
  const nl = locale && params.id ? await issueById(params.id) : null;
  if (!locale || !nl || !(CATEGORY_SLUGS as readonly string[]).includes(nl.category)) return rewrite("/404");
  return new Response(null, {
    status: 301,
    headers: { location: issuePath(locale, nl.category, nl.date), "cache-control": "public, s-maxage=86400" },
  });
};
