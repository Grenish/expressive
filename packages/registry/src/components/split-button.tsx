"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";
import { useComposedRef, useFluidPress } from "@/registry/lib/use-fluid";
import { Ripple } from "@/registry/components/ripple";
import { Menu, MenuContent, type MenuContentProps, MenuTrigger } from "@/registry/components/menu";

/*
 * Split button: a main action plus a trailing button that opens a menu of
 * related actions. The halves share square inner corners and pill ends; while
 * the menu is open the trailing half morphs into a circle and its chevron
 * flips.
 *
 * Corners are driven by variables (see button-group.tsx): --ex-corner-start
 * and --ex-corner-end choose between the inner radius and a pill, and state
 * only changes --ex-corner-inner.
 */
const half = cva(
  [
    "state-layer focus-ring relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap",
    "h-(--ex-control-height) [--ex-corner-pill:calc(var(--ex-control-height)/2)]",
    "[border-start-start-radius:var(--ex-corner-start)] [border-end-start-radius:var(--ex-corner-start)]",
    "[border-start-end-radius:var(--ex-corner-end)] [border-end-end-radius:var(--ex-corner-end)]",
    "active:[--ex-corner-inner:var(--ex-corner-pressed)]",
    "transition-[border-radius,width,background-color,color,box-shadow] spring-spatial-fast",
    "disabled:cursor-default disabled:bg-on-surface/(--ex-disabled-container) disabled:text-on-surface/(--ex-disabled-content) disabled:shadow-none",
    "data-disabled:cursor-default",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        filled: "bg-primary text-on-primary",
        tonal: "bg-secondary-container text-on-secondary-container",
        outlined: "border border-outline-variant text-on-surface-variant disabled:border-on-surface/(--ex-disabled-container) disabled:bg-transparent",
        elevated: "bg-surface-container-low text-primary shadow-elevation-1 hover:shadow-elevation-2",
      },
      size: {
        xs: "gap-1 text-label-large [--ex-control-height:2rem] [--ex-corner-inner:var(--ex-shape-corner-extra-small)] [--ex-corner-pressed:var(--ex-shape-corner-small)] [&_svg]:size-5",
        sm: "gap-2 text-label-large [--ex-control-height:2.5rem] [--ex-corner-inner:var(--ex-shape-corner-extra-small)] [--ex-corner-pressed:var(--ex-shape-corner-small)] [&_svg]:size-5",
        md: "gap-2 text-title-medium [--ex-control-height:3.5rem] [--ex-corner-inner:var(--ex-shape-corner-extra-small)] [--ex-corner-pressed:var(--ex-shape-corner-medium)] [&_svg]:size-6",
        lg: "gap-3 text-headline-small [--ex-control-height:6rem] [--ex-corner-inner:var(--ex-shape-corner-small)] [--ex-corner-pressed:var(--ex-shape-corner-large)] [&_svg]:size-8",
        xl: "gap-4 text-headline-large [--ex-control-height:8.5rem] [--ex-corner-inner:var(--ex-shape-corner-medium)] [--ex-corner-pressed:var(--ex-shape-corner-large-increased)] [&_svg]:size-10",
      },
    },
    defaultVariants: { variant: "filled", size: "sm" },
  },
);

const leadingPadding = { xs: "ps-3 pe-2.5", sm: "ps-4 pe-3", md: "ps-6 pe-5", lg: "ps-12 pe-8", xl: "ps-16 pe-12" };
// Resting width of the trailing half; open, it widens to a circle (width = height).
const trailingWidth = { xs: "w-7", sm: "w-9", md: "w-12", lg: "w-20", xl: "w-28" };

type Variants = VariantProps<typeof half>;

export interface SplitButtonProps extends Omit<BaseButton.Props, "className">, Variants {
  /** Leading icon on the main action. */
  icon?: React.ReactNode;
  /** The menu items, e.g. a few <MenuItem>s. */
  menu: React.ReactNode;
  /** Accessible name for the trailing button. */
  menuLabel?: string;
  /** Props for the menu popup (alignment, color…). */
  menuProps?: Omit<MenuContentProps, "children">;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  motion?: MotionProp;
  className?: string;
}

export function SplitButton({
  className,
  variant,
  size,
  icon,
  menu,
  menuLabel = "More options",
  menuProps,
  open,
  defaultOpen,
  onOpenChange,
  motion,
  disabled,
  children,
  ref,
  ...props
}: SplitButtonProps) {
  const leading = React.useRef<HTMLElement>(null);
  const trailing = React.useRef<HTMLButtonElement>(null);
  useFluidPress(leading, motion, !disabled);
  useFluidPress(trailing, motion, !disabled);
  const resolved = size ?? "sm";
  return (
    <div role="group" data-slot="split-button" className="inline-flex shrink-0 items-center gap-0.5">
      <BaseButton
        ref={useComposedRef(leading, ref)}
        data-slot="split-button-action"
        data-motion={motion}
        disabled={disabled}
        className={cn(
          half({ variant, size }),
          leadingPadding[resolved],
          "[--ex-corner-start:var(--ex-corner-pill)] [--ex-corner-end:var(--ex-corner-inner)]",
          className,
        )}
        {...props}
      >
        {icon}
        {children}
        <Ripple motion={motion} disabled={disabled} />
      </BaseButton>
      <Menu open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <MenuTrigger
          ref={trailing}
          data-slot="split-button-menu"
          data-motion={motion}
          aria-label={menuLabel}
          disabled={disabled}
          className={cn(
            half({ variant, size }),
            trailingWidth[resolved],
            "group/trailing [--ex-corner-start:var(--ex-corner-inner)] [--ex-corner-end:var(--ex-corner-pill)]",
            // Open: a circle, centered on its own axis.
            "data-popup-open:w-(--ex-control-height) data-popup-open:[--ex-corner-inner:var(--ex-corner-pill)]",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="currentColor"
            className="transition-transform spring-spatial-fast group-data-popup-open/trailing:rotate-180"
          >
            <path d="m12 15.4-6-6L7.4 8l4.6 4.6L16.6 8 18 9.4Z" />
          </svg>
          <Ripple motion={motion} disabled={disabled} />
        </MenuTrigger>
        <MenuContent align="end" motion={motion} {...menuProps}>
          {menu}
        </MenuContent>
      </Menu>
    </div>
  );
}
