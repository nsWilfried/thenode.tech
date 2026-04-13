/**
 * Daily category newsletter HTML (Resend). Table-based, inline styles.
 */

import moment from "moment-timezone";
import {
    siteBaseUrlForEmailLocale,
    type CategorySlug,
    type EmailTemplateStrings,
} from "../emailTranslations";

/** Masthead mark beside the category title (replaces image logo in email). */
export const NEWSLETTER_EMAIL_LOGO_MARK = "⚡";

/**
 * Geist Mono for email: @font-face in head + fallbacks (many clients ignore web fonts).
 * Font files via unpkg mirror of Fontsource.
 */
const GEIST_MONO_FAMILY =
    "'Geist Mono', ui-monospace, 'SFMono-Regular', 'SF Mono', Menlo, Monaco, Consolas, monospace";

const GEIST_MONO_FONT_FACE = `<style type="text/css">
@font-face {
  font-family: 'Geist Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('https://unpkg.com/@fontsource/geist-mono@5.2.5/files/geist-mono-latin-400-normal.woff2') format('woff2');
}
@font-face {
  font-family: 'Geist Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('https://unpkg.com/@fontsource/geist-mono@5.2.5/files/geist-mono-latin-700-normal.woff2') format('woff2');
}
</style>`;

export type NewsletterCategorySlug = CategorySlug;

