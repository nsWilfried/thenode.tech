"use client";

import Link from "next/link";
import { useTranslation } from "../LanguageProvider";
import { localePath } from "../../lib/i18n/localePath";

export default function SiteFooter() {
  const { t, locale } = useTranslation();

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-100 bg-white dark:border-dark-border dark:bg-dark-bg">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-zinc-400">
          &copy; {year} TheNode.tech. {t.common.allRightsReserved}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
          <Link
            href={localePath("/", locale)}
            className="hover:text-zinc-600"
          >
            {t.common.backToHome}
          </Link>
          <Link
            href={localePath("/pricing", locale)}
            className="hover:text-zinc-600"
          >
            {t.nav.pricing}
          </Link>
          <Link
            href={localePath("/settings", locale)}
            className="hover:text-zinc-600"
          >
            {t.nav.settings}
          </Link>
        </div>
      </div>
    </footer>
  );
}

