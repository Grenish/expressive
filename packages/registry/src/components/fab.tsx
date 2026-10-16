"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";
import { Ripple } from "@/registry/components/ripple";

/*
 * Floating action button in the three M3 Expressive sizes. Pass `label` for an
 * extended FAB; icon-only FABs need an accessible name.
 */
export const fabVariants = cva(
  [
    "state-layer focus-ring relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap",
    "shadow-elevation-3 hover:shadow-elevation-4 focus-visible:shadow-elevation-3 active:shadow-elevation-3",
    "transition-[border-radius,box-shadow,background-color] spring-spatial-fast",
    "disabled:cursor-default disabled:bg-on-surface/(--ex-disabled-container) disabled:text-on-surface/(--ex-disabled-content) disabled:shadow-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      color: {
        "primary-container": "bg-primary-container text-on-primary-container",
        "secondary-container": "bg-secondary-container text-on-secondary-container",
        "tertiary-container": "bg-tertiary-container text-on-tertiary-container",
        primary: "bg-primary text-on-primary",
        secondary: "bg-secondary text-on-secondary",
        tertiary: "bg-tertiary text-on-tertiary",
        surface: "bg-surface-container-high text-primary",
      },
      size: {
        default: "h-14 min-w-14 rounded-shape-large active:rounded-shape-medium [&_svg]:size-6",
        medium: "h-20 min-w-20 rounded-shape-large-increased active:rounded-shape-large [&_svg]:size-7",
        large: "h-24 min-w-24 rounded-shape-extra-large active:rounded-shape-large-increased [&_svg]:size-9",
      },
      extended: { true: "", false: "" },
    },
    compoundVariants: [
      { extended: true, size: "default", className: "gap-3 px-4 text-title-medium" },
      { extended: true, size: "medium", className: "gap-3 px-6 text-title-large" },
      { extended: true, size: "large", className: "gap-4 px-7 text-headline-small" },
    ],
    defaultVariants: { color: "primary-container", size: "default", extended: false },
  },
);

type FabBase = Omit<VariantProps<typeof fabVariants>, "extended"> &
  Omit<BaseButton.Props, "className" | "color"> & {
    icon?: React.ReactNode;
    motion?: MotionProp;
    className?: string;
  };

export type FabProps = FabBase &
  ({ label: React.ReactNode } | { label?: undefined; "aria-label": string } | { label?: undefined; "aria-labelledby": string });

export function Fab({ className, color, size, icon, label, motion, disabled, children, ...props }: FabProps) {
  const extended = label !== undefined;
  return (
    <BaseButton
      data-slot="fab"
      data-motion={motion}
      disabled={disabled}
      className={cn(fabVariants({ color, size, extended }), className)}
      {...props}
    >
      {icon}
      {label}
      {children}
      <Ripple motion={motion} disabled={disabled} />
    </BaseButton>
  );
}
