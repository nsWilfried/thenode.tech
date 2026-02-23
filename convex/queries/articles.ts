import { v } from "convex/values";
import { query, internalQuery } from "../_generated/server";

export const getByDeduplicationHash = internalQuery({
  args: { hash: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_dedup_hash", (q) => q.eq("deduplicationHash", args.hash))
      .first();
  },
});

export const getUnsummarizedByCategory = internalQuery({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_category", (q) =>
        q.eq(
          "category",
          args.category as
            | "ai"
            | "eng"
            | "sec"
            | "biz"
            | "tech"
            | "cloud-devops"
            | "web3-crypto"
            | "design-ux-frontend"
            | "emerging-tech-science"
            | "opensource-languages"
        )
      )
      .filter((q) => q.eq(q.field("isSummarized"), false))
      .collect();
  },
});

export const getRecentByCategory = query({
  args: { category: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("articles")
      .withIndex("by_category_and_date", (q) =>
        q.eq(
          "category",
          args.category as
            | "ai"
            | "eng"
            | "sec"
            | "biz"
            | "tech"
            | "cloud-devops"
            | "web3-crypto"
            | "design-ux-frontend"
            | "emerging-tech-science"
            | "opensource-languages"
        )
      )
      .order("desc")
      .take(limit);
  },
});

