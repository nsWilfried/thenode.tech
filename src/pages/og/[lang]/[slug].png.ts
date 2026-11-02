import type { APIRoute, GetStaticPaths } from "astro";
import { renderOg } from "../../../lib/og";
import { CATEGORY_SLUGS, channels, LOCALE_CODES, type Locale } from "../../../lib/site";
import { getSiteStrings } from "../../../../lib/i18n/siteStrings";

const LATIN = new Set(["en", "fr", "es", "de", "it", "pt"]);

export const getStaticPaths: GetStaticPaths = () =>
  LOCALE_CODES.flatMap((lang) => CATEGORY_SLUGS.map((slug) => ({ params: { lang, slug } })));

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Locale;
  const textLang: Locale = LATIN.has(lang) ? lang : "en";
  const ch = channels(textLang).find((c) => c.slug === params.slug)!;
  const s = getSiteStrings(textLang);
  const png = await renderOg({ eyebrow: `${s.home.badge}`, title: ch.name, subtitle: ch.blurb, hue: ch.hue });
  return new Response(new Uint8Array(png).buffer as ArrayBuffer, { headers: { "content-type": "image/png" } });
};
