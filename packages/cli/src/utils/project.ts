import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { parse } from "jsonc-parser";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export interface ProjectInfo {
  framework: "next" | "remix" | "react-router" | "tanstack-start" | "astro" | "vite" | "unknown";
  rsc: boolean;
  srcDir: boolean;
  packageManager: PackageManager;
  tailwindV4: boolean;
  css?: string;
  /** e.g. `{ prefix: "@/", dir: "src/" }` from tsconfig `"@/*": ["./src/*"]`. */
  alias?: { prefix: string; dir: string };
}

function readJson(file: string): any {
  try {
    return parse(readFileSync(file, "utf8"));
  } catch {
    return undefined;
  }
}

export function readPackageJson(cwd: string): { dependencies?: Record<string, string>; devDependencies?: Record<string, string> } {
  return readJson(join(cwd, "package.json")) ?? {};
}

export function detectPackageManager(cwd: string): PackageManager {
  const agent = process.env.npm_config_user_agent ?? "";
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "bun.lock")) || existsSync(join(cwd, "bun.lockb"))) return "bun";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  if (existsSync(join(cwd, "package-lock.json"))) return "npm";
  if (agent.startsWith("pnpm")) return "pnpm";
  if (agent.startsWith("bun")) return "bun";
  if (agent.startsWith("yarn")) return "yarn";
  return "npm";
}

const IGNORED = new Set(["node_modules", ".next", ".git", "dist", "build", ".output", ".vercel", ".turbo"]);

function findCssFiles(dir: string, depth = 0, found: string[] = []): string[] {
  if (depth > 4) return found;
  for (const entry of readdirSync(dir)) {
    if (IGNORED.has(entry) || entry.startsWith(".")) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) findCssFiles(path, depth + 1, found);
    else if (entry.endsWith(".css")) found.push(path);
  }
  return found;
}

/** The CSS file that does `@import "tailwindcss"`. */
export function detectCssEntry(cwd: string): string | undefined {
  const file = findCssFiles(cwd).find((path) => /@import\s+["']tailwindcss["']/.test(readFileSync(path, "utf8")));
  return file && relative(cwd, file);
}

export function detectAlias(cwd: string): ProjectInfo["alias"] {
  for (const name of ["tsconfig.json", "tsconfig.app.json", "jsconfig.json"]) {
    const paths: Record<string, string[]> | undefined = readJson(join(cwd, name))?.compilerOptions?.paths;
    if (!paths) continue;
    for (const [key, [target] = []] of Object.entries(paths)) {
      if (key.endsWith("/*") && target?.endsWith("/*")) {
        const dir = target.slice(0, -1).replace(/^\.\//, "");
        return { prefix: key.slice(0, -1), dir };
      }
    }
  }
  return undefined;
}

export function detectProject(cwd: string): ProjectInfo {
  const pkg = readPackageJson(cwd);
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const has = (name: string) => name in deps;

  let framework: ProjectInfo["framework"] = "unknown";
  if (has("next")) framework = "next";
  else if (has("@tanstack/react-start")) framework = "tanstack-start";
  else if (has("@remix-run/react")) framework = "remix";
  else if (has("@react-router/dev")) framework = "react-router";
  else if (has("astro")) framework = "astro";
  else if (has("vite")) framework = "vite";

  const srcDir = existsSync(join(cwd, "src"));
  const rsc = framework === "next" && (existsSync(join(cwd, "app")) || existsSync(join(cwd, "src/app")));
  const css = detectCssEntry(cwd);
  const tailwindVersion = deps.tailwindcss?.replace(/^[^\d]*/, "");

  return {
    framework,
    rsc,
    srcDir,
    packageManager: detectPackageManager(cwd),
    tailwindV4: Boolean(css) || Boolean(tailwindVersion && Number.parseInt(tailwindVersion, 10) >= 4),
    css,
    alias: detectAlias(cwd),
  };
}
