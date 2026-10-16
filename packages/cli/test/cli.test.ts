import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { Config } from "../src/utils/config";
import { resolveTree } from "../src/utils/registry";
import { writeThemeToCss } from "../src/utils/theme";
import { transform } from "../src/utils/transform";

const registry = fileURLToPath(new URL("../../../apps/www/public/r", import.meta.url));

const config = (overrides: Partial<Config> = {}): Config => ({
  registry,
  framework: "next",
  rsc: true,
  css: "app/globals.css",
  motion: "css",
  theme: { seed: "#6750A4", variant: "expressive", contrast: 0, font: { brand: "Inter", plain: "Inter" }, shape: "expressive" },
  dirs: { components: "src/components/expressive", lib: "src/lib/expressive", tokens: "src/lib/expressive/tokens", styles: "app" },
  aliases: { components: "@/components/expressive", lib: "@/lib/expressive", tokens: "@/lib/expressive/tokens" },
  ...overrides,
});

describe("transform", () => {
  const source = `"use client";\n\nimport { cn } from "@/registry/lib/utils";\nimport { Ripple } from "@/registry/components/ripple";\n`;

  it("rewrites registry imports to aliases", () => {
    const out = transform(source, "src/components/expressive/button.tsx", config());
    expect(out).toContain('from "@/lib/expressive/utils"');
    expect(out).toContain('from "@/components/expressive/ripple"');
    expect(out.startsWith('"use client"')).toBe(true);
  });

  it("uses relative imports without aliases and strips use client without RSC", () => {
    const out = transform(source, "src/components/expressive/button.tsx", config({ aliases: {}, rsc: false }));
    expect(out).toContain('from "../../lib/expressive/utils"');
    expect(out).toContain('from "./ripple"');
    expect(out).not.toContain("use client");
  });

  it("resolves lib imports from tokens nested under lib/expressive", () => {
    const theme = 'import { springToLinear } from "@/registry/lib/spring";\n';
    const out = transform(theme, "src/lib/expressive/tokens/theme.ts", config({ aliases: {} }));
    expect(out).toContain('from "../spring"');
  });

  it("points motion.ts at the configured engine", () => {
    const motion = 'export { adapter } from "@/registry/lib/adapters/css";\n';
    expect(transform(motion, "src/lib/expressive/tokens/motion.ts", config({ motion: "gsap" }))).toContain(
      'export { adapter } from "@/lib/expressive/adapters/gsap";',
    );
  });
});

describe("resolveTree", () => {
  it("returns dependencies before dependents, without duplicates", async () => {
    const items = await resolveTree(registry, ["button", "dialog"], process.cwd());
    const names = items.map((item) => item.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names.indexOf("utils")).toBeLessThan(names.indexOf("button"));
    expect(names.indexOf("motion")).toBeLessThan(names.indexOf("ripple"));
    expect(names.indexOf("ripple")).toBeLessThan(names.indexOf("button"));
  });
});

describe("writeThemeToCss", () => {
  it("adds the import and theme once, and replaces the theme on rerun", () => {
    const cwd = mkdtempSync(join(tmpdir(), "expressive-"));
    const file = join(cwd, "globals.css");
    writeFileSync(file, '@import "tailwindcss";\n\nbody { margin: 0; }\n');
    const base = config({ css: "globals.css", dirs: { ...config().dirs, styles: "." } });

    writeThemeToCss(cwd, base);
    writeThemeToCss(cwd, { ...base, theme: { ...base.theme, seed: "#B3261E" } });
    const css = readFileSync(file, "utf8");

    expect(css.match(/@import "\.\/expressive\.css";/g)).toHaveLength(1);
    expect(css.match(/expressive:theme:start/g)).toHaveLength(1);
    expect(css).toContain("seed #B3261E");
    expect(css).toContain('--ex-font-brand: "Inter", ui-sans-serif');
    expect(css).toContain("body { margin: 0; }");
  });
});
