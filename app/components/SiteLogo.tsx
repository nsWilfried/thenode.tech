"use client";

import Link from "next/link";
import { useTranslation } from "../LanguageProvider";
import { localePath } from "../../lib/i18n/localePath";

export default function SiteLogo() {
  const { locale } = useTranslation();

  return (
    <Link
      href={localePath("/", locale)}
      className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100"
    >
      ⚡ TheNode<span className="text-zinc-400">.tech</span>
    </Link>
  );
}

