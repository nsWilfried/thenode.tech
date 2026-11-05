/**
 * "Week in Review" email, in the TheNode email design.
 * Reference design: Claude Design "TheNode Weekly - Week in Review.html".
 * Sections are omitted when the digest has no data for them (never invented).
 */
import { getEmailTranslations, type CategorySlug } from "../emailTranslations";
import {
    C,
    EMAIL_LOGO_ANIMATED,
    FONT_LABEL,
    FONT_TEXT,
    SITE_ORIGIN,
    escapeHtml,
    localizedCategoryTitle,
    normalizeEmailLang,
    safeUrl,
} from "./categoryNewsletterHtml";

export interface WeeklyDigestData {
    weekStartDate: string;
    weekEndDate: string;
    overview: string;
    topStories: Array<{ title: string; url: string; summary: string; category: CategorySlug; source?: string }>;
    trendAnalysis: Array<{ trend: string; analysis: string; relatedCategories: CategorySlug[] }>;
    weeklyStats?: Array<{ stat: string; context: string; sourceUrl?: string }>;
    categoryHighlights: Array<{ category: CategorySlug; headline: string; summary: string }>;
}

/** Channel colour (label + chip underline) and pastel chip background. */
const HUES: Record<string, { hue: string; tint: string }> = {
    ai: { hue: "#7c3aed", tint: "#ede9fe" },
    eng: { hue: "#0f766e", tint: "#ccfbf1" },
    sec: { hue: "#dc2626", tint: "#fee2e2" },
    biz: { hue: "#b45309", tint: "#fef3c7" },
    tech: { hue: "#334155", tint: "#e2e8f0" },
    "cloud-devops": { hue: "#2563eb", tint: "#dbeafe" },
    "web3-crypto": { hue: "#4f46e5", tint: "#e0e7ff" },
    "design-ux-frontend": { hue: "#db2777", tint: "#fce7f3" },
    "emerging-tech-science": { hue: "#0891b2", tint: "#cffafe" },
    "opensource-languages": { hue: "#16a34a", tint: "#dcfce7" },
};
const hueFor = (slug: string) => HUES[slug] ?? { hue: C.orangeDeep, tint: "#fff3ea" };
const iconFor = (slug: string) => `${SITE_ORIGIN}/brand/icons/ch-${HUES[slug] ? slug : "tech"}.png`;

const WHITE = "#ffffff";
const SOFT_RULE = "#efe9df";
const CARD_RULE = "#e9e3d8";
const TINT = "#fff3ea";
const LABEL = `font-family:${FONT_LABEL}; font-size:11px; line-height:16px; letter-spacing:1.4px; text-transform:uppercase;`;
const T = (inner: string) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${inner}</table>`;
const CJK = new Set(["ja", "zh", "ko"]);

function weekLabel(start: string, end: string, lang: string): string {
    const d = (s: string) => new Date(`${s}T12:00:00Z`);
    try {
        const a = new Intl.DateTimeFormat(lang, { month: "short", day: "numeric", timeZone: "UTC" }).format(d(start));
        const b = new Intl.DateTimeFormat(lang, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d(end));
        return `${a} – ${b}`;
    } catch {
        return `${start} – ${end}`;
    }
}

function minutes(digest: WeeklyDigestData, lang: string): number {
    const text = [
        digest.overview,
        ...digest.trendAnalysis.map((t) => `${t.trend} ${t.analysis}`),
        ...digest.topStories.map((s) => `${s.title} ${s.summary}`),
        ...digest.categoryHighlights.map((c) => `${c.headline} ${c.summary}`),
    ].join(" ");
    const n = CJK.has(lang) ? text.replace(/\s/g, "").length / 500 : text.split(/\s+/).filter(Boolean).length / 220;
    return Math.max(1, Math.round(n));
}

function chip(slug: string, size: 34 | 40): string {
    const { hue, tint } = hueFor(slug);
    const img = size === 34 ? 18 : 20;
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="${size}" height="${size}" align="center" valign="middle" style="width:${size}px; height:${size}px; background-color:${tint}; border-radius:${size === 34 ? 9 : 11}px; border-bottom:3px solid ${hue};"><img src="${iconFor(slug)}" width="${img}" height="${img}" alt="" style="display:block; width:${img}px; height:${img}px; border:0;"></td></tr></table>`;
}

function sectionTitle(label: string, pad = 6): string {
    return `<tr><td style="${LABEL} color:${C.muted}; padding-bottom:${pad}px; border-bottom:2px solid ${C.ink};">${escapeHtml(label)}</td></tr>`;
}

