import { dirname, join, relative } from "node:path";
import type { Config, Target } from "./config";

const ENGINES = { css: "css", motion: "motion", gsap: "gsap" } as const;

/** Absolute-ish (project-relative) path a registry file is written to. */
export function targetPath(config: Config, target: Target, path: string) {
  return join(config.dirs[target], path);
}

function importFor(config: Config, fromFile: string, target: Exclude<Target, "styles">, subpath: string) {
  const alias = config.aliases[target];
  if (alias) return `${alias.replace(/\/$/, "")}/${subpath}`;
  let specifier = relative(dirname(fromFile), join(config.dirs[target], subpath)).split("\\").join("/");
  if (!specifier.startsWith(".")) specifier = `./${specifier}`;
  return specifier;
}

/**
 * Turn registry source into project source:
 * - `@/registry/{tokens,lib,components}/x` → the project's aliases (or relative paths)
 * - strip `"use client"` when the project has no React Server Components
 * - point `tokens/motion.ts` at the configured motion engine
 */
export function transform(content: string, outFile: string, config: Config): string {
  let result = content.replace(/@\/registry\/(tokens|lib|components)\/([\w./-]+)/g, (_, target: Exclude<Target, "styles">, subpath: string) =>
    importFor(config, outFile, target, subpath),
  );

  if (!config.rsc) result = result.replace(/^"use client";\r?\n\r?\n?/, "");

  if (outFile.endsWith(join("motion.ts")) && /export \{ adapter \} from/.test(result)) {
    const engine = ENGINES[config.motion];
    result = result.replace(
      /export \{ adapter \} from "[^"]+";/,
      `export { adapter } from "${importFor(config, outFile, "lib", `adapters/${engine}`)}";`,
    );
  }
  return result;
}
