"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { ThemeToggle } from "../../ThemeProvider";
import { useTranslation, LanguageSwitcher } from "../../LanguageProvider";
import {
  getCategoryName,
  getCategoryDescription,
} from "../../../lib/i18n/categoryHelpers";
import UserMenu from "../../components/UserMenu";

const VALID_SLUGS: Record<string, string> = {
  ai: "🤖",
  eng: "⚙️",
  sec: "🔒",
  biz: "💼",
  tech: "📱",
  "cloud-devops": "☁️",
  "web3-crypto": "🔗",
  "design-ux-frontend": "🎨",
  "emerging-tech-science": "🔬",
  "opensource-languages": "📦",
};

interface DeepDive {
  title: string;
  url: string;
  summary: string;
  imageUrl?: string;
  source?: string;
}

interface Stat {
  stat: string;
  context: string;
  sourceUrl?: string;
}

interface MediaItem {
  type: "image" | "video";
  url: string;
  caption?: string;
  articleUrl?: string;
}

interface Article {
  title: string;
  summary: string;
  url: string;
  source?: string;
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { t } = useTranslation();

  const icon = VALID_SLUGS[slug];
  const isValid = icon !== undefined;

  const newsletters = useQuery(
    api.queries.newsletters.getLatestByCategory,
    isValid ? { category: slug, limit: 1, language: "en" } : "skip",
  );

  if (!isValid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-[#121218]">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Category not found
        </h1>
        <Link
          href="/"
          className="text-sm text-zinc-500 underline hover:text-zinc-900"
        >
          {t.common.backToHome}
        </Link>
      </div>
    );
  }

  const categoryName = getCategoryName(t.categories, slug);
  const categoryDesc = getCategoryDescription(t.categories, slug);
  const latestNewsletter = newsletters?.[0] as
    | (typeof newsletters extends (infer T)[] | undefined ? T : never) & {
        deepDives?: DeepDive[];
        stats?: Stat[];
        mediaItems?: MediaItem[];
      }
    | undefined;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-[#121218]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-lg dark:border-[#2a2a38] dark:bg-[#121218]/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            ⚡ TheNode<span className="text-zinc-400">.tech</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              {t.nav.premium}
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-600"
        >
          ← {t.common.backToCategories}
        </Link>

        {/* Category Hero */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-4xl">{icon}</span>
            <div>
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {categoryName}
              </h1>
              {latestNewsletter && (
                <span className="text-sm text-zinc-400">{latestNewsletter.date}</span>
              )}
            </div>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
            {categoryDesc}
          </p>
        </div>

        {/* Content */}
        {newsletters === undefined ? (
          <div className="py-12 text-center text-zinc-400">
            {t.common.loading}
          </div>
        ) : !latestNewsletter ? (
          <div className="py-12 text-center text-zinc-400">
            {t.home.noNewsletters}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Editorial Overview */}
            {latestNewsletter.summary && (
              <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-[#2a2a38] dark:bg-[#1a1a24]">
                <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {latestNewsletter.summary}
                </p>
              </section>
            )}

            {/* Deep Dives */}
            {latestNewsletter.deepDives && latestNewsletter.deepDives.length > 0 && (
              <section>
                <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Deep Dives
                </h2>
                <div className="space-y-6">
                  {latestNewsletter.deepDives.map((dive: DeepDive, index: number) => (
                    <a
                      key={index}
                      href={dive.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-[#2a2a38] dark:bg-[#1a1a24]"
                    >
                      {dive.imageUrl && (
                        <div className="relative aspect-[2/1] w-full overflow-hidden bg-zinc-100 dark:bg-[#252530]">
                          <Image
                            src={dive.imageUrl}
                            alt={dive.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 896px) 100vw, 896px"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="mb-2 flex items-center gap-2">
                          {dive.source && (
                            <span className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-[#252530] dark:text-zinc-400">
                              {dive.source}
                            </span>
                          )}
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-400">
                          {dive.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {dive.summary}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Stats & Numbers */}
            {latestNewsletter.stats && latestNewsletter.stats.length > 0 && (
              <section>
                <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Stats & Numbers
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {latestNewsletter.stats.map((s: Stat, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-[#2a2a38] dark:bg-[#1a1a24]"
                    >
                      <p className="mb-1 text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                        {s.stat}
                      </p>
                      <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {s.context}
                      </p>
                      {s.sourceUrl && (
                        <a
                          href={s.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-xs text-zinc-400 underline hover:text-zinc-600"
                        >
                          Source
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Media Spotlight */}
            {latestNewsletter.mediaItems && latestNewsletter.mediaItems.length > 0 && (
              <section>
                <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Media Spotlight
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {latestNewsletter.mediaItems.map((item: MediaItem, index: number) => (
                    <a
                      key={index}
                      href={item.articleUrl || item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-[#2a2a38] dark:bg-[#252530]"
                    >
                      {item.type === "image" ? (
                        <div className="relative aspect-video w-full">
                          <Image
                            src={item.url}
                            alt={item.caption || ""}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 896px) 50vw, 33vw"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="relative flex aspect-video w-full items-center justify-center bg-zinc-900">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      {item.caption && (
                        <div className="p-3">
                          <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">
                            {item.caption}
                          </p>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Links */}
            <section>
              <div className="mb-4 border-t border-zinc-200 pt-6 dark:border-[#2a2a38]">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Quick Links
                </h2>
              </div>
              <div className="space-y-3">
                {latestNewsletter.articles.map(
                  (article: Article, index: number) => (
                    <a
                      key={index}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-100 dark:hover:bg-[#1e1e2a]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold text-zinc-400 dark:text-zinc-500">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-400">
                          {article.title}
                        </h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                          {article.summary}
                        </p>
                      </div>
                      {article.source && (
                        <span className="mt-0.5 shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-[#252530] dark:text-zinc-400">
                          {article.source}
                        </span>
                      )}
                    </a>
                  ),
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 bg-white dark:border-[#2a2a38] dark:bg-[#121218]">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <p className="text-sm text-zinc-400">
            &copy; {new Date().getFullYear()} TheNode.tech
          </p>
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-600"
          >
            {t.common.backToHome}
          </Link>
        </div>
      </footer>
    </div>
  );
}
