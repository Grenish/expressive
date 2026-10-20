---
name: expressive-contributor
description: "Work on the Expressive repository itself (github.com/Grenish/expressive): the Material 3 Expressive component registry in packages/registry, the @grenishrai/expressive CLI in packages/cli, and the docs site in apps/www. Use when adding or changing an Expressive component, token, motion feature, CLI command or docs page, when writing registry tests, rebuilding the registry, or preparing a pull request to this repo. Not for apps that consume Expressive (use the expressive skill for those)."
---

# Contributing to Expressive

Expressive is source-first: the CLI copies these files into other people's projects, where people read and edit them.
Every line you write in `packages/registry/src` ends up in someone else's codebase. Optimize for readable,
conventional code over cleverness, and comment the *why*.

Read `CONTRIBUTING.md` at the repo root for the human version. This skill is the agent workflow, with the details
and pitfalls that file doesn't spell out. For the public API of existing components, the `expressive` skill's
`references/components.md` is generated from the docs data.

## Repository map

| Path | What |
| --- | --- |
| `packages/registry/src/components/*.tsx` | Components (one file each) |
| `packages/registry/src/tokens/*` | Color, typography, shape, motion, elevation, spacing, interaction, `theme.ts` |
| `packages/registry/src/lib/*` | `utils.ts` (`cn`), `spring.ts`, `use-motion.ts`, `use-fluid.ts`, adapters, `theme-provider.tsx` |
| `packages/registry/src/styles/` | `expressive.css` (generated `@theme` bridge) and `utilities.css` (`state-layer`, `focus-ring`, `rounded-pill`, `spring-*`, keyframes) |
| `packages/registry/registry.ts` | The manifest: every installable item, its files, npm deps and registry deps |
| `packages/registry/scripts/` | `build-shapes`, `build-styles`, `build-registry` (JSON to `apps/www/public/r`), `build-skills` (writes `skills/expressive/references/components.md`) |
| `packages/registry/test/` | Vitest + Testing Library + axe (jsdom) |
| `packages/cli` | The CLI (`init`, `add`, `theme`, `list`, `diff`) |
| `apps/www` | Next.js docs site; `lib/component-docs.ts` is the docs data for every component |
| `skills/` | Agent skills (this one, and `expressive` for consumers) |

## Commands

```bash
pnpm install
pnpm --filter @expressive/registry build   # shapes, styles, registry JSON, skills reference: run after any registry change
pnpm test                                  # registry + CLI tests
pnpm typecheck                             # every package
pnpm build                                 # everything, incl. the site, search index and llms.txt
pnpm --filter @expressive/www dev          # docs at http://localhost:3000 (check if one is already running first)
```

Run a single test file: `cd packages/registry && npx vitest run test/<file>.test.tsx`.

## Adding a component: the full checklist

A new component touches about ten files. Missing one usually still type-checks, so work through the list.

1. **Check Base UI first.** `packages/registry/node_modules/@base-ui/react/docs/react/components/<name>.md` has the
   API (props, data attributes, CSS variables). Build on the primitive when one exists (Menu, Tabs, Toolbar,
   ToggleGroup, Drawer, Toast, Separator, Select, Popover…). Read the Material 3 Expressive guidelines for the spec.
2. **Write `packages/registry/src/components/<name>.tsx`** following the conventions below.
3. **Add a manifest entry in `registry.ts`**: `name` (kebab-case), `type: "component"`, a one-line `description`,
   `files`, `dependencies` (`BASE_UI`, `CVA` constants, versioned ranges), `registryDependencies` (always `utils` and
   `styles`; `motion` if you import from `lib/use-motion` or `lib/use-fluid`; `ripple`; other components you import).
4. **Write tests** in `packages/registry/test/` (see Testing).
5. **Rebuild the registry**: `pnpm --filter @expressive/registry build`. This updates `apps/www/public/r/*.json`
   and the skills reference; commit both.
6. **Register it on the docs site:**
   - `apps/www/lib/site.ts`: a title in `titles` and the slug in one of `groups` (Actions, Selection & input,
     Navigation, Containment, Communication, following Material's categories).
   - `apps/www/lib/component-docs.ts`: `overview`, `usage`, `props` (tables per part), `accessibility`, optional
     `notes` and `guides` (long how-tos with code, rendered after Usage).
   - A demo function (in `apps/www/components/demos*.tsx`) and its entry in the `demos` map in `demos.tsx`. **The
     map ends with `} as const;`**: insert before that, or the page renders an undefined component and the build fails
     while `typecheck` still passes.
   - `apps/www/lib/seo.ts`: `componentDescriptions` (120–160 characters, specific) and `componentTaglines` (one line).
   - `apps/www/lib/og/art.tsx`: a `case "<name>":` in the social-card art (Satori rules: explicit `display: flex`
     on any element with several children, flexbox only, inline SVG; use `Glyph` shapes and the `c` color roles).
7. **Bump the component count everywhere** it appears (grep for the old number and its word form): `apps/www/app/page.tsx`
   (the stat and the components section title), `apps/www/app/docs/page.tsx` (two places), `apps/www/app/docs/why/page.tsx`
   (comparison table and a link tile), `README.md`, `packages/cli/README.md` (count and list), `CONTRIBUTING.md` (two places),
   `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/component_request.yml`, and the `expressive` skill
   (`SKILL.md` description and picker, `references/alternatives.md`).
8. **Verify** (see Verification), then commit.

## Component conventions

Match the existing files; `button.tsx`, `chip.tsx`, `menu.tsx`, `tabs.tsx` and `navigation-bar.tsx` are good models.

- **File header:** `"use client";` when it uses hooks, context or Base UI interactivity, then imports, then a block
  comment saying what the component is for and any non-obvious usage.
- **Imports** use `@/registry/...` (`@/registry/lib/utils`, `@/registry/components/ripple`). The CLI rewrites them.
- **Styling** with Tailwind token utilities only: role colors, `text-<role>`, `rounded-shape-*` / `rounded-pill`,
  `shadow-elevation-*`, `spring-*`. No hex, palette colors, pixel radii or hand-written durations. Arbitrary values
  are fine for layout math (`w-[calc(100vw-3.5rem)]`) and for referencing variables (`[--ex-control-height:2.5rem]`).
- **Variants** with `cva` when there are several axes (see `buttonVariants`); export the variants function so other
  components can reuse it (`fab-menu.tsx` reuses `fabVariants`).
- **`data-slot="<name>"`** on every rendered part; `data-motion={motion}` where a `motion` prop exists. State goes in
  `data-*` attributes (`data-selected=""`, `data-active=""`) so CSS variants can read it.
- **Props**: extend the Base UI part's props, `Omit` `className` and redeclare it as `string` (Base UI allows a
  function). Accept `motion?: MotionProp` on anything animated. Require accessible names in the types for icon-only
  controls (`{ "aria-label": string } | { "aria-labelledby": string }`).
