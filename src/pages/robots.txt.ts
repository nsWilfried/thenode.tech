import type { APIRoute } from "astro";

export const GET: APIRoute = () =>
  new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /*/settings",
      "Disallow: /*/onboarding",
      "Disallow: /*/signin",
      "Disallow: /*/feedback",
      "",
      "Sitemap: https://thenode.tech/sitemap.xml",
      "",
    ].join("\n"),
    { headers: { "content-type": "text/plain; charset=utf-8" } }
  );
