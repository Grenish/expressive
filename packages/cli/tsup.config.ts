import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  clean: true,
  banner: { js: "#!/usr/bin/env node" },
  // Theme generation reuses the registry's token source directly.
  noExternal: [/^@\/registry/, "@material/material-color-utilities"],
  esbuildOptions(options) {
    options.alias = { "@/registry": fileURLToPath(new URL("../registry/src", import.meta.url)) };
  },
});
