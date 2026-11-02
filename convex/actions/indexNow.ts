"use node";

/**
 * IndexNow: tells Bing, Yandex, Seznam… about new pages within minutes.
 * The key below is public by design; it must match https://thenode.tech/<key>.txt.
 */
import { v } from "convex/values";
import { internalAction } from "../_generated/server";

const KEY = "611bcbd829a7656db54c25ac31c46b9f";
const HOST = "thenode.tech";

export const ping = internalAction({
  args: { urls: v.array(v.string()) },
  returns: v.null(),
  handler: async (_ctx, args) => {
    if (args.urls.length === 0) return null;
    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: HOST,
          key: KEY,
          keyLocation: `https://${HOST}/${KEY}.txt`,
          urlList: args.urls,
        }),
      });
      if (!res.ok && res.status !== 202) console.warn(`[indexNow] ${res.status} for ${args.urls.length} url(s)`);
    } catch (e) {
      console.warn("[indexNow] ping failed:", e);
    }
    return null;
  },
});
