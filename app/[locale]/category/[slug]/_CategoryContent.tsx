"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { useTranslation } from "../../../LanguageProvider";
import { getCategoryName, getCategoryDescription } from "../../../../lib/i18n/categoryHelpers";
import { formatNewsletterDate } from "../../../../lib/i18n/dateHelpers";
import { localePath } from "../../../../lib/i18n/localePath";
import { isValidCategorySlug, getCategoryIcon } from "../../../../lib/constants/categoryDisplay";
import type { DeepDive, Stat, MediaItem, Article, EditorialSection, NewsletterWithSections } from "../../../../lib/types/newsletter";

export default function CategoryContent({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = use(params);
  const { t, locale } = useTranslation();
  const icon = getCategoryIcon(slug);
  const isValid = isValidCategorySlug(slug);

  const newsletters = useQuery(
    api.queries.newsletters.getLatestByCategory,
    isValid ? { category: slug, limit: 1, language: "en" } : "skip"
  );

  const latestNewsletter = newsletters?.[0] as NewsletterWithSections | undefined;

  if (!isValid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-dark-bg">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Category not found</h1>
        <Link href={localePath("/", locale)} className="text-sm text-zinc-500 underline hover:text-zinc-900">
          {t.common.backToHome}
        </Link>
      </div>
    );
  }

  const categoryName = getCategoryName(t.categories, slug);
  const categoryDesc = getCategoryDescription(t.categories, slug);
  const dateLabel =
    latestNewsletter &&
    formatNewsletterDate(latestNewsletter.date, {
      todayLabel: t.common.today,
      yesterdayLabel: t.common.yesterday,
      locale,
    });

  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-12">
        <Link href={localePath("/", locale)} className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-600">
        {t.common.backToCategories}
        </Link>

        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-4xl">{icon}</span>
            <div>
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">{categoryName}</h1>
              {dateLabel && <span className="text-sm text-zinc-400">{dateLabel}</span>}
            </div>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400">{categoryDesc}</p>
        </div>

        {newsletters === undefined ? (
          <div className="py-12 text-center text-zinc-400">{t.common.loading}</div>
        ) : !latestNewsletter ? (
          <div className="py-12 text-center text-zinc-400">{t.home.noNewsletters}</div>
        ) : (
          <div className="space-y-14">
            {latestNewsletter.summary && (
              <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-dark-border dark:bg-dark-card">
                <p className="text-lg font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">{latestNewsletter.summary}</p>
              </section>
            )}

            {latestNewsletter.editorialContent && latestNewsletter.editorialContent.length > 0 && (
              <article className="space-y-10">
                {latestNewsletter.editorialContent.map((section: EditorialSection, index: number) => (
                  <section key={index}>
                    <h2 className="mb-4 text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">{section.heading}</h2>
                    {section.imageUrl && (
                      <figure className="mb-5">
                        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-dark-surface">
                          <Image src={section.imageUrl} alt={section.imageCaption || section.heading} fill className="object-cover" sizes="(max-width: 896px) 100vw, 896px" />
                        </div>
                        {section.imageCaption && (
                          <figcaption className="mt-2 text-center text-xs italic text-zinc-400 dark:text-zinc-500">{section.imageCaption}</figcaption>
                        )}
                      </figure>
                    )}
                    <div className="space-y-4">
                      {section.body.split("\n\n").map((paragraph, pIdx) => (
                        <p key={pIdx} className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </article>
            )}

            {latestNewsletter.deepDives && latestNewsletter.deepDives.length > 0 && (
              <section>
                <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Featured Stories</h2>
                <div className="space-y-6">
                  {latestNewsletter.deepDives.map((dive: DeepDive, index: number) => (
                    <a key={index} href={dive.url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-dark-border dark:bg-dark-card">
                      {dive.imageUrl && (
                        <div className="relative aspect-[2/1] w-full overflow-hidden bg-zinc-100 dark:bg-dark-surface">
                          <Image src={dive.imageUrl} alt={dive.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 896px) 100vw, 896px" />
                        </div>
                      )}
                      <div className="p-6">
                        {dive.source && (
                          <span className="mb-2 inline-block rounded bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-dark-surface dark:text-zinc-400">{dive.source}</span>
                        )}
                        <h3 className="mb-2 text-xl font-bold text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-400">{dive.title}</h3>
                        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{dive.summary}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {latestNewsletter.stats && latestNewsletter.stats.length > 0 && (
              <section>
                <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Key Numbers</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {latestNewsletter.stats.map((s: Stat, index: number) => (
                    <div key={index} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-dark-border dark:bg-dark-card">
                      <p className="mb-1 text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">{s.stat}</p>
                      <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{s.context}</p>
                      {s.sourceUrl && (
                        <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-zinc-400 underline hover:text-zinc-600">Source</a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {latestNewsletter.mediaItems && latestNewsletter.mediaItems.filter((m: MediaItem) => m.type === "image").length > 0 && (
              <section>
                <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Media Spotlight</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {latestNewsletter.mediaItems.filter((m: MediaItem) => m.type === "image").map((item: MediaItem, index: number) => (
                    <a key={index} href={item.articleUrl || item.url} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-dark-border dark:bg-dark-surface">
                      <div className="relative aspect-video w-full">
                        <Image src={item.url} alt={item.caption || ""} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 896px) 50vw, 33vw" />
                      </div>
                      {item.caption && (
                        <div className="p-3">
                          <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">{item.caption}</p>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="mb-4 border-t border-zinc-200 pt-6 dark:border-dark-border">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Quick Links</h2>
              </div>
              <div className="space-y-3">
                {latestNewsletter.articles.map((article: Article, index: number) => (
                  <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-100 dark:hover:bg-dark-hover-alt">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold text-zinc-400 dark:text-zinc-500">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-400">{article.title}</h3>
                      <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{article.summary}</p>
                    </div>
                    {article.source && (
                      <span className="mt-0.5 shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-dark-surface dark:text-zinc-400">{article.source}</span>
                    )}
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
