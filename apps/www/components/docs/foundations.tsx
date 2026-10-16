"use client";

import * as React from "react";
import { springAt, springDuration } from "@/registry/lib/spring";
import { type SpringSpeed, type SpringType, springs } from "@/registry/tokens/motion";
import { cornerScale } from "@/registry/tokens/shape";
import { typeRoles } from "@/registry/tokens/typography";
import { Button } from "@/registry/components/button";
import { Card } from "@/registry/components/card";
import { usePlayground } from "@/lib/playground";
import { cn } from "@/registry/lib/utils";

/* Live visuals for the Foundations pages. They all read the active theme. */

const rolePairs: Array<[string, string]> = [
  ["primary", "on-primary"],
  ["primary-container", "on-primary-container"],
  ["secondary", "on-secondary"],
  ["secondary-container", "on-secondary-container"],
  ["tertiary", "on-tertiary"],
  ["tertiary-container", "on-tertiary-container"],
  ["error", "on-error"],
  ["error-container", "on-error-container"],
];

export function ColorRoles() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {rolePairs.map(([bg, fg]) => (
        <div
          key={bg}
          className="flex h-24 flex-col justify-between rounded-shape-large p-3 text-label-large"
          style={{ backgroundColor: `var(--ex-color-${bg})`, color: `var(--ex-color-${fg})` }}
        >
          <span>{bg}</span>
          <span className="text-label-small opacity-80">text: {fg}</span>
        </div>
      ))}
    </div>
  );
}

const surfaces = ["surface-container-lowest", "surface-container-low", "surface-container", "surface-container-high", "surface-container-highest"];

export function SurfaceLadder() {
  return (
    <div className="flex flex-col overflow-hidden rounded-shape-large border border-outline-variant sm:flex-row">
      {surfaces.map((name) => (
        <div
          key={name}
          className="flex h-28 flex-1 items-end p-3 text-label-medium text-on-surface"
          style={{ backgroundColor: `var(--ex-color-${name})` }}
        >
          {name.replace("surface-container", "container").replace(/^container$/, "container")}
        </div>
      ))}
    </div>
  );
}

