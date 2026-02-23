"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type CategorySlug =
  | "ai"
  | "eng"
  | "sec"
  | "biz"
  | "tech"
  | "cloud-devops"
  | "web3-crypto"
  | "design-ux-frontend"
  | "emerging-tech-science"
  | "opensource-languages";

const CATEGORY_NAMES: Record<CategorySlug, string> = {
  ai: "Artificial Intelligence & Machine Learning",
  eng: "Software Engineering & Web Dev",
  sec: "Cybersecurity & InfoSec",
  biz: "Startups & Venture Capital",
  tech: "Big Tech & General Innovation",
  "cloud-devops": "Cloud Computing & DevOps",
  "web3-crypto": "Web3 & Cryptocurrency",
  "design-ux-frontend": "Design, UX & Frontend",
  "emerging-tech-science": "Emerging Tech & Science",
  "opensource-languages": "Open Source & Programming Languages",
};

export const summarizeCategory = internalAction({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const category = args.category as CategorySlug;
    const categoryName = CATEGORY_NAMES[category];

    const articles = await ctx.runQuery(
      internal.queries.articles.getUnsummarizedByCategory,
      { category }
    );

    if (articles.length === 0) {
      console.log(`[${category}] No new articles to summarize`);
      return;
    }

    const batch = articles.slice(0, 30);

    const articleList = batch
      .map((a, i) => {
        const parts = [`${i + 1}. Title: ${a.title}`, `   URL: ${a.url}`];
        if (a.imageUrl) parts.push(`   Image: ${a.imageUrl}`);
        if (a.videoUrls && a.videoUrls.length > 0)
          parts.push(`   Videos: ${a.videoUrls.join(", ")}`);
        if (a.links && a.links.length > 0)
          parts.push(`   Referenced links: ${a.links.slice(0, 5).join(", ")}`);
        parts.push(`   Content: ${(a.rawContent || "").substring(0, 1500)}`);
        return parts.join("\n");
      })
      .join("\n\n");

    const imageMap: Record<string, string> = {};
    for (const a of batch) {
      if (a.imageUrl) imageMap[a.url] = a.imageUrl;
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are the lead editor of TheNode.tech, a modern tech news digest. Write like a knowledgeable human journalist — conversational, insightful, and occasionally witty. Never sound robotic or templated.

You MUST respond with valid JSON in exactly this format:
{
  "overview": "A 3-5 sentence editorial paragraph that reads like a real human editor wrote it. Weave the day's biggest themes together into a compelling narrative. Don't just list stories — tell the reader why today's news matters and what trends are emerging.",
  "deepDives": [
    {
      "title": "Compelling headline for the story",
      "url": "original article URL",
      "summary": "A rich 3-4 sentence analysis. Go beyond what happened — explain why it matters, who's affected, and what might happen next. Reference specific details from the article content.",
      "imageUrl": "image URL if one was provided for this article, or null",
      "source": "Source name"
    }
  ],
  "stats": [
    {
      "stat": "The notable figure (e.g. $4.2B, 300%, 10M users)",
      "context": "One sentence explaining what this number means and why it matters",
      "sourceUrl": "URL of the article this stat came from"
    }
  ],
  "articles": [
    {
      "title": "Catchy concise title",
      "url": "original article URL",
      "summary": "1-2 sentence quick summary — scannable and informative",
      "source": "Source name"
    }
  ]
}

Rules:
- "deepDives": Pick the 2-3 MOST significant stories. These get detailed, analytical summaries.
- "stats": Extract 3-5 notable statistics, funding amounts, user numbers, or percentages mentioned across ALL articles. Only include real numbers from the content — never make them up.
- "articles": All remaining stories (5-7) get quick 1-2 sentence summaries for the Quick Links section.
- If multiple articles cover the same story, combine them and credit all sources.
- For imageUrl in deepDives, use the image URL provided with that article. If none was provided, set it to null.
- Write naturally — vary sentence structure, use active voice, and avoid clichés like "game-changer" or "revolutionize".`,
          },
          {
            role: "user",
            content: `Here are ${batch.length} articles from the ${categoryName} domain. Analyze them and produce the multi-section newsletter output.

Articles:
${articleList}`,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        console.error(`[${category}] No response from OpenAI`);
        return;
      }

      const parsed = JSON.parse(content) as {
        overview?: string;
        deepDives?: {
          title: string;
          url: string;
          summary: string;
          imageUrl?: string | null;
          source?: string;
        }[];
        stats?: {
          stat: string;
          context: string;
          sourceUrl?: string;
        }[];
        articles: {
          title: string;
          url: string;
          summary: string;
          source?: string;
        }[];
      };

      const deepDives = (parsed.deepDives || []).map((d) => ({
        title: d.title,
        url: d.url,
        summary: d.summary,
        imageUrl: d.imageUrl || imageMap[d.url] || undefined,
        source: d.source,
      }));

      const mediaItems: {
        type: "image" | "video";
        url: string;
        caption?: string;
        articleUrl?: string;
      }[] = [];

      for (const a of batch) {
        if (a.imageUrl && !mediaItems.some((m) => m.url === a.imageUrl)) {
          mediaItems.push({
            type: "image" as const,
            url: a.imageUrl,
            caption: a.title,
            articleUrl: a.url,
          });
        }
        if (a.videoUrls) {
          for (const vUrl of a.videoUrls) {
            if (!mediaItems.some((m) => m.url === vUrl)) {
              mediaItems.push({
                type: "video" as const,
                url: vUrl,
                caption: a.title,
                articleUrl: a.url,
              });
            }
          }
        }
      }

      const today = new Date().toISOString().split("T")[0];
      await ctx.runMutation(internal.mutations.newsletters.create, {
        date: today,
        category,
        articles: parsed.articles.map((a) => ({
          title: a.title,
          url: a.url,
          summary: a.summary,
          source: a.source,
        })),
        summary: parsed.overview,
        language: "en",
        createdAt: Date.now(),
        deepDives: deepDives.length > 0 ? deepDives : undefined,
        stats: parsed.stats && parsed.stats.length > 0 ? parsed.stats : undefined,
        mediaItems: mediaItems.length > 0 ? mediaItems.slice(0, 10) : undefined,
      });

      await ctx.runMutation(internal.mutations.articles.markSummarized, {
        ids: articles.map((a) => a._id),
      });

      console.log(
        `[${category}] Created newsletter: ${deepDives.length} deep dives, ${parsed.stats?.length || 0} stats, ${parsed.articles.length} quick links, ${mediaItems.length} media items`
      );
    } catch (error) {
      console.error(`[${category}] Summarization failed:`, error);
    }
  },
});

// Translate a newsletter for premium users
export const translateNewsletter = internalAction({
  args: {
    newsletterId: v.id("newsletters"),
    targetLanguage: v.string(),
  },
  handler: async (ctx, args) => {
    const newsletter = await ctx.runQuery(
      internal.queries.newsletters.getById,
      { id: args.newsletterId }
    );

    if (!newsletter) {
      console.error("Newsletter not found:", args.newsletterId);
      return;
    }

    // Don't translate if already in the target language
    if (newsletter.language === args.targetLanguage) return;

    const articlesText = newsletter.articles
      .map(
        (a: { title: string; summary: string }, i: number) =>
          `${i + 1}. Title: ${a.title}\n   Summary: ${a.summary}`
      )
      .join("\n\n");

    const deepDivesText = (newsletter.deepDives || [])
      .map(
        (d: { title: string; summary: string }, i: number) =>
          `${i + 1}. Title: ${d.title}\n   Summary: ${d.summary}`
      )
      .join("\n\n");

    const statsText = (newsletter.stats || [])
      .map(
        (s: { stat: string; context: string }, i: number) =>
          `${i + 1}. Stat: ${s.stat}\n   Context: ${s.context}`
      )
      .join("\n\n");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a professional translator for TheNode.tech newsletter. Translate the following newsletter content into ${args.targetLanguage}. 
            
IMPORTANT: Preserve technical slang, product names, and company names in their original form. Only translate the descriptive text.

Respond with valid JSON in this format:
{
  "articles": [{ "title": "Translated title", "summary": "Translated summary" }],
  "deepDives": [{ "title": "Translated title", "summary": "Translated summary" }],
  "stats": [{ "stat": "Translated stat", "context": "Translated context" }],
  "overview": "Translated overview"
}`,
          },
          {
            role: "user",
            content: `Overview: ${newsletter.summary || ""}\n\nDeep Dives:\n${deepDivesText}\n\nStats:\n${statsText}\n\nQuick Links:\n${articlesText}`,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return;

      const translated = JSON.parse(content) as {
        articles: { title: string; summary: string }[];
        deepDives?: { title: string; summary: string }[];
        stats?: { stat: string; context: string }[];
        overview?: string;
      };

      const translatedDeepDives = newsletter.deepDives
        ? newsletter.deepDives.map((d: { title: string; url: string; summary: string; imageUrl?: string; source?: string }, i: number) => ({
            title: translated.deepDives?.[i]?.title || d.title,
            url: d.url,
            summary: translated.deepDives?.[i]?.summary || d.summary,
            imageUrl: d.imageUrl,
            source: d.source,
          }))
        : undefined;

      const translatedStats = newsletter.stats
        ? newsletter.stats.map((s: { stat: string; context: string; sourceUrl?: string }, i: number) => ({
            stat: translated.stats?.[i]?.stat || s.stat,
            context: translated.stats?.[i]?.context || s.context,
            sourceUrl: s.sourceUrl,
          }))
        : undefined;

      await ctx.runMutation(internal.mutations.newsletters.create, {
        date: newsletter.date,
        category: newsletter.category,
        articles: newsletter.articles.map((a: { title: string; url: string; summary: string; source?: string }, i: number) => ({
          title: translated.articles[i]?.title || a.title,
          url: a.url,
          summary: translated.articles[i]?.summary || a.summary,
          source: a.source,
        })),
        summary: translated.overview || newsletter.summary,
        language: args.targetLanguage,
        createdAt: Date.now(),
        deepDives: translatedDeepDives,
        stats: translatedStats,
        mediaItems: newsletter.mediaItems,
      });

      console.log(
        `Translated newsletter ${args.newsletterId} to ${args.targetLanguage}`
      );
    } catch (error) {
      console.error("Translation failed:", error);
    }
  },
});

// Summarize all categories
export const summarizeAllCategories = internalAction({
  args: {},
  handler: async (ctx) => {
    const categories: CategorySlug[] = [
      "ai",
      "eng",
      "sec",
      "biz",
      "tech",
      "cloud-devops",
      "web3-crypto",
      "design-ux-frontend",
      "emerging-tech-science",
      "opensource-languages",
    ];

    for (const category of categories) {
      try {
        await ctx.runAction(
          internal.actions.summarizeArticles.summarizeCategory,
          { category }
        );
      } catch (error) {
        console.error(`Failed to summarize ${category}:`, error);
      }
    }

    console.log("All categories summarized");
  },
});

