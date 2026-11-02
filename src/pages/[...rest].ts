import type { APIRoute } from "astro";
import { isValidLocale } from "../../lib/i18n/locales";
import { localeRedirect } from "../lib/redirect";

export const prerender = false;

/** Old/unprefixed links that should land on a localized page. */
const KNOWN = new Set(["pricing", "signin", "onboarding", "settings", "privacy", "feedback", "category", "issue"]);
const ALIASES: Record<string, string> = {
  preferences: "settings",
  unsubscribe: "settings#unsubscribe",
  login: "signin",
};

/** Redirect a legacy path to its localized version, or null when it is not one. */
export function legacyRedirect(request: Request, rest: string): Response | null {
  const clean = rest.replace(/^\/+|\/+$/g, "");
  const [first] = clean.split("/");
  if (!first || isValidLocale(first)) return null;
  if (ALIASES[first]) return localeRedirect(request, ALIASES[first]);
  if (KNOWN.has(first)) return localeRedirect(request, clean);
  return null;
}

export const GET: APIRoute = ({ params, request, rewrite }) =>
  legacyRedirect(request, params.rest ?? "") ?? rewrite("/404");
