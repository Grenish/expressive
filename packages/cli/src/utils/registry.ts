import { readFileSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { CliError } from "./logger";
import type { Target } from "./config";

export interface RegistryFile {
  path: string;
  target: Target;
  content: string;
  client: boolean;
}

export interface RegistryItem {
  name: string;
  type: "lib" | "token" | "component" | "style";
  description: string;
  files: RegistryFile[];
  dependencies: string[];
  registryDependencies: string[];
}

export interface RegistryIndexEntry {
  name: string;
  type: RegistryItem["type"];
  description: string;
  internal: boolean;
  registryDependencies: string[];
  files: Array<{ path: string; target: Target }>;
}

const isUrl = (source: string) => /^https?:\/\//.test(source);

async function load<T>(registry: string, file: string, cwd: string): Promise<T> {
  if (isUrl(registry)) {
    const url = `${registry.replace(/\/$/, "")}/${file}`;
    const response = await fetch(url);
    if (response.status === 404) throw new CliError(`Not found in registry: ${url}`);
    if (!response.ok) throw new CliError(`Registry request failed (${response.status}): ${url}`);
    return (await response.json()) as T;
  }
  const dir = isAbsolute(registry) ? registry : resolve(cwd, registry);
  try {
    return JSON.parse(readFileSync(join(dir, file), "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") throw new CliError(`Not found in registry: ${join(dir, file)}`);
    throw error;
  }
}

export function fetchIndex(registry: string, cwd: string) {
  return load<RegistryIndexEntry[]>(registry, "index.json", cwd);
}

export function fetchItem(registry: string, name: string, cwd: string) {
  return load<RegistryItem>(registry, `${name}.json`, cwd);
}

/** Fetch items and their registry dependencies, dependencies first. */
export async function resolveTree(registry: string, names: string[], cwd: string): Promise<RegistryItem[]> {
  const ordered: RegistryItem[] = [];
  const seen = new Map<string, Promise<RegistryItem>>();
  const visiting = new Set<string>();

  async function visit(name: string): Promise<void> {
    if (ordered.some((item) => item.name === name)) return;
    if (visiting.has(name)) return;
    visiting.add(name);
    if (!seen.has(name)) seen.set(name, fetchItem(registry, name, cwd));
    const item = await seen.get(name)!;
    for (const dep of item.registryDependencies) await visit(dep);
    if (!ordered.some((existing) => existing.name === name)) ordered.push(item);
  }

  for (const name of names) await visit(name);
  return ordered;
}
