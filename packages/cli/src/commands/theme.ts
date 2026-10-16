import type { Command } from "commander";
import type { SchemeVariant } from "@/registry/tokens/colors";
import { type ShapeScale, readConfig, writeConfig } from "../utils/config";
import { logger } from "../utils/logger";
import { writeThemeToCss } from "../utils/theme";

interface ThemeOptions {
  cwd: string;
  seed?: string;
  variant?: SchemeVariant;
  contrast?: string;
  font?: string;
  shape?: ShapeScale;
}

export function theme(options: ThemeOptions) {
  const config = readConfig(options.cwd);
  const next = { ...config.theme };
  if (options.seed) next.seed = options.seed.replace(/^#?/, "#");
  if (options.variant) next.variant = options.variant;
  if (options.contrast !== undefined) next.contrast = Number(options.contrast);
  if (options.font) next.font = { brand: options.font, plain: options.font };
  if (options.shape) next.shape = options.shape;

  const updated = { ...config, theme: next };
  writeThemeToCss(options.cwd, updated);
  writeConfig(options.cwd, updated);
  logger.success(`Regenerated theme in ${config.css} (${next.seed}, ${next.variant})`);
}

export function registerTheme(program: Command) {
  program
    .command("theme")
    .description("regenerate theme CSS variables (seed color, scheme, contrast, font, corners)")
    .option("--seed <hex>", "seed color")
    .option("--variant <scheme>", "color scheme, e.g. expressive, tonal-spot, vibrant")
    .option("--contrast <level>", "contrast level from -1 to 1")
    .option("--font <family>", "font family")
    .option("--shape <scale>", "corner scale (expressive, soft, sharp)")
    .option("-c, --cwd <path>", "project directory", process.cwd())
    .action((options: ThemeOptions) => theme(options));
}
