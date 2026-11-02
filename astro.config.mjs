// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://thenode.tech",
  // Static by default; pages that read live newsletter data opt out with `prerender = false`.
  output: "static",
  adapter: vercel(),
  integrations: [react()],
  trailingSlash: "never",
  build: { format: "directory" },
  srcDir: "./src",
  vite: {
    // Vercel already defines NEXT_PUBLIC_CONVEX_URL; keep reading it so no env change is needed.
    envPrefix: ["PUBLIC_", "NEXT_PUBLIC_"],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Outfit",
      cssVariable: "--font-sans",
      weights: [400, 500, 600, 700],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["Helvetica Neue", "Arial", "sans-serif"],
    },
  ],
});
