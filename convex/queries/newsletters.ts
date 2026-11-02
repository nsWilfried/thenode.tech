import { v } from "convex/values";
import { query, internalQuery } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

export const getById = internalQuery({
    args: { id: v.id("newsletters") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getByIdPublic = query({
    args: { id: v.id("newsletters") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getLatestByCategory = query({
    args: {
        category: v.string(),
        limit: v.optional(v.number()),
        language: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 6;
        const language = args.language ?? "en";

        return await ctx.db
            .query("newsletters")
            .withIndex("by_category", (q: any) => q.eq("category", args.category))
            .filter((q: any) => q.eq(q.field("language"), language))
            .order("desc")
            .take(limit);
    },
});

export const getLatestAllCategories = query({
    args: {
        limit: v.optional(v.number()),
        language: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 6;
        const language = args.language ?? "en";

        const categories = [
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
        ] as const;

        const results: Record<string, any[]> = {};

        for (const category of categories) {
            const newsletters = await ctx.db
                .query("newsletters")
                .withIndex("by_category", (q: any) => q.eq("category", category))
                .filter((q: any) => q.eq(q.field("language"), language))
                .order("desc")
                .take(limit);

            results[category] = newsletters;
        }

        return results;
    },
});

export const getNewslettersByDateRange = internalQuery({
    args: {
        category: v.string(),
        language: v.string(),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const allForCategory = await ctx.db
            .query("newsletters")
            .withIndex("by_category_and_date", (q: any) =>
                q.eq("category", args.category).gte("date", args.startDate).lte("date", args.endDate)
            )
            .collect();

        const newsletters = allForCategory
            .filter((nl) => nl.language === args.language)
            .map((nl) => ({
                date: nl.date,
                category: nl.category,
                articles: nl.articles,
                summary: nl.summary,
                deepDives: nl.deepDives,
                stats: nl.stats,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return newsletters;
    },
});

export const getLatestByCategoryInternalNoDate = internalQuery({
    args: {
        category: v.string(),
        language: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("newsletters")
            .withIndex("by_language_and_category", (q: any) =>
                q.eq("language", args.language).eq("category", args.category)
            )
            .order("desc")
            .first();
    },
});

export const getLatestByCategoryInternal = internalQuery({
    args: {
        category: v.string(),
        language: v.string(),
        date: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("newsletters")
            .withIndex("by_category_and_date", (q: any) =>
                q.eq("category", args.category).eq("date", args.date)
            )
            .filter((q: any) => q.eq(q.field("language"), args.language))
            .first();
    },
});

export const getLatestEditions = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 10;
        return await ctx.db
            .query("newsletters")
            .withIndex("by_date")
            .order("desc")
            .take(limit);
    },
});

type Channel = Doc<"newsletters">["category"];

// ── Public queries for the website (SEO issue pages, archives, sitemap) ──

/** One issue by channel + day + language (the canonical issue URL). */
export const getByCategoryDate = query({
    args: { category: v.string(), date: v.string(), language: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("newsletters")
            .withIndex("by_category_and_date", (q) => q.eq("category", args.category as Channel).eq("date", args.date))
            .filter((q) => q.eq(q.field("language"), args.language))
            .first();
    },
});

/** Previous (older) and next (newer) issue dates in a channel, same language. */
export const getNeighbors = query({
    args: { category: v.string(), date: v.string(), language: v.string() },
    returns: v.object({ prev: v.union(v.string(), v.null()), next: v.union(v.string(), v.null()) }),
    handler: async (ctx, args) => {
        const prev = await ctx.db
            .query("newsletters")
            .withIndex("by_category_and_date", (q) => q.eq("category", args.category as Channel).lt("date", args.date))
            .filter((q) => q.eq(q.field("language"), args.language))
            .order("desc")
            .first();
        const next = await ctx.db
            .query("newsletters")
            .withIndex("by_category_and_date", (q) => q.eq("category", args.category as Channel).gt("date", args.date))
            .filter((q) => q.eq(q.field("language"), args.language))
            .order("asc")
            .first();
        return { prev: prev?.date ?? null, next: next?.date ?? null };
    },
});

/** Channel archive page: issues strictly older than `before` (keyset pagination), newest first. */
export const listByCategoryBefore = query({
    args: {
        category: v.string(),
        language: v.string(),
        before: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = Math.min(args.limit ?? 30, 60);
        return await ctx.db
            .query("newsletters")
            .withIndex("by_category_and_date", (q) =>
                args.before ? q.eq("category", args.category as Channel).lt("date", args.before) : q.eq("category", args.category as Channel)
            )
            .filter((q) => q.eq(q.field("language"), args.language))
            .order("desc")
            .take(limit);
    },
});

function wordCount(nl: {
    summary?: string;
    editorialContent?: { body: string }[];
    deepDives?: { summary: string }[];
    articles?: { summary: string }[];
}): number {
    const text = [
        nl.summary ?? "",
        ...(nl.editorialContent ?? []).map((s) => s.body),
        ...(nl.deepDives ?? []).map((d) => d.summary),
        ...(nl.articles ?? []).map((a) => a.summary),
    ].join(" ");
    return text.split(/\s+/).filter(Boolean).length;
}

/** Slim, paginated list of every issue in a language (sitemaps, RSS). */
export const listForSitemap = query({
    args: { language: v.string(), cursor: v.union(v.string(), v.null()), numItems: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const page = await ctx.db
            .query("newsletters")
            .withIndex("by_language_and_category", (q) => q.eq("language", args.language))
            .paginate({ cursor: args.cursor, numItems: Math.min(args.numItems ?? 200, 300) });
        return {
            isDone: page.isDone,
            continueCursor: page.continueCursor,
            page: page.page.map((nl) => ({
                category: nl.category,
                date: nl.date,
                createdAt: nl.createdAt,
                words: wordCount(nl),
            })),
        };
    },
});
