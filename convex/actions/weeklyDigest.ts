"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { Resend } from "resend";
import moment from "moment-timezone";
import OpenAI from "openai";
import {
  buildWeeklyDigestHTML,
  weeklyDigestSubject,
  type WeeklyDigestData,
} from "../email/weeklyDigestHtml";

const resend = new Resend(process.env.RESEND_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
  ai: "AI & Machine Learning",
  eng: "Engineering & Web Dev",
  sec: "Cybersecurity & InfoSec",
  biz: "Startups & VC",
  tech: "Big Tech & Innovation",
  "cloud-devops": "Cloud & DevOps",
  "web3-crypto": "Web3 & Crypto",
  "design-ux-frontend": "Design, UX & Frontend",
  "emerging-tech-science": "Emerging Tech & Science",
  "opensource-languages": "Open Source & Languages",
};


const WEEKLY_DIGEST_SYSTEM_PROMPT = `You are the lead editor of TheNode.tech writing a "Week in Review" digest. You are given summaries from daily newsletters across multiple tech categories for the past 7 days. Your job is to synthesize them into a single cohesive weekly digest.

You MUST respond with valid JSON in exactly this format:
{
  "overview": "3-5 paragraphs (separated by \\n\\n) that form a compelling week-in-review narrative. Weave together the biggest themes across categories. Explain what mattered this week and why. Write like a human editor, not a list.",
  "topStories": [
    {
      "title": "Headline of the story",
      "url": "original article URL from the input",
      "summary": "2-3 sentence summary of why this was a top story of the week",
      "category": "exact category slug from input (ai, eng, sec, biz, tech, cloud-devops, web3-crypto, design-ux-frontend, emerging-tech-science, opensource-languages)",
      "source": "Source name if available"
    }
  ],
  "trendAnalysis": [
    {
      "trend": "Short trend name (e.g. AI Regulation heats up)",
      "analysis": "2-4 sentences explaining this cross-category trend",
      "relatedCategories": ["array", "of", "category", "slugs"]
    }
  ],
  "weeklyStats": [
    {
      "stat": "Notable figure (e.g. $4.2B, 300%)",
      "context": "One sentence context",
      "sourceUrl": "URL if available"
    }
  ],
  "categoryHighlights": [
    {
      "category": "category slug",
      "headline": "One-line headline for this category's week",
      "summary": "2-3 sentence summary of what happened in this category"
    }
  ]
}

Rules:
- Pick 5-10 top stories across ALL categories. Use exact URLs from the input.
- Write 3-5 trend analysis items that span or connect multiple categories.
- Extract 3-5 weekly stats from the content. Only use real numbers from the input.
- Include exactly one categoryHighlight per category that was in the input.
- Preserve category slugs exactly as in the input.
- Write naturally; avoid clichés.`;

export const generateWeeklyDigest = internalAction({
  args: {
    categories: v.array(v.string()),
    weekStartDate: v.string(),
    weekEndDate: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const categories = args.categories as CategorySlug[];
    const compiled: string[] = [];

    for (const category of categories) {
      const newsletters: any[] = await ctx.runQuery(
        internal.queries.newsletters.getNewslettersByDateRange,
        {
          category,
          language: args.language,
          startDate: args.weekStartDate,
          endDate: args.weekEndDate,
        }
      );

      if (newsletters.length === 0) continue;

      const categoryName = CATEGORY_NAMES[category];
      const dayBlocks = newsletters.map((nl: any) => {
        const deepDivesText = (nl.deepDives || [])
          .map((d: any) => `- ${d.title} (${d.url}): ${d.summary}`)
          .join("\n");
        const articlesText = nl.articles
          .map((a: any) => `- ${a.title} (${a.url}): ${a.summary}`)
          .join("\n");
        const statsText = (nl.stats || [])
          .map((s: any) => `- ${s.stat}: ${s.context}`)
          .join("\n");
        return `[${nl.date}] ${categoryName}\nOverview: ${nl.summary || ""}\nDeep dives:\n${deepDivesText}\nArticles:\n${articlesText}\nStats:\n${statsText}`;
      });
      compiled.push(`## ${categoryName}\n${dayBlocks.join("\n\n")}`);
    }

    if (compiled.length === 0) {
      throw new Error("No newsletter data found for the given week and categories");
    }

    const promptText = compiled.join("\n\n---\n\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: WEEKLY_DIGEST_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Here is the past week's daily newsletter content (${args.weekStartDate} to ${args.weekEndDate}) for the selected categories. Synthesize into a single week-in-review JSON.\n\n${promptText}`,
        },
      ],
      temperature: 0.6,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from OpenAI");

    const parsed = JSON.parse(content) as {
      overview?: string;
      topStories?: Array<{
        title: string;
        url: string;
        summary: string;
        category: string;
        source?: string;
      }>;
      trendAnalysis?: Array<{
        trend: string;
        analysis: string;
        relatedCategories?: string[];
      }>;
      weeklyStats?: Array<{ stat: string; context: string; sourceUrl?: string }>;
      categoryHighlights?: Array<{
        category: string;
        headline: string;
        summary: string;
      }>;
    };

    const topStories = (parsed.topStories || []).slice(0, 10).map((s) => ({
      title: s.title,
      url: s.url,
      summary: s.summary,
      category: s.category as CategorySlug,
      source: s.source,
    }));

    const trendAnalysis = (parsed.trendAnalysis || []).slice(0, 5).map((t) => ({
      trend: t.trend,
      analysis: t.analysis,
      relatedCategories: (t.relatedCategories || []) as CategorySlug[],
    }));

    const categoryHighlights = (parsed.categoryHighlights || [])
      .filter((ch) => categories.includes(ch.category as CategorySlug))
      .map((ch) => ({
        category: ch.category as CategorySlug,
        headline: ch.headline,
        summary: ch.summary,
      }));

    if (categoryHighlights.length < categories.length) {
      for (const cat of categories) {
        if (!categoryHighlights.some((ch) => ch.category === cat)) {
          categoryHighlights.push({
            category: cat,
            headline: `${CATEGORY_NAMES[cat]} this week`,
            summary: parsed.overview || "Key developments across your selected categories.",
          });
        }
      }
    }

    const digestId: string = await ctx.runMutation(internal.mutations.weeklyDigests.create, {
      weekStartDate: args.weekStartDate,
      weekEndDate: args.weekEndDate,
      categories,
      language: args.language,
      createdAt: Date.now(),
      overview: parsed.overview || "This week in tech.",
      topStories,
      trendAnalysis,
      weeklyStats: parsed.weeklyStats?.length ? parsed.weeklyStats : undefined,
      categoryHighlights,
    });

    return digestId;
  },
});

