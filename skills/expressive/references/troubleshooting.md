# Troubleshooting

Symptoms, causes and fixes. When something looks wrong, check the theme wiring first: most "unstyled" problems are a
missing import or an override.

## Setup

| Symptom | Cause | Fix |
| --- | --- | --- |
| `init`: "Could not find a CSS file with @import "tailwindcss"" | Tailwind v4 isn't set up, or the CSS file is somewhere unusual | Set up Tailwind v4, or `init --css src/styles/global.css` |
| Components render but look unthemed (no colors, wrong fonts) | `expressive.css` not imported, imported before Tailwind, or theme markers missing | Global CSS must be `@import "tailwindcss";` then `@import "./expressive.css";`, then the `expressive:theme` block. Re-run `theme` to rewrite the block |
| Body background or text color wrong | A starter template sets `body { background: …; color: … }` | Remove the template's body/root styles; Expressive's base layer sets `body` to `surface` / `on-surface` |
| Utilities like `bg-primary` do nothing | The class isn't generated: the file isn't scanned by Tailwind, or `expressive.css` isn't loaded | Make sure the file is inside Tailwind's sources; check the import order |
| Import errors (`@/components/expressive/...` not found) | Aliases in `expressive.json` don't match `tsconfig.json` `paths` | Fix `aliases` (or empty them for relative imports), then `add --overwrite` to rewrite imports |
| Next.js: "useState only works in Client Components" from an Expressive file | `rsc` was `false` when the files were added, so `"use client"` is missing | Set `"rsc": true` in `expressive.json` and re-add, or add `"use client"` to the file |
| Hook error from `useSnackbar` / `useToast` | Called outside its provider, or in a Server Component | Wrap the app in `SnackbarProvider` / `ToastProvider` (in a client providers file); call hooks in Client Components |
| Font doesn't change | The theme names a font the app never loads | Load it (`next/font`, `@font-face`, Fontsource) and pass its family or CSS variable to `theme --font` |

## Theme

| Symptom | Cause | Fix |
| --- | --- | --- |
| Manual CSS edits disappear | They were inside the `expressive:theme` markers | Move overrides below `/* expressive:theme:end */` |
| Dark mode doesn't switch | `.dark` isn't on an ancestor | Put `.dark` on `<html>` (next-themes: `attribute="class"`) |
| Flash of light theme on load | `.dark` added after hydration | Set the class before paint (next-themes, or an inline script in `<head>`) |
| Brand color looks different from the seed | The `expressive` variant reinterprets hues | Use `--variant fidelity` or `content` to stay close to the seed |
| Text contrast too low in custom UI | Container color without its `on-` pair, or a palette color | Use the matching `on-*` role; never mix roles across pairs |
| Runtime theme flickers or is slow | `createTheme` runs on every render | Memoize: `useMemo(() => createTheme(...), [seed])` |

## Motion

| Symptom | Cause | Fix |
| --- | --- | --- |
| Console warning, fluid doesn't wobble | Fluid scheme with the CSS engine | `theme --motion motion` (or `gsap`) |
| Pill corners snap or flash square while animating | `rounded-shape-full` (9999px) on an element whose radius animates | Use `rounded-pill` with `--ex-control-height` set to the element's height |
| An element jitters or animates twice in fluid mode | CSS transition and the fluid hook both animate `transform` | Add `fluid:transition-none` (or `fluid:transition-colors`) for the properties the hook drives |
| Nothing animates | OS reduced motion is on, or `motion="none"` | Expected; check the OS setting before debugging |
| Exit animation is cut off | The popup's transition isn't on the element Base UI watches | Put the `data-ending-style` transition on the popup/root element itself |

## Components

| Symptom | Cause | Fix |
| --- | --- | --- |
| TypeScript error on `IconButton` / `Fab` | Missing `aria-label` / `aria-labelledby` | Add one: icon-only controls need a name |
| Link styled as a button breaks navigation or nests `<a>` in `<button>` | Wrapping a component in `<a>` | Use `render={<a href />}` (or `render={<Link href />}`) and `nativeButton={false}` on buttons |
| Tooltip never shows | Its child doesn't accept a ref or isn't a single element | Pass one element that forwards refs (Expressive components do) |
| Menu, select or popover opens behind a header | A parent creates a stacking context with a higher `z-index` | Popups portal to `body` with `z-50`; lower the header's z-index or raise the popup with `className` |
| Table header doesn't stick | No height limit on the container | `stickyHeader` plus `containerProps={{ className: "max-h-96" }}` |
| Toast close button "missing" for screen readers | By design in Base UI | Keyboard users press F6 to reach toasts and Escape to dismiss |
| Two components look different from the docs | Local edits | `npx @grenishrai/expressive diff <name>` |

## Before asking the user

Gather: `expressive.json`, the global CSS (top imports and whether the theme markers exist), the component file in
question (it may have local edits), and the framework and Tailwind version from `package.json`.
