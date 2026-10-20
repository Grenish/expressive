# Expressive

Material 3 Expressive design language, shadcn/ui ownership model. A CLI copies
token-driven React components into your project, and you own the code.

```bash
npx @grenishrai/expressive init                       # config, tokens, motion layer, theme from a seed color
npx @grenishrai/expressive add button dialog switch   # copy components in
npx @grenishrai/expressive theme --seed "#0B57D0"     # regenerate the theme
npx @grenishrai/expressive diff button                # compare your copy with the registry
```

Requires React 19 and Tailwind CSS v4.

## AI agents

Agent skills teach coding agents (Claude Code, Codex, Cursor and others) how to use Expressive: setup, picking
components, tokens, motion, accessibility rules, patterns, and how it compares with MUI, shadcn/ui and others.

```bash
npx skills add Grenish/expressive --skill expressive
```

More on the [Agent skills](https://expressive.grenishrai.pro/docs/agent-skills) page; for how Expressive compares with
other libraries, see [Why Expressive](https://expressive.grenishrai.pro/docs/why). The docs are also available as [llms.txt](https://expressive.grenishrai.pro/llms.txt) and
[llms-full.txt](https://expressive.grenishrai.pro/llms-full.txt).

## Repo layout

| Path | What |
| --- | --- |
| `packages/registry/src/tokens` | `colors` (seed → palettes/roles via material-color-utilities), `typography`, `shape`, `motion`, `elevation`, `spacing`, `interaction`, `theme` (`createTheme`, `themeToCss`) |
| `packages/registry/src/lib` | spring physics, motion adapters (`css`, `motion`, `gsap`), `useMotion`, `ThemeProvider`, `cn` |
| `packages/registry/src/components` | the 45 components, on Base UI primitives |
| `packages/registry/src/styles` | `expressive.css`: Tailwind v4 bridge (generated) + state-layer/focus-ring/spring utilities |
| `packages/registry/registry.ts` | item manifest → `apps/www/public/r/*.json` |
| `packages/cli` | the `expressive` CLI |
| `apps/www` | docs + live theme playground |
| `skills` | agent skills: `expressive` (building apps) and `expressive-contributor` (working on this repo) |

## Development

```bash
pnpm install
pnpm --filter @expressive/registry build   # styles + registry JSON
pnpm test
pnpm --filter @expressive/www dev
```

Try the CLI against the local registry:

```bash
pnpm --filter @grenishrai/expressive build
node packages/cli/dist/index.js init --registry ./apps/www/public/r --cwd ../my-app
```

## Motion

`tokens/motion.ts` is the single source of truth: Material's spring tokens
(spatial/effects × fast/default/slow) for the `expressive` and `standard`
schemes. State transitions (shape morph, switch handle, dialog enter/exit) are
CSS transitions whose `linear()` easing is sampled from those springs, so they
work without JavaScript. Imperative animation (ripple, `useMotion`) goes
through the adapter exported by `motion.ts`. To change engines, change that
one import, or point it at your own `my-motion.ts`.
`prefers-reduced-motion` and `motion="none"` turn motion off.

## Contributing

Bug reports, component requests and pull requests are welcome. Start with
[CONTRIBUTING.md](CONTRIBUTING.md); everyone taking part follows the
[Code of Conduct](CODE_OF_CONDUCT.md).

## Notes

- `@material/material-color-utilities@0.4.0` ships some extensionless ESM
  imports. They are patched here (`patches/`). In user apps, bundlers resolve
  them, and `init` generates the theme CSS at install time, so only runtime
  `ThemeProvider` use pulls the library in.
