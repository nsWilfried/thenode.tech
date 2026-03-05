import type { Metadata } from "next";
import { isValidLocale } from "../../../../lib/i18n/locales";
import { isValidCategorySlug, getCategoryIcon } from "../../../../lib/constants/categoryDisplay";
import { translations } from "../../../../lib/i18n/translations";
import { getCategoryName, getCategoryDescription } from "../../../../lib/i18n/categoryHelpers";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  LOCALE_TO_OG,
  buildPageTitle,
} from "../../../../lib/seo/config";
import type { Locale } from "../../../../lib/i18n/locales";
import CategoryContent from "./_CategoryContent";
import JsonLd from "../../../components/JsonLd";
import { getCategoryPageJsonLd, getBreadcrumbJsonLd } from "../../../../lib/seo/jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale) || !isValidCategorySlug(slug)) return {};

  const t = translations[locale as Locale] ?? translations.en;
  const categoryName = getCategoryName(t.categories, slug);
  const categoryDesc = getCategoryDescription(t.categories, slug);
  const title = buildPageTitle(categoryName);
  const url = `${SITE_URL}/${locale}/category/${slug}`;
  const ogLocale = LOCALE_TO_OG[locale as Locale];
  const icon = getCategoryIcon(slug);

  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(categoryName)}&description=${encodeURIComponent(categoryDesc)}&category=${encodeURIComponent(slug)}`;

  return {
    title,
    description: categoryDesc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      title,
      description: categoryDesc,
      url,
      locale: ogLocale,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${icon ? icon + " " : ""}${categoryName} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      title,
      description: categoryDesc,
      images: [ogImageUrl],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const validLocale = isValidLocale(locale) ? (locale as Locale) : "en";
  const valid = isValidCategorySlug(slug);

  const t = translations[validLocale] ?? translations.en;
  const categoryName = valid ? getCategoryName(t.categories, slug) : slug;
  const categoryDesc = valid ? getCategoryDescription(t.categories, slug) : "";
  const url = `${SITE_URL}/${locale}/category/${slug}`;

  const categoryJsonLd = valid
    ? getCategoryPageJsonLd({ locale: validLocale, slug, name: categoryName, description: categoryDesc, url })
    : null;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: categoryName, url },
  ]);

  return (
    <>
      {categoryJsonLd && <JsonLd data={categoryJsonLd} />}
      <JsonLd data={breadcrumbJsonLd} />
      <CategoryContent params={params} />
    </>
  );
}
