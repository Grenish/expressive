# @grenishrai/expressive

Add [Material 3 Expressive](https://m3.material.io)–inspired React components to your project. Like
shadcn/ui, the CLI copies the source into your codebase, so you own every line and can change anything.

**Docs and live demos:** [expressive.grenishrai.pro](https://expressive.grenishrai.pro)

## Requirements

- React 19 and TypeScript
- Tailwind CSS v4 (a CSS file containing `@import "tailwindcss"`)
- Next.js, Vite, React Router / Remix, TanStack Start or Astro (React islands)

## Quick start

```bash
npx @grenishrai/expressive init
npx @grenishrai/expressive add button dialog switch
```

`init` asks for a seed color, color scheme, font, motion scheme, motion engine and corner scale, then:

- writes `expressive.json` (your choices and where files go);
- copies the design tokens and helpers into `lib/expressive/`;
- adds `expressive.css` next to your global CSS and imports it after Tailwind;
- generates your theme (light and dark) as CSS variables from the seed color;
- installs the npm packages those files use.

Then use the components:

```tsx
import { Button } from "@/components/expressive/button";

export default function Page() {
  return <Button>Get started</Button>;
}
```

## Commands

| Command | What it does |
| --- | --- |
| `init` | Set up config, tokens, the motion layer, the stylesheet and your theme. |
| `add <components...>` | Copy components (and what they depend on) into your project. Asks before replacing files you've changed. |
| `theme` | Regenerate the theme: `--seed`, `--variant`, `--contrast`, `--font`, `--shape`, `--scheme`, `--motion`. |
| `list` | List available components and mark the ones you've installed. |
| `diff <component>` | Show how your copy differs from the registry version. |

Run any command with `--help` for its options. Install globally (`npm i -g @grenishrai/expressive`) to use the
shorter `expressive` command.

```bash
npx @grenishrai/expressive init --yes --seed "#0B57D0" --scheme fluid --motion motion
npx @grenishrai/expressive theme --seed "#B3261E" --variant vibrant
npx @grenishrai/expressive diff button
```

## What you get

- **Color from one seed**, generated with Google's Material color algorithm, as semantic roles in light and dark.
- **Motion on springs**: `expressive`, `standard` and `fluid` schemes. It runs on plain CSS by default, or on
  Motion or GSAP (`fluid` needs one of those two).
- **Typography, shape, elevation and interaction tokens**, exposed as Tailwind utilities such as `bg-primary`,
  `text-title-large`, `rounded-shape-large` and `shape-flower`.
- **19 components** on [Base UI](https://base-ui.com): button, icon button, FAB, chips, checkbox, radio group,
  slider, switch, text field, navigation bar and rail, top app bar, card, dialog, shape, loading, progress,
  snackbar and tooltip.
- **All 35 Material 3 Expressive shapes**, morphing into each other.

## Configuration

`expressive.json` controls where files go (`dirs`), which import aliases are used (`aliases`, read from your
`tsconfig.json` paths), the registry URL, the motion engine and your theme. Edit it freely; every command reads
it.

## Links

- Documentation: https://expressive.grenishrai.pro/docs
- Source: https://github.com/Grenish/expressive
- Issues: https://github.com/Grenish/expressive/issues

## License

MIT. Expressive is inspired by Material 3 Expressive and is not affiliated with Google.
