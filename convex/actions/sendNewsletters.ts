"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { Resend } from "resend";
import moment from "moment-timezone";
import {
    getEmailTranslations,
    type EmailTemplateStrings,
    type CategorySlug as EmailCategorySlug,
} from "../emailTranslations";

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_HEADLINE_SUBJECT_CHARS = 50;

type CategorySlug =
    | "ai"
    | "eng"
    | "sec"
    | "biz"
    | "tech"
    | "cloud-devops"
    | "web3-crypto"
    | "design-ux-frontend"
    | "emerging-tech-science"
    | "opensource-languages";

const CATEGORY_NAMES: Record<CategorySlug, string> = {
    ai: "AI & Machine Learning",
    eng: "Engineering & Web Dev",
    sec: "Cybersecurity & InfoSec",
    biz: "Startups & VC",
    tech: "Big Tech & Innovation",
    "cloud-devops": "Cloud & DevOps",
    "web3-crypto": "Web3 & Crypto",
    "design-ux-frontend": "Design, UX & Frontend",
    "emerging-tech-science": "Emerging Tech & Science",
    "opensource-languages": "Open Source & Languages",
};

const CATEGORY_ICONS: Record<CategorySlug, string> = {
    ai: "🤖",
    eng: "⚙️",
    sec: "🔒",
    biz: "💼",
    tech: "📱",
    "cloud-devops": "☁️",
    "web3-crypto": "🔗",
    "design-ux-frontend": "🎨",
    "emerging-tech-science": "🔬",
    "opensource-languages": "📦",
};

const DEFAULT_DELIVERY_HOUR = 8;
const DEFAULT_TIMEZONE = "UTC";
const HOUR_MIN = 0;
const HOUR_MAX = 23;

const ALL_CATEGORY_SLUGS: CategorySlug[] = [
    "ai",
    "eng",
    "sec",
    "biz",
    "tech",
    "cloud-devops",
    "web3-crypto",
    "design-ux-frontend",
    "emerging-tech-science",
    "opensource-languages",
];

interface NewsletterData {
    category: CategorySlug;
    articles: { title: string; url: string; summary: string; source?: string }[];
    summary?: string;
    deepDives?: { title: string; url: string; summary: string; imageUrl?: string; source?: string }[];
    stats?: { stat: string; context: string; sourceUrl?: string }[];
    mediaItems?: { type: "image" | "video"; url: string; caption?: string; articleUrl?: string }[];
    editorialContent?: { heading: string; body: string; imageUrl?: string; imageCaption?: string }[];
    underTheRadar?: { title: string; url: string; summary: string; source?: string };
    tryThis?: { name: string; url: string; oneLiner: string }[];
    quoteOfTheDay?: { quote: string; attribution: string; sourceUrl?: string };
}

function truncateAtWord(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;
    const slice = text.slice(0, maxLen);
    const lastSpace = slice.lastIndexOf(" ");
    return lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
}

function buildNewsletterSubject(
    newsletters: NewsletterData[],
    date: string,
    language: string
): string {
    const t = getEmailTranslations(language);
    const localeMoment = moment(date).locale(language);
    const formattedDate = localeMoment.format("MMM D");

    let headline: string | null = null;
    for (const nl of newsletters) {
        if (nl.deepDives?.length && nl.deepDives[0].title) {
            headline = truncateAtWord(nl.deepDives[0].title, MAX_HEADLINE_SUBJECT_CHARS);
            break;
        }
        if (nl.articles?.length && nl.articles[0].title) {
            headline = truncateAtWord(nl.articles[0].title, MAX_HEADLINE_SUBJECT_CHARS);
            break;
        }
    }

    if (headline) {
        return t.subjectWithHeadline
            .replace("{{headline}}", headline)
            .replace("{{date}}", formattedDate);
    }

    const topicNames = newsletters
        .slice(0, 3)
        .map((nl) => t.categoryShortNames[nl.category as EmailCategorySlug] ?? nl.category);
    const topics =
        topicNames.length > 2
            ? `${topicNames.slice(0, 2).join(", ")} ${t.andMore}`
            : topicNames.join(", ");

    return t.subjectWithTopics
        .replace("{{topics}}", topics)
        .replace("{{date}}", formattedDate);
}

