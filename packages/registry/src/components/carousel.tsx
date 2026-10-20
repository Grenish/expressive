"use client";

import * as React from "react";
import { cn } from "@/registry/lib/utils";
import { useReducedMotion } from "@/registry/lib/use-reduced-motion";

/*
 * Carousel (M3): a row of visual items that scrolls sideways, snapping item by
 * item. In the `multi-browse` and `hero` layouts, items cut off at the edges
 * are masked into rounded tiles and their content shifts gently as they move
 * (M3's parallax), instead of being sliced by the edge. `uncontained` lets
 * items run off the edge as they are.
 *
 * Native scrolling does the work (touch, trackpad, Shift+wheel, arrow keys on
 * the focused row), so it stays smooth; a mouse can drag the row, and the
 * buttons scroll one item at a time.
 *
 *   <Carousel aria-label="Featured trips">
 *     <CarouselItem><img src="…" alt="Lisbon" /></CarouselItem>
 *   </Carousel>
 */

type Layout = "multi-browse" | "hero" | "uncontained";

const itemWidth: Record<Layout, string> = {
  "multi-browse": "w-[min(18rem,72%)] snap-start",
  hero: "w-[86%] snap-center",
  uncontained: "w-[min(16rem,64%)] snap-start",
};

const ItemContext = React.createContext<{ index: number; count: number; layout: Layout; name: (index: number, count: number) => string } | null>(null);

export interface CarouselProps extends Omit<React.ComponentProps<"section">, "aria-label"> {
  /** Names the carousel (required: it's a landmark-like region). */
  "aria-label": string;
  layout?: Layout;
  /** Item height. */
  height?: string;
  /** Show previous/next buttons. */
  controls?: boolean;
  /** Labels, for translation. */
  labels?: { previous?: string; next?: string; slide?: (index: number, count: number) => string };
}

