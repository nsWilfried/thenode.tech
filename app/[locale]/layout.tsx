import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isValidLocale, DEFAULT_LOCALE, LOCALE_CODES } from "../../lib/i18n/locales";
import AppShell from "../components/AppShell";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_TWITTER_HANDLE,
  DEFAULT_OG_IMAGE,
  LOCALE_TO_OG,
  getAlternateOgLocales,
} from "../../lib/seo/config";
import type { Locale } from "../../lib/i18n/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }
  const pathname = (await headers()).get("x-pathname") || `/${locale}`;
  const canonical = `${SITE_URL}${pathname}`;
  const segments = pathname.split("/").filter(Boolean);
  const pathWithoutLocale = segments.length > 1 ? "/" + segments.slice(1).join("/") : "";
  const languages: Record<string, string> = {
    "x-default": `${SITE_URL}/en${pathWithoutLocale}`,
  };
  for (const code of LOCALE_CODES) {
    languages[code] = `${SITE_URL}/${code}${pathWithoutLocale}`;
  }

  const ogLocale = LOCALE_TO_OG[locale as Locale];
  const alternateLocales = getAlternateOgLocales(locale as Locale);

  return {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DESCRIPTION,
      url: canonical,
      locale: ogLocale,
      alternateLocale: alternateLocales,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE_TWITTER_HANDLE,
      creator: SITE_TWITTER_HANDLE,
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}`);
  }
  return <AppShell>{children}</AppShell>;
}
