"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { createHash } from "crypto";

const parser = new Parser({
    timeout: 10000,
    headers: {
        "User-Agent": "TheNode.tech Newsletter Bot/1.0",
    },
});

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

function generateDeduplicationHash(title: string, url: string): string {
    return createHash("sha256")
        .update(`${title}::${url}`)
        .digest("hex");
}

interface ScrapedContent {
    text: string;
    imageUrl?: string;
    videoUrls: string[];
    links: string[];
}

function isAbsoluteUrl(href: string): boolean {
    return /^https?:\/\//i.test(href);
}

function resolveUrl(href: string, base: string): string | null {
    try {
        if (isAbsoluteUrl(href)) return href;
        return new URL(href, base).href;
    } catch {
        return null;
    }
}

async function scrapeArticleContent(url: string): Promise<ScrapedContent> {
    const empty: ScrapedContent = { text: "", videoUrls: [], links: [] };
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(url, {
            headers: {
                "User-Agent": "TheNode.tech Newsletter Bot/1.0",
                Accept: "text/html,application/xhtml+xml",
            },
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
            console.warn(`HTTP ${response.status} fetching ${url}`);
            return empty;
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // --- Extract featured image ---
        let imageUrl: string | undefined;
        const ogImage = $('meta[property="og:image"]').attr("content");
        if (ogImage) {
            imageUrl = resolveUrl(ogImage, url) ?? undefined;
        }
        if (!imageUrl) {
            const twitterImage = $('meta[name="twitter:image"]').attr("content");
            if (twitterImage) {
                imageUrl = resolveUrl(twitterImage, url) ?? undefined;
            }
        }
        if (!imageUrl) {
            $("article img, main img, .post-content img, .entry-content img").each((_i, el) => {
                if (imageUrl) return;
                const src = $(el).attr("src");
                const width = parseInt($(el).attr("width") || "0", 10);
                if (src && (width >= 300 || width === 0)) {
                    imageUrl = resolveUrl(src, url) ?? undefined;
                }
            });
        }

        // --- Extract video URLs ---
        const videoUrls: string[] = [];
        const ogVideo = $('meta[property="og:video"]').attr("content") ||
            $('meta[property="og:video:url"]').attr("content");
        if (ogVideo) {
            const resolved = resolveUrl(ogVideo, url);
            if (resolved) videoUrls.push(resolved);
        }
        $("iframe").each((_i, el) => {
            const src = $(el).attr("src") || "";
            if (/youtube\.com|youtu\.be|vimeo\.com|player\.vimeo/i.test(src)) {
                const resolved = resolveUrl(src, url);
                if (resolved && !videoUrls.includes(resolved)) videoUrls.push(resolved);
            }
        });
        $("video source, video").each((_i, el) => {
            const src = $(el).attr("src");
            if (src) {
                const resolved = resolveUrl(src, url);
                if (resolved && !videoUrls.includes(resolved)) videoUrls.push(resolved);
            }
        });

        // --- Extract article body links ---
        const articleLinks: string[] = [];
        const contentSelectors = [
            "article", '[role="main"]', ".post-content", ".article-content",
            ".entry-content", ".post-body", ".article-body", ".story-body",
            "main", ".content",
        ];
        let contentEl = $("body");
        for (const selector of contentSelectors) {
            const el = $(selector);
            if (el.length > 0) { contentEl = el.first(); break; }
        }
        contentEl.find("a[href]").each((_i, el) => {
            const href = $(el).attr("href");
            if (!href) return;
            const resolved = resolveUrl(href, url);
            if (resolved && isAbsoluteUrl(resolved)) {
                try {
                    const linkHost = new URL(resolved).hostname;
                    const pageHost = new URL(url).hostname;
                    if (linkHost !== pageHost && !articleLinks.includes(resolved)) {
                        articleLinks.push(resolved);
                    }
                } catch { /* skip malformed */ }
            }
        });

        // --- Remove non-content elements and extract text ---
        $(
            "script, style, nav, footer, header, iframe, noscript, " +
            "aside, .ad, .ads, .advertisement, .sidebar, .nav, .footer, " +
            ".header, .menu, .cookie-banner, .popup, .modal, " +
            '[role="navigation"], [role="banner"], [role="complementary"]'
        ).remove();

        let content = "";
        for (const selector of contentSelectors) {
            const el = $(selector);
            if (el.length > 0) {
                content = el.first().text();
                break;
            }
        }
        if (!content) {
            content = $("body").text();
        }

        content = content
            .replace(/\s+/g, " ")
            .replace(/\n\s*\n/g, "\n")
            .trim();

        return {
            text: content.substring(0, 5000),
            imageUrl,
            videoUrls: videoUrls.slice(0, 5),
            links: articleLinks.slice(0, 15),
        };
    } catch (error) {
        console.warn(`Failed to scrape ${url}:`, error);
        return empty;
    }
}

// Fetch a single RSS feed and return parsed articles
async function fetchFeed(
    feedUrl: string
): Promise<
    { title: string; url: string; rssSnippet: string; publishedAt: number }[]
> {
    try {
        const feed = await parser.parseURL(feedUrl);
        const now = Date.now();
        const fortyEightHoursAgo = now - 48 * 60 * 60 * 1000;

        return (feed.items || [])
            .filter((item) => {
                if (!item.title || !item.link) return false;
                const pubDate = item.pubDate ? new Date(item.pubDate).getTime() : now;
                return pubDate >= fortyEightHoursAgo;
            })
            .map((item) => ({
                title: item.title || "Untitled",
                url: item.link || "",
                rssSnippet:
                    item.contentSnippet || item.content || item.summary || "",
                publishedAt: item.pubDate
                    ? new Date(item.pubDate).getTime()
                    : now,
            }));
    } catch (error) {
        console.error(`Failed to fetch feed ${feedUrl}:`, error);
        return [];
    }
}

// Internal action to ingest feeds for a specific category
export const ingestCategoryFeeds = internalAction({
    args: {
        category: v.string(),
        feedUrls: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const { category, feedUrls } = args;
        let totalIngested = 0;

        for (const feedUrl of feedUrls) {
            const articles = await fetchFeed(feedUrl);

            for (const article of articles) {
                const deduplicationHash = generateDeduplicationHash(
                    article.title,
                    article.url
                );

                // Check if already exists
                const existing = await ctx.runQuery(
                    internal.queries.articles.getByDeduplicationHash,
                    { hash: deduplicationHash }
                );

                if (existing) continue;

                const scraped = await scrapeArticleContent(article.url);

                let fullContent = scraped.text;
                if (!fullContent || fullContent.length < 50) {
                    fullContent = article.rssSnippet;
                }

                const source = await ctx.runQuery(
                    internal.queries.sources.getByUrl,
                    { url: feedUrl }
                );

                let sourceId;
                if (source) {
                    sourceId = source._id;
                } else {
                    sourceId = await ctx.runMutation(
                        internal.mutations.sources.create,
                        {
                            url: feedUrl,
                            category: category as CategorySlug,
                            isActive: true,
                        }
                    );
                }

                await ctx.runMutation(internal.mutations.articles.create, {
                    title: article.title,
                    url: article.url,
                    rawContent: fullContent.substring(0, 5000),
                    category: category as CategorySlug,
                    publishedAt: article.publishedAt,
                    sourceId,
                    deduplicationHash,
                    isSummarized: false,
                    imageUrl: scraped.imageUrl,
                    videoUrls: scraped.videoUrls.length > 0 ? scraped.videoUrls : undefined,
                    links: scraped.links.length > 0 ? scraped.links : undefined,
                });

                totalIngested++;
            }

            // Update source lastFetched
            const source = await ctx.runQuery(internal.queries.sources.getByUrl, {
                url: feedUrl,
            });
            if (source) {
                await ctx.runMutation(internal.mutations.sources.updateLastFetched, {
                    id: source._id,
                    lastFetched: Date.now(),
                });
            }
        }

        console.log(
            `[${category}] Ingested ${totalIngested} new articles from ${feedUrls.length} feeds`
        );
        return { category, totalIngested };
    },
});

// Main ingestion action that kicks off all category ingestions
export const ingestAllFeeds = internalAction({
    args: {},
    handler: async (ctx) => {
        // Import categories dynamically since this runs in Node
        const { CATEGORIES, CATEGORY_SLUGS } = await import(
            "../../lib/constants/categories"
        );

        const results: { category: string; totalIngested: number }[] = [];
        for (const slug of CATEGORY_SLUGS) {
            const category = CATEGORIES[slug];
            try {
                const result = await ctx.runAction(
                    internal.actions.ingestFeeds.ingestCategoryFeeds,
                    {
                        category: slug,
                        feedUrls: [...category.feeds],
                    }
                );
                results.push(result);
            } catch (error) {
                console.error(`Failed to ingest feeds for ${slug}:`, error);
            }
        }

        console.log("Feed ingestion complete:", results);
    },
});
