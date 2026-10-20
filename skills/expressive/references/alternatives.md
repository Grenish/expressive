# Expressive vs the alternatives

Use this when someone asks "why Expressive and not X?", when choosing a UI library for a new React project, or when
migrating. Be honest with the user: Expressive is the right call for some projects and the wrong one for others, and
the "When X is the better choice" lines are as important as the rest.

Status claims about other projects are as of **October 2026**; check the linked sources if it matters. The public,
shorter version of this page is https://expressive.grenishrai.pro/docs/why.

## What Expressive is, in one paragraph

Material 3 **Expressive** (the 2025 evolution of Material You: shape morphing, spring physics, button groups, split
buttons, FAB menus, floating toolbars, the shape-morph loading indicator, 35 expressive shapes) implemented for React
19 + Tailwind CSS v4, delivered as **source code copied into your project** by a CLI. Behavior and accessibility come
from Base UI primitives; a whole color scheme is generated from one seed color with Google's
`material-color-utilities`; motion runs on CSS by default, or on Motion or GSAP. It's MIT licensed and isn't a Google
project.

## Quick decision guide

| If the project needs… | Prefer |
| --- | --- |
| Material 3 Expressive on the web, in React + Tailwind | **Expressive** |
| Code you own and can edit, Material look | **Expressive** |
| A neutral, unbranded look and the largest copy-paste ecosystem | shadcn/ui |
| Enterprise data grid, date/time pickers, charts with commercial support | MUI (Material UI + MUI X), or Mantine / Ant Design |
| Material Design 2 look, or an existing MUI codebase | MUI |
| Material on Android | Jetpack Compose Material 3 |
| Material in Flutter | Flutter's Material 3 |
| Material in Angular | Angular Material |
| Framework-agnostic web components with Material styling | Material Web (but see its maintenance status) |
| Your own design system, just accessible behavior | Base UI, Radix or React Aria directly |
| No Tailwind, or React < 19 | Not Expressive (it requires both) |

## Expressive vs MUI (Material UI)

**What MUI is:** the most widely used React component library, with a runtime npm package, its own styling
engine (Emotion, `sx` prop, `styled()`), a very large component set and MUI X (DataGrid, date and time pickers,
charts, tree view; advanced features are commercial).

