"use client";

import * as React from "react";
import { Button } from "@/registry/components/button";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/registry/components/accordion";
import { Alert } from "@/registry/components/alert";
import {
  AlertDialog,
  AlertDialogActions,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/components/alert-dialog";
import { Avatar, AvatarGroup } from "@/registry/components/avatar";
import { Breadcrumb, BreadcrumbItem } from "@/registry/components/breadcrumb";
import { Calendar } from "@/registry/components/calendar";
import { DatePicker, type DateRange, DateRangePicker } from "@/registry/components/date-picker";
import { Carousel, CarouselItem } from "@/registry/components/carousel";
import { CodeBlock, CodeTabs } from "@/registry/components/code-block";
import { PackageManagerLogo } from "@/components/command-tabs";
import { MANAGERS, cliCommand } from "@/lib/package-managers";
import { Select, SelectGroup, SelectGroupLabel, SelectItem, SelectSeparator } from "@/registry/components/select";
import { Pagination } from "@/registry/components/pagination";
import { Shape } from "@/registry/components/shape";
import type { MaterialShapeName } from "@/registry/tokens/material-shapes";
import { ConnectedButton, ConnectedButtonGroup } from "@/registry/components/button-group";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/components/sidebar";
import { Icon } from "@/components/icons";

/** Demo links stay on the page. */
const stay = (event: React.MouseEvent) => event.preventDefault();

export function AccordionDemo() {
  return (
    <div className="grid w-full gap-8 md:grid-cols-2">
      <Accordion defaultValue={["shipping"]}>
        <AccordionItem value="shipping">
          <AccordionTrigger icon={<Icon name="send" />}>Shipping</AccordionTrigger>
          <AccordionPanel>Orders ship within two working days. Tracking arrives by email once the parcel leaves the warehouse.</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="returns">
          <AccordionTrigger icon={<Icon name="undo" />}>Returns</AccordionTrigger>
          <AccordionPanel>Return anything within 30 days, free. Print the label from your order page.</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="warranty">
          <AccordionTrigger icon={<Icon name="star" />} supportingText="Two years on everything">
            Warranty
          </AccordionTrigger>
          <AccordionPanel>We repair or replace faulty items for two years from delivery.</AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Accordion variant="divided" multiple>
        {["What is Expressive?", "Do I need Tailwind?", "Can I change the components?"].map((question, i) => (
          <AccordionItem key={question} value={question}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionPanel>
              {
                [
                  "A Material 3 Expressive design system for React, copied into your project as source.",
                  "Yes: Tailwind CSS v4. Every token is a utility.",
                  "Yes. They're your files now; edit them like any other code.",
                ][i]
              }
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export function AlertDemo() {
  const [shown, setShown] = React.useState(true);
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Alert title="New version available">Reload to get the latest components.</Alert>
      <Alert type="success" title="Payment received">Your receipt is on its way to your inbox.</Alert>
      <Alert type="warning" title="Storage almost full" actions={<Button variant="text" size="sm">Manage storage</Button>}>
        You&apos;ve used 92% of your 15 GB.
      </Alert>
      {shown ? (
        <Alert type="error" title="Sync failed" onDismiss={() => setShown(false)} actions={<Button variant="text" size="sm">Retry</Button>}>
          Changes on this device haven&apos;t been saved yet.
        </Alert>
      ) : (
        <Button variant="outlined" className="self-start" onClick={() => setShown(true)}>
          Show the error again
        </Button>
      )}
    </div>
  );
}

export function AlertDialogDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="tonal" icon={<Icon name="delete" />} />}>Delete files</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogIcon>
            <Icon name="delete" />
          </AlertDialogIcon>
          <AlertDialogTitle>Delete 3 files?</AlertDialogTitle>
          <AlertDialogDescription>They&apos;ll be removed from all your devices and can&apos;t be recovered.</AlertDialogDescription>
          <AlertDialogActions>
            <AlertDialogClose render={<Button variant="text" />}>Cancel</AlertDialogClose>
            <AlertDialogClose render={<Button variant="text" />}>Delete</AlertDialogClose>
          </AlertDialogActions>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outlined" />}>Discard draft</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Discard draft?</AlertDialogTitle>
          <AlertDialogDescription>Your message hasn&apos;t been sent.</AlertDialogDescription>
          <AlertDialogActions>
            <AlertDialogClose render={<Button variant="text" />}>Keep editing</AlertDialogClose>
            <AlertDialogClose render={<Button variant="text" />}>Discard</AlertDialogClose>
          </AlertDialogActions>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Margaret Hamilton", "Tim Berners-Lee"];

export function AvatarDemo() {
  const shapes: MaterialShapeName[] = ["circle", "cookie-9", "clover-4", "sunny", "flower"];
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end gap-4">
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size, i) => (
          <Avatar key={size} alt={people[i]!} size={size} color={(["primary", "secondary", "tertiary", "surface", "primary"] as const)[i]} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {shapes.map((shape, i) => (
          <Avatar key={shape} alt={people[i]!} size="lg" shape={shape} color={(["primary", "secondary", "tertiary", "primary", "secondary"] as const)[i]} />
        ))}
      </div>
      <AvatarGroup max={4} aria-label="Project members">
        {people.map((name, i) => (
          <Avatar key={name} alt={name} color={(["primary", "secondary", "tertiary"] as const)[i % 3]} />
        ))}
      </AvatarGroup>
    </div>
  );
}

export function BreadcrumbDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbItem href="#" onClick={stay} icon={<Icon name="home" />}>
          Home
        </BreadcrumbItem>
        <BreadcrumbItem href="#" onClick={stay}>
          Docs
        </BreadcrumbItem>
        <BreadcrumbItem href="#" onClick={stay}>
          Components
        </BreadcrumbItem>
        <BreadcrumbItem current>Breadcrumb</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb aria-label="Folder path">
        <BreadcrumbItem href="#" onClick={stay} icon={<Icon name="folder" />}>
          Drive
        </BreadcrumbItem>
        <BreadcrumbItem href="#" onClick={stay}>
          Projects
        </BreadcrumbItem>
        <BreadcrumbItem current>Expressive</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    const from = new Date();
    return { from, to: new Date(from.getFullYear(), from.getMonth(), from.getDate() + 4) };
  });
  return (
    <div className="flex flex-wrap gap-6">
      <div className="rounded-shape-extra-large bg-surface-container-high p-3">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
      <div className="rounded-shape-extra-large bg-surface-container-high p-3">
        <Calendar mode="range" selected={range} onSelect={setRange} captionLayout="dropdown" />
      </div>
    </div>
  );
}

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
      <DatePicker label="Departure" value={date ?? null} onValueChange={setDate} supportingText="MM/DD/YYYY" />
      <DatePicker
        label="Appointment"
        variant="outlined"
        labelBackground="var(--ex-color-surface-container-low)"
        calendarProps={{ disabled: [{ dayOfWeek: [0, 6] }, { before: new Date() }] }}
        supportingText="Weekdays only"
      />
      <DateRangePicker label="Stay" className="sm:col-span-2" />
    </div>
  );
}

