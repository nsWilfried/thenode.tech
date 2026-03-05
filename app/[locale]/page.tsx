import type { Metadata } from "next";
import { isValidLocale } from "../../lib/i18n/locales";
import { translations } from "../../lib/i18n/translations";
import { SITE_NAME, SITE_URL, LOCALE_TO_OG } from "../../lib/seo/config";
import type { Locale } from "../../lib/i18n/locales";
import HomeContent from "./_HomeContent";
import JsonLd from "../components/JsonLd";
import { getWebSiteJsonLd } from "../../lib/seo/jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const t = translations[locale as Locale] ?? translations.en;
  const title = `${SITE_NAME} — ${t.home.heroTitle} ${t.home.heroSubtitle}`;
  const description = t.home.heroDescription;
  const url = `${SITE_URL}/${locale}`;
  const ogLocale = LOCALE_TO_OG[locale as Locale];
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(SITE_NAME)}&description=${encodeURIComponent(description)}`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      url,
      locale: ogLocale,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = isValidLocale(locale) ? (locale as Locale) : "en";
  return (
    <>
      <JsonLd data={getWebSiteJsonLd(validLocale)} />
      <HomeContent />
    </>
  );
}
