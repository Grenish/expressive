"use client";

import { DayPicker, type DayPickerProps } from "react-day-picker";
import { cn } from "@/registry/lib/utils";

/*
 * Calendar: a month grid for picking a date, several dates or a range. The
 * date logic, keyboard grid (arrows, Home/End, Page Up/Down), localization and
 * ARIA come from react-day-picker; this file gives it the M3 look: circular
 * days, the selected day in primary, today outlined, and ranges joined by a
 * tonal band.
 *
 *   <Calendar mode="single" selected={date} onSelect={setDate} />
 *   <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />
 *
 * Every react-day-picker prop works: `disabled`, `startMonth`/`endMonth`,
 * `captionLayout="dropdown"`, `locale`, `weekStartsOn`, `timeZone`…
 */

export type CalendarProps = DayPickerProps & { className?: string };

function Chevron({ orientation = "left", className }: { orientation?: "up" | "down" | "left" | "right"; className?: string }) {
  const rotate = { left: "rtl:rotate-180", right: "rotate-180 rtl:rotate-0", up: "rotate-90", down: "-rotate-90" }[orientation];
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={cn("size-6", rotate, className)}>
      <path d="M14 18 8 12l6-6 1.4 1.4-4.6 4.6 4.6 4.6Z" />
    </svg>
  );
}

const navButton =
  "state-layer focus-ring inline-flex size-10 cursor-pointer items-center justify-center rounded-shape-full text-on-surface-variant disabled:cursor-default disabled:opacity-(--ex-disabled-content)";

export function Calendar({ className, classNames, components, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn("relative w-fit text-on-surface", className)}
      classNames={{
        root: "",
        months: "relative flex flex-col gap-6 sm:flex-row",
        month: "flex flex-col gap-2",
        month_caption: "flex h-10 items-center ps-2 pe-24",
        caption_label: "inline-flex items-center gap-1 text-title-small text-on-surface-variant [&_svg]:size-5",
        dropdowns: "flex items-center gap-1",
        dropdown_root: "state-layer relative inline-flex h-8 items-center rounded-shape-full px-2 has-[select:focus-visible]:[outline:var(--ex-focus-ring-width)_solid_var(--ex-focus-ring-color)]",
        dropdown: "absolute inset-0 cursor-pointer opacity-0",
        nav: "absolute end-0 top-0 flex items-center",
        button_previous: navButton,
        button_next: navButton,
        chevron: "",
        month_grid: "border-collapse",
        weekdays: "",
        weekday: "size-10 p-0 text-center text-body-medium text-on-surface",
        weeks: "",
        week: "",
        week_number_header: "size-10 text-label-medium text-on-surface-variant",
        week_number: "size-10 text-center text-label-medium text-on-surface-variant",
        day: "relative size-10 p-0 text-center",
        day_button: cn(
          "state-layer focus-ring relative z-1 inline-flex size-10 cursor-pointer items-center justify-center rounded-shape-full text-body-large tabular-nums text-on-surface",
          "transition-[background-color,color] spring-effects-fast disabled:cursor-default",
        ),
        // Modifiers land on the day cell; style its button through it.
        today: "[&>button]:text-primary [&>button]:shadow-[inset_0_0_0_1px_var(--ex-color-primary)]",
        // Important so a selected today still reads as selected (the modifiers' class order isn't guaranteed).
        selected: "[&>button]:bg-primary! [&>button]:text-on-primary! [&>button]:shadow-none!",
        outside: "[&>button]:text-on-surface-variant [&>button]:opacity-60",
        disabled: "[&>button]:opacity-(--ex-disabled-content)",
        hidden: "invisible",
        focused: "",
        // Ranges: a tonal band behind the days, half-width at the ends.
        range_start: "bg-linear-to-r from-transparent from-50% to-secondary-container to-50% rtl:bg-linear-to-l",
        range_end: "bg-linear-to-l from-transparent from-50% to-secondary-container to-50% rtl:bg-linear-to-r",
        range_middle: "bg-secondary-container [&>button]:bg-transparent! [&>button]:text-on-secondary-container!",
        ...classNames,
      }}
      components={{ Chevron, ...components }}
      {...props}
    />
  );
}