export interface NewsletterData {
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

type LayoutTokens = {
    fontStack: string;
    headingFontStack: string;
    bodyBg: string;
    cardBg: string;
    cardShadow: string;
    mastheadBg: string;
    mastheadText: string;
    mastheadSubtext: string;
    mastheadAlign: "center" | "left";
    mastheadPadding: string;
    sectionLabelStyle: string;
    bodyTextColor: string;
    metaTextColor: string;
    linkStyle: string;
    diveTitleStyle: string;
    quickLinkStyle: string;
    diveImgMaxWidth: string;
    diveImgBorderRadius: string;
    statsHeaderBorder: string;
    statsRowBorder: string;
    statNumberStyle: string;
    statContextStyle: string;
    underRadarBorderLeft: string;
    underRadarCellPadding: string;
    editorialHeadingStyle: string;
    overviewPadding: string;
    ctaTopBorder: string;
    ctaButtonStyle: string;
    footerBg: string;
    footerTextColor: string;
    footerLinkColor: string;
    contentPadding: string;
};

function layoutTokens(): LayoutTokens {
    const mono = GEIST_MONO_FAMILY;
    return {
        fontStack: mono,
        headingFontStack: mono,
        bodyBg: "#ffffff",
        cardBg: "#ffffff",
        cardShadow: "",
        mastheadBg: "#ffffff",
        mastheadText: "#18181b",
        mastheadSubtext: "#71717a",
        mastheadAlign: "left",
        mastheadPadding: "28px 24px 20px",
        sectionLabelStyle:
            "margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #52525b; letter-spacing: 0.02em; text-transform: none; padding-bottom: 8px; border-bottom: 1px solid #e4e4e7;",
        bodyTextColor: "#27272a",
        metaTextColor: "#52525b",
        linkStyle:
            "color: #18181b; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; font-weight: 600; font-size: 16px; line-height: 1.5;",
        diveTitleStyle:
            "color: #18181b; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; font-weight: 700; font-size: 18px; line-height: 1.45;",
        quickLinkStyle:
            "color: #18181b; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; font-weight: 600; font-size: 16px; line-height: 1.5;",
        diveImgMaxWidth: "100%",
        diveImgBorderRadius: "6px",
        statsHeaderBorder: "border-top: 1px solid #e4e4e7;",
        statsRowBorder: "border-top: 1px solid #e4e4e7;",
        statNumberStyle:
            "margin: 0 0 4px; font-size: 20px; font-weight: 700; color: #18181b;",
        statContextStyle: "margin: 0; font-size: 14px; color: #52525b; line-height: 1.6;",
        underRadarBorderLeft: "2px solid #d4d4d8",
        underRadarCellPadding: "12px 0 20px 14px",
        editorialHeadingStyle:
            "margin: 0 0 12px; font-size: 19px; font-weight: 700; color: #18181b;",
        overviewPadding: "8px 0 20px",
        ctaTopBorder: "1px solid #e4e4e7",
        ctaButtonStyle:
            "display: inline-block; padding: 12px 28px; background: #18181b; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;",
        footerBg: "#ffffff",
        footerTextColor: "#71717a",
        footerLinkColor: "#71717a",
        contentPadding: "28px 24px 32px",
    };
}

function mastheadTitleRow(args: { L: LayoutTokens; headerName: string }): string {
    const { L, headerName } = args;
    const h1Size = "22px";
    const h1Weight = "700";
    const markSize = "24px";
    const tableAttrs = ' role="presentation" width="100%" cellpadding="0" cellspacing="0"';
    const h1 = `<h1 style="margin: 0; font-size: ${h1Size}; font-weight: ${h1Weight}; color: ${L.mastheadText}; font-family: ${L.headingFontStack}; line-height: 1.2;">${headerName}</h1>`;
    return `
              <table${tableAttrs}>
                <tr>
                  <td style="vertical-align: middle; font-size: ${markSize}; line-height: 1; padding-right: 12px; color: ${L.mastheadText}; font-family: ${L.fontStack};">${NEWSLETTER_EMAIL_LOGO_MARK}</td>
                  <td style="vertical-align: middle; text-align: left;">${h1}</td>
                </tr>
              </table>`;
}

function renderCategorySection(
    nl: NewsletterData,
    t: EmailTemplateStrings,
    L: LayoutTokens
): string {
    const overviewHtml = nl.summary
        ? `<tr><td style="padding: ${L.overviewPadding}; color: ${L.bodyTextColor}; font-size: 16px; line-height: 1.75; font-family: ${L.fontStack};">${nl.summary}</td></tr>`
        : "";

    const editorialHtml = (nl.editorialContent || [])
        .map((section) => {
            const imgHtml = section.imageUrl
                ? `<tr><td style="padding: 0 0 8px;">
                        <img src="${section.imageUrl}" alt="${section.imageCaption || section.heading}" style="width: 100%; max-width: ${L.diveImgMaxWidth}; height: auto; border-radius: ${L.diveImgBorderRadius}; display: block;" />
                        ${section.imageCaption ? `<p style="margin: 6px 0 0; font-size: 13px; color: ${L.metaTextColor}; font-style: italic; font-family: ${L.fontStack};">${section.imageCaption}</p>` : ""}
                      </td></tr>`
                : "";
            const bodyParagraphs = section.body
                .split("\n\n")
                .map(
                    (p) =>
                        `<p style="margin: 0 0 16px; color: ${L.bodyTextColor}; font-size: 16px; line-height: 1.75; font-family: ${L.fontStack};">${p}</p>`
                )
                .join("");
            return `
              <tr><td style="padding: 28px 0 8px;">
                <h3 style="${L.editorialHeadingStyle}; font-family: ${L.headingFontStack};">${section.heading}</h3>
              </td></tr>
              ${imgHtml}
              <tr><td>${bodyParagraphs}</td></tr>`;
        })
        .join("");

    const deepDivesHtml =
        (nl.deepDives || []).length > 0
            ? `<tr><td style="padding: 28px 0 8px; ${L.statsHeaderBorder}">
                    <h3 style="${L.sectionLabelStyle}; font-family: ${L.headingFontStack};">${t.featuredStories}</h3>
                  </td></tr>` +
              (nl.deepDives || [])
                  .map((dive) => {
                      const diveImg = dive.imageUrl
                          ? `<tr><td style="padding: 0 0 8px;">
                              <a href="${dive.url}" style="text-decoration: none;">
                                <img src="${dive.imageUrl}" alt="${dive.title}" style="width: 100%; max-width: ${L.diveImgMaxWidth}; height: auto; border-radius: ${L.diveImgBorderRadius}; display: block;" />
                              </a>
                            </td></tr>`
                          : "";
                      return `
                ${diveImg}
                <tr><td style="padding: 8px 0 20px; font-family: ${L.fontStack};">
                  ${dive.source ? `<span style="display: inline-block; font-size: 12px; font-weight: 600; color: ${L.metaTextColor}; margin-bottom: 6px;">${dive.source}</span><br/>` : ""}
                  <a href="${dive.url}" style="${diveTitleStyle(L)}">${dive.title}</a>
                  <p style="margin: 8px 0 0; color: ${L.metaTextColor}; font-size: 15px; line-height: 1.7;">${dive.summary}</p>
                </td></tr>`;
                  })
                  .join("")
            : "";

    const statsHtml =
        (nl.stats || []).length > 0
            ? `<tr><td style="padding: 28px 0 8px; ${L.statsHeaderBorder}">
                    <h3 style="${L.sectionLabelStyle}; font-family: ${L.headingFontStack};">${t.keyNumbers}</h3>
                  </td></tr>
                  <tr><td style="padding: 16px 0; ${L.statsRowBorder}">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family: ${L.fontStack};">
                      <tr>${(nl.stats || [])
                          .map(
                              (s) => `
                        <td width="${Math.floor(100 / Math.min((nl.stats || []).length, 3))}%" style="padding: 0 12px 0 0; vertical-align: top;">
                          <p style="${L.statNumberStyle}">${s.stat}</p>
                          <p style="${L.statContextStyle}">${s.context}</p>
                        </td>`
                          )
                          .slice(0, 3)
                          .join("")}
                      </tr>
                    </table>
                  </td></tr>` +
              ((nl.stats || []).length > 3
                  ? `<tr><td style="padding: 12px 0 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family: ${L.fontStack};">
                            <tr>${(nl.stats || [])
                                .slice(3)
                                .map(
                                    (s) => `
                              <td width="${Math.floor(100 / Math.min((nl.stats || []).slice(3).length, 3))}%" style="padding: 0 12px 0 0; vertical-align: top;">
                                <p style="${L.statNumberStyle}">${s.stat}</p>
                                <p style="${L.statContextStyle}">${s.context}</p>
                              </td>`
                                )
                                .slice(0, 3)
                                .join("")}
                            </tr>
                          </table>
                        </td></tr>`
                  : "")
            : "";

    const underTheRadarHtml = nl.underTheRadar
        ? `<tr><td style="padding: 28px 0 8px; ${L.statsHeaderBorder}">
                    <h3 style="${L.sectionLabelStyle}; font-family: ${L.headingFontStack};">${t.underTheRadar}</h3>
                  </td></tr>
                  <tr><td style="padding: ${L.underRadarCellPadding}; border-left: ${L.underRadarBorderLeft};">
                    ${nl.underTheRadar.source ? `<span style="font-size: 12px; color: ${L.metaTextColor}; margin-bottom: 4px; font-family: ${L.fontStack};">${nl.underTheRadar.source}</span><br/>` : ""}
                    <a href="${nl.underTheRadar.url}" style="${diveTitleStyle(L)}; font-size: 18px;">${nl.underTheRadar.title}</a>
                    <p style="margin: 8px 0 0; color: ${L.metaTextColor}; font-size: 15px; line-height: 1.7; font-family: ${L.fontStack};">${nl.underTheRadar.summary}</p>
                  </td></tr>`
        : "";

    const tryThisHtml =
        nl.tryThis && nl.tryThis.length > 0
            ? `<tr><td style="padding: 28px 0 8px; ${L.statsHeaderBorder}">
                    <h3 style="${L.sectionLabelStyle}; font-family: ${L.headingFontStack};">${t.tryThis}</h3>
                  </td></tr>` +
              nl.tryThis
                  .map(
                      (item) => `
                <tr><td style="padding: 10px 0; font-family: ${L.fontStack};">
                  <a href="${item.url}" style="${L.linkStyle}">${item.name}</a>
                  <p style="margin: 4px 0 0; color: ${L.metaTextColor}; font-size: 14px; line-height: 1.6;">${item.oneLiner}</p>
                </td></tr>`
                  )
                  .join("")
            : "";

    const quoteOfTheDayHtml = nl.quoteOfTheDay
        ? `<tr><td style="padding: 28px 0 8px; ${L.statsHeaderBorder}">
                    <h3 style="${L.sectionLabelStyle}; font-family: ${L.headingFontStack};">${t.quoteOfTheDay}</h3>
                  </td></tr>
                  <tr><td style="padding: 16px 0 20px;">
                    <p style="margin: 0; font-size: 18px; line-height: 1.65; color: ${L.mastheadText}; font-style: italic; font-family: ${L.headingFontStack};">"${nl.quoteOfTheDay.quote}"</p>
                    <p style="margin: 10px 0 0; font-size: 14px; color: ${L.metaTextColor}; font-family: ${L.fontStack};">— ${nl.quoteOfTheDay.attribution}</p>
                  </td></tr>`
        : "";

    const quickLinksHtml =
        nl.articles.length > 0
            ? `<tr><td style="padding: 28px 0 8px; ${L.statsHeaderBorder}">
                    <h3 style="${L.sectionLabelStyle}; font-family: ${L.headingFontStack};">${t.quickLinks}</h3>
                  </td></tr>` +
              nl.articles
                  .map(
                      (a, i) => `
                <tr><td style="padding: 12px 0; ${i < nl.articles.length - 1 ? "border-bottom: 1px solid #f0f0f0;" : ""}; font-family: ${L.fontStack};">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td width="28" style="vertical-align: top; padding-top: 2px;">
                      <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; font-size: 12px; font-weight: 700; color: #a1a1aa;">${i + 1}</span>
                    </td>
                    <td style="padding-left: 8px;">
                      <a href="${a.url}" style="${L.quickLinkStyle}">${a.title}</a>
                      <p style="margin: 4px 0 0; color: ${L.metaTextColor}; font-size: 14px; line-height: 1.6;">${a.summary}</p>
                      ${a.source ? `<span style="font-size: 12px; color: #a1a1aa;">${a.source}</span>` : ""}
                    </td>
                  </tr></table>
                </td></tr>`
                  )
                  .join("")
            : "";

    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 0; font-family: ${L.fontStack};">
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

function diveTitleStyle(L: LayoutTokens): string {
    return `${L.diveTitleStyle}; font-family: ${L.headingFontStack};`;
}

function formatNewsletterLongDate(isoDate: string, language: string): string {
    const d = new Date(`${isoDate}T12:00:00.000Z`);
    try {
        return new Intl.DateTimeFormat(language, {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(d);
    } catch {
        return moment(isoDate).format("MMMM D, YYYY");
    }
}

export function localizedCategoryTitle(
    t: EmailTemplateStrings,
    category: NewsletterCategorySlug
): string {
    return t.categoryShortNames[category] ?? CATEGORY_DISPLAY_NAMES_EN[category] ?? category;
}

export function buildCategoryNewsletterHTML(args: {
    newsletter: NewsletterData;
    date: string;
    t: EmailTemplateStrings;
    isPremium: boolean;
    language: string;
}): string {
    const { newsletter, date, t, isPremium, language } = args;
    const siteBase = siteBaseUrlForEmailLocale(language);
    const todayUtc = moment().utc().format("YYYY-MM-DD");
    const formattedDate =
        date === todayUtc
            ? t.today
            : formatNewsletterLongDate(date, language);

    const L = layoutTokens();
    const headerName = localizedCategoryTitle(t, newsletter.category);
    const titleRow = mastheadTitleRow({ L, headerName });

    const mastheadBottomBorder = "border-bottom: 1px solid #e4e4e7;";
    const cardExtra = L.cardShadow ? L.cardShadow : "";

    const categorySection = renderCategorySection(newsletter, t, L);

    return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  ${GEIST_MONO_FONT_FACE}
</head>
<body style="margin: 0; padding: 0; font-family: ${L.fontStack}; background: ${L.bodyBg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${L.bodyBg};">
    <tr>
      <td align="center" style="padding: 16px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background: ${L.cardBg};${cardExtra ? ` ${cardExtra}` : ""}">
          <tr>
            <td style="text-align: ${L.mastheadAlign}; padding: ${L.mastheadPadding}; background: ${L.mastheadBg}; ${mastheadBottomBorder}">
              ${titleRow}
              <p style="margin: 10px 0 0; color: ${L.mastheadSubtext}; font-size: 15px; line-height: 1.6; font-family: ${L.fontStack};">${formattedDate} · ${t.dailyDoseOfTech}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: ${L.contentPadding};">
              ${categorySection}
            </td>
          </tr>
          <tr>
            <td style="padding: 0 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 24px 0; border-top: ${L.ctaTopBorder};">
                    <a href="${siteBase}" style="${L.ctaButtonStyle}; font-family: ${L.fontStack};">${t.readOnSite}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding: 20px 24px 28px; background: ${L.footerBg}; border-top: ${L.ctaTopBorder};">
              <p style="color: ${L.footerTextColor}; font-size: 12px; margin: 0; line-height: 1.6; font-family: ${L.fontStack};">
                ${t.receivingBecause}<br>
                <a href="{{unsubscribe_url}}" style="color: ${L.footerLinkColor};">${t.unsubscribe}</a> ·
                <a href="https://thenode.tech/settings" style="color: ${L.footerLinkColor};">${t.managePreferences}</a> ·
                ${
                    isPremium
                        ? `<a href="https://thenode.tech/settings#account" style="color: ${L.footerLinkColor};">${t.manageSubscription}</a>`
                        : `<a href="https://thenode.tech/pricing" style="color: ${L.footerLinkColor};">${t.upgradeToPremium}</a>`
                }
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
