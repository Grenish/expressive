import { render, screen } from "@testing-library/react";
import { shapeLabels, shapeMask, shapeNames, shapePaths } from "@/registry/tokens/material-shapes";
import { type Point, align, lerpPoints, signedArea, smoothPath } from "@/registry/lib/shape-morph";
import { Shape } from "@/registry/components/shape";

const coordinates = (d: string) => (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);

describe("material shapes", () => {
  it("has all 35 shapes with labels", () => {
    expect(shapeNames).toHaveLength(35);
    for (const name of shapeNames) expect(shapeLabels[name]).toBeTruthy();
  });

  it("every path is a closed curve normalized into the 100×100 box", () => {
    for (const name of shapeNames) {
      const d = shapePaths[name];
      expect(d, name).toMatch(/^M [\d.-]+ [\d.-]+ (C( [\d.-]+){6} )+Z$/);
      const xs = coordinates(d).filter((_, i) => i % 2 === 0);
      const ys = coordinates(d).filter((_, i) => i % 2 === 1);
      for (const v of [...xs, ...ys]) {
        expect(v, name).toBeGreaterThanOrEqual(-0.01);
        expect(v, name).toBeLessThanOrEqual(100.01);
      }
      // Like RoundedPolygon.normalized(): the longer side spans the whole box.
      const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
      expect(span, name).toBeCloseTo(100, 0);
    }
  });

  it("builds a CSS mask from a shape", () => {
    expect(shapeMask("flower")).toMatch(/^url\("data:image\/svg\+xml,.*"\) center \/ contain no-repeat$/);
  });
});

describe("shape morphing", () => {
  const square: Point[] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];

  it("re-indexes the target so points travel the least", () => {
    const rotated: Point[] = [square[2]!, square[3]!, square[0]!, square[1]!];
    expect(align(square, rotated)).toEqual(square);
  });

  it("interpolates (and overshoots) linearly", () => {
    const shifted = square.map(([x, y]): Point => [x + 2, y]);
    expect(lerpPoints(square, shifted, 0.5)[0]).toEqual([1, 0]);
    expect(lerpPoints(square, shifted, 1.1)[0]![0]).toBeCloseTo(2.2);
  });

  it("knows clockwise outlines and draws a closed smooth curve", () => {
    expect(signedArea(square)).toBeGreaterThan(0);
    expect(smoothPath(square)).toMatch(/^M 0 0( C [^C]+){4} Z$/);
  });
});

describe("Shape", () => {
  it("is decorative by default and an image when labelled", () => {
    const { container } = render(
      <>
        <Shape name="flower" />
        <Shape name="heart" label="Favorite" />
      </>,
    );
    expect(container.querySelector('svg[aria-hidden="true"] path')).toHaveAttribute("d", shapePaths.flower);
    expect(screen.getByRole("img", { name: "Favorite" })).toBeInTheDocument();
  });

  it("switches shapes (without geometry support it skips the morph)", () => {
    const { container, rerender } = render(<Shape name="circle" />);
    rerender(<Shape name="burst" />);
    expect(container.querySelector("path")).toHaveAttribute("d", shapePaths.burst);
  });
});
