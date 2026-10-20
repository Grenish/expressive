# Patterns: building screens with Expressive

Recipes for common screens, with the reasoning behind each choice. Import paths use the default aliases; check
`expressive.json`. Icons are placeholders (`<InboxIcon />`): use whatever icon set the project already has.

## Window size classes

Material sizes layouts by window width, not device. Map the classes to Tailwind breakpoints once and stick to them:

| Class | Width | Navigation | Tailwind |
| --- | --- | --- | --- |
| Compact | < 600px | `NavigationBar` at the bottom (or a `ModalNavigationDrawer` for many destinations) | default (no prefix) |
| Medium | 600–839px | `NavigationRail` (collapsed) | `sm:` (640px) |
| Expanded+ | ≥ 840px | `NavigationRail` expanded, or a standard `NavigationDrawer` | `lg:` (1024px) or a custom `--breakpoint-expanded: 840px` |

Tailwind's default `sm` / `lg` are close enough for most apps; define custom breakpoints in `@theme` if the design
needs Material's exact numbers.

## App shell with adaptive navigation

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationBar, NavigationBarItem } from "@/components/expressive/navigation-bar";
import { NavigationRail, NavigationRailItem } from "@/components/expressive/navigation-rail";
import { Fab } from "@/components/expressive/fab";

const destinations = [
  { href: "/", label: "Home", icon: <HomeIcon /> },
  { href: "/inbox", label: "Inbox", icon: <InboxIcon />, badge: 3 },
  { href: "/files", label: "Files", icon: <FolderIcon /> },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-dvh bg-surface text-on-surface">
      <NavigationRail
        className="hidden sm:flex"
        expanded={false}
        header={<Fab aria-label="Compose" icon={<EditIcon />} />}
      >
        {destinations.map((d) => (
          <NavigationRailItem key={d.href} render={<Link href={d.href} />} icon={d.icon} label={d.label} badge={d.badge} active={pathname === d.href} />
        ))}
      </NavigationRail>
      <main className="min-w-0 flex-1 pb-20 sm:pb-0">{children}</main>
      <NavigationBar className="fixed inset-x-0 bottom-0 sm:hidden">
        {destinations.map((d) => (
          <NavigationBarItem key={d.href} render={<Link href={d.href} />} icon={d.icon} label={d.label} badge={d.badge} active={pathname === d.href} />
        ))}
      </NavigationBar>
    </div>
  );
}
```

Why: one destination list, two presentations; the rail and bar share the item API. `active` sets
`aria-current="page"`. Items render as your router's `Link` through `render`, so client-side navigation and
prefetching keep working. Pad `main` so the fixed bar doesn't cover content.

## Page header

```tsx
<TopAppBar
  variant="medium"            // "small" for dense apps, "large" for top-level pages
  title="Inbox"
  subtitle="3 unread"
  navigation={<IconButton aria-label="Back" render={<Link href="/" />} nativeButton={false}><BackIcon /></IconButton>}
  actions={<IconButton aria-label="Search"><SearchIcon /></IconButton>}
/>
```

The title renders as the page's `<h1>`, so don't add another. It tints to `surface-container` once the page scrolls;
pass `scrollTarget` when a container scrolls instead of the window.

## Forms

```tsx
<form onSubmit={submit} className="flex max-w-md flex-col gap-4">
  <TextField label="Full name" name="name" required invalid={!!errors.name} errorText={errors.name} />
  <TextField label="Email" name="email" type="email" supportingText="For receipts only" />
  <RadioGroup aria-labelledby="shipping-label" defaultValue="standard" name="shipping">
    <span id="shipping-label" className="text-title-small text-on-surface-variant">Shipping</span>
    <label className="flex items-center gap-3 text-body-large"><Radio value="standard" /> Standard</label>
    <label className="flex items-center gap-3 text-body-large"><Radio value="express" /> Express</label>
  </RadioGroup>
  <Select label="Country" name="country" items={countries} />
  <DatePicker label="Delivery date" name="delivery" calendarProps={{ disabled: { before: new Date() } }} />
  <label className="flex items-center gap-3 text-body-large">
    <Checkbox name="terms" required /> I agree to the terms
  </label>
  <div className="flex justify-end gap-2">
    <Button variant="text" type="button" onClick={cancel}>Cancel</Button>
    <Button type="submit">Place order</Button>
  </div>
</form>
```

Rules: every field has a visible `label` (placeholders aren't labels); errors go in `errorText` with `invalid`, so
they're announced; one filled button per form, the rest lower emphasis; settings that apply instantly use `Switch`,
choices submitted with a form use `Checkbox`. Pick filled or outlined text fields and use one style per form.

## Settings screen

```tsx
<List aria-label="Settings" className="rounded-shape-large bg-surface-container-low">
  <ListItem headline="Wi-Fi" supportingText="Home network" leading={<WifiIcon />} trailing={<Switch defaultChecked aria-label="Wi-Fi" />} />
  <ListItem headline="Notifications" leading={<BellIcon />} render={<Link href="/settings/notifications" />} trailing={<ChevronRightIcon />} />