function renderCategorySection(
    nl: NewsletterData,
    t: EmailTemplateStrings
): string {
    const icon = CATEGORY_ICONS[nl.category] ?? "🗞️";
    const name = CATEGORY_NAMES[nl.category] ?? nl.category;

    const overviewHtml = nl.summary
        ? `<tr><td style="padding: 16px 0 20px; color: #333; font-size: 16px; line-height: 1.8;">${nl.summary}</td></tr>`
        : "";

    const editorialHtml = (nl.editorialContent || [])
        .map((section) => {
            const imgHtml = section.imageUrl
                ? `<tr><td style="padding: 0 0 8px;">
                        <img src="${section.imageUrl}" alt="${section.imageCaption || section.heading}" style="width: 100%; max-width: 560px; height: auto; border-radius: 8px; display: block;" />
                        ${section.imageCaption ? `<p style="margin: 6px 0 0; font-size: 13px; color: #888; font-style: italic;">${section.imageCaption}</p>` : ""}
                      </td></tr>`
                : "";
            const bodyParagraphs = section.body
                .split("\n\n")
                .map((p) => `<p style="margin: 0 0 16px; color: #333; font-size: 16px; line-height: 1.8;">${p}</p>`)
                .join("");
            return `
              <tr><td style="padding: 28px 0 8px;">
                <h3 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #0a0a0a;">${section.heading}</h3>
              </td></tr>
              ${imgHtml}
              <tr><td>${bodyParagraphs}</td></tr>`;
        })
        .join("");

    const deepDivesHtml = (nl.deepDives || []).length > 0
        ? `<tr><td style="padding: 28px 0 8px; border-top: 1px solid #eee;">
                    <h3 style="margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888;">${t.featuredStories}</h3>
                  </td></tr>` +
          (nl.deepDives || [])
              .map((dive) => {
                  const diveImg = dive.imageUrl
                      ? `<tr><td style="padding: 0 0 8px;">
                              <a href="${dive.url}" style="text-decoration: none;">
                                <img src="${dive.imageUrl}" alt="${dive.title}" style="width: 100%; max-width: 560px; height: auto; border-radius: 8px; display: block;" />
                              </a>
                            </td></tr>`
                      : "";
                  return `
                ${diveImg}
                <tr><td style="padding: 8px 0 20px;">
                  ${dive.source ? `<span style="display: inline-block; padding: 2px 8px; font-size: 12px; font-weight: 600; color: #666; margin-bottom: 6px;">${dive.source}</span><br/>` : ""}
                  <a href="${dive.url}" style="color: #0a0a0a; text-decoration: none; font-weight: 700; font-size: 18px; line-height: 1.4;">${dive.title}</a>
                  <p style="margin: 8px 0 0; color: #555; font-size: 15px; line-height: 1.7;">${dive.summary}</p>
                </td></tr>`;
              })
              .join("")
        : "";

    const statsHtml = (nl.stats || []).length > 0
        ? `<tr><td style="padding: 28px 0 8px; border-top: 1px solid #eee;">
                    <h3 style="margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888;">${t.keyNumbers}</h3>
                  </td></tr>
                  <tr><td style="padding: 16px 0; border-top: 2px solid #0a0a0a;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>${(nl.stats || [])
                          .map((s) => `
                        <td width="${Math.floor(100 / Math.min((nl.stats || []).length, 3))}%" style="padding: 0 12px 0 0; vertical-align: top;">
                          <p style="margin: 0 0 4px; font-size: 22px; font-weight: 800; color: #0a0a0a;">${s.stat}</p>
                          <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">${s.context}</p>
                        </td>`)
                          .slice(0, 3)
                          .join("")}
                      </tr>
                    </table>
                  </td></tr>` +
          ((nl.stats || []).length > 3
              ? `<tr><td style="padding: 12px 0 0;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>${(nl.stats || [])
                                .slice(3)
                                .map((s) => `
                              <td width="${Math.floor(100 / Math.min((nl.stats || []).slice(3).length, 3))}%" style="padding: 0 12px 0 0; vertical-align: top;">
                                <p style="margin: 0 0 4px; font-size: 22px; font-weight: 800; color: #0a0a0a;">${s.stat}</p>
                                <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">${s.context}</p>
                              </td>`)
                                .slice(0, 3)
                                .join("")}
                            </tr>
                          </table>
                        </td></tr>`
              : "")
        : "";

    const underTheRadarHtml = nl.underTheRadar
        ? `<tr><td style="padding: 28px 0 8px; border-top: 1px solid #eee;">
                    <h3 style="margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888;">${t.underTheRadar}</h3>
                  </td></tr>
                  <tr><td style="padding: 12px 0 20px 16px; border-left: 4px solid #0a0a0a;">
                    ${nl.underTheRadar.source ? `<span style="font-size: 12px; color: #666; margin-bottom: 4px;">${nl.underTheRadar.source}</span><br/>` : ""}
                    <a href="${nl.underTheRadar.url}" style="color: #0a0a0a; text-decoration: none; font-weight: 700; font-size: 18px; line-height: 1.4;">${nl.underTheRadar.title}</a>
                    <p style="margin: 8px 0 0; color: #555; font-size: 15px; line-height: 1.7;">${nl.underTheRadar.summary}</p>
                  </td></tr>`
        : "";

    const tryThisHtml = (nl.tryThis && nl.tryThis.length > 0)
        ? `<tr><td style="padding: 28px 0 8px; border-top: 1px solid #eee;">
                    <h3 style="margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888;">${t.tryThis}</h3>
                  </td></tr>` +
          nl.tryThis
              .map((item) => `
                <tr><td style="padding: 10px 0;">
                  <a href="${item.url}" style="color: #0a0a0a; text-decoration: none; font-weight: 600; font-size: 16px;">${item.name}</a>
                  <p style="margin: 4px 0 0; color: #555; font-size: 14px; line-height: 1.6;">${item.oneLiner}</p>
                </td></tr>`)
              .join("")
        : "";

    const quoteOfTheDayHtml = nl.quoteOfTheDay
        ? `<tr><td style="padding: 28px 0 8px; border-top: 1px solid #eee;">
                    <h3 style="margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888;">${t.quoteOfTheDay}</h3>
                  </td></tr>
                  <tr><td style="padding: 16px 0 20px;">
                    <p style="margin: 0; font-size: 18px; line-height: 1.6; color: #0a0a0a; font-style: italic;">"${nl.quoteOfTheDay.quote}"</p>
                    <p style="margin: 10px 0 0; font-size: 14px; color: #666;">— ${nl.quoteOfTheDay.attribution}</p>
                  </td></tr>`
        : "";

    const quickLinksHtml = nl.articles.length > 0
        ? `<tr><td style="padding: 28px 0 8px; border-top: 1px solid #eee;">
                    <h3 style="margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888;">${t.quickLinks}</h3>
                  </td></tr>` +
          nl.articles
              .map((a, i) => `
                <tr><td style="padding: 12px 0; ${i < nl.articles.length - 1 ? "border-bottom: 1px solid #f0f0f0;" : ""}">
                  <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td width="28" style="vertical-align: top; padding-top: 2px;">
                      <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; font-size: 12px; font-weight: 700; color: #999;">${i + 1}</span>
                    </td>
                    <td style="padding-left: 8px;">
                      <a href="${a.url}" style="color: #0a0a0a; text-decoration: none; font-weight: 600; font-size: 15px; line-height: 1.4;">${a.title}</a>
                      <p style="margin: 4px 0 0; color: #666; font-size: 14px; line-height: 1.6;">${a.summary}</p>
                      ${a.source ? `<span style="font-size: 12px; color: #aaa;">${a.source}</span>` : ""}
                    </td>
                  </tr></table>
                </td></tr>`)
              .join("")
        : "";

    return `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 0;">
        <tr>
          <td style="padding: 16px 0; background: #0a0a0a;">
            <span style="font-size: 19px; font-weight: 700; color: #ffffff;">${icon} ${name}</span>
          </td>
        </tr>
        ${overviewHtml}
        ${editorialHtml}
        ${deepDivesHtml}
        ${statsHtml}
        ${underTheRadarHtml}
        ${tryThisHtml}
        ${quoteOfTheDayHtml}
        ${quickLinksHtml}
      </table>`;
}

