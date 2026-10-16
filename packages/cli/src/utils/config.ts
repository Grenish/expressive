import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { SchemeVariant } from "@/registry/tokens/colors";
import type { MotionScheme } from "@/registry/tokens/motion";
import { CliError } from "./logger";

export const CONFIG_FILE = "expressive.json";
export const DEFAULT_REGISTRY = "https://expressive.grenishrai.pro/r";

export type MotionEngine = "css" | "motion" | "gsap";
export const MOTION_SCHEMES: MotionScheme[] = ["expressive", "standard", "fluid"];

/** `fluid` reads velocity every frame, which only the Motion and GSAP engines can do. */
export function assertSchemeEngine(scheme: MotionScheme, engine: MotionEngine) {
  if (scheme === "fluid" && engine === "css") {
    throw new CliError('The "fluid" motion scheme needs the Motion or GSAP engine. Add --motion motion (or --motion gsap).');
  }
}
export type ShapeScale = "expressive" | "soft" | "sharp";
export type Target = "components" | "lib" | "tokens" | "styles";

export interface Config {
  $schema?: string;
  registry: string;
  framework: string;
  /** Keep `"use client"` directives (React Server Components). */
  rsc: boolean;
  /** Global CSS entry that imports Tailwind. */
  css: string;
  motion: MotionEngine;
  theme: {
    seed: string;
    variant: SchemeVariant;
    contrast: number;
    font: { brand: string; plain: string };
    shape: ShapeScale;
    /** Default motion scheme. Older configs may not have it (→ "expressive"). */
    motionScheme?: MotionScheme;
  };
  /** Where each kind of file is written, relative to the project root. */
  dirs: Record<Target, string>;
  /** Import prefixes for those dirs (from tsconfig paths). Missing → relative imports. */
  aliases: Partial<Record<Exclude<Target, "styles">, string>>;
}

export function readConfig(cwd: string): Config {
  const file = join(cwd, CONFIG_FILE);
  if (!existsSync(file)) throw new CliError(`No ${CONFIG_FILE} found. Run \`npx @grenishrai/expressive init\` first.`);
  return JSON.parse(readFileSync(file, "utf8")) as Config;
}

export function writeConfig(cwd: string, config: Config) {
  writeFileSync(join(cwd, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`);
}
