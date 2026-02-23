"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeProvider";
import { useTranslation, LanguageSwitcher } from "./LanguageProvider";
import { getCategoryShortName } from "../lib/i18n/categoryHelpers";
import UserMenu from "./components/UserMenu";
import SignInForm from "./components/SignInForm";

const CATEGORY_SLUGS = [
  { slug: "ai", icon: "🤖" },
  { slug: "eng", icon: "⚙️" },
  { slug: "sec", icon: "🔒" },
  { slug: "biz", icon: "💼" },
  { slug: "tech", icon: "📱" },
  { slug: "cloud-devops", icon: "☁️" },
  { slug: "web3-crypto", icon: "🔗" },
  { slug: "design-ux-frontend", icon: "🎨" },
  { slug: "emerging-tech-science", icon: "🔬" },
  { slug: "opensource-languages", icon: "📦" },
];

const CATEGORY_GRADIENTS: Record<string, string> = {
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

interface DeepDive {
  title: string;
  url: string;
  summary: string;
  imageUrl?: string;
  source?: string;
}

function FeaturedCategory({
  slug,
  icon,
}: {
  slug: string;
  icon: string;
}) {
  const { t } = useTranslation();
  const shortName = getCategoryShortName(t.categories, slug);
  const newsletters = useQuery(api.queries.newsletters.getLatestByCategory, {
    category: slug,
    limit: 1,
    language: "en",
  });

  const latestNewsletter = newsletters?.[0] as
    | (typeof newsletters extends (infer T)[] | undefined ? T : never) & {
        deepDives?: DeepDive[];
      }
    | undefined;

  const topDive = latestNewsletter?.deepDives?.[0];
  const heroImage = topDive?.imageUrl;
  const gradient = CATEGORY_GRADIENTS[slug] || "from-zinc-600 to-zinc-800";

  if (!latestNewsletter) {
    return null;
  }

  return (
    <Link
      href={`/category/${slug}`}
      className="group col-span-full block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-xl dark:border-[#2a2a38] dark:bg-[#1a1a24]"
    >
      <div className="grid md:grid-cols-2">
        {/* Image side */}
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

        {/* Content side */}
        <div className="flex flex-col justify-center p-6 md:p-8">
          {latestNewsletter.summary && (
            <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {latestNewsletter.summary}
            </p>
          )}

          {latestNewsletter.deepDives && latestNewsletter.deepDives.length > 0 && (
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
          )}

          {!latestNewsletter.deepDives?.length && latestNewsletter.articles && (
            <div className="space-y-3">
              {latestNewsletter.articles.slice(0, 3).map((article: { title: string; summary: string }, i: number) => (
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
          )}

          <div className="mt-5">
            <span className="text-xs font-semibold text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-200">
              {t.home.viewFullEdition} →
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
  const { t } = useTranslation();
  const shortName = getCategoryShortName(t.categories, slug);
  const newsletters = useQuery(api.queries.newsletters.getLatestByCategory, {
    category: slug,
    limit: 1,
    language: "en",
  });

  const latestNewsletter = newsletters?.[0] as
    | (typeof newsletters extends (infer T)[] | undefined ? T : never) & {
        deepDives?: DeepDive[];
      }
    | undefined;

  const topDive = latestNewsletter?.deepDives?.[0];
  const heroImage = topDive?.imageUrl;
  const gradient = CATEGORY_GRADIENTS[slug] || "from-zinc-600 to-zinc-800";

  return (
    <Link
      href={`/category/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-[#2a2a38] dark:bg-[#1a1a24]"
    >
      {/* Card image header */}
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
          {latestNewsletter && (
            <span className="text-[11px] text-white/70">
              {latestNewsletter.date}
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
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
            {(latestNewsletter?.deepDives?.length
              ? latestNewsletter.deepDives.slice(0, 3).map((d: DeepDive) => ({
                  title: d.title,
                  summary: d.summary,
                }))
              : latestNewsletter?.articles?.slice(0, 3).map((a: { title: string; summary: string }) => ({
                  title: a.title,
                  summary: a.summary,
                })) || []
            ).map((item: { title: string; summary: string }, index: number) => (
              <div
                key={index}
                className="border-b border-zinc-50 pb-2.5 last:border-0 last:pb-0 dark:border-[#2a2a38]"
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
          <div className="mt-auto border-t border-zinc-100 pt-3 dark:border-[#2a2a38]">
            <span className="text-xs font-semibold text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-200">
              {t.home.viewFullEdition} →
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const user = useQuery(api.queries.users.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (user && user.onboardingComplete === false) {
      router.push("/onboarding");
    }
  }, [user, router]);

  const featuredSlug = CATEGORY_SLUGS[0];
  const remainingCategories = CATEGORY_SLUGS.slice(1);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-[#121218]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-lg dark:border-[#2a2a38] dark:bg-[#121218]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            ⚡ TheNode<span className="text-zinc-400">.tech</span>
          </h1>
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

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-16 text-center">
        <h2 className="mx-auto max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          {t.home.heroTitle}
          <br />
          <span className="text-zinc-400">{t.home.heroSubtitle}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-500 dark:text-zinc-400">
          {t.home.heroDescription}
        </p>
        {!user && (
          <div className="relative mt-8 flex justify-center">
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
          <Link href="/pricing" className="underline hover:text-zinc-600">
            {t.home.learnMore}
          </Link>
        </p>
      </section>

      {/* Category Navigation */}
      <div className="mx-auto max-w-6xl px-4 pb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORY_SLUGS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-900 hover:bg-zinc-900 hover:text-white dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-400 dark:hover:bg-zinc-400 dark:hover:text-zinc-900"
            >
              {cat.icon} {getCategoryShortName(t.categories, cat.slug)}
            </Link>
          ))}
        </div>
      </div>

      {/* Category Sections */}
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Featured category spans full width */}
          <FeaturedCategory slug={featuredSlug.slug} icon={featuredSlug.icon} />

          {/* Remaining categories in 2-col grid */}
          {remainingCategories.map((cat) => (
            <div key={cat.slug} id={cat.slug} className="h-full">
              <CategorySection slug={cat.slug} icon={cat.icon} />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 bg-white dark:border-[#2a2a38] dark:bg-[#121218]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <p className="text-sm text-zinc-400">
            &copy; {new Date().getFullYear()} TheNode.tech. {t.common.allRightsReserved}
          </p>
          <div className="flex gap-6">
            <Link
              href="/pricing"
              className="text-sm text-zinc-400 hover:text-zinc-600"
            >
              {t.nav.pricing}
            </Link>
            <Link
              href="/settings"
              className="text-sm text-zinc-400 hover:text-zinc-600"
            >
              {t.nav.settings}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
