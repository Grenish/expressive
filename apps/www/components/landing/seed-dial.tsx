"use client";

import * as React from "react";
import { Hct, hexFromArgb } from "@material/material-color-utilities";
import { usePlayground } from "@/lib/playground";

/** Hue (0–360) → a seed with enough chroma to produce a lively scheme. */
const seedFromHue = (hue: number) => hexFromArgb(Hct.from(hue, 48, 50).toInt());
const hueFromSeed = (hex: string) => {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return Math.round(Hct.fromInt(0xff000000 | value).hue);
};

const RING = Array.from({ length: 12 }, (_, i) => seedFromHue(i * 30));

/*
 * The landing page's signature: a ring of hues. Dragging the knob (or using
 * the arrow keys) picks a new seed color, and the whole page re-themes live.
 */
export function SeedDial() {
  const { state, update } = usePlayground();
  const [hue, setHue] = React.useState(() => hueFromSeed(state.seed));
  const ref = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef(0);
  const dragging = React.useRef(false);

  // Follow seed changes made elsewhere (e.g. the Customize dialog).
  React.useEffect(() => {
    if (!dragging.current) setHue(hueFromSeed(state.seed));
  }, [state.seed]);

  const commit = React.useCallback(
    (next: number) => {
      const wrapped = ((Math.round(next) % 360) + 360) % 360;
      setHue(wrapped);
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => update({ seed: seedFromHue(wrapped) }));
    },
    [update],
  );

  const fromPointer = (event: React.PointerEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    commit((Math.atan2(y, x) * 180) / Math.PI + 90);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? 30 : 5;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") commit(hue + step);
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") commit(hue - step);
    else if (event.key === "Home") commit(0);
    else return;
    event.preventDefault();
  };

  const angle = (hue - 90) * (Math.PI / 180);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem] select-none">
      <div
        ref={ref}
        className="absolute inset-0 cursor-grab touch-none rounded-full active:cursor-grabbing"
        style={{ background: `conic-gradient(from 0deg, ${RING.join(", ")}, ${RING[0]})` }}
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          fromPointer(event);
        }}
        onPointerMove={(event) => dragging.current && fromPointer(event)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* Inner disc: the generated surface, showing the current seed. */}
        <div className="pointer-events-none absolute inset-[13%] flex flex-col items-center justify-center gap-1 rounded-full bg-surface text-center shadow-elevation-2">
          <span className="text-label-medium text-on-surface-variant">Seed color</span>
          <span className="font-display text-headline-large font-semibold tracking-tight text-on-surface">{state.seed.toUpperCase()}</span>
          <span className="flex gap-1.5 pt-2" aria-hidden="true">
            {["primary", "secondary", "tertiary", "error"].map((role) => (
              <span key={role} className="size-4 rounded-full" style={{ backgroundColor: `var(--ex-color-${role})` }} />
            ))}
          </span>
        </div>
        {/* Knob */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Seed hue"
          aria-valuemin={0}
          aria-valuemax={359}
          aria-valuenow={hue}
          aria-valuetext={`Hue ${hue}°, seed ${state.seed.toUpperCase()}`}
          onKeyDown={onKeyDown}
          className="focus-ring absolute size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-surface shadow-elevation-3 transition-transform spring-spatial-fast hover:scale-110 active:scale-95"
          style={{
            left: `${50 + Math.cos(angle) * 43.5}%`,
            top: `${50 + Math.sin(angle) * 43.5}%`,
            backgroundColor: state.seed,
          }}
        />
      </div>
    </div>
  );
}
