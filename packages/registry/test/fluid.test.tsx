import { act, fireEvent, render, screen } from "@testing-library/react";
import { springAt, springDuration, springSettled, stepSpring } from "@/registry/lib/spring";
import { clampStretch, poseTransform, restPose, restShape, shapeSpring, targetStretch } from "@/registry/lib/fluid";
import { MotionAdapterContext } from "@/registry/lib/use-motion";
import { adapter as cssAdapter } from "@/registry/lib/adapters/css";
import type { FluidSpringOptions, MotionAdapter } from "@/registry/lib/adapters/types";
import { fluid, springs } from "@/registry/tokens/motion";
import { createTheme, themeToCss } from "@/registry/tokens/theme";
import { Button } from "@/registry/components/button";
import { Switch } from "@/registry/components/switch";

describe("fluid physics", () => {
  it("the integrator matches the analytic spring and settles", () => {
    const spring = springs.fluid.spatial.default;
    const state = { value: 0, velocity: 0 };
    for (let t = 0; t < 0.3; t += 1 / 60) stepSpring(state, 1, spring, 1 / 60);
    expect(state.value).toBeCloseTo(springAt(spring, 0.3), 1);
    for (let i = 0; i < 600; i++) stepSpring(state, 1, spring, 1 / 60);
    expect(springSettled(state, 1, 1)).toBe(true);
  });

  it("position glides: softer than expressive, with only a little overshoot", () => {
    const peak = (spring: { dampingRatio: number; stiffness: number }) =>
      Math.max(...Array.from({ length: 600 }, (_, i) => springAt(spring, i / 300)));
    expect(peak(springs.fluid.spatial.default)).toBeLessThan(1.02);
    expect(springDuration(springs.fluid.spatial.default)).toBeGreaterThan(springDuration(springs.expressive.spatial.default));
  });

  it("the shape stretches with speed (capped) and splats when the motion stops", () => {
    expect(targetStretch(40, 0, 40, fluid)).toBeGreaterThan(1);
    expect(targetStretch(1e6, 0, 40, fluid)).toBeCloseTo(1 + fluid.maxStretch);
    // Follow a fast move, then a sudden stop.
    const shape = { value: 1, velocity: 0 };
    for (let i = 0; i < 30; i++) stepSpring(shape, targetStretch(400, 0, 40, fluid), shapeSpring(fluid), 1 / 60);
    let lowest = Infinity;
    for (let i = 0; i < 120; i++) {
      stepSpring(shape, 1, shapeSpring(fluid), 1 / 60);
      lowest = Math.min(lowest, shape.value);
    }
    expect(lowest).toBeLessThan(0.95); // the splat
    expect(clampStretch(lowest, fluid)).toBeGreaterThanOrEqual(1 / (1 + fluid.maxStretch));
    expect(springSettled(shape, 1, fluid.maxStretch)).toBe(true);
  });

  it("deforms without changing area", () => {
    const transform = poseTransform(restPose(), { ...restShape(), stretch: 1.25 });
    const [sx, sy] = transform.match(/scale\(([\d.]+), ([\d.]+)\)/)!.slice(1).map(Number);
    expect(sx! * sy!).toBeCloseTo(1, 2);
  });

  it("is empty at rest so the element's own styles apply", () => {
    expect(poseTransform(restPose(), restShape())).toBe("");
  });
});

describe("fluid theme variables", () => {
  it("emits the fluid scheme, its tokens and --ex-motion-scheme", () => {
    const css = themeToCss(createTheme({ motion: { scheme: "fluid" } }));
    expect(css).toContain("--ex-motion-scheme: fluid;");
    expect(css).toContain("--ex-motion-fluid-spatial-default-easing:");
    expect(css).toContain('[data-motion="fluid"] {');
    expect(css).toContain("--ex-fluid-viscosity:");
    expect(css).toMatch(/\[data-motion="none"\] \{\n {2}--ex-motion-scheme: none;/);
  });
});

/** Fake engine: records springs and reports a mid-flight value immediately. */
function fakeEngine() {
  const calls: FluidSpringOptions[] = [];
  const engine: MotionAdapter = {
    ...cssAdapter,
    name: "fake",
    fluid: {
      spring(options) {
        calls.push(options);
        options.onUpdate((options.from + options.to) / 2 + 0.05, 2);
        return { stop() {} };
      },
    },
  };
  return { engine, calls };
}

describe("fluid components", () => {
  it("press jelly drives the transform when the engine supports fluid", async () => {
    const { engine, calls } = fakeEngine();
    render(
      <MotionAdapterContext value={engine}>
        <Button motion="fluid">Go</Button>
      </MotionAdapterContext>,
    );
    const button = screen.getByRole("button");
    await act(async () => {
      fireEvent.pointerDown(button, { button: 0 });
      await new Promise((resolve) => setTimeout(resolve, 50)); // a couple of animation frames
    });
    expect(button).toHaveAttribute("data-fluid");
    expect(calls.length).toBeGreaterThan(0);
    expect(button.style.transform).toMatch(/scale\(/);
  });

  it("falls back (no data-fluid) on the CSS engine and warns once", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <MotionAdapterContext value={cssAdapter}>
        <Button motion="fluid">Go</Button>
      </MotionAdapterContext>,
    );
    const button = screen.getByRole("button");
    await act(async () => {
      fireEvent.pointerDown(button, { button: 0 });
      await Promise.resolve();
    });
    expect(button).not.toHaveAttribute("data-fluid");
    expect(button.style.transform).toBe("");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("needs the Motion or GSAP engine"));
    warn.mockRestore();
  });

  it("does nothing for other schemes", async () => {
    const { engine, calls } = fakeEngine();
    render(
      <MotionAdapterContext value={engine}>
        <Button motion="expressive">Go</Button>
      </MotionAdapterContext>,
    );
    fireEvent.pointerDown(screen.getByRole("button"), { button: 0 });
    expect(calls).toHaveLength(0);
  });

  it("switch handle animates its layout change in fluid mode", async () => {
    const { engine, calls } = fakeEngine();
    render(
      <MotionAdapterContext value={engine}>
        <label>
          <Switch motion="fluid" /> Wi-Fi
        </label>
      </MotionAdapterContext>,
    );
    const toggle = screen.getByRole("switch");
    await act(async () => {
      fireEvent.click(toggle);
      await Promise.resolve();
    });
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(calls.length).toBeGreaterThanOrEqual(2); // x and y (jsdom has no layout, so both are 0 → 0)
  });
});
