/**
 * Generates src/tokens/material-shapes.ts: the 35 Material 3 Expressive shapes
 * as static SVG paths in a 100×100 box.
 *
 * Shape recipes are ported from Jetpack Compose's MaterialShapes.kt and the
 * builders from androidx.graphics.shapes (both Apache-2.0, The Android Open
 * Source Project). Rounded-corner geometry comes from Meta's TypeScript port of
 * RoundedPolygon (@wearables-ui-toolkit/androidx-shapes, Apache-2.0), used at
 * build time only, so apps get plain data and no runtime dependency.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  type AndroidXCornerRounding,
  type AndroidXRoundedPolygonVertex,
  generateAndroidXRoundedPolygonPath,
} from "@wearables-ui-toolkit/androidx-shapes";

type Rounding = AndroidXCornerRounding;
type Vertex = AndroidXRoundedPolygonVertex;
type Matrix = [number, number, number, number]; // [a, b, c, d]: x' = a·x + c·y, y' = b·x + d·y

const round = (radius: number, smoothing = 0): Rounding => ({ radius, smoothing });
const UNROUNDED = round(0);
const r15 = round(0.15);
const r20 = round(0.2);
const r30 = round(0.3);
const r50 = round(0.5);
const r100 = round(1);

// Compose Matrix.rotateZ(deg) (y points down, so positive is clockwise on screen).
const rotate = (deg: number): Matrix => {
  const a = (deg * Math.PI) / 180;
  return [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a)];
};
const scale = (sx: number, sy: number): Matrix => [sx, 0, 0, sy];

// --- androidx.graphics.shapes builders ---------------------------------------

/** RoundedPolygon(numVertices, radius): vertices start at angle 0 and go clockwise. */
function regular(n: number, radius = 1, rounding: Rounding = UNROUNDED, perVertex?: Rounding[]): Vertex[] {
  return Array.from({ length: n }, (_, i) => {
    const a = ((Math.PI * 2) / n) * i;
    return { x: radius * Math.cos(a), y: radius * Math.sin(a), rounding: perVertex?.[i] ?? rounding };
  });
}

/** RoundedPolygon.circle: a polygon whose corners are rounded into a circle. */
function circle(n = 8, radius = 1): Vertex[] {
  return regular(n, radius / Math.cos(Math.PI / n), round(radius));
}

function rectangle(width: number, height: number, rounding: Rounding = UNROUNDED, perVertex?: Rounding[]): Vertex[] {
  const [l, t, r, b] = [-width / 2, -height / 2, width / 2, height / 2];
  return [
    [r, b],
    [l, b],
    [l, t],
    [r, t],
  ].map(([x, y], i) => ({ x: x!, y: y!, rounding: perVertex?.[i] ?? rounding }));
}

function star(n: number, innerRadius: number, rounding: Rounding = UNROUNDED, radius = 1): Vertex[] {
  return Array.from({ length: n * 2 }, (_, i) => {
    const a = (Math.PI / n) * i;
    const rad = i % 2 === 0 ? radius : innerRadius;
    return { x: rad * Math.cos(a), y: rad * Math.sin(a), rounding };
  });
}

// --- MaterialShapes.customPolygon / doRepeat ---------------------------------

type PointNRound = [x: number, y: number, rounding?: Rounding];

function customPolygon(points: PointNRound[], reps: number, mirroring = false, center = { x: 0.5, y: 0.5 }): Vertex[] {
  const out: Vertex[] = [];
  if (mirroring) {
    const angles = points.map(([x, y]) => (Math.atan2(y - center.y, x - center.x) * 180) / Math.PI);
    const distances = points.map(([x, y]) => Math.hypot(x - center.x, y - center.y));
    const actualReps = reps * 2;
    const section = 360 / actualReps;
    for (let it = 0; it < actualReps; it++) {
      for (let index = 0; index < points.length; index++) {
        const i = it % 2 === 0 ? index : points.length - 1 - index;
        if (i > 0 || it % 2 === 0) {
          const deg = section * it + (it % 2 === 0 ? angles[i]! : section - angles[i]! + 2 * angles[0]!);
          const a = (deg * Math.PI) / 180;
          out.push({
            x: Math.cos(a) * distances[i]! + center.x,
            y: Math.sin(a) * distances[i]! + center.y,
            rounding: points[i]![2] ?? UNROUNDED,
          });
        }
      }
    }
  } else {
    for (let k = 0; k < points.length * reps; k++) {
      const [x, y, rounding] = points[k % points.length]!;
      const a = ((Math.floor(k / points.length) * 360) / reps) * (Math.PI / 180);
      const dx = x - center.x;
      const dy = y - center.y;
      out.push({
        x: dx * Math.cos(a) - dy * Math.sin(a) + center.x,
        y: dx * Math.sin(a) + dy * Math.cos(a) + center.y,
        rounding: rounding ?? UNROUNDED,
      });
    }
  }
  return out;
}

