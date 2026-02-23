import { convexAuth } from "@convex-dev/auth/server";
import Resend from "@auth/core/providers/resend";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Resend],
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
      }
    },
  },
});
