"use client";

import * as React from "react";
import { Button } from "@/registry/components/button";
import { IconButton } from "@/registry/components/icon-button";
import { Checkbox } from "@/registry/components/checkbox";
import { Radio, RadioGroup } from "@/registry/components/radio-group";
import { Slider } from "@/registry/components/slider";
import { TextField } from "@/registry/components/text-field";
import { Fab } from "@/registry/components/fab";
import { AssistChip, FilterChip, InputChip, SuggestionChip } from "@/registry/components/chip";
import { NavigationBar, NavigationBarItem } from "@/registry/components/navigation-bar";
import { NavigationRail, NavigationRailItem } from "@/registry/components/navigation-rail";
import { TopAppBar } from "@/registry/components/top-app-bar";
import { CircularProgress, LinearProgress } from "@/registry/components/progress";
import { RichTooltip, Tooltip } from "@/registry/components/tooltip";
import { useSnackbar } from "@/registry/components/snackbar";
import { Shape } from "@/registry/components/shape";
import { Loading } from "@/registry/components/loading";
import { type MaterialShapeName, shapeLabels, shapeNames } from "@/registry/tokens/material-shapes";
import { Icon } from "@/components/icons";

/* Demos render inside an outlined card on `surface`. */

export function CheckboxDemo() {
  const [items, setItems] = React.useState({ email: true, sms: false, push: false });
  const values = Object.values(items);
  const all = values.every(Boolean);
  const some = values.some(Boolean) && !all;
  return (
    <div className="flex flex-col text-body-large">
      <label className="flex items-center gap-1">
        <Checkbox
          checked={all}
          indeterminate={some}
          onCheckedChange={(checked) => setItems({ email: checked, sms: checked, push: checked })}
        />
        All notifications
      </label>
      {(Object.keys(items) as Array<keyof typeof items>).map((key) => (
        <label key={key} className="ml-8 flex items-center gap-1">
          <Checkbox checked={items[key]} onCheckedChange={(checked) => setItems((s) => ({ ...s, [key]: checked }))} />
          {key === "sms" ? "SMS" : key[0]!.toUpperCase() + key.slice(1)}
        </label>
      ))}
      <label className="flex items-center gap-1">
        <Checkbox defaultChecked disabled /> Disabled
      </label>
    </div>
  );
}

export function RadioGroupDemo() {
  return (
    <div className="flex flex-col gap-2">
      <span id="ship-label" className="text-title-small">Shipping</span>
      <RadioGroup aria-labelledby="ship-label" defaultValue="standard" className="text-body-large">
        {[
          ["standard", "Standard (3–5 days)"],
          ["express", "Express (1–2 days)"],
          ["pickup", "Pick up in store"],
        ].map(([value, label]) => (
          <label key={value} className="flex items-center gap-1">
            <Radio value={value!} /> {label}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

export function SliderDemo() {
  const [volume, setVolume] = React.useState(40);
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-label-large">
          <span id="volume-label">Volume</span>
          <span className="text-on-surface-variant">{volume}</span>
        </div>
        <Slider value={volume} onValueChange={(v) => setVolume(v as number)} aria-labelledby="volume-label" thumbLabels={["Volume"]} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label-large">Price range</span>
        <Slider defaultValue={[20, 70]} thumbLabels={["Minimum price", "Maximum price"]} />
      </div>
      <Slider defaultValue={60} disabled thumbLabels={["Disabled"]} />
    </div>
  );
}

export function TextFieldDemo() {
  const [email, setEmail] = React.useState("ada@");
  const invalid = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email);
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <TextField label="First name" supportingText="As it appears on your ID" />
      <TextField label="First name" variant="outlined" supportingText="As it appears on your ID" />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        invalid={invalid}
        errorText="Enter a valid email address"
        trailingIcon={invalid ? <Icon name="info" /> : undefined}
      />
      <TextField label="Search" variant="outlined" placeholder="Try “springs”" leadingIcon={<Icon name="search" />} />
      <TextField label="Disabled" disabled defaultValue="Can't touch this" />
    </div>
  );
}

export function FabDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <Fab icon={<Icon name="edit" />} aria-label="Compose" />
        <Fab icon={<Icon name="edit" />} aria-label="Compose" size="medium" color="secondary-container" />
        <Fab icon={<Icon name="edit" />} aria-label="Compose" size="large" color="tertiary-container" />
        <Fab icon={<Icon name="add" />} aria-label="Add" color="primary" />
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <Fab icon={<Icon name="edit" />} label="Compose" />
        <Fab icon={<Icon name="add" />} label="New list" size="medium" color="surface" />
      </div>
    </div>
  );
}