// --- MaterialShapes recipes ---------------------------------------------------

interface Recipe {
  label: string;
  vertices: Vertex[];
  /** Applied to the rounded curves, in order (like RoundedPolygon.transformed). */
  transforms?: Matrix[];
}

const recipes: Record<string, Recipe> = {
  circle: { label: "Circle", vertices: circle(10) },
  square: { label: "Square", vertices: rectangle(1, 1, r30) },
  slanted: {
    label: "Slanted",
    vertices: customPolygon(
      [
        [0.926, 0.97, round(0.189, 0.811)],
        [-0.021, 0.967, round(0.187, 0.057)],
      ],
      2,
    ),
  },
  arch: { label: "Arch", vertices: regular(4, 1, UNROUNDED, [r100, r100, r20, r20]), transforms: [rotate(-135)] },
  "semi-circle": { label: "Semicircle", vertices: rectangle(1.6, 1, UNROUNDED, [r20, r20, r100, r100]) },
  oval: { label: "Oval", vertices: circle(8), transforms: [scale(1, 0.64), rotate(-45)] },
  pill: {
    label: "Pill",
    vertices: customPolygon(
      [
        [0.961, 0.039, round(0.426)],
        [1.001, 0.428],
        [1.0, 0.609, round(1)],
      ],
      2,
      true,
    ),
  },
  triangle: { label: "Triangle", vertices: regular(3, 1, r20), transforms: [rotate(-90)] },
  arrow: {
    label: "Arrow",
    vertices: customPolygon(
      [
        [0.5, 0.892, round(0.313)],
        [-0.216, 1.05, round(0.207)],
        [0.499, -0.16, round(0.215, 1)],
        [1.225, 1.06, round(0.211)],
      ],
      1,
    ),
  },
  fan: {
    label: "Fan",
    vertices: customPolygon(
      [
        [1.004, 1.0, round(0.148, 0.417)],
        [0.0, 1.0, round(0.151)],
        [0.0, -0.003, round(0.148)],
        [0.978, 0.02, round(0.803)],
      ],
      1,
    ),
  },
  diamond: {
    label: "Diamond",
    vertices: customPolygon(
      [
        [0.5, 1.096, round(0.151, 0.524)],
        [0.04, 0.5, round(0.159)],
      ],
      2,
    ),
  },
  "clam-shell": {
    label: "Clamshell",
    vertices: customPolygon(
      [
        [0.171, 0.841, round(0.159)],
        [-0.02, 0.5, round(0.14)],
        [0.17, 0.159, round(0.159)],
      ],
      2,
    ),
  },
  pentagon: {
    label: "Pentagon",
    vertices: customPolygon(
      [
        [0.5, -0.009, round(0.172)],
        [1.03, 0.365, round(0.164)],
        [0.828, 0.97, round(0.169)],
      ],
      1,
      true,
    ),
  },
  gem: {
    label: "Gem",
    vertices: customPolygon(
      [
        [0.499, 1.023, round(0.241, 0.778)],
        [-0.005, 0.792, round(0.208)],
        [0.073, 0.258, round(0.228)],
        [0.433, -0.0, round(0.491)],
      ],
      1,
      true,
    ),
  },
  "very-sunny": {
    label: "Very sunny",
    vertices: customPolygon(
      [
        [0.5, 1.08, round(0.085)],
        [0.358, 0.843, round(0.085)],
      ],
      8,
    ),
  },
  sunny: { label: "Sunny", vertices: star(8, 0.8, r15) },
  "cookie-4": {
    label: "4-sided cookie",
    vertices: customPolygon(
      [
        [1.237, 1.236, round(0.258)],
        [0.5, 0.918, round(0.233)],
      ],
      4,
    ),
  },
  "cookie-6": {
    label: "6-sided cookie",
    vertices: customPolygon(
      [
        [0.723, 0.884, round(0.394)],
        [0.5, 1.099, round(0.398)],
      ],
      6,
    ),
  },
  "cookie-7": { label: "7-sided cookie", vertices: star(7, 0.75, r50), transforms: [rotate(-90)] },
  "cookie-9": { label: "9-sided cookie", vertices: star(9, 0.8, r50), transforms: [rotate(-90)] },
  "cookie-12": { label: "12-sided cookie", vertices: star(12, 0.8, r50), transforms: [rotate(-90)] },
  "clover-4": {
    label: "4-leaf clover",
    vertices: customPolygon(
      [
        [0.5, 0.074],
        [0.725, -0.099, round(0.476)],
      ],
      4,
      true,
    ),
  },
  "clover-8": {
    label: "8-leaf clover",
    vertices: customPolygon(
      [
        [0.5, 0.036],
        [0.758, -0.101, round(0.209)],
      ],
      8,
    ),
  },
  burst: {
    label: "Burst",
    vertices: customPolygon(
      [
        [0.5, -0.006, round(0.006)],
        [0.592, 0.158, round(0.006)],
      ],
      12,
    ),
  },
  "soft-burst": {
    label: "Soft burst",
    vertices: customPolygon(
      [
        [0.193, 0.277, round(0.053)],
        [0.176, 0.055, round(0.053)],
      ],
      10,
    ),
  },
  boom: {
    label: "Boom",
    vertices: customPolygon(
      [
        [0.457, 0.296, round(0.007)],
        [0.5, -0.051, round(0.007)],
      ],
      15,
    ),
  },
  "soft-boom": {
    label: "Soft boom",
    vertices: customPolygon(
      [
        [0.733, 0.454],
        [0.839, 0.437, round(0.532)],
        [0.949, 0.449, round(0.439, 1)],
        [0.998, 0.478, round(0.174)],
      ],
      16,
      true,
    ),
  },
  flower: {
    label: "Flower",
    vertices: customPolygon(
      [
        [0.37, 0.187],
        [0.416, 0.049, round(0.381)],
        [0.479, 0.001, round(0.095)],
      ],
      8,
      true,
    ),
  },
  puffy: {
    label: "Puffy",
    vertices: customPolygon(
      [
        [0.5, 0.053],
        [0.545, -0.04, round(0.405)],
        [0.67, -0.035, round(0.426)],
        [0.717, 0.066, round(0.574)],
        [0.722, 0.128],
        [0.777, 0.002, round(0.36)],
        [0.914, 0.149, round(0.66)],
        [0.926, 0.289, round(0.66)],
        [0.881, 0.346],
        [0.94, 0.344, round(0.126)],
        [1.003, 0.437, round(0.255)],
      ],
      2,
      true,
    ),
    transforms: [scale(1, 0.742)],
  },
  "puffy-diamond": {
    label: "Puffy diamond",
    vertices: customPolygon(
      [
        [0.87, 0.13, round(0.146)],
        [0.818, 0.357],
        [1.0, 0.332, round(0.853)],
      ],
      4,
      true,
    ),
  },
  ghostish: {
    label: "Ghost-ish",
    vertices: customPolygon(
      [
        [0.5, 0, round(1)],
        [1, 0, round(1)],
        [1, 1.14, round(0.254, 0.106)],
        [0.575, 0.906, round(0.253)],
      ],
      1,
      true,
    ),
  },
  "pixel-circle": {
    label: "Pixel circle",
    vertices: customPolygon(
      [
        [0.5, 0.0],
        [0.704, 0.0],
        [0.704, 0.065],
        [0.843, 0.065],
        [0.843, 0.148],
        [0.926, 0.148],
        [0.926, 0.296],
        [1.0, 0.296],
      ],
      2,
      true,
    ),
  },
  "pixel-triangle": {
    label: "Pixel triangle",
    vertices: customPolygon(
      [
        [0.11, 0.5],
        [0.113, 0.0],
        [0.287, 0.0],
        [0.287, 0.087],
        [0.421, 0.087],
        [0.421, 0.17],
        [0.56, 0.17],
        [0.56, 0.265],
        [0.674, 0.265],
        [0.675, 0.344],
        [0.789, 0.344],
        [0.789, 0.439],
        [0.888, 0.439],
      ],
      1,
      true,
    ),
  },
  bun: {
    label: "Bun",
    vertices: customPolygon(
      [
        [0.796, 0.5],
        [0.853, 0.518, round(1)],
        [0.992, 0.631, round(1)],
        [0.968, 1.0, round(1)],
      ],
      2,
      true,
    ),
  },
  heart: {
    label: "Heart",
    vertices: customPolygon(
      [
        [0.5, 0.268, round(0.016)],
        [0.792, -0.066, round(0.958)],
        [1.064, 0.276, round(1)],
        [0.501, 0.946, round(0.129)],
      ],
      1,
      true,
    ),
  },
};

