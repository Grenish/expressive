import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Command } from "commander";
import pc from "picocolors";
import { DEFAULT_REGISTRY, readConfig } from "../utils/config";
import { fetchIndex } from "../utils/registry";

interface ListOptions {
  cwd: string;
  registry?: string;
}

export async function list(options: ListOptions) {
  let config;
  try {
    config = readConfig(options.cwd);
  } catch {
    config = undefined;
  }
  const index = await fetchIndex(options.registry ?? config?.registry ?? DEFAULT_REGISTRY, options.cwd);
  for (const entry of index.filter((item) => !item.internal)) {
    const installed = config && entry.files.every((file) => existsSync(join(options.cwd, config.dirs[file.target], file.path)));
    console.log(`${installed ? pc.green("●") : pc.dim("○")} ${pc.bold(entry.name.padEnd(22))} ${pc.dim(entry.description)}`);
  }
}

export function registerList(program: Command) {
  program
    .command("list")
    .description("list available components")
    .option("-r, --registry <url|path>", "registry to read from")
    .option("-c, --cwd <path>", "project directory", process.cwd())
    .action((options: ListOptions) => list(options));
}
