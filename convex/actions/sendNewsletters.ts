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

function buildNewsletterHTML(
    newsletters: {
        category: CategorySlug;
        articles: { title: string; url: string; summary: string; source?: string }[];
        summary?: string;
    }[],
    date: string
): string {
    const formattedDate = moment(date).format("MMMM Do, YYYY");

    const categorySections = newsletters
        .map((nl) => {
            const icon = CATEGORY_ICONS[nl.category];
            const name = CATEGORY_NAMES[nl.category];
            const articleItems = nl.articles
                .map(
                    (a) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
            <a href="${a.url}" style="color: #0a0a0a; text-decoration: none; font-weight: 600; font-size: 15px;">${a.title}</a>
            <p style="margin: 4px 0 0; color: #555; font-size: 14px; line-height: 1.5;">${a.summary}</p>
            ${a.source ? `<span style="color: #888; font-size: 12px;">Source: ${a.source}</span>` : ""}
          </td>
        </tr>`
                )
                .join("");

            return `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
        <tr>
          <td style="padding: 12px 16px; background: #f8f9fa; border-radius: 8px; font-size: 16px; font-weight: 700;">
            ${icon} ${name}
          </td>
        </tr>
        ${nl.summary ? `<tr><td style="padding: 8px 0; color: #666; font-size: 13px; font-style: italic;">${nl.summary}</td></tr>` : ""}
        ${articleItems}
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="text-align: center; padding: 24px 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #0a0a0a;">⚡ TheNode.tech</h1>
        <p style="margin: 4px 0 0; color: #888; font-size: 14px;">${formattedDate} — Your daily dose of tech</p>
      </td>
    </tr>
    <tr>
      <td>
        ${categorySections}
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding: 24px 0; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          You're receiving this because you subscribed to TheNode.tech newsletter.<br>
          <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a> · 
          <a href="https://thenode.tech/settings" style="color: #999;">Manage preferences</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Send newsletters to all subscribers
export const sendDailyNewsletters = internalAction({
    args: {},
    handler: async (ctx) => {
        const today = moment().format("YYYY-MM-DD");

        // Get all users
        const users = await ctx.runQuery(internal.queries.users.getAllVerified);

        if (!users || users.length === 0) {
            console.log("No verified users to send newsletters to");
            return;
        }

        // Process each user
        for (const user of users) {
            try {
                if (!user.email) continue;

                // Check if it's time to send based on user's timezone
                const userTimezone = user.timezone || "UTC";
                const userNow = moment().tz(userTimezone);
                const userHour = userNow.hour();

                const isPremium = user.isPremium ?? false;
                const preferredHour = isPremium
                    ? user.preferences?.preferredDeliveryHour
                    : undefined;

                if (
                    typeof preferredHour === "number" &&
                    preferredHour >= 0 &&
                    preferredHour <= 23
                ) {
                    if (userHour !== preferredHour) {
                        continue;
                    }
                } else if (userHour < 7 || userHour > 9) {
                    continue;
                }

                // Check if already sent today
                if (user.lastNewsletterSent) {
                    const lastSent = moment(user.lastNewsletterSent).tz(userTimezone);
                    if (lastSent.format("YYYY-MM-DD") === userNow.format("YYYY-MM-DD")) {
                        continue;
                    }
                }

                const language = isPremium ? (user.language || "en") : "en";

                // Fetch today's newsletters for user's preferred categories
                const categories = user.preferences?.categories || [
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
                    continue;
                }

                const html = buildNewsletterHTML(
                    newsletters as {
                        category: CategorySlug;
                        articles: {
                            title: string;
                            url: string;
                            summary: string;
                            source?: string;
                        }[];
                        summary?: string;
                    }[],
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

                console.log(`Newsletter sent to ${user.email}`);
            } catch (error) {
                console.error(`Failed to send newsletter to ${user.email}:`, error);
            }
        }

        console.log("Daily newsletter delivery complete");
    },
});

