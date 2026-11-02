/**
 * 1200x630 share images in the v3 style (paper, ink rules, orange disc), rendered at build time.
 * Fonts: Outfit Latin subsets in src/assets/og. CJK pages use the English channel name (no CJK glyphs).
 */
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const font = (f: string) => fs.readFileSync(path.resolve(process.cwd(), "src/assets/og", f));
type Node = { type: string; props: Record<string, unknown> };
const h = (style: Record<string, unknown>, children?: (Node | string)[] | Node | string): Node => ({
  type: "div",
  props: { style: { display: "flex", ...style }, children },
});

export async function renderOg(opts: { eyebrow: string; title: string; subtitle: string; hue?: string }): Promise<Uint8Array> {
  const ink = "#1c1917", paper = "#f6f1e7", orange = "#ea580c";
  const tree = h(
    { width: 1200, height: 630, backgroundColor: paper, color: ink, fontFamily: "Outfit", position: "relative", overflow: "hidden" },
    [
      h({ position: "absolute", right: -120, top: 150, width: 520, height: 520, borderRadius: 9999, backgroundColor: opts.hue ?? orange }),
      h({ position: "absolute", left: 72, top: 64, right: 72, bottom: 64, flexDirection: "column", justifyContent: "space-between" }, [
        h({ alignItems: "center", fontSize: 44, fontWeight: 700, letterSpacing: -2 }, [
          "TheN",
          h({ width: 32, height: 32, borderRadius: 9999, border: `7px solid ${orange}`, margin: "4px 2px 0" }),
          "de",
        ]),
        h({ flexDirection: "column", gap: 18, maxWidth: 820 }, [
          h({ fontSize: 26, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: orange }, opts.eyebrow),
          h({ fontSize: opts.title.length > 28 ? 76 : 96, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }, [opts.title, h({ color: orange }, ".")]),
          h({ fontSize: 32, fontWeight: 500, lineHeight: 1.3, color: "#3d3935" }, opts.subtitle),
        ]),
      ]),
    ]
  );
  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Outfit", data: font("bold.ttf"), weight: 700, style: "normal" },
      { name: "Outfit", data: font("medium.ttf"), weight: 500, style: "normal" },
    ],
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}
