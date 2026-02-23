/**
 * Shared types for newsletter and category page data (Convex newsletters table shape).
 */

export interface DeepDive {
  title: string;
  url: string;
  summary: string;
  imageUrl?: string;
  source?: string;
}

export interface Stat {
  stat: string;
  context: string;
  sourceUrl?: string;
}

export interface MediaItem {
  type: "image" | "video";
  url: string;
  caption?: string;
  articleUrl?: string;
}

export interface Article {
  title: string;
  summary: string;
  url: string;
  source?: string;
}

export interface NewsletterWithSections {
  date: string;
  category: string;
  articles: Article[];
  summary?: string;
  language: string;
  createdAt: number;
  deepDives?: DeepDive[];
  stats?: Stat[];
  mediaItems?: MediaItem[];
}
