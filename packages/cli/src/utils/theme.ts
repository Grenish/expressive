import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { cornerScale } from "@/registry/tokens/shape";
import { createTheme, themeToCss } from "@/registry/tokens/theme";
import type { Config, ShapeScale } from "./config";

const START = "/* expressive:theme:start */";
const END = "/* expressive:theme:end */";

const shapeFactor: Record<ShapeScale, number> = { expressive: 1, soft: 1.25, sharp: 0.5 };

export function fontStack(font: string) {
  const name = font.trim();
  if (!name || name.includes(",") || name.startsWith("var(")) return name;
  return `"${name}", ui-sans-serif, system-ui, sans-serif`;
}

export function buildThemeCss(theme: Config["theme"]) {
  const factor = shapeFactor[theme.shape];
  const corners = Object.fromEntries(
    Object.entries(cornerScale).map(([name, value]) => [name, name === "full" ? value : Math.round(value * factor)]),
  );
  return themeToCss(
    createTheme({
      colors: { seed: theme.seed, variant: theme.variant, contrast: theme.contrast },
      typography: { fonts: { brand: fontStack(theme.font.brand), plain: fontStack(theme.font.plain) } },
      shape: { corners },
    }),
  );
}

/**
 * Make sure the CSS entry imports expressive.css right after Tailwind and
 * contains the generated theme between markers (replaced on every run).
 */
export function writeThemeToCss(cwd: string, config: Config) {
  const file = join(cwd, config.css);
  let css = readFileSync(file, "utf8");

  let stylesImport = relative(dirname(file), join(cwd, config.dirs.styles, "expressive.css")).split("\\").join("/");
  if (!stylesImport.startsWith(".")) stylesImport = `./${stylesImport}`;
  const importLine = `@import "${stylesImport}";`;
  if (!css.includes(importLine)) {
    css = css.replace(/(@import\s+["']tailwindcss["'][^;]*;)/, `$1\n${importLine}`);
  }

  const block = `${START}\n${buildThemeCss(config.theme)}\n${END}`;
  const start = css.indexOf(START);
  const end = css.indexOf(END);
  css = start !== -1 && end > start ? css.slice(0, start) + block + css.slice(end + END.length) : `${css.trimEnd()}\n\n${block}\n`;

  writeFileSync(file, css);
}