function buildCategoryNewsletterHTML(
    newsletter: NewsletterData,
    date: string,
    t: EmailTemplateStrings
): string {
    const todayUtc = moment().utc().format("YYYY-MM-DD");
    const formattedDate =
        date === todayUtc ? t.today : moment(date).format("MMMM Do, YYYY");

    const headerIcon = CATEGORY_ICONS[newsletter.category] ?? "🗞️";
    const headerName = CATEGORY_NAMES[newsletter.category] ?? newsletter.category;
    const categorySection = renderCategorySection(newsletter, t);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 16px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background: #ffffff;">
          <tr>
            <td style="text-align: center; padding: 32px 24px 24px; background: #0a0a0a;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff;">${headerIcon} ${headerName}</h1>
              <p style="margin: 6px 0 0; color: #999; font-size: 14px;">${formattedDate} &middot; ${t.dailyDoseOfTech}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              ${categorySection}
            </td>
          </tr>
          <tr>
            <td style="padding: 0 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 24px 0; border-top: 1px solid #eee;">
                    <a href="https://thenode.tech" style="display: inline-block; padding: 12px 28px; background: #0a0a0a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">${t.readOnSite}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding: 20px 24px 28px; background: #fafafa; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.6;">
                ${t.receivingBecause}<br>
                <a href="{{unsubscribe_url}}" style="color: #999;">${t.unsubscribe}</a> &middot;
                <a href="https://thenode.tech/settings" style="color: #999;">${t.managePreferences}</a> &middot;
                <a href="https://thenode.tech/pricing" style="color: #999;">${t.upgradeToPremium}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function getTargetDeliveryHour(user: {
    isPremium?: boolean;
    preferences?: { preferredDeliveryHour?: number };
}): number {
    const isPremium = user.isPremium ?? false;
    const preferred = isPremium ? user.preferences?.preferredDeliveryHour : undefined;
    if (
        typeof preferred === "number" &&
        preferred >= HOUR_MIN &&
        preferred <= HOUR_MAX
    ) {
        return preferred;
    }
    return DEFAULT_DELIVERY_HOUR;
}

function getCategoriesForUser(user: {
    preferences?: { categories?: CategorySlug[] };
}): CategorySlug[] {
    const categories = user.preferences?.categories;
    return categories && categories.length > 0 ? categories : ALL_CATEGORY_SLUGS;
}

// Send newsletters to all subscribers
export const sendDailyNewsletters = internalAction({
    args: {},
    handler: async (ctx) => {
        const today = moment().format("YYYY-MM-DD");
        console.log(`[sendDailyNewsletters] Starting for date: ${today}`);

        const users = await ctx.runQuery(internal.queries.users.getAllVerified);

        if (!users || users.length === 0) {
            console.log("[sendDailyNewsletters] No verified users to send newsletters to");
            return;
        }

        console.log(`[sendDailyNewsletters] Found ${users.length} verified users`);

        const stats = {
            sentEmails: 0,
            skippedNoEmail: 0,
            skippedAlreadySent: 0,
            skippedNoContent: 0,
        };

        for (const user of users) {
            try {
                if (!user.email) {
                    stats.skippedNoEmail++;
                    continue;
                }

                let userTimezone = DEFAULT_TIMEZONE;
                try {
                    const tz = user.timezone || DEFAULT_TIMEZONE;
                    moment().tz(tz);
                    userTimezone = tz;
                } catch {
                    userTimezone = DEFAULT_TIMEZONE;
                }
                const userNow = moment().tz(userTimezone);
                const targetHour = getTargetDeliveryHour(user);

                if (userNow.hour() !== targetHour) {
                    continue;
                }

                if (user.lastNewsletterSent) {
                    const lastSent = moment(user.lastNewsletterSent).tz(userTimezone);
                    if (lastSent.format("YYYY-MM-DD") === userNow.format("YYYY-MM-DD")) {
                        stats.skippedAlreadySent++;
                        continue;
                    }
                }

                const isPremium = user.isPremium ?? false;
                const language = isPremium ? (user.language || "en") : "en";
                const categories = getCategoriesForUser(user);
                const emailT = getEmailTranslations(language);

                let sentEmailsForUser = 0;

                for (const category of categories) {
                    const nl = await ctx.runQuery(
                        internal.queries.newsletters.getLatestByCategoryInternal,
                        { category, language, date: today }
                    );

                    if (!nl) {
                        continue;
                    }

                    const newsletter = nl as NewsletterData;
                    const subject = buildNewsletterSubject([newsletter], today, language);
                    const html = buildCategoryNewsletterHTML(newsletter, today, emailT);
                    const senderIcon = CATEGORY_ICONS[category] ?? "🗞️";
                    const senderName =
                        `${senderIcon} ${CATEGORY_NAMES[category] ?? category} · TheNode.tech`;

                    await resend.emails.send({
                        from: `${senderName} <newsletter@thenode.tech>`,
                        to: user.email,
                        subject,
                        html,
                    });

                    sentEmailsForUser++;
                    stats.sentEmails++;
                    console.log(
                        `[sendDailyNewsletters] Newsletter (${category}) sent to ${user.email}`
                    );
                }

                if (sentEmailsForUser === 0) {
                    stats.skippedNoContent++;
                    console.log(`[sendDailyNewsletters] No newsletters found for ${user.email} (date=${today}, language=${language}, categories=${categories.join(",")})`);
                    continue;
                }

                // Update last sent timestamp
                await ctx.runMutation(internal.mutations.users.updateLastNewsletterSent, {
                    id: user._id,
                    lastNewsletterSent: Date.now(),
                });

                console.log(
                    `[sendDailyNewsletters] ${sentEmailsForUser} newsletter(s) sent to ${user.email}`
                );
            } catch (error) {
                console.error(`[sendDailyNewsletters] Failed to send newsletter to ${user.email}:`, error);
            }
        }

        console.log(
            `[sendDailyNewsletters] Complete — sentEmails=${stats.sentEmails}, skippedAlreadySent=${stats.skippedAlreadySent}, skippedNoContent=${stats.skippedNoContent}, skippedNoEmail=${stats.skippedNoEmail}`
        );
    },
});

function buildWelcomeEmailHTML(t: EmailTemplateStrings): string {
    const categoryList = (Object.keys(CATEGORY_NAMES) as CategorySlug[])
        .map((slug) => `<li style="padding: 4px 0;">${CATEGORY_ICONS[slug]} ${CATEGORY_NAMES[slug]}</li>`)
        .join("");

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="text-align: center; padding: 32px 0 24px;">
        <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #0a0a0a;">${t.welcomeTitle}</h1>
        <p style="margin: 8px 0 0; color: #888; font-size: 16px;">${t.welcomeSubtitle}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 0 24px;">
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
          ${t.thanksForSigningUp}
        </p>
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
          ${t.whatYouGet}
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
          <tr>
            <td style="padding: 16px; background: #f8f9fa; border-radius: 8px;">
              <ul style="margin: 0; padding: 0 0 0 20px; color: #333; font-size: 14px; line-height: 1.8;">
                <li style="padding: 2px 0;">${t.deepDivesDesc}</li>
                <li style="padding: 2px 0;">${t.keyStatsDesc}</li>
                <li style="padding: 2px 0;">${t.quickLinksDesc}</li>
              </ul>
            </td>
          </tr>
        </table>
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 12px;">
          ${t.weCover}
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
          <tr>
            <td style="padding: 16px; background: #f8f9fa; border-radius: 8px;">
              <ul style="margin: 0; padding: 0 0 0 20px; color: #333; font-size: 14px; line-height: 1.6; columns: 2;">
                ${categoryList}
              </ul>
            </td>
          </tr>
        </table>
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
          ${t.headToSettings}
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center;">
              <a href="https://thenode.tech/settings" style="display: inline-block; padding: 14px 32px; background: #0a0a0a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">${t.customizePreferences}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding: 24px 0; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          ${t.receivingBecauseSignup}<br>
          <a href="https://thenode.tech/settings" style="color: #999;">${t.managePreferences}</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const sendWelcomeEmail = internalAction({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.queries.users.getById, {
            id: args.userId,
        });

        if (!user || !user.email) {
            console.log("Skipping welcome email: no user or email found");
            return;
        }

        try {
            const lang = user.language || "en";
            const t = getEmailTranslations(lang);
            const html = buildWelcomeEmailHTML(t);

            await resend.emails.send({
                from: "TheNode.tech <newsletter@thenode.tech>",
                to: user.email,
                subject: t.welcomeSubject,
                html,
            });

            console.log(`Welcome email sent to ${user.email}`);
        } catch (error) {
            console.error(`Failed to send welcome email to ${user.email}:`, error);
        }
    },
});

