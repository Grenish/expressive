import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Command } from "commander";
import { createTwoFilesPatch } from "diff";
import pc from "picocolors";
import { readConfig } from "../utils/config";
import { logger } from "../utils/logger";
import { fetchItem } from "../utils/registry";
import { renderItem } from "../utils/write";

interface DiffOptions {
  cwd: string;
  registry?: string;
}

/** Show how local files differ from the registry version. */
export async function diff(name: string, options: DiffOptions) {
  const config = readConfig(options.cwd);
  const item = await fetchItem(options.registry ?? config.registry, name, options.cwd);
  let changed = false;
  for (const { path, content } of renderItem(item, config)) {
    const absolute = join(options.cwd, path);
    if (!existsSync(absolute)) {
      logger.warn(`${path} is not installed`);
      continue;
    }
    const local = readFileSync(absolute, "utf8");
    if (local === content) continue;
    changed = true;
    const patch = createTwoFilesPatch(`registry/${path}`, path, content, local);
    for (const line of patch.split("\n")) {
      console.log(line.startsWith("+") ? pc.green(line) : line.startsWith("-") ? pc.red(line) : line);
    }
  }
  if (!changed) logger.success(`${name} matches the registry.`);
}

export function registerDiff(program: Command) {
  program
    .command("diff")
    .description("compare a local component with the registry")
    .argument("<component>", "component name")
    .option("-r, --registry <url|path>", "registry to read from")
    .option("-c, --cwd <path>", "project directory", process.cwd())
    .action((name: string, options: DiffOptions) => diff(name, options));
}
