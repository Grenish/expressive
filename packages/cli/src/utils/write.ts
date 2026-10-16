import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import prompts from "prompts";
import type { Config } from "./config";
import { logger } from "./logger";
import type { RegistryItem } from "./registry";
import { targetPath, transform } from "./transform";

export interface WriteOptions {
  overwrite?: boolean;
  yes?: boolean;
}

export function renderItem(item: RegistryItem, config: Config) {
  return item.files.map((file) => {
    const path = targetPath(config, file.target, file.path);
    return { path, content: transform(file.content, path, config) };
  });
}

/** Write an item's files. Unchanged files are skipped; changed ones need confirmation. */
export async function writeItem(cwd: string, item: RegistryItem, config: Config, options: WriteOptions) {
  const written: string[] = [];
  const skipped: string[] = [];
  for (const { path, content } of renderItem(item, config)) {
    const absolute = join(cwd, path);
    if (existsSync(absolute)) {
      const current = readFileSync(absolute, "utf8");
      if (current === content) continue;
      if (!options.overwrite) {
        if (options.yes) {
          logger.warn(`Skipped ${path} (modified locally; pass --overwrite to replace)`);
          skipped.push(path);
          continue;
        }
        const { replace } = await prompts({
          type: "confirm",
          name: "replace",
          message: `${path} has local changes. Overwrite?`,
          initial: false,
        });
        if (!replace) {
          skipped.push(path);
          continue;
        }
      }
    }
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, content);
    written.push(path);
  }
  return { written, skipped };
}
