import { convexAuth } from "@convex-dev/auth/server";
import Resend from "@auth/core/providers/resend";
import { internal } from "./_generated/api";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Resend({
      from: "TheNode.tech <login@thenode.tech>",
    }),
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { userId, existingUserId }) {
      if (existingUserId === null) {
        await ctx.db.patch(userId, {
          language: "en",
          isPremium: false,
          subscriptionStatus: "free",
          onboardingComplete: false,
          preferences: {
            categories: [],
          },
        });

        await ctx.scheduler.runAfter(
          0,
          internal.actions.sendNewsletters.sendWelcomeEmail,
          { userId }
        );
      }
    },
  },
});
