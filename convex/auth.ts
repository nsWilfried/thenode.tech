import { convexAuth } from "@convex-dev/auth/server";
import Resend from "@auth/core/providers/resend";
import { internal } from "./_generated/api";
import { buildSignInEmail } from "./email/authEmailHtml";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Resend({
      from: "TheNode <login@thenode.tech>",
      // Branded, localized magic-link email (replaces Auth.js's plain default).
      async sendVerificationRequest({ identifier: to, provider, url }) {
        const apiKey = provider.apiKey ?? process.env.AUTH_RESEND_KEY;
        if (!apiKey) throw new Error("AUTH_RESEND_KEY is not set");
        const { subject, html, text } = buildSignInEmail({ url });
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: provider.from, to, subject, html, text }),
        });
        if (!res.ok) {
          throw new Error("Resend error: " + JSON.stringify(await res.json().catch(() => ({}))));
        }
      },
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
      } else {
        const user = await ctx.db.get(userId);
        if (user && user.emailVerificationTime && !user.welcomeEmailSent) {
          await ctx.db.patch(userId, { welcomeEmailSent: true });
          await ctx.scheduler.runAfter(
            0,
            internal.actions.sendNewsletters.sendWelcomeEmail,
            { userId }
          );
        }
      }
    },
  },
});