export const sendWeeklyDigests = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const users: any[] = await ctx.runQuery(internal.queries.users.getPremiumUsers);

    if (!users || users.length === 0) {
      console.log("No premium users for weekly digest");
      return null;
    }


    for (const user of users) {
      try {
        if (!user.email) continue;

        const digestEnabled = user.preferences?.weeklyDigestEnabled === true;
        if (!digestEnabled) continue;

        const userTimezone = user.timezone || "UTC";
        const userNow = moment().tz(userTimezone);
        const userDay = userNow.day();
        const userHour = userNow.hour();

        const preferredDigestDay = user.preferences?.preferredDigestDay ?? 1;
        if (userDay !== preferredDigestDay) continue;

        const preferredHour =
          typeof user.preferences?.preferredDeliveryHour === "number" &&
          user.preferences.preferredDeliveryHour >= 0 &&
          user.preferences.preferredDeliveryHour <= 23
            ? user.preferences.preferredDeliveryHour
            : 8;
        if (userHour !== preferredHour) continue;

        const weekEnd = moment().tz(userTimezone).subtract(1, "day");
        const weekStart = weekEnd.clone().subtract(6, "days");
        const weekStartDate = weekStart.format("YYYY-MM-DD");
        const weekEndDate = weekEnd.format("YYYY-MM-DD");

        if (user.lastWeeklyDigestSent) {
          const daysSinceLast = moment()
            .diff(moment(user.lastWeeklyDigestSent), "days");
          if (daysSinceLast < 6) continue;
        }

        const userCategories =
          user.preferences?.categories ?? [];
        if (userCategories.length === 0) continue;
        const language = user.language || "en";

        const existingDigests: any[] = await ctx.runQuery(
          internal.queries.weeklyDigests.getByWeekAndLanguage,
          { weekStartDate, language }
        );

        const sortedUserCats = [...userCategories].sort();
        let digestDoc: WeeklyDigestData | null = null;

        const match = existingDigests.find((d: any) => {
          const digestCats = [...d.categories].sort();
          return (
            digestCats.length === sortedUserCats.length &&
            digestCats.every((c: string, i: number) => c === sortedUserCats[i])
          );
        });

        if (match) {
          digestDoc = {
            weekStartDate: match.weekStartDate,
            weekEndDate: match.weekEndDate,
            overview: match.overview,
            topStories: match.topStories,
            trendAnalysis: match.trendAnalysis,
            weeklyStats: match.weeklyStats,
            categoryHighlights: match.categoryHighlights,
          };
        } else {
          await ctx.runAction(
            internal.actions.weeklyDigest.generateWeeklyDigest,
            {
              categories: userCategories as string[],
              weekStartDate,
              weekEndDate,
              language,
            }
          );
          const newDigests: any[] = await ctx.runQuery(
            internal.queries.weeklyDigests.getByWeekAndLanguage,
            { weekStartDate, language }
          );
          const newMatch = newDigests.find((d: any) => {
            const digestCats = [...d.categories].sort();
            return (
              digestCats.length === sortedUserCats.length &&
              digestCats.every((c: string, i: number) => c === sortedUserCats[i])
            );
          });
          if (newMatch) {
            digestDoc = {
              weekStartDate: newMatch.weekStartDate,
              weekEndDate: newMatch.weekEndDate,
              overview: newMatch.overview,
              topStories: newMatch.topStories,
              trendAnalysis: newMatch.trendAnalysis,
              weeklyStats: newMatch.weeklyStats,
              categoryHighlights: newMatch.categoryHighlights,
            };
          }
        }

        if (!digestDoc) continue;

        const html = buildWeeklyDigestHTML(digestDoc, language);
        const subject = weeklyDigestSubject(digestDoc, language);

        await resend.emails.send({
          from: "TheNode Weekly <newsletter@thenode.tech>",
          to: user.email,
          subject,
          html,
        });

        await ctx.runMutation(internal.mutations.users.updateLastWeeklyDigestSent, {
          id: user._id,
          lastWeeklyDigestSent: Date.now(),
        });

        console.log(`Weekly digest sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send weekly digest to ${user.email}:`, error);
      }
    }

    console.log("Weekly digest delivery complete");
    return null;
  },
});