// --- Premium Upgrade Email ---

function buildPremiumUpgradeEmailHTML(t: EmailTemplateStrings): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="text-align: center; padding: 32px 0 24px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #0a0a0a;">${t.premiumWelcomeTitle}</h1>
        <p style="margin: 8px 0 0; color: #888; font-size: 16px;">${t.premiumWelcomeSubtitle}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 0 24px;">
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
          ${t.premiumThanks}
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
          <tr>
            <td style="padding: 16px; background: #f8f9fa; border-radius: 8px;">
              <ul style="margin: 0; padding: 0 0 0 20px; color: #333; font-size: 14px; line-height: 2;">
                <li>${t.customDeliveryTime}</li>
                <li>${t.multiLanguageSupport}</li>
                <li>${t.priorityContent}</li>
              </ul>
            </td>
          </tr>
        </table>
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
          ${t.headToSettings}
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center;">
              <a href="https://thenode.tech/settings" style="display: inline-block; padding: 14px 32px; background: #0a0a0a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">${t.configurePremium}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding: 24px 0; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          ${t.receivingBecauseUpgrade}<br>
          <a href="https://thenode.tech/settings" style="color: #999;">${t.managePreferences}</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const sendPremiumUpgradeEmail = internalAction({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.queries.users.getById, {
            id: args.userId,
        });

        if (!user || !user.email) {
            console.log("Skipping premium upgrade email: no user or email found");
            return;
        }

        try {
            const lang = user.language || "en";
            const t = getEmailTranslations(lang);
            const html = buildPremiumUpgradeEmailHTML(t);

            await resend.emails.send({
                from: "TheNode.tech <newsletter@thenode.tech>",
                to: user.email,
                subject: t.premiumWelcomeSubject,
                html,
            });

            console.log(`Premium upgrade email sent to ${user.email}`);
        } catch (error) {
            console.error(`Failed to send premium upgrade email to ${user.email}:`, error);
        }
    },
});

