"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { CheckoutLink } from "@convex-dev/polar/react";
import { api } from "../../../convex/_generated/api";
import { useTranslation } from "../../LanguageProvider";
import { localePath } from "../../../lib/i18n/localePath";
import { usePlausible } from "../../../lib/analytics/plausible";

const PREMIUM_CTA_CLASS =
  "block rounded-lg bg-zinc-900 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200";
const PREMIUM_CTA_DISABLED_CLASS =
  "block rounded-lg bg-zinc-400 px-6 py-3 text-center text-sm font-semibold text-white dark:bg-zinc-600";

export default function PricingContent() {
  const { t, locale } = useTranslation();
  const user = useQuery(api.queries.users.currentUser);
  const configuredProductId = useQuery(api.polar.getPremiumProductId);
  const products = useQuery(api.polar.getConfiguredProducts);
  const premiumProductId = configuredProductId ?? products?.premium?.id;
  const isPremiumLoading = configuredProductId === undefined;
  const isSignedIn = user !== undefined && user !== null;
  const plausible = usePlausible();

  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">{t.pricing.title}</h1>
          <p className="mt-3 text-lg text-zinc-500">{t.pricing.subtitle}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-dark-border dark:bg-dark-card">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t.pricing.free}</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">{t.pricing.freePriceLabel}</span>
                <span className="text-zinc-400">{t.pricing.perMonth}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">{t.pricing.freeDescription}</p>
            </div>
            <ul className="mb-8 space-y-3">
              {t.pricing.freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="mt-0.5 text-emerald-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link href={localePath("/", locale)} className="block rounded-lg border border-zinc-200 px-6 py-3 text-center text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-dark-hover">
              {t.pricing.getStartedFree}
            </Link>
          </div>

          <div className="relative rounded-2xl border-2 border-zinc-900 bg-white p-8 dark:border-zinc-100 dark:bg-dark-card">
            <span className="absolute -top-3 left-6 rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">{t.pricing.recommended}</span>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t.pricing.premium}</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">{t.pricing.premiumPriceLabel}</span>
                <span className="text-zinc-400">{t.pricing.perMonth}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">{t.pricing.premiumDescription}</p>
            </div>
            <ul className="mb-8 space-y-3">
              {t.pricing.premiumFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="mt-0.5 text-amber-500">★</span>
                  {feature}
                </li>
              ))}
            </ul>
            {premiumProductId ? (
              isSignedIn ? (
                <div onClick={() => plausible("pricing_cta_click", { plan: "premium" })}>
                  <CheckoutLink
                    polarApi={api.polar}
                    productIds={[premiumProductId]}
                    embed={false}
                    className={PREMIUM_CTA_CLASS}
                  >
                    {t.pricing.subscribeWithPolar}
                  </CheckoutLink>
                </div>
              ) : (
                <Link
                  href={`${localePath("/signin", locale)}?redirect=${encodeURIComponent(localePath("/pricing", locale))}`}
                  className={PREMIUM_CTA_CLASS}
                  onClick={() => plausible("pricing_cta_click", { plan: "signin_first" })}
                >
                  {t.pricing.signInToSubscribe}
                </Link>
              )
            ) : (
              <span className={PREMIUM_CTA_DISABLED_CLASS}>
                {isPremiumLoading ? "…" : t.pricing.subscribeWithPolar}
              </span>
            )}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t.pricing.faqTitle}</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.pricing.faqLanguagesQ}</h3>
              <p className="mt-1 text-sm text-zinc-500">{t.pricing.faqLanguagesA}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.pricing.faqScheduleQ}</h3>
              <p className="mt-1 text-sm text-zinc-500">{t.pricing.faqScheduleA}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.pricing.faqSourcesQ}</h3>
              <p className="mt-1 text-sm text-zinc-500">{t.pricing.faqSourcesA}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.pricing.faqCancelQ}</h3>
              <p className="mt-1 text-sm text-zinc-500">{t.pricing.faqCancelA}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
