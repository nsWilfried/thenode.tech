"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "../../ThemeProvider";
import { useTranslation, LanguageSwitcher } from "../../LanguageProvider";
import { getCategoryName } from "../../../lib/i18n/categoryHelpers";
import { localePath } from "../../../lib/i18n/localePath";

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
] as const;

type CategorySlug = (typeof CATEGORY_SLUGS)[number]["slug"];

export default function OnboardingPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const user = useQuery(api.queries.users.currentUser);
  const completeOnboarding = useMutation(api.mutations.users.completeOnboarding);

  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user === null) {
      router.push(localePath("/signin", locale));
      return;
    }
    if (user?.onboardingComplete) {
      router.push(localePath("/", locale));
    }
  }, [user, router, locale]);

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-dark-bg">
        <div className="text-zinc-400">{t.common.loading}</div>
      </div>
    );
  }

  if (user === null || user.onboardingComplete) {
    return null;
  }

  const toggleCategory = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
    if (error) setError("");
  };

  const toggleAll = () => {
    if (selected.length === CATEGORY_SLUGS.length) {
      setSelected([]);
    } else {
      setSelected(CATEGORY_SLUGS.map((c) => c.slug));
    }
    if (error) setError("");
  };

  const handleContinue = async () => {
    if (selected.length === 0) {
      setError(t.onboarding.selectAtLeastOne);
      return;
    }
    setSaving(true);
    try {
      await completeOnboarding({
        categories: selected as CategorySlug[],
      });
      router.push(localePath("/", locale));
    } catch {
      setError(t.common.somethingWentWrong);
    } finally {
      setSaving(false);
    }
  };

  const allSelected = selected.length === CATEGORY_SLUGS.length;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-dark-bg">
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-lg dark:border-dark-border dark:bg-dark-bg/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href={localePath("/", locale)} className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            ⚡ TheNode<span className="text-zinc-400">.tech</span>
          </Link>
          <nav className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">{t.onboarding.title}</h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">{t.onboarding.subtitle}</p>
        </div>

        <div className="mb-4 flex justify-end">
          <button onClick={toggleAll} className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
            {allSelected ? t.onboarding.deselectAll : t.onboarding.selectAll}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CATEGORY_SLUGS.map((cat) => {
            const isSelected = selected.includes(cat.slug);
            return (
              <button
                key={cat.slug}
                onClick={() => toggleCategory(cat.slug)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-dark-card dark:text-zinc-300 dark:hover:border-zinc-500"
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-sm font-semibold">{getCategoryName(t.categories, cat.slug)}</span>
              </button>
            );
          })}
        </div>

        {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleContinue}
            disabled={saving}
            className="rounded-lg bg-zinc-900 px-12 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {saving ? "..." : t.onboarding.continue}
          </button>
        </div>
      </main>
    </div>
  );
}
