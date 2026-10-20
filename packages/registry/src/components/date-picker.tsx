"use client";

import * as React from "react";
import { Popover } from "@base-ui/react/popover";
import type { DateRange } from "react-day-picker";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";
import { Calendar, type CalendarProps } from "@/registry/components/calendar";

/*
 * Date pickers (M3 "docked" date picker): a field that opens a calendar in a
 * popover. <DatePicker> picks one date, <DateRangePicker> a start and end.
 * They close once the choice is complete, return focus to the field, and
 * submit with forms through a hidden input (ISO dates: "2026-10-20", or
 * "2026-10-20/2026-10-24" for a range).
 */

export type { DateRange };

interface FieldProps {
  label: string;
  variant?: "filled" | "outlined";
  /** Shown in the field when nothing is picked. */
  placeholder?: string;
  supportingText?: React.ReactNode;
  /** Replaces `supportingText` while `invalid`. */
  errorText?: React.ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  /** Form field name for the hidden input. */
  name?: string;
  /** Locale for the field text (the calendar takes `calendarProps.locale`). */
  locale?: string;
  /** Outlined fields cut the label out of the border; set the color behind the field when it isn't `surface`. */
  labelBackground?: string;
  /** Extra props for the calendar: `disabled` dates, `startMonth`, `captionLayout`, `locale`, `numberOfMonths`… */
  calendarProps?: Partial<CalendarProps>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  motion?: MotionProp;
  className?: string;
}

const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/** Controlled when `value` isn't undefined (null means "nothing picked"). */
function useControlled<T>(value: T | null | undefined, defaultValue: T | undefined, onChange?: (value: T | undefined) => void) {
  const [inner, setInner] = React.useState<T | undefined>(defaultValue);
  const current = value === undefined ? inner : (value ?? undefined);
  const set = (next: T | undefined) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

function PickerField({
  label,
  variant = "filled",
  placeholder,
  supportingText,
  errorText,
  invalid,
  disabled,
  labelBackground,
  open,
  onOpenChange,
  motion,
  className,
  text,
  hidden,
  children,
}: Omit<FieldProps, "calendarProps" | "locale" | "name"> & { text: string | undefined; hidden: React.ReactNode; children: React.ReactNode; open: boolean; onOpenChange: (open: boolean) => void }) {
  const id = React.useId();
  const filled = variant === "filled";
  const hasValue = Boolean(text);
  const floated = hasValue || open;
  const description = invalid && errorText ? errorText : supportingText;
  return (
    <div
      data-slot="date-picker"
      data-invalid={invalid ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      className={cn("group/picker flex w-full flex-col gap-1 data-disabled:opacity-(--ex-disabled-content)", className)}
      style={labelBackground ? ({ "--ex-field-label-bg": labelBackground } as React.CSSProperties) : undefined}
    >
      <Popover.Root open={open} onOpenChange={onOpenChange}>
        <Popover.Trigger
          disabled={disabled}
          aria-labelledby={`${id}-label ${id}-value`}
          aria-describedby={description ? `${id}-description` : undefined}
          aria-invalid={invalid || undefined}
          className={cn(
            "group state-layer relative flex h-14 w-full cursor-pointer items-center gap-3 px-4 text-start text-on-surface outline-none transition-colors spring-effects-fast",
            "disabled:cursor-default [&_svg]:size-6 [&_svg]:shrink-0",
            filled
              ? [
                  "rounded-t-shape-extra-small bg-surface-container-highest",
                  "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-on-surface-variant after:transition-[height,background-color] after:spring-effects-fast",
                  "focus-visible:after:h-0.5 focus-visible:after:bg-primary data-popup-open:after:h-0.5 data-popup-open:after:bg-primary",
                  "group-data-invalid/picker:after:bg-error",
                ]
              : [
                  "rounded-shape-extra-small border border-outline hover:border-on-surface",
                  "focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--ex-color-primary)] data-popup-open:border-primary data-popup-open:shadow-[inset_0_0_0_1px_var(--ex-color-primary)]",
                  "group-data-invalid/picker:border-error group-data-invalid/picker:shadow-[inset_0_0_0_1px_var(--ex-color-error)]",
                ],
          )}
        >
          <span className="relative flex h-full min-w-0 flex-1 flex-col justify-center">
            <span
              id={`${id}-label`}
              className={cn(
                "pointer-events-none absolute start-0 origin-top-left truncate text-body-large text-on-surface-variant transition-[transform,top,color] spring-spatial-fast",
                "group-data-popup-open:text-primary group-data-invalid/picker:text-error",
                floated ? (filled ? "top-2 scale-75" : "-top-2 -ms-1 scale-75 bg-(--ex-field-label-bg,var(--ex-color-surface)) px-1") : "top-1/2 -translate-y-1/2",
              )}
            >
              {label}
            </span>
            <span
              id={`${id}-value`}
              className={cn("truncate text-body-large", filled && "pt-4", hasValue ? "text-on-surface" : "text-on-surface-variant", !floated && "opacity-0")}
            >
              {text ?? placeholder ?? ""}
            </span>
          </span>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="text-on-surface-variant group-data-invalid/picker:text-error">
            <path d="M5 22q-.82 0-1.41-.59Q3 20.83 3 20V6q0-.82.59-1.41Q4.18 4 5 4h1V2h2v2h8V2h2v2h1q.82 0 1.41.59Q21 5.18 21 6v14q0 .83-.59 1.41Q19.82 22 19 22Zm0-2h14V10H5Zm0-12h14V6H5Zm0 0V6v2Z" />
          </svg>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner side="bottom" align="start" sideOffset={4} collisionPadding={8} className="z-50">
            <Popover.Popup
              data-slot="date-picker-popup"
              data-motion={motion}
              // The calendar focuses the selected day (or today) itself.
              initialFocus={false}
              className={cn(
                "rounded-shape-extra-large bg-surface-container-high p-3 shadow-elevation-3 outline-none",
                "origin-(--transform-origin) transition-[transform,opacity] spring-spatial-fast",
                "data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
              )}
            >
              {children}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      {hidden}
      {description && (
        <span id={`${id}-description`} className={cn("px-4 text-body-small", invalid && errorText ? "text-error" : "text-on-surface-variant")}>
          {description}
        </span>
      )}
    </div>
  );
}

export interface DatePickerProps extends FieldProps {
  value?: Date | null;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  /** Formats the date in the field. Defaults to the locale's medium date style ("Oct 20, 2026"). */
  format?: (date: Date) => string;
}

export function DatePicker({ value, defaultValue, onValueChange, format, name, locale, calendarProps, open: openProp, onOpenChange, ...field }: DatePickerProps) {
  const [date, setDate] = useControlled(value, defaultValue, onValueChange);
  const [innerOpen, setInnerOpen] = React.useState(false);
  const open = openProp ?? innerOpen;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };
  const text = date ? (format ? format(date) : new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date)) : undefined;
  return (
    <PickerField
      {...field}
      open={open}
      onOpenChange={setOpen}
      text={text}
      hidden={name ? <input type="hidden" name={name} value={date ? iso(date) : ""} /> : null}
    >
      <Calendar
        autoFocus
        {...(calendarProps as object)}
        mode="single"
        selected={date}
        defaultMonth={date}
        onSelect={(next: Date | undefined) => {
          setDate(next);
          if (next) setOpen(false);
        }}
      />
    </PickerField>
  );
}

