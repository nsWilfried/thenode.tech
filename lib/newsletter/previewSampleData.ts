import type { NewsletterData } from "../../convex/email/categoryNewsletterHtml";

/** Rich sample used only by `/[locale]/newsletter-preview` — not sent as email. */
export function getSampleNewsletter(): NewsletterData {
    return {
        category: "cloud-devops",
        summary:
            "Sample overview: a short snapshot of themes in cloud, infra, and platform engineering this period.",
        editorialContent: [
            {
                heading: "Editorial — why this matters for your stack",
                body:
                    "First paragraph of editorial copy with enough line length to see wrapping.\n\nSecond paragraph after a blank line.",
                imageUrl: "https://picsum.photos/id/180/800/450",
                imageCaption: "Illustrative caption under the editorial image",
            },
        ],
        deepDives: [
            {
                title: "Featured story headline that can run two lines in the inbox client",
                url: "https://thenode.tech",
                summary: "Summary below the title — enough text to test line breaks and spacing.",
                imageUrl: "https://picsum.photos/id/201/800/450",
                source: "Example outlet",
            },
        ],
        stats: [
            {
                stat: "42%",
                context: "Illustrative YoY change shown in the Key numbers row",
                sourceUrl: "https://thenode.tech",
            },
            { stat: "$1.2B", context: "Sample funding headline (placeholder)", sourceUrl: undefined },
            { stat: "3×", context: "Typical ops improvement (placeholder)", sourceUrl: undefined },
        ],
        underTheRadar: {
            title: "Under the radar — a pick you might have missed",
            url: "https://thenode.tech",
            summary: "One or two lines of teaser for the radar item.",
            source: "Blog",
        },
        tryThis: [
            {
                name: "Try this tool (sample)",
                url: "https://thenode.tech",
                oneLiner: "Short one-liner explaining why it is interesting.",
            },
        ],
        quoteOfTheDay: {
            quote:
                "A quote that fits a typical inbox width without overflowing the layout on most clients.",
            attribution: "Sample Author",
            sourceUrl: "https://thenode.tech",
        },
        articles: [
            {
                title: "Quick link — first article title",
                url: "https://thenode.tech",
                summary: "Blurb for the first numbered quick link.",
                source: "Site A",
            },
            {
                title: "Quick link — second item with a longer headline for testing",
                url: "https://thenode.tech",
                summary: "Blurb for the second quick link without a source line.",
            },
        ],
    };
}
