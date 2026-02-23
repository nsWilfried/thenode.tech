import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const create = internalMutation({
  args: {
    userId: v.id("users"),
    polarSubscriptionId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("cancelled"),
      v.literal("expired")
    ),
    planName: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subscriptions", {
      userId: args.userId,
      polarSubscriptionId: args.polarSubscriptionId,
      status: args.status,
      planName: args.planName,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });
  },
});

export const update = internalMutation({
  args: {
    id: v.id("subscriptions"),
    status: v.union(
      v.literal("active"),
      v.literal("cancelled"),
      v.literal("expired")
    ),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: args.updatedAt,
    });
  },
});

