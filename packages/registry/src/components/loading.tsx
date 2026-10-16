"use client";

import * as React from "react";
import { Shape } from "@/registry/components/shape";
import type { MaterialShapeName } from "@/registry/tokens/material-shapes";
import { type Spring, springSettled, stepSpring } from "@/registry/lib/spring";
import { useReducedMotion } from "@/registry/lib/use-reduced-motion";
import { cn } from "@/registry/lib/utils";

/*
 * Loading indicators.
 *
 *   circular  the standard spinning arc (determinate with `value`)
 *   wavy      the same ring drawn as a wave (M3 Expressive)
 *   morph     the M3 Expressive loading indicator: morphs through a shape
 *             sequence while rotating, like Compose's LoadingIndicator
 *   shape     one shape spinning and breathing
 *   dots      three shapes bouncing in turn
 *   pulse     one shape swelling and fading
 *
 * Indicators keep animating under reduced motion (the movement is the
 * information), but large motions calm down: morphs switch instantly.
 */

export type LoadingVariant = "circular" | "wavy" | "morph" | "shape" | "dots" | "pulse";

export interface LoadingProps extends Omit<React.ComponentProps<"div">, "children"> {
  variant?: LoadingVariant;
  /** Visible text next to the indicator. Also its accessible name. */
  label?: React.ReactNode;
  labelPosition?: "end" | "bottom";
  /** Indicator size in px. */
  size?: number;
  /** circular / wavy: progress 0–100, or null (default) while the duration is unknown. */
  value?: number | null;
  /** shape / dots / pulse: which shape to use. */
  shape?: MaterialShapeName;
  /** morph: the sequence to morph through. */
  shapes?: MaterialShapeName[];
  /** morph / shape: sit on a filled circular container. */
  contained?: boolean;
}

/** Compose LoadingIndicatorDefaults.IndeterminateIndicatorPolygons. */
export const loadingSequence: MaterialShapeName[] = ["soft-burst", "cookie-9", "pentagon", "pill", "sunny", "cookie-4", "oval"];

// Compose LoadingIndicator timing.
const MORPH_INTERVAL = 650;
const GLOBAL_ROTATION_MS = 4666;
const morphSpring: Spring = { dampingRatio: 0.6, stiffness: 200 };
/** Active indicator (38dp) inside its 48dp container. */
const ACTIVE_SCALE = 38 / 48;

const spin = "[animation:ex-progress-spin_1.4s_linear_infinite]";

function Ring({ size, value, wavy }: { size: number; value: number | null; wavy: boolean }) {
  const stroke = Math.max(3, size / 12);
  const r = (size - stroke) / 2 - (wavy ? stroke * 0.6 : 0);
  const c = size / 2;
  const percent = value === null ? null : Math.min(Math.max(value, 0), 100);

  // A circle, or a circle with a sine wave around it (one wave per ~10px of circumference).
  const outline = React.useMemo(() => {
    if (!wavy) return null;
    const waves = Math.max(6, Math.round((2 * Math.PI * r) / 10));
    const amplitude = stroke * 0.55;
    const points: string[] = [];
    for (let i = 0; i <= 240; i++) {
      const a = (i / 240) * Math.PI * 2 - Math.PI / 2;
      const rr = r + amplitude * Math.sin(waves * a);
      points.push(`${(c + rr * Math.cos(a)).toFixed(2)} ${(c + rr * Math.sin(a)).toFixed(2)}`);
    }
    return `M ${points.join(" L ")} Z`;
  }, [wavy, r, c, stroke]);

  const common = { fill: "none", strokeWidth: stroke, strokeLinecap: "round" as const, pathLength: 200 };
  const shapeEl = (props: React.SVGProps<SVGPathElement> & React.SVGProps<SVGCircleElement>) =>
    outline ? <path d={outline} {...common} {...props} /> : <circle cx={c} cy={c} r={r} {...common} {...props} />;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true" className={cn("shrink-0", percent === null && spin)}>
      {percent === null ? (
        shapeEl({ className: "stroke-primary [animation:ex-progress-arc_1.4s_var(--ex-easing-emphasized)_infinite]" })
      ) : (
        <g className="origin-center -rotate-90">
          {shapeEl({ className: "stroke-secondary-container" })}
          {shapeEl({
            className: "stroke-primary transition-[stroke-dasharray] spring-spatial-slow",
            strokeDasharray: `${percent * 2} 200`,
            opacity: percent === 0 ? 0 : 1,
          })}
        </g>
      )}
    </svg>
  );
}