export const testSendWeeklyDigest = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user: any = await ctx.runQuery(internal.queries.users.getById, {
      id: args.userId,
    });

    if (!user || !user.email) {
      throw new Error("User not found or has no email");
    }

    const userTimezone = user.timezone || "UTC";
    const weekEnd = moment().tz(userTimezone).subtract(1, "day");
    const weekStart = weekEnd.clone().subtract(6, "days");
    const weekStartDate = weekStart.format("YYYY-MM-DD");
    const weekEndDate = weekEnd.format("YYYY-MM-DD");

    const allCategories: CategorySlug[] = [
      "ai", "eng", "sec", "biz", "tech",
      "cloud-devops", "web3-crypto", "design-ux-frontend",
      "emerging-tech-science", "opensource-languages",
    ];

    const userCategories: CategorySlug[] =
      user.preferences?.categories && user.preferences.categories.length > 0
        ? user.preferences.categories
        : allCategories;
    const language = user.language || "en";

    const existingDigests: any[] = await ctx.runQuery(
      internal.queries.weeklyDigests.getByWeekAndLanguage,
      { weekStartDate, language }
    );

    const sortedUserCats = [...userCategories].sort();
    let digestDoc: WeeklyDigestData | null = null;

    const match = existingDigests.find((d: any) => {
      const digestCats = [...d.categories].sort();
      return (
        digestCats.length === sortedUserCats.length &&
        digestCats.every((c: string, i: number) => c === sortedUserCats[i])
      );
    });

    if (match) {
      digestDoc = {
        weekStartDate: match.weekStartDate,
        weekEndDate: match.weekEndDate,
        overview: match.overview,
        topStories: match.topStories,
        trendAnalysis: match.trendAnalysis,
        weeklyStats: match.weeklyStats,
        categoryHighlights: match.categoryHighlights,
      };
    } else {
      console.log(`[TEST] No existing digest found, generating one...`);
      await ctx.runAction(
        internal.actions.weeklyDigest.generateWeeklyDigest,
        {
          categories: userCategories as string[],
          weekStartDate,
          weekEndDate,
          language,
        }
      );
      const newDigests: any[] = await ctx.runQuery(
        internal.queries.weeklyDigests.getByWeekAndLanguage,
        { weekStartDate, language }
      );
      const newMatch = newDigests.find((d: any) => {
        const digestCats = [...d.categories].sort();
        return (
          digestCats.length === sortedUserCats.length &&
          digestCats.every((c: string, i: number) => c === sortedUserCats[i])
        );
      });
      if (newMatch) {
        digestDoc = {
          weekStartDate: newMatch.weekStartDate,
          weekEndDate: newMatch.weekEndDate,
          overview: newMatch.overview,
          topStories: newMatch.topStories,
          trendAnalysis: newMatch.trendAnalysis,
          weeklyStats: newMatch.weeklyStats,
          categoryHighlights: newMatch.categoryHighlights,
        };
      }
    }

    if (!digestDoc) {
      throw new Error("Could not generate or find weekly digest data");
    }

    const html = buildWeeklyDigestHTML(digestDoc, language);
    const subject = `[TEST] ${weeklyDigestSubject(digestDoc, language)}`;

    await resend.emails.send({
      from: "TheNode Weekly <newsletter@thenode.tech>",
      to: user.email,
      subject,
      html,
    });

    console.log(`[TEST] Weekly digest sent to ${user.email} (${weekStartDate} to ${weekEndDate})`);
  },
});
