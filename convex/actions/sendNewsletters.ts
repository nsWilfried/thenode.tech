"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { Resend } from "resend";
import moment from "moment-timezone";

const resend = new Resend(process.env.RESEND_API_KEY);

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
}

function buildNewsletterHTML(newsletters: NewsletterData[], date: string): string {
    const todayUtc = moment().utc().format("YYYY-MM-DD");
    const formattedDate =
        date === todayUtc ? "Today" : moment(date).format("MMMM Do, YYYY");

    const categorySections = newsletters
        .map((nl) => {
            const icon = CATEGORY_ICONS[nl.category];
            const name = CATEGORY_NAMES[nl.category];

            const overviewHtml = nl.summary
                ? `<tr><td style="padding: 12px 0 16px; color: #333; font-size: 15px; line-height: 1.7;">${nl.summary}</td></tr>`
                : "";

            const editorialHtml = (nl.editorialContent || [])
                .map((section) => {
                    const imgHtml = section.imageUrl
                        ? `<tr><td style="padding: 0 0 8px;">
                            <img src="${section.imageUrl}" alt="${section.imageCaption || section.heading}" style="width: 100%; max-width: 560px; height: auto; border-radius: 8px; display: block;" />
                            ${section.imageCaption ? `<p style="margin: 6px 0 0; font-size: 12px; color: #888; font-style: italic;">${section.imageCaption}</p>` : ""}
                          </td></tr>`
                        : "";
                    const bodyParagraphs = section.body
                        .split("\n\n")
                        .map((p) => `<p style="margin: 0 0 12px; color: #333; font-size: 15px; line-height: 1.7;">${p}</p>`)
                        .join("");
                    return `
              <tr><td style="padding: 20px 0 4px;">
                <h3 style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: #0a0a0a;">${section.heading}</h3>
              </td></tr>
              ${imgHtml}
              <tr><td>${bodyParagraphs}</td></tr>`;
                })
                .join("");

            const deepDivesHtml = (nl.deepDives || []).length > 0
                ? `<tr><td style="padding: 24px 0 8px;">
                    <h3 style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888;">Featured Stories</h3>
                  </td></tr>` +
                  (nl.deepDives || []).map((dive) => {
                      const diveImg = dive.imageUrl
                          ? `<tr><td style="padding: 0 0 8px;">
                              <a href="${dive.url}" style="text-decoration: none;">
                                <img src="${dive.imageUrl}" alt="${dive.title}" style="width: 100%; max-width: 560px; height: auto; border-radius: 8px; display: block;" />
                              </a>
                            </td></tr>`
                          : "";
                      return `
                ${diveImg}
                <tr><td style="padding: 4px 0 16px;">
                  ${dive.source ? `<span style="display: inline-block; padding: 2px 8px; background: #f0f0f0; border-radius: 4px; font-size: 11px; font-weight: 600; color: #666; margin-bottom: 6px;">${dive.source}</span><br/>` : ""}
                  <a href="${dive.url}" style="color: #0a0a0a; text-decoration: none; font-weight: 700; font-size: 17px; line-height: 1.4;">${dive.title}</a>
                  <p style="margin: 6px 0 0; color: #555; font-size: 14px; line-height: 1.6;">${dive.summary}</p>
                </td></tr>`;
                  }).join("")
                : "";

            const statsHtml = (nl.stats || []).length > 0
                ? `<tr><td style="padding: 24px 0 12px;">
                    <h3 style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888;">Key Numbers</h3>
                  </td></tr>
                  <tr><td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>${(nl.stats || []).map((s) => `
                        <td width="${Math.floor(100 / Math.min((nl.stats || []).length, 3))}%" style="padding: 12px; background: #f8f9fa; border-radius: 8px; vertical-align: top;">
                          <p style="margin: 0 0 4px; font-size: 22px; font-weight: 800; color: #0a0a0a;">${s.stat}</p>
                          <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.5;">${s.context}</p>
                        </td>`).slice(0, 3).join('<td width="12"></td>')}
                      </tr>
                    </table>
                  </td></tr>` +
                  ((nl.stats || []).length > 3
                      ? `<tr><td style="padding: 8px 0 0;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>${(nl.stats || []).slice(3).map((s) => `
                              <td width="${Math.floor(100 / Math.min((nl.stats || []).slice(3).length, 3))}%" style="padding: 12px; background: #f8f9fa; border-radius: 8px; vertical-align: top;">
                                <p style="margin: 0 0 4px; font-size: 22px; font-weight: 800; color: #0a0a0a;">${s.stat}</p>
                                <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.5;">${s.context}</p>
                              </td>`).slice(0, 3).join('<td width="12"></td>')}
                            </tr>
                          </table>
                        </td></tr>`
                      : "")
                : "";

            const mediaHtml = (nl.mediaItems || []).filter((m) => m.type === "image").length > 0
                ? `<tr><td style="padding: 24px 0 12px;">
                    <h3 style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888;">Media Spotlight</h3>
                  </td></tr>
                  <tr><td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>${(nl.mediaItems || []).filter((m) => m.type === "image").slice(0, 3).map((item) => `
                        <td width="32%" style="vertical-align: top;">
                          <a href="${item.articleUrl || item.url}" style="text-decoration: none;">
                            <img src="${item.url}" alt="${item.caption || ""}" style="width: 100%; height: auto; border-radius: 6px; display: block;" />
                            ${item.caption ? `<p style="margin: 4px 0 0; font-size: 11px; color: #888; line-height: 1.4;">${item.caption}</p>` : ""}
                          </a>
                        </td>`).join('<td width="2%"></td>')}
                      </tr>
                    </table>
                  </td></tr>`
                : "";

            const quickLinksHtml = nl.articles.length > 0
                ? `<tr><td style="padding: 24px 0 8px; border-top: 1px solid #eee;">
                    <h3 style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888;">Quick Links</h3>
                  </td></tr>` +
                  nl.articles.map((a, i) => `
                <tr><td style="padding: 10px 0; ${i < nl.articles.length - 1 ? "border-bottom: 1px solid #f5f5f5;" : ""}">
                  <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td width="28" style="vertical-align: top; padding-top: 2px;">
                      <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 4px; background: #f0f0f0; font-size: 11px; font-weight: 700; color: #999;">${i + 1}</span>
                    </td>
                    <td style="padding-left: 8px;">
                      <a href="${a.url}" style="color: #0a0a0a; text-decoration: none; font-weight: 600; font-size: 14px; line-height: 1.4;">${a.title}</a>
                      <p style="margin: 3px 0 0; color: #666; font-size: 13px; line-height: 1.5;">${a.summary}</p>
                      ${a.source ? `<span style="font-size: 11px; color: #aaa;">${a.source}</span>` : ""}
                    </td>
                  </tr></table>
                </td></tr>`).join("")
                : "";

            return `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
        <tr>
          <td style="padding: 14px 16px; background: #0a0a0a; border-radius: 8px;">
            <span style="font-size: 17px; font-weight: 700; color: #ffffff;">${icon} ${name}</span>
          </td>
        </tr>
        ${overviewHtml}
        ${editorialHtml}
        ${deepDivesHtml}
        ${statsHtml}
        ${mediaHtml}
        ${quickLinksHtml}
      </table>`;
        })
        .join("");

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
      <td align="center" style="padding: 24px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="text-align: center; padding: 32px 24px 24px; background: #0a0a0a;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff;">⚡ TheNode.tech</h1>
              <p style="margin: 6px 0 0; color: #999; font-size: 14px;">${formattedDate} — Your daily dose of tech</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              ${categorySections}
            </td>
          </tr>
          <tr>
            <td style="padding: 0 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 24px 0; border-top: 1px solid #eee;">
                    <a href="https://thenode.tech" style="display: inline-block; padding: 12px 28px; background: #0a0a0a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Read on TheNode.tech</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding: 20px 24px 28px; background: #fafafa; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.6;">
                You're receiving this because you subscribed to TheNode.tech newsletter.<br>
                <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a> &middot;
                <a href="https://thenode.tech/settings" style="color: #999;">Manage preferences</a> &middot;
                <a href="https://thenode.tech/pricing" style="color: #999;">Upgrade to Premium</a>
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
            sent: 0,
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

                const userTimezone = user.timezone || DEFAULT_TIMEZONE;
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

                const newsletters: any[] = [];
                for (const category of categories) {
                    const nl = await ctx.runQuery(
                        internal.queries.newsletters.getLatestByCategoryInternal,
                        { category, language, date: today }
                    );
                    if (nl) {
                        newsletters.push(nl);
                    }
                }

                if (newsletters.length === 0) {
                    stats.skippedNoContent++;
                    console.log(`[sendDailyNewsletters] No newsletters found for ${user.email} (date=${today}, language=${language}, categories=${categories.join(",")})`);
                    continue;
                }

                const html = buildNewsletterHTML(
                    newsletters as NewsletterData[],
                    today
                );

                // Send email via Resend
                await resend.emails.send({
                    from: "TheNode.tech <newsletter@thenode.tech>",
                    to: user.email,
                    subject: `⚡ TheNode.tech — ${moment(today).format("MMM D, YYYY")}`,
                    html,
                });

                // Update last sent timestamp
                await ctx.runMutation(internal.mutations.users.updateLastNewsletterSent, {
                    id: user._id,
                    lastNewsletterSent: Date.now(),
                });

                stats.sent++;
                console.log(`[sendDailyNewsletters] Newsletter sent to ${user.email}`);
            } catch (error) {
                console.error(`[sendDailyNewsletters] Failed to send newsletter to ${user.email}:`, error);
            }
        }

        console.log(
            `[sendDailyNewsletters] Complete — sent=${stats.sent}, skippedAlreadySent=${stats.skippedAlreadySent}, skippedNoContent=${stats.skippedNoContent}, skippedNoEmail=${stats.skippedNoEmail}`
        );
    },
});

