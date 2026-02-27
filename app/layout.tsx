import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import ThemeProvider from "./ThemeProvider";
import LanguageProvider from "./LanguageProvider";
import TimezoneReporter from "./components/TimezoneReporter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TheNode.tech — Your Daily Dose of Tech",
  description:
    "AI-powered tech newsletter. Get the most impactful stories from AI, Engineering, Security, Business, and more — summarized daily in your language.",
  keywords: [
    "tech newsletter",
    "AI news",
    "engineering",
    "cybersecurity",
    "startups",
    "TLDR",
    "daily newsletter",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <TimezoneReporter />
          <ThemeProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
