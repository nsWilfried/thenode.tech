import type { Metadata } from "next";
import { isValidLocale } from "../../../lib/i18n/locales";
import { translations } from "../../../lib/i18n/translations";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  LOCALE_TO_OG,
  buildPageTitle,
} from "../../../lib/seo/config";
import type { Locale } from "../../../lib/i18n/locales";
import PricingContent from "./_PricingContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const t = translations[locale as Locale] ?? translations.en;
  const title = buildPageTitle(t.pricing.title);
  const description = t.pricing.subtitle;
  const url = `${SITE_URL}/${locale}/pricing`;
  const ogLocale = LOCALE_TO_OG[locale as Locale];

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      locale: ogLocale,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function PricingPage() {
  return <PricingContent />;
}
