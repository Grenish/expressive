"use client";

import * as React from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cn } from "@/registry/lib/utils";

/*
 * Linear and circular progress indicators. Determinate when `value` is a
 * number, indeterminate when it's `null`. `wavy` draws the M3 Expressive
 * wave on the active part of a linear indicator.
 */

interface ProgressBaseProps extends Omit<BaseProgress.Root.Props, "className" | "children" | "value"> {
  value: number | null;
  className?: string;
  /** Accessible name. */
  "aria-label"?: string;
}

/** One wavelength, drawn as an SVG mask so the wave takes the indicator color. */
const wave = (length: number, height: number, stroke: number) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${length}' height='${height}' viewBox='0 0 ${length} ${height}'><path d='M0 ${height / 2} Q ${length / 4} ${stroke / 2} ${length / 2} ${height / 2} T ${length} ${height / 2}' fill='none' stroke='black' stroke-width='${stroke}' stroke-linecap='round'/></svg>`,
  )}")`;

export interface LinearProgressProps extends ProgressBaseProps {
  wavy?: boolean;
}

export function LinearProgress({ value, wavy = false, className, max = 100, min = 0, ...props }: LinearProgressProps) {
  const percent = value === null ? null : ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100;
  const height = wavy ? 10 : 4;
  const activeStyle: React.CSSProperties = wavy
    ? ({
        "--ex-wave-length": "40px",
        maskImage: wave(40, height, 4),
        maskSize: `40px ${height}px`,
        maskRepeat: "repeat-x",
        animation: "ex-progress-wave 1s linear infinite",
      } as React.CSSProperties)
    : {};

  return (
    <BaseProgress.Root
      data-slot="linear-progress"
      value={value}
      min={min}
      max={max}
      className={cn("relative flex w-full items-center", className)}
      style={{ height }}
      {...props}
    >
      {percent === null ? (
        <span className="relative h-1 w-full overflow-hidden rounded-shape-full bg-secondary-container">
          <span className="absolute inset-y-0 rounded-shape-full bg-primary [animation:ex-progress-linear_1.5s_var(--ex-easing-emphasized)_infinite]" />
        </span>
      ) : (
        <>
          {/* Active part, a 4px gap, then the remaining track and its stop dot. */}
          <span
            className="h-full rounded-shape-full bg-primary transition-[width] spring-spatial-slow"
            style={{ width: `${percent}%`, ...activeStyle }}
          />
          <span
            className="ml-1 h-1 flex-1 rounded-shape-full bg-secondary-container"
            style={{ display: percent >= 100 ? "none" : undefined }}
          />
          {percent < 100 && <span className="absolute right-0 size-1 rounded-shape-full bg-primary" />}
        </>
      )}
    </BaseProgress.Root>
  );
}

export interface CircularProgressProps extends ProgressBaseProps {
  /** Diameter in px. */
  size?: number;
}

export function CircularProgress({ value, size = 48, className, max = 100, min = 0, ...props }: CircularProgressProps) {
  const percent = value === null ? null : ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  // Leave a visual gap (in px of arc) on each side between the indicator and track.
  const gap = percent === null || percent === 0 || percent >= 100 ? 0 : stroke * 2;
  const active = percent === null ? 0 : (percent / 100) * circumference;

  return (
    <BaseProgress.Root
      data-slot="circular-progress"
      value={value}
      min={min}
      max={max}
      className={cn("inline-flex", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className={cn("-rotate-90", percent === null && "[animation:ex-progress-spin_1.4s_linear_infinite]")}
        aria-hidden="true"
      >
        {percent === null ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            pathLength={200}
            className="stroke-primary [animation:ex-progress-arc_1.4s_var(--ex-easing-emphasized)_infinite]"
          />
        ) : (
          <>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              className="stroke-secondary-container transition-[stroke-dasharray,stroke-dashoffset] spring-spatial-slow"
              strokeDasharray={`${Math.max(circumference - active - gap * 2, 0)} ${circumference}`}
              strokeDashoffset={-(active + gap)}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              className="stroke-primary transition-[stroke-dasharray] spring-spatial-slow"
              strokeDasharray={`${active} ${circumference}`}
              style={{ opacity: active === 0 ? 0 : 1 }}
            />
          </>
        )}
      </svg>
    </BaseProgress.Root>
  );
}
