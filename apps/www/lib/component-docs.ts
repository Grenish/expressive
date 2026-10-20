import type { PropRow } from "@/components/docs/prose";

export interface ComponentDoc {
  /** One-paragraph explanation of when to use it. */
  overview: string;
  usage: string;
  /** Named prop tables, e.g. { Button: [...], ToggleButton: [...] }. */
  props: Record<string, PropRow[]>;
  accessibility: string[];
  notes?: string[];
  /** Longer how-tos shown after Usage, each under its own heading. */
  guides?: Array<{ title: string; intro: string[]; code: string; tips?: string[] }>;
}

const motionProp: PropRow = {
  name: "motion",
  type: '"expressive" | "standard" | "fluid" | "none"',
  default: "theme default",
  description: "Motion scheme for this component's transitions. `none` turns animation off.",
};

const className: PropRow = { name: "className", type: "string", description: "Extra classes, merged with tailwind-merge." };

export const componentDocs: Record<string, ComponentDoc> = {
  button: {
    overview:
      "Buttons start actions. Pick the variant by emphasis: filled for the primary action on a screen, tonal for secondary actions, outlined and text for lower emphasis, elevated when the button sits on a busy background. Corners spring toward square while pressed; as toggles, they swap between round and square.",
    usage: `import { Button, ToggleButton } from "@/components/expressive/button";

export function Actions() {
  return (
    <div className="flex gap-2">
      <Button>Save</Button>
      <Button variant="outlined" icon={<DownloadIcon />}>Export</Button>
      <ToggleButton variant="tonal" defaultPressed>Bold</ToggleButton>
    </div>
  );
}`,
    props: {
      Button: [
        { name: "variant", type: '"filled" | "tonal" | "outlined" | "text" | "elevated"', default: '"filled"', description: "Visual emphasis." },
        { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"sm"', description: "Height from 32px (xs) to 136px (xl). Type and icon size scale with it." },
        { name: "shape", type: '"round" | "square"', default: '"round"', description: "Resting corner shape." },
        { name: "icon", type: "ReactNode", description: "Leading icon, sized automatically." },
        motionProp,
        { name: "render", type: "ReactElement", description: "Render as another element, e.g. `<a href>` (set `nativeButton={false}`)." },
        className,
      ],
      ToggleButton: [
        { name: "pressed / defaultPressed", type: "boolean", description: "Selected state (controlled / uncontrolled)." },
        { name: "onPressedChange", type: "(pressed: boolean) => void", description: "Called when the selection changes." },
        { name: "…", type: "", description: "Accepts every Button prop above." },
      ],
    },
    accessibility: [
      "Renders a native `<button>`; Enter and Space activate it.",
      "ToggleButton sets `aria-pressed`, so screen readers announce it as a toggle.",
      "Focus ring only appears for keyboard focus (`:focus-visible`).",
      "Disabled buttons keep their label legible at the disabled-content opacity.",
    ],
    notes: [
      "Round buttons use `rounded-pill` (half the control height) so the press morph stays smooth. If you override the height, also set `--ex-control-height`.",
    ],
  },
  "icon-button": {
    overview:
      "Icon buttons perform compact actions where an icon is enough: toolbars, app bars, cards. Choose from four styles and three widths; use the toggle version for on/off actions like favorite.",
    usage: `import { IconButton, ToggleIconButton } from "@/components/expressive/icon-button";

<IconButton aria-label="Search">
  <SearchIcon />
</IconButton>

<ToggleIconButton aria-label="Favorite" variant="filled">
  <HeartIcon />
</ToggleIconButton>`,
    props: {
      IconButton: [
        { name: "aria-label", type: "string", description: "Required (or `aria-labelledby`): there is no visible text. Enforced by the types." },
        { name: "variant", type: '"standard" | "filled" | "tonal" | "outlined"', default: '"standard"', description: "Visual emphasis." },
        { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"sm"', description: "Container height, 32–136px." },
        { name: "width", type: '"narrow" | "default" | "wide"', default: '"default"', description: "Container width relative to its height." },
        { name: "shape", type: '"round" | "square"', default: '"round"', description: "Resting corner shape." },
        motionProp,
        className,
      ],
      ToggleIconButton: [
        { name: "pressed / defaultPressed", type: "boolean", description: "Selected state." },
        { name: "onPressedChange", type: "(pressed: boolean) => void", description: "Called when the selection changes." },
      ],
    },
    accessibility: [
      "The accessible name is required at the type level, so icon-only buttons can't ship unlabelled.",
      "Pair with a Tooltip to show the name visually on hover and focus.",
      "Toggle icon buttons expose `aria-pressed`.",
    ],
  },
  fab: {
    overview:
      "A floating action button holds the single most important action on a screen. It comes in three sizes; give it a `label` to make an extended FAB when the icon alone isn't clear enough.",
    usage: `import { Fab } from "@/components/expressive/fab";

<Fab icon={<EditIcon />} aria-label="Compose" />
<Fab icon={<EditIcon />} label="Compose" size="medium" color="tertiary-container" />`,
    props: {
      Fab: [
        { name: "icon", type: "ReactNode", description: "The icon." },
        { name: "label", type: "ReactNode", description: "Visible label. Makes it an extended FAB. Without it, `aria-label` is required." },
        { name: "size", type: '"default" | "medium" | "large"', default: '"default"', description: "56, 80 or 96px." },
        { name: "color", type: '"primary-container" | "secondary-container" | "tertiary-container" | "primary" | "secondary" | "tertiary" | "surface"', default: '"primary-container"', description: "Container color role." },
        motionProp,
        className,
      ],
    },
    accessibility: [
      "Renders a native button with a required accessible name.",
      "Use one FAB per screen so its action is unambiguous.",
    ],
  },
  chip: {
    overview:
      "Chips are compact elements for actions, filters, suggestions and entities. Assist chips trigger a related action, suggestion chips offer generated replies, filter chips toggle a filter on or off, and input chips represent something the user entered (with a remove button).",
    usage: `import { AssistChip, FilterChip, InputChip, SuggestionChip } from "@/components/expressive/chip";

<AssistChip icon={<CalendarIcon />}>Add to calendar</AssistChip>
<SuggestionChip>Sounds good</SuggestionChip>
<FilterChip defaultPressed>Vegetarian</FilterChip>
<InputChip onRemove={() => remove(id)}>Ada Lovelace</InputChip>`,
    props: {
      "AssistChip / SuggestionChip": [
        { name: "icon", type: "ReactNode", description: "Leading icon." },
        { name: "appearance", type: '"outlined" | "elevated"', default: '"outlined"', description: "Use elevated on images or busy backgrounds." },
        motionProp,
      ],
      FilterChip: [
        { name: "pressed / defaultPressed", type: "boolean", description: "Whether the filter is applied." },
        { name: "onPressedChange", type: "(pressed: boolean) => void", description: "Called when toggled." },
        { name: "icon", type: "ReactNode", description: "Optional leading icon, replaced by the check mark when selected." },
      ],
      InputChip: [
        { name: "onRemove", type: "() => void", description: "Shows a remove button. Also fires on Backspace/Delete when it's focused." },
        { name: "removeLabel", type: "string", default: '"Remove {label}"', description: "Accessible name of the remove button." },
        { name: "icon", type: "ReactNode", description: "Avatar or icon." },
        { name: "selected", type: "boolean", description: "Selected appearance." },
      ],
    },
    accessibility: [
      "Assist, suggestion and filter chips are native buttons; filter chips expose `aria-pressed`.",
      "The input chip's remove button has its own accessible name, e.g. “Remove Ada Lovelace”.",
    ],
  },
  checkbox: {
    overview:
      "Checkboxes let people select one or more options from a list, or turn a single setting on or off when a switch would be too strong. Checking pops the box, softens its corners and draws the check in.",
    usage: `import { Checkbox } from "@/components/expressive/checkbox";

<label className="flex items-center gap-1">
  <Checkbox defaultChecked /> Email me about updates
</label>

<Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={selectAll} />`,
    props: {
      Checkbox: [
        { name: "checked / defaultChecked", type: "boolean", description: "Checked state (controlled / uncontrolled)." },
        { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called when toggled." },
        { name: "indeterminate", type: "boolean", default: "false", description: "Shows a dash for a partially selected group." },
        { name: "disabled", type: "boolean", description: "Prevents interaction." },
        { name: "name / value", type: "string", description: "Submitted with forms." },
        motionProp,
      ],
    },
    accessibility: [
      "Exposes `role=\"checkbox\"` and `aria-checked` (including `mixed` when indeterminate).",
      "Space toggles it. Wrap it in a `<label>` so the text is its accessible name and a larger click target.",
      "Inside an invalid Base UI Field, it switches to the error color.",
    ],
  },
  "radio-group": {
    overview: "Radio buttons let people pick exactly one option from a short list. Show all options when there are few; use a menu or select for long lists.",
    usage: `import { Radio, RadioGroup } from "@/components/expressive/radio-group";

<RadioGroup aria-labelledby="shipping" defaultValue="standard">
  <label><Radio value="standard" /> Standard</label>
  <label><Radio value="express" /> Express</label>
</RadioGroup>`,
    props: {
      RadioGroup: [
        { name: "value / defaultValue", type: "unknown", description: "The selected value." },
        { name: "onValueChange", type: "(value) => void", description: "Called when the selection changes." },
        { name: "aria-labelledby / aria-label", type: "string", description: "Names the group." },
        { name: "disabled", type: "boolean", description: "Disables every option." },
      ],
      Radio: [
        { name: "value", type: "unknown", description: "Value this option represents." },
        { name: "disabled", type: "boolean", description: "Disables this option." },
        motionProp,
      ],
    },
    accessibility: [
      "Arrow keys move the selection; Tab moves into and out of the group as one stop.",
      "Give the group a name with `aria-labelledby` pointing at a visible heading.",
    ],
  },
  slider: {
    overview:
      "Sliders pick a value or range from a continuous scale. The M3 Expressive slider has a thick track and a bar-shaped handle that narrows while you drag it.",
    usage: `import { Slider } from "@/components/expressive/slider";

<Slider defaultValue={40} thumbLabels={["Volume"]} />
<Slider defaultValue={[20, 80]} thumbLabels={["Minimum price", "Maximum price"]} />`,
    props: {
      Slider: [
        { name: "value / defaultValue", type: "number | number[]", description: "One number for a single thumb, an array for a range." },
        { name: "onValueChange", type: "(value) => void", description: "Called while dragging." },
        { name: "min / max / step", type: "number", default: "0 / 100 / 1", description: "Range and granularity." },
        { name: "thumbLabels", type: "string[]", description: "Accessible names for each thumb." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout direction." },
        { name: "disabled", type: "boolean", description: "Prevents interaction." },
        motionProp,
      ],
    },
    accessibility: [
      "Each thumb is a `role=\"slider\"` input with `aria-valuenow`, `min` and `max`.",
      "Arrow keys step by `step`; Page Up/Down and Home/End jump.",
      "Name every thumb with `thumbLabels` (or `aria-labelledby` on the slider).",
    ],
    notes: [
      "The gap around the handle is a ring in `--ex-slider-gap-color` (default `surface`). Set it to the background color when the slider sits on another surface.",
    ],
  },
  switch: {
    overview: "Switches turn a single setting on or off immediately, like Wi-Fi. Use a checkbox instead when the change only applies after saving a form.",
    usage: `import { Switch } from "@/components/expressive/switch";

<label className="flex items-center gap-4">
  <Switch defaultChecked /> Wi-Fi
</label>

<Switch icons checked={dark} onCheckedChange={setDark} />`,
    props: {
      Switch: [
        { name: "checked / defaultChecked", type: "boolean", description: "On state." },
        { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called when toggled." },
        { name: "icons", type: "boolean", default: "false", description: "Show check and close icons in the handle." },
        { name: "disabled", type: "boolean", description: "Prevents interaction." },
        motionProp,
      ],
    },
    accessibility: ["Exposes `role=\"switch\"` with `aria-checked`; Space toggles it.", "Label it with a wrapping `<label>` or `aria-label`."],
  },
  "text-field": {
    overview:
      "Text fields let people enter and edit text. Filled fields carry more visual emphasis, outlined fields less; pick one style and use it throughout a form. The label floats up when the field is focused or filled.",
    usage: `import { TextField } from "@/components/expressive/text-field";

<TextField label="Email" type="email" supportingText="We'll never share it" />
<TextField label="Search" variant="outlined" leadingIcon={<SearchIcon />} />
<TextField label="Name" invalid errorText="Enter your name" />`,
    props: {
      TextField: [
        { name: "label", type: "string", description: "Required visible label, wired to the input." },
        { name: "variant", type: '"filled" | "outlined"', default: '"filled"', description: "Container style." },
        { name: "supportingText", type: "ReactNode", description: "Helper text below the field, announced as its description." },
        { name: "invalid", type: "boolean", description: "Error state." },
        { name: "errorText", type: "ReactNode", description: "Replaces the supporting text while invalid." },
        { name: "leadingIcon / trailingIcon", type: "ReactNode", description: "Icons inside the container." },
        { name: "labelBackground", type: "string", default: "surface", description: "Outlined only: the color behind the field, used for the label's cut-out." },
        { name: "…", type: "input props", description: "Everything else (`value`, `onChange`, `type`, `name`…) goes to the input." },
      ],
    },
    accessibility: [
      "Built on Base UI Field: the label, description and error are linked to the input automatically.",
      "Invalid fields set `aria-invalid` and announce the error text as the description.",
      "Placeholders only appear on focus, so the label is never replaced by placeholder text.",
    ],
  },
  "navigation-bar": {
    overview:
      "The navigation bar sits at the bottom of compact screens and switches between three to five top-level destinations. The active indicator springs open from the icon's center.",
    usage: `import Link from "next/link";
import { NavigationBar, NavigationBarItem } from "@/components/expressive/navigation-bar";

<NavigationBar>
  <NavigationBarItem render={<Link href="/" />} icon={<HomeIcon />} label="Home" active />
  <NavigationBarItem render={<Link href="/inbox" />} icon={<InboxIcon />} label="Inbox" badge={3} />
</NavigationBar>`,
    props: {
      NavigationBar: [{ name: "aria-label", type: "string", default: '"Main"', description: "Name of the navigation landmark." }],
      NavigationBarItem: [
        { name: "icon", type: "ReactNode", description: "Destination icon." },
        { name: "activeIcon", type: "ReactNode", description: "Shown instead of `icon` when active (often the filled version)." },
        { name: "label", type: "ReactNode", description: "Visible label." },
        { name: "active", type: "boolean", description: "Marks the current destination (`aria-current=\"page\"`)." },
        { name: "badge", type: "boolean | number | string", description: "`true` for a dot, or a count." },
        { name: "render", type: "ReactElement", default: "<a>", description: "Your router's link, e.g. `<Link href />`." },
      ],
    },
    accessibility: ["Renders a `<nav>` landmark of links.", "The active item has `aria-current=\"page\"`."],
  },
  "navigation-rail": {
    overview:
      "The navigation rail is the side navigation for medium and large screens. Collapsed it shows icons with labels underneath; expanded it widens and lays items out in a row, with room for a menu button and FAB in its header.",
    usage: `import { NavigationRail, NavigationRailItem } from "@/components/expressive/navigation-rail";

<NavigationRail
  expanded={expanded}
  header={<IconButton aria-label="Menu" onClick={toggle}><MenuIcon /></IconButton>}
>
  <NavigationRailItem href="/inbox" icon={<InboxIcon />} label="Inbox" active />
  <NavigationRailItem href="/files" icon={<FolderIcon />} label="Files" />
</NavigationRail>`,
    props: {
      NavigationRail: [
        { name: "expanded", type: "boolean", default: "false", description: "Wide layout with horizontal items." },
        { name: "header", type: "ReactNode", description: "Top slot for a menu button and/or FAB." },
        { name: "aria-label", type: "string", default: '"Main"', description: "Name of the navigation landmark." },
      ],
      NavigationRailItem: [{ name: "…", type: "", description: "Same props as NavigationBarItem." }],
    },
    accessibility: ["Same link and `aria-current` semantics as the navigation bar.", "If a button toggles `expanded`, give it `aria-expanded`."],
  },
  "top-app-bar": {
    overview:
      "The top app bar shows the screen's title, navigation and key actions. Small and center-aligned bars are 64px tall; medium and large flexible bars give the title more room below the actions. The bar tints to surface-container once content scrolls under it.",
    usage: `import { TopAppBar } from "@/components/expressive/top-app-bar";

<TopAppBar
  variant="medium"
  title="Inbox"
  subtitle="3 unread"
  navigation={<IconButton aria-label="Menu"><MenuIcon /></IconButton>}
  actions={<IconButton aria-label="Search"><SearchIcon /></IconButton>}
/>`,
    props: {
      TopAppBar: [
        { name: "title", type: "ReactNode", description: "Rendered as the page `<h1>`." },
        { name: "subtitle", type: "ReactNode", description: "Secondary line." },
        { name: "variant", type: '"small" | "center" | "medium" | "large"', default: '"small"', description: "Layout and title size." },
        { name: "navigation", type: "ReactNode", description: "Leading slot (menu or back button)." },
        { name: "actions", type: "ReactNode", description: "Trailing slot, up to three icon buttons." },
        { name: "scrolled", type: "boolean", description: "Force the scrolled tint. By default it follows the scroll position." },
        { name: "scrollTarget", type: "RefObject<HTMLElement>", default: "window", description: "Scroll container to watch." },
      ],
    },
    accessibility: ["Renders a `<header>` with the title as an `<h1>`.", "Every icon button in the slots needs its own accessible name."],
    notes: ["Medium and large bars don't collapse their title on scroll yet; they only tint."],
  },
  card: {
    overview:
      "Cards group content and actions about a single subject. Elevated cards separate themselves with a shadow, filled cards with a stronger surface, outlined cards with a border. Make the whole card a link or button with `interactive` and `render`.",
    usage: `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/expressive/card";

<Card variant="outlined">
  <CardHeader>
    <CardTitle>Trip to Lisbon</CardTitle>
    <CardDescription>May 3–9</CardDescription>
  </CardHeader>
  <CardContent>Flights and hotel are booked.</CardContent>
</Card>

<Card interactive render={<a href="/trips/lisbon" />}>…</Card>`,
    props: {
      Card: [
        { name: "variant", type: '"elevated" | "filled" | "outlined"', default: '"elevated"', description: "How the card separates from the page." },
        { name: "shape", type: '"small" | "medium" | "large" | "extra-large" | "squircle" | "cut"', default: '"medium"', description: "Corner shape." },
        { name: "interactive", type: "boolean", default: "false", description: "Adds state layer, focus ring and press morph." },
        { name: "render", type: "ReactElement", description: "Element to render as, e.g. `<a href>` for a clickable card." },
      ],
      "CardHeader, CardTitle, CardDescription, CardMedia, CardContent, CardActions": [
        { name: "…", type: "div / h3 / p props", description: "Layout parts with the right spacing and type roles." },
      ],
    },
    accessibility: [
      "A plain card is a `<div>`; it adds no semantics.",
      "For a clickable card, render it as a link or button so the whole surface is one focusable target, and avoid nesting other buttons inside it.",
    ],
  },
  dialog: {
    overview:
      "Dialogs interrupt to ask for a decision or show critical information. Keep them short: a title, one or two sentences, and at most two actions.",
    usage: `import {
  Dialog, DialogActions, DialogClose, DialogContent,
  DialogDescription, DialogTitle, DialogTrigger,
} from "@/components/expressive/dialog";

<Dialog>
  <DialogTrigger render={<Button variant="tonal" />}>Reset settings</DialogTrigger>
  <DialogContent>
    <DialogTitle>Reset settings?</DialogTitle>
    <DialogDescription>Your preferences go back to their defaults.</DialogDescription>
    <DialogActions>
      <DialogClose render={<Button variant="text" />}>Cancel</DialogClose>
      <DialogClose render={<Button variant="text" />} onClick={reset}>Reset</DialogClose>
    </DialogActions>
  </DialogContent>
</Dialog>`,
    props: {
      Dialog: [
        { name: "open / defaultOpen", type: "boolean", description: "Open state." },
        { name: "onOpenChange", type: "(open: boolean) => void", description: "Called on open and close." },
        { name: "modal", type: 'boolean | "trap-focus"', default: "true", description: "Whether the rest of the page is inert." },
      ],
      DialogContent: [motionProp, className],
      "DialogTitle, DialogDescription, DialogIcon, DialogActions, DialogTrigger, DialogClose": [
        { name: "…", type: "", description: "Parts; Title and Description are wired to the dialog's `aria-labelledby` and `aria-describedby`." },
      ],
    },
    accessibility: [
      "Focus moves into the dialog on open, is trapped while it's open, and returns to the trigger on close.",
      "Escape and clicking the scrim close it.",
      "Always include a DialogTitle so the dialog has an accessible name.",
    ],
  },
  progress: {
    overview:
      "Progress indicators show that something is happening. Use determinate indicators when you know how far along a task is, indeterminate ones when you don't. The wavy linear style is an M3 Expressive addition for longer, more prominent tasks.",
    usage: `import { CircularProgress, LinearProgress } from "@/components/expressive/progress";

<LinearProgress value={uploaded} aria-label="Uploading photos" />
<LinearProgress value={uploaded} wavy aria-label="Uploading photos" />
<CircularProgress value={null} aria-label="Loading" />`,
    props: {
      LinearProgress: [
        { name: "value", type: "number | null", description: "Progress, or `null` for indeterminate." },
        { name: "min / max", type: "number", default: "0 / 100", description: "Range of `value`." },
        { name: "wavy", type: "boolean", default: "false", description: "Draw the active part as an animated wave." },
        { name: "aria-label", type: "string", description: "What is in progress." },
      ],
      CircularProgress: [
        { name: "value", type: "number | null", description: "Progress, or `null` for indeterminate." },
        { name: "size", type: "number", default: "48", description: "Diameter in px." },
        { name: "aria-label", type: "string", description: "What is in progress." },
      ],
    },
    accessibility: [
      "Exposes `role=\"progressbar\"` with `aria-valuenow` when determinate, and no value when indeterminate.",
      "Name it with `aria-label` or `aria-labelledby`.",
    ],
  },
  snackbar: {
    overview:
      "Snackbars confirm what just happened and can offer one action, like Undo. Only one shows at a time; a new one replaces the current one.",
    usage: `// app/layout.tsx
import { SnackbarProvider } from "@/components/expressive/snackbar";

<SnackbarProvider>{children}</SnackbarProvider>

// anywhere inside
import { useSnackbar } from "@/components/expressive/snackbar";

const snackbar = useSnackbar();
snackbar.show({ message: "Photo deleted", action: { label: "Undo", onClick: restore } });`,
    props: {
      "snackbar.show(options)": [
        { name: "message", type: "ReactNode", description: "What happened." },
        { name: "action", type: "{ label: string; onClick: () => void }", description: "One action. Using it also dismisses the snackbar." },
        { name: "closable", type: "boolean", default: "false", description: "Show a close button." },
        { name: "timeout", type: "number", default: "4000 (8000 with an action)", description: "Milliseconds before it hides. `0` keeps it open." },
      ],
      SnackbarProvider: [className],
    },
    accessibility: [
      "Messages are announced politely through a live region.",
      "Actionable snackbars stay longer by default so there's time to reach the action.",
      "Hovering or focusing the snackbar pauses its timer.",
    ],
  },
  tooltip: {
    overview:
      "Plain tooltips briefly name an element, usually an icon button. Rich tooltips add a title, more text and an optional action. Neither should hold information people can't get elsewhere.",
    usage: `import { RichTooltip, Tooltip, TooltipProvider } from "@/components/expressive/tooltip";

<TooltipProvider>
  <Tooltip content="Search">
    <IconButton aria-label="Search"><SearchIcon /></IconButton>
  </Tooltip>
</TooltipProvider>`,
    props: {
      Tooltip: [
        { name: "content", type: "ReactNode", description: "Tooltip text." },
        { name: "children", type: "ReactElement", description: "The trigger. A single element that accepts a ref." },
        { name: "side / align", type: '"top" | "bottom" | "left" | "right" / "start" | "center" | "end"', default: '"top" / "center"', description: "Placement." },
        { name: "open / defaultOpen / onOpenChange", type: "", description: "Control the open state." },
        motionProp,
      ],
      RichTooltip: [
        { name: "title", type: "ReactNode", description: "Optional title." },
        { name: "actions", type: "ReactNode", description: "Text buttons." },
      ],
    },
    accessibility: [
      "Opens on hover and keyboard focus, closes on Escape.",
      "A tooltip doesn't replace an accessible name: keep `aria-label` on icon buttons.",
      "Wrap toolbars in TooltipProvider so moving between triggers opens the next tooltip instantly.",
    ],
  },
  shape: {
    overview:
      "The 35 shapes of Material 3 Expressive: cookies, clovers, bursts, the flower, puffy and pixel shapes, and more. Use them for avatars, image crops, decorative accents and loading states. Change `name` and the shape morphs into the new one on the motion scheme's spring.",
    usage: `import { Shape } from "@/components/expressive/shape";

<Shape name="flower" className="size-24 text-primary" />

// Morphs whenever the name changes
<Shape name={loading ? "soft-burst" : "cookie-9"} className="size-12 text-tertiary" />

// Clip anything to a shape with the Tailwind utilities
<img src={avatar} alt="" className="size-16 object-cover shape-cookie-12" />`,
    props: {
      Shape: [
        { name: "name", type: "MaterialShapeName", description: "One of 35 shapes, e.g. `flower`, `cookie-9`, `clover-4`, `soft-burst`, `heart`." },
        { name: "label", type: "string", description: "Accessible name. Without it the shape is decorative (`aria-hidden`)." },
        { name: "speed", type: '"fast" | "default" | "slow"', default: '"default"', description: "Spring speed of the morph." },
        motionProp,
        { name: "className", type: "string", description: "Size it with `size-*`; it fills with the text color (`text-*`)." },
      ],
      "shape-* utilities": [
        { name: "shape-{name}", type: "Tailwind utility", description: "Masks any element to a shape, e.g. `shape-flower` on an `<img>`. Only the ones you use end up in your CSS." },
        { name: "shapeMask(name)", type: "(name) => string", description: "The same mask as a CSS value, from `tokens/material-shapes`." },
      ],
    },
    accessibility: [
      "Shapes are decorative by default and hidden from screen readers.",
      "Give a meaningful shape a `label`; it then renders as `role=\"img\"`.",
      "Morphs respect reduced motion: the shape switches instantly.",
    ],
    notes: [
      "Generated from Jetpack Compose's MaterialShapes and androidx.graphics.shapes (Apache-2.0), so the geometry matches Android.",
      "Morphing samples both outlines and interpolates between them. Sharp shapes (the pixel ones) land on their exact outline when the morph ends.",
    ],
  },
  loading: {
    overview:
      "Loading indicators show that something is happening. Use `morph`, the M3 Expressive loading indicator, for short waits of a few seconds; `circular` or `wavy` when you can show progress; `shape`, `dots` or `pulse` for lighter, branded moments. For long, measurable tasks prefer a progress bar.",
    usage: `import { Loading } from "@/components/expressive/loading";

<Loading variant="morph" />                                   // M3 Expressive shape morph
<Loading variant="morph" contained />                          // on a filled container
<Loading variant="circular" label="Loading…" />                 // with text
<Loading variant="wavy" value={progress} aria-label="Upload" /> // determinate
<Loading variant="shape" shape="flower" />                      // one shape spinning
<Loading variant="dots" shape="cookie-4" label="Thinking" />`,
    props: {
      Loading: [
        { name: "variant", type: '"circular" | "wavy" | "morph" | "shape" | "dots" | "pulse"', default: '"circular"', description: "Indicator style." },
        { name: "label", type: "ReactNode", description: "Visible text; also the accessible name." },
        { name: "labelPosition", type: '"end" | "bottom"', default: '"end"', description: "Where the label sits." },
        { name: "size", type: "number", default: "48", description: "Indicator size in px." },
        { name: "value", type: "number | null", default: "null", description: "`circular` and `wavy` only: 0–100 for determinate progress." },
        { name: "shape", type: "MaterialShapeName", default: '"flower"', description: "`shape`, `dots` and `pulse`: which shape to draw." },
        { name: "shapes", type: "MaterialShapeName[]", default: "Compose sequence", description: "`morph`: shapes to cycle through. Defaults to soft burst → 9-sided cookie → pentagon → pill → sunny → 4-sided cookie → oval." },
        { name: "contained", type: "boolean", default: "false", description: "`morph` and `shape`: draw on a filled circular container." },
        { name: "aria-label", type: "string", default: '"Loading"', description: "Accessible name when there's no `label`." },
      ],
    },
    accessibility: [
      "Renders `role=\"progressbar\"`, named by `label` (or `aria-label`, defaulting to “Loading”).",
      "Determinate indicators expose `aria-valuenow` from 0 to 100; indeterminate ones expose no value.",
      "Indicators keep moving under reduced motion, since the movement is the information, but morphs switch instantly and the morph indicator drops its quarter-turn jumps.",
    ],
    notes: ["The morph timing matches Compose's LoadingIndicator: a new shape every 650ms on a spring, a quarter turn per morph, and a full rotation every 4.7s."],
  },
  "button-group": {
    overview:
      "Button groups are new in M3 Expressive. A standard group spaces related buttons and makes them respond to each other: the pressed button widens while its neighbours make room. A connected group replaces the segmented button: toggle buttons joined by a 2px gap, with pill ends, and the selected one morphs into a full pill.",
    usage: `import { Button } from "@/components/expressive/button";
import { ButtonGroup, ConnectedButton, ConnectedButtonGroup } from "@/components/expressive/button-group";

<ButtonGroup aria-label="Playback">
  <Button variant="tonal">Previous</Button>
  <Button>Play</Button>
  <Button variant="tonal">Next</Button>
</ButtonGroup>

<ConnectedButtonGroup aria-label="Calendar view" defaultValue={["week"]}>
  <ConnectedButton value="day">Day</ConnectedButton>
  <ConnectedButton value="week">Week</ConnectedButton>
  <ConnectedButton value="month">Month</ConnectedButton>
</ConnectedButtonGroup>`,
    props: {
      ButtonGroup: [
        { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"sm"', description: "Match the buttons' size. Sets the gap and how far a press widens a button." },
        { name: "aria-label", type: "string", description: "Name for the group." },
        className,
      ],
      ConnectedButtonGroup: [
        { name: "value / defaultValue", type: "string[]", description: "Values of the selected buttons (controlled / uncontrolled)." },
        { name: "onValueChange", type: "(value: string[]) => void", description: "Called when the selection changes." },
        { name: "multiple", type: "boolean", default: "false", description: "Allow more than one selected button." },
        { name: "deselectable", type: "boolean", default: "false", description: "Let a single-select group end up with nothing selected." },
        { name: "variant", type: '"filled" | "tonal" | "outlined"', default: '"filled"', description: "Colors for the unselected and selected states." },
        { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"sm"', description: "Height from 32px to 136px; corners scale with it." },
        { name: "fill", type: "boolean", default: "false", description: "Stretch to the container, sharing the width equally." },
        motionProp,
      ],
      ConnectedButton: [
        { name: "value", type: "string", description: "Identifies the button in the group's value." },
        { name: "icon", type: "ReactNode", description: "Leading icon. Icon-only buttons need an `aria-label`." },
        { name: "disabled", type: "boolean", description: "Disables this button." },
      ],
    },
    accessibility: [
      "Both groups render `role=\"group\"`; give them an `aria-label`.",
      "Connected buttons are toggle buttons with `aria-pressed`, and arrow keys move focus between them.",
      "A single-select group keeps one button selected, as M3 does, unless you pass `deselectable`.",
    ],
    notes: [
      "The press response in a standard group works by padding (Buttons) or width (IconButtons); keep the group's `size` in step with the buttons inside.",
    ],
  },
  "split-button": {
    overview:
      "A split button pairs a main action with a menu of related ones, like Send with Schedule send. The halves share square inner corners; while the menu is open the trailing half morphs into a circle and its chevron flips.",
    usage: `import { SplitButton } from "@/components/expressive/split-button";
import { MenuItem } from "@/components/expressive/menu";

<SplitButton
  onClick={send}
  menuLabel="More send options"
  menu={
    <>
      <MenuItem onClick={schedule}>Schedule send</MenuItem>
      <MenuItem onClick={saveDraft}>Save draft</MenuItem>
    </>
  }
>
  Send
</SplitButton>`,
    props: {
      SplitButton: [
        { name: "menu", type: "ReactNode", description: "The menu's items, e.g. a few `<MenuItem>`s." },
        { name: "menuLabel", type: "string", default: '"More options"', description: "Accessible name for the trailing button." },
        { name: "variant", type: '"filled" | "tonal" | "outlined" | "elevated"', default: '"filled"', description: "Visual emphasis." },
        { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"sm"', description: "Height from 32px to 136px." },
        { name: "icon", type: "ReactNode", description: "Leading icon on the main action." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean / (open) => void", description: "Control the menu." },
        { name: "menuProps", type: "MenuContentProps", description: "Passed to the menu popup, e.g. `{ color: \"vibrant\" }`." },
        motionProp,
        className,
      ],
    },
    accessibility: [
      "Two real buttons in a `role=\"group\"`: the main action, and a menu button with `aria-haspopup=\"menu\"` and `aria-expanded`.",
      "The menu supports arrow keys, typeahead and Escape, and returns focus to the trailing button when it closes.",
    ],
  },
  "fab-menu": {
    overview:
      "The FAB menu opens two to six related actions from a floating action button. On open the FAB morphs into a smaller, filled close button and the actions spring up above it one after another, each a pill in the FAB's container color.",
    usage: `import { FabMenu, FabMenuItem } from "@/components/expressive/fab-menu";

<FabMenu icon={<AddIcon />} aria-label="Create">
  <FabMenuItem icon={<DocumentIcon />} onClick={newDocument}>Document</FabMenuItem>
  <FabMenuItem icon={<FolderIcon />} onClick={newFolder}>Folder</FabMenuItem>
</FabMenu>`,
    props: {
      FabMenu: [
        { name: "icon", type: "ReactNode", description: "The FAB's icon while closed; it turns into a close icon when open." },
        { name: "aria-label", type: "string", description: "Required: names the FAB, e.g. \"Create\"." },
        { name: "color", type: '"primary" | "secondary" | "tertiary"', default: '"primary"', description: "Color family for the FAB and the items." },
        { name: "size", type: '"default" | "medium" | "large"', default: '"default"', description: "Size of the closed FAB. Open, it's the 56px close button." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean / (open) => void", description: "Control the menu." },
        motionProp,
      ],
      FabMenuItem: [
        { name: "icon", type: "ReactNode", description: "Leading icon." },
        { name: "onClick", type: "(event) => void", description: "Runs the action; the menu then closes." },
        { name: "disabled", type: "boolean", description: "Disables this action." },
      ],
    },
    accessibility: [
      "The FAB is a menu button (`aria-haspopup=\"menu\"`, `aria-expanded`) and the actions are menu items.",
      "Arrow keys move between actions, typeahead jumps to one, and Escape closes the menu and refocuses the FAB.",
      "Under reduced motion the items appear without the staggered spring.",
    ],
  },
  toolbar: {
    overview:
      "Toolbars hold actions for the current page. The floating toolbar is a pill that sits over content, horizontally or vertically, often next to a FAB; the docked toolbar spans the bottom of the window. `vibrant` swaps the surface for primary-container colors.",
    usage: `import { IconButton, ToggleIconButton } from "@/components/expressive/icon-button";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@/components/expressive/toolbar";

<Toolbar aria-label="Formatting">
  <ToolbarButton render={<IconButton aria-label="Undo" />}><UndoIcon /></ToolbarButton>
  <ToolbarSeparator />
  <ToolbarButton render={<ToggleIconButton aria-label="Bold" />}><BoldIcon /></ToolbarButton>
</Toolbar>`,
    props: {
      Toolbar: [
        { name: "variant", type: '"floating" | "docked"', default: '"floating"', description: "A pill over content, or a full-width bar." },
        { name: "color", type: '"standard" | "vibrant"', default: '"standard"', description: "Surface or primary-container colors." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout, and which arrow keys move focus." },
        { name: "aria-label", type: "string", description: "Name for the toolbar." },
        className,
      ],
      ToolbarButton: [{ name: "render", type: "ReactElement", description: "The control to use, usually an `IconButton` or `ToggleIconButton`." }],
      ToolbarSeparator: [{ name: "orientation", type: '"horizontal" | "vertical"', description: "Defaults to the opposite of the toolbar's." }],
    },
    accessibility: [
      "Renders `role=\"toolbar\"`: the whole toolbar is one tab stop, and arrow keys move between its items.",
      "Disabled items stay focusable by default so keyboard users can still find them.",
    ],
    notes: [
      "Standard icon buttons inside pick up the toolbar's colors (including selected toggles); filled and tonal ones keep their own, so use one to highlight the key action.",
    ],
  },
  menu: {
    overview:
      "Menus show a list of choices on a temporary surface. Expressive menus have a rounded container and items that morph into a rounder, tinted shape when selected. Use checkbox and radio items for settings, groups with labels to organise long menus, and submenus for nested choices.",
    usage: `import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/expressive/menu";

<Menu>
  <MenuTrigger render={<Button variant="tonal" />}>Options</MenuTrigger>
  <MenuContent>
    <MenuItem icon={<EditIcon />} trailing="⌘E">Rename</MenuItem>
    <MenuItem icon={<CopyIcon />}>Duplicate</MenuItem>
    <MenuSeparator />
    <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
  </MenuContent>
</Menu>`,
    props: {
      MenuContent: [
        { name: "color", type: '"standard" | "vibrant"', default: '"standard"', description: "Surface or tertiary-container colors. Submenus inherit it." },
        { name: "side / align", type: "string", default: '"bottom" / "center"', description: "Placement against the trigger." },
        { name: "sideOffset", type: "number", default: "4", description: "Gap from the trigger, in px." },
        motionProp,
        className,
      ],
      MenuItem: [
        { name: "icon", type: "ReactNode", description: "Leading icon." },
        { name: "trailing", type: "ReactNode", description: "A keyboard shortcut or trailing icon." },
        { name: "supportingText", type: "ReactNode", description: "A second line under the label." },
        { name: "onClick", type: "(event) => void", description: "Runs the action; the menu then closes." },
        { name: "disabled", type: "boolean", description: "Disables the item." },
      ],
      MenuCheckboxItem: [{ name: "checked / defaultChecked / onCheckedChange", type: "boolean", description: "On/off state; a check shows while on." }],
      MenuRadioGroup: [{ name: "value / defaultValue / onValueChange", type: "string", description: "The selected `MenuRadioItem`'s value." }],
      Menu: [
        { name: "open / defaultOpen / onOpenChange", type: "boolean", description: "Control the menu." },
        { name: "modal", type: "boolean", default: "true", description: "Lock page scroll and outside interaction while open." },
      ],
    },
    accessibility: [
      "Built on Base UI's menu: `role=\"menu\"` with `menuitem`, `menuitemcheckbox` and `menuitemradio` items.",
      "Arrow keys move the highlight, typeahead jumps to an item, and Escape closes the menu and refocuses the trigger.",
      "Right arrow opens a submenu, left arrow closes it.",
    ],
  },
  tabs: {
    overview:
      "Tabs organise content into views at the same level. Primary tabs sit under a top app bar, with an indicator that hugs the label; secondary tabs divide one area further, with an indicator that spans the tab. The indicator springs from tab to tab. Make the row `scrollable` past four or five tabs.",
    usage: `import { Tab, Tabs, TabsList, TabsPanel } from "@/components/expressive/tabs";

<Tabs defaultValue="photos">
  <TabsList aria-label="Library">
    <Tab value="photos" icon={<ImageIcon />}>Photos</Tab>
    <Tab value="albums" icon={<FolderIcon />}>Albums</Tab>
  </TabsList>
  <TabsPanel value="photos">…</TabsPanel>
  <TabsPanel value="albums">…</TabsPanel>
</Tabs>`,
    props: {
      Tabs: [
        { name: "value / defaultValue", type: "string | number", description: "The active tab (controlled / uncontrolled)." },
        { name: "onValueChange", type: "(value) => void", description: "Called when the active tab changes." },
      ],
      TabsList: [
        { name: "variant", type: '"primary" | "secondary"', default: '"primary"', description: "Label-width or full-width indicator, and the active color." },
        { name: "scrollable", type: "boolean", default: "false", description: "Scroll sideways, with tabs sized to their labels." },
        { name: "activateOnFocus", type: "boolean", default: "false", description: "Switch tabs as arrow keys move focus, rather than on Enter or Space." },
        motionProp,
      ],
      Tab: [
        { name: "value", type: "string | number", description: "Matches a `TabsPanel`." },
        { name: "icon", type: "ReactNode", description: "Above the label in primary tabs, beside it in secondary tabs." },
        { name: "badge", type: "ReactNode", description: "A `<Badge>`, pinned to the icon (or after the label without one)." },
        { name: "disabled", type: "boolean", description: "Disables the tab." },
      ],
    },
    accessibility: [
      "Base UI's tabs: `role=\"tablist\"`, `tab` and `tabpanel`, with `aria-selected` and `aria-controls` wired up.",
      "Arrow keys move between tabs; Enter or Space activates one (or pass `activateOnFocus`).",
      "Give the `TabsList` an `aria-label` when nothing else names it.",
    ],
  },
  list: {
    overview:
      "Lists show a column of related items, each with a headline, optional overline and supporting text, and leading and trailing slots for icons, avatars, controls or short text. The `segmented` variant is the M3 Expressive look: each item is its own rounded tile, and selected items grow rounder corners.",
    usage: `import { List, ListItem } from "@/components/expressive/list";

<List aria-label="Mailboxes" variant="segmented">
  <ListItem headline="Inbox" leading={<InboxIcon />} trailing="24" render={<a href="/inbox" />} selected />
  <ListItem headline="Drafts" leading={<DraftIcon />} render={<a href="/drafts" />} />
</List>`,
    props: {
      List: [{ name: "variant", type: '"standard" | "segmented"', default: '"standard"', description: "Plain rows, or separate rounded tiles." }],
      ListItem: [
        { name: "headline", type: "ReactNode", description: "The main text." },
        { name: "overline", type: "ReactNode", description: "Small text above the headline." },
        { name: "supportingText", type: "ReactNode", description: "Text below the headline; wraps to two lines." },
        { name: "leading", type: "ReactNode", description: "Icon, avatar or image before the text." },
        { name: "trailing", type: "ReactNode", description: "Icon, control or short text after the text." },
        { name: "render", type: "ReactElement", description: "Makes the item interactive: `<a href>`, your router's Link, or `<button>`." },
        { name: "selected", type: "boolean", description: "Selected state; sets `aria-current` on interactive items." },
        { name: "disabled", type: "boolean", description: "Dims the item and blocks pointer input." },
        { name: "itemProps", type: "ComponentProps<\"li\">", description: "Props for the `<li>` wrapper." },
      ],
    },
    accessibility: [
      "Renders `<ul role=\"list\">` and `<li>`, so screen readers announce the count.",
      "Interactive items are real links or buttons and get a focus ring; a control in the trailing slot needs its own label.",
    ],
    notes: ["Don't put a link or button in the trailing slot of an interactive item: nested interactive elements confuse keyboard and screen reader users."],
  },
  badge: {
    overview:
      "Badges flag new or unread content on an icon. A small 6px dot means \"something new\"; a numbered badge shows a count, capped at 999+. Pin one to an icon with `BadgeAnchor`, or pass it to a tab.",
    usage: `import { Badge, BadgeAnchor } from "@/components/expressive/badge";

<BadgeAnchor badge={<Badge count={3} />}>
  <ChatIcon />
</BadgeAnchor>

<IconButton aria-label="Notifications, 8 new">
  <BadgeAnchor badge={<Badge count={8} />}><BellIcon /></BadgeAnchor>
</IconButton>`,
    props: {
      Badge: [
        { name: "count", type: "number | string", description: "The number to show. Omit it for a small dot." },
        { name: "max", type: "number", default: "999", description: "Larger counts show as `999+`." },
        { name: "label", type: "string", description: "Accessible text, e.g. \"3 unread messages\". Without it the badge is hidden from screen readers." },
        className,
      ],
      BadgeAnchor: [{ name: "badge", type: "ReactNode", description: "The badge to pin over the top-right corner of `children` (a 24px icon)." }],
    },
    accessibility: [
      "Badges are hidden from screen readers by default, since \"3\" alone means little. Put the count in the parent's name instead (\"Notifications, 8 new\"), or pass `label`.",
      "Error colors stay readable in light and dark themes; don't rely on the badge color alone to carry meaning.",
    ],
  },
  divider: {
    overview:
      "Dividers are thin lines that group content in lists and layouts. Use them sparingly, where spacing alone doesn't separate groups clearly. Horizontal dividers can be inset from the leading edge or from both edges.",
    usage: `import { Divider } from "@/components/expressive/divider";

<Divider />
<Divider inset="middle" />
<div className="flex items-center gap-4">
  Edit <Divider orientation="vertical" /> View
</div>`,
    props: {
      Divider: [
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction of the line." },
        { name: "inset", type: '"none" | "start" | "middle"', default: '"none"', description: "`start` insets the leading edge by 16px; `middle` insets both ends." },
        className,
      ],
    },
    accessibility: [
      "Renders `role=\"separator\"` with `aria-orientation`.",
      "For a purely decorative line, a border on the surrounding element is enough.",
    ],
  },
  "bottom-sheet": {
    overview:
      "Bottom sheets show secondary content anchored to the bottom of the screen, like share targets or a list of options. The sheet springs up over a scrim; drag the handle down to dismiss it. With `snapPoints` it rests at a partial height and drags up to full height.",
    usage: `import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/expressive/bottom-sheet";

<BottomSheet snapPoints={["20rem", 1]}>
  <BottomSheetTrigger render={<Button variant="tonal" />}>Share</BottomSheetTrigger>
  <BottomSheetContent>
    <BottomSheetTitle>Share to</BottomSheetTitle>
    …
  </BottomSheetContent>
</BottomSheet>`,
    props: {
      BottomSheet: [
        { name: "open / defaultOpen / onOpenChange", type: "boolean", description: "Control the sheet." },
        { name: "snapPoints", type: "Array<number | string>", description: "Resting heights: fractions of the viewport (0–1), pixels, or `\"20rem\"`." },
        { name: "snapPoint / onSnapPointChange", type: "number | string", description: "Control the current snap point." },
        { name: "modal", type: "boolean", default: "true", description: "Trap focus and lock page scroll while open." },
      ],
      BottomSheetContent: [
        { name: "handle", type: "boolean", default: "true", description: "Show the drag handle." },
        motionProp,
        className,
      ],
    },
    accessibility: [
      "Opens as a modal `dialog`: focus moves inside and stays there, and Escape or a tap on the scrim closes it.",
      "Name it with `BottomSheetTitle` (wired to `aria-labelledby`).",
      "Dragging is optional: everything it does is also possible with the keyboard.",
    ],
  },
  "side-sheet": {
    overview:
      "Side sheets show supplementary content, like filters or details, sliding in from the edge of the window over a scrim. They pair a header and scrolling body with an optional row of actions. Set `side=\"left\"` to open from the left edge.",
    usage: `import {
  SideSheet,
  SideSheetActions,
  SideSheetBody,
  SideSheetClose,
  SideSheetContent,
  SideSheetHeader,
  SideSheetTitle,
  SideSheetTrigger,
} from "@/components/expressive/side-sheet";

<SideSheet>
  <SideSheetTrigger render={<Button variant="tonal" />}>Filters</SideSheetTrigger>
  <SideSheetContent>
    <SideSheetHeader action={<SideSheetClose render={<IconButton aria-label="Close" />}><CloseIcon /></SideSheetClose>}>
      <SideSheetTitle>Filters</SideSheetTitle>
    </SideSheetHeader>
    <SideSheetBody>…</SideSheetBody>
    <SideSheetActions>
      <SideSheetClose render={<Button />}>Apply</SideSheetClose>
    </SideSheetActions>
  </SideSheetContent>
</SideSheet>`,
    props: {
      SideSheet: [
        { name: "side", type: '"right" | "left"', default: '"right"', description: "The edge it slides in from (and swipes out to)." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean", description: "Control the sheet." },
        { name: "modal", type: "boolean", default: "true", description: "Trap focus and lock page scroll while open." },
      ],
      SideSheetHeader: [
        { name: "navigation", type: "ReactNode", description: "Leading slot, e.g. a back button." },
        { name: "action", type: "ReactNode", description: "Trailing slot, usually the close button." },
      ],
      SideSheetContent: [motionProp, className],
    },
    accessibility: [
      "Opens as a modal `dialog` named by `SideSheetTitle`; focus is trapped inside until it closes.",
      "Escape, the scrim and a swipe toward the edge all close it; give the close button an `aria-label`.",
    ],
  },
  "navigation-drawer": {
    overview:
      "Navigation drawers list destinations in a column, for apps with many top-level places or labels. Use `NavigationDrawer` in the layout on large screens, and `ModalNavigationDrawer` from a menu button on smaller ones. On medium screens, the expanded navigation rail is often the better fit.",
    usage: `import Link from "next/link";
import {
  ModalNavigationDrawer,
  NavigationDrawerHeadline,
  NavigationDrawerItem,
} from "@/components/expressive/navigation-drawer";

<ModalNavigationDrawer open={open} onOpenChange={setOpen} trigger={<IconButton aria-label="Menu"><MenuIcon /></IconButton>}>
  <NavigationDrawerHeadline>Mail</NavigationDrawerHeadline>
  <NavigationDrawerItem render={<Link href="/inbox" />} icon={<InboxIcon />} label="Inbox" badge="24" active />
  <NavigationDrawerItem render={<Link href="/sent" />} icon={<SendIcon />} label="Sent" />
</ModalNavigationDrawer>`,
    props: {
      NavigationDrawer: [{ name: "aria-label", type: "string", default: '"Main"', description: "Name of the navigation landmark." }],
      ModalNavigationDrawer: [
        { name: "trigger", type: "ReactElement", description: "The element that opens it, usually a menu IconButton." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean", description: "Control the drawer; close it when a destination is chosen." },
        { name: "aria-label", type: "string", default: '"Main"', description: "Name for the dialog and its navigation landmark." },
        motionProp,
      ],
      NavigationDrawerItem: [
        { name: "icon / activeIcon", type: "ReactNode", description: "Destination icon, and an optional filled one for the active state." },
        { name: "label", type: "ReactNode", description: "Visible label." },
        { name: "badge", type: "ReactNode", description: "Trailing text, e.g. an unread count." },
        { name: "active", type: "boolean", description: "Marks the current destination (`aria-current=\"page\"`)." },
        { name: "render", type: "ReactElement", default: "<a>", description: "Your router's link, e.g. `<Link href />`." },
      ],
    },
    accessibility: [
      "Renders a `<nav>` landmark of links; the active one has `aria-current=\"page\"`.",
      "The modal drawer is a `dialog` that traps focus, closes with Escape, the scrim or a swipe left, and returns focus to its trigger.",
      "`NavigationDrawerHeadline` renders an `<h2>`; use your own heading if the page needs a different level.",
    ],
  },
  table: {
    overview:
      "Tables show records in rows and columns so people can scan, compare and act on them. Headers can sort their column, rows can be selected (pair them with checkboxes), and numeric columns align to the right with tabular figures. Wide tables scroll sideways inside their container instead of the page.",
    usage: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/expressive/table";

<Table aria-label="Invoices">
  <TableHeader>
    <TableRow>
      <TableHead>Client</TableHead>
      <TableHead numeric sort={sort} onSort={toggleSort}>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((row) => (
      <TableRow key={row.id} selected={selected.has(row.id)}>
        <TableCell>{row.client}</TableCell>
        <TableCell numeric>{row.amount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
    props: {
      Table: [
        { name: "variant", type: '"outlined" | "filled" | "plain"', default: '"outlined"', description: "A bordered surface, a tonal surface, or none." },
        { name: "density", type: '"comfortable" | "compact"', default: '"comfortable"', description: "Row height: 52px or 40px." },
        { name: "stickyHeader", type: "boolean", default: "false", description: "Keep the header visible while rows scroll; give the container a max height." },
        { name: "containerProps", type: 'ComponentProps<"div">', description: "Props for the scrolling wrapper, e.g. `{ className: \"max-h-96\" }`." },
        className,
      ],
      TableHead: [
        { name: "sort", type: '"ascending" | "descending" | "none"', description: "Makes the header a sort button and sets `aria-sort`." },
        { name: "onSort", type: "(event) => void", description: "Called with the click event when the sort button is pressed; you choose the next direction and sort the rows. TanStack's `getToggleSortingHandler()` fits as is." },
        { name: "numeric", type: "boolean", description: "Right-align, to match a numeric column." },
      ],
      TableRow: [{ name: "selected", type: "boolean", description: "Highlights the row and sets `aria-selected`." }],
      TableCell: [{ name: "numeric", type: "boolean", description: "Right-align with tabular figures." }],
    },
    accessibility: [
      "A real `<table>`: screen readers announce column headers and each cell's position.",
      "Name the table with `TableCaption` or `aria-label`.",
      "Sortable headers are buttons inside the `<th>`, and the column reports its order with `aria-sort`.",
      "Selection checkboxes need their own labels, e.g. \"Select INV-1042\".",
    ],
    notes: ["Sorting, selection and pagination stay in your code: the table renders whatever rows you give it, so it works with any data source or table library."],
    guides: [
      {
        title: "With TanStack Table",
        intro: [
          "`Table` only draws: it has no state, so it pairs well with a headless table library. [TanStack Table](https://tanstack.com/table) supplies the logic (sorting, multi-sort, filtering, pagination, selection, column visibility, grouping) and these components render it. Install it with `npm install @tanstack/react-table`.",
          "This example sorts (shift-click a second header to sort by both), selects rows with checkboxes, and pages ten rows at a time. `getToggleSortingHandler()` goes straight into `onSort`, and TanStack's `asc` / `desc` map to the `sort` prop, which sets `aria-sort`.",
        ],
        code: `"use client";

import * as React from "react";
import {
  type ColumnDef,
  type RowData,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/expressive/checkbox";
import { IconButton } from "@/components/expressive/icon-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/expressive/table";

// Let columns ask for numeric alignment.
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    numeric?: boolean;
  }
}

type Invoice = { id: string; client: string; status: string; amount: number };

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const columns: ColumnDef<Invoice>[] = [
  {
    id: "select",
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all on this page"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={\`Select \${row.original.id}\`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  },
  { accessorKey: "id", header: "Invoice" },
  { accessorKey: "client", header: "Client" },
  { accessorKey: "status", header: "Status", enableSorting: false },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: { numeric: true },
    cell: ({ getValue }) => money.format(getValue<number>()),
  },
];

/** TanStack's sort state, in the terms \`aria-sort\` uses. */
const sortOf = (sorted: false | "asc" | "desc") => (sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none");

export function InvoicesTable({ data }: { data: Invoice[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });
  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getRowCount();

  return (
    <div className="flex flex-col gap-2">
      <Table aria-label="Invoices">
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  numeric={header.column.columnDef.meta?.numeric}
                  sort={header.column.getCanSort() ? sortOf(header.column.getIsSorted()) : undefined}
                  onSort={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} selected={row.getIsSelected()}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} numeric={cell.column.columnDef.meta?.numeric}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end gap-2 text-body-medium text-on-surface-variant">
        <span>
          {total === 0 ? 0 : pageIndex * pageSize + 1}–{Math.min((pageIndex + 1) * pageSize, total)} of {total}
        </span>
        <IconButton aria-label="Previous page" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton aria-label="Next page" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  );
}
`,
        tips: [
          "Filtering: add `getFilteredRowModel()` and drive `column.setFilterValue()` or `setGlobalFilter()` from a `TextField` above the table.",
          "Server data: set `manualSorting`, `manualPagination` and `rowCount`, and fetch when `sorting` or `pagination` changes; the markup stays the same.",
          "Column visibility: render a `Menu` of `MenuCheckboxItem`s bound to `column.getIsVisible()` and `column.toggleVisibility()`.",
          "Thousands of rows: page them, or virtualize with TanStack Virtual. Virtual rows are absolutely positioned, so give the body `display: grid` and fixed column widths.",
        ],
      },
    ],
  },
  toast: {
    overview:
      "Toasts are notifications that can pile up: each has a title, an optional description, a type icon and an optional action. They stack in a corner, fan out on hover or focus, and can be swiped away. A promise toast shows progress and then the result. For a single brief message, the snackbar is the Material 3 choice.",
    usage: `import { ToastProvider, useToast } from "@/components/expressive/toast";

// Once, near the root:
<ToastProvider>{children}</ToastProvider>

// Anywhere inside:
const toast = useToast();
toast.success("Changes saved", { description: "Synced across devices." });
toast.error("Couldn't send", { action: { label: "Retry", onClick: retry } });
toast.promise(upload(file), {
  loading: "Uploading…",
  success: (result) => \`Uploaded \${result.name}\`,
  error: "Upload failed",
});`,
    props: {
      ToastProvider: [
        { name: "position", type: '"bottom-left" | "bottom-center" | "bottom-right"', default: '"bottom-right"', description: "Where the stack sits." },
        { name: "limit", type: "number", default: "3", description: "How many toasts show at once; older ones fade out." },
        { name: "timeout", type: "number", default: "5000", description: "Default ms before a toast dismisses itself." },
        motionProp,
      ],
      "useToast()": [
        { name: "show(options)", type: "(ToastOptions) => string", description: "Any toast: `title`, `description`, `type`, `action`, `timeout`. Returns its id." },
        { name: "info / success / warning / error", type: "(title, options?) => string", description: "Shorthands that set the type and its icon." },
        { name: "promise(promise, states)", type: "Promise<T>", description: "A loading toast that becomes `success` or `error`. Each state takes text, a function of the result, or options." },
        { name: "dismiss(id?)", type: "(id?: string) => void", description: "Close one toast, or all of them." },
      ],
    },
    accessibility: [
      "Toasts live in a labelled region and are announced politely, without stealing focus.",
      "F6 moves focus to the stack; while it has focus or the pointer, timers pause and the stack fans out.",
      "Escape dismisses the focused toast. The close button is for pointer users, so Base UI hides it from screen readers.",
      "Don't put the only way to do something in a toast: it disappears on its own.",
    ],
  },
  accordion: {
    overview:
      "Accordions stack sections that expand to show their content: FAQs, settings groups, long forms in steps. The `segmented` style matches Expressive's segmented lists, with each section its own tile that grows rounder corners when open; `divided` separates rows with lines. Panels spring open on the motion tokens.",
    usage: `import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/expressive/accordion";

<Accordion defaultValue={["shipping"]}>
  <AccordionItem value="shipping">
    <AccordionTrigger icon={<TruckIcon />}>Shipping</AccordionTrigger>
    <AccordionPanel>Orders ship within two working days.</AccordionPanel>
  </AccordionItem>
  <AccordionItem value="returns">
    <AccordionTrigger supportingText="Free for 30 days">Returns</AccordionTrigger>
    <AccordionPanel>Print the label from your order page.</AccordionPanel>
  </AccordionItem>
</Accordion>`,
    props: {
      Accordion: [
        { name: "variant", type: '"segmented" | "divided"', default: '"segmented"', description: "Separate rounded tiles, or rows divided by lines." },
        { name: "value / defaultValue", type: "unknown[]", description: "Open sections (controlled / uncontrolled)." },
        { name: "onValueChange", type: "(value) => void", description: "Called when sections open or close." },
        { name: "multiple", type: "boolean", default: "false", description: "Allow several sections open at once." },
        { name: "hiddenUntilFound", type: "boolean", default: "false", description: "Let the browser's find-in-page search closed panels and open them." },
        motionProp,
      ],
      AccordionItem: [
        { name: "value", type: "unknown", description: "Identifies the section in the accordion's value." },
        { name: "disabled", type: "boolean", description: "Disables the section." },
      ],
      AccordionTrigger: [
        { name: "icon", type: "ReactNode", description: "Leading icon." },
        { name: "supportingText", type: "ReactNode", description: "Smaller text under the title." },
      ],
    },
    accessibility: [
      "Each trigger is a button inside a heading, with `aria-expanded` and `aria-controls`; the panel is a labelled region.",
      "Enter or Space toggles a section; Tab moves between headers (the ARIA guidance no longer recommends arrow keys here).",
      "Panels animate on spring tokens and snap open under reduced motion.",
    ],
  },
  alert: {
    overview:
      "Alerts are inline messages that stay on the page until the situation is resolved or dismissed: a failed sync, an expiring plan, an update. Four types set the color and icon. For a passing message use a snackbar or toast; to stop the user until they decide, an alert dialog.",
    usage: `import { Alert } from "@/components/expressive/alert";

<Alert type="warning" title="Storage almost full" actions={<Button variant="text" size="sm">Manage storage</Button>}>
  You've used 92% of your 15 GB.
</Alert>

<Alert type="error" title="Sync failed" onDismiss={() => setShown(false)}>
  Changes on this device haven't been saved yet.
</Alert>`,
    props: {
      Alert: [
        { name: "type", type: '"info" | "success" | "warning" | "error"', default: '"info"', description: "Color, icon and how urgently it's announced." },
        { name: "title", type: "ReactNode", description: "Short summary in bold." },
        { name: "children", type: "ReactNode", description: "Details." },
        { name: "icon", type: "ReactNode | null", description: "Replaces the type's icon; `null` removes it." },
        { name: "actions", type: "ReactNode", description: "Text buttons under the message; they take the alert's color." },
        { name: "onDismiss", type: "() => void", description: "Shows a close button that calls this." },
        { name: "dismissLabel", type: "string", default: '"Dismiss"', description: "Accessible name of the close button." },
        className,
      ],
    },
    accessibility: [
      "Errors and warnings render `role=\"alert\"` (announced immediately); info and success `role=\"status\"` (announced politely). Override with `role`.",
      "Render the alert when the condition appears so the announcement happens then; an alert present on page load isn't announced.",
      "Color isn't the only signal: each type has its own icon, and the title says what happened.",
    ],
  },
  "alert-dialog": {
    overview:
      "An alert dialog interrupts to confirm a consequential action, like deleting files or discarding a draft. Unlike a regular dialog, clicking outside doesn't close it: the user has to choose. Say what will happen in the description, and label buttons with the outcome (\"Delete\", not \"OK\").",
    usage: `import {
  AlertDialog, AlertDialogActions, AlertDialogClose, AlertDialogContent,
  AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/expressive/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger render={<Button variant="tonal" />}>Delete files</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Delete 3 files?</AlertDialogTitle>
    <AlertDialogDescription>They can't be recovered.</AlertDialogDescription>
    <AlertDialogActions>
      <AlertDialogClose render={<Button variant="text" />}>Cancel</AlertDialogClose>
      <AlertDialogClose render={<Button variant="text" />} onClick={deleteFiles}>Delete</AlertDialogClose>
    </AlertDialogActions>
  </AlertDialogContent>
</AlertDialog>`,
    props: {
      AlertDialog: [
        { name: "open / defaultOpen", type: "boolean", description: "Open state." },
        { name: "onOpenChange", type: "(open: boolean) => void", description: "Called on open and close." },
      ],
      AlertDialogContent: [motionProp, className],
      "AlertDialogTitle, AlertDialogDescription, AlertDialogIcon, AlertDialogActions, AlertDialogTrigger, AlertDialogClose": [
        { name: "…", type: "", description: "Parts; Title and Description are wired to `aria-labelledby` and `aria-describedby`." },
      ],
    },
    accessibility: [
      "Renders `role=\"alertdialog\"`, traps focus, and returns it to the trigger on close.",
      "Escape still closes it (as Cancel would); an outside click doesn't.",
      "Always include a cancel action, and keep the description short enough to read before choosing.",
    ],
  },
  avatar: {
    overview:
      "Avatars show a person or entity: a photo, falling back to initials while it loads or if it fails. Five sizes, four fallback colors, and besides the circle, any of the 35 Material shapes, one of M3 Expressive's signature details. `AvatarGroup` overlaps several and collapses the rest into \"+N\".",
    usage: `import { Avatar, AvatarGroup } from "@/components/expressive/avatar";

<Avatar src={user.photo} alt={user.name} />
<Avatar alt="Ada Lovelace" size="lg" shape="cookie-9" color="tertiary" />

<AvatarGroup max={4} aria-label="Project members">
  {members.map((m) => <Avatar key={m.id} src={m.photo} alt={m.name} />)}
</AvatarGroup>`,
    props: {
      Avatar: [
        { name: "alt", type: "string", description: "Required: the person's or entity's name. Used as alt text and for initials." },
        { name: "src", type: "string", description: "Image URL." },
        { name: "fallback", type: "ReactNode", description: "Shown instead of initials, e.g. an icon." },
        { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "24, 32, 40, 56 or 96px." },
        { name: "shape", type: "MaterialShapeName", default: '"circle"', description: "Circle or any Material shape (`\"cookie-9\"`, `\"clover-4\"`, `\"flower\"`…)." },
        { name: "color", type: '"primary" | "secondary" | "tertiary" | "surface"', default: '"primary"', description: "Fallback colors." },
        className,
      ],
      AvatarGroup: [
        { name: "max", type: "number", description: "Show at most this many; the rest become \"+N\"." },
        { name: "size", type: "Avatar size", default: '"md"', description: "Size of the \"+N\" avatar; match the avatars." },
        { name: "aria-label", type: "string", description: "Names the group." },
      ],
    },
    accessibility: [
      "The image uses `alt`; the initials fallback is `role=\"img\"` named by `alt`, with the letters hidden from screen readers.",
      "The \"+N\" avatar is announced as \"N more\".",
      "Next to the person's visible name the avatar repeats it; to keep it quiet there, add `aria-hidden` to the avatar.",
    ],
  },
  breadcrumb: {
    overview:
      "Breadcrumbs show where the current page sits in a hierarchy and link back up it. Use them for deep structures like docs, file browsers and catalogs, not as primary navigation.",
    usage: `import Link from "next/link";
import { Breadcrumb, BreadcrumbItem } from "@/components/expressive/breadcrumb";

<Breadcrumb>
  <BreadcrumbItem render={<Link href="/" />} icon={<HomeIcon />}>Home</BreadcrumbItem>
  <BreadcrumbItem render={<Link href="/docs" />}>Docs</BreadcrumbItem>
  <BreadcrumbItem current>Button</BreadcrumbItem>
</Breadcrumb>`,
    props: {
      Breadcrumb: [{ name: "aria-label", type: "string", default: '"Breadcrumb"', description: "Name of the navigation landmark." }],
      BreadcrumbItem: [
        { name: "href", type: "string", description: "Link target (or use `render`)." },
        { name: "render", type: "ReactElement", default: "<a>", description: "Your router's link, e.g. `<Link href />`." },
        { name: "current", type: "boolean", description: "The current page: plain text with `aria-current=\"page\"`." },
        { name: "icon", type: "ReactNode", description: "Leading icon." },
      ],
    },
    accessibility: [
      "A `<nav>` landmark around an ordered list, so screen readers announce the trail and its length.",
      "Separators are drawn and hidden from assistive tech; they flip in right-to-left layouts.",
    ],
  },
  calendar: {
    overview:
      "The calendar is a month grid for choosing a date, several dates or a range, in the M3 date picker style: circular days, the selection in primary, today outlined, and ranges joined by a tonal band. It's built on react-day-picker, which supplies the date logic, keyboard grid, localization and time zones, so every react-day-picker prop works.",
    usage: `import { Calendar } from "@/components/expressive/calendar";

const [date, setDate] = useState<Date>();
<Calendar mode="single" selected={date} onSelect={setDate} />

<Calendar
  mode="range"
  selected={range}
  onSelect={setRange}
  numberOfMonths={2}
  disabled={{ before: new Date() }}
  captionLayout="dropdown"
/>`,
    props: {
      Calendar: [
        { name: "mode", type: '"single" | "multiple" | "range"', description: "Selection mode." },
        { name: "selected / onSelect", type: "Date | Date[] | DateRange", description: "The selection and its setter, typed by `mode`." },
        { name: "disabled", type: "Matcher | Matcher[]", description: "Days that can't be picked: dates, ranges, `{ before }`, `{ dayOfWeek }`, functions." },
        { name: "defaultMonth / month", type: "Date", description: "The month shown first (or controlled)." },
        { name: "numberOfMonths", type: "number", default: "1", description: "Months side by side." },
        { name: "captionLayout", type: '"label" | "dropdown" | …', default: '"label"', description: "Month and year dropdowns in the caption." },
        { name: "locale / weekStartsOn / timeZone", type: "", description: "Localization, from react-day-picker." },
        { name: "showOutsideDays", type: "boolean", default: "true", description: "Show days from the neighbouring months." },
        { name: "classNames", type: "Partial<ClassNames>", description: "Override any part's classes." },
      ],
    },
    accessibility: [
      "A labelled grid: arrow keys move by day and week, Home/End to the week's ends, Page Up/Down by month (with Shift, by year).",
      "Days are buttons announced with the full date; selected and disabled states are exposed.",
      "Month names, weekdays and the first day of the week follow `locale`.",
    ],
    notes: ["Adds `react-day-picker` (and `date-fns`) to your dependencies. Don't import react-day-picker's stylesheet: the classes here replace it."],
  },
  "date-picker": {
    overview:
      "Date pickers are fields that open a calendar, M3's \"docked\" picker: `DatePicker` for one date, `DateRangePicker` for a start and end. They close when the choice is complete, return focus to the field, and submit with forms through a hidden input.",
    usage: `import { DatePicker, DateRangePicker } from "@/components/expressive/date-picker";

<DatePicker label="Departure" name="departure" value={date ?? null} onValueChange={setDate} />

<DateRangePicker
  label="Stay"
  name="stay"
  calendarProps={{ disabled: { before: new Date() }, numberOfMonths: 2 }}
/>`,
    props: {
      DatePicker: [
        { name: "label", type: "string", description: "Required visible label." },
        { name: "value / defaultValue", type: "Date | null", description: "The date (controlled / uncontrolled). `null` means nothing picked." },
        { name: "onValueChange", type: "(date: Date | undefined) => void", description: "Called when a date is picked." },
        { name: "variant", type: '"filled" | "outlined"', default: '"filled"', description: "Field style, matching TextField." },
        { name: "name", type: "string", description: "Submits the date as `YYYY-MM-DD` with forms." },
        { name: "format", type: "(date: Date) => string", description: "Field text. Defaults to the locale's medium date (\"Oct 20, 2026\")." },
        { name: "locale", type: "string", description: "Locale for the field text." },
        { name: "calendarProps", type: "CalendarProps", description: "Passed to the calendar: `disabled`, `startMonth`, `captionLayout`, `locale`…" },
        { name: "supportingText / errorText / invalid", type: "", description: "Helper and error text, as on TextField." },
        { name: "open / onOpenChange", type: "boolean", description: "Control the popover." },
        motionProp,
      ],
      DateRangePicker: [
        { name: "value / defaultValue", type: "DateRange | null", description: "`{ from, to }`." },
        { name: "onValueChange", type: "(range) => void", description: "Called as each end is picked." },
        { name: "name", type: "string", description: "Submits `YYYY-MM-DD/YYYY-MM-DD` with forms." },
        { name: "…", type: "", description: "Every other DatePicker prop." },
      ],
    },
    accessibility: [
      "The field is a button named by its label and current value, with the supporting or error text as its description.",
      "The calendar takes focus on the selected day (or today); Escape closes it and returns focus to the field.",
      "The calendar's keyboard grid is described on the Calendar page.",
    ],
    notes: ["Typing a date isn't supported yet; for keyboard-heavy forms, a `TextField` with `type=\"date\"` is the fallback."],
  },
  carousel: {
    overview:
      "Carousels show a row of visual items that scroll sideways and snap. In the `multi-browse` and `hero` layouts, items cut off at the edges are masked into rounded tiles and their content shifts as they move, M3's parallax, instead of being sliced by the edge. Native scrolling does the work, so touch, trackpads and the keyboard all feel right, and a mouse can drag the row. Scrolling stays at 60fps: item positions are measured once, and each frame only moves the masks and parallax layers.",
    usage: `import { Carousel, CarouselItem } from "@/components/expressive/carousel";

<Carousel aria-label="Destinations">
  {places.map((place) => (
    <CarouselItem key={place.id} label={place.name}>
      <img src={place.photo} alt={place.description} />
    </CarouselItem>
  ))}
</Carousel>`,
    props: {
      Carousel: [
        { name: "aria-label", type: "string", description: "Required: names the carousel." },
        { name: "layout", type: '"multi-browse" | "hero" | "uncontained"', default: '"multi-browse"', description: "Item widths and snapping; `uncontained` skips the edge masking." },
        { name: "height", type: "string", default: '"16rem"', description: "Item height." },
        { name: "controls", type: "boolean", default: "true", description: "Previous and next buttons." },
        { name: "labels", type: "{ previous?, next?, slide? }", description: "Button labels and the slide name (\"1 of 6\"), for translation." },
      ],
      CarouselItem: [
        { name: "label", type: "ReactNode", description: "Text over the bottom of the item." },
        { name: "children", type: "ReactNode", description: "Usually an `<img>` or `<video>`; it fills the item." },
      ],
    },
    accessibility: [
      "A region with `aria-roledescription=\"carousel\"`; each item is a group announced as \"slide, 1 of 6\".",
      "The row is focusable, so arrow keys scroll it; the buttons scroll one item and disable at the ends.",
      "Mouse users can drag the row; a drag never activates a link or button inside an item, while a plain click still does.",
      "No autoplay: content only moves when the user moves it. Button scrolling is instant under reduced motion.",
    ],
  },
  "code-block": {
    overview:
      "Code blocks show copyable snippets with an icon, file name, language label and optional line numbers. `CodeTabs` puts several snippets behind tabs, like one command per package manager or the files of an example, each tab with its own icon. Blocks that share a `syncKey` switch together and remember the choice, so picking pnpm once updates every install command on the page. Neither bundles a syntax highlighter: pass plain `code`, or `html` from one you already use (Shiki on the server works well).",
    usage: `import { CodeBlock, CodeTabs } from "@/components/expressive/code-block";

<CodeBlock code={source} title="button.tsx" language="tsx" lineNumbers />

<CodeTabs
  aria-label="Package manager"
  syncKey="package-manager"
  items={[
    { value: "npm", label: "npm", language: "bash", icon: <NpmLogo />, code: "npx @grenishrai/expressive init" },
    { value: "pnpm", label: "pnpm", language: "bash", icon: <PnpmLogo />, code: "pnpm dlx @grenishrai/expressive init" },
  ]}
/>

// Highlighted with Shiki (server component)
const html = await codeToHtml(source, { lang: "tsx", theme: "github-dark" });
<CodeBlock code={source} html={html} title="button.tsx" language="tsx" />`,
    props: {
      CodeBlock: [
        { name: "code", type: "string", description: "Required: the source. It's what the copy button copies." },
        { name: "html", type: "string", description: "Highlighted HTML (a `<pre>`). Only pass trusted HTML." },
        { name: "title", type: "ReactNode", description: "File name or caption in the header." },
        { name: "language", type: "string", description: "Label in the header (`tsx`, `bash`…); also picks the default icon." },
        { name: "icon", type: "ReactNode | null", description: "Header icon. Defaults to one for the language; `null` hides it." },
        { name: "lineNumbers", type: "boolean", default: "false", description: "Number each line (works with Shiki's `.line` spans)." },
        { name: "wrap", type: "boolean", default: "false", description: "Wrap long lines instead of scrolling." },
        { name: "maxHeight", type: "string", description: "Scroll vertically past this height." },
        { name: "labels", type: "{ copy?, copied? }", description: "Copy button labels, for translation." },
      ],
      CodeTabs: [
        { name: "items", type: "CodeTab[]", description: "The tabs: `{ value, label, code, html?, language?, icon? }`." },
        { name: "value / defaultValue", type: "string", description: "The active tab (controlled / uncontrolled)." },
        { name: "onValueChange", type: "(value: string) => void", description: "Called when the tab changes." },
        { name: "syncKey", type: "string", description: "Blocks with the same key switch together and remember the choice in localStorage." },
        { name: "aria-label", type: "string", default: '"Code"', description: "Names the tab list, e.g. \"Package manager\"." },
        { name: "lineNumbers / wrap / maxHeight / labels", type: "", description: "As on CodeBlock, for every tab." },
      ],
      CodeTab: [
        { name: "value", type: "string", description: "Unique id. With `syncKey`, tabs match across blocks by value (`\"pnpm\"`)." },
        { name: "label", type: "ReactNode", description: "Tab text." },
        { name: "icon", type: "ReactNode | null", description: "Tab icon, e.g. a brand logo. Defaults to one for `language`; `null` hides it." },
        { name: "code / html / language", type: "", description: "The snippet, as on CodeBlock." },
      ],
    },
    accessibility: [
      "CodeBlock is a `<figure>` with its header as the caption; CodeTabs is a real tab list (`role=\"tablist\"`, arrow keys between tabs).",
      "The code area is focusable so keyboard users can scroll it.",
      "The copy button copies the visible tab, and \"Copied\" is announced through a live region.",
      "Icons are decorative (`aria-hidden`); the tab label carries the name. Line numbers are CSS, so screen readers and copy-paste skip them.",
    ],
    notes: [
      "`CodeLanguageIcon` is exported: the built-in icons are a terminal for shell languages, braces for JSON, a page for Markdown and text, and code brackets for everything else.",
      "The synced choice is stored per `syncKey`; if storage is unavailable (private mode), blocks still sync on the page.",
    ],
  },
  select: {
    overview:
      "Select (M3's exposed dropdown menu) is a field that opens a menu of options. It matches the text field, filled or outlined with a floating label, and its menu matches Expressive's menus. Use it for choosing one option from a list too long for radio buttons.",
    usage: `import { Select } from "@/components/expressive/select";

<Select
  label="Country"
  name="country"
  value={country}
  onValueChange={setCountry}
  items={[
    { value: "np", label: "Nepal" },
    { value: "pt", label: "Portugal" },
  ]}
/>`,
    props: {
      Select: [
        { name: "label", type: "string", description: "Required visible label." },
        { name: "items", type: "{ value, label, disabled? }[]", description: "The options; lets the field show the chosen label." },
        { name: "value / defaultValue", type: "unknown", description: "The chosen value (controlled / uncontrolled)." },
        { name: "onValueChange", type: "(value) => void", description: "Called when an option is chosen." },
        { name: "variant", type: '"filled" | "outlined"', default: '"filled"', description: "Field style." },
        { name: "multiple", type: "boolean", default: "false", description: "Choose several options." },
        { name: "name / required", type: "", description: "Form submission, through Base UI." },
        { name: "supportingText / errorText / invalid", type: "", description: "Helper and error text, as on TextField." },
        { name: "leadingIcon", type: "ReactNode", description: "Icon in the field." },
        { name: "children", type: "ReactNode", description: "Custom options: `SelectItem`, `SelectGroup`, `SelectGroupLabel`, `SelectSeparator`. Keep `items` too, for the field text." },
        motionProp,
      ],
      SelectItem: [
        { name: "value", type: "unknown", description: "The option's value." },
        { name: "icon", type: "ReactNode", description: "Leading icon." },
        { name: "disabled", type: "boolean", description: "Disables the option." },
      ],
    },
    accessibility: [
      "Base UI's select: a combobox trigger named by the label, a listbox of options, typeahead, and arrow-key selection.",
      "The chosen option shows a check, not only a color.",
      "Helper and error text are wired to the field through Base UI's Field.",
    ],
  },
  pagination: {
    overview:
      "Pagination moves through pages of results. The current page is a tonal pill, and long ranges collapse into ellipses around it. Pages are buttons by default; pass `getHref` to make them links, which suits pages people share or open in new tabs.",
    usage: `import { Pagination } from "@/components/expressive/pagination";

<Pagination page={page} pageCount={20} onPageChange={setPage} />

// As links
<Pagination page={page} pageCount={20} getHref={(n) => \`?page=\${n}\`} />`,
    props: {
      Pagination: [
        { name: "page", type: "number", description: "Current page, 1-based." },
        { name: "pageCount", type: "number", description: "Total pages." },
        { name: "onPageChange", type: "(page: number) => void", description: "Called when a page is chosen." },
        { name: "getHref", type: "(page: number) => string", description: "Render pages as links to these URLs." },
        { name: "siblingCount", type: "number", default: "1", description: "Pages shown on each side of the current one." },
        { name: "labels", type: "{ previous?, next?, page? }", description: "Accessible labels, for translation." },
        { name: "aria-label", type: "string", default: '"Pagination"', description: "Name of the navigation landmark." },
      ],
    },
    accessibility: [
      "A `<nav>` landmark; every control is labelled (\"Page 4\", \"Next page\"), and the current page has `aria-current=\"page\"`.",
      "Previous and next disable at the ends; ellipses are hidden from screen readers.",
    ],
    notes: ["`paginationRange(page, pageCount, siblingCount)` is exported if you want the same page list in your own layout."],
  },
  sidebar: {
    overview:
      "The sidebar is the persistent side panel of an app layout: a header, scrolling navigation in groups, and a footer. On wide screens it collapses to an 80px icon rail, where labels become tooltips and the active indicator matches the navigation rail, or slides away entirely. Three looks: flush to the edge, a floating card, or inset, where the main area becomes the card. Below 768px it becomes a modal drawer you can swipe closed. ⌘B or Ctrl+B toggles it, and the expanded state is remembered. For Material's standalone patterns, see the navigation rail and navigation drawer.",
    usage: `import Link from "next/link";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/expressive/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader><Logo /></SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Mail">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/inbox" />} icon={<InboxIcon />} badge="24" active>
                  Inbox
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup label="Labels" collapsible>…</SidebarGroup>
        </SidebarContent>
        <SidebarFooter><Account /></SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header><SidebarTrigger /></header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}`,
    props: {
      SidebarProvider: [
        { name: "defaultOpen", type: "boolean", default: "true", description: "Expanded on wide screens when nothing is remembered yet." },
        { name: "open / onOpenChange", type: "boolean", description: "Control the wide-screen state." },
        { name: "storageKey", type: "string | null", default: '"expressive:sidebar"', description: "Where the state is remembered (localStorage); `null` turns it off." },
        { name: "keyboardShortcut", type: "string | false", default: '"b"', description: "Toggle with ⌘ / Ctrl and this key; ignored while typing in a field." },
        { name: "width / collapsedWidth", type: "string", default: '"18rem" / "5rem"', description: "Expanded and icon-rail widths." },
      ],
      Sidebar: [
        { name: "collapsible", type: '"icon" | "offcanvas" | "none"', default: '"icon"', description: "Collapse to an icon rail, slide away, or stay put." },
        { name: "variant", type: '"standard" | "floating" | "inset"', default: '"standard"', description: "`standard`: flush to the edge. `floating`: the sidebar is a rounded card. `inset`: the sidebar blends into the page and `SidebarInset` becomes a raised rounded card beside it." },
        { name: "side", type: '"left" | "right"', default: '"left"', description: "Which edge it sits on (and swipes toward on phones)." },
        { name: "aria-label", type: "string", default: '"Sidebar"', description: "Names the drawer on narrow screens." },
      ],
      SidebarMenuButton: [
        { name: "href / render", type: "string / ReactElement", description: "A link (your router's `Link` via `render`), or `render={<button type=\"button\" />}` for an action." },
        { name: "icon / activeIcon", type: "ReactNode", description: "Icon, and an optional filled one for the active state." },
        { name: "active", type: "boolean", description: "The current page: indicator and `aria-current=\"page\"`." },
        { name: "badge", type: "ReactNode", description: "Trailing text such as a count; a dot in the icon rail." },
        { name: "tooltip", type: "string", description: "Tooltip in the icon rail. Defaults to the label when it's text." },
      ],
      SidebarGroup: [
        { name: "label", type: "ReactNode", description: "Section title, hidden in the icon rail." },
        { name: "collapsible / defaultOpen", type: "boolean", description: "Open and close the section from its title. The icon rail always shows its items." },
        { name: "action", type: "ReactNode", description: "Something after the title, like an add button." },
      ],
      "useSidebar()": [
        { name: "open / setOpen", type: "", description: "Wide-screen state." },
        { name: "openMobile / setOpenMobile", type: "", description: "The drawer on narrow screens." },
        { name: "toggle()", type: "", description: "Toggles whichever applies to the current width." },
      ],
      "Other parts": [
        { name: "SidebarHeader / SidebarFooter", type: "", description: "Fixed top and bottom areas." },
        { name: "SidebarContent", type: "", description: "The scrolling middle, rendered as the `<nav>` landmark (`aria-label` defaults to \"Main\")." },
        { name: "SidebarMenuSub / SidebarMenuSubButton", type: "", description: "Nested destinations, hidden in the icon rail." },
        { name: "SidebarTrigger", type: "", description: "The toggle button (an IconButton)." },
        { name: "SidebarInset", type: "", description: "The `<main>` area beside the sidebar; a raised rounded card with the `inset` variant." },
        { name: "useSidebarRail()", type: "", description: "Whether this sidebar is the icon rail. For header and footer content, prefer fading text with `group-data-[collapsible=icon]/sidebar:opacity-0` and keeping icons 40px from the edge, so nothing jumps." },
      ],
    },
    accessibility: [
      "The menu is a `<nav>` landmark of links; the current one has `aria-current=\"page\"`.",
      "In the icon rail, labels stay in each link's accessible name and show as tooltips on hover and focus.",
      "When an off-canvas sidebar slides away it becomes `inert`, so Tab skips it.",
      "On narrow screens it's a modal drawer: focus is trapped, Escape or a swipe closes it, and focus returns to the trigger.",
      "The trigger reports `aria-expanded`; the shortcut is ignored in text fields, where ⌘B means bold.",
    ],
    notes: [
      "The wide/narrow switch is Tailwind's `md` breakpoint (768px).",
      "Collapsing never moves an icon: items keep their layout and shrink to a 56px pill around it, labels fade, and group titles and sub-items fold away. Line up your own header and footer icons 40px from the edge (12px of `SidebarHeader` padding plus 12px of your own) to match.",
      "The remembered state is restored after hydration, so a server-rendered page can briefly show the default. Pass `open` from a cookie if you need it exact on first paint.",
    ],
  },
};
