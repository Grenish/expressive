# Motion

M3 Expressive animates with **springs**, not fixed durations and easing curves. Expressive keeps every spring in
`lib/expressive/tokens/motion.ts` and runs state changes as CSS transitions whose easing is a `linear()` curve
sampled from the spring, so most motion costs no JavaScript and works with server rendering.

## Spring types

| Type | Animates | Overshoot | Utilities |
| --- | --- | --- | --- |
| **spatial** | position, size, scale, rotation, border radius | yes (bouncy in `expressive`) | `spring-spatial-fast`, `spring-spatial-default`, `spring-spatial-slow` |
| **effects** | color, opacity, shadow | never | `spring-effects-fast`, `spring-effects-default`, `spring-effects-slow` |

Pick the type by **what** changes, not how big the element is. Pick the speed by size and distance: `fast` for
small things (buttons, switches, chips), `default` for medium (dialogs, sheets, indicators that travel), `slow` for
large or full-screen.

```tsx
<div className="transition-[transform,border-radius] spring-spatial-fast active:scale-95 active:rounded-shape-medium" />
<div className="transition-opacity spring-effects-default data-starting-style:opacity-0" />
```

A `spring-*` utility sets `transition-duration` and `transition-timing-function`; pair it with a `transition-…`
property list. When one element animates both spatial and effects properties with different springs, write the
`transition` shorthand with the variables, as the dialog does:

```tsx
className="[transition:transform_var(--ex-spring-spatial-default-duration)_var(--ex-spring-spatial-default-easing),opacity_var(--ex-spring-effects-default-duration)_var(--ex-spring-effects-default-easing)]"
```

**Never** write `duration-300 ease-in-out` or `cubic-bezier(...)` for UI state changes: they won't follow the motion
scheme or reduced motion.

## Schemes

| Scheme | Feel | Spatial springs (fast / default / slow) |
| --- | --- | --- |
| `expressive` (default) | Lively, with visible overshoot | damping 0.6 / 0.8 / 0.8 |
| `standard` | Calm, damped, utilitarian | damping 0.9 throughout |
| `fluid` | Soft and liquid: elements stretch, squash and wobble | low stiffness; needs the Motion or GSAP engine |

Set the default for the app with `npx @grenishrai/expressive theme --scheme standard` or
`createTheme({ motion: { scheme: "standard" } })`. Override per component with the `motion` prop, which every
animated component accepts:

```tsx
<Button motion="standard">Save</Button>
<DialogContent motion="expressive">…</DialogContent>
<Switch motion="none" />  {/* no animation for this one */}
```

Choosing: `expressive` for consumer, playful or brand-forward products; `standard` for dense productivity and data
tools; `fluid` for a signature, tactile feel where performance budgets allow (it runs per-frame JavaScript).

## Fluid motion

Fluid treats elements like droplets. Four behaviors, driven by real springs and the element's velocity:

- **Stretch with speed**: moving elements elongate along their direction and wobble back (the switch handle).
- **Press jelly**: buttons, icon buttons, FABs and chips squash on press and spring back.
- **Touch response**: crossing a control quickly gives it a small squash.
- **Gooey arrivals**: checkboxes, radios and navigation indicators swell in; dialogs swell up from below.

Requirements: the **Motion** or **GSAP** engine. With the CSS engine, `fluid` falls back to `expressive` and logs one
warning. The CLI won't pair fluid with CSS:

```bash
npx @grenishrai/expressive init --scheme fluid               # picks the Motion engine
npx @grenishrai/expressive theme --scheme fluid --motion gsap
```

Tuning:

```tsx
createTheme({
  motion: {
    scheme: "fluid",
    fluid: { viscosity: 0.045, maxStretch: 0.3, squash: 0.07, wobble: 0.32 },
  },
});
```

### Fluid in custom components

```tsx
import { useRef } from "react";
import { useFluidLayout, useFluidPop, useFluidPress } from "@/lib/expressive/use-fluid";

function Chip({ selected }: { selected: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  useFluidPress(ref);                                   // squash on press
  useFluidPop(ref, { attributes: ["data-selected"] });  // jelly when it becomes selected
  return <button ref={ref} data-selected={selected ? "" : undefined} className="fluid:transition-colors" />;
}

function Indicator({ index }: { index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useFluidLayout(ref, { attributes: ["data-index"] });  // drift + stretch to the new layout (FLIP)
  return <span ref={ref} data-index={index} style={{ left: index * 96 }} className="absolute fluid:transition-none" />;
}
```

The hooks do nothing unless the element's scheme is fluid and the engine supports it. While active, the element has
`data-fluid`; use the `fluid:` variant to turn off CSS transitions of the properties the hooks animate (usually
`transform`) so the two don't fight. `useFluidEnter()` returns a callback ref for elements that mount when opened
(popups). `useComposedRef(a, b)` combines refs.

## Imperative animation: useMotion

For animations triggered in code (not by a state attribute):

```tsx
import { useRef } from "react";
import { useMotion } from "@/lib/expressive/use-motion";

function Pop() {
  const ref = useRef<HTMLDivElement>(null);
  const { animate, reducedMotion } = useMotion(); // or useMotion("standard")
  const pop = () => animate(ref.current, { transform: ["scale(0.8)", "scale(1)"] }, { type: "spatial", speed: "fast" });
  return <div ref={ref} onClick={pop} />;
}
```

`animate(element, keyframes, { type, speed, delay })` returns `{ finished, cancel }`. It reads the element's scheme
(the `motion` argument, else `--ex-motion-scheme` from the theme), and under reduced motion or `"none"` jumps to the
last keyframe. Override the engine for a subtree with `<MotionAdapterContext value={adapter}>`.

## Engines

`tokens/motion.ts` picks the engine with one export line. `npx @grenishrai/expressive theme --motion <engine>` edits it
and installs the adapter.

```tsx
export { adapter } from "@/lib/expressive/adapters/css";       // default, no dependency
// export { adapter } from "@/lib/expressive/adapters/motion"; // Motion (formerly Framer Motion)
// export { adapter } from "@/lib/expressive/adapters/gsap";   // GSAP
```

| Engine | Dependency | Fluid | Choose when |
| --- | --- | --- | --- |
| CSS (Web Animations) | none | no | Default. Smallest bundle; everything except fluid. |
| Motion | `motion` | yes | The app already uses Motion, or you want fluid. |
| GSAP | `gsap` | yes | The app already uses GSAP, or you want fluid. |

Custom engine: implement `MotionAdapter` (`{ name, animate(element, keyframes, { spring, delay }) }`) using
`springDuration(spring)` and `springToLinear(spring)` from `@/lib/expressive/spring`.

Using Motion or GSAP for your own animations alongside Expressive is fine. Read spring values with
`getSpring(scheme, type, speed)` from `tokens/motion.ts` (returns `{ dampingRatio, stiffness }`) to stay consistent.

## Enter and exit with Base UI

Base UI popups (dialog, menu, tooltip, drawer/sheets, toast) set `data-starting-style` on mount and
`data-ending-style` before unmount, and wait for transitions to finish. Animate between them with spring utilities:

```tsx
className="origin-(--transform-origin) transition-[transform,opacity] spring-spatial-fast data-starting-style:scale-90 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0"
```

## Reduced motion

With `prefers-reduced-motion: reduce`, every spring duration becomes 0, `useMotion` jumps to the final state, ripples
are skipped and fluid deformation is off. Nothing extra is needed when you use the utilities and hooks. Indeterminate
progress keeps moving, because the movement is the information. `motion="none"` does the same for one component.
