import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Feed ingestion: Every 8 hours
crons.interval(
  "ingest-feeds",
  { hours: 8 },
  internal.actions.ingestFeeds.ingestAllFeeds,
  {}
);

// Newsletter generation (AI summarization): Daily at 6:00 AM UTC
crons.cron(
  "summarize-articles",
  "0 6 * * *",
  internal.actions.summarizeArticles.summarizeAllCategories,
  {}
);

// Newsletter delivery: Every hour (8 AM local or the user's preferred hour)
crons.interval(
  "send-newsletters",
  { hours: 1 },
  internal.actions.sendNewsletters.sendDailyNewsletters,
  {}
);

// Weekly digest delivery: Every hour (checks each user's timezone/day/hour)
crons.interval(
  "send-weekly-digests",
  { hours: 1 },
  internal.actions.weeklyDigest.sendWeeklyDigests,
  {}
);

// Cleanup old articles: Daily at midnight UTC
crons.cron(
  "cleanup-old-articles",
  "0 0 * * *",
  internal.mutations.articles.cleanupOldArticles,
  {}
);

export default crons;

