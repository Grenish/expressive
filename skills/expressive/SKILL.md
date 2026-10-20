---
name: expressive
description: "Build React interfaces with Expressive, the source-first Material 3 Expressive design system for React 19 and Tailwind CSS v4 (npm: @grenishrai/expressive, docs: expressive.grenishrai.pro). Use whenever a project has an expressive.json file, imports from components/expressive or lib/expressive, uses --ex-* CSS variables or utilities like bg-primary, text-title-large, rounded-shape-large, spring-spatial-fast; or when the user asks for Material 3 / Material You / M3 Expressive UI on the web, a Material-style React component library, a themed design system from one seed color, or spring-based motion in React. Covers setup and the CLI, picking the right component among 45, theming and tokens, motion (expressive, standard, fluid), accessibility rules, common app patterns, how Expressive compares to MUI, Material Web, shadcn/ui and others, and troubleshooting."
---

# Expressive

Expressive is a design system that copies **Material 3 Expressive** components, tokens and a spring-based
motion layer into a React project as source code. The project owns that code from then on: there's no runtime
UI package to upgrade, and every component is a readable `.tsx` file you can change.

- Stack: React 19, TypeScript, Tailwind CSS v4. Works with Next.js (App Router and Pages), Vite, React Router /
  Remix, TanStack Start and Astro (React islands).
