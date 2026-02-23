import type { TranslationDict } from "./translations";

/**
 * Maps a category slug (e.g. "cloud-devops") to the matching translation key
 * in the categories section.
 */
const SLUG_TO_KEY: Record<string, keyof TranslationDict["categories"]> = {
  ai: "ai",
  eng: "eng",
  sec: "sec",
  biz: "biz",
  tech: "tech",
  "cloud-devops": "cloudDevops",
  "web3-crypto": "web3Crypto",
  "design-ux-frontend": "designUxFrontend",
  "emerging-tech-science": "emergingTechScience",
  "opensource-languages": "opensourceLanguages",
};

const SLUG_TO_DESC_KEY: Record<string, keyof TranslationDict["categories"]> = {
  ai: "aiDesc",
  eng: "engDesc",
  sec: "secDesc",
  biz: "bizDesc",
  tech: "techDesc",
  "cloud-devops": "cloudDevopsDesc",
  "web3-crypto": "web3CryptoDesc",
  "design-ux-frontend": "designUxFrontendDesc",
  "emerging-tech-science": "emergingTechScienceDesc",
  "opensource-languages": "opensourceLanguagesDesc",
};

const SLUG_TO_SHORT_KEY: Record<string, keyof TranslationDict["categories"]> = {
  ai: "aiShort",
  eng: "engShort",
  sec: "secShort",
  biz: "bizShort",
  tech: "techShort",
  "cloud-devops": "cloudDevopsShort",
  "web3-crypto": "web3CryptoShort",
  "design-ux-frontend": "designUxFrontendShort",
  "emerging-tech-science": "emergingTechScienceShort",
  "opensource-languages": "opensourceLanguagesShort",
};

/** Get the full category name for a slug in the current language */
export function getCategoryName(
  categories: TranslationDict["categories"],
  slug: string
): string {
  const key = SLUG_TO_KEY[slug];
  return key ? categories[key] : slug;
}

/** Get the category description for a slug in the current language */
export function getCategoryDescription(
  categories: TranslationDict["categories"],
  slug: string
): string {
  const key = SLUG_TO_DESC_KEY[slug];
  return key ? categories[key] : "";
}

/** Get the short category name for a slug in the current language */
export function getCategoryShortName(
  categories: TranslationDict["categories"],
  slug: string
): string {
  const key = SLUG_TO_SHORT_KEY[slug];
  return key ? categories[key] : slug;
}

