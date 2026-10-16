"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";
import { Ripple } from "@/registry/components/ripple";

/*
 * Chips: assist (an action), suggestion (a generated option), filter (a
 * toggle with a check that slides in) and input (a removable entity).
 */

const base = [
  "state-layer focus-ring relative inline-flex h-8 shrink-0 cursor-pointer select-none items-center gap-2 whitespace-nowrap",
  "rounded-shape-small px-4 text-label-large text-on-surface-variant",
  "transition-[border-radius,background-color,color,box-shadow,padding] spring-spatial-fast active:rounded-shape-medium",
  "disabled:cursor-default disabled:text-on-surface/(--ex-disabled-content) data-disabled:cursor-default",
  "[&_svg]:pointer-events-none [&_svg]:size-4.5 [&_svg]:shrink-0",
];

const surface = {
  outlined: "border border-outline-variant disabled:border-on-surface/(--ex-disabled-container)",
  elevated: "bg-surface-container-low shadow-elevation-1 hover:shadow-elevation-2 disabled:bg-on-surface/(--ex-disabled-container) disabled:shadow-none",
};

interface ChipOwnProps {
  /** `elevated` chips sit on images or busy backgrounds. */
  appearance?: keyof typeof surface;
  icon?: React.ReactNode;
  motion?: MotionProp;
  className?: string;
}

export type AssistChipProps = ChipOwnProps & Omit<BaseButton.Props, "className">;

export function AssistChip({ className, appearance = "outlined", icon, motion, disabled, children, ...props }: AssistChipProps) {
  return (
    <BaseButton
      data-slot="assist-chip"
      data-motion={motion}
      disabled={disabled}
      className={cn(base, surface[appearance], "text-on-surface [&_svg]:text-primary", icon && "pl-2", className)}
      {...props}
    >
      {icon}
      {children}
      <Ripple motion={motion} disabled={disabled} />
    </BaseButton>
  );
}

export type SuggestionChipProps = AssistChipProps;

export function SuggestionChip({ className, appearance = "outlined", icon, motion, disabled, children, ...props }: SuggestionChipProps) {
  return (
    <BaseButton
      data-slot="suggestion-chip"
      data-motion={motion}
      disabled={disabled}
      className={cn(base, surface[appearance], icon && "pl-2", className)}
      {...props}
    >
      {icon}
      {children}
      <Ripple motion={motion} disabled={disabled} />
    </BaseButton>
  );
}

export type FilterChipProps = ChipOwnProps & Omit<BaseToggle.Props, "className">;

/** Use `pressed` / `onPressedChange` (or `defaultPressed`) for the selected state. */
export function FilterChip({ className, appearance = "outlined", icon, motion, disabled, children, ...props }: FilterChipProps) {
  return (
    <BaseToggle
      data-slot="filter-chip"
      data-motion={motion}
      disabled={disabled}
      className={cn(
        base,
        surface[appearance],
        "group pl-2",
        "data-pressed:border-transparent data-pressed:bg-secondary-container data-pressed:text-on-secondary-container",
        className,
      )}
      {...props}
    >
      {/* Leading slot: the check grows in on selection (or replaces `icon`). */}
      <span
        className={cn(
          "grid transition-[grid-template-columns,margin] spring-spatial-fast",
          icon ? "grid-cols-[1fr]" : "-mr-2 grid-cols-[0fr] group-data-pressed:mr-0 group-data-pressed:grid-cols-[1fr]",
        )}
      >
        <span className="flex overflow-hidden">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={cn(icon && "hidden group-data-pressed:block")}>
            <path d="M9.55 17.65 4.2 12.3l1.43-1.4 3.92 3.92 8.82-8.82 1.43 1.4Z" />
          </svg>
          {icon && <span className="contents group-data-pressed:hidden">{icon}</span>}
        </span>
      </span>
      {children}
      <Ripple motion={motion} disabled={disabled} />
    </BaseToggle>
  );
}

export interface InputChipProps extends Omit<React.ComponentProps<"span">, "children"> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  /** Called by the trailing remove button (also on Backspace/Delete). */
  onRemove?: () => void;
  /** Accessible name for the remove button. */
  removeLabel?: string;
  selected?: boolean;
  disabled?: boolean;
}

export function InputChip({ className, children, icon, onRemove, removeLabel, selected, disabled, ...props }: InputChipProps) {
  const label = removeLabel ?? (typeof children === "string" ? `Remove ${children}` : "Remove");
  return (
    <span
      data-slot="input-chip"
      data-selected={selected ? "" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "inline-flex h-8 shrink-0 select-none items-center gap-2 whitespace-nowrap rounded-shape-small border border-outline-variant px-3 text-label-large text-on-surface-variant",
        "data-selected:border-transparent data-selected:bg-secondary-container data-selected:text-on-secondary-container",
        "aria-disabled:opacity-(--ex-disabled-content)",
        icon && "pl-1",
        onRemove && "pr-1",
        "[&_svg]:size-4.5 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {icon && <span className="flex size-6 items-center justify-center overflow-hidden rounded-shape-full">{icon}</span>}
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label={label}
          disabled={disabled}
          onClick={onRemove}
          onKeyDown={(event) => {
            if (event.key === "Backspace" || event.key === "Delete") onRemove();
          }}
          className="state-layer focus-ring flex size-6 cursor-pointer items-center justify-center rounded-shape-full disabled:cursor-default"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
          </svg>
        </button>
      )}
    </span>
  );
}
