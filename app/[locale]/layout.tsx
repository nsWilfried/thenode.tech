import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isValidLocale, DEFAULT_LOCALE, LOCALE_CODES } from "../../lib/i18n/locales";
import AppShell from "../components/AppShell";

const BASE_URL = "https://thenode.tech";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }
  const pathname = (await headers()).get("x-pathname") || `/${locale}`;
  const canonical = `${BASE_URL}${pathname}`;
  const segments = pathname.split("/").filter(Boolean);
  const pathWithoutLocale = segments.length > 1 ? "/" + segments.slice(1).join("/") : "";
  const languages: Record<string, string> = {
    "x-default": `${BASE_URL}/en${pathWithoutLocale}`,
  };
  for (const code of LOCALE_CODES) {
    languages[code] = `${BASE_URL}/${code}${pathWithoutLocale}`;
  }
  return {
    title: "TheNode.tech — Your Daily Dose of Tech",
    description:
      "AI-powered tech newsletter. Get the most impactful stories from AI, Engineering, Security, Business, and more — summarized daily in your language.",
    alternates: {
      canonical,
      languages,
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
