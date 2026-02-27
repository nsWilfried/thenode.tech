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
    weekStartDate: v.string(),
    weekEndDate: v.string(),
    categories: v.array(categoryValidator),
    language: v.string(),
    createdAt: v.number(),
    overview: v.string(),
    topStories: v.array(
      v.object({
        title: v.string(),
        url: v.string(),
        summary: v.string(),
        category: categoryValidator,
        source: v.optional(v.string()),
      })
    ),
    trendAnalysis: v.array(
      v.object({
        trend: v.string(),
        analysis: v.string(),
        relatedCategories: v.array(categoryValidator),
      })
    ),
    weeklyStats: v.optional(
      v.array(
        v.object({
          stat: v.string(),
          context: v.string(),
          sourceUrl: v.optional(v.string()),
        })
      )
    ),
    categoryHighlights: v.array(
      v.object({
        category: categoryValidator,
        headline: v.string(),
        summary: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    return await (ctx.db as any).insert("weeklyDigests", {
      weekStartDate: args.weekStartDate,
      weekEndDate: args.weekEndDate,
      categories: args.categories,
      language: args.language,
      createdAt: args.createdAt,
      overview: args.overview,
      topStories: args.topStories,
      trendAnalysis: args.trendAnalysis,
      weeklyStats: args.weeklyStats,
      categoryHighlights: args.categoryHighlights,
    });
  },
});
