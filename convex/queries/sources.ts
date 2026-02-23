import { v } from "convex/values";
import { query, internalQuery } from "../_generated/server";

export const getByUrl = internalQuery({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sources")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();
  },
});

export const getAllByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sources")
      .withIndex("by_category", (q) =>
        q.eq(
          "category",
          args.category as
            | "ai"
            | "eng"
            | "sec"
            | "biz"
            | "tech"
            | "cloud-devops"
            | "web3-crypto"
            | "design-ux-frontend"
            | "emerging-tech-science"
            | "opensource-languages"
        )
      )
      .collect();
  },
});

