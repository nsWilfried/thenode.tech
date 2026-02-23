import { v } from "convex/values";
import { mutation, internalMutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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

export const updatePreferences = mutation({
  args: {
    language: v.optional(v.string()),
    timezone: v.optional(v.string()),
    categories: v.optional(v.array(categoryValidator)),
    preferredDeliveryHour: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { success: false, message: "Not authenticated" };
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const updates: Record<string, unknown> = {};
    if (args.language) updates.language = args.language;
    if (args.timezone) updates.timezone = args.timezone;

    const existingPrefs = user.preferences ?? {};
    let prefsChanged = false;
    const newPrefs: Record<string, unknown> = { ...existingPrefs };

    if (args.categories) {
      newPrefs.categories = args.categories;
      prefsChanged = true;
    }
    if (args.preferredDeliveryHour !== undefined) {
      if (args.preferredDeliveryHour < 0 || args.preferredDeliveryHour > 23) {
        return { success: false, message: "Hour must be between 0 and 23" };
      }
      newPrefs.preferredDeliveryHour = args.preferredDeliveryHour;
      prefsChanged = true;
    }

    if (prefsChanged) {
      updates.preferences = newPrefs;
    }

    await ctx.db.patch(userId, updates);
    return { success: true };
  },
});

export const completeOnboarding = mutation({
  args: {
    categories: v.array(categoryValidator),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { success: false, message: "Not authenticated" };
    }
    if (args.categories.length === 0) {
      return { success: false, message: "Select at least one category" };
    }
    await ctx.db.patch(userId, {
      onboardingComplete: true,
      preferences: {
        categories: args.categories,
      },
    });
    return { success: true };
  },
});

export const updateLastNewsletterSent = internalMutation({
  args: {
    id: v.id("users"),
    lastNewsletterSent: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      lastNewsletterSent: args.lastNewsletterSent,
    });
  },
});

export const updatePremiumStatus = internalMutation({
  args: {
    id: v.id("users"),
    isPremium: v.boolean(),
    subscriptionStatus: v.union(
      v.literal("active"),
      v.literal("cancelled"),
      v.literal("expired"),
      v.literal("free")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isPremium: args.isPremium,
      subscriptionStatus: args.subscriptionStatus,
    });
  },
});
