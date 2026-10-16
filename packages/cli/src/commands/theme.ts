import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Command } from "commander";
import type { SchemeVariant } from "@/registry/tokens/colors";
import type { MotionScheme } from "@/registry/tokens/motion";
import {
  MOTION_SCHEMES,
  type MotionEngine,
  type ShapeScale,
  assertSchemeEngine,
  readConfig,
  writeConfig,
} from "../utils/config";
import { CliError, logger } from "../utils/logger";
import { writeThemeToCss } from "../utils/theme";
import { add } from "./add";

interface ThemeOptions {
  cwd: string;
  seed?: string;
  variant?: SchemeVariant;
  contrast?: string;
  font?: string;
  shape?: ShapeScale;
  scheme?: MotionScheme;
  motion?: MotionEngine;
  install?: boolean;
}

const ENGINES: MotionEngine[] = ["css", "motion", "gsap"];

/** Point tokens/motion.ts at another engine by rewriting only its adapter export. */
function switchEngine(cwd: string, tokensDir: string, engine: MotionEngine) {
  const file = join(cwd, tokensDir, "motion.ts");
  if (!existsSync(file)) throw new CliError(`${join(tokensDir, "motion.ts")} not found. Run \`npx @grenishrai/expressive init\` first.`);
  const source = readFileSync(file, "utf8");
  const pattern = /export \{ adapter \} from "([^"]*?)adapters\/(?:css|motion|gsap)";/;
  if (!pattern.test(source)) {
    logger.warn(`Couldn't find the adapter export in ${join(tokensDir, "motion.ts")}; point it at adapters/${engine} yourself.`);
    return;
  }
  writeFileSync(file, source.replace(pattern, (_, prefix: string) => `export { adapter } from "${prefix}adapters/${engine}";`));
  logger.success(`Switched ${join(tokensDir, "motion.ts")} to the ${engine} engine`);
}

export async function theme(options: ThemeOptions) {
  const config = readConfig(options.cwd);
  const next = { ...config.theme };
  if (options.seed) next.seed = options.seed.replace(/^#?/, "#");
  if (options.variant) next.variant = options.variant;
  if (options.contrast !== undefined) next.contrast = Number(options.contrast);
  if (options.font) next.font = { brand: options.font, plain: options.font };
  if (options.shape) next.shape = options.shape;
  if (options.scheme) {
    if (!MOTION_SCHEMES.includes(options.scheme)) {
      throw new CliError(`Unknown motion scheme "${options.scheme}". Use one of: ${MOTION_SCHEMES.join(", ")}`);
    }
    next.motionScheme = options.scheme;
  }
  const engine = options.motion ?? config.motion;
  if (!ENGINES.includes(engine)) throw new CliError(`Unknown motion engine "${engine}". Use one of: ${ENGINES.join(", ")}`);
  assertSchemeEngine(next.motionScheme ?? "expressive", engine);

  const updated = { ...config, motion: engine, theme: next };
  if (engine !== config.motion) {
    writeConfig(options.cwd, updated);
    if (engine !== "css") await add([`motion-adapter-${engine}`], { cwd: options.cwd, yes: true, install: options.install });
    switchEngine(options.cwd, config.dirs.tokens, engine);
  }
  writeThemeToCss(options.cwd, updated);
  writeConfig(options.cwd, updated);
  logger.success(`Regenerated theme in ${config.css} (${next.seed}, ${next.variant}, motion: ${next.motionScheme ?? "expressive"})`);
}

export function registerTheme(program: Command) {
  program
    .command("theme")
    .description("regenerate theme CSS variables (seed color, scheme, contrast, font, corners, motion)")
    .option("--seed <hex>", "seed color")
    .option("--variant <scheme>", "color scheme, e.g. expressive, tonal-spot, vibrant")
    .option("--contrast <level>", "contrast level from -1 to 1")
    .option("--font <family>", "font family")
    .option("--shape <scale>", "corner scale (expressive, soft, sharp)")
    .option("--scheme <scheme>", "motion scheme (expressive, standard, fluid)")
    .option("--motion <engine>", "switch motion engine (css, motion, gsap)")
    .option("--no-install", "don't install npm dependencies")
    .option("-c, --cwd <path>", "project directory", process.cwd())
    .action(async (options: ThemeOptions) => {
      await theme(options);
    });
}
