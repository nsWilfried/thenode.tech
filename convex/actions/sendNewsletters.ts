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
import {
    buildCategoryNewsletterHTML,
    CATEGORY_DISPLAY_NAMES_EN,
    CATEGORY_ICONS,
    localizedCategoryTitle,
    NEWSLETTER_EMAIL_LOGO_MARK,
    type NewsletterData,
    type NewsletterCategorySlug,
    C,
    FONT_TEXT,
    FONT_LABEL,
    SITE_ORIGIN,
    escapeHtml,
    emailButton,
    emailDocument,
    emailFooterRow,
    emailHeaderRows,
    normalizeEmailLang,
} from "../email/categoryNewsletterHtml";
import { filterNewsletterImages } from "../email/verifyNewsletterImages";

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_HEADLINE_SUBJECT_CHARS = 50;

type CategorySlug = NewsletterCategorySlug;

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

/** Resend "From" display name: `{category icon} {localized short name} · TheNode.tech`. */
function categoryNewsletterSenderDisplayName(
    t: EmailTemplateStrings,
    category: CategorySlug
): string {
    const icon = CATEGORY_ICONS[category] ?? NEWSLETTER_EMAIL_LOGO_MARK;
    return `${icon} ${localizedCategoryTitle(t, category)} · TheNode.tech`;
}

function getTargetDeliveryHour(user: {
    preferences?: { preferredDeliveryHour?: number };
}): number {
    const preferred = user.preferences?.preferredDeliveryHour;
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
    // Only send the categories the user explicitly chose. Never fall back to
    // "all categories": an empty/missing list means the user gets nothing.
    const categories = user.preferences?.categories ?? [];
    const valid = new Set<CategorySlug>(ALL_CATEGORY_SLUGS);
    return [...new Set(categories)].filter((c) => valid.has(c));
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
            skippedNoCategories: 0,
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

                const language = user.language || "en";
                const categories = getCategoriesForUser(user);
                if (categories.length === 0) {
                    stats.skippedNoCategories++;
                    continue;
                }
                const emailT = getEmailTranslations(language);

                let sentEmailsForUser = 0;

                for (const category of categories) {
                    // Translations run once a day, so a language picked after that run
                    // has no issue yet: send English rather than nothing.
                    const nl =
                        (await ctx.runQuery(
                            internal.queries.newsletters.getLatestByCategoryInternal,
                            { category, language, date: today }
                        )) ??
                        (language === "en"
                            ? null
                            : await ctx.runQuery(
                                  internal.queries.newsletters.getLatestByCategoryInternal,
                                  { category, language: "en", date: today }
                              ));

                    if (!nl) {
                        continue;
                    }

                    let newsletter = nl as NewsletterData;
                    newsletter = await filterNewsletterImages(newsletter);
                    const subject = buildNewsletterSubject([newsletter], today, language);
                    const html = buildCategoryNewsletterHTML({
                        newsletter,
                        date: today,
                        t: emailT,
                        language,
                    });
                    const senderName = categoryNewsletterSenderDisplayName(emailT, category);

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
            `[sendDailyNewsletters] Complete — sentEmails=${stats.sentEmails}, skippedAlreadySent=${stats.skippedAlreadySent}, skippedNoContent=${stats.skippedNoContent}, skippedNoEmail=${stats.skippedNoEmail}, skippedNoCategories=${stats.skippedNoCategories}`
        );
    },
});

