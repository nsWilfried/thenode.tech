/**
 * Magic-link sign-in email (Convex Auth → Resend), in the TheNode email design.
 * No Node-only imports: runs in the default Convex runtime (convex/auth.ts).
 */
import { getEmailTranslations } from "../emailTranslations";
import {
    C,
    FONT_LABEL,
    FONT_TEXT,
    SITE_ORIGIN,
    emailDocument,
    emailFooterRow,
    emailHeaderRows,
    escapeHtml,
    normalizeEmailLang,
    safeUrl,
} from "./categoryNewsletterHtml";

/** The site sends redirectTo "/<lang>/signin", so the link path carries the visitor's language. */
export function languageFromSignInUrl(url: string): string {
    try {
        const first = new URL(url).pathname.split("/").filter(Boolean)[0] ?? "en";
        return normalizeEmailLang(first);
    } catch {
        return "en";
    }
}

/** Big orange bulletproof button. */
function bigButton(label: string, href: string): string {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${C.orange}" style="background-color:${C.orange}; border-radius:8px;"><a href="${safeUrl(href)}" style="display:block; padding:16px 30px; font-family:${FONT_TEXT}; font-size:16px; line-height:20px; font-weight:bold; color:#ffffff; text-decoration:none;">${escapeHtml(label)}</a></td></tr></table>`;
}

export function buildSignInEmail(args: { url: string; language?: string }): {
    subject: string;
    html: string;
    text: string;
} {
    const lang = normalizeEmailLang(args.language ?? languageFromSignInUrl(args.url));
    const t = getEmailTranslations(lang);
    const url = args.url;

    const body = `<tr><td class="pad" style="background-color:${C.paper}; padding:42px 36px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td class="h1" style="font-family:${FONT_TEXT}; font-size:32px; line-height:38px; font-weight:bold; letter-spacing:-1px; color:${C.ink}; padding-bottom:16px;">${escapeHtml(t.authTitle)}</td></tr>
<tr><td style="font-family:${FONT_TEXT}; font-size:17px; line-height:27px; color:${C.text}; padding-bottom:28px;">${escapeHtml(t.authBody)}</td></tr>
<tr><td style="padding-bottom:30px;">${bigButton(t.authButton, url)}</td></tr>
<tr><td style="font-family:${FONT_LABEL}; font-size:12px; line-height:18px; color:${C.muted}; padding-bottom:6px;">${escapeHtml(t.authFallback)}</td></tr>
<tr><td style="font-family:${FONT_TEXT}; font-size:13px; line-height:20px; word-break:break-all; padding-bottom:28px;"><a href="${safeUrl(url)}" style="color:${C.orangeDeep}; text-decoration:underline;">${escapeHtml(url)}</a></td></tr>
<tr><td style="border-top:1px solid ${C.rule}; padding-top:20px; font-family:${FONT_TEXT}; font-size:14px; line-height:22px; color:${C.muted};">${escapeHtml(t.authIgnore)}</td></tr>
</table></td></tr>`;

    const html = emailDocument({
        lang,
        title: t.authSubject,
        preheader: t.authPreheader,
        rows:
            emailHeaderRows(t.authHeaderLabel) +
            body +
            emailFooterRow({
                blurb: t.authBlurb,
                links: [{ label: "thenode.tech", href: `${SITE_ORIGIN}/${lang}` }],
            }),
    });

    const text = [
        t.authTitle,
        "",
        t.authBody,
        "",
        url,
        "",
        t.authIgnore,
        "",
        "— TheNode.tech",
    ].join("\n");

    return { subject: t.authSubject, html, text };
}
