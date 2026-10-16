import { act, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Loading, loadingSequence } from "@/registry/components/loading";
import { shapePaths } from "@/registry/tokens/material-shapes";

async function expectNoAxeViolations(container: Element) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

describe("Loading", () => {
  it("every variant is a named progressbar with no a11y violations", async () => {
    const variants = ["circular", "wavy", "morph", "shape", "dots", "pulse"] as const;
    const { container } = render(
      <>
        {variants.map((variant) => (
          <Loading key={variant} variant={variant} />
        ))}
      </>,
    );
    const bars = screen.getAllByRole("progressbar", { name: "Loading" });
    expect(bars).toHaveLength(variants.length);
    for (const bar of bars) expect(bar).not.toHaveAttribute("aria-valuenow");
    await expectNoAxeViolations(container);
  });

  it("uses the visible label as its name", () => {
    render(<Loading variant="wavy" label="Fetching messages" labelPosition="bottom" />);
    expect(screen.getByRole("progressbar", { name: "Fetching messages" })).toBeInTheDocument();
    expect(screen.getByText("Fetching messages")).toBeVisible();
  });

  it("is determinate with a value", () => {
    render(<Loading variant="circular" value={42} aria-label="Upload" />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("morph steps through the Compose loading sequence every 650ms", () => {
    vi.useFakeTimers();
    const { container } = render(<Loading variant="morph" contained />);
    const d = () => container.querySelector('[data-slot="shape"] path')!.getAttribute("d");
    expect(d()).toBe(shapePaths[loadingSequence[0]!]);
    act(() => vi.advanceTimersByTime(650));
    expect(d()).toBe(shapePaths[loadingSequence[1]!]);
    act(() => vi.advanceTimersByTime(650 * 6));
    expect(d()).toBe(shapePaths[loadingSequence[0]!]); // wraps around
    expect(container.querySelector('[data-slot="loading"]')).toHaveAttribute("data-contained");
    vi.useRealTimers();
  });

  it("shape variant uses the chosen shape", () => {
    const { container } = render(<Loading variant="shape" shape="heart" />);
    expect(container.querySelector('[data-slot="shape"] path')).toHaveAttribute("d", shapePaths.heart);
  });
});
