"use client";

import Link from "next/link";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ThemeToggle } from "../../ThemeProvider";
import { useTranslation, LanguageSwitcher } from "../../LanguageProvider";
import { localePath } from "../../../lib/i18n/localePath";
import SignInForm from "../../components/SignInForm";

function isSafeRedirect(path: string): boolean {
  if (!path || typeof path !== "string") return false;
  const p = path.startsWith("/") ? path : `/${path}`;
  return p.startsWith("/") && !p.startsWith("//") && !p.includes("//");
}

export default function SignInPage() {
  const { t, locale } = useTranslation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.queries.users.currentUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const target =
        user.onboardingComplete === false
          ? localePath("/onboarding", locale)
          : isSafeRedirect(redirectTo ?? "")
            ? redirectTo!
            : localePath("/", locale);
      router.push(target);
    }
  }, [isLoading, isAuthenticated, user, router, locale, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-dark-bg">
        <div className="text-zinc-400">{t.common.loading}</div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-dark-bg">
        <div className="text-zinc-400">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-dark-bg">
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-lg dark:border-dark-border dark:bg-dark-bg/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link
            href={localePath("/", locale)}
            className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            ⚡ TheNode<span className="text-zinc-400">.tech</span>
          </Link>
          <nav className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-24">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            {t.auth.signInTitle}
          </h1>
          <p className="mt-3 text-zinc-500">
            {t.auth.signInDescription}
          </p>
        </div>

        <SignInForm submitLabel={t.auth.sendMagicLink} />

        <p className="mt-8 text-xs text-zinc-400">
          {t.home.freeNote}{" "}
          <Link href={localePath("/pricing", locale)} className="underline hover:text-zinc-600">
            {t.home.learnMore}
          </Link>
        </p>
      </main>
    </div>
  );
}