</List>
```

A control in the trailing slot needs its own label, and an item with a trailing control must not also be a link or
button (nested interactive elements). Navigation rows use `render` and a chevron instead.

## List–detail

Segmented lists for the master pane (M3 Expressive's look), with `selected` on the open item:

```tsx
<List aria-label="Conversations" variant="segmented">
  {threads.map((t) => (
    <ListItem
      key={t.id}
      headline={t.from}
      supportingText={t.preview}
      leading={<Avatar src={t.avatar} />}
      trailing={t.time}
      selected={t.id === openId}
      render={<Link href={`/inbox/${t.id}`} />}
    />
  ))}
</List>
```

Interactive items with `selected` get `aria-current`. On compact screens, show either the list or the detail, not both.

## Data tables

Use `Table` for presentation and [TanStack Table](https://tanstack.com/table) for logic once you need more than a
static list: multi-sort, filtering, pagination, column visibility. The full integration example is in
`references/components.md` under **Table → With TanStack Table**. Key points: `onSort` takes TanStack's
`getToggleSortingHandler()` directly (shift-click multi-sorts); map `false | "asc" | "desc"` to the `sort` prop; put
`numeric` in column `meta`; selected rows get `selected={row.getIsSelected()}`.

For a simple sortable list without TanStack, keep `sort` state in the component and sort before rendering; set
`sort="none"` on sortable columns that aren't active so they still render as buttons.

## Overlays: which one

| Situation | Use | Why |
| --- | --- | --- |
| Confirm a destructive action | `AlertDialog` | Can't be dismissed by an outside click, so the user decides; focus trapped; Escape cancels. |
| A short focused task or decision | `Dialog` with `DialogClose` buttons | Interrupts on purpose; focus trapped; Escape cancels. |
| Share targets, quick options, a picker on mobile | `BottomSheet` (with `snapPoints` for long content) | Reachable by thumb; swipe to dismiss. |
| Filters or details beside the content on large screens | `SideSheet` | Keeps context visible. |
| A list of actions from a button | `Menu` | Light, dismisses on choice, keyboard navigable. |
| A hint for an icon button | `Tooltip` | Never the only place information lives (no touch hover). |

Overlays need a title component (`DialogTitle`, `AlertDialogTitle`, `BottomSheetTitle`, `SideSheetTitle`) for their accessible name.
Open them with their `Trigger` (`render={<Button />}` to style it) so focus returns to the trigger on close. If you
open one programmatically (controlled `open` with no trigger), use the popup's `finalFocus` prop to send focus
somewhere sensible when it closes.

## Feedback and notifications

| Message | Use |
| --- | --- |
| "Photo deleted" + Undo, "Saved" | `useSnackbar().show({ message, action })`: one at a time, bottom center. Material's choice. |
| Several notifications that can pile up, with titles, types or async progress | `useToast()`: `success`, `error`, `warning`, `info`, `promise`. |
| Something the user must act on before continuing | `AlertDialog` or `Dialog`, not a snackbar or toast (they disappear). |
| A condition that persists until it's fixed (sync failing, plan expiring) | `Alert` inline, near what it's about. |
| Inline problem with a field | `TextField` `invalid` + `errorText`. |
| Page-level loading | `LinearProgress` under the app bar, or `Loading` for a branded moment. |

Both providers (`SnackbarProvider`, `ToastProvider`) go once near the root, inside any theme provider. Their hooks
must be called from Client Components.

## Async buttons

```tsx
<Button disabled={pending} icon={pending ? <CircularProgress value={null} size={20} aria-label="Saving" /> : <SaveIcon />}>
  {pending ? "Saving…" : "Save"}
</Button>
```

Keep the label meaningful while pending; don't swap the whole button for a spinner (the width jumps and the name is lost).

## Per-tenant or user-picked theme

```tsx
const theme = useMemo(() => createTheme({ colors: { seed: tenant.brandColor, variant: "fidelity" } }), [tenant.brandColor]);
return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
```

`fidelity` (or `content`) keeps the scheme close to the brand color; `expressive` reinterprets it more freely. Generate
once per seed (memoize); for a fixed brand use the CLI instead so the CSS is static.

## Next.js App Router notes

- Expressive component files carry `"use client"` when `rsc` is on, so Server Components can render them and pass
  serializable props. Event handlers and hooks (`useSnackbar`, `useToast`, controlled state) need a Client
  Component wrapper.
- Put `SnackbarProvider` / `ToastProvider` / `ThemeProvider` in a client `providers.tsx` used by `app/layout.tsx`.
- Load fonts with `next/font` and point the theme at the CSS variable (`theme --font "var(--font-x)"`).
- For dark mode without a flash, set the `.dark` class before paint (next-themes does this).