// --- Path post-processing -----------------------------------------------------

/** Parse "M x,y C x,y x,y x,y … Z" into its coordinate pairs (all absolute). */
function parse(d: string) {
  const commands: Array<{ op: string; points: Array<[number, number]> }> = [];
  for (const [, op, args] of d.matchAll(/([MCLZ])([^MCLZ]*)/g)) {
    const numbers = (args!.match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map(Number);
    const points: Array<[number, number]> = [];
    for (let i = 0; i < numbers.length; i += 2) points.push([numbers[i]!, numbers[i + 1]!]);
    commands.push({ op: op!, points });
  }
  return commands;
}

function build({ vertices, transforms = [] }: Recipe): string {
  let commands = parse(generateAndroidXRoundedPolygonPath(vertices));
  for (const [a, b, c, d] of transforms) {
    commands = commands.map(({ op, points }) => ({ op, points: points.map(([x, y]) => [a * x + c * y, b * x + d * y]) }));
  }
  // RoundedPolygon.normalized(): fit the approximate bounds (anchors + controls)
  // into a unit square, centered, then scale to 100.
  const all = commands.flatMap((command) => command.points);
  const minX = Math.min(...all.map((p) => p[0]));
  const maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1]));
  const maxY = Math.max(...all.map((p) => p[1]));
  const side = Math.max(maxX - minX, maxY - minY);
  const ox = (side - (maxX - minX)) / 2 - minX;
  const oy = (side - (maxY - minY)) / 2 - minY;
  const f = (n: number) => String(Math.round(n * 100) / 100);
  return commands
    .map(({ op, points }) => [op, ...points.map(([x, y]) => `${f(((x + ox) / side) * 100)} ${f(((y + oy) / side) * 100)}`)].join(" "))
    .join(" ");
}

