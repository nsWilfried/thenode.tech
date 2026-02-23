"use client";

import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../ThemeProvider";
import { useTranslation, LanguageSwitcher } from "../LanguageProvider";
import { getCategoryName } from "../../lib/i18n/categoryHelpers";
import { SUPPORTED_LOCALES } from "../../lib/i18n/translations";
import UserMenu from "../components/UserMenu";

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

export default function SettingsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const user = useQuery(api.queries.users.currentUser);
  const updatePreferences = useMutation(api.mutations.users.updatePreferences);

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    CATEGORY_SLUGS.map((c) => c.slug)
  );
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [preferredHour, setPreferredHour] = useState(8);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user === null) {
      router.push("/signin");
    }
  }, [user, router]);

  useEffect(() => {
    if (user && !initialized) {
      setInitialized(true);
      if (user.language) setSelectedLanguage(user.language);
      if (user.timezone) setTimezone(user.timezone);
      if (user.preferences?.categories) {
        setSelectedCategories(user.preferences.categories);
      }
      if (typeof user.preferences?.preferredDeliveryHour === "number") {
        setPreferredHour(user.preferences.preferredDeliveryHour);
      }
    }
  }, [user, initialized]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const handleSave = async () => {
    if (!user) return;

    setSaveStatus("saving");
    try {
      await updatePreferences({
        language: selectedLanguage,
        timezone,
        categories: selectedCategories as CategorySlug[],
        ...(user.isPremium ? { preferredDeliveryHour: preferredHour } : {}),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    }
  };

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#121218]">
        <div className="text-zinc-400">{t.common.loading}</div>
      </div>
    );
  }

  if (user === null) {
    return null;
  }

  const isPremium = user.isPremium ?? false;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-[#121218]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-lg dark:border-[#2a2a38] dark:bg-[#121218]/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
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

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
          {t.settings.title}
        </h1>
        <p className="mb-8 text-zinc-500">
          {t.settings.subtitle}
        </p>

        <div className="space-y-8">
          {/* Account Info */}
          <div className="rounded-lg border border-zinc-100 bg-white p-6 dark:border-[#2a2a38] dark:bg-[#1a1a24]">
            <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {t.settings.account}
            </h2>
            <p className="text-sm text-zinc-500">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isPremium
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    : "bg-zinc-100 text-zinc-600 dark:bg-[#252530] dark:text-zinc-400"
                }`}
              >
                {isPremium ? t.settings.premiumBadge : t.settings.freeBadge}
              </span>
              {!isPremium && (
                <Link
                  href="/pricing"
                  className="text-xs text-zinc-500 underline hover:text-zinc-900"
                >
                  {t.settings.upgradeToPremium}
                </Link>
              )}
            </div>
            <button
              onClick={() => void signOut()}
              className="mt-4 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-[#2f2f3d] dark:hover:text-zinc-200"
            >
              {t.nav.signOut}
            </button>
          </div>

          {/* Language */}
          <div className="rounded-lg border border-zinc-100 bg-white p-6 dark:border-[#2a2a38] dark:bg-[#1a1a24]">
            <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {t.settings.language}
            </h2>
            <p className="mb-4 text-sm text-zinc-500">
              {isPremium
                ? t.settings.languageDescPremium
                : t.settings.languageDescFree}
            </p>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={!isPremium}
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-[#252530] dark:text-zinc-100"
            >
              {SUPPORTED_LOCALES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Time */}
          <div className="rounded-lg border border-zinc-100 bg-white p-6 dark:border-[#2a2a38] dark:bg-[#1a1a24]">
            <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {t.settings.deliveryTime}
            </h2>
            <p className="mb-4 text-sm text-zinc-500">
              {isPremium
                ? t.settings.deliveryTimeDescPremium
                : t.settings.deliveryTimeDescFree}
            </p>
            <select
              value={preferredHour}
              onChange={(e) => setPreferredHour(Number(e.target.value))}
              disabled={!isPremium}
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-[#252530] dark:text-zinc-100"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0
                    ? "12:00 AM"
                    : i < 12
                      ? `${i}:00 AM`
                      : i === 12
                        ? "12:00 PM"
                        : `${i - 12}:00 PM`}
                  {i === 8 ? " (default)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Timezone */}
          <div className="rounded-lg border border-zinc-100 bg-white p-6 dark:border-[#2a2a38] dark:bg-[#1a1a24]">
            <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {t.settings.timezone}
            </h2>
            <p className="mb-4 text-sm text-zinc-500">
              {t.settings.timezoneDesc}
            </p>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-[#252530] dark:text-zinc-100"
              placeholder={t.settings.timezonePlaceholder}
            />
          </div>

          {/* Categories */}
          <div className="rounded-lg border border-zinc-100 bg-white p-6 dark:border-[#2a2a38] dark:bg-[#1a1a24]">
            <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {t.settings.categoriesTitle}
            </h2>
            <p className="mb-4 text-sm text-zinc-500">
              {t.settings.categoriesDesc}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CATEGORY_SLUGS.map((cat) => (
                <label
                  key={cat.slug}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-100 p-3 transition-colors hover:bg-zinc-50 dark:border-[#2a2a38] dark:hover:bg-[#2f2f3d]"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => toggleCategory(cat.slug)}
                    className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {cat.icon} {getCategoryName(t.categories, cat.slug)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className="rounded-lg bg-zinc-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {saveStatus === "saving"
                ? t.settings.saving
                : saveStatus === "saved"
                  ? t.settings.saved
                  : t.settings.savePreferences}
            </button>
            {saveStatus === "error" && (
              <p className="text-sm text-red-500">
                {t.common.somethingWentWrong}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
