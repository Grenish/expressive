"use client";

import * as React from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";

/*
 * Modal side sheet: supplementary content or filters that slide in from the
 * edge of the window. Base UI's drawer provides focus trapping, Escape, scrim
 * dismissal and swipe-to-dismiss. Set `side="left"` on <SideSheet> for a
 * sheet on the left edge.
 */

type Side = "left" | "right";
const SideContext = React.createContext<Side>("right");

export interface SideSheetProps extends Omit<BaseDrawer.Root.Props, "swipeDirection"> {
  side?: Side;
}

export function SideSheet({ side = "right", ...props }: SideSheetProps) {
  return (
    <SideContext value={side}>
      <BaseDrawer.Root swipeDirection={side} {...props} />
    </SideContext>
  );
}

export const SideSheetTrigger = BaseDrawer.Trigger;
export const SideSheetClose = BaseDrawer.Close;

export interface SideSheetContentProps extends Omit<BaseDrawer.Popup.Props, "className"> {
  motion?: MotionProp;
  className?: string;
}

export function SideSheetContent({ className, motion, children, ...props }: SideSheetContentProps) {
  const side = React.useContext(SideContext);
  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop
        data-slot="side-sheet-backdrop"
        data-motion={motion}
        className={cn(
          "fixed inset-0 z-50 bg-scrim/32 opacity-[calc(1-var(--drawer-swipe-progress,0))]",
          "transition-opacity spring-effects-default data-swiping:transition-none",
          "data-starting-style:opacity-0 data-ending-style:opacity-0",
        )}
      />
      <BaseDrawer.Viewport className={cn("fixed inset-0 z-50 flex items-stretch", side === "right" ? "justify-end" : "justify-start")}>
        <BaseDrawer.Popup
          data-slot="side-sheet"
          data-side={side}
          data-motion={motion}
          className={cn(
            "relative flex h-full w-[calc(100vw-3.5rem)] max-w-100 flex-col bg-surface-container-low text-on-surface shadow-elevation-1 outline-none",
            side === "right" ? "rounded-l-shape-large" : "rounded-r-shape-large",
            "[transform:translateX(var(--drawer-swipe-movement-x,0px))]",
            "transition-transform spring-spatial-default data-swiping:transition-none data-swiping:select-none",
            side === "right"
              ? "data-starting-style:[transform:translateX(100%)] data-ending-style:[transform:translateX(100%)]"
              : "data-starting-style:[transform:translateX(-100%)] data-ending-style:[transform:translateX(-100%)]",
            // Sheet color past the outer edge, so the spring's overshoot never shows a gap.
            "after:pointer-events-none after:absolute after:inset-y-0 after:w-12 after:bg-inherit after:content-['']",
            side === "right" ? "after:left-full" : "after:right-full",
            className,
          )}
          {...props}
        >
          <BaseDrawer.Content className="flex min-h-0 flex-1 flex-col">{children}</BaseDrawer.Content>
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
}

export interface SideSheetHeaderProps extends React.ComponentProps<"div"> {
  /** Leading slot, e.g. a back IconButton. */
  navigation?: React.ReactNode;
  /** Trailing slot, usually a close IconButton inside <SideSheetClose render={…} />. */
  action?: React.ReactNode;
}

export function SideSheetHeader({ className, navigation, action, children, ...props }: SideSheetHeaderProps) {
  return (
    <div data-slot="side-sheet-header" className={cn("flex min-h-18 shrink-0 items-center gap-2 ps-6 pe-3 pt-3", navigation && "ps-3", className)} {...props}>
      {navigation}
      <div className="min-w-0 flex-1">{children}</div>
      {action}
    </div>
  );
}

export function SideSheetTitle({ className, ...props }: BaseDrawer.Title.Props & { className?: string }) {
  return <BaseDrawer.Title data-slot="side-sheet-title" className={cn("truncate text-title-large text-on-surface-variant", className)} {...props} />;
}

export function SideSheetDescription({ className, ...props }: BaseDrawer.Description.Props & { className?: string }) {
  return <BaseDrawer.Description data-slot="side-sheet-description" className={cn("text-body-medium text-on-surface-variant", className)} {...props} />;
}

/** Scrolling content area between the header and the actions. */
export function SideSheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="side-sheet-body" className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-2", className)} {...props} />;
}

/** Bottom action row, separated by a divider. */
export function SideSheetActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="side-sheet-actions"
      className={cn("flex shrink-0 items-center gap-2 border-t border-outline-variant px-6 pt-4 pb-6", className)}
      {...props}
    />
  );
}
