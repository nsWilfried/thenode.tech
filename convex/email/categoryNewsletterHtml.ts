/**
 * Daily category newsletter HTML (Resend). Table-based, inline styles.
 * 2026 rebrand: cream paper, ink header with the animated TheNode logo, orange accents.
 * Reference design: brand/TheNode Newsletter - Final.html
 *
 * Kept free of Node-only imports: the website also imports this to render issues online.
 */

import {
    type CategorySlug,
    type EmailTemplateStrings,
} from "../emailTranslations";

/** Masthead mark fallback if category has no icon mapping (used in sender display names). */
export const NEWSLETTER_EMAIL_LOGO_MARK = "⚡";

/** Increment when category newsletter HTML changes (echoed in sent email source). */
export const NEWSLETTER_HTML_TEMPLATE_VERSION = 30;

export const SITE_ORIGIN = "https://thenode.tech";
export const EMAIL_LOGO_ANIMATED = `${SITE_ORIGIN}/brand/logo-animated.gif`;
export const EMAIL_LOGO_ON_DARK = `${SITE_ORIGIN}/brand/logo-on-dark.png`;
export const EMAIL_POSTAL_LINE = "TheNode.tech · Montréal, QC, Canada";

/** Design tokens (see brand/TheNode Newsletter - Final.html). */
export const C = {
    outer: "#ebe6db",
    paper: "#fbfaf7",
    cream: "#f6f1e7",
    box: "#f3efe6",
    ink: "#1c1917",
    orange: "#ea580c",
    orangeDeep: "#c2410c",
    text: "#3d3935",
    muted: "#6f6a62",
    quickText: "#4a4541",
    rule: "#e6e0d3",
    darkRule: "#3a3531",
    darkText: "#d6cfc0",
    darkMuted: "#a39d93",
} as const;

export const FONT_TEXT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
export const FONT_LABEL = "'Trebuchet MS', Tahoma, Verdana, sans-serif";

export function escapeHtml(text: string): string {
    return String(text ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/** Only http(s)/mailto URLs survive; anything else becomes "#". Escaped for attributes. */
export function safeUrl(url: string | undefined | null): string {
    const u = String(url ?? "").trim();
    if (/^(https?:|mailto:)/i.test(u)) return escapeHtml(u);
    return "#";
}

export type NewsletterCategorySlug = CategorySlug;

export interface NewsletterData {
    /** Convex document id when available (used for the "Read online" link). */
    _id?: string;
    date?: string;
    category: NewsletterCategorySlug;
    articles: { title: string; url: string; summary: string; source?: string }[];
    summary?: string;
    deepDives?: {
        title: string;
        url: string;
        summary: string;
        imageUrl?: string;
        source?: string;
    }[];
    stats?: { stat: string; context: string; sourceUrl?: string }[];
    mediaItems?: {
        type: "image" | "video";
        url: string;
        caption?: string;
        articleUrl?: string;
    }[];
    editorialContent?: {
        heading: string;
        body: string;
        imageUrl?: string;
        imageCaption?: string;
    }[];
    underTheRadar?: { title: string; url: string; summary: string; source?: string };
    tryThis?: { name: string; url: string; oneLiner: string }[];
    quoteOfTheDay?: { quote: string; attribution: string; sourceUrl?: string };
}

/** English display names — fallback if translation missing */
export const CATEGORY_DISPLAY_NAMES_EN: Record<NewsletterCategorySlug, string> = {
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

export const CATEGORY_ICONS: Record<NewsletterCategorySlug, string> = {
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

export function localizedCategoryTitle(
    t: EmailTemplateStrings,
    category: NewsletterCategorySlug
): string {
    return t.categoryShortNames[category] ?? CATEGORY_DISPLAY_NAMES_EN[category] ?? category;
}

const LOCALES = ["en", "es", "fr", "de", "ja", "zh", "pt", "it", "ko"];

export function normalizeEmailLang(language: string): string {
    const key = String(language || "en").split(/[-_]/)[0].toLowerCase();
    return LOCALES.includes(key) ? key : "en";
}

function fill(template: string, vars: Record<string, string | number>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ""));
}

/** "Lundi 2 novembre 2026" — capitalized, locale-aware, timezone-safe. */
export function formatIssueDate(date: string, language: string): string {
    try {
        const d = new Date(`${date}T12:00:00Z`);
        if (Number.isNaN(d.getTime())) return date;
        const s = new Intl.DateTimeFormat(language, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
        }).format(d);
        return s.charAt(0).toUpperCase() + s.slice(1);
    } catch {
        return date;
    }
}

const CJK = new Set(["ja", "zh", "ko"]);

function readingMinutes(text: string, language: string): number {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) return 1;
    const units = CJK.has(language) ? clean.replace(/\s/g, "").length / 450 : clean.split(" ").length / 220;
    return Math.max(1, Math.round(units));
}

