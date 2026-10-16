import { Command } from "commander";
import pkg from "../package.json" with { type: "json" };
import { registerAdd } from "./commands/add";
import { registerDiff } from "./commands/diff";
import { registerInit } from "./commands/init";
import { registerList } from "./commands/list";
import { registerTheme } from "./commands/theme";
import { CliError, logger } from "./utils/logger";

const program = new Command()
  .name("expressive")
  .description("Material 3 Expressive–inspired components you own.")
  .version(pkg.version);

registerInit(program);
registerAdd(program);
registerTheme(program);
registerList(program);
registerDiff(program);

program.parseAsync().catch((error: unknown) => {
  if (error instanceof CliError) logger.error(error.message);
  else console.error(error);
  process.exit(1);
});
