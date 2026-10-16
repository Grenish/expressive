"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "@/registry/lib/utils";
import { Badge, type NavigationItemProps } from "@/registry/components/navigation-bar";
import { useFluidPop } from "@/registry/lib/use-fluid";

/*
 * Navigation rail for medium and larger screens. Collapsed (96px) it shows
 * icons with labels below; `expanded` widens it and lays items out
 * horizontally, like the M3 Expressive expanded rail.
 */

export interface NavigationRailProps extends React.ComponentProps<"nav"> {
  expanded?: boolean;
  /** Top slot for a menu button and/or FAB. */
  header?: React.ReactNode;
  "aria-label"?: string;
}

export function NavigationRail({ className, expanded = false, header, children, "aria-label": ariaLabel = "Main", ...props }: NavigationRailProps) {
  return (
    <nav
      data-slot="navigation-rail"
      data-expanded={expanded ? "" : undefined}
      aria-label={ariaLabel}
      className={cn(
        "group/rail flex h-full w-24 shrink-0 flex-col gap-1 py-6 text-on-surface-variant",
        "transition-[width,padding] spring-spatial-default data-expanded:w-60 data-expanded:px-5",
        className,
      )}
      {...props}
    >
      {header && <div className="mb-6 flex flex-col items-center gap-4 group-data-expanded/rail:items-start">{header}</div>}
      <div className="flex flex-col items-stretch gap-1">{children}</div>
    </nav>
  );
}

export function NavigationRailItem({ className, icon, activeIcon, label, active = false, badge, render, ref, ...props }: NavigationItemProps) {
  const root = React.useRef<HTMLAnchorElement>(null);
  const wide = React.useRef<HTMLSpanElement>(null);
  const compact = React.useRef<HTMLSpanElement>(null);
  // Fluid: whichever indicator is showing swells open with a jelly wobble.
  useFluidPop(root, { attributes: ["data-active"], target: wide, from: 0.5 });
  useFluidPop(root, { attributes: ["data-active"], target: compact, from: 0.35 });
  return useRender({
    defaultTagName: "a",
    render,
    ref: [root, ref].filter(Boolean) as React.Ref<HTMLAnchorElement>[],
    props: mergeProps<"a">(
      {
        "data-slot": "navigation-rail-item",
        "data-active": active ? "" : undefined,
        "aria-current": active ? "page" : undefined,
        className: cn(
          "group focus-ring relative flex cursor-pointer flex-col items-center gap-1 rounded-shape-medium py-1 text-label-medium",
          "group-data-expanded/rail:h-14 group-data-expanded/rail:flex-row group-data-expanded/rail:gap-3 group-data-expanded/rail:rounded-shape-full group-data-expanded/rail:px-4 group-data-expanded/rail:py-0 group-data-expanded/rail:text-label-large",
          "data-active:text-on-surface",
          className,
        ),
        children: (
          <>
            {/* In the expanded rail the indicator spans the whole item. */}
            <span
              ref={wide}
              aria-hidden="true"
              className="absolute inset-0 hidden scale-x-[0.6] rounded-shape-full bg-secondary-container opacity-0 transition-[transform,opacity] spring-spatial-fast group-data-active:scale-x-100 group-data-active:opacity-100 group-data-expanded/rail:block fluid:transition-opacity"
            />
            <span
              aria-hidden="true"
              className="state-layer absolute inset-0 hidden rounded-shape-full group-hover:before:opacity-(--ex-state-hover) group-active:before:opacity-(--ex-state-pressed) group-data-expanded/rail:block"
            />
            <span className="relative flex h-8 w-14 shrink-0 items-center justify-center group-data-expanded/rail:w-6 [&_svg]:size-6">
              <span
                ref={compact}
                aria-hidden="true"
                className="absolute inset-0 scale-x-[0.4] rounded-shape-full bg-secondary-container opacity-0 transition-[transform,opacity] spring-spatial-fast group-data-active:scale-x-100 group-data-active:opacity-100 group-data-expanded/rail:hidden fluid:transition-opacity"
              />
              <span
                aria-hidden="true"
                className="state-layer absolute inset-0 rounded-shape-full group-hover:before:opacity-(--ex-state-hover) group-active:before:opacity-(--ex-state-pressed) group-data-expanded/rail:hidden"
              />
              <span className="relative flex group-data-active:text-on-secondary-container">{active && activeIcon ? activeIcon : icon}</span>
              {badge !== undefined && <Badge value={badge} />}
            </span>
            <span className="relative truncate group-data-active:font-bold group-data-active:group-data-expanded/rail:text-on-secondary-container">
              {label}
            </span>
          </>
        ),
      } as React.ComponentProps<"a">,
      props,
    ),
  });
}
