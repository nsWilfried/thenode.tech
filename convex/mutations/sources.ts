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
  returns: v.id("sources"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("sources", {
      url: args.url,
      category: args.category,
      isActive: args.isActive,
      name: args.name,
      failureCount: 0,
    });
  },
});

export const updateLastFetched = internalMutation({
  args: {
    id: v.id("sources"),
    lastFetched: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { lastFetched: args.lastFetched });
    return null;
  },
});

const FAILURE_THRESHOLD = 3;

export const recordFeedFailure = internalMutation({
  args: {
    id: v.id("sources"),
    httpStatus: v.number(),
    errorMessage: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const source = await ctx.db.get(args.id);
    if (!source) return null;

    const newCount = (source.failureCount ?? 0) + 1;
    const shouldDeactivate =
      args.httpStatus === 404 || args.httpStatus === 410 || newCount >= FAILURE_THRESHOLD;

    await ctx.db.patch(args.id, {
      failureCount: newCount,
      lastError: `HTTP ${args.httpStatus}: ${args.errorMessage}`,
      ...(shouldDeactivate ? { isActive: false } : {}),
    });

    if (shouldDeactivate) {
      console.log(
        `Deactivated source ${source.url} (status=${args.httpStatus}, failures=${newCount})`
      );
    }

    return null;
  },
});

export const resetFailureCount = internalMutation({
  args: {
    id: v.id("sources"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      failureCount: 0,
      lastError: undefined,
    });
    return null;
  },
});

export const deactivateSource = internalMutation({
  args: {
    id: v.id("sources"),
    reason: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isActive: false,
      lastError: args.reason,
    });
    return null;
  },
});

