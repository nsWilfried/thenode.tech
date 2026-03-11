import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const categoryValidator = v.union(
  v.literal("ai"),
  v.literal("eng"),
  v.literal("sec"),
  v.literal("biz"),
  v.literal("tech"),
  v.literal("cloud-devops"),
  v.literal("web3-crypto"),
  v.literal("design-ux-frontend"),
  v.literal("emerging-tech-science"),
  v.literal("opensource-languages")
);

export default defineSchema({
  ...authTables,

  // Override users table: Convex Auth fields + custom newsletter fields
  users: defineTable({
    // Convex Auth fields
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Newsletter-specific fields
    language: v.optional(v.string()),
    isPremium: v.optional(v.boolean()),
    subscriptionStatus: v.optional(
      v.union(
        v.literal("active"),
        v.literal("cancelled"),
        v.literal("expired"),
        v.literal("free")
      )
    ),
    lastNewsletterSent: v.optional(v.number()),
    preferences: v.optional(
      v.object({
        categories: v.optional(v.array(categoryValidator)),
        preferredDeliveryHour: v.optional(v.number()),
        weeklyDigestEnabled: v.optional(v.boolean()),
        preferredDigestDay: v.optional(v.number()),
      })
    ),
    timezone: v.optional(v.string()),
    onboardingComplete: v.optional(v.boolean()),
    welcomeEmailSent: v.optional(v.boolean()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("by_premium", ["isPremium"])
    .index("by_onboarding_complete", ["onboardingComplete"]),

  // RSS feed sources
  sources: defineTable({
    url: v.string(),
    category: categoryValidator,
    lastFetched: v.optional(v.number()),
    isActive: v.boolean(),
    name: v.optional(v.string()),
    failureCount: v.optional(v.number()),
    lastError: v.optional(v.string()),
  })
    .index("by_category", ["category"])
    .index("by_url", ["url"]),

  // Raw and processed articles
  articles: defineTable({
    title: v.string(),
    url: v.string(),
    rawContent: v.optional(v.string()),
    summary: v.optional(v.string()),
    category: categoryValidator,
    publishedAt: v.number(),
    sourceId: v.id("sources"),
    deduplicationHash: v.string(),
    isSummarized: v.boolean(),
    imageUrl: v.optional(v.string()),
    videoUrls: v.optional(v.array(v.string())),
    links: v.optional(v.array(v.string())),
  })
    .index("by_category", ["category"])
    .index("by_category_and_date", ["category", "publishedAt"])
    .index("by_dedup_hash", ["deduplicationHash"])
    .index("by_published", ["publishedAt"])
    .index("by_is_summarized", ["isSummarized"]),

  // Generated newsletter editions
  newsletters: defineTable({
    date: v.string(),
    category: categoryValidator,
    articles: v.array(
      v.object({
        title: v.string(),
        url: v.string(),
        summary: v.string(),
        source: v.optional(v.string()),
      })
    ),
    summary: v.optional(v.string()),
    language: v.string(),
    createdAt: v.number(),
    deepDives: v.optional(v.array(v.object({
      title: v.string(),
      url: v.string(),
      summary: v.string(),
      imageUrl: v.optional(v.string()),
      source: v.optional(v.string()),
    }))),
    stats: v.optional(v.array(v.object({
      stat: v.string(),
      context: v.string(),
      sourceUrl: v.optional(v.string()),
    }))),
    mediaItems: v.optional(v.array(v.object({
      type: v.union(v.literal("image"), v.literal("video")),
      url: v.string(),
      caption: v.optional(v.string()),
      articleUrl: v.optional(v.string()),
    }))),
    editorialContent: v.optional(v.array(v.object({
      heading: v.string(),
      body: v.string(),
      imageUrl: v.optional(v.string()),
      imageCaption: v.optional(v.string()),
    }))),
  })
    .index("by_category", ["category"])
    .index("by_category_and_date", ["category", "date"])
    .index("by_date", ["date"])
    .index("by_language_and_category", ["language", "category"]),

  // Polar subscription sync
  subscriptions: defineTable({
    userId: v.id("users"),
    polarSubscriptionId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("cancelled"),
      v.literal("expired")
    ),
    planName: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_polar_id", ["polarSubscriptionId"]),
});