/** Morphs through `shapes` every 650ms, a quarter turn per morph on top of a steady spin. */
function MorphIndicator({ shapes, size }: { shapes: MaterialShapeName[]; size: number }) {
  const [index, setIndex] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const turn = React.useRef({ value: 0, velocity: 0, target: 0 });
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % shapes.length);
      // Under reduced motion keep only the steady spin; no quarter-turn jumps.
      if (!reducedMotion) turn.current.target += 90;
    }, MORPH_INTERVAL);
    return () => clearInterval(id);
  }, [shapes.length, reducedMotion]);

  React.useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const start = last;
    const tick = (now: number) => {
      const t = turn.current;
      const state = { value: t.value, velocity: t.velocity };
      stepSpring(state, t.target, morphSpring, Math.min((now - last) / 1000, 0.064));
      t.value = reducedMotion || springSettled(state, t.target, 90) ? t.target : state.value;
      t.velocity = state.velocity;
      last = now;
      const global = (((now - start) % GLOBAL_ROTATION_MS) / GLOBAL_ROTATION_MS) * 360;
      if (ref.current) ref.current.style.transform = `rotate(${(global + t.value) % 360}deg)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  return (
    <div ref={ref} className="flex items-center justify-center" style={{ width: size, height: size }}>
      <Shape name={shapes[index]!} spring={morphSpring} style={{ width: size * ACTIVE_SCALE, height: size * ACTIVE_SCALE }} className="text-primary group-data-contained:text-on-primary-container" />
    </div>
  );
}

export function Loading({
  variant = "circular",
  label,
  labelPosition = "end",
  size = 48,
  value = null,
  shape = "flower",
  shapes = loadingSequence,
  contained = false,
  className,
  "aria-label": ariaLabel,
  ...props
}: LoadingProps) {
  const labelId = React.useId();
  const determinate = (variant === "circular" || variant === "wavy") && value !== null;

  let indicator: React.ReactNode;
  switch (variant) {
    case "circular":
    case "wavy":
      indicator = <Ring size={size} value={value} wavy={variant === "wavy"} />;
      break;
    case "morph":
      indicator = <MorphIndicator shapes={shapes} size={size} />;
      break;
    case "shape":
      indicator = (
        <div className={spin} style={{ width: size, height: size, animationDuration: "2.4s" }}>
          <Shape
            name={shape}
            className="size-full text-primary [animation:ex-loading-breathe_1.2s_var(--ex-easing-emphasized)_infinite] group-data-contained:text-on-primary-container"
            style={{ scale: ACTIVE_SCALE }}
          />
        </div>
      );
      break;
    case "dots":
      indicator = (
        <div className="flex items-end justify-center gap-[12%]" style={{ width: size, height: size * 0.6 }}>
          {[0, 1, 2].map((i) => (
            <Shape
              key={i}
              name={shape}
              className="text-primary [animation:ex-loading-bounce_1.1s_var(--ex-easing-emphasized)_infinite]"
              style={{ width: size * 0.24, height: size * 0.24, animationDelay: `${i * 0.14}s` }}
            />
          ))}
        </div>
      );
      break;
    case "pulse":
      indicator = (
        <div className="relative" style={{ width: size, height: size }}>
          {[0, 1].map((i) => (
            <Shape
              key={i}
              name={shape}
              className="absolute inset-0 size-full text-primary [animation:ex-loading-pulse_1.6s_var(--ex-easing-emphasized-decelerate)_infinite]"
              style={{ animationDelay: `${i * 0.8}s` }}
            />
          ))}
        </div>
      );
      break;
  }

  if (contained && (variant === "morph" || variant === "shape")) {
    indicator = (
      <div className="grid place-items-center rounded-shape-full bg-primary-container" style={{ width: size, height: size }}>
        {indicator}
      </div>
    );
  }

  return (
    <div
      role="progressbar"
      aria-label={label ? undefined : (ariaLabel ?? "Loading")}
      aria-labelledby={label ? labelId : undefined}
      aria-valuemin={determinate ? 0 : undefined}
      aria-valuemax={determinate ? 100 : undefined}
      aria-valuenow={determinate ? Math.round(value!) : undefined}
      data-slot="loading"
      data-variant={variant}
      data-contained={contained ? "" : undefined}
      className={cn(
        "group inline-flex items-center text-on-surface-variant",
        labelPosition === "bottom" ? "flex-col gap-3" : "gap-3",
        className,
      )}
      {...props}
    >
      {indicator}
      {label && (
        <span id={labelId} className="text-body-medium">
          {label}
        </span>
      )}
    </div>
  );
}
