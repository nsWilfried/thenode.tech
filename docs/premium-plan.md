# TheNode Premium: from "more newsletter" to "what affects me"

> **Status: idea on hold, nothing here is built.** On 2026-11-05 Premium was retired and its features (language, delivery hour, timezone, weekly digest) became free for everyone. The tables below describe the plan as it was before that. Phase 0 is done, and "Kept as is" items are now free, so any future paid plan has to stand on Watch alone.
>
> Polar's backend (webhook, customer portal, `convex/polar.ts`) stays in place only so that subscribers who were still active can cancel. Those subscribers need to be cancelled in Polar, so the "$2.99 price kept" idea below no longer applies.

## Context

You asked whether the $2.99 Premium plan is worth paying for. From the code, mostly not:

| What is promised | What the code does | Verdict |
|---|---|---|
| Newsletter in your language | Translates each issue with gpt-4o-mini | Real, but only matters to non-English readers |
| Choose your delivery hour | Works (`sendNewsletters.ts:114`) | Real, but a small convenience |
| "Priority delivery" | No priority logic. It is the same hourly send, and the only difference is the chosen hour | Not a real feature |
| Weekly Digest | Summarizes daily issues the reader already received (`weeklyDigest.ts:100-126`) | Real, but contains nothing new |
| "Early access to new features" | No early-access gate anywhere in the code | Not a real feature |
| "Deeper analysis and more detailed coverage" (upgrade email template) | Premium got the same content as Free. The template was never sent, because nothing called it | Not a real feature, but never promised to anyone |

The underlying problem is that Premium sells more of what Free already gives away. Free has all 10 channels and a public archive, and AI summaries of news are easy to get elsewhere.

People pay when something saves them from a costly miss or makes a decision easier. TheNode already ingests 275+ feeds, including security advisories and vendor and engineering blogs. What it lacks is any knowledge of what each reader actually uses.

## Recommendation: TheNode Watch

**The pitch: "Tell us what you run on. We tell you when something changes that affects you, and what to do about it."**

**Who pays:** tech leads, CTOs at small companies and indie founders. They have no one watching this full-time, and they can expense it. This replaces the "serious tech enthusiast" positioning.

### What Premium includes

1. **Watchlist.** Up to 25 tools, vendors and companies, such as Next.js, Postgres, Stripe, AWS or a competitor.
2. **"Affects you" alerts.** Sent the same day, and only when something real happens. No email when nothing changed.
3. **One Brief.** All chosen channels merged into one email with watchlist items on top. Today, 5 channels means 5 separate emails a day (`sendNewsletters.ts:205-232`).
4. **Weekly digest, rewritten as "your week".** What changed in your stack and which actions are still open, instead of a recap.
5. **Kept as is:** translation and delivery hour.
6. **Removed:** priority delivery, early access and the "deeper analysis" claim.

### Example alert

> **Your stack: Redis** · License change · Decide within 30 days
> **What changed:** New releases move to a different license.
> **Affects you if:** you resell Redis as part of a hosted service.
> **What to do:** Check your hosting provider's position, and pin your version until you decide.
> Source: [link]

*(Illustrative format only, not real generated output.)*

### How it avoids competing with Dependabot

Dependabot and Snyk already cover package vulnerabilities in a repo, often for free, so CVEs alone would not justify a price. Watch covers what those tools miss: **price changes, deprecations, shutdowns, license changes, breaking changes, major incidents and acquisitions**. Security issues are included, but they are not the main selling point.

### Price

**$9/month or $90/year**, with existing subscribers kept at $2.99. This is my judgment and has not been tested. Phase 1 gives the first real signal.

### Ideas I set aside

- **Ask the archive (AI search):** general AI search tools already compete here, and summarized articles are deleted daily, so there is little history to search.
- **Community or human-written analysis:** needs ongoing time from you and a larger audience.
- **Team and Slack delivery:** a good later upsell once individuals are paying.

