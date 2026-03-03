import { MetadataRoute } from "next";
import { LOCALE_CODES } from "../lib/i18n/locales";
import { CATEGORY_SLUGS } from "../lib/constants/categories";

const BASE_URL = "https://thenode.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "pricing",
    "signin",
    "onboarding",
    "settings",
    ...CATEGORY_SLUGS.map((slug) => `category/${slug}`),
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALE_CODES) {
    for (const path of paths) {
      const pathSegment = path ? `/${path}` : "";
      entries.push({
        url: `${BASE_URL}/${locale}${pathSegment}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
