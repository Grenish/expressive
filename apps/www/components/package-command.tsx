import { CommandTabs, type PackageManager } from "@/components/command-tabs";
import { highlight } from "@/lib/highlight";

const RUNNERS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx",
};

/** An `expressive` CLI command, shown for npm, pnpm, Yarn and Bun. `args` is everything after the package name. */
export async function PackageCommand({ args, className }: { args: string; className?: string }) {
  const items = await Promise.all(
    (Object.keys(RUNNERS) as PackageManager[]).map(async (manager) => {
      const command = `${RUNNERS[manager]} @grenishrai/expressive ${args}`;
      return { manager, command, html: await highlight(command, "bash") };
    }),
  );
  return <CommandTabs items={items} className={className} />;
}
