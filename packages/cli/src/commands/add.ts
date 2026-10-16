import type { Command } from "commander";
import { readConfig } from "../utils/config";
import { installDependencies } from "../utils/install";
import { logger } from "../utils/logger";
import { detectPackageManager } from "../utils/project";
import { resolveTree } from "../utils/registry";
import { type WriteOptions, writeItem } from "../utils/write";

export interface AddOptions extends WriteOptions {
  cwd: string;
  install?: boolean;
  registry?: string;
}

export async function add(names: string[], options: AddOptions) {
  const config = readConfig(options.cwd);
  const registry = options.registry ?? config.registry;
  const items = await resolveTree(registry, names, options.cwd);

  const written: string[] = [];
  let skipped = 0;
  for (const item of items) {
    const result = await writeItem(options.cwd, item, config, options);
    written.push(...result.written);
    skipped += result.skipped.length;
  }

  for (const path of written) logger.success(path);
  if (written.length === 0 && skipped === 0) logger.info("Everything is up to date.");

  if (options.install !== false) {
    await installDependencies(options.cwd, detectPackageManager(options.cwd), items.flatMap((item) => item.dependencies));
  }
  return { items, written };
}

export function registerAdd(program: Command) {
  program
    .command("add")
    .description("add components to your project")
    .argument("<components...>", "components to add, e.g. button dialog")
    .option("-o, --overwrite", "overwrite files with local changes", false)
    .option("-y, --yes", "skip prompts", false)
    .option("--no-install", "don't install npm dependencies")
    .option("-r, --registry <url|path>", "registry to read from (defaults to expressive.json)")
    .option("-c, --cwd <path>", "project directory", process.cwd())
    .action(async (names: string[], options: AddOptions) => {
      await add(names, options);
    });
}
