import type { PropRow } from "@/components/docs/prose";

export interface ComponentDoc {
  /** One-paragraph explanation of when to use it. */
  overview: string;
  usage: string;
  /** Named prop tables, e.g. { Button: [...], ToggleButton: [...] }. */
  props: Record<string, PropRow[]>;
  accessibility: string[];
  notes?: string[];
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
};
