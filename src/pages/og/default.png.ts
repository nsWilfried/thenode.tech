import type { APIRoute } from "astro";
import { renderOg } from "../../lib/og";
import { getSiteStrings } from "../../../lib/i18n/siteStrings";

export const GET: APIRoute = async () => {
  const s = getSiteStrings("en");
  const png = await renderOg({ eyebrow: s.home.badge, title: "Tech news, summarized by AI", subtitle: s.home.heroLead });
  return new Response(new Uint8Array(png).buffer as ArrayBuffer, { headers: { "content-type": "image/png" } });
};
