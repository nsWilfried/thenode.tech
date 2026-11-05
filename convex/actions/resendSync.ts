"use node";

/**
 * Mirrors each user's TheNode preferences into Resend (Yasori account):
 *   - one Resend contact per user (email), `unsubscribed` = global unsubscribe
 *   - one Resend topic per channel + "Weekly digest" + "Product news"
 * Convex is the source of truth; Resend topics let us target broadcasts per channel
 * and keep Resend's preference page accurate. Topics are found by name and created on demand.
 */
import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import type { Doc, Id } from "../_generated/dataModel";

const API = "https://api.resend.com";
const PREFIX = "TheNode · ";

/** Channel slug → Resend topic name. Keep names stable: they are the lookup key. */
export const CHANNEL_TOPICS: Record<string, string> = {
  ai: "AI & Machine Learning",
  eng: "Software Engineering",
  sec: "Cybersecurity",
  biz: "Startups & Business",
  tech: "Big Tech",
  "cloud-devops": "Cloud & DevOps",
  "web3-crypto": "Web3 & Crypto",
  "design-ux-frontend": "Design & Frontend",
  "emerging-tech-science": "Emerging Tech & Science",
  "opensource-languages": "Open Source & Languages",
};
const DIGEST_TOPIC = "Weekly digest";
const PRODUCT_TOPIC = "Product news";

const TOPIC_DESCRIPTIONS: Record<string, string> = {
  [DIGEST_TOPIC]: "Week-in-review across your channels.",
  [PRODUCT_TOPIC]: "Occasional news about TheNode itself.",
};

type Sub = "opt_in" | "opt_out";

function apiKey(): string {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return key;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Resend allows ~2 requests/second per key: space calls and retry once on 429. */
async function resend<T = any>(method: string, path: string, body?: unknown): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: { authorization: `Bearer ${apiKey()}`, "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.status === 429) {
      await sleep(1200 * (attempt + 1));
      continue;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`Resend ${method} ${path} → ${res.status}: ${JSON.stringify(data)}`);
    await sleep(550);
    return data as T;
  }
  throw new Error(`Resend ${method} ${path} → rate limited`);
}

/** All TheNode topic ids by short name, creating missing topics. */
async function ensureTopics(): Promise<Record<string, string>> {
  const wanted = [...Object.values(CHANNEL_TOPICS), DIGEST_TOPIC, PRODUCT_TOPIC];
  const list = await resend<{ data?: { id: string; name: string }[] }>("GET", "/topics");
  const byName = new Map((list.data ?? []).map((t) => [t.name, t.id]));
  const out: Record<string, string> = {};
  for (const short of wanted) {
    const name = PREFIX + short;
    let id = byName.get(name);
    if (!id) {
      const created = await resend<{ id: string }>("POST", "/topics", {
        name,
        default_subscription: short === PRODUCT_TOPIC ? "opt_in" : "opt_out",
        description: TOPIC_DESCRIPTIONS[short] ?? `Daily ${short} newsletter from TheNode.`,
      });
      id = created.id;
    }
    out[short] = id;
  }
  return out;
}

function subscriptionsFor(user: Doc<"users">, topics: Record<string, string>) {
  const chosen = new Set(user.preferences?.categories ?? []);
  const subs: { id: string; subscription: Sub }[] = Object.entries(CHANNEL_TOPICS).map(([slug, short]) => ({
    id: topics[short],
    subscription: chosen.has(slug as never) ? "opt_in" : "opt_out",
  }));
  const digest = user.preferences?.weeklyDigestEnabled === true;
  subs.push({ id: topics[DIGEST_TOPIC], subscription: digest ? "opt_in" : "opt_out" });
  subs.push({ id: topics[PRODUCT_TOPIC], subscription: "opt_in" });
  return subs;
}

async function syncOne(user: Doc<"users">, topics: Record<string, string>): Promise<"synced" | "skipped"> {
  if (!user.email || user.emailVerificationTime === undefined) return "skipped";
  const email = user.email;
  const unsubscribed = user.preferences?.unsubscribed === true;
  // POST creates or updates (it succeeds for an existing contact).
  try {
    await resend("POST", "/contacts", { email, unsubscribed });
  } catch (e) {
    // Older API versions reject duplicates: fall back to an update by email.
    if (!String(e).includes("409") && !String(e).toLowerCase().includes("already")) throw e;
    await resend("PATCH", `/contacts/${encodeURIComponent(email)}`, { unsubscribed });
  }
  await resend("PATCH", `/contacts/${encodeURIComponent(email)}/topics`, subscriptionsFor(user, topics));
  return "synced";
}

/** Sync one user. Scheduled after onboarding, settings changes, unsubscribe and plan changes. */
export const syncUser = internalAction({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (!process.env.RESEND_API_KEY) return null;
    const user = await ctx.runQuery(internal.queries.users.getById, { id: args.userId });
    if (!user) return null;
    try {
      const topics = await ensureTopics();
      await syncOne(user, topics);
    } catch (e) {
      // Never break the user's action because Resend is down; the next change re-syncs.
      console.error(`[resendSync] user ${args.userId}:`, e);
    }
    return null;
  },
});

const BATCH = 150;

/** One-time / repair backfill: syncs every onboarded user, in batches that reschedule themselves. */
export const syncAll = internalAction({
  args: { cursor: v.optional(v.union(v.string(), v.null())), synced: v.optional(v.number()) },
  returns: v.null(),
  handler: async (ctx, args) => {
    const page: { page: Doc<"users">[]; isDone: boolean; continueCursor: string } = await ctx.runQuery(
      internal.queries.users.listPage,
      { cursor: args.cursor ?? null, numItems: BATCH }
    );
    const topics = await ensureTopics();
    let synced = args.synced ?? 0;
    for (const user of page.page) {
      if (!user.onboardingComplete) continue;
      try {
        if ((await syncOne(user, topics)) === "synced") synced++;
      } catch (e) {
        console.error(`[resendSync] backfill ${user._id as Id<"users">}:`, e);
      }
    }
    if (page.isDone) {
      console.log(`[resendSync] backfill done: ${synced} contacts synced`);
    } else {
      await ctx.scheduler.runAfter(0, internal.actions.resendSync.syncAll, {
        cursor: page.continueCursor,
        synced,
      });
    }
    return null;
  },
});
