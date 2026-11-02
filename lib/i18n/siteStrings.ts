// ────────────────────────────────────────────────
// Strings added for the 2026 rebrand (Astro site).
// Older strings live in ./translations.ts and are still used.
// Placeholders: {name}, {date}, {n}, {tz}
// ────────────────────────────────────────────────

import type { Locale } from "./locales";

export interface SiteStrings {
  nav: {
    channels: string;
    pricing: string;
    signIn: string;
    account: string;
    language: string;
    privacy: string;
  };
  home: {
    badge: string;
    heroTitle: string;
    heroAccent: string;
    heroLead: string;
    subscribe: string;
    subscribeTo: string;
    emailPlaceholder: string;
    sending: string;
    subscribedNote: string;
    freeNote: string;
    learnMore: string;
    channelsTitle: string;
    channelsLead: string;
    latestOn: string;
    comingSoon: string;
    issueKicker: string;
    issueTitle: string;
    issueLead: string;
    featureBrief: string;
    featureNumbers: string;
    featureLinks: string;
    readLatest: string;
    stat1Value: string;
    stat1Title: string;
    stat1Body: string;
    stat2Value: string;
    stat2Title: string;
    stat2Body: string;
    stat3Value: string;
    stat3Title: string;
    stat3Body: string;
  };
  /** One-line blurb per channel, shown on the home page cards. */
  channelBlurbs: {
    ai: string;
    eng: string;
    sec: string;
    biz: string;
    tech: string;
    "cloud-devops": string;
    "web3-crypto": string;
    "design-ux-frontend": string;
    "emerging-tech-science": string;
    "opensource-languages": string;
  };
  category: {
    allChannels: string;
    pastIssues: string;
    noIssues: string;
    stories: string;
    minRead: string;
    notFound: string;
  };
  signin: {
    linkSent: string;
    signedInAs: string;
    continue: string;
  };
  settings: {
    weeklyDigestTitle: string;
    weeklyDigestDescPremium: string;
    weeklyDigestDescFree: string;
    enableWeeklyDigest: string;
    deliveryDay: string;
    days: [string, string, string, string, string, string, string];
    deliveredAtPreferredHour: string;
    defaultSuffix: string;
    freeDeliveryNote: string;
    upgradeLink: string;
    detectedTimezone: string;
    channelsHint: string;
    unsubscribeTitle: string;
    unsubscribeDesc: string;
    unsubscribeButton: string;
    pausedDesc: string;
    resubscribeButton: string;
    signedOut: string;
  };
  feedback: {
    title: string;
    yes: string;
    no: string;
    back: string;
  };
  issue: {
    notFound: string;
    backToChannel: string;
  };
  footer: {
    tagline: string;
  };
}

