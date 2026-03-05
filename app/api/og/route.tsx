import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { SITE_NAME, SITE_TAGLINE } from "../../../lib/seo/config";

export const runtime = "edge";

const BG_COLORS: Record<string, string> = {
  ai: "#1e40af",
  eng: "#065f46",
  sec: "#991b1b",
  biz: "#92400e",
  tech: "#374151",
  "cloud-devops": "#0c4a6e",
  "web3-crypto": "#4c1d95",
  "design-ux-frontend": "#9d174d",
  "emerging-tech-science": "#164e63",
  "opensource-languages": "#14532d",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? `${SITE_NAME} — ${SITE_TAGLINE}`;
  const description = searchParams.get("description") ?? "AI-powered tech newsletter, daily.";
  const category = searchParams.get("category") ?? "";
  const bg = BG_COLORS[category] ?? "#18181b";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: bg,
          padding: "64px",
          fontFamily: "system-ui, sans-serif",
          justifyContent: "space-between",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              opacity: 0.9,
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              color: "white",
              fontSize: title.length > 60 ? "40px" : "52px",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "22px",
                fontWeight: 400,
                lineHeight: 1.5,
                maxWidth: "800px",
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Bottom label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "18px",
          }}
        >
          <span>thenode.tech</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
