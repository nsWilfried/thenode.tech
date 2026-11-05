import type { APIRoute } from "astro";
import { isValidLocale } from "../../../lib/i18n/locales";

export const prerender = false;

/** Premium is retired for now: send old links (emails, search results) to the home page. */
export const GET: APIRoute = ({ params, redirect }) =>
  redirect(`/${params.lang && isValidLocale(params.lang) ? params.lang : "en"}`, 302);
