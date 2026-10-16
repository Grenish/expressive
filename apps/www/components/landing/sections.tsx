"use client";

import * as React from "react";
import Link from "next/link";
import { Button, ToggleButton } from "@/registry/components/button";
import { Card } from "@/registry/components/card";
import { Checkbox } from "@/registry/components/checkbox";
import { FilterChip } from "@/registry/components/chip";
import { Fab } from "@/registry/components/fab";
import { LinearProgress } from "@/registry/components/progress";
import { Slider } from "@/registry/components/slider";
import { Switch } from "@/registry/components/switch";
import { TextField } from "@/registry/components/text-field";
import { ToggleIconButton } from "@/registry/components/icon-button";
import { Icon } from "@/components/icons";
import { engines, usePlayground } from "@/lib/playground";
import { Shape } from "@/registry/components/shape";
import { type MaterialShapeName, shapeLabels } from "@/registry/tokens/material-shapes";
import { MotionAdapterContext } from "@/registry/lib/use-motion";
import { useFluidLayout } from "@/registry/lib/use-fluid";
import { cn } from "@/registry/lib/utils";

/** Live components that sit next to the seed dial and re-theme with it. */
export function HeroSpecimen() {
  const [volume, setVolume] = React.useState(64);
  return (
    <Card variant="filled" shape="extra-large" className="gap-5 bg-surface-container p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-title-medium text-on-surface">Morning mix</p>
          <p className="text-body-small text-on-surface-variant">Volume {volume}</p>
        </div>
        <ToggleIconButton aria-label="Favorite" variant="tonal" defaultPressed>
          <Icon name="favorite" />
        </ToggleIconButton>
      </div>
      <Slider
        value={volume}
        onValueChange={(v) => setVolume(v as number)}
        thumbLabels={["Volume"]}
        className="[--ex-slider-gap-color:var(--ex-color-surface-container)]"
      />
      <div className="flex flex-wrap gap-2">
        <FilterChip defaultPressed>Focus</FilterChip>
        <FilterChip>Lo-fi</FilterChip>
        <FilterChip>Jazz</FilterChip>
      </div>
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-3 text-body-medium text-on-surface">
          <Switch defaultChecked icons /> Shuffle
        </label>
        <Fab icon={<Icon name="bolt" />} aria-label="Play" color="primary" />
      </div>
    </Card>
  );
}

const schemes = ["expressive", "standard"] as const;

function Track({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-label-large text-on-surface-variant">{label}</span>
      <div className="relative h-16 rounded-shape-full bg-surface-container">{children}</div>
    </div>
  );
}

const dot = (on: boolean) =>
  cn(
    // rounded-pill (half of 3rem), not the 9999px "full" corner: springing from it
    // overshoots below zero and flashes a hard square.
    "absolute top-2 left-2 size-12 bg-primary [--ex-control-height:3rem] transition-[left,border-radius,background-color] spring-spatial-default",
    on ? "left-[calc(100%-3.5rem)] rounded-shape-medium bg-tertiary" : "rounded-pill",
  );

/** Fluid: the dot jumps to its new spot and drifts there, stretching like a droplet. */
function FluidDot({ on }: { on: boolean }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  useFluidLayout(ref, { attributes: ["data-on"], motion: "fluid" });
  return <span ref={ref} data-on={on ? "" : undefined} className={cn(dot(on), "fluid:transition-[border-radius,background-color]")} />;
}

/** The same move under every motion scheme, side by side. */
export function MotionShowcase() {
  const { state } = usePlayground();
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 1800);
    return () => clearInterval(id);
  }, []);
  // Fluid needs a velocity-aware engine; use Motion here if CSS is selected.
  const fluidEngine = state.engine === "css" ? engines.motion : engines[state.engine];
  return (
    <div className="flex flex-col gap-4">
      {schemes.map((scheme) => (
        <div key={scheme} data-motion={scheme}>
          <Track label={scheme}>
            <span className={dot(on)} />
          </Track>
        </div>
      ))}
      <div data-motion="fluid">
        <MotionAdapterContext value={fluidEngine}>
          <Track label={`fluid · ${fluidEngine.name}`}>
            <FluidDot on={on} />
          </Track>
        </MotionAdapterContext>
      </div>
    </div>
  );
}

const cycle: MaterialShapeName[] = ["flower", "cookie-9", "soft-burst", "clover-4", "puffy", "heart", "sunny", "gem", "soft-boom", "cookie-4"];

/** A shape that morphs through the Material set, plus press-and-hold tiles. */
export function ShapeShowcase() {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % cycle.length), 1700);
    return () => clearInterval(id);
  }, []);
  const name = cycle[index]!;
  const tiles = [
    { label: "Pill", className: "rounded-pill [--ex-control-height:8rem] bg-primary-container text-on-primary-container" },
    { label: "Squircle", className: "rounded-shape-extra-extra-large corner-squircle bg-secondary-container text-on-secondary-container" },
    { label: "Cut", className: "rounded-shape-extra-large corner-cut bg-tertiary-container text-on-tertiary-container" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="flex flex-col items-center justify-center gap-2 rounded-shape-extra-large bg-surface-container p-6">
        <Shape name={name} className="size-36 text-primary" speed="slow" />
        <span aria-live="polite" className="text-label-large text-on-surface-variant">
          {shapeLabels[name]}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((tile) => (
          <button
            key={tile.label}
            type="button"
            className={cn(
              "state-layer focus-ring flex h-full min-h-32 cursor-pointer items-end justify-center pb-4 text-label-large",
              "transition-[border-radius,transform] spring-spatial-fast active:scale-95 active:rounded-shape-medium",
              tile.className,
            )}
          >
            {tile.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function GalleryTile({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <Card variant="outlined" shape="extra-large" className="justify-between gap-4 p-5">
      <div className="flex min-h-24 flex-1 items-center">{children}</div>
      <Link href={href} className="focus-ring group flex items-center justify-between rounded-shape-small text-title-medium text-on-surface">
        {title}
        <Icon name="arrow" className="size-5 text-on-surface-variant transition-transform spring-spatial-fast group-hover:translate-x-1" />
      </Link>
    </Card>
  );
}

export function Gallery() {
  const [progress, setProgress] = React.useState(40);
  React.useEffect(() => {
    const id = setInterval(() => setProgress((v) => (v >= 100 ? 10 : v + 9)), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <GalleryTile href="/docs/components/button" title="Button">
        <div className="flex flex-wrap gap-2">
          <Button>Save</Button>
          <ToggleButton variant="outlined">Bold</ToggleButton>
        </div>
      </GalleryTile>
      <GalleryTile href="/docs/components/text-field" title="Text field">
        <TextField label="City" variant="outlined" defaultValue="Lisbon" />
      </GalleryTile>
      <GalleryTile href="/docs/components/checkbox" title="Checkbox">
        <div className="flex flex-col text-body-medium">
          <label className="flex items-center gap-1">
            <Checkbox defaultChecked /> Flights
          </label>
          <label className="flex items-center gap-1">
            <Checkbox /> Hotel
          </label>
        </div>
      </GalleryTile>
      <GalleryTile href="/docs/components/progress" title="Progress">
        <LinearProgress value={progress} wavy aria-label="Example progress" />
      </GalleryTile>
    </div>
  );
}

export function SeedHint() {
  const { state } = usePlayground();
  return (
    <p className="text-body-small text-on-surface-variant">
      Drag the ring, or use the arrow keys. Scheme: <span className="text-on-surface">{state.variant}</span>.
    </p>
  );
}
