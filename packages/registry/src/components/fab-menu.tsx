"use client";

import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";
import { useComposedRef, useFluidPress } from "@/registry/lib/use-fluid";
import { fabVariants } from "@/registry/components/fab";
import { Ripple } from "@/registry/components/ripple";

/*
 * FAB menu (M3 Expressive): a FAB that opens two to six related actions. On
 * open the FAB morphs into a smaller, filled close button and the actions
 * spring up above it as pill-shaped items, one after another. It's a menu
 * underneath, so arrow keys, typeahead and Escape all work.
 */

type FabMenuColor = "primary" | "secondary" | "tertiary";

const trigger: Record<FabMenuColor, string> = {
  primary: "data-popup-open:bg-primary data-popup-open:text-on-primary",
  secondary: "data-popup-open:bg-secondary data-popup-open:text-on-secondary",
  tertiary: "data-popup-open:bg-tertiary data-popup-open:text-on-tertiary",
};

const items: Record<FabMenuColor, string> = {
  primary: "bg-primary-container text-on-primary-container",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
};

const FabMenuColorContext = React.createContext<FabMenuColor>("primary");

export interface FabMenuProps {
  /** The FAB's icon while closed. It turns into a close icon when open. */
  icon: React.ReactNode;
  /** Accessible name for the FAB, e.g. "Create". */
  "aria-label": string;
  color?: FabMenuColor;
  /** Size of the closed FAB. Open, it's always the 56px close button. */
  size?: "default" | "medium" | "large";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: BaseMenu.Root.Props["onOpenChange"];
  disabled?: boolean;
  motion?: MotionProp;
  className?: string;
  /** <FabMenuItem>s, listed top to bottom. */
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

export function FabMenu({
  icon,
  "aria-label": ariaLabel,
  color = "primary",
  size = "default",
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  motion,
  className,
  children,
  ref,
}: FabMenuProps) {
  const local = React.useRef<HTMLButtonElement>(null);
  useFluidPress(local, motion, !disabled);
  const count = React.Children.count(children);
  return (
    <BaseMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={false}>
      <BaseMenu.Trigger
        ref={useComposedRef(local, ref)}
        data-slot="fab-menu"
        data-motion={motion}
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(
          fabVariants({ color: `${color}-container`, size }),
          "group/fab transition-[border-radius,box-shadow,background-color,color,width,height,min-width] spring-spatial-fast",
          // Open: shrink to the 56px close button with fully round corners.
          "data-popup-open:h-14 data-popup-open:min-w-14 data-popup-open:rounded-pill data-popup-open:[--ex-control-height:3.5rem] data-popup-open:[&_svg]:size-5",
          trigger[color],
          className,
        )}
      >
        <span className="grid [&>*]:col-start-1 [&>*]:row-start-1">
          <span className="flex transition-[transform,opacity] spring-spatial-fast group-data-popup-open/fab:rotate-90 group-data-popup-open/fab:opacity-0">
            {icon}
          </span>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="currentColor"
            className="-rotate-90 opacity-0 transition-[transform,opacity] spring-spatial-fast group-data-popup-open/fab:rotate-0 group-data-popup-open/fab:opacity-100"
          >
            <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
          </svg>
        </span>
        <Ripple motion={motion} disabled={disabled} />
      </BaseMenu.Trigger>
      <BaseMenu.Portal>
        <BaseMenu.Positioner side="top" align="end" sideOffset={8} collisionPadding={16} className="z-50 outline-none">
          <BaseMenu.Popup
            data-slot="fab-menu-list"
            data-motion={motion}
            className={cn(
              "group/fab-menu flex flex-col items-end gap-1 outline-none",
              "transition-opacity spring-effects-default data-ending-style:opacity-0",
            )}
          >
            <FabMenuColorContext value={color}>
              {React.Children.map(children, (child, index) => (
                // The item nearest the FAB arrives first.
                <span className="contents" style={{ "--ex-stagger": count - 1 - index } as React.CSSProperties}>
                  {child}
                </span>
              ))}
            </FabMenuColorContext>
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}

export interface FabMenuItemProps extends Omit<BaseMenu.Item.Props, "className"> {
  icon?: React.ReactNode;
  className?: string;
}

export function FabMenuItem({ className, icon, children, ...props }: FabMenuItemProps) {
  const color = React.useContext(FabMenuColorContext);
  return (
    <BaseMenu.Item
      data-slot="fab-menu-item"
      className={cn(
        "state-layer relative flex h-14 shrink-0 cursor-pointer select-none items-center gap-2 rounded-shape-full px-6 text-title-medium outline-none",
        "shadow-elevation-3 data-highlighted:before:opacity-(--ex-state-hover)",
        "data-disabled:cursor-default data-disabled:opacity-(--ex-disabled-content)",
        "[&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0",
        // Springs up from the FAB, staggered (the delay is a stagger offset, not a duration).
        "origin-bottom-right transition-[transform,opacity] spring-spatial-default [transition-delay:calc(var(--ex-stagger,0)*25ms)]",
        "group-data-starting-style/fab-menu:translate-y-4 group-data-starting-style/fab-menu:scale-75 group-data-starting-style/fab-menu:opacity-0",
        "group-data-ending-style/fab-menu:scale-90 group-data-ending-style/fab-menu:opacity-0 group-data-ending-style/fab-menu:[transition-delay:0ms]",
        items[color],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </BaseMenu.Item>
  );
}
