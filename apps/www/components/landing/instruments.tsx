"use client";

import * as React from "react";
import Link from "next/link";
import { Button, ToggleButton } from "@/registry/components/button";
import { Checkbox } from "@/registry/components/checkbox";
import { AssistChip, FilterChip } from "@/registry/components/chip";
import { Dialog, DialogActions, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/registry/components/dialog";
import { Fab } from "@/registry/components/fab";
import { ToggleIconButton } from "@/registry/components/icon-button";
import { Loading } from "@/registry/components/loading";
import { NavigationBar, NavigationBarItem } from "@/registry/components/navigation-bar";
import { CircularProgress, LinearProgress } from "@/registry/components/progress";
import { Shape } from "@/registry/components/shape";
import { Slider } from "@/registry/components/slider";
import { useSnackbar } from "@/registry/components/snackbar";
import { Switch } from "@/registry/components/switch";
import { TextField } from "@/registry/components/text-field";
import { type MaterialShapeName, shapeLabels } from "@/registry/tokens/material-shapes";
import { cn } from "@/registry/lib/utils";
import { Icon } from "@/components/icons";

/*
 * The instruments: one real component per tile, played in place. Tiles sit
 * edge to edge on flat fields drawn from the current scheme, so the grid is
 * also a reading of the palette. Labels stay small and lowercase; specs are
 * mono. The only shadows belong to the components themselves.
 */

const FIELDS = {
  low: "bg-surface-container-low text-on-surface",
  high: "bg-surface-container-high text-on-surface",
  highest: "bg-surface-container-highest text-on-surface",
  primary: "bg-primary-container text-on-primary-container",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
  bold: "bg-primary text-on-primary",
  // A dark device: the subtree switches to the dark scheme, so its component renders as it would in dark mode.
  device: "dark bg-surface-container-lowest text-on-surface",
} as const;

import { spec } from "@/components/landing/tokens";

function Tile({
  index,
  name,
  href,
  detail,
  field,
  className,
  children,
}: {
  index: string;
  name: string;
  href: string;
  detail: string;
  field: keyof typeof FIELDS;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative flex min-h-[21rem] flex-col p-5 sm:min-h-[24rem]", FIELDS[field], className)}>
      <span className={cn(spec, "opacity-60")}>{index}</span>
      <div className="flex flex-1 items-center justify-center py-8">{children}</div>
      <div className="flex items-end justify-between gap-4">
        <Link href={href} className="focus-ring group flex items-center gap-1.5 rounded-shape-extra-small text-body-large">
          {name}
          <Icon name="arrow" className="size-4 opacity-50 transition-transform spring-spatial-fast group-hover:translate-x-1 group-hover:opacity-100" />
        </Link>
        <span className={cn(spec, "text-right opacity-60")}>{detail}</span>
      </div>
    </div>
  );
}

const SHAPES: MaterialShapeName[] = ["flower", "cookie-9", "soft-burst", "clover-4", "puffy", "heart", "sunny", "gem", "soft-boom", "cookie-4", "arch", "pixel-circle"];

function ShapeInstrument() {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SHAPES.length), 2200);
    return () => clearInterval(id);
  }, []);
  const name = SHAPES[index]!;
  return (
    <button
      type="button"
      onClick={() => setIndex((i) => (i + 1) % SHAPES.length)}
      aria-label={`Morph to the next shape (now ${shapeLabels[name]})`}
      className="focus-ring flex cursor-pointer flex-col items-center gap-3 rounded-shape-large"
    >
      <Shape name={name} className="size-40 text-on-tertiary-container drop-shadow-[0_14px_18px_rgb(0_0_0/0.18)]" speed="slow" />
      <span aria-live="polite" className={cn(spec, "opacity-70")}>
        {shapeLabels[name]}
      </span>
    </button>
  );
}

function SliderInstrument() {
  const [value, setValue] = React.useState(64);
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-6">
      <span className="font-display text-[5.5rem] leading-none font-semibold tracking-tight tabular-nums">{value}</span>
      <Slider
        value={value}
        onValueChange={(v) => setValue(v as number)}
        thumbLabels={["Level"]}
        className="w-full [--ex-slider-gap-color:var(--ex-color-surface-container-low)]"
      />
    </div>
  );
}

const NAV = [
  { id: "home", label: "Home", icon: "home" },
  { id: "inbox", label: "Inbox", icon: "inbox", badge: 3 },
  { id: "files", label: "Files", icon: "folder" },
  { id: "profile", label: "You", icon: "person" },
] as const;

function NavigationInstrument() {
  const [active, setActive] = React.useState<string>("inbox");
  return (
    <div className="w-full max-w-md overflow-hidden rounded-shape-extra-large shadow-elevation-2">
      <div className="grid h-36 place-items-center bg-surface text-title-medium text-on-surface">{NAV.find((item) => item.id === active)?.label}</div>
      <NavigationBar aria-label="Example">
        {NAV.map((item) => (
          <NavigationBarItem
            key={item.id}
            render={<button type="button" />}
            onClick={() => setActive(item.id)}
            active={active === item.id}
            icon={<Icon name={item.icon} />}
            label={item.label}
            badge={"badge" in item ? item.badge : undefined}
          />
        ))}
      </NavigationBar>
    </div>
  );
}

function ProgressInstrument() {
  const [value, setValue] = React.useState(35);
  React.useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 8 : v + 7)), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-8">
      <CircularProgress value={value} size={88} aria-label="Example progress" />
      <LinearProgress value={value} wavy aria-label="Example wavy progress" className="w-full" />
    </div>
  );
}

