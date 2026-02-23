import { v } from "convex/values";
import { query, internalQuery } from "../_generated/server";

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
