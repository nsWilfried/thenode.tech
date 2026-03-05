import type { MetadataRoute } from "next";
import { LOCALE_CODES } from "../lib/i18n/locales";
import { CATEGORY_SLUGS } from "../lib/constants/categories";
import { SITE_URL } from "../lib/seo/config";

/** Public paths that should be crawled and indexed (private routes excluded). */
const PUBLIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "pricing", changeFrequency: "weekly", priority: 0.7 },
  ...CATEGORY_SLUGS.map((slug) => ({
    path: `category/${slug}`,
    changeFrequency: "daily" as const,
    priority: 0.9,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of LOCALE_CODES) {
    for (const { path, changeFrequency, priority } of PUBLIC_PATHS) {
      const pathSegment = path ? `/${path}` : "";
      entries.push({
        url: `${SITE_URL}/${locale}${pathSegment}`,
        lastModified: now,
        changeFrequency,
        priority,
      });
    }
  }

  return entries;
}
