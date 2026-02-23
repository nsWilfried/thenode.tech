import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

const categoryValidator = v.union(
  v.literal("ai"),
  v.literal("eng"),
  v.literal("sec"),
  v.literal("biz"),
  v.literal("tech"),
  v.literal("cloud-devops"),
  v.literal("web3-crypto"),
  v.literal("design-ux-frontend"),
  v.literal("emerging-tech-science"),
  v.literal("opensource-languages")
);

export const create = internalMutation({
  args: {
    title: v.string(),
    url: v.string(),
    rawContent: v.optional(v.string()),
    category: categoryValidator,
    publishedAt: v.number(),
    sourceId: v.id("sources"),
    deduplicationHash: v.string(),
    isSummarized: v.boolean(),
    imageUrl: v.optional(v.string()),
    videoUrls: v.optional(v.array(v.string())),
    links: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("articles", {
      title: args.title,
      url: args.url,
      rawContent: args.rawContent,
      category: args.category,
      publishedAt: args.publishedAt,
      sourceId: args.sourceId,
      deduplicationHash: args.deduplicationHash,
      isSummarized: args.isSummarized,
      imageUrl: args.imageUrl,
      videoUrls: args.videoUrls,
      links: args.links,
    });
  },
});

export const markSummarized = internalMutation({
  args: {
    ids: v.array(v.id("articles")),
  },
  handler: async (ctx, args) => {
    for (const id of args.ids) {
      await ctx.db.patch(id, { isSummarized: true });
    }
  },
});

export const cleanupOldArticles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const oldArticles = await ctx.db
      .query("articles")
      .withIndex("by_published")
      .filter((q) => q.lt(q.field("publishedAt"), thirtyDaysAgo))
      .collect();

    let deleted = 0;
    for (const article of oldArticles) {
      await ctx.db.delete(article._id);
      deleted++;
    }

    if (deleted > 0) {
      console.log(`Cleaned up ${deleted} articles older than 30 days`);
    }
  },
});

