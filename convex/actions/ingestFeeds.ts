"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
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
    links: string[];
    httpStatus?: number;
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
    const empty: ScrapedContent = { text: "", links: [] };
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
            return { ...empty, httpStatus: response.status };
        }

        const html = await response.text();
        const $ = cheerio.load(html);

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

        const articleLinks: string[] = [];
        const contentSelectors = [
            "article", '[role="main"]', ".post-content", ".article-content",
            ".entry-content", ".post-body", ".article-body", ".story-body",
            "main", ".content",
        ];
        let contentEl: cheerio.Cheerio<AnyNode> = $("body");
        for (const selector of contentSelectors) {
            const el = $(selector);
            if (el.length > 0) {
                contentEl = el.first() as cheerio.Cheerio<AnyNode>;
                break;
            }
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
            links: articleLinks.slice(0, 15),
            httpStatus: 200,
        };
    } catch (error) {
        console.warn(`Failed to scrape ${url}:`, error);
        return empty;
    }
}

interface FeedArticle {
    title: string;
    url: string;
    rssSnippet: string;
    publishedAt: number;
}

interface FeedResult {
    articles: FeedArticle[];
    error?: { status: number; message: string };
}

async function fetchFeed(feedUrl: string): Promise<FeedResult> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(feedUrl, {
            headers: { "User-Agent": "TheNode.tech Newsletter Bot/1.0" },
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
            return {
                articles: [],
                error: {
                    status: response.status,
                    message: `HTTP ${response.status} ${response.statusText}`,
                },
            };
        }

        const xml = await response.text();
        const feed = await parser.parseString(xml);
        const now = Date.now();
        const fortyEightHoursAgo = now - 48 * 60 * 60 * 1000;

        const articles = (feed.items || [])
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

        return { articles };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            articles: [],
            error: { status: -1, message },
        };
    }
}

export const ingestCategoryFeeds = internalAction({
    args: {
        category: v.optional(v.string()),
        feedUrls: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const { CATEGORIES, CATEGORY_SLUGS } = await import(
            "../../lib/constants/categories"
        );

        if (!args.category || args.category.trim() === "") {
            console.log("No category specified — ingesting all categories.");
            let totalIngested = 0;
            for (const slug of CATEGORY_SLUGS) {
                try {
                    const result = await ctx.runAction(
                        internal.actions.ingestFeeds.ingestCategoryFeeds,
                        { category: slug }
                    );
                    totalIngested += result.totalIngested;
                } catch (error) {
                    console.error(`Failed to ingest feeds for ${slug}:`, error);
                }
            }
            console.log("Feed ingestion complete (all categories). Total new articles:", totalIngested);
            return { category: "all", totalIngested };
        }

        let feedUrls = args.feedUrls;
        if (!feedUrls || feedUrls.length === 0) {
            const categoryConfig = CATEGORIES[args.category as CategorySlug];
            if (!categoryConfig) {
                console.error(
                    `Unknown category "${args.category}". Valid slugs: ai, eng, sec, biz, tech, cloud-devops, web3-crypto, design-ux-frontend, emerging-tech-science, opensource-languages`
                );
                return { category: args.category, totalIngested: 0 };
            }
            feedUrls = [...categoryConfig.feeds];
            console.log(
                `[${args.category}] Loaded ${feedUrls.length} feeds from config (no feedUrls provided)`
            );
        }
        const category = args.category;
        let totalIngested = 0;
        let skippedInactive = 0;
        let feedErrors = 0;

        for (const feedUrl of feedUrls) {
            const isActive: boolean = await ctx.runQuery(
                internal.queries.sources.isSourceActive,
                { url: feedUrl }
            );
            if (!isActive) {
                skippedInactive++;
                continue;
            }

            const feedResult = await fetchFeed(feedUrl);

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

            if (feedResult.error) {
                feedErrors++;
                await ctx.runMutation(
                    internal.mutations.sources.recordFeedFailure,
                    {
                        id: sourceId,
                        httpStatus: feedResult.error.status,
                        errorMessage: feedResult.error.message,
                    }
                );
                continue;
            }

            if (source) {
                await ctx.runMutation(
                    internal.mutations.sources.resetFailureCount,
                    { id: sourceId }
                );
            }

            for (const article of feedResult.articles) {
                const deduplicationHash = generateDeduplicationHash(
                    article.title,
                    article.url
                );

                const existing = await ctx.runQuery(
                    internal.queries.articles.getByDeduplicationHash,
                    { hash: deduplicationHash }
                );

                if (existing) continue;

                const scraped = await scrapeArticleContent(article.url);

                if (scraped.httpStatus === 404 || scraped.httpStatus === 410) {
                    console.warn(`Skipping article (HTTP ${scraped.httpStatus}): ${article.url}`);
                    continue;
                }

                let fullContent = scraped.text;
                if (!fullContent || fullContent.length < 50) {
                    fullContent = article.rssSnippet;
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
                    links: scraped.links.length > 0 ? scraped.links : undefined,
                });

                totalIngested++;
            }

            await ctx.runMutation(internal.mutations.sources.updateLastFetched, {
                id: sourceId,
                lastFetched: Date.now(),
            });
        }

        console.log(
            `[${category}] Ingested ${totalIngested} new articles from ${feedUrls.length} feeds ` +
            `(${skippedInactive} inactive skipped, ${feedErrors} feed errors)`
        );
        return { category, totalIngested };
    },
});

export const ingestAllFeeds = internalAction({
    args: {},
    handler: async (ctx) => {
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
