import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

// GET: Fetch latest newsletters for a category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const language = searchParams.get("language") || "en";
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    if (category) {
      const newsletters = await convex.query(
        api.queries.newsletters.getLatestByCategory,
        { category, language, limit }
      );
      return NextResponse.json({ newsletters });
    }

    // Return all categories
    const allNewsletters = await convex.query(
      api.queries.newsletters.getLatestAllCategories,
      { language, limit }
    );
    return NextResponse.json({ newsletters: allNewsletters });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

