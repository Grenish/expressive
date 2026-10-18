import { CommandTabs } from "@/components/command-tabs";
import { highlight } from "@/lib/highlight";
import { MANAGERS, cliCommand } from "@/lib/package-managers";

/**
 * `expressive` CLI commands, shown for npm, pnpm, Yarn and Bun. Each entry in
 * `args` is one line: everything after the package name (comments included).
 */
export async function PackageCommand({ args, className }: { args: string | string[]; className?: string }) {
  const lines = Array.isArray(args) ? args : [args];
  const items = await Promise.all(
    MANAGERS.map(async (manager) => {
      const command = lines.map((line) => cliCommand(manager, line)).join("\n");
      return { manager, command, html: await highlight(command, "bash") };
    }),
  );
  return <CommandTabs items={items} className={className} />;
}
