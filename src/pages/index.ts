import type { APIRoute } from "astro";
import { localeRedirect } from "../lib/redirect";

export const prerender = false;

// "/" → "/<lang>" (keeps ?code= from magic links intact).
export const GET: APIRoute = ({ request }) => localeRedirect(request, "");
