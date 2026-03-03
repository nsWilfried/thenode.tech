"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../ThemeProvider";
import { useTranslation, LanguageSwitcher } from "../LanguageProvider";
import { getCategoryShortName } from "../../lib/i18n/categoryHelpers";
import { formatNewsletterDate } from "../../lib/i18n/dateHelpers";
import { localePath } from "../../lib/i18n/localePath";
import {
  CATEGORY_SLUGS_WITH_ICON,
  getCategoryGradient,
} from "../../lib/constants/categoryDisplay";
import type { DeepDive, NewsletterWithSections } from "../../lib/types/newsletter";
import UserMenu from "../components/UserMenu";
import SignInForm from "../components/SignInForm";

function getFirstNewsletterImage(
  newsletter: NewsletterWithSections | undefined
): string | undefined {
  if (!newsletter) return undefined;
  const candidates: (string | undefined)[] = [];
  for (const d of newsletter.deepDives ?? []) {
    if (d.imageUrl) candidates.push(d.imageUrl);
  }
  for (const m of newsletter.mediaItems ?? []) {
    if (m.type === "image" && m.url) candidates.push(m.url);
  }
  for (const s of newsletter.editorialContent ?? []) {
    if (s.imageUrl) candidates.push(s.imageUrl);
  }
  return candidates.find((u) => typeof u === "string" && u.length > 0);
}

