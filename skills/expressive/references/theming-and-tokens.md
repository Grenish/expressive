# Theming and tokens

A theme combines every token system (color, typography, shape, motion, elevation, spacing, interaction). Expressive
turns it into `--ex-*` CSS variables, `expressive.css` maps those to Tailwind v4 utilities, and every component reads
the utilities. Change the theme and everything follows; no component code changes.

## Three ways to set the theme

| Situation | Do this |
| --- | --- |
| Fixed brand, chosen once | The CLI: `init`, then `npx @grenishrai/expressive theme --seed … --variant … --font …`. Static CSS, zero runtime cost. **Default choice.** |
| Fine control beyond the CLI's options (override one role, change corner values, tune state layers) | `createTheme()` + `themeToCss()` in a build step, or overrides below the theme markers in the global CSS. |
| Theme only known at runtime (user-picked color, per-tenant brand) | `add theme-provider`, then `<ThemeProvider theme={createTheme(...)}>`. |

### createTheme

```tsx
import { createTheme, themeToCss } from "@/lib/expressive/tokens/theme";

const theme = createTheme({
  colors: { seed: "#0B57D0", variant: "tonal-spot", contrast: 0 },
  typography: { fonts: { brand: "var(--font-display)", plain: "var(--font-sans)" } },
  shape: { corners: { medium: 14, large: 20, "extra-large": 32 } },
  motion: { scheme: "standard" },
  interaction: { stateLayer: { hover: 0.06 }, focusRing: { width: 2, offset: 3 } },
});

const css = themeToCss(theme); // ":root { --ex-… } .dark { --ex-… }"
```

Starts from the defaults and deep-merges what you pass. `colors` takes a seed with options (`seed`, `variant`,
`contrast`, `overrides`) or a complete scheme you generated yourself. `themeToCss(theme, { darkSelector })` changes
the dark selector from `.dark`.

Override a single role without changing the seed:

```tsx
createTheme({ colors: { seed: "#6750A4", overrides: { light: { primary: "#4F378B" } } } });
```

### Runtime theme

```tsx
"use client";

import { useMemo, useState } from "react";
import { ThemeProvider } from "@/lib/expressive/theme-provider";
import { createTheme } from "@/lib/expressive/tokens/theme";

export function BrandedApp({ children }: { children: React.ReactNode }) {
  const [seed, setSeed] = useState("#6750A4");
  const theme = useMemo(() => createTheme({ colors: { seed } }), [seed]);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
```

`ThemeProvider` injects a `<style>` with the theme's variables. Memoize the theme: generating a scheme runs the
Material color algorithm. The provider is global (it writes `:root` rules), not scoped to its subtree.

### Global CSS layout

```css
@import "tailwindcss";
@import "./expressive.css";

/* expressive:theme:start */
:root { --ex-color-primary: #65558f; /* … */ }
.dark { --ex-color-primary: #cfbdfe; /* … */ }
/* expressive:theme:end */

/* Your overrides go here, below the end marker. */
:root { --ex-shape-corner-large: 18px; }
```

`expressive theme` replaces everything between the markers. Never hand-edit inside them.

## Color

One seed color becomes five tonal palettes (via Google's `material-color-utilities`, the Material You algorithm, in
the HCT color space), then every role in light and dark. Components only ever use **roles**.

| Role family | Use for |
| --- | --- |
| `primary` / `on-primary` | The most important actions and active states: filled buttons, selected switches, focused field outlines. |
| `primary-container` / `on-primary-container` | Softer emphasis: FABs, selected items, highlighted panels. |
| `secondary`, `secondary-container` (+ `on-`) | Less prominent: tonal buttons, selected chips, navigation indicators. |
| `tertiary`, `tertiary-container` (+ `on-`) | Contrasting accents: selected menu items, a "vibrant" toolbar or FAB menu. |
| `error`, `error-container` (+ `on-`) | Errors, destructive actions, badges. |
| `surface`, `on-surface`, `on-surface-variant` | Page background, main text, secondary text and icons. |
| `surface-container-lowest`, `-low`, (plain), `-high`, `-highest` | Containers by emphasis: cards and sheets on `-low`, nav rails and menus on plain, dialogs on `-high`, text field fills on `-highest`. |
| `surface-dim`, `surface-bright` | The dimmest and brightest surfaces, for large layout areas. |
| `outline`, `outline-variant` | Field borders and important boundaries; dividers and decorative borders. |
| `inverse-surface`, `inverse-on-surface`, `inverse-primary` | Elements that contrast with the page: snackbars, plain tooltips. |
| `scrim` | Overlay behind modals (`bg-scrim/32`). |
| `shadow` | Shadow tint (used by elevation). |
| `*-fixed`, `*-fixed-dim`, `on-*-fixed`, `on-*-fixed-variant` | Colors that stay the same in light and dark. |

Every role works with every Tailwind color utility (`bg-`, `text-`, `border-`, `ring-`, `fill-`, `stroke-`,
`from-`, `decoration-`…) with opacity modifiers (`bg-on-surface/8`), and as `var(--ex-color-<role>)`.

**Variants** (how the seed is read): `expressive` (default; shifted hues for lively secondary and tertiary),
`tonal-spot` (calm, classic Material You), `vibrant`, `neutral`, `monochrome` (no chroma), `fidelity` and
`content` (stay close to the seed, good for brand colors and images), `rainbow`, `fruit-salad`.

**Contrast**: `--contrast` / `colors.contrast` from -1 to 1. 0 is standard; 0.5 and 1 are Material's medium and
high contrast. Offer high contrast as a user setting for accessibility.

## Typography

15 roles, each with an `-emphasized` version (heavier weight). One utility sets size, line height, tracking and weight.

