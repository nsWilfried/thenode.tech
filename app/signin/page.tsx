"use client";

import Link from "next/link";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ThemeToggle } from "../ThemeProvider";
import { useTranslation, LanguageSwitcher } from "../LanguageProvider";
import SignInForm from "../components/SignInForm";

export default function SignInPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.queries.users.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.push(user.onboardingComplete === false ? "/onboarding" : "/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#121218]">
        <div className="text-zinc-400">{t.common.loading}</div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#121218]">
        <div className="text-zinc-400">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-[#121218]">
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-lg dark:border-[#2a2a38] dark:bg-[#121218]/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link
            href="/"
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
          <Link href="/pricing" className="underline hover:text-zinc-600">
            {t.home.learnMore}
          </Link>
        </p>
      </main>
    </div>
  );
}
