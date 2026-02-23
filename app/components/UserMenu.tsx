"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { useTranslation } from "../LanguageProvider";

const AVATAR_EMOJIS = [
  "🦊", "🐱", "🐶", "🐸", "🐵", "🦁", "🐼", "🐨",
  "🐯", "🦄", "🐙", "🦋", "🐢", "🦉", "🐧",
];

function getEmojiForUser(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash + email.charCodeAt(i)) | 0;
  }
  return AVATAR_EMOJIS[Math.abs(hash) % AVATAR_EMOJIS.length];
}

export default function UserMenu() {
  const { t } = useTranslation();
  const user = useQuery(api.queries.users.currentUser);

  if (user === undefined) {
    return null;
  }

  if (user === null) {
    return (
      <Link
        href="/signin"
        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-[#2f2f3d]"
      >
        {t.nav.signIn}
      </Link>
    );
  }

  return (
    <Link
      href="/settings"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-base transition-colors hover:border-zinc-400 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-500 dark:hover:bg-[#2f2f3d]"
      title={user.email}
    >
      {getEmojiForUser(user.email ?? "")}
    </Link>
  );
}
