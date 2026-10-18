/** Package managers the docs show CLI commands for (shared by server and client components). */
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export const MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

export const LABELS: Record<PackageManager, string> = { npm: "npm", pnpm: "pnpm", yarn: "Yarn", bun: "Bun" };

/** How each manager runs a package without installing it. */
export const RUNNERS: Record<PackageManager, string> = { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn dlx", bun: "bunx" };

/** The `expressive` CLI invoked through a package manager; `args` is everything after the package name. */
export const cliCommand = (manager: PackageManager, args: string) => `${RUNNERS[manager]} @grenishrai/expressive ${args}`;
