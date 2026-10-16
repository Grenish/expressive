import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/*
 * Springing border-radius from `rounded-shape-full` (9999px) overshoots below
 * zero and flashes a sharp square. Anything that animates its corners must use
 * `rounded-pill` (half of --ex-control-height) instead.
 */
const root = join(import.meta.dirname, "..");
const dirs = ["src/components", "../../apps/www/components", "../../apps/www/components/landing", "../../apps/www/components/docs"];
const files = dirs.flatMap((dir) =>
  readdirSync(join(root, dir))
    .filter((name) => name.endsWith(".tsx"))
    .map((name) => join(dir, name)),
);

describe("corner animations", () => {
  for (const file of files) {
    it(`${file} never animates border-radius from rounded-shape-full`, () => {
      const source = readFileSync(join(root, file), "utf8");
      // One region per element (className=…), variant definition (cva(…)) or class list (cn(…)).
      const regions = source.split(/className=|cva\(|cn\(/).slice(1);
      for (const region of regions) {
        if (/border-radius/.test(region)) {
          expect(region, `in ${file}`).not.toMatch(/(?<![\w-])(?:[\w-]+:)*rounded-shape-full/);
        }
      }
    });
  }
});
