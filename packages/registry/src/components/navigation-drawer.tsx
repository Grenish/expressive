"use client";

import * as React from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";
import { useFluidPop } from "@/registry/lib/use-fluid";

/*
 * Navigation drawer: destinations in a column, for apps with many top-level
 * places. <NavigationDrawer> sits in the layout on large screens;
 * <ModalNavigationDrawer> slides in over the page (from a menu button) on
 * smaller ones. On medium screens, consider the expanded navigation rail.
 *
 * Items are links: pass `render={<a href="/inbox" />}` (or your router's Link)
 * and mark the current page with `active`.
 */

export interface NavigationDrawerProps extends React.ComponentProps<"nav"> {
  "aria-label"?: string;
}

const sheet = "flex w-90 max-w-full flex-col gap-0.5 overflow-y-auto overscroll-contain p-3 text-on-surface-variant";

export function NavigationDrawer({ className, "aria-label": ariaLabel = "Main", ...props }: NavigationDrawerProps) {
  return <nav data-slot="navigation-drawer" aria-label={ariaLabel} className={cn(sheet, "h-full shrink-0", className)} {...props} />;
}

export interface ModalNavigationDrawerProps extends Omit<BaseDrawer.Root.Props, "swipeDirection" | "children"> {
  /** The element that opens the drawer, usually a menu IconButton. */
  trigger?: React.ReactElement;
  "aria-label"?: string;
  motion?: MotionProp;
  className?: string;
  children?: React.ReactNode;
}

export function ModalNavigationDrawer({ trigger, "aria-label": ariaLabel = "Main", motion, className, children, ...root }: ModalNavigationDrawerProps) {
  return (
    <BaseDrawer.Root swipeDirection="left" {...root}>
      {trigger && <BaseDrawer.Trigger render={trigger} />}
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop
          data-motion={motion}
          className={cn(
            "fixed inset-0 z-50 bg-scrim/32 opacity-[calc(1-var(--drawer-swipe-progress,0))]",
            "transition-opacity spring-effects-default data-swiping:transition-none",
            "data-starting-style:opacity-0 data-ending-style:opacity-0",
          )}
        />
        <BaseDrawer.Viewport className="fixed inset-0 z-50 flex items-stretch justify-start">
          <BaseDrawer.Popup
            data-slot="modal-navigation-drawer"
            data-motion={motion}
            aria-label={ariaLabel}
            className={cn(
              "relative flex h-full w-[calc(100vw-3.5rem)] max-w-90 rounded-r-shape-large bg-surface-container-low shadow-elevation-1 outline-none",
              "[transform:translateX(var(--drawer-swipe-movement-x,0px))]",
              "transition-transform spring-spatial-default data-swiping:transition-none data-swiping:select-none",
              "data-starting-style:[transform:translateX(-100%)] data-ending-style:[transform:translateX(-100%)]",
              // Drawer color past the left edge, so the spring's overshoot never shows a gap.
              "after:pointer-events-none after:absolute after:inset-y-0 after:right-full after:w-12 after:bg-inherit after:content-['']",
              className,
            )}
          >
            <nav aria-label={ariaLabel} className={cn(sheet, "w-full")}>
              {children}
            </nav>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
}

/** A section title between groups of items. */
export function NavigationDrawerHeadline({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="navigation-drawer-headline" className={cn("px-4 pt-4 pb-2 text-title-small text-on-surface-variant", className)} {...props} />;
}

export interface NavigationDrawerItemProps extends useRender.ComponentProps<"a"> {
  icon?: React.ReactNode;
  /** Shown instead of `icon` when active (usually the filled variant). */
  activeIcon?: React.ReactNode;
  label: React.ReactNode;
  active?: boolean;
  /** Trailing text, e.g. an unread count ("24" or "100+"). */
  badge?: React.ReactNode;
}

export function NavigationDrawerItem({ className, icon, activeIcon, label, active = false, badge, render, ref, ...props }: NavigationDrawerItemProps) {
  const root = React.useRef<HTMLAnchorElement>(null);
  const indicator = React.useRef<HTMLSpanElement>(null);
  // Fluid: the indicator swells open with a jelly wobble.
  useFluidPop(root, { attributes: ["data-active"], target: indicator, from: 0.6 });
  return useRender({
    defaultTagName: "a",
    render,
    ref: [root, ref].filter(Boolean) as React.Ref<HTMLAnchorElement>[],
    props: mergeProps<"a">(
      {
        "data-slot": "navigation-drawer-item",
        "data-active": active ? "" : undefined,
        "aria-current": active ? "page" : undefined,
        className: cn(
          "group focus-ring relative flex h-14 shrink-0 cursor-pointer items-center gap-3 rounded-shape-full ps-4 pe-6 text-label-large",
          "data-active:text-on-secondary-container",
          "[&_svg]:size-6 [&_svg]:shrink-0",
          className,
        ),
        children: (
          <>
            <span
              ref={indicator}
              aria-hidden="true"
              className="absolute inset-0 scale-x-[0.6] rounded-shape-full bg-secondary-container opacity-0 transition-[transform,opacity] spring-spatial-fast group-data-active:scale-x-100 group-data-active:opacity-100 fluid:transition-opacity"
            />
            <span
              aria-hidden="true"
              className="state-layer absolute inset-0 rounded-shape-full group-hover:before:opacity-(--ex-state-hover) group-active:before:opacity-(--ex-state-pressed)"
            />
            {icon && <span className="relative flex">{active && activeIcon ? activeIcon : icon}</span>}
            <span className="relative min-w-0 flex-1 truncate group-data-active:font-bold">{label}</span>
            {badge !== undefined && <span className="relative text-label-large">{badge}</span>}
          </>
        ),
      } as React.ComponentProps<"a">,
      props,
    ),
  });
}