export function buildWeeklyDigestHTML(digest: WeeklyDigestData, language: string): string {
    const lang = normalizeEmailLang(language);
    const t = getEmailTranslations(lang);
    const base = `${SITE_ORIGIN}/${lang}`;
    const range = weekLabel(digest.weekStartDate, digest.weekEndDate, lang);
    const readTime = t.minRead.replace("{{n}}", String(minutes(digest, lang)));
    const trends = digest.trendAnalysis.filter((x) => x.trend);
    const stories = digest.topStories.filter((x) => x.title);
    // The generator pads missing highlights with the whole overview: skip those fillers.
    const overviewText = (digest.overview ?? "").trim();
    const highlights = digest.categoryHighlights.filter(
        (x) => (x.headline || x.summary) && (x.summary ?? "").trim() !== overviewText
    );
    const stats = (digest.weeklyStats ?? []).filter((x) => x.stat);
    const paragraphs = (digest.overview ?? "").split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

    const rows: string[] = [];

    // Masthead
    rows.push(`<tr><td style="background-color:${C.ink};">${T(`<tr>
<td class="pad" style="padding:20px 36px 18px;" valign="middle"><a href="${SITE_ORIGIN}/" style="text-decoration:none;"><img src="${EMAIL_LOGO_ANIMATED}" width="150" height="55" alt="TheNode" style="display:block; width:150px; height:55px; border:0;"></a></td>
<td class="pad" align="right" valign="middle" style="padding:22px 36px 20px; ${LABEL} color:${C.orange};">${escapeHtml(t.weeklyDigestTitle)}</td>
</tr>`)}</td></tr>
<tr><td style="background-color:${C.orange}; height:4px; line-height:4px; font-size:4px;">&nbsp;</td></tr>`);

    // Hero: date, title, three trends, overview
    const brief = trends.slice(0, 3);
    const briefBox = brief.length
        ? `<tr><td style="background-color:${TINT}; border-radius:10px; padding:20px 22px 16px;">${T(
              `<tr><td colspan="2" style="${LABEL} color:${C.orangeDeep}; padding-bottom:8px;">${escapeHtml(t.weeklyThreeTrends)}</td></tr>` +
                  brief
                      .map(
                          (x, i) =>
                              `<tr><td width="26" valign="top" style="width:26px; font-family:${FONT_LABEL}; font-size:12px; line-height:22px; font-weight:bold; color:${C.orangeDeep}; padding:6px 0;">${String(i + 1).padStart(2, "0")}</td><td valign="top" style="padding:6px 0; font-family:${FONT_TEXT}; font-size:15px; line-height:22px; color:${C.ink};"><a href="#t${i + 1}" style="color:${C.ink}; text-decoration:none; border-bottom:1px solid ${C.orange};">${escapeHtml(x.trend)}</a></td></tr>`
                      )
                      .join("")
          )}</td></tr>
<tr><td style="height:30px; font-size:0; line-height:0;">&nbsp;</td></tr>`
        : "";
    rows.push(`<tr><td class="pad" style="background-color:${WHITE}; padding:42px 36px 8px;">${T(
        `<tr><td style="${LABEL} color:${C.muted}; padding-bottom:16px;">${escapeHtml(range)} &nbsp;·&nbsp; ${escapeHtml(readTime)}</td></tr>
<tr><td class="h1" style="font-family:${FONT_TEXT}; font-size:40px; line-height:44px; font-weight:bold; letter-spacing:-1.4px; color:${C.ink}; padding-bottom:26px;">${escapeHtml(t.weeklyDigestOverview)}</td></tr>
${briefBox}
${paragraphs
    .map(
        (p) =>
            `<tr><td style="font-family:${FONT_TEXT}; font-size:17px; line-height:28px; color:${C.text}; padding-bottom:18px;">${escapeHtml(p)}</td></tr>`
    )
    .join("")}`
    )}</td></tr>`);

    // Trends across the board
    if (trends.length) {
        rows.push(`<tr><td class="pad" style="background-color:${WHITE}; padding:26px 36px 10px;">${T(
            sectionTitle(t.weeklyDigestTrends) +
                trends
                    .map((x, i) => {
                        const last = i === trends.length - 1;
                        return `<tr><td style="padding:24px 0 ${last ? 28 : 24}px; ${last ? "" : `border-bottom:1px solid ${SOFT_RULE};`}">${T(
                            `<tr><td width="44" valign="top" style="width:44px; font-family:${FONT_TEXT}; font-size:30px; line-height:30px; font-weight:bold; letter-spacing:-1px; color:${C.orange};"><a id="t${i + 1}" name="t${i + 1}" style="color:${C.orange}; text-decoration:none;">${i + 1}</a></td><td valign="top">${T(
                                `<tr><td style="font-family:${FONT_TEXT}; font-size:21px; line-height:27px; font-weight:bold; letter-spacing:-0.4px; color:${C.ink}; padding-bottom:8px;">${escapeHtml(x.trend)}</td></tr>
<tr><td style="font-family:${FONT_TEXT}; font-size:16px; line-height:26px; color:${C.text};">${escapeHtml(x.analysis)}</td></tr>`
                            )}</td></tr>`
                        )}</td></tr>`;
                    })
                    .join("")
        )}</td></tr>`);
    }

    // Top stories
    if (stories.length) {
        rows.push(`<tr><td class="pad" style="background-color:${WHITE}; padding:26px 36px 10px;">${T(
            sectionTitle(`${t.weeklyDigestTopStories}  ·  ${stories.length}`) +
                stories
                    .map((s, i) => {
                        const last = i === stories.length - 1;
                        const { hue } = hueFor(s.category);
                        return `<tr><td style="padding:20px 0 20px; ${last ? "" : `border-bottom:1px solid ${SOFT_RULE};`}">${T(
                            `<tr><td width="50" valign="top" style="width:50px; padding-top:2px;">${chip(s.category, 34)}</td><td valign="top">${T(
                                `<tr><td style="font-family:${FONT_LABEL}; font-size:11px; line-height:16px; letter-spacing:1.2px; text-transform:uppercase; color:${hue}; padding-bottom:5px;">${escapeHtml(localizedCategoryTitle(t, s.category))}${s.source ? ` <span style="color:${C.muted};">· ${escapeHtml(s.source)}</span>` : ""}</td></tr>
<tr><td style="font-family:${FONT_TEXT}; font-size:18px; line-height:24px; font-weight:bold; letter-spacing:-0.3px; padding-bottom:6px;"><a href="${safeUrl(s.url)}" style="color:${C.ink}; text-decoration:none;">${escapeHtml(s.title)}</a></td></tr>
<tr><td style="font-family:${FONT_TEXT}; font-size:15px; line-height:24px; color:${C.text};">${escapeHtml(s.summary)}</td></tr>`
                            )}</td></tr>`
                        )}</td></tr>`;
                    })
                    .join("")
        )}</td></tr>`);
    }

    // By category
    if (highlights.length) {
        rows.push(`<tr><td class="pad" style="background-color:${WHITE}; padding:26px 36px 40px;">${T(
            sectionTitle(t.weeklyDigestByCategory, 20) +
                `<tr><td style="height:22px; font-size:0; line-height:0;">&nbsp;</td></tr>` +
                highlights
                    .map((h, i) => {
                        const { hue } = hueFor(h.category);
                        const gap =
                            i === highlights.length - 1
                                ? ""
                                : `<tr><td style="height:14px; font-size:0; line-height:0;">&nbsp;</td></tr>`;
                        return `<tr><td style="padding:22px 22px 20px; border:1px solid ${CARD_RULE}; border-radius:10px;">${T(
                            `<tr><td width="54" valign="top" style="width:54px;">${chip(h.category, 40)}</td><td valign="top">${T(
                                `<tr><td style="font-family:${FONT_LABEL}; font-size:11px; line-height:16px; letter-spacing:1.2px; text-transform:uppercase; color:${hue}; padding-bottom:4px;">${escapeHtml(localizedCategoryTitle(t, h.category))}</td></tr>
${h.headline ? `<tr><td style="font-family:${FONT_TEXT}; font-size:18px; line-height:24px; font-weight:bold; letter-spacing:-0.3px; color:${C.ink}; padding-bottom:10px;">${escapeHtml(h.headline)}</td></tr>` : ""}
${h.summary ? `<tr><td style="font-family:${FONT_TEXT}; font-size:15px; line-height:24px; color:${C.text};">${escapeHtml(h.summary)}</td></tr>` : ""}`
                            )}</td></tr>`
                        )}</td></tr>${gap}`;
                    })
                    .join("")
        )}</td></tr>`);
    }

    // Key numbers (dark), 3 per row
    if (stats.length) {
        const rowsOf3: (typeof stats)[] = [];
        for (let i = 0; i < stats.length; i += 3) rowsOf3.push(stats.slice(i, i + 3));
        const statRows = rowsOf3
            .map(
                (group, gi) =>
                    `<tr><td style="${gi ? "padding-top:26px;" : ""}">${T(
                        `<tr>${group
                            .map(
                                (s, i) =>
                                    `<td class="stack" width="33%" valign="top" style="width:33%; padding-right:${i === group.length - 1 ? 0 : 18}px;">${T(
                                        `<tr><td class="num" style="font-family:${FONT_TEXT}; font-size:42px; line-height:46px; font-weight:bold; letter-spacing:-2px; color:${C.cream}; padding-bottom:8px;">${escapeHtml(s.stat)}</td></tr>
<tr><td style="font-family:${FONT_TEXT}; font-size:14px; line-height:22px; color:${C.darkText};">${escapeHtml(s.context)}</td></tr>
${s.sourceUrl ? `<tr><td style="font-family:${FONT_LABEL}; font-size:12px; line-height:18px; padding-top:6px;"><a href="${safeUrl(s.sourceUrl)}" style="color:${C.orange}; text-decoration:underline;">${escapeHtml(t.sourceLabel)}</a></td></tr>` : ""}`
                                    )}</td>`
                            )
                            .join("")}${group.length < 3 ? `<td width="${(3 - group.length) * 33}%"></td>` : ""}</tr>`
                    )}</td></tr>`
            )
            .join("");
        rows.push(`<tr><td class="pad" style="background-color:${C.ink}; padding:36px 36px 34px;">${T(
            `<tr><td style="${LABEL} color:${C.orange}; padding-bottom:24px;">${escapeHtml(t.weeklyKeyNumbers)}</td></tr>${statRows}`
        )}</td></tr>`);
    }

    // Feedback + read online
    const fb = (r: string) =>
        `${SITE_ORIGIN}/${lang}/feedback?c=weekly&d=${encodeURIComponent(digest.weekStartDate)}&l=${lang}&r=${r}`;
    const pill = (label: string, href: string) =>
        `<a href="${safeUrl(href)}" style="display:inline-block; font-family:${FONT_LABEL}; font-size:13px; line-height:20px; font-weight:bold; color:${C.ink}; text-decoration:none; padding:10px 20px; border:1px solid ${C.ink}; border-radius:999px;">${escapeHtml(label)}</a>`;
    rows.push(`<tr><td class="pad" align="center" style="background-color:${WHITE}; padding:38px 36px 40px;">${T(
        `<tr><td align="center" style="font-family:${FONT_TEXT}; font-size:16px; line-height:24px; font-weight:bold; color:${C.ink}; padding-bottom:14px;">${escapeHtml(t.weeklyFeedbackQuestion)}</td></tr>
<tr><td align="center" style="padding-bottom:34px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right:10px;">${pill(t.feedbackYes, fb("yes"))}</td><td>${pill(t.feedbackNo, fb("no"))}</td></tr></table></td></tr>
<tr><td align="center" style="padding-top:30px; border-top:1px solid ${SOFT_RULE};"><a href="${safeUrl(base)}" style="display:inline-block; font-family:${FONT_TEXT}; font-size:15px; line-height:20px; font-weight:bold; color:#ffffff; text-decoration:none; padding:15px 28px; background-color:${C.orange}; border-radius:8px;">${escapeHtml(t.readOnSite)}</a></td></tr>`
    )}</td></tr>`);

    // Footer (on the cream background, outside the white column)
    rows.push(`<tr><td class="pad" align="center" style="padding:28px 36px 0; font-family:${FONT_LABEL}; font-size:12px; line-height:20px; color:${C.muted};">${escapeHtml(t.receivingBecauseWeeklyDigest)}<br><a href="${safeUrl(`${base}/settings`)}" style="color:${C.muted};">${escapeHtml(t.managePreferences)}</a> &nbsp;·&nbsp; <a href="${safeUrl(`${base}/settings#unsubscribe`)}" style="color:${C.muted};">${escapeHtml(t.unsubscribe)}</a><br><span style="color:${C.darkMuted};">TheNode.tech · Montréal, QC, Canada</span></td></tr>`);

    const preheader = trends.slice(0, 3).map((x) => x.trend).join(" · ") || t.weeklyDigestTitle;
    const pad = "&nbsp;&zwnj;".repeat(40);
    return `<!DOCTYPE html>
<html lang="${lang}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${escapeHtml(`TheNode — ${t.weeklyDigestTitle}: ${range}`)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body { margin:0; padding:0; }
  table { border-collapse:collapse; }
  img { border:0; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { color:${C.orangeDeep}; }
  @media only screen and (max-width:620px) {
    .wrap { width:100% !important; }
    .pad { padding-left:22px !important; padding-right:22px !important; }
    .h1 { font-size:34px !important; line-height:38px !important; }
    .num { font-size:38px !important; line-height:42px !important; }
    .stack { display:block !important; width:100% !important; padding:0 0 22px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:${C.cream};">
<span style="display:none; font-size:1px; color:${C.cream}; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">${escapeHtml(preheader)}${pad}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.cream};">
<tr><td align="center" style="padding:28px 12px 44px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">
${rows.join("\n")}
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}

/** Subject line, e.g. "Week in Review · Oct 17 – Oct 23, 2026". */
export function weeklyDigestSubject(digest: WeeklyDigestData, language: string): string {
    const lang = normalizeEmailLang(language);
    const t = getEmailTranslations(lang);
    return `${t.weeklyDigestTitle} · ${weekLabel(digest.weekStartDate, digest.weekEndDate, lang)}`;
}
