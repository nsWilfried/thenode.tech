"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

// Handle Polar webhook events
export const handleWebhookEvent = internalAction({
  args: {
    event: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const { event, data } = args;

    console.log(`Processing Polar webhook: ${event}`);

    switch (event) {
      case "subscription.created":
      case "subscription.updated": {
        const email = data.customer?.email;
        const polarSubscriptionId = data.id;
        const status = data.status === "active" ? "active" : "cancelled";

        if (!email) {
          console.error("No email in subscription event");
          return;
        }

        // Find the user
        const user = await ctx.runQuery(
          internal.queries.users.getByEmailInternal,
          { email }
        );

        if (!user) {
          console.error(`User not found for email: ${email}`);
          return;
        }

        // Update premium status
        const isPremium = status === "active";
        await ctx.runMutation(internal.mutations.users.updatePremiumStatus, {
          id: user._id,
          isPremium,
          subscriptionStatus: isPremium ? "active" : "cancelled",
        });

        // Create/update subscription record
        const existingSub = await ctx.runQuery(
          internal.queries.subscriptions.getByPolarId,
          { polarSubscriptionId }
        );

        if (existingSub) {
          await ctx.runMutation(
            internal.mutations.subscriptions.update,
            {
              id: existingSub._id,
              status: isPremium ? ("active" as const) : ("cancelled" as const),
              updatedAt: Date.now(),
            }
          );
        } else {
          await ctx.runMutation(
            internal.mutations.subscriptions.create,
            {
              userId: user._id,
              polarSubscriptionId,
              status: isPremium ? ("active" as const) : ("cancelled" as const),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }
          );
        }

        if (isPremium) {
          await ctx.runAction(
            internal.actions.sendNewsletters.sendPremiumUpgradeEmail,
            { userId: user._id }
          );
        }

        console.log(`Updated subscription for ${email}: premium=${isPremium}`);
        break;
      }

      case "subscription.cancelled": {
        const email = data.customer?.email;

        if (!email) return;

        const user = await ctx.runQuery(
          internal.queries.users.getByEmailInternal,
          { email }
        );

        if (!user) return;

        await ctx.runMutation(internal.mutations.users.updatePremiumStatus, {
          id: user._id,
          isPremium: false,
          subscriptionStatus: "cancelled",
        });

        await ctx.runAction(
          internal.actions.sendNewsletters.sendPremiumCancellationEmail,
          { userId: user._id }
        );

        console.log(`Cancelled subscription for ${email}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }
  },
});