export function ChipDemo() {
  const [people, setPeople] = React.useState(["Ada Lovelace", "Alan Turing", "Grace Hopper"]);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        <AssistChip icon={<Icon name="event" />}>Add to calendar</AssistChip>
        <AssistChip icon={<Icon name="star" />} appearance="elevated">Save</AssistChip>
        <SuggestionChip>Sounds good</SuggestionChip>
        <SuggestionChip>On my way</SuggestionChip>
      </div>
      <div className="flex flex-wrap gap-2">
        <FilterChip defaultPressed>Vegetarian</FilterChip>
        <FilterChip>Gluten-free</FilterChip>
        <FilterChip icon={<Icon name="star" />}>Top rated</FilterChip>
        <FilterChip disabled>Unavailable</FilterChip>
      </div>
      <div className="flex flex-wrap gap-2">
        {people.map((name) => (
          <InputChip
            key={name}
            icon={<Icon name="person" />}
            onRemove={() => setPeople((p) => p.filter((n) => n !== name))}
          >
            {name}
          </InputChip>
        ))}
        {people.length === 0 && (
          <Button variant="text" size="xs" onClick={() => setPeople(["Ada Lovelace", "Alan Turing", "Grace Hopper"])}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}

const navItems = [
  { id: "home", label: "Home", icon: "home" },
  { id: "inbox", label: "Inbox", icon: "inbox", badge: 3 as number | boolean },
  { id: "files", label: "Files", icon: "folder", badge: true },
  { id: "profile", label: "Profile", icon: "person" },
] as const;

export function NavigationBarDemo() {
  const [active, setActive] = React.useState("home");
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-shape-extra-large border border-outline-variant">
      <div className="grid h-32 place-items-center bg-surface text-body-medium text-on-surface-variant">
        {navItems.find((i) => i.id === active)?.label}
      </div>
      <NavigationBar aria-label="Demo">
        {navItems.map((item) => (
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

export function NavigationRailDemo() {
  const [active, setActive] = React.useState("inbox");
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className="flex h-[30rem] w-full overflow-hidden rounded-shape-extra-large border border-outline-variant">
      <NavigationRail
        aria-label="Demo"
        expanded={expanded}
        className="bg-surface-container"
        header={
          <>
            <IconButton aria-label={expanded ? "Collapse" : "Expand"} aria-expanded={expanded} onClick={() => setExpanded((e) => !e)}>
              <Icon name="menu" />
            </IconButton>
            <Fab icon={<Icon name="edit" />} aria-label="Compose" color="tertiary-container" className={expanded ? "hidden" : ""} />
            {expanded && <Fab icon={<Icon name="edit" />} label="Compose" color="tertiary-container" />}
          </>
        }
      >
        {navItems.map((item) => (
          <NavigationRailItem
            key={item.id}
            render={<button type="button" />}
            onClick={() => setActive(item.id)}
            active={active === item.id}
            icon={<Icon name={item.icon} />}
            label={item.label}
            badge={"badge" in item ? item.badge : undefined}
          />
        ))}
      </NavigationRail>
      <div className="grid flex-1 place-items-center bg-surface text-body-medium text-on-surface-variant">
        {navItems.find((i) => i.id === active)?.label}
      </div>
    </div>
  );
}

export function TopAppBarDemo() {
  const scroller = React.useRef<HTMLDivElement>(null);
  const actions = (
    <>
      <IconButton aria-label="Search"><Icon name="search" /></IconButton>
      <IconButton aria-label="More options"><Icon name="more" /></IconButton>
    </>
  );
  return (
    <div className="flex w-full flex-col gap-4">
      <TopAppBar title="Inbox" navigation={<IconButton aria-label="Menu"><Icon name="menu" /></IconButton>} actions={actions} className="rounded-shape-large" scrolled={false} />
      <TopAppBar variant="center" title="Photos" navigation={<IconButton aria-label="Back"><Icon name="back" /></IconButton>} actions={<IconButton aria-label="Profile"><Icon name="person" /></IconButton>} className="rounded-shape-large" scrolled />
      <div ref={scroller} className="h-72 overflow-y-auto rounded-shape-large border border-outline-variant">
        <TopAppBar
          variant="large"
          title="Trips"
          subtitle="3 upcoming · scroll me"
          navigation={<IconButton aria-label="Back"><Icon name="back" /></IconButton>}
          actions={actions}
          scrollTarget={scroller}
          className="sticky top-0 z-10"
        />
        <div className="flex flex-col gap-3 p-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-14 rounded-shape-medium bg-surface-container-low" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProgressDemo() {
  const [value, setValue] = React.useState(35);
  React.useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : Math.min(100, v + 7))), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex w-full flex-col gap-6">
      <LinearProgress value={value} aria-label="Upload" />
      <LinearProgress value={value} wavy aria-label="Download" />
      <LinearProgress value={null} aria-label="Loading" />
      <div className="flex items-center gap-6">
        <CircularProgress value={value} aria-label="Sync" />
        <CircularProgress value={null} aria-label="Loading" />
        <CircularProgress value={null} size={32} aria-label="Loading" />
      </div>
    </div>
  );
}

export function SnackbarDemo() {
  const snackbar = useSnackbar();
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="tonal" onClick={() => snackbar.show({ message: "Message archived" })}>
        Simple
      </Button>
      <Button
        variant="tonal"
        onClick={() =>
          snackbar.show({
            message: "Photo deleted",
            action: { label: "Undo", onClick: () => snackbar.show({ message: "Photo restored" }) },
          })
        }
      >
        With action
      </Button>
      <Button
        variant="outlined"
        onClick={() => snackbar.show({ message: "Connection lost. Changes will sync when you're back online.", closable: true, timeout: 0 })}
      >
        Persistent
      </Button>
    </div>
  );
}

export function TooltipDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tooltip content="Search">
        <IconButton aria-label="Search"><Icon name="search" /></IconButton>
      </Tooltip>
      <Tooltip content="Add to favorites" side="bottom">
        <IconButton aria-label="Favorite" variant="tonal"><Icon name="favorite" /></IconButton>
      </Tooltip>
      <RichTooltip
        title="Spring motion"
        content="Expressive animates with physics-based springs. Spatial springs can overshoot; effect springs never do."
        actions={<Button variant="text" size="sm">Learn more</Button>}
      >
        <Button variant="outlined" icon={<Icon name="info" />}>Rich tooltip</Button>
      </RichTooltip>
    </div>
  );
}

/** All 35 shapes; picking one morphs the big preview into it. */
export function ShapeGallery({ compact = false }: { compact?: boolean }) {
  const [current, setCurrent] = React.useState<MaterialShapeName>("flower");
  return (
    <div className={compact ? "flex flex-col gap-6" : "grid gap-6 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]"}>
      <div className="flex flex-col items-center justify-center gap-3 rounded-shape-extra-large bg-surface-container p-6">
        <Shape name={current} className="size-40 text-primary" label={shapeLabels[current]} />
        <span className="text-title-medium text-on-surface">{shapeLabels[current]}</span>
        <code className="text-label-medium text-on-surface-variant">{`<Shape name="${current}" />`}</code>
      </div>
      <div role="radiogroup" aria-label="Shape" className="grid grid-cols-5 gap-2 sm:grid-cols-7">
        {shapeNames.map((name) => (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={current === name}
            aria-label={shapeLabels[name]}
            title={shapeLabels[name]}
            onClick={() => setCurrent(name)}
            className="state-layer focus-ring flex aspect-square cursor-pointer items-center justify-center rounded-shape-large text-on-surface-variant aria-checked:bg-secondary-container aria-checked:text-on-secondary-container"
          >
            <Shape name={name} className="size-3/5" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ShapeDemo() {
  return (
    <div className="flex flex-col gap-8">
      <ShapeGallery />
      <div className="flex flex-wrap items-center gap-4">
        <div className="size-20 bg-linear-to-br from-primary to-tertiary shape-cookie-9" />
        <div className="size-20 bg-linear-to-br from-secondary to-primary shape-clover-4" />
        <div className="size-20 bg-linear-to-br from-tertiary to-secondary shape-soft-burst" />
        <p className="max-w-xs text-body-small text-on-surface-variant">
          The same shapes as Tailwind masks: <code>shape-cookie-9</code>, <code>shape-clover-4</code>, <code>shape-soft-burst</code>.
        </p>
      </div>
    </div>
  );
}

function DemoCell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-36 flex-col items-center justify-between gap-4 rounded-shape-large bg-surface-container-low p-4">
      <div className="flex flex-1 items-center justify-center">{children}</div>
      <span className="text-label-medium text-on-surface-variant">{title}</span>
    </div>
  );
}

export function LoadingDemo() {
  const [value, setValue] = React.useState(20);
  React.useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 5 : Math.min(100, v + 11))), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <DemoCell title="circular · label">
        <Loading variant="circular" label="Loading…" size={40} />
      </DemoCell>
      <DemoCell title="wavy">
        <Loading variant="wavy" />
      </DemoCell>
      <DemoCell title="wavy · label below">
        <Loading variant="wavy" label="Syncing photos" labelPosition="bottom" />
      </DemoCell>
      <DemoCell title="morph (M3 Expressive)">
        <Loading variant="morph" />
      </DemoCell>
      <DemoCell title="morph · contained">
        <Loading variant="morph" contained size={56} />
      </DemoCell>
      <DemoCell title="shape · flower">
        <Loading variant="shape" shape="flower" size={52} />
      </DemoCell>
      <DemoCell title="shape · contained heart">
        <Loading variant="shape" shape="heart" contained size={56} />
      </DemoCell>
      <DemoCell title="dots">
        <Loading variant="dots" shape="cookie-4" label="Thinking" />
      </DemoCell>
      <DemoCell title="pulse">
        <Loading variant="pulse" shape="sunny" size={44} />
      </DemoCell>
      <DemoCell title={`circular · ${value}%`}>
        <Loading variant="circular" value={value} aria-label="Upload" />
      </DemoCell>
      <DemoCell title={`wavy · ${value}%`}>
        <Loading variant="wavy" value={value} size={56} aria-label="Download" />
      </DemoCell>
      <DemoCell title="custom morph sequence">
        <Loading variant="morph" shapes={["heart", "flower", "clover-4", "burst"]} />
      </DemoCell>
    </div>
  );
}
