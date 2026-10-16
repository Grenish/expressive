import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { manifest } from "../registry";

/**
 * Item JSON format (consumed by the `expressive` CLI):
 * {
 *   name, type, description,
 *   files: [{ path, target, content, client }],
 *   dependencies, registryDependencies
 * }
 * `path` is relative to the target directory (e.g. `adapters/css.ts` in lib).
 */

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = process.argv[2] ?? join(root, "../../apps/www/public/r");
mkdirSync(outDir, { recursive: true });

const names = new Set(manifest.map((item) => item.name));

for (const item of manifest) {
  for (const dep of item.registryDependencies ?? []) {
    if (!names.has(dep)) throw new Error(`${item.name}: unknown registry dependency "${dep}"`);
  }
  const files = item.files.map(({ path, target }) => {
    const content = readFileSync(join(root, "src", path), "utf8");
    // Path inside the target dir: strip the top-level folder ("lib/adapters/css.ts" → "adapters/css.ts").
    const relative = path.split("/").slice(1).join("/") || basename(path);
    return { path: relative, target, content, client: content.startsWith('"use client"') };
  });
  const json = {
    $schema: "https://expressive.grenishrai.pro/schema/registry-item.json",
    name: item.name,
    type: item.type,
    description: item.description,
    files,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
  };
  writeFileSync(join(outDir, `${item.name}.json`), `${JSON.stringify(json, null, 2)}\n`);
}

const index = manifest.map(({ name, type, description, files, internal = false, registryDependencies = [] }) => ({
  name,
  type,
  description,
  internal,
  registryDependencies,
  files: files.map(({ path, target }) => ({ path: path.split("/").slice(1).join("/"), target })),
}));
writeFileSync(join(outDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`);
console.log(`registry: ${manifest.length} items → ${outDir}`);