// --- Premium Cancellation Email ---

function buildPremiumCancellationEmailHTML(t: EmailTemplateStrings): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="text-align: center; padding: 32px 0 24px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #0a0a0a;">${t.cancellationTitle}</h1>
        <p style="margin: 8px 0 0; color: #888; font-size: 16px;">${t.cancellationSubtitle}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 0 24px;">
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
          ${t.cancellationWhatChanges}
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
          <tr>
            <td style="padding: 16px; background: #f8f9fa; border-radius: 8px;">
              <ul style="margin: 0; padding: 0 0 0 20px; color: #333; font-size: 14px; line-height: 2;">
                <li>${t.keepReceiving}</li>
                <li>${t.deliveryReverts}</li>
                <li>${t.languageReverts}</li>
              </ul>
            </td>
          </tr>
        </table>
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
          ${t.freeContinues}
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center;">
              <a href="https://thenode.tech/pricing" style="display: inline-block; padding: 14px 32px; background: #0a0a0a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">${t.resubscribe}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding: 24px 0; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          ${t.receivingBecauseCancelled}<br>
          <a href="https://thenode.tech/settings" style="color: #999;">${t.managePreferences}</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const testSendDailyNewsletter = internalAction({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.queries.users.getById, {
            id: args.userId,
        });

        if (!user || !user.email) {
            throw new Error("User not found or has no email");
        }

        const today = moment().format("YYYY-MM-DD");
        const isPremium = user.isPremium ?? false;
        const language = isPremium ? (user.language || "en") : "en";
        const categories = getCategoriesForUser(user);
        const emailT = getEmailTranslations(language);

        let sentCount = 0;

        for (const category of categories) {
            let nl: any = await ctx.runQuery(
                internal.queries.newsletters.getLatestByCategoryInternal,
                { category, language, date: today }
            );

            if (!nl) {
                nl = await ctx.runQuery(
                    internal.queries.newsletters.getLatestByCategoryInternalNoDate as any,
                    { category, language }
                );
            }

            if (!nl) {
                console.log(`[TEST] No newsletter found for category=${category}, language=${language}`);
                continue;
            }

            const newsletter = nl as NewsletterData;
            const nlDate = (nl as any).date ?? today;
            const subject = `[TEST] ${buildNewsletterSubject([newsletter], nlDate, language)}`;
            const html = buildCategoryNewsletterHTML(newsletter, nlDate, emailT);
            const senderIcon = CATEGORY_ICONS[category] ?? "🗞️";
            const senderName =
                `${senderIcon} ${CATEGORY_NAMES[category] ?? category} · TheNode.tech`;

            await resend.emails.send({
                from: `${senderName} <newsletter@thenode.tech>`,
                to: user.email,
                subject,
                html,
            });

            sentCount++;
            console.log(`[TEST] Daily newsletter (${category}, date=${nlDate}) sent to ${user.email}`);
        }

        console.log(`[TEST] Done — ${sentCount} daily newsletter(s) sent to ${user.email}`);
    },
});

export const sendPremiumCancellationEmail = internalAction({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.queries.users.getById, {
            id: args.userId,
        });

        if (!user || !user.email) {
            console.log("Skipping premium cancellation email: no user or email found");
            return;
        }

        try {
            const lang = user.language || "en";
            const t = getEmailTranslations(lang);
            const html = buildPremiumCancellationEmailHTML(t);

            await resend.emails.send({
                from: "TheNode.tech <newsletter@thenode.tech>",
                to: user.email,
                subject: t.cancellationSubject,
                html,
            });

            console.log(`Premium cancellation email sent to ${user.email}`);
        } catch (error) {
            console.error(`Failed to send premium cancellation email to ${user.email}:`, error);
        }
    },
});
