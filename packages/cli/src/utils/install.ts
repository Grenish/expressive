import { execa } from "execa";
import type { PackageManager } from "./project";
import { logger } from "./logger";
import { readPackageJson } from "./project";

/** Install npm dependencies that the project doesn't already have. */
export async function installDependencies(cwd: string, packageManager: PackageManager, specs: string[]) {
  const pkg = readPackageJson(cwd);
  const existing = { ...pkg.dependencies, ...pkg.devDependencies };
  const missing = [...new Set(specs)].filter((spec) => !(spec.replace(/(?<=.)@[^@]*$/, "") in existing));
  if (missing.length === 0) return;

  logger.step(`Installing ${missing.join(", ")}`);
  const command = packageManager === "npm" ? "install" : "add";
  await execa(packageManager, [command, ...missing], { cwd, stdio: "inherit" });
}
