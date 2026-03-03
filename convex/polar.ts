import { Polar } from "@convex-dev/polar";
import { v } from "convex/values";
import { api, components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";

const PRODUCT_KEY_PREMIUM = "premium";
const premiumProductId = process.env.POLAR_PREMIUM_PRODUCT_ID ?? "";

const products = premiumProductId
  ? ({ [PRODUCT_KEY_PREMIUM]: premiumProductId } as Record<string, string>)
  : {};

export const polar: Polar<DataModel, Record<string, string>> = new Polar(
  components.polar,
  {
    getUserInfo: async (ctx): Promise<{ userId: string; email: string }> => {
      const user = await ctx.runQuery(api.queries.users.currentUser);
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
