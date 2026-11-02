import { v } from "convex/values";
import { internalMutation, mutation } from "../_generated/server";
import { internal } from "../_generated/api";

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
    editorialContent: v.optional(v.array(v.object({
      heading: v.string(),
      body: v.string(),
      imageUrl: v.optional(v.string()),
      imageCaption: v.optional(v.string()),
    }))),
    underTheRadar: v.optional(v.object({
      title: v.string(),
      url: v.string(),
      summary: v.string(),
      source: v.optional(v.string()),
    })),
    tryThis: v.optional(v.array(v.object({
      name: v.string(),
      url: v.string(),
      oneLiner: v.string(),
    }))),
    quoteOfTheDay: v.optional(v.object({
      quote: v.string(),
      attribution: v.string(),
      sourceUrl: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // Languages whose pages are indexed (keep in sync with INDEXED_LOCALES in src/lib/site.ts).
    if (["en", "fr"].includes(args.language)) {
      const base = `https://thenode.tech/${args.language}/category/${args.category}`;
      await ctx.scheduler.runAfter(0, internal.actions.indexNow.ping, {
        urls: [`${base}/${args.date}`, base],
      });
    }
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
      editorialContent: args.editorialContent,
      underTheRadar: args.underTheRadar,
      tryThis: args.tryThis,
      quoteOfTheDay: args.quoteOfTheDay,
    });
  },
});