**Design language:** Material UI implements **Material Design 2**. Material Design 3 support has been planned for
years but hasn't shipped; MUI's 2026 roadmap post focuses on maintaining Material UI, Base UI and drafting v8,
without committing to M3 ([MUI: 2026 and beyond](https://mui.com/blog/2026-and-beyond/)). So MUI can't give you M3
Expressive's shape morphing, spring motion, tonal surfaces or the new components without heavy theming work.

| | Expressive | MUI |
| --- | --- | --- |
| Design spec | M3 Expressive | Material Design 2 (themeable) |
| Delivery | Source copied in; you own it | npm package; you override it |
| Styling | Tailwind v4 utilities over CSS variables | Emotion CSS-in-JS (`sx`, `styled`) |
| Theme | One seed color → full light/dark scheme (HCT) | Palette object you define |
| Motion | Spring tokens, three schemes, swappable engine | Duration/easing transitions |
| Behavior | Base UI primitives | MUI's own implementation |
| Component count | 45, growing | Very large, plus MUI X |
| Updates | Deliberate (`diff`, then `add --overwrite`) | `npm update`; breaking majors |
| Support | Open source, single maintainer | Company-backed, paid tiers |

**Why Expressive instead:** you want the current Material spec; you use Tailwind and don't want a second styling
system; you want to read and change component code (and let AI agents do so) instead of fighting overrides; you
care about bundle size and server rendering (most motion is CSS, no CSS-in-JS runtime).

**When MUI is the better choice:** you need DataGrid-class tables, date/time pickers, autocomplete, tree views or
charts now; the codebase is already on MUI; the team doesn't use Tailwind; you need vendor support or SLAs.

**Mixing:** possible but discouraged in one screen: two theme systems and two visual languages. For tables, prefer
Expressive's `Table` + TanStack Table over pulling in MUI X.

## Expressive vs Material Web (@material/web)

**What it is:** Google's official Material 3 web components (Lit), framework-agnostic.

**Status:** in **maintenance mode since June 2024**: "not deprecated or going away", but not actively staffed, with no
new features or components planned and PRs reviewed only case by case
([announcement](https://github.com/material-components/material-web/discussions/5642)). It predates M3 Expressive, so
it has none of the Expressive components or motion.

**Why Expressive instead:** M3 Expressive rather than baseline M3; active development; React-native APIs instead of
custom elements; styling through Tailwind utilities instead of per-component CSS custom properties and shadow DOM
parts; source you can change.

**When Material Web is the better choice:** you need web components that work across frameworks (or no framework),
and baseline M3 with minimal maintenance is acceptable.

## Expressive vs shadcn/ui

**What it is:** the project that popularized copy-the-source components: a CLI and registry, headless
primitives (Radix-based by default), Tailwind, a deliberately neutral look you restyle, and a huge ecosystem of community registries and blocks.

**Same model, different goal.** Expressive works the way shadcn/ui does (CLI, registry, source in your repo, `cn()`),
but ships a complete **design language** instead of a neutral starting point:

| | Expressive | shadcn/ui |
| --- | --- | --- |
| Look | Material 3 Expressive, opinionated | Neutral; you design it |
| Color | Generated from one seed: 40+ roles, light/dark, contrast levels | A handful of hand-picked CSS variables |
| Type, shape, elevation, spacing, state layers | Full token systems as utilities | Up to you |
| Motion | Spring tokens, schemes, engines, reduced motion built in | CSS animations per component |
| Material components | Button groups, split button, FAB, FAB menu, toolbars, navigation bar/rail/drawer, shape loader… | Not Material; different set |
| Ecosystem | Young | Very large (blocks, charts, community registries) |

**Why Expressive instead:** you want a coherent, recognizable system (Material) without designing tokens, motion and
states yourself; you want one-color theming that stays accessible in light, dark and high contrast; you want
Material's navigation patterns and the new Expressive components.

**When shadcn/ui is the better choice:** the brand needs its own look rather than Material; you want its blocks,
charts and community components; the team already knows it.

**Mixing:** avoid installing both into one app. Both define Tailwind color names like `primary` and `secondary` with
different meanings and variables, so whichever stylesheet loads last silently restyles the other's components.

## Expressive vs headless libraries (Base UI, Radix, React Aria)

These give behavior and accessibility with no styling. Expressive **is** Base UI underneath, plus Material tokens,
styling and motion. Use a headless library directly when you have your own design system and designers to define it;
use Expressive when you want Material done for you, and drop down to Base UI for anything Expressive doesn't cover
(it's already a dependency).

## Expressive vs Mantine, Chakra UI, Ant Design

Runtime component libraries, each with its own design language and styling approach (Mantine: CSS modules + many
hooks and extensions; Chakra: style props; Ant Design: an enterprise design language with very rich data components).
Choose them for their breadth (date pickers, rich text, notifications, data-heavy admin UIs) or if you like their
look. Choose Expressive for Material 3 Expressive specifically, Tailwind-native styling and owned source.

## Expressive vs native Material (Jetpack Compose, Flutter, Angular Material)

- **Jetpack Compose Material 3** is where Google builds M3 Expressive for Android. Expressive's web components
  follow the same published spec, so an Android app in Compose and a web app in Expressive can share a seed color
  and feel like one product.
- **Flutter** has its own Material 3 implementation; use it for Flutter apps (including Flutter web).
- **Angular Material** implements M3 theming for Angular; Expressive is React-only.

## Expressive vs building Material 3 yourself on Tailwind

Doing it by hand means re-creating: the HCT color pipeline and 40+ roles in light, dark and contrast levels; 15 type
roles × emphasized; the corner scale and morphing pills that don't snap; state layers and focus rings; spring
physics sampled into CSS `linear()` easing with reduced-motion handling; Base UI wiring for every component; and
keeping all of that consistent. Expressive is that work, done once, as code you can still edit.

## Honest limitations

Tell users about these when they matter to their project:

- **Young and small.** 45 components and growing, maintained by one person.
- **React 19 + Tailwind v4 only.** No React 18, no other frameworks' components, no non-Tailwind styling.
- **Updates are manual.** Owned code means no automatic fixes: use `diff` to pull improvements deliberately.
- **Not official.** Inspired by Material Design, not affiliated with Google; it follows the published guidelines but
  can differ in details.
- **Fluid motion costs JavaScript** (the Motion or GSAP engine and per-frame work); the default CSS engine doesn't.

## Migrating from MUI

| MUI | Expressive |
| --- | --- |
| `<Button variant="contained">` | `<Button>` (filled) or `variant="tonal"` for secondary |
| `<Button variant="outlined">` / `"text"` | `variant="outlined"` / `variant="text"` |
| `<IconButton>` | `<IconButton aria-label>` (label required) |
| `<ButtonGroup>` / `<ToggleButtonGroup>` | `<ButtonGroup>` / `<ConnectedButtonGroup>` |
| `<Fab>` / `<SpeedDial>` | `<Fab>` / `<FabMenu>` |
| `<Chip>` | `AssistChip`, `FilterChip`, `InputChip` or `SuggestionChip` by purpose |
| `<TextField variant="filled|outlined">` | `<TextField variant="filled|outlined">`, with `invalid` + `errorText` |
| `<Checkbox>`, `<Radio>`/`<RadioGroup>`, `<Switch>`, `<Slider>` | Same names; wrap in `<label>` instead of `FormControlLabel` |
| `<Select>` / `<Menu>` | `<Menu>` with `MenuRadioGroup` for single choice (or Base UI `Select` styled with tokens) |
| `<Tabs>`/`<Tab>` | `<Tabs>`, `<TabsList>`, `<Tab>`, `<TabsPanel>` |
| `<AppBar>` + `<Toolbar>` | `<TopAppBar>` (title, navigation, actions); `<Toolbar>` is the M3 floating/docked toolbar, a different thing |
| `<BottomNavigation>` | `<NavigationBar>` |
| `<Drawer variant="permanent">` / `"temporary"` | `<NavigationDrawer>` / `<ModalNavigationDrawer>` (navigation) or `<SideSheet>` (content) |
| `<SwipeableDrawer anchor="bottom">` | `<BottomSheet>` |
| `<Dialog>` | `<Dialog>`, `<DialogContent>`, `<DialogTitle>`… |
| `<Snackbar>` / notistack | `useSnackbar()` / `useToast()` |
| `<Tooltip title>` | `<Tooltip content>` |
| `<Card>`, `<List>`, `<Divider>`, `<Badge>` | Same names; `Badge` uses `BadgeAnchor` |
| `<LinearProgress>`, `<CircularProgress>` | Same names; `value={null}` for indeterminate |
| `<Table>` / DataGrid | `<Table>` + TanStack Table |
| `sx={{ … }}`, `styled()` | Tailwind classes with token utilities; `cn()` to merge |
| `theme.palette.primary.main` | `bg-primary` / `var(--ex-color-primary)` |
| `theme.typography.h6` | `text-title-large` (map by role, not by number) |
| `theme.shape.borderRadius` | `rounded-shape-*` scale |
| `ThemeProvider` + `createTheme` | CLI theme (static), or Expressive's `createTheme` + `ThemeProvider` for runtime themes |

Migrate screen by screen, not all at once; don't render MUI and Expressive components side by side in one view.

## Migrating from shadcn/ui

| shadcn/ui | Expressive |
| --- | --- |
| `Button` `default` / `secondary` / `outline` / `ghost` / `link` | `filled` / `tonal` / `outlined` / `text` / `text` (or a styled link) |
| `Button variant="destructive"` | No destructive variant: `className="bg-error text-on-error"`, and confirm in a `Dialog` |
| `DropdownMenu` | `Menu` |
| `Dialog`, `AlertDialog` | `Dialog` |
| `Sheet` / `Drawer` (vaul) | `SideSheet` / `BottomSheet` |
| `Sonner` / `Toast` | `useToast()` (stacked) or `useSnackbar()` (single, Material) |
| `Tabs`, `Table`, `Tooltip`, `Switch`, `Checkbox`, `RadioGroup`, `Slider`, `Separator` | `Tabs`, `Table`, `Tooltip`, `Switch`, `Checkbox`, `RadioGroup`, `Slider`, `Divider` |
| `Input` + `Label` | `TextField` (label built in) |
| `ToggleGroup` | `ConnectedButtonGroup` |
| `Badge` (a small label pill) | Not Expressive's `Badge`, which is a notification dot or count. Use a chip, or a span with `rounded-shape-small bg-secondary-container text-label-medium text-on-secondary-container` |
| `bg-primary text-primary-foreground` | `bg-primary text-on-primary` |
| `bg-muted text-muted-foreground` | `bg-surface-container text-on-surface-variant` |
| `border-border`, `bg-background`, `text-foreground` | `border-outline-variant`, `bg-surface`, `text-on-surface` |
| `rounded-md` / `rounded-lg` | `rounded-shape-small` / `rounded-shape-medium` (check the design) |

Remove shadcn's color variables and `components.json` once migrated, so the two `primary` definitions don't collide.