function FeaturedCategory({
  slug,
  icon,
}: {
  slug: string;
  icon: string;
}) {
  const { t, locale } = useTranslation();
  const shortName = getCategoryShortName(t.categories, slug);
  const newsletters = useQuery(api.queries.newsletters.getLatestByCategory, {
    category: slug,
    limit: 1,
    language: "en",
  });

  const latestNewsletter = newsletters?.[0] as NewsletterWithSections | undefined;
  const topDive = latestNewsletter?.deepDives?.[0];
  const heroImage =
    topDive?.imageUrl ??
    latestNewsletter?.mediaItems?.find((m) => m.type === "image")?.url ??
    latestNewsletter?.editorialContent?.[0]?.imageUrl ??
    latestNewsletter?.deepDives?.find((d) => d.imageUrl)?.imageUrl;
  const gradient = getCategoryGradient(slug);

  if (!latestNewsletter) {
    return null;
  }

  const dateLabel = formatNewsletterDate(latestNewsletter.date, {
    todayLabel: t.common.today,
    yesterdayLabel: t.common.yesterday,
    locale,
  });

  return (
    <Link
      href={localePath(`/category/${slug}`, locale)}
      className="group col-span-full block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-xl dark:border-dark-border dark:bg-dark-card"
    >
      <div className="grid md:grid-cols-2">
        <div className={`relative aspect-[16/10] md:aspect-auto md:min-h-[320px] overflow-hidden bg-gradient-to-br ${gradient}`}>
          {heroImage && (
            <Image
              src={heroImage}
              alt={topDive?.title || shortName}
              fill
              className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
              {icon} {shortName}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 md:p-8">
          {latestNewsletter.summary && (
            <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {latestNewsletter.summary}
            </p>
          )}

          {latestNewsletter.deepDives && latestNewsletter.deepDives.length > 0 ? (
            <div className="space-y-3">
              {latestNewsletter.deepDives.slice(0, 2).map((dive: DeepDive, i: number) => (
                <div key={i}>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {dive.title}
                  </h3>
                  <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {dive.summary}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            latestNewsletter.articles && (
              <div className="space-y-3">
                {latestNewsletter.articles.slice(0, 3).map((article, i: number) => (
                  <div key={i}>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {article.title}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {article.summary}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}

          <div className="mt-5">
            <span className="text-xs font-semibold text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-200">
              {t.home.viewFullEdition}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CategorySection({
  slug,
  icon,
}: {
  slug: string;
  icon: string;
}) {
  const { t, locale } = useTranslation();
  const shortName = getCategoryShortName(t.categories, slug);
  const newsletters = useQuery(api.queries.newsletters.getLatestByCategory, {
    category: slug,
    limit: 1,
    language: "en",
  });

  const latestNewsletter = newsletters?.[0] as NewsletterWithSections | undefined;
  const heroImage = getFirstNewsletterImage(latestNewsletter);
  const gradient = getCategoryGradient(slug);

  const dateLabel =
    latestNewsletter &&
    formatNewsletterDate(latestNewsletter.date, {
      todayLabel: t.common.today,
      yesterdayLabel: t.common.yesterday,
      locale,
    });

  const teasers =
    latestNewsletter?.deepDives?.length &&
    latestNewsletter.deepDives.slice(0, 3).map((d) => ({ title: d.title, summary: d.summary })) ||
    latestNewsletter?.articles?.slice(0, 3).map((a) => ({ title: a.title, summary: a.summary })) ||
    [];

  return (
    <Link
      href={localePath(`/category/${slug}`, locale)}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-dark-border dark:bg-dark-card"
    >
      <div className={`relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-gradient-to-br ${gradient}`}>
        {heroImage && (
          <Image
            src={heroImage}
            alt={shortName}
            fill
            className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-sm font-semibold text-white backdrop-blur-sm">
            {icon} {shortName}
          </span>
          {dateLabel && (
            <span className="text-[11px] text-white/70">{dateLabel}</span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {latestNewsletter?.summary && (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {latestNewsletter.summary}
          </p>
        )}

        {!newsletters || newsletters.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {t.home.noNewsletters}
          </p>
        ) : (
          <div className="space-y-2.5">
            {teasers.map((item, index) => (
              <div
                key={index}
                className="border-b border-zinc-50 pb-2.5 last:border-0 last:pb-0 dark:border-dark-border"
              >
                <h3 className="line-clamp-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {item.title}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        )}

        {newsletters && newsletters.length > 0 && (
          <div className="mt-auto border-t border-zinc-100 pt-3 dark:border-dark-border">
            <span className="text-xs font-semibold text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-200">
              {t.home.viewFullEdition}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function Home() {
  const { t, locale } = useTranslation();
  const user = useQuery(api.queries.users.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (user && user.onboardingComplete === false) {
      router.push(localePath("/onboarding", locale));
    }
  }, [user, router, locale]);

  const [featured, ...remaining] = CATEGORY_SLUGS_WITH_ICON;

  return (
    <>
      <section
        id="subscribe"
        className="mx-auto max-w-6xl px-4 pb-8 pt-16 text-center scroll-mt-20"
      >
        <h2 className="mx-auto max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          {t.home.heroTitle}
          <br />
          <span className="text-zinc-400">{t.home.heroSubtitle}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-500 dark:text-zinc-400">
          {t.home.heroDescription}
        </p>
        {!user && (
          <div className="relative mt-8 flex flex-col items-center justify-center gap-2">
            <SignInForm />
          </div>
        )}
        {user && (
          <p className="mt-6 text-sm text-emerald-600">
            ✓ {t.home.subscribeSuccess}
          </p>
        )}
        <p className="mt-6 text-xs text-zinc-400">
          {t.home.freeNote}{" "}
          <Link
            href={localePath("/pricing", locale)}
            className="underline hover:text-zinc-600"
          >
            {t.home.learnMore}
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORY_SLUGS_WITH_ICON.map((cat) => (
            <Link
              key={cat.slug}
              href={localePath(`/category/${cat.slug}`, locale)}
              className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-900 hover:bg-zinc-900 hover:text-white dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-400 dark:hover:bg-zinc-400 dark:hover:text-zinc-900"
            >
              {cat.icon} {getCategoryShortName(t.categories, cat.slug)}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {featured && (
            <FeaturedCategory slug={featured.slug} icon={featured.icon} />
          )}
          {remaining.map((cat) => (
            <div key={cat.slug} id={cat.slug} className="h-full">
              <CategorySection slug={cat.slug} icon={cat.icon} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
