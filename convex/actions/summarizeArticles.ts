"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import OpenAI from "openai";
import moment from "moment-timezone";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SUMMARIZE_SYSTEM_PROMPT = `You are the lead editor of TheNode.tech, a modern tech news digest. Write like a sharp friend explaining the news over coffee — casual-smart, punchy, and scannable. Never sound like a documentary narrator or a formal report. Use short sentences. Keep paragraphs to 2-3 sentences max.

You MUST respond with valid JSON in exactly this format:
{
  "overview": "2-3 short sentences. Weave the day's biggest themes into a quick take. Tell the reader why today matters — no long-winded narrative.",
  "editorialContent": [
    {
      "heading": "A compelling section heading that captures the theme",
      "body": "2-3 short paragraphs separated by \\n\\n. Each paragraph = 2-3 sentences max. Quick takes, not essays. Connect the dots without dense prose.",
      "imageUrl": "Image URL from one of the articles in this section, or null",
      "imageCaption": "Short caption for the image, or null"
    }
  ],
  "deepDives": [
    {
      "title": "Compelling headline",
      "url": "original article URL",
      "summary": "2-3 sentences. What happened, why it matters. No fluff.",
      "imageUrl": "image URL for this article, or null",
      "source": "Source name"
    }
  ],
  "stats": [
    {
      "stat": "Notable figure (e.g. $4.2B, 300%)",
      "context": "One sentence — what this number means",
      "sourceUrl": "URL of the article"
    }
  ],
  "articles": [
    {
      "title": "Catchy concise title",
      "url": "original article URL",
      "summary": "1-2 sentence quick summary",
      "source": "Source name"
    }
  ],
  "underTheRadar": {
    "title": "Headline for one overlooked-but-interesting story",
    "url": "original article URL from input",
    "summary": "1-2 sentences. Why this is a hidden gem.",
    "source": "Source name or null"
  },
  "tryThis": [
    {
      "name": "Tool/library/product name",
      "url": "URL from the articles where this is mentioned",
      "oneLiner": "One sentence: what it is and why try it"
    }
  ],
  "quoteOfTheDay": {
    "quote": "Exact quote from one of the articles — something sharp, memorable, or provocative said by a founder, analyst, or developer",
    "attribution": "Who said it (e.g. Name, Title at Company)",
    "sourceUrl": "URL of the article containing this quote, or null"
  }
}

Rules:
- "editorialContent": 3-5 thematic sections. Short paragraphs (2-3 sentences). Quick takes, not essays. Use images from source articles when available.
- "deepDives": 2-3 most significant stories. Summaries in 2-3 sentences.
- "stats": 3-5 real numbers from the content. Never make them up.
- "articles": 5-7 remaining stories with 1-2 sentence summaries.
- "underTheRadar": Pick ONE article that is genuinely interesting but did not make deep dives — smaller launches, niche discussions, sleeper picks. Must use a real URL from the input. If nothing fits, set to null.
- "tryThis": 1-3 tools, libraries, APIs, betas, or open-source projects mentioned in the articles that readers can actually try today. Each: name, URL from input, one-liner. If none, use empty array [].
- "quoteOfTheDay": One notable quote from the articles — must be a real quote from the content. If no good quote, set to null.
- For imageUrl in deepDives and editorialContent, use the image URL from the relevant article or null.
- Write in short punchy sentences. No dense multi-clause constructions. Avoid clichés like "game-changer" or "revolutionize."`;

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
            content: SUMMARIZE_SYSTEM_PROMPT,
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
        editorialContent?: {
          heading: string;
          body: string;
          imageUrl?: string | null;
          imageCaption?: string | null;
        }[];
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
        underTheRadar?: {
          title: string;
          url: string;
          summary: string;
          source?: string;
        } | null;
        tryThis?: Array<{ name: string; url: string; oneLiner: string }>;
        quoteOfTheDay?: {
          quote: string;
          attribution: string;
          sourceUrl?: string;
        } | null;
      };

      const deepDives = (parsed.deepDives || []).map((d) => ({
        title: d.title,
        url: d.url,
        summary: d.summary,
        imageUrl: d.imageUrl || imageMap[d.url] || undefined,
        source: d.source,
      }));

      const mediaItems: {
        type: "image";
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
      }

      const editorialContent = (parsed.editorialContent || []).map((section) => ({
        heading: section.heading,
        body: section.body,
        imageUrl: section.imageUrl || undefined,
        imageCaption: section.imageCaption || undefined,
      }));

      const today = moment.utc().format("YYYY-MM-DD");
      const underTheRadar =
        parsed.underTheRadar &&
        parsed.underTheRadar.url &&
        parsed.underTheRadar.title
          ? {
              title: parsed.underTheRadar.title,
              url: parsed.underTheRadar.url,
              summary: parsed.underTheRadar.summary || "",
              source: parsed.underTheRadar.source,
            }
          : undefined;
      const tryThis =
        parsed.tryThis && Array.isArray(parsed.tryThis) && parsed.tryThis.length > 0
          ? parsed.tryThis.map((t) => ({
              name: t.name,
              url: t.url,
              oneLiner: t.oneLiner,
            }))
          : undefined;
      const quoteOfTheDay =
        parsed.quoteOfTheDay &&
        parsed.quoteOfTheDay.quote &&
        parsed.quoteOfTheDay.attribution
          ? {
              quote: parsed.quoteOfTheDay.quote,
              attribution: parsed.quoteOfTheDay.attribution,
              sourceUrl: parsed.quoteOfTheDay.sourceUrl,
            }
          : undefined;

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
        editorialContent: editorialContent.length > 0 ? editorialContent : undefined,
        underTheRadar,
        tryThis,
        quoteOfTheDay,
      });

      await ctx.runMutation(internal.mutations.articles.markSummarized, {
        ids: articles.map((a) => a._id),
      });

      console.log(
        `[${category}] Created newsletter: ${editorialContent.length} editorial sections, ${deepDives.length} deep dives, ${parsed.stats?.length || 0} stats, ${parsed.articles.length} quick links, ${mediaItems.length} media items`
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
  "editorialContent": [{ "heading": "Translated heading", "body": "Translated body", "imageCaption": "Translated caption or null" }],
  "overview": "Translated overview",
  "underTheRadar": { "title": "Translated title", "summary": "Translated summary" } or null if absent,
  "tryThis": [{ "name": "Translated name", "oneLiner": "Translated oneLiner" }],
  "quoteOfTheDay": { "quote": "Translated quote", "attribution": "Translated attribution" } or null if absent
}`,
          },
          {
            role: "user",
            content: `Overview: ${newsletter.summary || ""}\n\nEditorial Content:\n${(newsletter.editorialContent || []).map((s: { heading: string; body: string; imageCaption?: string }, i: number) => `${i + 1}. Heading: ${s.heading}\n   Body: ${s.body}${s.imageCaption ? `\n   Caption: ${s.imageCaption}` : ""}`).join("\n\n")}\n\nDeep Dives:\n${deepDivesText}\n\nStats:\n${statsText}\n\nQuick Links:\n${articlesText}${(newsletter as any).underTheRadar ? `\n\nUnder the Radar:\nTitle: ${(newsletter as any).underTheRadar.title}\nSummary: ${(newsletter as any).underTheRadar.summary}` : ""}${(newsletter as any).tryThis?.length ? `\n\nTry This:\n${(newsletter as any).tryThis.map((t: { name: string; oneLiner: string }, i: number) => `${i + 1}. Name: ${t.name}\n   OneLiner: ${t.oneLiner}`).join("\n")}` : ""}${(newsletter as any).quoteOfTheDay ? `\n\nQuote of the Day:\nQuote: ${(newsletter as any).quoteOfTheDay.quote}\nAttribution: ${(newsletter as any).quoteOfTheDay.attribution}` : ""}`,
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
        editorialContent?: { heading: string; body: string; imageCaption?: string | null }[];
        overview?: string;
        underTheRadar?: { title: string; summary: string } | null;
        tryThis?: { name: string; oneLiner: string }[];
        quoteOfTheDay?: { quote: string; attribution: string } | null;
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

      const translatedEditorial = newsletter.editorialContent
        ? newsletter.editorialContent.map((s: { heading: string; body: string; imageUrl?: string; imageCaption?: string }, i: number) => ({
            heading: translated.editorialContent?.[i]?.heading || s.heading,
            body: translated.editorialContent?.[i]?.body || s.body,
            imageUrl: s.imageUrl,
            imageCaption: translated.editorialContent?.[i]?.imageCaption || s.imageCaption,
          }))
        : undefined;

      const origUnder = (newsletter as { underTheRadar?: { title: string; url: string; summary: string; source?: string } }).underTheRadar;
      const translatedUnderTheRadar =
        origUnder && translated.underTheRadar
          ? {
              title: translated.underTheRadar.title,
              url: origUnder.url,
              summary: translated.underTheRadar.summary,
              source: origUnder.source,
            }
          : undefined;

      const origTryThis = (newsletter as { tryThis?: Array<{ name: string; url: string; oneLiner: string }> }).tryThis;
      const translatedTryThis =
        origTryThis && origTryThis.length > 0 && translated.tryThis && translated.tryThis.length >= origTryThis.length
          ? origTryThis.map((t, i) => ({
              name: translated.tryThis![i]?.name ?? t.name,
              url: t.url,
              oneLiner: translated.tryThis![i]?.oneLiner ?? t.oneLiner,
            }))
          : origTryThis;

      const origQuote = (newsletter as { quoteOfTheDay?: { quote: string; attribution: string; sourceUrl?: string } }).quoteOfTheDay;
      const translatedQuoteOfTheDay =
        origQuote && translated.quoteOfTheDay
          ? {
              quote: translated.quoteOfTheDay.quote,
              attribution: translated.quoteOfTheDay.attribution,
              sourceUrl: origQuote.sourceUrl,
            }
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
        editorialContent: translatedEditorial,
        underTheRadar: translatedUnderTheRadar,
        tryThis: translatedTryThis,
        quoteOfTheDay: translatedQuoteOfTheDay,
      });

      console.log(
        `Translated newsletter ${args.newsletterId} to ${args.targetLanguage}`
      );
    } catch (error) {
      console.error("Translation failed:", error);
    }
  },
});

// Summarize all categories, then translate for premium user languages
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

    console.log("All categories summarized in English");

    const premiumLanguages: string[] = await ctx.runQuery(
      internal.queries.users.getPremiumLanguages
    );

    if (premiumLanguages.length === 0) {
      console.log("No non-English premium languages to translate for");
      return;
    }

    console.log(`Translating for premium languages: ${premiumLanguages.join(", ")}`);

    const today = moment.utc().format("YYYY-MM-DD");

    for (const category of categories) {
      const newsletter = await ctx.runQuery(
        internal.queries.newsletters.getLatestByCategoryInternal,
        { category, language: "en", date: today }
      );

      if (!newsletter) {
        console.log(`No English newsletter found for ${category} on ${today}, skipping translation`);
        continue;
      }

      for (const lang of premiumLanguages) {
        try {
          await ctx.runAction(
            internal.actions.summarizeArticles.translateNewsletter,
            { newsletterId: newsletter._id, targetLanguage: lang }
          );
        } catch (error) {
          console.error(`Failed to translate ${category} to ${lang}:`, error);
        }
      }
    }

    console.log("All translations complete");
  },
});