const places: Array<{ name: string; shape: MaterialShapeName; tone: string }> = [
  { name: "Lisbon", shape: "sunny", tone: "from-primary to-tertiary" },
  { name: "Kyoto", shape: "flower", tone: "from-tertiary to-secondary" },
  { name: "Reykjavík", shape: "clover-4", tone: "from-secondary to-primary" },
  { name: "Oaxaca", shape: "cookie-9", tone: "from-primary to-secondary" },
  { name: "Tbilisi", shape: "soft-burst", tone: "from-tertiary to-primary" },
  { name: "Hobart", shape: "gem", tone: "from-secondary to-tertiary" },
];

export function CarouselDemo() {
  return (
    <div className="flex w-full flex-col gap-8">
      <Carousel aria-label="Destinations">
        {places.map((place) => (
          <CarouselItem key={place.name} label={place.name}>
            <div className={`flex size-full items-center justify-center bg-linear-to-br ${place.tone}`}>
              <Shape name={place.shape} className="size-32 text-on-primary/40" />
            </div>
          </CarouselItem>
        ))}
      </Carousel>
      <Carousel aria-label="Highlights" layout="hero" height="12rem">
        {places.slice(0, 4).map((place) => (
          <CarouselItem key={place.name} label={place.name}>
            <div className={`flex size-full items-center justify-center bg-linear-to-tr ${place.tone}`}>
              <Shape name={place.shape} className="size-24 text-on-primary/40" />
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
}

const sample = `import { Button } from "@/components/expressive/button";

export function Save({ onSave }: { onSave: () => void }) {
  return (
    <Button variant="filled" onClick={onSave}>
      Save changes
    </Button>
  );
}`;

const theme = `@import "tailwindcss";
@import "./expressive.css";

/* expressive:theme:start */
:root {
  --ex-color-primary: #65558f;
}
/* expressive:theme:end */`;

const config = `{
  "framework": "next",
  "css": "src/app/globals.css",
  "motion": "css"
}`;

export function CodeBlockDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <CodeTabs
        aria-label="Package manager"
        syncKey="demo-package-manager"
        items={MANAGERS.map((manager) => ({
          value: manager,
          label: manager,
          language: "bash",
          icon: <PackageManagerLogo manager={manager} />,
          code: cliCommand(manager, "add code-block"),
        }))}
      />
      <CodeTabs
        aria-label="Files"
        lineNumbers
        items={[
          { value: "save", label: "save.tsx", language: "tsx", code: sample },
          { value: "globals", label: "globals.css", language: "css", code: theme },
          { value: "config", label: "expressive.json", language: "json", code: config },
        ]}
      />
      <CodeBlock code={sample} title="save.tsx" language="tsx" lineNumbers maxHeight="12rem" />
      <CodeTabs
        aria-label="Same choice, synced"
        syncKey="demo-package-manager"
        items={MANAGERS.map((manager) => ({
          value: manager,
          label: manager,
          language: "bash",
          icon: <PackageManagerLogo manager={manager} />,
          code: cliCommand(manager, "init"),
        }))}
      />
    </div>
  );
}

export function SelectDemo() {
  const [country, setCountry] = React.useState<string | null>("np");
  return (
    <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
      <Select
        label="Country"
        value={country}
        onValueChange={(value) => setCountry(value as string | null)}
        items={[
          { value: "np", label: "Nepal" },
          { value: "pt", label: "Portugal" },
          { value: "jp", label: "Japan" },
          { value: "is", label: "Iceland" },
          { value: "mx", label: "Mexico" },
        ]}
      />
      <Select label="Size" variant="outlined" labelBackground="var(--ex-color-surface-container-low)" supportingText="Fits true to size" items={["XS", "S", "M", "L", "XL"].map((size) => ({ value: size, label: size }))} />
      <Select
        label="Font"
        className="sm:col-span-2"
        items={[
          { value: "roboto-flex", label: "Roboto Flex" },
          { value: "inter", label: "Inter" },
          { value: "jetbrains", label: "JetBrains Mono" },
        ]}
      >
        <SelectGroup>
          <SelectGroupLabel>Sans serif</SelectGroupLabel>
          <SelectItem value="roboto-flex">Roboto Flex</SelectItem>
          <SelectItem value="inter">Inter</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectGroupLabel>Monospace</SelectGroupLabel>
          <SelectItem value="jetbrains">JetBrains Mono</SelectItem>
        </SelectGroup>
      </Select>
    </div>
  );
}

export function PaginationDemo() {
  const [page, setPage] = React.useState(6);
  const [small, setSmall] = React.useState(1);
  return (
    <div className="flex flex-col gap-6">
      <Pagination page={page} pageCount={20} onPageChange={setPage} />
      <Pagination page={small} pageCount={4} onPageChange={setSmall} aria-label="Results pages" />
    </div>
  );
}

/*
 * Header and footer keep the same geometry in both states: with the header's
 * 12px padding plus 12px here, the 32px logo and avatar are centred 40px from
 * the edge, the middle of the rail. Only the text fades, so nothing jumps.
 */
const fadeInRail = "transition-opacity spring-effects-fast group-data-[collapsible=icon]/sidebar:opacity-0";

function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 overflow-hidden px-3 py-1 whitespace-nowrap">
      <Shape name="cookie-9" className="size-8 shrink-0 text-primary" />
      <span className={`truncate text-title-medium text-on-surface ${fadeInRail}`}>Expressive Mail</span>
    </div>
  );
}

