"use client";

import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";
import { useComposedRef } from "@/registry/lib/use-fluid";

/*
 * Tabs organize content into views at the same level. Primary tabs sit under
 * a top app bar; their indicator hugs the label. Secondary tabs divide one
 * area further; their indicator spans the whole tab. The indicator springs
 * from tab to tab.
 */

export const Tabs = BaseTabs.Root;

type TabsVariant = "primary" | "secondary";
const TabsVariantContext = React.createContext<TabsVariant>("primary");

export interface TabsListProps extends Omit<BaseTabs.List.Props, "className"> {
  variant?: TabsVariant;
  /** Let the row scroll sideways, with tabs sized to their labels. Use for more than four or five tabs. */
  scrollable?: boolean;
  motion?: MotionProp;
  className?: string;
}

/** Positions the indicator under the active tab (or its label, for primary tabs). */
function useIndicator(list: React.RefObject<HTMLDivElement | null>, indicator: React.RefObject<HTMLSpanElement | null>, variant: TabsVariant) {
  React.useLayoutEffect(() => {
    const root = list.current;
    const bar = indicator.current;
    if (!root || !bar) return;
    let first = true;
    const place = () => {
      const tab = root.querySelector<HTMLElement>('[data-slot="tab"][data-active]');
      if (!tab) {
        bar.style.opacity = "0";
        return;
      }
      const target = variant === "primary" ? (tab.querySelector<HTMLElement>('[data-slot="tab-content"]') ?? tab) : tab;
      const rootBox = root.getBoundingClientRect();
      const box = target.getBoundingClientRect();
      // The first placement shouldn't animate in from the start of the row.
      if (first) bar.style.transition = "none";
      bar.style.opacity = "1";
      bar.style.width = `${Math.max(box.width, variant === "primary" ? 24 : 0)}px`;
      bar.style.transform = `translateX(${box.left - rootBox.left + root.scrollLeft - (variant === "primary" ? Math.max(0, 24 - box.width) / 2 : 0)}px)`;
      if (first) {
        void bar.offsetWidth;
        bar.style.transition = "";
        first = false;
      }
    };
    place();
    const mutations = new MutationObserver(place);
    mutations.observe(root, { attributes: true, attributeFilter: ["data-active"], subtree: true, childList: true });
    const resize = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(place);
    resize?.observe(root);
    for (const tab of root.querySelectorAll('[data-slot="tab"]')) resize?.observe(tab);
    return () => {
      mutations.disconnect();
      resize?.disconnect();
    };
  }, [list, indicator, variant]);
}

export function TabsList({ className, variant = "primary", scrollable = false, motion, children, ref, ...props }: TabsListProps) {
  const list = React.useRef<HTMLDivElement>(null);
  const indicator = React.useRef<HTMLSpanElement>(null);
  useIndicator(list, indicator, variant);
  return (
    <TabsVariantContext value={variant}>
      <BaseTabs.List
        ref={useComposedRef(list, ref)}
        data-slot="tabs-list"
        data-variant={variant}
        data-scrollable={scrollable ? "" : undefined}
        data-motion={motion}
        className={cn(
          "relative flex shrink-0 border-b border-outline-variant",
          // Fixed tabs share the width equally; scrollable ones hug their labels.
          scrollable ? "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>[data-slot=tab]]:shrink-0" : "[&>[data-slot=tab]]:flex-1",
          className,
        )}
        {...props}
      >
        {children}
        <span
          ref={indicator}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 bg-primary opacity-0",
            "transition-[transform,width] spring-spatial-fast",
            variant === "primary" ? "h-0.75 rounded-t-shape-full" : "h-0.5",
          )}
        />
      </BaseTabs.List>
    </TabsVariantContext>
  );
}

export interface TabProps extends Omit<BaseTabs.Tab.Props, "className"> {
  /** Icon above the label (primary) or before it (secondary). */
  icon?: React.ReactNode;
  /** A <Badge>: pinned to the icon, or after the label when there's no icon. */
  badge?: React.ReactNode;
  className?: string;
}

export function Tab({ className, icon, badge, children, ...props }: TabProps) {
  const variant = React.useContext(TabsVariantContext);
  const stacked = variant === "primary" && icon && children;
  return (
    <BaseTabs.Tab
      data-slot="tab"
      className={cn(
        "state-layer focus-ring relative flex h-12 min-w-0 cursor-pointer select-none items-center justify-center px-4 text-title-small text-on-surface-variant",
        "transition-colors spring-effects-fast hover:text-on-surface",
        "data-disabled:cursor-default data-disabled:opacity-(--ex-disabled-content)",
        variant === "primary" ? "data-active:text-primary" : "data-active:text-on-surface",
        stacked && "h-16",
        "[&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0",
        // A badge on the icon pins to its top-right corner, like <BadgeAnchor>.
        "[&_[data-slot=tab-icon]>[data-slot=badge]]:absolute [&_[data-slot=tab-icon]>[data-slot=badge]]:-top-0.5 [&_[data-slot=tab-icon]>[data-slot=badge]]:left-[calc(100%-10px)]",
        "[&_[data-slot=tab-icon]>[data-slot=badge][data-dot]]:top-0.5 [&_[data-slot=tab-icon]>[data-slot=badge][data-dot]]:left-[calc(100%-6px)]",
        className,
      )}
      {...props}
    >
      <span
        data-slot="tab-content"
        className={cn("relative flex items-center gap-2 whitespace-nowrap", stacked && "flex-col gap-0.5")}
      >
        {icon && (
          <span data-slot="tab-icon" className="relative flex">
            {icon}
            {badge}
          </span>
        )}
        {children && <span>{children}</span>}
        {!icon && badge}
      </span>
    </BaseTabs.Tab>
  );
}

export interface TabsPanelProps extends Omit<BaseTabs.Panel.Props, "className"> {
  className?: string;
}

export function TabsPanel({ className, ...props }: TabsPanelProps) {
  return <BaseTabs.Panel data-slot="tabs-panel" className={cn("focus-ring outline-none", className)} {...props} />;
}