export function TypeScale() {
  const { theme } = usePlayground();
  return (
    <div className="flex flex-col divide-y divide-outline-variant/60 rounded-shape-large border border-outline-variant">
      {typeRoles.map((role) => {
        const style = theme.typography.scale[role];
        return (
          <div key={role} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-6">
            <span className="w-36 shrink-0 font-mono text-[12px] text-on-surface-variant">
              {role}
              <span className="block text-outline">
                {style.size}/{style.lineHeight} · {style.weight}
              </span>
            </span>
            <span
              className="min-w-0 truncate text-on-surface"
              style={{
                fontFamily: `var(--ex-type-${role}-family)`,
                fontSize: `var(--ex-type-${role}-size)`,
                lineHeight: `var(--ex-type-${role}-line-height)`,
                fontWeight: `var(--ex-type-${role}-weight)`,
                letterSpacing: `var(--ex-type-${role}-tracking)`,
              }}
            >
              Springy shapes
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function CornerScale() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {Object.entries(cornerScale).map(([name, value]) => (
        <div key={name} className="flex flex-col gap-2">
          <div className="aspect-square bg-primary-container" style={{ borderRadius: `var(--ex-shape-corner-${name})` }} />
          <span className="font-mono text-[12px] text-on-surface-variant">
            {name}
            <span className="block text-outline">{value === 9999 ? "full" : `${value}px`}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function ShapeStyles() {
  const shapes = [
    ["Rounded", "rounded-shape-large"],
    ["Squircle", "rounded-shape-extra-large corner-squircle"],
    ["Cut", "rounded-shape-large corner-cut"],
    ["Pill", "rounded-pill [--ex-control-height:6rem]"],
  ];
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {shapes.map(([label, cls]) => (
        <button
          key={label}
          type="button"
          className={cn(
            "state-layer focus-ring flex h-24 cursor-pointer items-end bg-tertiary-container p-3 text-label-large text-on-tertiary-container",
            "transition-[border-radius] spring-spatial-fast active:rounded-shape-small",
            cls,
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const types: SpringType[] = ["spatial", "effects"];
const speeds: SpringSpeed[] = ["fast", "default", "slow"];
/** One hue at three strengths: fast → slow. */
const OPACITY = [1, 0.6, 0.32];

/** Plots every spring of the active motion scheme and replays them on demand. */
export function SpringPlot() {
  const { state } = usePlayground();
  const scheme = springs[state.motion];
  const [run, setRun] = React.useState(0);
  const W = 320;
  const H = 120;
  const T = 0.8; // seconds plotted

  return (
    <Card variant="outlined" shape="extra-large" className="gap-6 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-title-medium">
          Scheme: <span className="text-primary">{state.motion}</span>
          <span className="block text-body-small text-on-surface-variant">Change it with Customize → Motion.</span>
        </p>
        <Button variant="tonal" size="sm" onClick={() => setRun((r) => r + 1)}>
          Replay
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {types.map((type) => (
          <div key={type} className="flex flex-col gap-3">
            <span className="text-label-large">{type}</span>
            <svg viewBox={`-4 -16 ${W + 8} ${H + 32}`} className="w-full" role="img" aria-label={`${type} spring curves`}>
              <line x1={0} x2={W} y1={0} y2={0} className="stroke-outline-variant" strokeDasharray="4 4" />
              <line x1={0} x2={W} y1={H} y2={H} className="stroke-outline-variant" />
              {speeds.map((speed, i) => {
                const spring = scheme[type][speed];
                const points = Array.from({ length: 81 }, (_, k) => {
                  const t = (k / 80) * T;
                  return `${(k / 80) * W},${H - springAt(spring, t) * H}`;
                }).join(" ");
                return (
                  <polyline
                    key={speed}
                    points={points}
                    fill="none"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    style={{ stroke: "var(--ex-color-primary)", strokeOpacity: OPACITY[i] }}
                  />
                );
              })}
            </svg>
            <div className="flex flex-col gap-2">
              {speeds.map((speed, i) => (
                <div key={speed} className="flex items-center gap-3">
                  <span className="w-16 text-label-medium text-on-surface-variant">{speed}</span>
                  <div className="relative h-6 flex-1 rounded-shape-full bg-surface-container">
                    <span
                      key={run}
                      className="absolute top-1 left-1 size-4 rounded-shape-full"
                      style={{
                        backgroundColor: "var(--ex-color-primary)",
                        opacity: OPACITY[i],
                        animation: `ex-spring-demo var(--ex-spring-${type}-${speed}-duration) var(--ex-spring-${type}-${speed}-easing) forwards`,
                      }}
                    />
                  </div>
                  <span className="w-14 text-right font-mono text-[12px] text-on-surface-variant">{springDuration(scheme[type][speed])}ms</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ElevationLevels() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
      {[0, 1, 2, 3, 4, 5].map((level) => (
        <div
          key={level}
          className="flex h-24 items-end rounded-shape-large bg-surface-container-low p-3 text-label-large"
          style={{ boxShadow: `var(--ex-elevation-${level})` }}
        >
          Level {level}
        </div>
      ))}
    </div>
  );
}

export function StateLayers() {
  const states: Array<[string, string]> = [
    ["Enabled", "0"],
    ["Hover", "var(--ex-state-hover)"],
    ["Focus", "var(--ex-state-focus)"],
    ["Pressed", "var(--ex-state-pressed)"],
    ["Dragged", "var(--ex-state-dragged)"],
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {states.map(([label, opacity]) => (
        <div key={label} className="relative isolate flex h-20 items-end overflow-hidden rounded-shape-medium bg-primary-container p-3 text-label-large text-on-primary-container">
          <span className="absolute inset-0 -z-10 bg-current" style={{ opacity }} />
          {label}
        </div>
      ))}
    </div>
  );
}
