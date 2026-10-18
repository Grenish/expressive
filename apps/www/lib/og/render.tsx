import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { generateScheme } from "@/registry/tokens/colors";
import { OG_SEEDS, SITE, getPage } from "@/lib/seo";
import { Art, Shape } from "@/lib/og/art";

/*
 * Open Graph cards, 1200×630, rendered at build time with next/og (Satori).
 * Satori supports flexbox only (every multi-child div needs display: flex),
 * inline SVG and static fonts, so everything here is built from those.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

type Fonts = NonNullable<NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"]>;

const root = process.cwd();
let assets: Promise<{ fonts: Fonts; logo: string }> | undefined;

function loadAssets() {
  assets ??= (async () => {
    const font = (file: string) => readFile(join(root, "lib/og/fonts", file));
    const [b700, b600, r400, mono] = await Promise.all([
      font("bricolage-700.ttf"),
      font("bricolage-600.ttf"),
      font("roboto-flex-400.ttf"),
      font("jetbrains-mono-500.ttf"),
    ]);
    const svg = await readFile(join(root, "public/expressive-logo.svg"), "utf8");
    const logo = svg.match(/\sd="([^"]+)"/)?.[1] ?? "";
    return {
      logo,
      fonts: [
        { name: "Bricolage", data: b700, weight: 700 as const, style: "normal" as const },
        { name: "Bricolage", data: b600, weight: 600 as const, style: "normal" as const },
        { name: "Roboto Flex", data: r400, weight: 400 as const, style: "normal" as const },
        { name: "JetBrains Mono", data: mono, weight: 500 as const, style: "normal" as const },
      ],
    };
  })();
  return assets;
}

/** The first clause of the description, so the card subtitle stays short. */
function subtitle(description: string) {
  const clause = description.split(/[:.]\s/)[0] ?? description;
  if (clause.length >= 30 && clause.length <= 104) return clause;
  if (description.length <= 104) return description;
  return `${description.slice(0, 100).replace(/\s+\S*$/, "")}…`;
}

export function ogAlt(path: string) {
  const page = getPage(path);
  return `${page.og.headline}: ${page.og.eyebrow}. Expressive, Material 3 Expressive for React.`;
}

export async function ogImage(path: string) {
  const page = getPage(path);
  const { fonts, logo } = await loadAssets();
  const seed = OG_SEEDS[page.og.seed];
  const scheme = generateScheme({ seed });
  const c = scheme.light;
  const p = scheme.palettes;
  const headline = page.og.headline;
  const headSize = headline.length <= 12 ? 104 : headline.length <= 20 ? 88 : headline.length <= 30 ? 74 : 64;

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", backgroundColor: c.surfaceContainerLow, fontFamily: "Roboto Flex", overflow: "hidden" }}>
        {/* Living canvas: large, soft tonal shapes drifting behind everything. */}
        <Shape name="cookie-9" size={620} color={p.primary[90]} x={-180} y={330} rotate={18} opacity={0.55} />
        <Shape name="clover-4" size={420} color={p.tertiary[90]} x={760} y={-170} rotate={-12} opacity={0.6} />
        <Shape name="soft-burst" size={300} color={p.secondary[90]} x={440} y={-120} rotate={8} opacity={0.5} />

        {/* Artwork */}
        <div style={{ display: "flex", position: "absolute", right: 0, top: 0, width: 560, height: 630, alignItems: "center", justifyContent: "center" }}>
          <Art art={page.og.art} c={c} p={p} seed={seed} />
        </div>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", position: "absolute", left: 72, top: 64, bottom: 56, width: 620, justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "Bricolage", fontWeight: 600, fontSize: 26, letterSpacing: "0.06em", textTransform: "uppercase", color: c.primary }}>{page.og.eyebrow}</div>
            <div style={{ display: "flex", marginTop: 18, fontFamily: "Bricolage", fontWeight: 700, fontSize: headSize, lineHeight: 1.0, letterSpacing: "-0.035em", color: c.onSurface }}>{headline}</div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 30, lineHeight: 1.35, color: c.onSurfaceVariant, maxWidth: 580 }}>{page.og.subtitle ?? subtitle(page.description)}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {page.og.command && (
              <div style={{ display: "flex", alignSelf: "flex-start", alignItems: "center", gap: 14, padding: "14px 26px", borderRadius: 999, backgroundColor: c.inverseSurface, fontFamily: "JetBrains Mono", fontSize: page.og.command.length > 40 ? 19 : 24, whiteSpace: "nowrap", color: c.inverseOnSurface }}>
                <span style={{ color: c.inversePrimary }}>$</span>
                <span>{page.og.command}</span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <svg width={56} height={34} viewBox="0 0 760 459">
                <path d={logo} fill={c.onSurface} fillRule="evenodd" />
              </svg>
              <span style={{ fontFamily: "Bricolage", fontWeight: 700, fontSize: 30, color: c.onSurface, letterSpacing: "-0.02em" }}>Expressive</span>
              <span style={{ fontSize: 24, color: c.onSurfaceVariant, marginLeft: 8 }}>{new URL(SITE.url).host}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
