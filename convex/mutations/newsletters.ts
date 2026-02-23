import { v } from "convex/values";
import { internalMutation, mutation } from "../_generated/server";

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
    date: v.string(),
    category: categoryValidator,
    articles: v.array(
      v.object({
        title: v.string(),
        url: v.string(),
        summary: v.string(),
        source: v.optional(v.string()),
      })
    ),
    summary: v.optional(v.string()),
    language: v.string(),
    createdAt: v.number(),
    deepDives: v.optional(v.array(v.object({
      title: v.string(),
      url: v.string(),
      summary: v.string(),
      imageUrl: v.optional(v.string()),
      source: v.optional(v.string()),
    }))),
    stats: v.optional(v.array(v.object({
      stat: v.string(),
      context: v.string(),
      sourceUrl: v.optional(v.string()),
    }))),
    mediaItems: v.optional(v.array(v.object({
      type: v.union(v.literal("image"), v.literal("video")),
      url: v.string(),
      caption: v.optional(v.string()),
      articleUrl: v.optional(v.string()),
    }))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("newsletters", {
      date: args.date,
      category: args.category,
      articles: args.articles,
      summary: args.summary,
      language: args.language,
      createdAt: args.createdAt,
      deepDives: args.deepDives,
      stats: args.stats,
      mediaItems: args.mediaItems,
    });
  },
});

