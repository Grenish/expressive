/**
 * Registry manifest: every installable item and what it needs.
 * `scripts/build-registry.ts` turns this into JSON served at /r/<name>.json.
 */

export type ItemType = "lib" | "token" | "component" | "style";
/** Where a file lands in the user's project, resolved from `expressive.json` paths. */
export type Target = "lib" | "tokens" | "components" | "styles";

export interface ManifestItem {
  name: string;
  type: ItemType;
  description: string;
  files: Array<{ path: string; target: Target }>;
  dependencies?: string[];
  registryDependencies?: string[];
  /** Hidden from `expressive list` (installed implicitly). */
  internal?: boolean;
}

const BASE_UI = "@base-ui/react@^1.9.0";
const CVA = "class-variance-authority@^0.7.1";

export const manifest: ManifestItem[] = [
  {
    name: "utils",
    type: "lib",
    description: "cn() class merging helper aware of Expressive type roles.",
    files: [{ path: "lib/utils.ts", target: "lib" }],
    dependencies: ["clsx@^2.1.1", "tailwind-merge@^3.3.0"],
    internal: true,
  },
  {
    name: "motion",
    type: "token",
    description: "Motion tokens, spring physics, the adapter contract and the default CSS engine.",
    files: [
      { path: "tokens/motion.ts", target: "tokens" },
      { path: "lib/spring.ts", target: "lib" },
      { path: "lib/adapters/types.ts", target: "lib" },
      { path: "lib/adapters/css.ts", target: "lib" },
      { path: "lib/use-motion.ts", target: "lib" },
      { path: "lib/use-reduced-motion.ts", target: "lib" },
    ],
    internal: true,
  },
  {
    name: "motion-adapter-motion",
    type: "lib",
    description: "Motion (formerly Framer Motion) engine for the motion layer.",
    files: [{ path: "lib/adapters/motion.ts", target: "lib" }],
    dependencies: ["motion@^12.23.0"],
    registryDependencies: ["motion"],
  },
  {
    name: "motion-adapter-gsap",
    type: "lib",
    description: "GSAP engine for the motion layer.",
    files: [{ path: "lib/adapters/gsap.ts", target: "lib" }],
    dependencies: ["gsap@^3.13.0"],
    registryDependencies: ["motion"],
  },
  {
    name: "tokens",
    type: "token",
    description: "Color, typography, shape, elevation, spacing and interaction tokens plus createTheme().",
    files: [
      { path: "tokens/colors.ts", target: "tokens" },
      { path: "tokens/typography.ts", target: "tokens" },
      { path: "tokens/shape.ts", target: "tokens" },
      { path: "tokens/elevation.ts", target: "tokens" },
      { path: "tokens/spacing.ts", target: "tokens" },
      { path: "tokens/interaction.ts", target: "tokens" },
      { path: "tokens/theme.ts", target: "tokens" },
    ],
    dependencies: ["@material/material-color-utilities@^0.4.0"],
    registryDependencies: ["motion"],
    internal: true,
  },
  {
    name: "styles",
    type: "style",
    description: "Tailwind v4 bridge: maps --ex-* variables to utilities, plus state-layer/focus-ring/spring utilities.",
    files: [{ path: "styles/expressive.css", target: "styles" }],
    internal: true,
  },
  {
    name: "theme-provider",
    type: "lib",
    description: "Apply a theme at runtime (e.g. a user-picked seed color).",
    files: [{ path: "lib/theme-provider.tsx", target: "lib" }],
    registryDependencies: ["tokens"],
  },
  {
    name: "ripple",
    type: "component",
    description: "Pointer-origin ripple driven by the motion adapter.",
    files: [{ path: "components/ripple.tsx", target: "components" }],
    registryDependencies: ["motion"],
    internal: true,
  },
  {
    name: "button",
    type: "component",
    description: "Filled, tonal, outlined, text and elevated buttons with shape morphing and toggle mode.",
    files: [{ path: "components/button.tsx", target: "components" }],
    dependencies: [BASE_UI, CVA],
    registryDependencies: ["utils", "ripple", "styles"],
  },
  {
    name: "icon-button",
    type: "component",
    description: "Icon buttons in four styles and three widths, with toggle mode.",
    files: [{ path: "components/icon-button.tsx", target: "components" }],
    dependencies: [BASE_UI, CVA],
    registryDependencies: ["utils", "ripple", "styles"],
  },
  {
    name: "card",
    type: "component",
    description: "Elevated, filled and outlined cards, optionally interactive.",
    files: [{ path: "components/card.tsx", target: "components" }],
    dependencies: [BASE_UI, CVA],
    registryDependencies: ["utils", "styles"],
  },
  {
    name: "dialog",
    type: "component",
    description: "Modal dialog with focus trapping and spring enter/exit transitions.",
    files: [{ path: "components/dialog.tsx", target: "components" }],
    dependencies: [BASE_UI],
    registryDependencies: ["utils", "motion", "styles"],
  },
  {
    name: "switch",
    type: "component",
    description: "M3 switch with growing handle and optional icons.",
    files: [{ path: "components/switch.tsx", target: "components" }],
    dependencies: [BASE_UI],
    registryDependencies: ["utils", "motion", "styles"],
  },
  {
    name: "checkbox",
    type: "component",
    description: "Checkbox with a springy check mark, indeterminate and error states.",
    files: [{ path: "components/checkbox.tsx", target: "components" }],
    dependencies: [BASE_UI],
    registryDependencies: ["utils", "motion", "styles"],
  },
  {
    name: "radio-group",
    type: "component",
    description: "Radio buttons with arrow-key navigation.",
    files: [{ path: "components/radio-group.tsx", target: "components" }],
    dependencies: [BASE_UI],
    registryDependencies: ["utils", "motion", "styles"],
  },
  {
    name: "slider",
    type: "component",
    description: "Expressive slider with a bar handle; single value or range.",
    files: [{ path: "components/slider.tsx", target: "components" }],
    dependencies: [BASE_UI],
    registryDependencies: ["utils", "motion", "styles"],
  },
  {
    name: "text-field",
    type: "component",
    description: "Filled and outlined text fields with floating labels, icons, supporting and error text.",
    files: [{ path: "components/text-field.tsx", target: "components" }],
    dependencies: [BASE_UI],
    registryDependencies: ["utils", "styles"],
  },
  {
    name: "fab",
    type: "component",
    description: "Floating action buttons in three sizes, plus the extended FAB.",
    files: [{ path: "components/fab.tsx", target: "components" }],
    dependencies: [BASE_UI, CVA],
    registryDependencies: ["utils", "ripple", "styles"],
  },
  {
    name: "chip",
    type: "component",
    description: "Assist, suggestion, filter and input chips.",
    files: [{ path: "components/chip.tsx", target: "components" }],
    dependencies: [BASE_UI],
    registryDependencies: ["utils", "ripple", "styles"],
  },
  {
    name: "navigation-bar",
    type: "component",
    description: "Bottom navigation bar with a springy active indicator and badges.",
    files: [{ path: "components/navigation-bar.tsx", target: "components" }],
    dependencies: [BASE_UI],
    registryDependencies: ["utils", "styles"],
  },
  {
    name: "navigation-rail",
    type: "component",
    description: "Collapsed or expanded navigation rail for larger screens.",
    files: [{ path: "components/navigation-rail.tsx", target: "components" }],
    dependencies: [BASE_UI],
    registryDependencies: ["utils", "navigation-bar", "styles"],
  },
  {
    name: "top-app-bar",
    type: "component",
    description: "Small, center-aligned, medium and large top app bars that tint on scroll.",
    files: [{ path: "components/top-app-bar.tsx", target: "components" }],
    registryDependencies: ["utils", "styles"],
  },
  {
    name: "snackbar",
    type: "component",
    description: "One-at-a-time snackbars with an optional action, via useSnackbar().",
    files: [{ path: "components/snackbar.tsx", target: "components" }],
    dependencies: [BASE_UI],
    registryDependencies: ["utils", "styles"],
  },
  {
    name: "progress",
    type: "component",
    description: "Linear (including wavy) and circular progress, determinate or indeterminate.",
    files: [{ path: "components/progress.tsx", target: "components" }],
    dependencies: [BASE_UI],
    registryDependencies: ["utils", "styles"],
  },
  {
    name: "tooltip",
    type: "component",
    description: "Plain and rich tooltips.",
    files: [{ path: "components/tooltip.tsx", target: "components" }],
    dependencies: [BASE_UI],
    registryDependencies: ["utils", "motion", "styles"],
  },
];