| Role | Size / line height | Use |
| --- | --- | --- |
| `display-large` / `-medium` / `-small` | 57/64, 45/52, 36/44 | Heroes and short, big moments. |
| `headline-large` / `-medium` / `-small` | 32/40, 28/36, 24/32 | Page and section headings, dialog titles (`headline-small`). |
| `title-large` / `-medium` / `-small` | 22/28, 16/24, 14/20 | Card titles, app bar titles, list headlines, tab labels (`title-small`). |
| `body-large` / `-medium` / `-small` | 16/24, 14/20, 12/16 | Paragraphs, list text, supporting text. |
| `label-large` / `-medium` / `-small` | 14/20, 12/16, 11/16 | Buttons, chips, navigation labels, badges. |

Usage: `className="text-title-large"`, `text-headline-small-emphasized`. Variables: `--ex-type-title-large-size`,
`-line-height`, `-tracking`, `-weight`.

Fonts: **brand** (display, headline, title-large) and **plain** (everything else), both Roboto Flex by default.
Set with `theme --font` or `createTheme({ typography: { fonts: { brand, plain } } })`. Utilities `font-brand` and
`font-plain` apply them directly.

Use `cn()` from `@/lib/expressive/utils` to merge classes: it's tailwind-merge taught that `text-title-large` is a
font size, so it doesn't drop a text color next to it.

## Shape

| Token | px | Utility |
| --- | --- | --- |
| none | 0 | `rounded-shape-none` |
| extra-small | 4 | `rounded-shape-extra-small` |
| small | 8 | `rounded-shape-small` |
| medium | 12 | `rounded-shape-medium` |
| large | 16 | `rounded-shape-large` |
| large-increased | 20 | `rounded-shape-large-increased` |
| extra-large | 28 | `rounded-shape-extra-large` |
| extra-large-increased | 32 | `rounded-shape-extra-large-increased` |
| extra-extra-large | 48 | `rounded-shape-extra-extra-large` |
| full | 9999 | `rounded-shape-full` (static only) |

Side and corner variants work: `rounded-t-shape-large`, `rounded-s-shape-medium`. The `soft` scale multiplies all
values by 1.25, `sharp` by 0.5.

- **`rounded-pill`**: half of `--ex-control-height`. Use it for anything round that changes shape, and set the
  height through the variable: `h-(--ex-control-height) [--ex-control-height:3rem] rounded-pill`.
- **Corner styles**: `corner-squircle`, `corner-cut` (CSS `corner-shape`; unsupported browsers show round corners).
- **Shape morphing** is how M3 Expressive shows state: corners spring toward square on press
  (`active:rounded-shape-medium`), and toggles swap round ↔ square when selected. Pair with
  `transition-[border-radius] spring-spatial-fast`.
- **Material shapes**: 35 named shapes via `<Shape name="…" />` or mask utilities `shape-<name>` (e.g.
  `className="size-16 object-cover shape-clover-4"` on an `<img>`). `add shape`. Names: `circle`, `square`,
  `slanted`, `arch`, `semi-circle`, `oval`, `pill`, `triangle`, `arrow`, `fan`, `diamond`, `clam-shell`,
  `pentagon`, `gem`, `very-sunny`, `sunny`, `cookie-4`, `cookie-6`, `cookie-7`, `cookie-9`, `cookie-12`,
  `clover-4`, `clover-8`, `burst`, `soft-burst`, `boom`, `soft-boom`, `flower`, `puffy`, `puffy-diamond`,
  `ghostish`, `pixel-circle`, `pixel-triangle`, `bun`, `heart`.

## Elevation

`shadow-elevation-0` … `shadow-elevation-5`. Each pairs with a surface: level 1 with `surface-container-low`, level 2
with `surface-container`, level 3 with `surface-container-high`. Depth comes mainly from surface tone; use shadows
for things that float (FABs, menus, toolbars, dragged items) or sit on busy backgrounds.

## Spacing

A 4px-based scale as Tailwind spacing: `p-ex-md`, `gap-ex-sm`, `mt-ex-xl`.

| `none` | `3xs` | `2xs` | `xs` | `sm` | `md` | `lg` | `xl` | `2xl` | `3xl` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 2 | 4 | 8 | 12 | 16 | 24 | 32 | 48 | 64 |

Tailwind's own numeric scale (`p-4`, `gap-2`) also works; the components themselves use it.

## Interaction

- `state-layer`: a `::before` overlay in the current text color: 8% on hover (pointer devices only), 10% on focus
  and press, 16% while dragging (`data-dragged`). Needs `position` and a border radius, which it inherits. Put it on
  the interactive element itself.
- `focus-ring`: an outline in the secondary color, only for keyboard focus (`:focus-visible` / `data-focus-visible`).
- Disabled: content at 38% (`text-on-surface/(--ex-disabled-content)` or `opacity-(--ex-disabled-content)`),
  containers at 10% (`bg-on-surface/(--ex-disabled-container)`).
- Variables: `--ex-state-hover`, `--ex-state-focus`, `--ex-state-pressed`, `--ex-state-dragged`,
  `--ex-disabled-content`, `--ex-disabled-container`, `--ex-focus-ring-width`, `--ex-focus-ring-offset`,
  `--ex-focus-ring-color`.
- Ripple: buttons, icon buttons, FABs and chips include `<Ripple />` (pointer-origin, motion engine driven, skipped
  under reduced motion). Reuse it in custom pressables: render it as the last child of a `relative` element.

## Dark mode

Everything is role-based, so dark mode is automatic: the dark scheme applies under `.dark` on any ancestor. Don't
write `dark:` color variants for Expressive colors; roles already change. Use `dark:` only for non-token things
(an image, a third-party widget).