- **Press feedback** for pressables: `state-layer focus-ring`, `useFluidPress(ref, motion, !disabled)`,
  `<Ripple motion={motion} disabled={disabled} />` as the last child, and `useComposedRef(local, ref)` to merge refs.
- **Links**: navigation items use `useRender` + `mergeProps` with `defaultTagName: "a"` so callers can pass
  `render={<Link />}` (see `navigation-bar.tsx`).
- **Shared state between parts**: a small React context (React 19 `<Context value>` provider syntax), e.g. variant in
  `tabs.tsx`, color in `menu.tsx`.
- **Popups**: `Portal` → `Positioner` (`z-50`, `collisionPadding`) → `Popup` with enter/exit on
  `data-starting-style` / `data-ending-style` and `origin-(--transform-origin)`.

### Corners that animate

- Never animate from `rounded-shape-full` (9999px springs badly). `test/shape-lint.test.ts` fails any `className=`,
  `cn(` or `cva(` region that mentions `border-radius` and `rounded-shape-full` together. Use `rounded-pill` with
  `--ex-control-height`.
- When some corners must stay pills while others change with state (connected buttons, split buttons), drive the
  four logical corner radii from variables (`--ex-corner-start`, `--ex-corner-end`) and change only
  `--ex-corner-inner` per state; see `button-group.tsx`. This avoids fights between `first:`, `active:` and
  `data-pressed:` variants, whose order in the generated CSS you don't control.
- tailwind-merge doesn't know `rounded-pill` or `rounded-shape-*`, so `cn()` won't dedupe them: conflicting radius
  classes resolve by stylesheet order. Don't rely on `className` overriding a radius from `cva`.

### Tailwind v4 notes

- Variant classes generate after plain ones, so `[&>*]:…` on a parent beats a child's own plain class of the same
  specificity. Selectors with attribute parts add specificity (`[&_[data-x][data-y]]:…`).
- `in-*`, `has-*`, `group-data-*/name` and arbitrary variants (`[tbody>&]:…`) all work; prefer a parent-level
  `[&>[data-slot=x]]:…` over `not-in-*` combinations.

## Testing

- One `describe` per component in `test/*.test.tsx`. Test **behavior**: keyboard (Tab, arrows, Enter, Space,
  Escape), ARIA state (`aria-pressed`, `aria-selected`, `aria-expanded`, `aria-current`, `aria-sort`), controlled
  and uncontrolled use, callbacks. Don't assert class names.
- Run axe on the rendered container (see `expectNoAxeViolations` in existing tests; color-contrast is disabled
  because jsdom has no layout).
- Portaled popups: `await screen.findByRole("menu" | "dialog")`; closing is async, so
  `await waitFor(() => expect(…).not.toBeInTheDocument())`.
- Base UI quirks seen in tests: `Toast.Close` is `aria-hidden` (query it with `getByLabelText`); menu `aria-expanded`
  updates after the click resolves (assert after `findBy…`); ToggleGroup single-select can be prevented from
  clearing by calling `details.cancel()` in `onValueChange`; Drawer reports `--drawer-swipe-progress: 1` at a partial
  snap point, so don't tie scrim opacity to it.
- `test/setup.ts` polyfills `PointerEvent` for jsdom.

## Verification

1. `pnpm typecheck`, `pnpm test`, `pnpm build` all pass. `build` is the only check that renders every docs page.
2. Look at the page in a real browser: light and dark (`.dark` on `<html>`), 390px wide with no horizontal page
   scroll, keyboard focus visible, popups opened and closed, and reduced motion. A dev server may already be running on
   port 3000; reuse it rather than starting another. Headless screenshots with Playwright work well for open states.
3. Check `skills/expressive/references/components.md` changed the way you expect (it's regenerated by the build).

## Docs-site details

- `rich()` in `apps/www/components/docs/prose.tsx` renders inline `` `code` `` and `[text](url)` in docs strings.
- `PropRow` tables: `{ name, type, default?, description }`. Reuse the `motionProp` and `className` rows.
- `pnpm build` in `apps/www` runs `scripts/postbuild.mjs`: search index, Markdown copies under `public/docs`
  (gitignored), `llms.txt` and `llms-full.txt`.

## Pull requests

- Branch from `main`; one topic per PR; fill in `.github/PULL_REQUEST_TEMPLATE.md`; light and dark screenshots for
  visual changes.
- Commit messages: short imperative summary ("Add a split button"), no `feat:`/`fix:` prefixes, a body explaining
  what and why when useful.
- Don't bump package versions or publish; the maintainer releases.
- New components or API changes: open an issue first to agree on the shape.
