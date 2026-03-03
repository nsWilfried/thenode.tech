import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { polar } from "./polar";
import { internal } from "./_generated/api";

const http = httpRouter();
auth.addHttpRoutes(http);

const POLAR_WEBHOOK_PATH = "/polar/events";

type SubscriptionPayload = {
  customer?: { email?: string };
  status?: string;
  cancelAtPeriodEnd?: boolean;
};

function isActiveSubscriptionStatus(status: string | undefined): boolean {
  return status === "active" || status === "trialing";
}

async function syncUserPremiumFromSubscription(
  ctx: { runMutation: (ref: unknown, args: unknown) => Promise<unknown> } | unknown,
  data: SubscriptionPayload
): Promise<void> {
  const runCtx = ctx as { runMutation: (ref: unknown, args: unknown) => Promise<unknown> };
  const email = data.customer?.email;
  if (!email) return;

  const isPremium =
    isActiveSubscriptionStatus(data.status) && !data.cancelAtPeriodEnd;

  await runCtx.runMutation(internal.mutations.users.syncPremiumStatusByEmail, {
    email,
    isPremium,
    subscriptionStatus: isPremium ? "active" : "cancelled",
  });
}

polar.registerRoutes(http as any, {
  path: POLAR_WEBHOOK_PATH,
  events: {
    "subscription.created": (ctx, event) =>
      syncUserPremiumFromSubscription(ctx, event.data as SubscriptionPayload),
    "subscription.updated": (ctx, event) =>
      syncUserPremiumFromSubscription(ctx, event.data as SubscriptionPayload),
  },
});

export default http;
