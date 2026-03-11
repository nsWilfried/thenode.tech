import { v } from "convex/values";
import { query, internalQuery } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db.get(userId);
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("email", (q: any) => q.eq("email", args.email))
      .first();
  },
});

export const getByEmailInternal = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("email", (q: any) => q.eq("email", args.email))
      .first();
  },
});

export const getAllVerified = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_onboarding_complete", (q: any) =>
        q.eq("onboardingComplete", true)
      )
      .collect();

    return users.filter(
      (u: any) => u.email !== undefined && u.emailVerificationTime !== undefined
    );
  },
});

export const getById = internalQuery({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getPremiumUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_premium", (q: any) => q.eq("isPremium", true))
      .collect();
  },
});

export const getPremiumLanguages = internalQuery({
  args: {},
  handler: async (ctx) => {
    const premiumUsers = await ctx.db
      .query("users")
      .withIndex("by_premium", (q: any) => q.eq("isPremium", true))
      .collect();

    const languages = new Set<string>();
    for (const user of premiumUsers) {
      const lang = user.language;
      if (lang && lang !== "en") {
        languages.add(lang);
      }
    }
    return [...languages];
  },
});