export function Carousel({
  className,
  layout = "multi-browse",
  height = "16rem",
  controls = true,
  labels,
  children,
  style,
  ...props
}: CarouselProps) {
  const viewport = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [edges, setEdges] = React.useState({ start: true, end: false });
  const count = React.Children.count(children);
  const slideName = labels?.slide ?? ((index: number, total: number) => `${index + 1} of ${total}`);

  React.useEffect(() => {
    const root = viewport.current;
    if (!root) return;
    const masked = layout !== "uncontained";

    /*
     * Geometry is measured once (and again only when sizes change), in the
     * row's scroll coordinates. Each scroll frame then reads a single number,
     * scrollLeft, and does arithmetic: no layout reads interleaved with style
     * writes, which would force a fresh layout per item per frame.
     */
    type Slot = { item: HTMLElement; media: HTMLElement | null; start: number; width: number; clip: string; shift: string };
    let slots: Slot[] = [];
    let viewWidth = 0;
    let maxScroll = 0;
    let radius = 0;
    let atStart = true;
    let atEnd = false;

    const measure = () => {
      const box = root.getBoundingClientRect();
      viewWidth = root.clientWidth;
      maxScroll = root.scrollWidth - root.clientWidth;
      radius = parseFloat(getComputedStyle(root).getPropertyValue("--ex-shape-corner-extra-large")) || 28;
      slots = Array.from(root.querySelectorAll<HTMLElement>('[data-slot="carousel-item"]'), (item) => {
        const rect = item.getBoundingClientRect();
        return {
          item,
          media: item.querySelector<HTMLElement>('[data-slot="carousel-media"]'),
          // Position in scroll coordinates (works for RTL, where scrollLeft is negative).
          start: rect.left - box.left + root.scrollLeft,
          width: rect.width,
          clip: item.style.clipPath,
          shift: "",
        };
      });
    };

    const update = () => {
      const scroll = root.scrollLeft;
      for (const slot of slots) {
        const left = slot.start - scroll;
        const before = Math.max(0, Math.min(slot.width, -left));
        const after = Math.max(0, Math.min(slot.width, left + slot.width - viewWidth));
        // Mask the part outside the row so a peeking item reads as a smaller rounded tile…
        const clip = masked && (before || after) ? `inset(0 ${after.toFixed(1)}px 0 ${before.toFixed(1)}px round ${radius}px)` : "";
        // …and slide its content toward the visible part (parallax), on the compositor.
        const shift = masked && (before || after) ? `translate3d(${((before - after) / 2).toFixed(1)}px,0,0)` : "";
        if (clip !== slot.clip) slot.item.style.clipPath = slot.clip = clip;
        if (slot.media && shift !== slot.shift) slot.media.style.transform = slot.shift = shift;
      }
      // Re-render only when an end is reached or left, not on every frame.
      const scrolled = Math.abs(scroll);
      const start = scrolled <= 1;
      const end = scrolled >= maxScroll - 1;
      if (start !== atStart || end !== atEnd) {
        atStart = start;
        atEnd = end;
        setEdges({ start, end });
      }
    };

    let frame = 0;
    const schedule = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
    };
    const remeasure = () => {
      measure();
      update();
    };

    /*
     * Mouse drag: touch and trackpads scroll natively, but a mouse can only
     * use the buttons or Shift+wheel, so let it grab the row. Snapping is off
     * while dragging and comes back on release, which snaps to the nearest
     * item. A drag never counts as a click on the item underneath.
     */
    let drag: { x: number; scroll: number; moved: boolean } | null = null;
    const down = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag = { x: event.clientX, scroll: root.scrollLeft, moved: false };
    };
    const move = (event: PointerEvent) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < 4) return;
      if (!drag.moved) {
        drag.moved = true;
        root.setPointerCapture(event.pointerId);
        root.style.scrollSnapType = "none";
        root.style.cursor = "grabbing";
      }
      root.scrollLeft = drag.scroll - dx;
    };
    const up = (event: PointerEvent) => {
      if (!drag) return;
      if (drag.moved) {
        root.releasePointerCapture(event.pointerId);
        root.style.cursor = "";
        // Restoring snap makes the browser settle on the nearest item.
        root.style.scrollSnapType = "";
        const suppress = (click: MouseEvent) => {
          click.preventDefault();
          click.stopPropagation();
        };
        root.addEventListener("click", suppress, { capture: true, once: true });
        setTimeout(() => root.removeEventListener("click", suppress, { capture: true }));
      }
      drag = null;
    };
    // Images are draggable by default, which would hijack the gesture.
    const noNativeDrag = (event: DragEvent) => event.preventDefault();

    remeasure();
    setEdges({ start: atStart, end: atEnd });
    root.addEventListener("scroll", schedule, { passive: true });
    root.addEventListener("pointerdown", down);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerup", up);
    root.addEventListener("pointercancel", up);
    root.addEventListener("dragstart", noNativeDrag);
    const resize = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(() => requestAnimationFrame(remeasure));
    resize?.observe(root);
    for (const slot of slots) resize?.observe(slot.item);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("scroll", schedule);
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointercancel", up);
      root.removeEventListener("dragstart", noNativeDrag);
      resize?.disconnect();
    };
  }, [layout, count]);

  const step = (direction: 1 | -1) => {
    const root = viewport.current;
    const item = root?.querySelector<HTMLElement>('[data-slot="carousel-item"]');
    if (!root || !item) return;
    const rtl = getComputedStyle(root).direction === "rtl" ? -1 : 1;
    root.scrollBy({ left: direction * rtl * (item.offsetWidth + 8), behavior: reducedMotion ? "auto" : "smooth" });
  };

  const arrow = (d: string) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="size-6 rtl:-scale-x-100">
      <path d={d} />
    </svg>
  );
  const button =
    "state-layer focus-ring inline-flex size-10 cursor-pointer items-center justify-center rounded-shape-full bg-secondary-container text-on-secondary-container disabled:cursor-default disabled:opacity-(--ex-disabled-content)";

  return (
    <section
      data-slot="carousel"
      data-layout={layout}
      aria-roledescription="carousel"
      className={cn("flex w-full min-w-0 flex-col gap-3", className)}
      style={{ "--ex-carousel-height": height, ...style } as React.CSSProperties}
      {...props}
    >
      <div
        ref={viewport}
        tabIndex={0}
        className={cn(
          "focus-ring flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain rounded-shape-extra-large select-none pointer-fine:cursor-grab",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          layout === "uncontained" && "rounded-none",
        )}
      >
        {React.Children.map(children, (child, index) => (
          <ItemContext value={{ index, count, layout, name: slideName }}>{child}</ItemContext>
        ))}
      </div>
      {controls && count > 1 && (
        <div className="flex justify-end gap-2">
          <button type="button" aria-label={labels?.previous ?? "Previous"} disabled={edges.start} onClick={() => step(-1)} className={button}>
            {arrow("M14 18 8 12l6-6 1.4 1.4-4.6 4.6 4.6 4.6Z")}
          </button>
          <button type="button" aria-label={labels?.next ?? "Next"} disabled={edges.end} onClick={() => step(1)} className={button}>
            {arrow("M12.6 12 8 7.4 9.4 6l6 6-6 6L8 16.6Z")}
          </button>
        </div>
      )}
    </section>
  );
}

export interface CarouselItemProps extends React.ComponentProps<"div"> {
  /** Visible text over the bottom of the item, e.g. a title. */
  label?: React.ReactNode;
}

export function CarouselItem({ className, label, children, ...props }: CarouselItemProps) {
  const context = React.useContext(ItemContext);
  const layout = context?.layout ?? "multi-browse";
  const name = context?.name(context.index, context.count);
  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      aria-label={name}
      className={cn(
        "relative h-(--ex-carousel-height) shrink-0 overflow-hidden rounded-shape-extra-large bg-surface-container-highest",
        itemWidth[layout],
        className,
      )}
      {...props}
    >
      {/* Media fills the item; the parallax shift moves it toward the visible part. */}
      <div
        data-slot="carousel-media"
        className="size-full will-change-transform [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover"
      >
        {children}
      </div>
      {label && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-inverse-surface/75 to-transparent p-4 pt-10 text-title-medium text-inverse-on-surface">
          {label}
        </div>
      )}
    </div>
  );
}