/** Shared simple-email body for the welcome email (2026 rebrand). */
function simpleEmailHTML(args: {
    lang: string;
    headerLabel: string;
    title: string;
    subtitle: string;
    paragraphs: string[];
    listIntro?: string;
    list?: string[];
    list2Intro?: string;
    list2?: string[];
    list2Outro?: string;
    cta?: { label: string; href: string };
    footerNote: string;
    links: { label: string; href: string }[];
}): string {
    const P = (txt: string, extra = "") =>
        `<tr><td style="font-family:${FONT_TEXT}; font-size:17px; line-height:28px; color:${C.text}; padding-bottom:16px;${extra}">${escapeHtml(txt)}</td></tr>`;
    const listBox = (items: string[]) =>
        `<tr><td style="padding:2px 0 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:${C.box}; border-radius:8px; padding:14px 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${items
            .map(
                (it, i) =>
                    `<tr><td width="26" valign="top" style="width:26px; font-family:${FONT_LABEL}; font-size:12px; line-height:22px; font-weight:bold; color:${C.orangeDeep}; padding:6px 0;">${String(i + 1).padStart(2, "0")}</td><td valign="top" style="padding:6px 0; font-family:${FONT_TEXT}; font-size:15px; line-height:22px; color:${C.ink};">${escapeHtml(it)}</td></tr>`
            )
            .join("")}</table></td></tr></table></td></tr>`;
    const body = [
        `<tr><td class="h1" style="font-family:${FONT_TEXT}; font-size:34px; line-height:40px; font-weight:bold; letter-spacing:-1px; color:${C.ink}; padding-bottom:12px;">${escapeHtml(args.title)}</td></tr>`,
        args.subtitle ? P(args.subtitle, ` font-size:18px; line-height:29px; padding-bottom:24px;`) : "",
        ...args.paragraphs.filter(Boolean).map((x) => P(x)),
        args.listIntro ? P(args.listIntro) : "",
        args.list?.length ? listBox(args.list) : "",
        args.list2Intro ? P(args.list2Intro) : "",
        args.list2?.length ? listBox(args.list2) : "",
        args.list2Outro ? P(args.list2Outro) : "",
        args.cta ? `<tr><td style="padding-top:8px;">${emailButton(args.cta.label, args.cta.href, "orange")}</td></tr>` : "",
    ].join("");
    const rows = [
        emailHeaderRows(args.headerLabel),
        `<tr><td style="background-color:${C.paper}; padding:40px 36px 40px;" class="pad"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${body}</table></td></tr>`,
        emailFooterRow({ blurb: args.footerNote, links: args.links }),
    ].join("");
    return emailDocument({ lang: args.lang, title: `${args.title} — TheNode`, preheader: args.subtitle || args.title, rows });
}

function buildWelcomeEmailHTML(t: EmailTemplateStrings, userCategories: CategorySlug[] = [], language = "en"): string {
    const lang = normalizeEmailLang(language);
    const slugs = userCategories.length > 0
        ? userCategories
        : (Object.keys(CATEGORY_DISPLAY_NAMES_EN) as CategorySlug[]);
    return simpleEmailHTML({
        lang,
        headerLabel: "Welcome",
        title: t.welcomeTitle,
        subtitle: t.welcomeSubtitle,
        paragraphs: [t.thanksForSigningUp],
        listIntro: t.whatYouGet,
        list: [t.deepDivesDesc, t.keyStatsDesc, t.quickLinksDesc],
        list2Intro: t.weCover,
        list2: slugs.map((slug) => `${CATEGORY_ICONS[slug]} ${localizedCategoryTitle(t, slug)}`),
        list2Outro: t.headToSettings,
        cta: { label: t.customizePreferences, href: `${SITE_ORIGIN}/${lang}/settings` },
        footerNote: t.receivingBecauseSignup,
        links: [{ label: t.managePreferences, href: `${SITE_ORIGIN}/${lang}/settings` }],
    });
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
            const html = buildWelcomeEmailHTML(t, getCategoriesForUser(user), lang);

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
        const language = user.language || "en";
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

            let newsletter = nl as NewsletterData;
            newsletter = await filterNewsletterImages(newsletter);
            const nlDate = (nl as any).date ?? today;
            const subject = `[TEST] ${buildNewsletterSubject([newsletter], nlDate, language)}`;
            const html = buildCategoryNewsletterHTML({
                newsletter,
                date: nlDate,
                t: emailT,
                language,
            });
            const senderName = categoryNewsletterSenderDisplayName(emailT, category);

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
