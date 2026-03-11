"use client";

import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { CheckoutLink, CustomerPortalLink } from "@convex-dev/polar/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../LanguageProvider";
import { getCategoryName } from "../../../lib/i18n/categoryHelpers";
import { localePath } from "../../../lib/i18n/localePath";
import { SUPPORTED_LOCALES } from "../../../lib/i18n/translations";
import { getTimeZoneOptions, formatTimeZoneLabel } from "../../../lib/timezones";
import UserMenu from "../../components/UserMenu";

const DEFAULT_PREFERRED_HOUR = 8;

function formatHourLabel(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}

function getTimezoneSelectOptions(currentTimezone: string): { value: string; label: string }[] {
  const options = getTimeZoneOptions();
  const list = options.includes(currentTimezone) ? options : [currentTimezone, ...options].sort();
  return list.map((tz) => ({ value: tz, label: formatTimeZoneLabel(tz) }));
}

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
  const { t, locale } = useTranslation();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const user = useQuery(api.queries.users.currentUser);
  const updatePreferences = useMutation(api.mutations.users.updatePreferences);

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORY_SLUGS.map((c) => c.slug));
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [preferredHour, setPreferredHour] = useState(DEFAULT_PREFERRED_HOUR);
  const [weeklyDigestEnabled, setWeeklyDigestEnabled] = useState(false);
  const [preferredDigestDay, setPreferredDigestDay] = useState(1);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user === null) {
      router.push(localePath("/signin", locale));
    }
  }, [user, router, locale]);

  useEffect(() => {
    if (user && !initialized) {
      setInitialized(true);
      if (user.language) setSelectedLanguage(user.language);
      if (user.timezone) setTimezone(user.timezone);
      if (user.preferences?.categories) setSelectedCategories(user.preferences.categories);
      if (typeof user.preferences?.preferredDeliveryHour === "number") setPreferredHour(user.preferences.preferredDeliveryHour);
      if ((user.preferences as any)?.weeklyDigestEnabled != null) setWeeklyDigestEnabled((user.preferences as any).weeklyDigestEnabled);
      if (typeof (user.preferences as any)?.preferredDigestDay === "number") setPreferredDigestDay((user.preferences as any).preferredDigestDay);
    }
  }, [user, initialized]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) => (prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaveStatus("saving");
    try {
      await updatePreferences({
        categories: selectedCategories as CategorySlug[],
        ...(user.isPremium && {
          language: selectedLanguage,
          timezone,
          preferredDeliveryHour: preferredHour,
          weeklyDigestEnabled,
          preferredDigestDay,
        }),
      } as Parameters<typeof updatePreferences>[0]);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    }
  };

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-dark-bg">
        <div className="text-zinc-400">{t.common.loading}</div>
      </div>
    );
  }
  if (user === null) return null;

  const isPremium = user.isPremium ?? false;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">{t.settings.title}</h1>
        <p className="mb-8 text-zinc-500">{t.settings.subtitle}</p>

        <div className="space-y-8">
          <div className="rounded-lg border border-zinc-100 bg-white p-6 dark:border-dark-border dark:bg-dark-card">
            <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{t.settings.account}</h2>
            <p className="text-sm text-zinc-500">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${isPremium ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" : "bg-zinc-100 text-zinc-600 dark:bg-dark-surface dark:text-zinc-400"}`}>
                {isPremium ? t.settings.premiumBadge : t.settings.freeBadge}
              </span>
              {!isPremium && (
                <Link href={localePath("/pricing", locale)} className="text-xs text-zinc-500 underline hover:text-zinc-900">
                  {t.settings.upgradeToPremium}
                </Link>
              )}
            </div>
            {isPremium && (
              <CustomerPortalLink
                polarApi={api.polar}
                className="mt-3 inline-block text-xs text-zinc-500 underline hover:text-zinc-900"
              >
                {t.settings.manageSubscription}
              </CustomerPortalLink>
            )}
            <button onClick={() => void signOut()} className="mt-4 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-dark-hover dark:hover:text-zinc-200">
              {t.nav.signOut}
            </button>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-white p-6 dark:border-dark-border dark:bg-dark-card">
            <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{t.settings.language}</h2>
            <p className="mb-4 text-sm text-zinc-500">{isPremium ? t.settings.languageDescPremium : t.settings.languageDescFree}</p>
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} disabled={!isPremium} className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-dark-surface dark:text-zinc-100">
              {SUPPORTED_LOCALES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-white p-6 dark:border-dark-border dark:bg-dark-card">
            <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{t.settings.deliveryTime}</h2>
            <p className="mb-4 text-sm text-zinc-500">{isPremium ? t.settings.deliveryTimeDescPremium : t.settings.deliveryTimeDescFree}</p>
            {isPremium ? (
              <select value={preferredHour} onChange={(e) => setPreferredHour(Number(e.target.value))} className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-dark-surface dark:text-zinc-100">
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i === 0 ? "12:00 AM" : i < 12 ? `${i}:00 AM` : i === 12 ? "12:00 PM" : `${i - 12}:00 PM`}{i === 8 ? " (default)" : ""}</option>
                ))}
              </select>
            ) : (
              <p className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-600 dark:border-dark-border dark:bg-dark-surface dark:text-zinc-400">
                Daily newsletter: 8:00 AM in your timezone. <Link href={localePath("/pricing", locale)} className="font-medium text-zinc-900 underline hover:no-underline dark:text-zinc-200">Upgrade to Premium</Link> to choose your delivery time.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-zinc-100 bg-white p-6 dark:border-dark-border dark:bg-dark-card">
            <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">Weekly Digest</h2>
            <p className="mb-4 text-sm text-zinc-500">{isPremium ? "Get a curated week-in-review email summarizing trends and top stories across your categories." : "Upgrade to Premium to receive a weekly digest with cross-category insights and trend analysis."}</p>
            <div className="flex items-center justify-between rounded-lg border border-zinc-100 p-4 dark:border-dark-border">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Enable Weekly Digest</span>
              <button type="button" role="switch" aria-checked={weeklyDigestEnabled} disabled={!isPremium} onClick={() => setWeeklyDigestEnabled((prev) => !prev)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${weeklyDigestEnabled ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-700"}`}>
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-zinc-900 ${weeklyDigestEnabled ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
            {weeklyDigestEnabled && isPremium && (
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Delivery Day</label>
                <select value={preferredDigestDay} onChange={(e) => setPreferredDigestDay(Number(e.target.value))} className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-dark-surface dark:text-zinc-100">
                  <option value={0}>Sunday</option>
                  <option value={1}>Monday (default)</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                </select>
                <p className="mt-2 text-xs text-zinc-400">Delivered at your preferred delivery hour.</p>
              </div>
            )}
            {!isPremium && <Link href={localePath("/pricing", locale)} className="mt-3 inline-block text-xs text-zinc-500 underline hover:text-zinc-900">Upgrade to Premium</Link>}
          </div>

          <div className="rounded-lg border border-zinc-100 bg-white p-6 dark:border-dark-border dark:bg-dark-card">
            <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{t.settings.timezone}</h2>
            <p className="mb-4 text-sm text-zinc-500">{t.settings.timezoneDesc}</p>
            {isPremium ? (
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-dark-surface dark:text-zinc-100">
                {getTimezoneSelectOptions(timezone).map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            ) : (
              <p className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-600 dark:border-dark-border dark:bg-dark-surface dark:text-zinc-400">
                Your timezone: {user.timezone ? formatTimeZoneLabel(user.timezone) : "Detected"} (detected). <Link href={localePath("/pricing", locale)} className="font-medium text-zinc-900 underline hover:no-underline dark:text-zinc-200">Upgrade to Premium</Link> to choose your timezone and delivery time.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-zinc-100 bg-white p-6 dark:border-dark-border dark:bg-dark-card">
            <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{t.settings.categoriesTitle}</h2>
            <p className="mb-4 text-sm text-zinc-500">{t.settings.categoriesDesc}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CATEGORY_SLUGS.map((cat) => (
                <label key={cat.slug} className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-100 p-3 transition-colors hover:bg-zinc-50 dark:border-dark-border dark:hover:bg-dark-hover">
                  <input type="checkbox" checked={selectedCategories.includes(cat.slug)} onChange={() => toggleCategory(cat.slug)} className="h-4 w-4 rounded border-zinc-300 accent-zinc-900" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{cat.icon} {getCategoryName(t.categories, cat.slug)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={saveStatus === "saving"} className="rounded-lg bg-zinc-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
              {saveStatus === "saving" ? t.settings.saving : saveStatus === "saved" ? t.settings.saved : t.settings.savePreferences}
            </button>
            {saveStatus === "error" && <p className="text-sm text-red-500">{t.common.somethingWentWrong}</p>}
          </div>
        </div>
      </main>
  );
}
