"use client";

import * as React from "react";
import { Hct, hexFromArgb } from "@material/material-color-utilities";
import type { SchemeVariant } from "@/registry/tokens/colors";
import { usePlayground } from "@/lib/playground";
import { cn } from "@/registry/lib/utils";

/** Hue (0–360) → a seed with enough chroma to produce a lively scheme. */
const seedFromHue = (hue: number) => hexFromArgb(Hct.from(hue, 48, 50).toInt());
const hueFromSeed = (hex: string) => {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return Math.round(Hct.fromInt(0xff000000 | value).hue);
};

const TICKS = Array.from({ length: 72 }, (_, i) => ({ angle: i * 5, major: i % 6 === 0, color: seedFromHue(i * 5) }));
const VARIANTS: SchemeVariant[] = ["expressive", "tonal-spot", "vibrant", "monochrome"];

/*
 * The landing page's instrument: a rotary encoder for the seed color. Turn it
 * (drag, or arrow keys) and every surface on the site regenerates from the new
 * seed. The knob springs to rest; the readout shows what the system derived.
 */
export function SeedKnob() {
  const { state, update } = usePlayground();
  const [hue, setHue] = React.useState(() => hueFromSeed(state.seed));
  const [dragging, setDragging] = React.useState(false);
  const area = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef(0);
  // Unwrapped rotation, so turning past 360° keeps spinning the same way instead of snapping back.
  const [turn, setTurn] = React.useState(() => hueFromSeed(state.seed));

  React.useEffect(() => {
    if (dragging) return;
    const next = hueFromSeed(state.seed);
    setHue(next);
    setTurn((t) => t + ((((next - t) % 360) + 540) % 360) - 180);
  }, [state.seed, dragging]);

  const commit = React.useCallback(
    (next: number) => {
      const wrapped = ((Math.round(next) % 360) + 360) % 360;
      setHue(wrapped);
      setTurn((t) => t + ((((wrapped - t) % 360) + 540) % 360) - 180);
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => update({ seed: seedFromHue(wrapped) }));
    },
    [update],
  );

  const fromPointer = (event: React.PointerEvent) => {
    const rect = area.current!.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    commit((Math.atan2(y, x) * 180) / Math.PI + 90);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? 30 : 5;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") commit(hue + step);
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") commit(hue - step);
    else if (event.key === "Home") commit(0);
    else if (event.key === "End") commit(355);
    else return;
    event.preventDefault();
  };

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div
        ref={area}
        className="relative aspect-square w-full max-w-[22rem] cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={(event) => {
          setDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
          fromPointer(event);
        }}
        onPointerMove={(event) => dragging && fromPointer(event)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        {/* The scale: a colored tick per 5° of hue, longer every 30°. */}
        <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 size-full">
          {TICKS.map((tick) => {
            const a = ((tick.angle - 90) * Math.PI) / 180;
            const r0 = tick.major ? 84 : 88;
            const near = Math.abs(((tick.angle - hue + 540) % 360) - 180) <= 2.5;
            return (
              <line
                key={tick.angle}
                x1={100 + Math.cos(a) * r0}
                y1={100 + Math.sin(a) * r0}
                x2={100 + Math.cos(a) * 97}
                y2={100 + Math.sin(a) * 97}
                stroke={tick.color}
                strokeWidth={near ? 3.2 : tick.major ? 2.2 : 1.4}
                strokeLinecap="round"
                opacity={near ? 1 : 0.85}
              />
            );
          })}
        </svg>
        {/* The knob: knurled rim, soft-lit body, an indicator in the seed color. Springs to rest when let go. */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Seed color hue"
          aria-valuemin={0}
          aria-valuemax={359}
          aria-valuenow={hue}
          aria-valuetext={`Hue ${hue}°, seed ${state.seed.toUpperCase()}`}
          onKeyDown={onKeyDown}
          className={cn(
            "focus-ring absolute inset-[15%] rounded-full",
            "bg-[radial-gradient(circle_at_34%_28%,var(--ex-color-surface-container-lowest),var(--ex-color-surface-container-highest)_78%)]",
            "shadow-[0_28px_44px_-16px_rgb(0_0_0/0.4),0_6px_10px_-4px_rgb(0_0_0/0.18),inset_0_2px_1px_rgb(255_255_255/0.55),inset_0_-8px_14px_rgb(0_0_0/0.08)]",
            !dragging && "transition-transform spring-spatial-default",
          )}
          style={{ transform: `rotate(${turn}deg)` }}
        >
          <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[repeating-conic-gradient(rgb(0_0_0/0.16)_0_1.5deg,transparent_1.5deg_4.5deg)] [mask:radial-gradient(circle,transparent_82%,black_83%)]" />
          <span aria-hidden="true" className="absolute inset-[24%] rounded-full bg-[radial-gradient(circle_at_60%_70%,var(--ex-color-surface-container-lowest),var(--ex-color-surface-container)_80%)] shadow-[inset_0_3px_8px_rgb(0_0_0/0.1)]" />
          <span aria-hidden="true" className="absolute top-[6%] left-1/2 size-[9%] -translate-x-1/2 rounded-full shadow-[inset_0_1px_2px_rgb(0_0_0/0.3)]" style={{ backgroundColor: state.seed }} />
        </div>
      </div>

      {/* Readout: what the system derived from the seed. */}
      <div className="w-full max-w-[22rem] rounded-shape-large bg-inverse-surface p-4 font-mono text-[12px] leading-6 text-inverse-on-surface">
        <div className="flex justify-between">
          <span className="opacity-60">seed</span>
          <span>{state.seed.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-60">hue</span>
          <span>{String(hue).padStart(3, "0")}°</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="opacity-60">roles</span>
          <span className="flex gap-1.5" aria-hidden="true">
            {["primary", "secondary", "tertiary", "error"].map((role) => (
              <span key={role} className="size-4 rounded-[4px] ring-1 ring-inverse-on-surface/20" style={{ backgroundColor: `var(--ex-color-${role})` }} />
            ))}
          </span>
        </div>
      </div>
      <div role="radiogroup" aria-label="Scheme variant" className="flex w-full max-w-[22rem] flex-wrap justify-center gap-1">
        {VARIANTS.map((variant) => (
          <button
            key={variant}
            type="button"
            role="radio"
            aria-checked={state.variant === variant}
            onClick={() => update({ variant })}
            className={cn(
              "state-layer focus-ring cursor-pointer rounded-shape-full px-2.5 py-1.5 font-mono text-[11px] lowercase",
              state.variant === variant ? "bg-on-secondary-container text-secondary-container" : "text-on-secondary-container",
            )}
          >
            {variant}
          </button>
        ))}
      </div>
    </div>
  );
}