- Behavior (keyboard, focus, ARIA) comes from [Base UI](https://base-ui.com) primitives. Styling comes from
  Expressive's tokens, exposed as Tailwind utilities.
- CLI: `npx @grenishrai/expressive <command>`. Docs: https://expressive.grenishrai.pro. Machine-readable docs:
  https://expressive.grenishrai.pro/llms-full.txt.

## How to use this skill

Read this file first. Load a reference only when the task needs it:

| Task | Read |
| --- | --- |
| Using or choosing a specific component, its props or accessibility | `references/components.md` (search for `## <Component name>`) |
| Installing, running the CLI, `expressive.json`, updating components | `references/setup-and-cli.md` |
| Colors, type, shape, elevation, spacing, state layers, `createTheme`, runtime theming, dark mode | `references/theming-and-tokens.md` |
| Animation, springs, motion schemes, fluid motion, engines, reduced motion | `references/motion.md` |
| Building screens: app shells, forms, lists, tables, notifications, overlays | `references/patterns.md` |
| "Why Expressive and not X?", picking a library, migrating from MUI or shadcn/ui | `references/alternatives.md` |
| Something looks or behaves wrong | `references/troubleshooting.md` |

## First, look at the project

Before writing UI code in a project:

1. **Check for `expressive.json`** at the project root. If it's missing, Expressive isn't set up: see
   `references/setup-and-cli.md` and run `init` (ask the user before choosing a seed color or font for them).
2. **Read `dirs` and `aliases` in `expressive.json`.** Components live in `dirs.components` (default
   `components/expressive/` or `src/components/expressive/`) and are imported through `aliases.components`
   (default `@/components/expressive`). If `aliases` is empty, imports are relative. Never invent a path.
3. **List what's installed**: the files in the components folder, or `npx @grenishrai/expressive list`. Add
   what's missing with `npx @grenishrai/expressive add <name> [...]`; it also adds what each component needs.
4. **Check the motion engine**: `"motion"` in `expressive.json` is `css`, `motion` or `gsap`. Fluid motion needs
   `motion` or `gsap`.

## Non-negotiables

These keep code consistent with the system and accessible. Follow them in every file you write.

1. **Use the installed components before writing your own.** A button is `<Button>`, not a styled `<button>`.
   If a component exists but isn't installed, `add` it rather than recreating it. See the picker below.
2. **Tokens, never raw values.** Colors are roles (`bg-primary`, `text-on-surface-variant`), never hex or Tailwind
   palette colors (`bg-blue-500`). Type is a role (`text-title-medium`), never `text-sm font-semibold`. Corners
   are `rounded-shape-*` or `rounded-pill`, never `rounded-lg` or `rounded-[12px]`. Shadows are
   `shadow-elevation-0…5`. Transition timing is `spring-spatial-*` / `spring-effects-*`, never `duration-300 ease-in-out`.
3. **Pair every container color with its `on-` color.** `bg-primary-container` goes with
   `text-on-primary-container`; `bg-surface-container` with `text-on-surface` or `text-on-surface-variant`. The
   pairs are generated to contrast in light and dark.
4. **Animated pills use `rounded-pill`, not `rounded-shape-full`.** `rounded-shape-full` is 9999px and springs
   badly (it snaps and can flash square). `rounded-pill` is half of `--ex-control-height`, so set
   `[--ex-control-height:…]` alongside the height (`h-(--ex-control-height)`). Static circles can use
   `rounded-shape-full`.
5. **Interactive custom elements get `state-layer focus-ring`.** These two utilities give hover, focus, press
   and drag feedback, plus a keyboard-only focus outline, from the interaction tokens. Don't hand-roll
   `hover:bg-…` overlays or `focus:ring-…`.
6. **Accessible names are required.** `IconButton`, icon-only `Fab`, `FabMenu` and icon-only `ConnectedButton`
   need `aria-label` (the types enforce it for icon buttons and FABs). Every `Dialog`, `AlertDialog`,
   `BottomSheet` and `SideSheet` needs a title component. `Carousel` needs an `aria-label`; `Avatar` needs `alt`. Wrap checkboxes, radios and switches in a `<label>`, and name groups
   (`aria-label` on `RadioGroup`, `ButtonGroup`, `ConnectedButtonGroup`, `Toolbar`, `TabsList`, `Table`).
7. **Don't break the Base UI wiring.** When editing a component file, keep its Base UI parts, `data-*`
   attributes and ARIA props intact. To render a component as another element (a link, a router `Link`), use the
   `render` prop: `<Button render={<a href="/docs" />} nativeButton={false}>Docs</Button>`. Don't wrap it in an
   `<a>`.
8. **Respect reduced motion for free.** Use the spring utilities and `useMotion`, which already respect
   `prefers-reduced-motion`. Don't add raw CSS keyframes for UI state changes.
9. **Next.js App Router:** component files start with `"use client"` (when `rsc` is true). They can be rendered
   from Server Components; hooks like `useSnackbar()` and `useToast()` must be called from Client Components.
10. **Owned code, so edit with care.** Users change these files. Before replacing a component with
    `add --overwrite`, run `npx @grenishrai/expressive diff <name>` and tell the user what local changes would be lost.

## Component picker

45 components. Full APIs are in `references/components.md`.

| Need | Use | Not |
| --- | --- | --- |
| Main action on a screen | `Button` (filled) | a FAB, unless it's the screen's single primary action |
| Secondary / low-emphasis action | `Button` tonal, outlined or text | |
| On/off action with a label | `ToggleButton` | `Switch` (that's for settings) |
| Icon-only action | `IconButton` / `ToggleIconButton` | `Button` with only an icon |
| A few related actions side by side | `ButtonGroup` | loose buttons with margins |
| Pick one or several of 2–5 options inline (segmented control) | `ConnectedButtonGroup` | radio buttons for compact views |
| Main action plus a few variants of it ("Send" / "Schedule send") | `SplitButton` | a button next to a menu button |
| The screen's most important action, floating | `Fab` (extended with `label`) | |
| One floating entry point to 2–6 creation actions | `FabMenu` | a FAB that opens a dialog |
| Actions for the current page, floating or at the bottom | `Toolbar` | a row of icon buttons in a div |
| Filters, suggestions, tags, entered values | `FilterChip`, `SuggestionChip`, `AssistChip`, `InputChip` | toggle buttons |
| A list of choices from a button | `Menu` (+ `MenuCheckboxItem`, `MenuRadioItem`, submenus) | a popover with buttons |
| Boolean setting | `Switch` (instant) or `Checkbox` (in forms, multi-select) | |
| One of several, all visible | `RadioGroup` | `Menu` (hides the options) |
| One of many options in a form field | `Select` (filled or outlined, like `TextField`) | a `Menu` from a button |
| A date or a date range in a form | `DatePicker` / `DateRangePicker` | a raw `<input type="date">` |
| An always-visible month grid | `Calendar` (react-day-picker underneath) | a hand-built grid |
| A value in a range | `Slider` | |
| Text input | `TextField` (filled or outlined) | raw `<input>` |
| Bottom navigation, 3–5 destinations, compact screens | `NavigationBar` | tabs |
| Side navigation, medium+ screens | `NavigationRail` (expandable) | |
| Many destinations, or labelled sections | `NavigationDrawer` / `ModalNavigationDrawer` | |
| A desktop app shell: side panel that collapses to an icon rail, drawer on phones, ⌘B | `Sidebar` + `SidebarProvider` + `SidebarInset` | rail and drawer wired up by hand |
| Views at the same level inside one page | `Tabs` | navigation bar |
| Where a page sits in a hierarchy | `Breadcrumb` | a row of links with slashes |
| Pages of results | `Pagination` (buttons, or links with `getHref`) | hand-rolled number buttons |
| Page title, back/menu button and actions | `TopAppBar` | |
| Grouped content block | `Card` | a div with a border |
| Sections that expand and collapse (FAQ, settings groups) | `Accordion` | disclosure buttons by hand |
| A person's or entity's picture, with initials fallback | `Avatar`, `AvatarGroup` | an `<img>` in a rounded div |
| A sideways row of visual items | `Carousel` (`multi-browse`, `hero`, `uncontained`) | an overflow div with arrows |
| A copyable code snippet | `CodeBlock` (plain, or Shiki HTML) | a bare `<pre>` |
| Rows of items with icons, text and controls | `List` (standard or segmented) | stacked cards |
| Records in rows and columns | `Table` (pair with TanStack Table for logic) | a list |
| Thin separator | `Divider` | `border-t` on random elements |
| Small dot or count on an icon | `Badge` + `BadgeAnchor` | |
| Ask to confirm, or a short focused task | `Dialog` | |
| Confirm something consequential (delete, discard) | `AlertDialog` (no outside-click dismiss) | `Dialog` |
| A message that stays until resolved (sync failed, plan expiring) | `Alert` | a toast (disappears) |
| Secondary content from the bottom (share, options) | `BottomSheet` | a dialog on mobile |
| Filters or details from the side | `SideSheet` | |
| One brief message, maybe with an action ("Undo") | `useSnackbar()` | toast |
| Several notifications, titles, types, promise progress | `useToast()` | snackbar |
| Short label on hover/focus | `Tooltip`; with title and actions, `RichTooltip` | the only place important info lives |
| Known progress or an indeterminate wait | `LinearProgress`, `CircularProgress` | |
| Branded "loading" moment | `Loading` (the shape-morph indicator and five more) | spinners from elsewhere |
| Decorative or masked Material shapes | `Shape`, `shape-*` mask utilities | custom SVG blobs |

## The token vocabulary (cheat sheet)

Full lists and values: `references/theming-and-tokens.md`.

- **Color roles** (`bg-*`, `text-*`, `border-*`, `fill-*`…): `primary`, `on-primary`, `primary-container`,
  `on-primary-container`, the same for `secondary`, `tertiary` and `error`; surfaces `surface`, `surface-dim`,
  `surface-bright`, `surface-container-lowest|low||high|highest`, `on-surface`, `on-surface-variant`; `outline`,
  `outline-variant`, `inverse-surface`, `inverse-on-surface`, `inverse-primary`, `scrim`, `shadow`. Opacity
  modifiers work: `bg-scrim/32`.
- **Type roles**: `text-{display|headline|title|body|label}-{large|medium|small}`, each with `-emphasized`.
  One utility sets size, line height, tracking and weight.
- **Corners**: `rounded-shape-{none|extra-small|small|medium|large|large-increased|extra-large|extra-large-increased|extra-extra-large|full}`
  (0, 4, 8, 12, 16, 20, 28, 32, 48px, full), plus `rounded-pill`, and `corner-squircle` / `corner-cut`.
- **Elevation**: `shadow-elevation-0` to `shadow-elevation-5`. Prefer a stronger surface over a shadow for static content.
- **Spacing**: `p-ex-md`, `gap-ex-sm`… (`3xs` 2, `2xs` 4, `xs` 8, `sm` 12, `md` 16, `lg` 24, `xl` 32, `2xl` 48,
  `3xl` 64px). Tailwind's own spacing scale works too; be consistent within a file.
- **Motion**: `transition-[…] spring-spatial-{fast|default|slow}` for movement, size and shape (may overshoot);
  `spring-effects-{fast|default|slow}` for color and opacity (never overshoots).
- **Interaction**: `state-layer`, `focus-ring`; disabled content at `opacity-(--ex-disabled-content)`.
- **Variables**: everything is also a CSS variable: `--ex-color-primary`, `--ex-type-title-large-size`,
  `--ex-shape-corner-large`, `--ex-spring-spatial-fast-duration`, `--ex-state-hover`…

## A correct custom component

When nothing in the library fits, build with the same vocabulary:

```tsx
import { cn } from "@/lib/expressive/utils";

export function TripCard({ title, dates, selected, onSelect }: TripCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "state-layer focus-ring flex w-full flex-col gap-1 rounded-shape-large p-4 text-start",
        "bg-surface-container text-on-surface transition-[border-radius,background-color] spring-spatial-fast",
        "active:rounded-shape-medium aria-pressed:bg-secondary-container aria-pressed:text-on-secondary-container",
      )}
    >
      <span className="text-title-medium">{title}</span>
      <span className="text-body-medium text-on-surface-variant">{dates}</span>
    </button>
  );
}
```

What makes it right: a real `<button>`, state through `aria-pressed`, role-paired colors, a type role, token
corners that morph on press, spring timing, `state-layer focus-ring`, and `cn()` (tailwind-merge that knows the
type roles) for merging classes.

## Before you finish

- [ ] Only installed (or newly added) Expressive components and token utilities; no hex, palette colors, raw radii or durations.
- [ ] Every icon-only control, dialog, sheet, group and form control has an accessible name.
- [ ] Light and dark both work (dark applies under `.dark` on an ancestor).
- [ ] Keyboard: Tab reaches every control, the focus ring shows, Escape closes overlays.
- [ ] No horizontal scrolling at 390px wide; wide tables scroll inside their container.
- [ ] If you changed a component file, its Base UI parts and ARIA attributes are intact, and you told the user.