function SidebarAccount() {
  return (
    <div className="flex items-center gap-3 overflow-hidden px-3 py-1 whitespace-nowrap">
      <Avatar alt="Ada Lovelace" size="sm" />
      <span className={`flex min-w-0 flex-col ${fadeInRail}`}>
        <span className="truncate text-label-large text-on-surface">Ada Lovelace</span>
        <span className="truncate text-body-small">ada@example.com</span>
      </span>
    </div>
  );
}

export function SidebarDemo() {
  const [mode, setMode] = React.useState(["icon"]);
  const [look, setLook] = React.useState(["standard"]);
  const [page, setPage] = React.useState("inbox");
  const go = (id: string) => (event: React.MouseEvent) => {
    stay(event);
    setPage(id);
  };
  const mail = [
    { id: "inbox", label: "Inbox", icon: "inbox", badge: "24" },
    { id: "starred", label: "Starred", icon: "star" },
    { id: "sent", label: "Sent", icon: "send" },
    { id: "drafts", label: "Drafts", icon: "document", badge: "3" },
  ] as const;
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <ConnectedButtonGroup aria-label="Collapse to" size="xs" value={mode} onValueChange={setMode}>
          <ConnectedButton value="icon">Icon rail</ConnectedButton>
          <ConnectedButton value="offcanvas">Off-canvas</ConnectedButton>
        </ConnectedButtonGroup>
        <ConnectedButtonGroup aria-label="Look" size="xs" variant="tonal" value={look} onValueChange={setLook}>
          <ConnectedButton value="standard">Standard</ConnectedButton>
          <ConnectedButton value="floating">Floating</ConnectedButton>
          <ConnectedButton value="inset">Inset</ConnectedButton>
        </ConnectedButtonGroup>
      </div>
      <div className="h-[30rem] overflow-hidden rounded-shape-extra-large border border-outline-variant">
        <SidebarProvider storageKey={null} keyboardShortcut={false} className="h-full min-h-0">
          <Sidebar
            aria-label="Mail"
            collapsible={mode[0] as "icon" | "offcanvas"}
            variant={look[0] as "standard" | "floating" | "inset"}
            className="h-full"
          >
            <SidebarHeader>
              <SidebarBrand />
            </SidebarHeader>
            <SidebarContent aria-label="Mail">
              <SidebarGroup label="Mail">
                <SidebarMenu>
                  {mail.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton href={`#${item.id}`} onClick={go(item.id)} icon={<Icon name={item.icon} />} badge={"badge" in item ? item.badge : undefined} active={page === item.id}>
                        {item.label}
                      </SidebarMenuButton>
                      {item.id === "sent" && page.startsWith("sent") && (
                        <SidebarMenuSub>
                          <li>
                            <SidebarMenuSubButton href="#sent-today" onClick={go("sent-today")} active={page === "sent-today"}>
                              Today
                            </SidebarMenuSubButton>
                          </li>
                          <li>
                            <SidebarMenuSubButton href="#sent-week" onClick={go("sent-week")} active={page === "sent-week"}>
                              This week
                            </SidebarMenuSubButton>
                          </li>
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup label="Labels" collapsible>
                <SidebarMenu>
                  {["Family", "Work", "Travel"].map((label) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton href={`#${label}`} onClick={go(label)} icon={<Icon name="folder" />} active={page === label}>
                        {label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarAccount />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="min-h-0 bg-surface">
            <header className="flex h-16 shrink-0 items-center gap-2 px-3">
              <SidebarTrigger />
              <h3 className="text-title-large text-on-surface capitalize">{page.replace("sent-", "Sent · ")}</h3>
              <span className="ms-auto hidden text-label-medium text-on-surface-variant sm:block">Ctrl+B in your app</span>
            </header>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-shape-large bg-surface-container-low p-3">
                  <Avatar alt={people[i % people.length]!} size="sm" color={(["primary", "secondary", "tertiary"] as const)[i % 3]} />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-label-large text-on-surface">{people[i % people.length]}</span>
                    <span className="truncate text-body-small text-on-surface-variant">Notes from Thursday&apos;s review, and the next steps…</span>
                  </div>
                </div>
              ))}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
