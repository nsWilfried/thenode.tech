import { v } from "convex/values";
import { mutation, internalMutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const HOUR_MIN = 0;
const HOUR_MAX = 23;
const DIGEST_DAY_MIN = 0;
const DIGEST_DAY_MAX = 6;

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
    weeklyDigestEnabled: v.optional(v.boolean()),
    preferredDigestDay: v.optional(v.number()),
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

    const isPremium = user.isPremium ?? false;
    const updates: Record<string, unknown> = {};
    if (args.language) updates.language = args.language;
    // Only premium users can set timezone via settings
    if (args.timezone && isPremium) updates.timezone = args.timezone;

    const existingPrefs = user.preferences ?? {};
    let prefsChanged = false;
    const newPrefs: Record<string, unknown> = { ...existingPrefs };

    if (args.categories) {
      newPrefs.categories = args.categories;
      prefsChanged = true;
    }
    if (args.preferredDeliveryHour !== undefined && isPremium) {
      if (args.preferredDeliveryHour < HOUR_MIN || args.preferredDeliveryHour > HOUR_MAX) {
        return { success: false, message: "Hour must be between 0 and 23" };
      }
      newPrefs.preferredDeliveryHour = args.preferredDeliveryHour;
      prefsChanged = true;
    }
    if (args.weeklyDigestEnabled !== undefined) {
      newPrefs.weeklyDigestEnabled = args.weeklyDigestEnabled;
      prefsChanged = true;
    }
    if (args.preferredDigestDay !== undefined) {
      if (args.preferredDigestDay < DIGEST_DAY_MIN || args.preferredDigestDay > DIGEST_DAY_MAX) {
        return { success: false, message: "Day must be between 0 (Sunday) and 6 (Saturday)" };
      }
      newPrefs.preferredDigestDay = args.preferredDigestDay;
      prefsChanged = true;
    }

    if (prefsChanged) {
      updates.preferences = newPrefs;
    }

    await ctx.db.patch(userId, updates);
    return { success: true };
  },
});

function isValidTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

const reportTimezoneSuccess = { success: true as const };
function reportTimezoneError(message: string) {
  return { success: false as const, message };
}

/**
 * Report browser-detected timezone (login/app load).
 * Free: always update. Premium: only when timezone not yet set.
 */
export const reportTimezone = mutation({
  args: { timezone: v.string() },
  returns: v.union(
    v.object({ success: v.literal(true) }),
    v.object({ success: v.literal(false), message: v.string() })
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return reportTimezoneError("Not authenticated");
    if (!isValidTimezone(args.timezone)) return reportTimezoneError("Invalid timezone");

    const user = await ctx.db.get(userId);
    if (!user) return reportTimezoneError("User not found");

    const isPremium = user.isPremium ?? false;
    if (isPremium && user.timezone) return reportTimezoneSuccess;

    await ctx.db.patch(userId, { timezone: args.timezone });
    return reportTimezoneSuccess;
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

export const updateLastWeeklyDigestSent = internalMutation({
  args: {
    id: v.id("users"),
    lastWeeklyDigestSent: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      lastWeeklyDigestSent: args.lastWeeklyDigestSent,
    } as any);
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
