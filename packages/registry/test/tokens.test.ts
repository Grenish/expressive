import { Hct, SchemeExpressive, argbFromHex, hexFromArgb } from "@material/material-color-utilities";
import { generateScheme } from "@/registry/tokens/colors";
import { createTheme, themeToCss, themeToTailwind } from "@/registry/tokens/theme";
import { springAt, springDuration, springToLinear } from "@/registry/lib/spring";
import { springs } from "@/registry/tokens/motion";

describe("colors", () => {
  it("matches material-color-utilities for a known seed", () => {
    const scheme = generateScheme({ seed: "#6750A4" });
    const reference = new SchemeExpressive(Hct.fromInt(argbFromHex("#6750A4")), false, 0, "2025");
    expect(scheme.light.primary).toBe(hexFromArgb(reference.primary));
    expect(scheme.light.surfaceContainerHigh).toBe(hexFromArgb(reference.surfaceContainerHigh));
  });

  it("produces distinct light and dark roles and full palettes", () => {
    const scheme = generateScheme({ seed: "#0B57D0", variant: "tonal-spot" });
    expect(scheme.light.surface).not.toBe(scheme.dark.surface);
    expect(scheme.palettes.primary[0]).toBe("#000000");
    expect(scheme.palettes.primary[100]).toBe("#ffffff");
  });

  it("applies overrides", () => {
    const scheme = generateScheme({ seed: "#6750A4", overrides: { light: { primary: "#ff0000" } } });
    expect(scheme.light.primary).toBe("#ff0000");
  });
});

describe("springs", () => {
  it("starts at 0, settles at 1", () => {
    for (const scheme of Object.values(springs)) {
      for (const type of Object.values(scheme)) {
        for (const spring of Object.values(type)) {
          expect(springAt(spring, 0)).toBeCloseTo(0);
          expect(springAt(spring, springDuration(spring) / 1000)).toBeCloseTo(1, 2);
        }
      }
    }
  });

  it("bouncy springs overshoot, critically damped ones do not", () => {
    const max = (s: (typeof springs)["expressive"]["spatial"]["fast"]) =>
      Math.max(...Array.from({ length: 200 }, (_, i) => springAt(s, i / 200)));
    expect(max(springs.expressive.spatial.fast)).toBeGreaterThan(1);
    expect(max(springs.expressive.effects.fast)).toBeLessThanOrEqual(1);
  });

  it("serializes to a linear() easing ending at 1", () => {
    const easing = springToLinear(springs.expressive.spatial.default);
    expect(easing).toMatch(/^linear\(0, .*, 1\)$/);
  });
});

describe("theme", () => {
  it("emits css variables for every system", () => {
    const css = themeToCss(createTheme({ colors: { seed: "#386A20" } }));
    for (const v of [
      "--ex-color-primary:",
      "--ex-color-surface-container-highest:",
      "--ex-type-title-large-size:",
      "--ex-shape-corner-full:",
      "--ex-elevation-3:",
      "--ex-state-hover:",
      "--ex-spring-spatial-fast-easing:",
    ]) {
      expect(css).toContain(v);
    }
    expect(css).toContain(".dark {");
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toContain("--ex-state-hover: 8%;");
    expect(css).toContain("--ex-disabled-content: 38%;");
  });

  it("deep-merges overrides", () => {
    const theme = createTheme({ shape: { corners: { large: 20 } }, motion: { scheme: "standard" } });
    expect(theme.shape.corners.large).toBe(20);
    expect(theme.shape.corners.small).toBe(8);
    expect(themeToCss(theme)).toContain("--ex-spring-spatial-fast-easing: var(--ex-motion-standard-spatial-fast-easing)");
  });

  it("maps tokens to tailwind utilities", () => {
    const tw = themeToTailwind();
    expect(tw).toContain("--color-on-primary: var(--ex-color-on-primary);");
    expect(tw).toContain("--text-title-large: var(--ex-type-title-large-size);");
    expect(tw).toContain("--radius-shape-large: var(--ex-shape-corner-large);");
  });
});