function SnackbarInstrument() {
  const snackbar = useSnackbar();
  const [deleted, setDeleted] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className={cn("grid size-28 place-items-center rounded-shape-extra-large bg-surface shadow-elevation-1 transition-[opacity,scale] spring-spatial-default", deleted && "scale-75 opacity-0")}>
        <Shape name="sunny" className="size-14 text-primary" />
      </div>
      <Button
        variant="tonal"
        icon={<Icon name="delete" />}
        onClick={() => {
          setDeleted(true);
          snackbar.show({ message: "Photo deleted", action: { label: "Undo", onClick: () => setDeleted(false) } });
        }}
        disabled={deleted}
      >
        Delete photo
      </Button>
    </div>
  );
}

/** A sample of the components, all live and themed by the knob. */
export function Instruments() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Tile index="01" name="button" href="/docs/components/button" detail="morphs on press" field="primary" className="sm:col-span-2">
        <div className="flex flex-col items-center gap-5">
          <Button size="lg" icon={<Icon name="bolt" />}>
            Press me
          </Button>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="tonal">Tonal</Button>
            <Button variant="elevated">Elevated</Button>
            <ToggleButton variant="tonal" defaultPressed>
              Toggle
            </ToggleButton>
          </div>
        </div>
      </Tile>
      <Tile index="02" name="switch" href="/docs/components/switch" detail="growing handle" field="secondary">
        <div className="flex scale-[1.6] flex-col items-center gap-5">
          <Switch defaultChecked icons aria-label="Example switch, on" />
          <Switch aria-label="Example switch, off" />
        </div>
      </Tile>
      <Tile index="03" name="slider" href="/docs/components/slider" detail="bar handle" field="low">
        <SliderInstrument />
      </Tile>

      <Tile index="04" name="shape" href="/docs/components/shape" detail="35 shapes" field="tertiary">
        <ShapeInstrument />
      </Tile>
      <Tile index="05" name="loading" href="/docs/components/loading" detail="morph · 650 ms" field="device">
        <Loading variant="morph" contained size={112} label="Loading" labelPosition="bottom" />
      </Tile>
      <Tile index="06" name="navigation bar" href="/docs/components/navigation-bar" detail="springy indicator" field="high" className="sm:col-span-2">
        <NavigationInstrument />
      </Tile>

      <Tile index="07" name="chips" href="/docs/components/chip" detail="filter · assist" field="highest">
        <div className="flex max-w-60 flex-wrap justify-center gap-2">
          <FilterChip defaultPressed>Jazz</FilterChip>
          <FilterChip>Soul</FilterChip>
          <FilterChip defaultPressed>Lo-fi</FilterChip>
          <FilterChip>Focus</FilterChip>
          <AssistChip icon={<Icon name="event" />}>Add to calendar</AssistChip>
        </div>
      </Tile>
      <Tile index="08" name="fab" href="/docs/components/fab" detail="3 sizes · extended" field="bold">
        <div className="flex flex-col items-center gap-5">
          <Fab size="large" color="primary-container" icon={<Icon name="add" />} aria-label="Create" />
          <Fab color="tertiary-container" icon={<Icon name="edit" />} label="Compose" />
        </div>
      </Tile>
      <Tile index="09" name="text field" href="/docs/components/text-field" detail="floating label" field="low">
        <div className="flex w-full max-w-xs flex-col gap-4">
          <TextField label="Email" variant="outlined" defaultValue="ada@expressive.dev" />
          <TextField label="City" defaultValue="Lisbon" />
        </div>
      </Tile>
      <Tile index="10" name="checkbox" href="/docs/components/checkbox" detail="springy check" field="secondary">
        <div className="flex flex-col gap-1 text-body-large">
          <label className="flex items-center gap-2">
            <Checkbox defaultChecked /> Flights
          </label>
          <label className="flex items-center gap-2">
            <Checkbox defaultChecked /> Hotel
          </label>
          <label className="flex items-center gap-2">
            <Checkbox /> Car rental
          </label>
        </div>
      </Tile>

      <Tile index="11" name="icon button" href="/docs/components/icon-button" detail="toggle · 3 widths" field="high">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ToggleIconButton aria-label="Favorite" variant="filled" size="lg" defaultPressed>
            <Icon name="favorite" />
          </ToggleIconButton>
          <ToggleIconButton aria-label="Star" variant="tonal" size="md" width="wide">
            <Icon name="star" />
          </ToggleIconButton>
          <ToggleIconButton aria-label="Bolt" variant="outlined" size="md">
            <Icon name="bolt" />
          </ToggleIconButton>
        </div>
      </Tile>
      <Tile index="12" name="progress" href="/docs/components/progress" detail="wavy · circular" field="highest">
        <ProgressInstrument />
      </Tile>
      <Tile index="13" name="snackbar" href="/docs/components/snackbar" detail="one at a time" field="tertiary">
        <SnackbarInstrument />
      </Tile>
      <Tile index="14" name="dialog" href="/docs/components/dialog" detail="focus trap · spring" field="primary">
        <Dialog>
          <DialogTrigger render={<Button size="md" icon={<Icon name="delete" />} />}>Reset settings</DialogTrigger>
          <DialogContent>
            <DialogTitle>Reset settings?</DialogTitle>
            <DialogDescription>Your preferences go back to their defaults. Your saved mixes stay.</DialogDescription>
            <DialogActions>
              <DialogClose render={<Button variant="text" />}>Cancel</DialogClose>
              <DialogClose render={<Button variant="text" />}>Reset</DialogClose>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Tile>
    </div>
  );
}
