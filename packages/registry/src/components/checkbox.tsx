"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";

export interface CheckboxProps extends Omit<BaseCheckbox.Root.Props, "className"> {
  className?: string;
  motion?: MotionProp;
}

/*
 * Checkbox: a 20px squircle inside a 40px state-layer target. Checking pops
 * the box, softens its corners and draws the check mark in; pressing squishes
 * it. `indeterminate` draws a dash. Invalid fields turn it error red.
 */
export function Checkbox({ className, motion, ...props }: CheckboxProps) {
  return (
    <BaseCheckbox.Root
      data-slot="checkbox"
      data-motion={motion}
      className={cn(
        "group state-layer focus-ring relative inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-shape-full text-on-surface-variant",
        "data-checked:text-primary data-indeterminate:text-primary data-invalid:text-error",
        "data-disabled:cursor-default data-disabled:opacity-(--ex-disabled-content) data-disabled:before:hidden",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          // Border color is explicit: currentColor is the check mark's color.
          "flex size-5 items-center justify-center rounded-shape-extra-small corner-squircle border-2 border-on-surface-variant text-on-primary",
          "transition-[background-color,border-color,border-radius,transform] spring-spatial-fast group-active:scale-90",
          "group-data-invalid:border-error group-data-disabled:border-on-surface",
          "group-data-checked:animate-pop group-data-indeterminate:animate-pop",
          "group-data-checked:rounded-shape-small group-data-indeterminate:rounded-shape-small",
          "group-data-checked:border-primary group-data-checked:bg-primary group-data-indeterminate:border-primary group-data-indeterminate:bg-primary",
          "group-data-invalid:group-data-checked:border-error group-data-invalid:group-data-checked:bg-error group-data-invalid:text-on-error",
          "group-data-disabled:group-data-checked:border-on-surface group-data-disabled:group-data-checked:bg-on-surface group-data-disabled:text-surface",
        )}
      >
        <BaseCheckbox.Indicator
          keepMounted
          className="flex"
          render={(indicatorProps, state) => (
            <span {...indicatorProps}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="size-4">
                {/* pathLength=1 lets the stroke "draw" via dashoffset 1 → 0. */}
                <path
                  d={state.indeterminate ? "M6 12h12" : "M5 12.5l4.5 4.5L19 7.5"}
                  pathLength={1}
                  strokeDasharray={1}
                  className="[stroke-dashoffset:1] transition-[stroke-dashoffset] spring-effects-default group-data-checked:[stroke-dashoffset:0] group-data-indeterminate:[stroke-dashoffset:0]"
                />
              </svg>
            </span>
          )}
        />
      </span>
    </BaseCheckbox.Root>
  );
}