## Plan

### Phase 0: Fix the promises (do this regardless)

- Remove the unsupported claims from `lib/i18n/translations.ts` and `convex/emailTranslations.ts`, in all 9 languages.
- Remove the unused upgrade email template from `convex/actions/sendNewsletters.ts`.

### Phase 1: Test demand before building the engine

- Add a Watchlist panel to `src/islands/Settings.tsx`, plus a new `watchItems` table in `convex/schema.ts` with its mutations.
- Update `src/pages/[lang]/pricing.astro` and its strings to pitch Watch as a beta.
- Contact current users directly and ask them to enter their stack.
- **Decision point:** if fewer than about 5 real people fill in a watchlist within two weeks, stop and rethink. There were only about 4 onboarded users as of Nov 2, so this also depends on outreach beyond them. The threshold is a judgment call and is small enough to give direction only.

### Phase 2: Matching and alerts

- **Add `convex/actions/matchWatchlists.ts`.** A keyword and alias filter runs first, so the LLM only sees candidates. The LLM then decides whether this is a real change for users of the item, and returns the change type, urgency, who is affected and the action.
- **Match at ingest, not after summarizing.** `summarizeArticles.ts:124` only uses 30 articles per category, and `:293` marks the rest as done without using them. Cleanup then deletes them. Hook in from `convex/actions/ingestFeeds.ts`.
- **Add structured sources, on a faster schedule than the 8-hour feed cycle** (`convex/crons.ts:7`). Candidates are the CISA KEV catalog, GitHub Advisories, GitHub releases and endoflife.date. Confirm access and terms for each when building.
- **Add a `watchAlerts` table** to dedupe alerts per user and store open actions.
- **Add `convex/email/watchAlertHtml.ts`.** Reuse the existing `simpleEmailHTML` helper from `sendNewsletters.ts`, gate on `isPremium`, and add an "Alerts" topic in `convex/actions/resendSync.ts`.
- **Require a source URL from the input and a supporting quote for every alert.** One wrong alert costs more trust than a missed one, so the filter should favor precision.

### Phase 3: One Brief and "your week"

- Add a merged email built from the existing newsletter documents, starting from `convex/email/categoryNewsletterHtml.ts`.
- Add a Settings toggle for merged or per-channel delivery.
- Change the digest prompt and template in `convex/actions/weeklyDigest.ts` and `convex/email/weeklyDigestHtml.ts` to use the reader's alerts.

### Phase 4: Start charging

- Create the new Polar product and prices, and keep the existing $2.99 subscribers on their price (`convex/polar.ts`, `POLAR_PREMIUM_PRODUCT_ID`).
- Update `src/pages/[lang]/privacy.astro`, since a company's stack is sensitive information.
- **Upgrade the Resend plan first.** The free plan's 100 emails/day will not cover this, and today's one-email-per-channel sending already uses it up quickly.

## Verification

- **Alert quality before anyone receives one:** run the matcher on a week of real articles with a realistic test watchlist, and read every result by hand. Aim for at least 9 in 10 alerts being truly relevant, and check that each quote appears in its source.
- **End to end:** on a test account, add a watch item, seed a matching article, and confirm one alert arrives with no duplicate on the next run.
- **Gating:** confirm a free account gets no alerts and no merged brief, and that its existing emails are unchanged.
- **Build:** run `npx -y node@24 node_modules/astro/bin/astro.mjs build`, then check the pricing and settings pages in at least EN and FR.
- **Deployment:** `npx convex dev --once` deploys to the **live** backend (`usable-guineapig-213`), so backend changes go live immediately.
- **After launch:** track alert open rate, "was this useful" votes, watchlist size and renewals.

## Separate issue

`summarizeArticles.ts:124` and `:293` silently discard everything past the first 30 articles per category, for free readers too. Busy channels may lose stories every day. This is outside this plan, but worth fixing.