function buildWelcomeEmailHTML(): string {
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
        <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #0a0a0a;">Welcome to TheNode.tech</h1>
        <p style="margin: 8px 0 0; color: #888; font-size: 16px;">Your daily tech intelligence, delivered.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 0 24px;">
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
          Thanks for signing up! Every morning, we comb through hundreds of tech news sources and use AI to distill the signal from the noise — so you don't have to.
        </p>
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
          Here's what you'll get in each edition:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
          <tr>
            <td style="padding: 16px; background: #f8f9fa; border-radius: 8px;">
              <ul style="margin: 0; padding: 0 0 0 20px; color: #333; font-size: 14px; line-height: 1.8;">
                <li style="padding: 2px 0;"><strong>Deep Dives</strong> — Expert analysis of the 2-3 biggest stories of the day</li>
                <li style="padding: 2px 0;"><strong>Key Stats</strong> — Notable numbers and data points you should know</li>
                <li style="padding: 2px 0;"><strong>Quick Links</strong> — Scannable summaries of everything else worth reading</li>
              </ul>
            </td>
          </tr>
        </table>
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 12px;">
          We cover 10 categories across the tech landscape:
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
          Head to your settings to pick the categories you care about, set your timezone, and choose your preferred delivery time. Your first newsletter will arrive tomorrow morning.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center;">
              <a href="https://thenode.tech/settings" style="display: inline-block; padding: 14px 32px; background: #0a0a0a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Customize Your Preferences</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding: 24px 0; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          You're receiving this because you signed up for TheNode.tech.<br>
          <a href="https://thenode.tech/settings" style="color: #999;">Manage preferences</a>
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
            const html = buildWelcomeEmailHTML();

            await resend.emails.send({
                from: "TheNode.tech <newsletter@thenode.tech>",
                to: user.email,
                subject: "Welcome to TheNode.tech — Your daily tech digest starts now",
                html,
            });

            console.log(`Welcome email sent to ${user.email}`);
        } catch (error) {
            console.error(`Failed to send welcome email to ${user.email}:`, error);
        }
    },
});

