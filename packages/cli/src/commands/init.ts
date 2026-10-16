import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import type { Command } from "commander";
import prompts from "prompts";
import { type SchemeVariant, schemeVariants } from "@/registry/tokens/colors";
import { DEFAULT_SEED } from "@/registry/tokens/theme";
import { CONFIG_FILE, type Config, DEFAULT_REGISTRY, type MotionEngine, type ShapeScale, writeConfig } from "../utils/config";
import { installDependencies } from "../utils/install";
import { CliError, logger } from "../utils/logger";
import { detectProject } from "../utils/project";
import { resolveTree } from "../utils/registry";
import { writeThemeToCss } from "../utils/theme";
import { writeItem } from "../utils/write";

export interface InitOptions {
  cwd: string;
  yes?: boolean;
  install?: boolean;
  registry?: string;
  css?: string;
  seed?: string;
  variant?: SchemeVariant;
  font?: string;
  motion?: MotionEngine;
  shape?: ShapeScale;
}

const HEX = /^#?[0-9a-f]{6}$/i;
const ENGINES: MotionEngine[] = ["css", "motion", "gsap"];
const SHAPES: ShapeScale[] = ["expressive", "soft", "sharp"];

export async function init(options: InitOptions) {
  const { cwd } = options;
  if (!existsSync(join(cwd, "package.json"))) throw new CliError("No package.json found. Run this inside your project.");

  const project = detectProject(cwd);
  const css = options.css ?? project.css;
  if (!css) {
    throw new CliError(
      'Could not find a CSS file with `@import "tailwindcss"`. Expressive needs Tailwind CSS v4 — set it up (https://tailwindcss.com/docs/installation) or pass --css <file>.',
    );
  }
  logger.step(`Detected ${project.framework} · ${project.packageManager} · ${css}`);

  const answers: prompts.Answers<string> = options.yes
    ? {}
    : await prompts(
        [
          {
            type: options.seed ? null : "text",
            name: "seed",
            message: "Seed color",
            initial: DEFAULT_SEED,
            validate: (value: string) => HEX.test(value) || "Enter a hex color like #6750A4",
          },
          {
            type: options.variant ? null : "select",
            name: "variant",
            message: "Color scheme",
            choices: Object.keys(schemeVariants).map((value) => ({ title: value, value })),
            initial: Object.keys(schemeVariants).indexOf("expressive"),
          },
          {
            type: options.font ? null : "text",
            name: "font",
            message: "Font family (any variable font, e.g. Geist, Inter, Roboto Flex)",
            initial: "Roboto Flex",
          },
          {
            type: options.motion ? null : "select",
            name: "motion",
            message: "Motion engine",
            choices: [
              { title: "CSS (no dependency)", value: "css" },
              { title: "Motion (formerly Framer Motion)", value: "motion" },
              { title: "GSAP", value: "gsap" },
            ],
          },
          {
            type: options.shape ? null : "select",
            name: "shape",
            message: "Corner scale",
            choices: [
              { title: "Expressive (Material default)", value: "expressive" },
              { title: "Soft (rounder)", value: "soft" },
              { title: "Sharp (tighter)", value: "sharp" },
            ],
          },
        ],
        { onCancel: () => process.exit(1) },
      );

  const seed = (options.seed ?? answers.seed ?? DEFAULT_SEED).replace(/^#?/, "#");
  if (!HEX.test(seed)) throw new CliError(`Invalid seed color: ${seed}`);
  const motion: MotionEngine = options.motion ?? answers.motion ?? "css";
  if (!ENGINES.includes(motion)) throw new CliError(`Unknown motion engine "${motion}". Use one of: ${ENGINES.join(", ")}`);
  const shape: ShapeScale = options.shape ?? answers.shape ?? "expressive";
  if (!SHAPES.includes(shape)) throw new CliError(`Unknown corner scale "${shape}". Use one of: ${SHAPES.join(", ")}`);
  const variant: SchemeVariant = options.variant ?? answers.variant ?? "expressive";
  if (!(variant in schemeVariants)) throw new CliError(`Unknown scheme "${variant}".`);
  const font: string = options.font ?? answers.font ?? "Roboto Flex";

  const base = project.alias?.dir ?? (project.srcDir ? "src/" : "");
  const prefix = project.alias?.prefix;
  const config: Config = {
    $schema: "https://expressive.dev/schema.json",
    registry: options.registry ?? DEFAULT_REGISTRY,
    framework: project.framework,
    rsc: project.rsc,
    css,
    motion,
    theme: { seed, variant, contrast: 0, font: { brand: font, plain: font }, shape },
    dirs: {
      components: `${base}components/expressive`,
      lib: `${base}lib/expressive`,
      tokens: `${base}lib/expressive/tokens`,
      styles: dirname(css),
    },
    aliases: prefix
      ? { components: `${prefix}components/expressive`, lib: `${prefix}lib/expressive`, tokens: `${prefix}lib/expressive/tokens` }
      : {},
  };
  writeConfig(cwd, config);
  logger.success(`Wrote ${CONFIG_FILE}`);

  const foundation = ["utils", "motion", "tokens", "styles"];
  if (motion !== "css") foundation.push(`motion-adapter-${motion}`);
  const items = await resolveTree(config.registry, foundation, cwd);
  for (const item of items) {
    const { written } = await writeItem(cwd, item, config, { yes: options.yes });
    for (const path of written) logger.success(path);
  }

  writeThemeToCss(cwd, config);
  logger.success(`Added theme (${seed}, ${variant}) to ${css}`);

  if (options.install !== false) {
    await installDependencies(cwd, project.packageManager, items.flatMap((item) => item.dependencies));
  }

  logger.info("");
  logger.success("Expressive is ready. Add components with `npx expressive add button`.");
  if (font !== "Roboto Flex" || project.framework !== "next") {
    logger.dim(`Remember to load the "${font}" font (e.g. next/font, @fontsource-variable, or a <link>).`);
  }
  return config;
}

export function registerInit(program: Command) {
  program
    .command("init")
    .description("set up Expressive: config, tokens, motion layer and theme")
    .option("-y, --yes", "accept defaults, no prompts", false)
    .option("--seed <hex>", "seed color for the color scheme")
    .option("--variant <scheme>", `color scheme (${Object.keys(schemeVariants).join(", ")})`)
    .option("--font <family>", "font family")
    .option("--motion <engine>", "motion engine (css, motion, gsap)")
    .option("--shape <scale>", "corner scale (expressive, soft, sharp)")
    .option("--css <file>", "CSS entry that imports Tailwind")
    .option("--no-install", "don't install npm dependencies")
    .option("-r, --registry <url|path>", "registry URL or local directory", DEFAULT_REGISTRY)
    .option("-c, --cwd <path>", "project directory", process.cwd())
    .action(async (options: InitOptions) => {
      await init(options);
    });
}