const en: SiteStrings = {
  nav: {
    channels: "Channels",
    pricing: "Pricing",
    signIn: "Sign in",
    account: "Account",
    language: "Language",
    privacy: "Privacy",
  },
  home: {
    badge: "Daily · 10 channels · 9 languages",
    heroTitle: "Tech news, summarized by AI.",
    heroAccent: "Delivered daily.",
    heroLead:
      "275+ sources. 10 categories. AI-curated summaries. Get the most impactful stories from the tech world in 5 minutes.",
    subscribe: "Subscribe",
    subscribeTo: "Subscribe to {name}",
    emailPlaceholder: "you@example.com",
    sending: "Sending…",
    subscribedNote:
      "Check your inbox — tap the link we just sent to confirm and pick your channels.",
    freeNote: "Free daily newsletter. Premium users get it in their language.",
    learnMore: "Learn more",
    channelsTitle: "Ten channels. Pick yours.",
    channelsLead: "Every channel is its own daily email. Subscribe to one or all ten.",
    latestOn: "Latest · {date}",
    comingSoon: "Coming soon",
    issueKicker: "What an issue looks like",
    issueTitle: "Three stories, the numbers that matter, and five quick links.",
    issueLead:
      "Each issue opens with three one-line takeaways you can read in ten seconds. Scroll on for the full stories, the key numbers, and five quick links.",
    featureBrief: "In brief",
    featureNumbers: "Key numbers",
    featureLinks: "Quick links",
    readLatest: "Read the latest issue",
    stat1Value: "275+",
    stat1Title: "Sources, read for you",
    stat1Body:
      "RSS feeds from top tech publications, research labs, engineering blogs, and industry leaders across 10 categories.",
    stat2Value: "5–7",
    stat2Title: "Stories per channel",
    stat2Body:
      "AI picks the stories that matter, writes the summary, and tells you what to remember. Five minutes, done.",
    stat3Value: "8 AM",
    stat3Title: "In your timezone",
    stat3Body:
      "Every day, in English for free. Premium gets it in your language, at the hour you choose.",
  },
  channelBlurbs: {
    ai: "Large language models, research papers, and corporate AI lab announcements.",
    eng: "Architecture, languages, tooling, and how teams actually ship.",
    sec: "Vulnerabilities, patches, incidents, and the people fixing them.",
    biz: "Funding, earnings, strategy, and the deals that move the industry.",
    tech: "Consumer hardware, platforms, and product launches worth your attention.",
    "cloud-devops": "Infrastructure, platforms, CI/CD, and open-source operations.",
    "web3-crypto": "Protocols, regulation, and the infrastructure behind the headlines.",
    "design-ux-frontend": "Interfaces, design systems, and research on how people use software.",
    "emerging-tech-science": "Robotics, quantum, biotech, and what is coming out of the labs.",
    "opensource-languages": "Releases, governance, licensing, and the maintainers behind them.",
  },
  category: {
    allChannels: "All channels",
    pastIssues: "Past issues",
    noIssues:
      "First issue lands soon. Subscribe above and it will be in your inbox at 8 AM the day it ships.",
    stories: "{n} stories",
    minRead: "{n} min",
    notFound: "Channel not found",
  },
  signin: {
    linkSent:
      "Link sent. Check your inbox and tap the link to sign in — it expires in 15 minutes.",
    signedInAs: "Signed in as {name}",
    continue: "Continue",
  },
  settings: {
    weeklyDigestTitle: "Weekly digest",
    weeklyDigestDescPremium:
      "A curated week-in-review email summarizing trends and top stories across your channels.",
    weeklyDigestDescFree:
      "Upgrade to Premium to receive a weekly digest with cross-channel insights and trend analysis.",
    enableWeeklyDigest: "Enable weekly digest",
    deliveryDay: "Delivery day",
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    deliveredAtPreferredHour: "Delivered at your preferred delivery hour.",
    defaultSuffix: "(default)",
    freeDeliveryNote: "Daily newsletter: 8:00 AM in your timezone.",
    upgradeLink: "Upgrade to Premium",
    detectedTimezone: "Your timezone: {tz} (detected).",
    channelsHint: "You will only receive the channels you tick here.",
    unsubscribeTitle: "Unsubscribe",
    unsubscribeDesc: "Stop all TheNode emails. You can come back at any time.",
    unsubscribeButton: "Unsubscribe from all emails",
    pausedDesc: "You are unsubscribed. You will not receive any newsletter.",
    resubscribeButton: "Resubscribe",
    signedOut: "You are signed out.",
  },
  feedback: {
    title: "Thanks for the feedback",
    yes: "Glad it was useful. See you in tomorrow's issue.",
    no: "Noted. We read every answer and use it to shape the next issue.",
    back: "Back to TheNode",
  },
  issue: {
    notFound: "This issue could not be found.",
    backToChannel: "Back to the channel",
  },
  footer: {
    tagline: "Daily tech news, one channel at a time.",
  },
};

// Other locales are filled in siteStrings.locales.ts
import { SITE_STRINGS_LOCALES } from "./siteStrings.locales";

export const SITE_STRINGS: Record<Locale, SiteStrings> = {
  en,
  ...SITE_STRINGS_LOCALES,
};

export function getSiteStrings(locale: Locale): SiteStrings {
  return SITE_STRINGS[locale] ?? en;
}

/** Replace {key} placeholders. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));
}
