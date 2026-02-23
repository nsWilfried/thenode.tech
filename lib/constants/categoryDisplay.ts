import {
  type CategorySlug,
  CATEGORY_SLUGS,
  getCategoryBySlug,
} from "./categories";

/** Gradient Tailwind classes for category card headers (home page). */
export const CATEGORY_GRADIENTS: Record<CategorySlug, string> = {
  ai: "from-blue-600 to-purple-700",
  eng: "from-emerald-600 to-teal-700",
  sec: "from-red-600 to-orange-700",
  biz: "from-amber-500 to-yellow-600",
  tech: "from-slate-600 to-zinc-700",
  "cloud-devops": "from-sky-500 to-blue-700",
  "web3-crypto": "from-violet-600 to-indigo-700",
  "design-ux-frontend": "from-pink-500 to-rose-700",
  "emerging-tech-science": "from-cyan-500 to-teal-700",
  "opensource-languages": "from-green-500 to-emerald-700",
};

const DEFAULT_GRADIENT = "from-zinc-600 to-zinc-800";

/** Slug + icon list for home page category grid (single source from CATEGORIES). */
export const CATEGORY_SLUGS_WITH_ICON = CATEGORY_SLUGS.map((slug) => ({
  slug,
  icon: getCategoryBySlug(slug)!.icon,
}));

/** Icon for a category slug, or undefined if slug is invalid. */
export function getCategoryIcon(slug: string): string | undefined {
  return getCategoryBySlug(slug)?.icon;
}

/** Gradient class for a category slug. */
export function getCategoryGradient(slug: string): string {
  return CATEGORY_GRADIENTS[slug as CategorySlug] ?? DEFAULT_GRADIENT;
}

/** Whether the slug is a valid category. */
export function isValidCategorySlug(slug: string): slug is CategorySlug {
  return getCategoryBySlug(slug) !== null;
}
