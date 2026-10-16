import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { SchemeVariant } from "@/registry/tokens/colors";
import { CliError } from "./logger";

export const CONFIG_FILE = "expressive.json";
export const DEFAULT_REGISTRY = "https://expressive.dev/r";

export type MotionEngine = "css" | "motion" | "gsap";
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
  };
  /** Where each kind of file is written, relative to the project root. */
  dirs: Record<Target, string>;
  /** Import prefixes for those dirs (from tsconfig paths). Missing → relative imports. */
  aliases: Partial<Record<Exclude<Target, "styles">, string>>;
}

export function readConfig(cwd: string): Config {
  const file = join(cwd, CONFIG_FILE);
  if (!existsSync(file)) throw new CliError(`No ${CONFIG_FILE} found. Run \`expressive init\` first.`);
  return JSON.parse(readFileSync(file, "utf8")) as Config;
}

export function writeConfig(cwd: string, config: Config) {
  writeFileSync(join(cwd, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`);
}
