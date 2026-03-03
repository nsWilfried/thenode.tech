"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ThemeToggle } from "../ThemeProvider";
import { useTranslation, LanguageSwitcher } from "../LanguageProvider";
import { localePath } from "../../lib/i18n/localePath";
import UserMenu from "./UserMenu";
import SiteLogo from "./SiteLogo";

export default function SiteHeader() {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const user = useQuery(api.queries.users.currentUser);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome =
    pathname === `/${locale}` ||
    pathname === `/${locale}/` ||
    pathname === `/${locale}?` ||
    pathname === `/${locale}#`;

  const toggleMobile = () => setMobileOpen((open) => !open);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-lg dark:border-dark-border dark:bg-dark-bg/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <SiteLogo />
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-3 md:flex">
         
          <Link
            href={localePath("/pricing", locale)}
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            {t.nav.premium}
          </Link>
          {user && (
            <Link
              href={localePath("/settings", locale)}
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              {t.nav.settings}
            </Link>
          )}
          <LanguageSwitcher />
          <ThemeToggle />
          <UserMenu />
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={toggleMobile}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-dark-border dark:bg-dark-card dark:text-zinc-100 dark:hover:bg-dark-hover"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="border-t border-zinc-100 bg-white/95 px-4 pb-3 pt-2 shadow-sm dark:border-dark-border dark:bg-dark-bg/95 md:hidden">
          <div className="flex flex-col gap-2">
            <Link
              href={localePath("/pricing", locale)}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              {t.nav.premium}
            </Link>
            {user && (
              <Link
                href={localePath("/settings", locale)}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                {t.nav.settings}
              </Link>
            )}
            <div className="mt-1 flex items-center justify-between gap-3">
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