// --- Premium Upgrade Email ---

function buildPremiumUpgradeEmailHTML(): string {
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
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #0a0a0a;">Welcome to Premium!</h1>
        <p style="margin: 8px 0 0; color: #888; font-size: 16px;">Thank you for upgrading your TheNode.tech experience.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 0 24px;">
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
          You now have access to the full premium experience. Here's what's unlocked:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
          <tr>
            <td style="padding: 16px; background: #f8f9fa; border-radius: 8px;">
              <ul style="margin: 0; padding: 0 0 0 20px; color: #333; font-size: 14px; line-height: 2;">
                <li><strong>Custom Delivery Time</strong> — Choose the exact hour you want your newsletter delivered</li>
                <li><strong>Multi-Language Support</strong> — Receive your digest in your preferred language</li>
                <li><strong>Priority Content</strong> — Get deeper analysis and more detailed coverage</li>
              </ul>
            </td>
          </tr>
        </table>
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
          Head to your settings to configure your premium features. Your next newsletter will include the enhanced premium content.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center;">
              <a href="https://thenode.tech/settings" style="display: inline-block; padding: 14px 32px; background: #0a0a0a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Configure Premium Settings</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding: 24px 0; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          You're receiving this because you upgraded to TheNode.tech Premium.<br>
          <a href="https://thenode.tech/settings" style="color: #999;">Manage preferences</a>
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
            const html = buildPremiumUpgradeEmailHTML();

            await resend.emails.send({
                from: "TheNode.tech <newsletter@thenode.tech>",
                to: user.email,
                subject: "Welcome to Premium — Your upgraded experience starts now",
                html,
            });

            console.log(`Premium upgrade email sent to ${user.email}`);
        } catch (error) {
            console.error(`Failed to send premium upgrade email to ${user.email}:`, error);
        }
    },
});

