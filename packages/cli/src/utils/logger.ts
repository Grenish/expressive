import pc from "picocolors";

export const logger = {
  info: (message: string) => console.log(message),
  step: (message: string) => console.log(`${pc.cyan("›")} ${message}`),
  success: (message: string) => console.log(`${pc.green("✔")} ${message}`),
  warn: (message: string) => console.warn(`${pc.yellow("!")} ${message}`),
  error: (message: string) => console.error(`${pc.red("✖")} ${message}`),
  dim: (message: string) => console.log(pc.dim(message)),
};

export class CliError extends Error {}