// ───────────────────────── shared building blocks ─────────────────────────

const LABEL = `font-family:${FONT_LABEL}; font-size:11px; line-height:16px; letter-spacing:1.4px; text-transform:uppercase;`;

function rp(inner: string): string {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${inner}</table>`;
}

/** Dark ink header row: animated logo left, label right, then the 4px orange bar. */
export function emailHeaderRows(rightLabel: string): string {
    return `<tr><td style="background-color:${C.ink}; padding:0;">${rp(
        `<tr><td class="pad" style="padding:20px 36px 18px;" valign="middle"><a href="${SITE_ORIGIN}/" style="text-decoration:none;"><img src="${EMAIL_LOGO_ANIMATED}" width="150" height="55" alt="TheNode" style="display:block; width:150px; height:55px; border:0;"></a></td><td class="pad" align="right" style="padding:22px 36px 20px; ${LABEL} color:${C.orange};" valign="middle">${escapeHtml(rightLabel)}</td></tr>`
    )}</td></tr>
<tr><td style="background-color:${C.orange}; height:4px; line-height:4px; font-size:4px;">&nbsp;</td></tr>`;
}

/** Dark footer: logo, blurb, links, postal line. */
export function emailFooterRow(args: {
    blurb: string;
    links: { label: string; href: string }[];
}): string {
    const links = args.links
        .map((l) => `<a href="${safeUrl(l.href)}" style="color:${C.orange}; text-decoration:none;">${escapeHtml(l.label)}</a>`)
        .join(" &nbsp;·&nbsp; ");
    return `<tr><td style="background-color:${C.ink}; padding:30px 36px 34px;" class="pad">${rp(
        `<tr><td style="padding-bottom:10px;"><img src="${EMAIL_LOGO_ON_DARK}" width="105" alt="TheNode" style="display:block; width:105px; height:auto; border:0;"></td></tr>
<tr><td style="font-family:${FONT_TEXT}; font-size:14px; line-height:22px; color:${C.darkText}; padding-bottom:18px;">${escapeHtml(args.blurb)}</td></tr>
<tr><td style="font-family:${FONT_LABEL}; font-size:12px; line-height:20px; color:${C.darkMuted};">${links}</td></tr>
<tr><td style="font-family:${FONT_LABEL}; font-size:11px; line-height:18px; color:${C.muted}; padding-top:16px;">${escapeHtml(EMAIL_POSTAL_LINE)}</td></tr>`
    )}</td></tr>`;
}

/** Full document shell: outer cream table, 600px column, mobile media queries, preheader. */
export function emailDocument(args: {
    lang: string;
    title: string;
    preheader: string;
    rows: string;
    templateComment?: string;
}): string {
    const pad = "&nbsp;&zwnj;".repeat(40);
    return `<!DOCTYPE html>
${args.templateComment ?? ""}
<html lang="${escapeHtml(args.lang)}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${escapeHtml(args.title)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body { margin:0; padding:0; }
  table { border-collapse:collapse; }
  img { border:0; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  @media only screen and (max-width:620px) {
    .wrap { width:100% !important; }
    .pad { padding-left:22px !important; padding-right:22px !important; }
    .h1 { font-size:30px !important; line-height:36px !important; }
    .h2 { font-size:22px !important; line-height:28px !important; }
    .num { font-size:40px !important; line-height:44px !important; }
    .stack { display:block !important; width:100% !important; }
    .stack-gap { height:18px !important; display:block !important; width:100% !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:${C.outer};">
<span style="display:none; font-size:1px; color:${C.outer}; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">${escapeHtml(args.preheader)}${pad}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.outer};">
<tr><td align="center" style="padding:28px 12px 40px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">
${args.rows}
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}

/** Ink "button" (bulletproof table cell). */
export function emailButton(label: string, href: string, variant: "ink" | "light" | "orange" = "ink"): string {
    const bg = variant === "ink" ? C.ink : variant === "orange" ? C.orange : C.box;
    const fg = variant === "light" ? C.ink : C.cream;
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${bg}" style="background-color:${bg}; border-radius:5px;"><a href="${safeUrl(href)}" style="white-space:nowrap; display:block; padding:11px 18px; font-family:${FONT_LABEL}; font-size:12px; line-height:16px; font-weight:bold; color:${fg}; text-decoration:none;">${escapeHtml(label)}</a></td></tr></table>`;
}

// ───────────────────────── category newsletter ─────────────────────────

type Story = { heading: string; body: string; imageUrl?: string; caption?: string; url?: string };

function storiesFor(nl: NewsletterData): { stories: Story[]; usedDeepDives: boolean } {
    const ed = (nl.editorialContent ?? []).filter((s) => s.heading || s.body);
    if (ed.length > 0) {
        return {
            stories: ed.map((s) => ({ heading: s.heading, body: s.body, imageUrl: s.imageUrl, caption: s.imageCaption })),
            usedDeepDives: false,
        };
    }
    return {
        stories: (nl.deepDives ?? []).map((d) => ({
            heading: d.title,
            body: d.summary,
            imageUrl: d.imageUrl,
            url: d.url,
        })),
        usedDeepDives: true,
    };
}

export function buildCategoryNewsletterHTML(args: {
    newsletter: NewsletterData;
    date: string;
    t: EmailTemplateStrings;
    isPremium: boolean;
    language: string;
}): string {
    const { newsletter: nl, t } = args;
    const lang = normalizeEmailLang(args.language);
    const date = nl.date || args.date;
    const catName = localizedCategoryTitle(t, nl.category);
    const { stories, usedDeepDives } = storiesFor(nl);

    const allText = [
        nl.summary ?? "",
        ...stories.map((s) => `${s.heading} ${s.body}`),
        ...(nl.deepDives ?? []).map((d) => `${d.title} ${d.summary}`),
        ...nl.articles.map((a) => `${a.title} ${a.summary}`),
    ].join(" ");
    const minutes = readingMinutes(allText, lang);

    const headline =
        (!usedDeepDives ? nl.deepDives?.[0]?.title : undefined) ||
        stories[0]?.heading ||
        nl.articles[0]?.title ||
        catName;

    const brief = stories.slice(0, 3);
    const preheader = brief.map((s) => s.heading).join(" · ") || nl.summary || headline;

    // Canonical, SEO-friendly issue URL: /<lang>/category/<channel>/<YYYY-MM-DD>
    const onlineUrl = date
        ? `${SITE_ORIGIN}/${lang}/category/${encodeURIComponent(nl.category)}/${encodeURIComponent(date)}`
        : `${SITE_ORIGIN}/${lang}/category/${encodeURIComponent(nl.category)}`;

    // ── Intro (meta, h1, summary, In brief) ──
    const briefRows = brief
        .map(
            (s, i) =>
                `<tr><td width="26" valign="top" style="width:26px; font-family:${FONT_LABEL}; font-size:12px; line-height:22px; font-weight:bold; color:${C.orangeDeep}; padding:6px 0;">${String(i + 1).padStart(2, "0")}</td><td valign="top" style="padding:6px 0; font-family:${FONT_TEXT}; font-size:14px; line-height:22px; color:${C.ink};"><a href="#s${i + 1}" style="color:${C.ink}; text-decoration:none; border-bottom:1px solid ${C.orange};">${escapeHtml(s.heading)}</a></td></tr>`
        )
        .join("");
    const briefBox = brief.length
        ? `<tr><td style="background-color:${C.box}; border-radius:8px; padding:18px 22px 14px;">${rp(
              `<tr><td colspan="2" style="${LABEL} color:${C.muted}; padding-bottom:8px;">${escapeHtml(t.inBrief)}</td></tr>${briefRows}`
          )}</td></tr>`
        : "";
    const meta = [catName, formatIssueDate(date, lang), fill(t.minRead, { n: minutes })]
        .map(escapeHtml)
        .join(" &nbsp;·&nbsp; ");
    const intro = `<tr><td style="background-color:${C.paper}; padding:40px 36px 10px;" class="pad">${rp(
        `<tr><td style="${LABEL} color:${C.muted}; padding-bottom:16px;">${meta}</td></tr>
<tr><td class="h1" style="font-family:${FONT_TEXT}; font-size:34px; line-height:40px; font-weight:bold; letter-spacing:-1px; color:${C.ink}; padding-bottom:20px;">${escapeHtml(headline)}</td></tr>
${nl.summary ? `<tr><td style="font-family:${FONT_TEXT}; font-size:18px; line-height:29px; color:${C.text}; padding-bottom:28px;">${escapeHtml(nl.summary)}</td></tr>` : ""}
${briefBox}`
    )}</td></tr>`;

    // ── Stories ──
    const storyRows = stories
        .map((s, i) => {
            const last = i === stories.length - 1;
            const paras = s.body
                .split(/\n\s*\n/)
                .map((p) => p.trim())
                .filter(Boolean);
            const parasHtml = paras
                .map(
                    (p, j) =>
                        `<tr><td style="font-family:${FONT_TEXT}; font-size:17px; line-height:28px; color:${C.text}; padding-bottom:${j === paras.length - 1 ? (s.url ? 12 : 0) : 16}px;">${escapeHtml(p)}</td></tr>`
                )
                .join("");
            const img = s.imageUrl
                ? `<tr><td style="padding-bottom:${s.caption ? 10 : 18}px;"><img src="${safeUrl(s.imageUrl)}" width="528" alt="${escapeHtml(s.caption || s.heading)}" style="display:block; width:100%; max-width:528px; height:auto; border-radius:6px;"></td></tr>`
                : "";
            const caption = s.caption
                ? `<tr><td style="font-family:${FONT_LABEL}; font-size:12px; line-height:18px; color:${C.muted}; padding-bottom:18px;">${escapeHtml(s.caption)}</td></tr>`
                : "";
            const readMore = s.url
                ? `<tr><td style="font-family:${FONT_LABEL}; font-size:12px; line-height:18px; font-weight:bold;"><a href="${safeUrl(s.url)}" style="color:${C.orangeDeep}; text-decoration:none;">${escapeHtml(t.readArticle)}</a></td></tr>`
                : "";
            const storyMin = fill(t.minShort, { n: readingMinutes(`${s.heading} ${s.body}`, lang) });
            return `<tr><td style="background-color:${C.paper}; padding:34px 36px ${last ? 40 : 0}px;" class="pad">${rp(
                `<tr><td style="${LABEL} color:${C.orangeDeep}; padding-bottom:10px;"><a id="s${i + 1}" name="s${i + 1}" style="color:${C.orangeDeep}; text-decoration:none;">${String(i + 1).padStart(2, "0")} &nbsp;·&nbsp; ${escapeHtml(catName)}</a> <span style="color:${C.muted}; letter-spacing:0; text-transform:none;">&nbsp;· ${escapeHtml(storyMin)}</span></td></tr>
<tr><td class="h2" style="font-family:${FONT_TEXT}; font-size:24px; line-height:30px; font-weight:bold; letter-spacing:-0.6px; color:${C.ink}; padding-bottom:18px;">${escapeHtml(s.heading)}</td></tr>
${img}${caption}${parasHtml}${readMore}
<tr><td style="padding-bottom:${last ? 0 : 34}px; ${last ? "" : `border-bottom:1px solid ${C.rule};`} font-size:0; line-height:0;">&nbsp;</td></tr>`
            )}</td></tr>`;
        })
        .join("");

    // ── Dark block: key numbers + quote of the day ──
    const stats = nl.stats ?? [];
    const statCell = (s: { stat: string; context: string; sourceUrl?: string }) =>
        rp(
            `<tr><td class="num" style="font-family:${FONT_TEXT}; font-size:46px; line-height:50px; font-weight:bold; letter-spacing:-2px; color:${C.cream}; padding-bottom:8px;">${escapeHtml(s.stat)}</td></tr>
<tr><td style="font-family:${FONT_TEXT}; font-size:15px; line-height:23px; color:${C.darkText}; padding-bottom:8px;">${escapeHtml(s.context)}</td></tr>
${s.sourceUrl ? `<tr><td style="font-family:${FONT_LABEL}; font-size:12px; line-height:18px;"><a href="${safeUrl(s.sourceUrl)}" style="color:${C.orange}; text-decoration:underline;">${escapeHtml(t.sourceLabel)}</a></td></tr>` : ""}`
        );
    const statPairs: string[] = [];
    for (let i = 0; i < stats.length; i += 2) {
        const a = stats[i];
        const b = stats[i + 1];
        statPairs.push(
            `<tr><td style="padding-bottom:${i + 2 < stats.length ? 26 : 0}px;">${rp(
                `<tr><td class="stack" width="48%" valign="top" style="width:48%;">${statCell(a)}</td><td class="stack-gap" width="4%" style="width:4%; font-size:0; line-height:0;">&nbsp;</td><td class="stack" width="48%" valign="top" style="width:48%;">${b ? statCell(b) : "&nbsp;"}</td></tr>`
            )}</td></tr>`
        );
    }
    const q = nl.quoteOfTheDay;
    const quoteRows = q
        ? `${stats.length ? `<tr><td style="padding-top:30px; border-bottom:1px solid ${C.darkRule}; font-size:0; line-height:0;">&nbsp;</td></tr><tr><td style="padding-top:30px; font-size:0; line-height:0;">&nbsp;</td></tr>` : ""}
<tr><td style="${LABEL} color:${C.orange}; padding-bottom:8px;">${escapeHtml(t.quoteOfTheDay)}</td></tr>
<tr><td style="font-family:${FONT_TEXT}; font-size:18px; line-height:27px; font-style:italic; color:${C.cream}; padding-bottom:8px;">“${escapeHtml(q.quote)}”</td></tr>
<tr><td style="font-family:${FONT_TEXT}; font-size:15px; line-height:24px; color:${C.darkText};">— ${q.sourceUrl ? `<a href="${safeUrl(q.sourceUrl)}" style="color:${C.darkText}; text-decoration:underline;">${escapeHtml(q.attribution)}</a>` : escapeHtml(q.attribution)}</td></tr>`
        : "";
    const darkBlock =
        stats.length || q
            ? `<tr><td style="background-color:${C.ink}; padding:36px 36px 34px;" class="pad">${rp(
                  `${stats.length ? `<tr><td style="${LABEL} color:${C.orange}; padding-bottom:22px;">${escapeHtml(t.keyNumbers)}</td></tr>${statPairs.join("")}` : ""}${quoteRows}`
              )}</td></tr>`
            : "";

    // ── Top stories (deep dives) ──
    const dives = usedDeepDives ? [] : nl.deepDives ?? [];
    const diveRows = dives
        .map(
            (d, i) =>
                `<tr><td style="padding:22px 0 ${i === dives.length - 1 ? 30 : 22}px; ${i === dives.length - 1 ? "" : `border-bottom:1px solid ${C.rule};`}">${rp(
                    `${d.source ? `<tr><td style="${LABEL} color:${C.orangeDeep}; padding-bottom:8px;">${escapeHtml(d.source)}</td></tr>` : ""}
<tr><td style="font-family:${FONT_TEXT}; font-size:19px; line-height:26px; font-weight:bold; letter-spacing:-0.4px; padding-bottom:10px;"><a href="${safeUrl(d.url)}" style="color:${C.ink}; text-decoration:none;">${escapeHtml(d.title)}</a></td></tr>
<tr><td style="font-family:${FONT_TEXT}; font-size:16px; line-height:26px; color:${C.text}; padding-bottom:10px;">${escapeHtml(d.summary)}</td></tr>
<tr><td style="font-family:${FONT_LABEL}; font-size:12px; line-height:18px; font-weight:bold;"><a href="${safeUrl(d.url)}" style="color:${C.orangeDeep}; text-decoration:none;">${escapeHtml(t.readArticle)}</a></td></tr>`
                )}</td></tr>`
        )
        .join("");
    const topStories = dives.length
        ? `<tr><td style="background-color:${C.paper}; padding:40px 36px 8px;" class="pad">${rp(
              `<tr><td style="${LABEL} color:${C.muted}; padding-bottom:20px; border-bottom:2px solid ${C.ink};">${escapeHtml(t.featuredStories)}</td></tr>${diveRows}`
          )}</td></tr>`
        : "";

    // ── Under the radar / Try this cards ──
    type Card = { label: string; kicker?: string; title: string; text: string; url: string; cta: string };
    const cards: Card[] = [];
    if (nl.underTheRadar) {
        cards.push({
            label: t.underTheRadar,
            kicker: nl.underTheRadar.source,
            title: nl.underTheRadar.title,
            text: nl.underTheRadar.summary,
            url: nl.underTheRadar.url,
            cta: t.readArticle,
        });
    }
    for (const item of nl.tryThis ?? []) {
        if (cards.length >= 2) break;
        cards.push({ label: t.tryThis, title: item.name, text: item.oneLiner, url: item.url, cta: t.tryItCta });
    }
    const cardHtml = (c: Card) =>
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.box}; border-radius:8px;"><tr><td style="padding:22px 22px 24px;">${rp(
            `<tr><td style="${LABEL} color:${C.muted}; padding-bottom:14px;">${escapeHtml(c.label)}</td></tr>
${c.kicker ? `<tr><td style="${LABEL} color:${C.orangeDeep}; padding-bottom:6px;">${escapeHtml(c.kicker)}</td></tr>` : ""}
<tr><td style="font-family:${FONT_TEXT}; font-size:16px; line-height:22px; font-weight:bold; letter-spacing:-0.3px; padding-bottom:10px;"><a href="${safeUrl(c.url)}" style="color:${C.ink}; text-decoration:none;">${escapeHtml(c.title)}</a></td></tr>
<tr><td style="font-family:${FONT_TEXT}; font-size:15px; line-height:23px; color:${C.text}; padding-bottom:18px;">${escapeHtml(c.text)}</td></tr>
<tr><td>${emailButton(c.cta, c.url)}</td></tr>`
        )}</td></tr></table>`;
    const cardsRow = cards.length
        ? `<tr><td style="background-color:${C.paper}; padding:${dives.length ? 0 : 40}px 36px 40px;" class="pad">${rp(
              cards.length === 2
                  ? `<tr><td class="stack" width="48%" valign="top" style="width:48%;">${cardHtml(cards[0])}</td><td class="stack-gap" width="4%" style="width:4%; font-size:0; line-height:0;">&nbsp;</td><td class="stack" width="48%" valign="top" style="width:48%;">${cardHtml(cards[1])}</td></tr>`
                  : `<tr><td>${cardHtml(cards[0])}</td></tr>`
          )}</td></tr>`
        : "";

    // ── Quick links ──
    const arts = nl.articles ?? [];
    const quickRows = arts
        .map((a, i) => {
            const lastB = i === arts.length - 1 ? ` border-bottom:1px solid ${C.rule};` : "";
            return `<tr><td width="34" valign="top" style="width:34px; font-family:${FONT_LABEL}; font-size:13px; line-height:22px; font-weight:bold; color:${C.orangeDeep}; padding:12px 0; border-top:1px solid ${C.rule};${lastB}">${String(i + 1).padStart(2, "0")}</td><td valign="top" style="padding:12px 0; border-top:1px solid ${C.rule};${lastB}"><a href="${safeUrl(a.url)}" style="font-family:${FONT_TEXT}; font-size:15px; line-height:22px; font-weight:bold; letter-spacing:-0.3px; color:${C.ink}; text-decoration:none;">${escapeHtml(a.title)}</a><div style="font-family:${FONT_TEXT}; font-size:14px; line-height:21px; color:${C.quickText}; padding-top:3px;">${escapeHtml(a.summary)}${a.source ? ` <span style="font-family:${FONT_LABEL}; font-size:11px; color:${C.muted};">— ${escapeHtml(a.source)}</span>` : ""}</div></td></tr>`;
        })
        .join("");
    const quickLinks = arts.length
        ? `<tr><td style="background-color:${C.cream}; border-top:1px solid ${C.rule}; padding:36px 36px 36px;" class="pad">${rp(
              `<tr><td colspan="2" style="${LABEL} color:${C.muted}; padding-bottom:18px;">${escapeHtml(t.quickLinks)}</td></tr>${quickRows}`
          )}</td></tr>`
        : "";

    // ── Feedback ──
    const fb = (r: string) =>
        `${SITE_ORIGIN}/feedback?c=${encodeURIComponent(nl.category)}&d=${encodeURIComponent(date)}&l=${lang}&r=${r}`;
    const mailto = `mailto:?subject=${encodeURIComponent(`TheNode — ${headline}`)}&body=${encodeURIComponent(onlineUrl)}`;
    const feedback = `<tr><td style="background-color:${C.paper}; border-top:1px solid ${C.rule}; padding:30px 36px 32px;" class="pad">${rp(
        `<tr><td style="font-family:${FONT_TEXT}; font-size:16px; line-height:22px; font-weight:bold; color:${C.ink}; padding-bottom:6px;">${escapeHtml(t.feedbackQuestion)}</td></tr>
<tr><td style="font-family:${FONT_TEXT}; font-size:14px; line-height:22px; color:${C.text}; padding-bottom:16px;">${escapeHtml(t.feedbackHint)}</td></tr>
<tr><td>${rp(
            `<tr><td style="padding-right:10px;" width="1">${emailButton(t.feedbackYes, fb("yes"))}</td><td style="padding-right:10px;" width="1">${emailButton(t.feedbackNo, fb("no"), "light")}</td><td align="right" style="font-family:${FONT_LABEL}; font-size:12px; line-height:18px;"><a href="${safeUrl(mailto)}" style="color:${C.orangeDeep}; text-decoration:none; font-weight:bold;">${escapeHtml(t.forwardToColleague)}</a></td></tr>`
        )}</td></tr>`
    )}</td></tr>`;

    const footer = emailFooterRow({
        blurb: `${t.footerBlurb} ${t.receivingBecause}`,
        links: [
            { label: t.readOnSite, href: onlineUrl },
            { label: t.managePreferences, href: `${SITE_ORIGIN}/${lang}/settings` },
            args.isPremium
                ? { label: t.manageSubscription, href: `${SITE_ORIGIN}/${lang}/settings#account` }
                : { label: t.upgradeToPremium, href: `${SITE_ORIGIN}/${lang}/pricing` },
            { label: t.unsubscribe, href: `${SITE_ORIGIN}/${lang}/settings#unsubscribe` },
        ],
    });

    return emailDocument({
        lang,
        title: `${headline} — TheNode`,
        preheader,
        templateComment: `<!-- TheNode category newsletter template v${NEWSLETTER_HTML_TEMPLATE_VERSION} -->`,
        rows: [emailHeaderRows(catName), intro, storyRows, darkBlock, topStories, cardsRow, quickLinks, feedback, footer].join("\n"),
    });
}
