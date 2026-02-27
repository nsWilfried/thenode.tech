import { v } from "convex/values";
import { query, internalQuery } from "../_generated/server";

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

export const getByWeekAndLanguage = internalQuery({
  args: {
    weekStartDate: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    return await (ctx.db as any)
      .query("weeklyDigests")
      .withIndex("by_week_and_language", (q: any) =>
        q.eq("weekStartDate", args.weekStartDate).eq("language", args.language)
      )
      .collect();
  },
});

export const getLatestForUser = query({
  args: {
    categories: v.array(categoryValidator),
    language: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    const language = args.language ?? "en";

    const digests: any[] = await (ctx.db as any)
      .query("weeklyDigests")
      .withIndex("by_language", (q: any) => q.eq("language", language))
      .order("desc")
      .take(50);

    const sortedCategories = [...args.categories].sort();
    const matching = digests.filter((d: any) => {
      const digestCats = [...d.categories].sort();
      return (
        digestCats.length === sortedCategories.length &&
        digestCats.every((c: string, i: number) => c === sortedCategories[i])
      );
    });

    return matching.slice(0, limit);
  },
});