export interface DateRangePickerProps extends FieldProps {
  value?: DateRange | null;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  /** Formats the range in the field. Defaults to the locale's range format ("Oct 20 – 24, 2026"). */
  format?: (range: DateRange) => string;
}

export function DateRangePicker({ value, defaultValue, onValueChange, format, name, locale, calendarProps, open: openProp, onOpenChange, ...field }: DateRangePickerProps) {
  const [range, setRange] = useControlled(value, defaultValue, onValueChange);
  const [innerOpen, setInnerOpen] = React.useState(false);
  const open = openProp ?? innerOpen;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  let text: string | undefined;
  if (range?.from) {
    text = format ? format(range) : range.to ? formatter.formatRange(range.from, range.to) : `${formatter.format(range.from)} –`;
  }
  return (
    <PickerField
      {...field}
      open={open}
      onOpenChange={setOpen}
      text={text}
      hidden={name ? <input type="hidden" name={name} value={range?.from && range.to ? `${iso(range.from)}/${iso(range.to)}` : ""} /> : null}
    >
      <Calendar
        autoFocus
        {...(calendarProps as object)}
        mode="range"
        selected={range}
        defaultMonth={range?.from}
        onSelect={(next: DateRange | undefined, picked: Date) => {
          // A completed range closes the picker; a click that starts a new range keeps it open.
          const startingOver = Boolean(range?.from && range.to && range.from.getTime() !== range.to.getTime());
          const nextRange = startingOver ? { from: picked, to: undefined } : next;
          setRange(nextRange);
          if (nextRange?.from && nextRange.to && nextRange.from.getTime() !== nextRange.to.getTime()) setOpen(false);
        }}
      />
    </PickerField>
  );
}