// --- Premium Cancellation Email ---

function buildPremiumCancellationEmailHTML(): string {
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
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #0a0a0a;">Subscription Cancelled</h1>
        <p style="margin: 8px 0 0; color: #888; font-size: 16px;">We're sorry to see you go.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 0 24px;">
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
          Your premium subscription has been cancelled. Here's what changes:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
          <tr>
            <td style="padding: 16px; background: #f8f9fa; border-radius: 8px;">
              <ul style="margin: 0; padding: 0 0 0 20px; color: #333; font-size: 14px; line-height: 2;">
                <li><strong>You'll keep receiving</strong> your daily newsletter with all your selected categories</li>
                <li><strong>Delivery window</strong> reverts to the default 7-9 AM window</li>
                <li><strong>Language</strong> will revert to English</li>
              </ul>
            </td>
          </tr>
        </table>
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
          Your free newsletter will continue without interruption. If you change your mind, you can re-subscribe at any time.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center;">
              <a href="https://thenode.tech/pricing" style="display: inline-block; padding: 14px 32px; background: #0a0a0a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Re-subscribe to Premium</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding: 24px 0; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          You're receiving this because your TheNode.tech Premium subscription was cancelled.<br>
          <a href="https://thenode.tech/settings" style="color: #999;">Manage preferences</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

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
            const html = buildPremiumCancellationEmailHTML();

            await resend.emails.send({
                from: "TheNode.tech <newsletter@thenode.tech>",
                to: user.email,
                subject: "Your Premium subscription has been cancelled",
                html,
            });

            console.log(`Premium cancellation email sent to ${user.email}`);
        } catch (error) {
            console.error(`Failed to send premium cancellation email to ${user.email}:`, error);
        }
    },
});

