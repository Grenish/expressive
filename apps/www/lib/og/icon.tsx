import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { generateScheme } from "@/registry/tokens/colors";
import { SITE_SEED } from "@/lib/brand";

/** App icon: the logo on the default seed's primary color. `maskable` keeps the mark inside the safe zone. */
export async function renderIcon(size: number, { maskable = false, rounded = true } = {}) {
  const svg = await readFile(join(process.cwd(), "public/expressive-logo.svg"), "utf8");
  const logo = svg.match(/\sd="([^"]+)"/)?.[1] ?? "";
  const { light } = generateScheme({ seed: SITE_SEED });
  const width = size * (maskable ? 0.52 : 0.64);
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: light.primary, borderRadius: rounded && !maskable ? size * 0.22 : 0 }}>
        <svg width={width} height={width * (459 / 760)} viewBox="0 0 760 459">
          <path d={logo} fill={light.onPrimary} fillRule="evenodd" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