const entries = Object.entries(recipes).map(([name, recipe]) => [name, recipe.label, build(recipe)] as const);

const source = `/**
 * Material 3 Expressive shapes: 35 SVG paths in a 100×100 box.
 * Generated by packages/registry/scripts/build-shapes.ts — don't edit by hand.
 *
 * Shapes from Jetpack Compose MaterialShapes and androidx.graphics.shapes
 * (Apache-2.0, The Android Open Source Project), rounded with Meta's port of
 * RoundedPolygon (@wearables-ui-toolkit/androidx-shapes, Apache-2.0).
 */

export const shapeNames = [
${entries.map(([name]) => `  "${name}",`).join("\n")}
] as const;

export type MaterialShapeName = (typeof shapeNames)[number];

export const shapeLabels: Record<MaterialShapeName, string> = {
${entries.map(([name, label]) => `  "${name}": "${label}",`).join("\n")}
};

/** Path data for each shape, in a \`0 0 100 100\` viewBox. */
export const shapePaths: Record<MaterialShapeName, string> = {
${entries.map(([name, , d]) => `  "${name}": "${d}",`).join("\n")}
};

/** A CSS \`mask\` value that clips any element (an image, a card) to a shape. */
export function shapeMask(name: MaterialShapeName): string {
  const svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="\${shapePaths[name]}"/></svg>\`;
  return \`url("data:image/svg+xml,\${encodeURIComponent(svg)}") center / contain no-repeat\`;
}
`;

const out = fileURLToPath(new URL("../src/tokens/material-shapes.ts", import.meta.url));
writeFileSync(out, source);
console.log(`shapes: ${entries.length} → src/tokens/material-shapes.ts`);
