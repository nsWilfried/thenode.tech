import { v } from "convex/values";
import { mutation, internalMutation } from "../_generated/server";

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
    url: v.string(),
    category: categoryValidator,
    isActive: v.boolean(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sources", {
      url: args.url,
      category: args.category,
      isActive: args.isActive,
      name: args.name,
    });
  },
});

export const updateLastFetched = internalMutation({
  args: {
    id: v.id("sources"),
    lastFetched: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { lastFetched: args.lastFetched });
  },
});

