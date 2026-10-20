# Setup and the CLI

The CLI is published as `@grenishrai/expressive`. Run it through the project's package manager:

| npm | pnpm | Yarn | Bun |
| --- | --- | --- | --- |
| `npx @grenishrai/expressive …` | `pnpm dlx @grenishrai/expressive …` | `yarn dlx @grenishrai/expressive …` | `bunx @grenishrai/expressive …` |

Installed globally (`npm i -g @grenishrai/expressive`), the command is `expressive`. The examples below use `npx`;
switch to whichever package manager the lockfile shows.

## Requirements

- React 19 and TypeScript.
- Tailwind CSS v4, with a global CSS file containing `@import "tailwindcss"`. If Tailwind isn't set up, set it up
  first (or pass `--css path/to/file.css`).
- One of: Next.js, Vite, React Router / Remix, TanStack Start, Astro with React islands. The CLI detects the framework
  from `package.json` and turns on `"use client"` directives (`rsc: true`) only for the Next.js App Router.

## init (once per project)

```bash
npx @grenishrai/expressive init
npx @grenishrai/expressive init --yes --seed "#0B57D0" --motion motion
```

Interactive by default. It asks six things (all changeable later with `theme`):

| Question | Flag | Default | Notes |
| --- | --- | --- | --- |
| Seed color | `--seed <hex>` | `#6750A4` | The one color the whole scheme is generated from. |
| Color scheme | `--variant <scheme>` | `expressive` | `expressive`, `tonal-spot`, `vibrant`, `neutral`, `monochrome`, `fidelity`, `content`, `rainbow`, `fruit-salad`. |
| Font | `--font <family>` | `Roboto Flex` | A family name or a CSS variable such as `var(--font-geist)`. Loading the font is up to the app. |
| Motion scheme | `--scheme <scheme>` | `expressive` | `expressive`, `standard` or `fluid`. |
| Motion engine | `--motion <engine>` | `css` (`motion` when the scheme is fluid) | `css`, `motion` or `gsap`. |
| Corner scale | `--shape <scale>` | `expressive` | `expressive`, `soft` (×1.25) or `sharp` (×0.5). |

Other flags: `-y/--yes` (no prompts, defaults for anything not passed), `--css <file>`, `--no-install`,
`-c/--cwd <path>`, `-r/--registry <url|path>`.

What it does:

1. Writes `expressive.json` (choices, folders, import aliases).
2. Copies tokens and helpers into the lib folder (`lib/expressive/`): `utils.ts` (`cn`), `tokens/*`, the motion layer
   (`spring.ts`, `use-motion.ts`, `use-fluid.ts`, adapters).
3. Adds `expressive.css` next to the global CSS and imports it after Tailwind.
4. Writes the theme's CSS variables into the global CSS between `/* expressive:theme:start */` and
   `/* expressive:theme:end */`.
5. Installs the npm packages those files use, with the package manager the lockfile points to.

**When an agent runs init:** prefer `--yes` with explicit flags so nothing blocks on a prompt. Ask the user for a seed
color and font if they care about branding; otherwise the defaults are fine and changeable with `theme`.

## add

```bash
npx @grenishrai/expressive add button dialog text-field
```

- Copies each component and its Expressive dependencies (e.g. `split-button` brings `menu`, `ripple`, `utils`) and
  installs npm dependencies (`@base-ui/react`, `class-variance-authority`…).
- Rewrites imports to the project's aliases, or to relative paths when there are none.
- Existing files with local changes: asks before replacing. `--yes` keeps them (and lists them); `--overwrite`
  replaces them. Other flags: `--no-install`, `-c/--cwd`, `-r/--registry`.
- Item names are kebab-case: `button`, `icon-button`, `button-group`, `split-button`, `fab`, `fab-menu`, `chip`,
  `checkbox`, `menu`, `radio-group`, `slider`, `switch`, `text-field`, `navigation-bar`, `navigation-drawer`,
  `navigation-rail`, `tabs`, `toolbar`, `top-app-bar`, `bottom-sheet`, `card`, `dialog`, `divider`, `list`, `shape`,
  `side-sheet`, `table`, `badge`, `loading`, `progress`, `snackbar`, `toast`, `tooltip`, `accordion`, `alert`,
  `alert-dialog`, `avatar`, `breadcrumb`, `calendar`, `date-picker`, `carousel`, `code-block`, `select`, `pagination`, `sidebar`. Extras: `theme-provider`,
  `motion-adapter-motion`, `motion-adapter-gsap`.

## theme

Regenerates the CSS variables between the theme markers and saves the settings to `expressive.json`.

```bash
npx @grenishrai/expressive theme --seed "#B3261E" --variant vibrant
npx @grenishrai/expressive theme --contrast 0.5          # -1 (lower) … 0 (standard) … 1 (high)
npx @grenishrai/expressive theme --font "var(--font-geist)"
npx @grenishrai/expressive theme --shape soft
npx @grenishrai/expressive theme --scheme fluid --motion motion
```

`--motion` switches engines: it installs the adapter and repoints `tokens/motion.ts`. Anything between the markers is
replaced, so custom CSS overrides go **below** `/* expressive:theme:end */`.

## list and diff

```bash
npx @grenishrai/expressive list          # every component, marking installed ones
npx @grenishrai/expressive diff button   # local copy vs the registry version
```

Use `diff` before `add --overwrite` to see what local edits would be lost.

## expressive.json

```json
{
  "registry": "https://expressive.grenishrai.pro/r",
  "framework": "next",
  "rsc": true,
  "css": "src/app/globals.css",
  "motion": "css",
  "theme": {
    "seed": "#6750A4",
    "variant": "expressive",
    "contrast": 0,
    "font": { "brand": "Roboto Flex", "plain": "Roboto Flex" },
    "shape": "expressive",
    "motionScheme": "expressive"
  },
  "dirs": {
    "components": "src/components/expressive",
    "lib": "src/lib/expressive",
    "tokens": "src/lib/expressive/tokens",
    "styles": "src/app"
  },
  "aliases": {
    "components": "@/components/expressive",
    "lib": "@/lib/expressive",
    "tokens": "@/lib/expressive/tokens"
  }
}
```

- `rsc`: keep `"use client"` directives (Next.js App Router).
- `aliases`: import prefixes matching `tsconfig.json` `paths`. Empty means relative imports.
- `registry`: where components come from. A local path works for testing a fork.

## Fonts

The theme names the font; the app loads it. Next.js:

```tsx
// app/layout.tsx
import { Geist } from "next/font/google";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
```

```bash
npx @grenishrai/expressive theme --font "var(--font-geist)"
```

Elsewhere, load it with `@font-face`, Fontsource or a `<link>`. Variable fonts work best (weights interpolate).

## Dark mode

The dark scheme applies under a `.dark` class on any ancestor, usually `<html>`. With next-themes:
`<ThemeProvider attribute="class">`. A plain toggle: `document.documentElement.classList.toggle("dark")`.

## Updating components later

Components are copies, so updates are deliberate:

1. `npx @grenishrai/expressive diff <name>` to see local edits against the latest version.
2. Either re-apply local edits after `add <name> --overwrite`, or merge the upstream change by hand.
3. Re-run the app's tests and check the component in light and dark mode.
