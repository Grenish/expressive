import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@/registry": fileURLToPath(new URL("../registry/src", import.meta.url)) } },
});
