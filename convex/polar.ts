import { Polar } from "@convex-dev/polar";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import type { ActionCtx } from "./_generated/server";
import { query } from "./_generated/server";

const PRODUCT_KEY_PREMIUM = "premium";
const premiumProductId = process.env.POLAR_PREMIUM_PRODUCT_ID ?? "";

const products = premiumProductId
  ? ({ [PRODUCT_KEY_PREMIUM]: premiumProductId } as Record<string, string>)
  : {};

export const polar: Polar<DataModel, Record<string, string>> = new Polar(
  components.polar,
  {
    // Must not use `currentUser` via runQuery: Polar calls this from actions, and nested
    // queries don't receive the signed-in user's auth, so the portal URL never generates.
    getUserInfo: async (ctx): Promise<{ userId: string; email: string }> => {
      // Polar typings use RunQueryCtx; portal/checkout actions pass ActionCtx with auth.
      const userId = await getAuthUserId(ctx as ActionCtx);
      if (userId === null) return { userId: "", email: "" };
      const user = await ctx.runQuery(internal.queries.users.getById, {
        id: userId,
      });
      if (!user) return { userId: "", email: "" };
      return { userId: user._id, email: user.email ?? "" };
    },
    products,
  }
);

/** Returns the configured premium product ID (from env). Use this when getConfiguredProducts has not synced the product yet. */
export const getPremiumProductId = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: () => process.env.POLAR_PREMIUM_PRODUCT_ID ?? null,
});

export const {
  changeCurrentSubscription,
  cancelCurrentSubscription,
  getConfiguredProducts,
  listAllProducts,
  generateCheckoutLink,
  generateCustomerPortalUrl,
} = polar.api();
