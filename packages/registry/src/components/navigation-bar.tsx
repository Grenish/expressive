import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "@/registry/lib/utils";

/*
 * Bottom navigation bar (M3 Expressive "flexible" bar). Items are links:
 * pass `render={<a href="/inbox" />}` (or your router's Link) and mark the
 * current page with `active`. The active indicator pill springs open from the
 * icon's center.
 */

export interface NavigationBarProps extends React.ComponentProps<"nav"> {
  /** Accessible name for the landmark. */
  "aria-label"?: string;
}

export function NavigationBar({ className, children, "aria-label": ariaLabel = "Main", ...props }: NavigationBarProps) {
  return (
    <nav
      data-slot="navigation-bar"
      aria-label={ariaLabel}
      className={cn("flex h-16 w-full items-stretch justify-around bg-surface-container text-on-surface-variant", className)}
      {...props}
    >
      {children}
    </nav>
  );
}

export interface NavigationItemProps extends useRender.ComponentProps<"a"> {
  icon: React.ReactNode;
  /** Shown instead of `icon` when active (usually the filled variant). */
  activeIcon?: React.ReactNode;
  label: React.ReactNode;
  active?: boolean;
  /** Small dot or count on the icon, e.g. `badge={3}` or `badge` for a dot. */
  badge?: boolean | number | string;
}

export function Badge({ value }: { value: NonNullable<NavigationItemProps["badge"]> }) {
  if (value === false) return null;
  const dot = value === true;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute rounded-shape-full bg-error text-label-small text-on-error",
        dot ? "top-0.5 left-[calc(50%+6px)] size-1.5" : "-top-0.5 left-[calc(50%+2px)] flex h-4 min-w-4 items-center justify-center px-1",
      )}
    >
      {dot ? null : value}
    </span>
  );
}

export function NavigationBarItem({ className, icon, activeIcon, label, active = false, badge, render, ...props }: NavigationItemProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      {
        "data-slot": "navigation-bar-item",
        "data-active": active ? "" : undefined,
        "aria-current": active ? "page" : undefined,
        className: cn(
          "group focus-ring flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-shape-medium pt-1.5 pb-2 text-label-medium",
          "data-active:text-on-surface",
          className,
        ),
        children: (
          <>
            <span className="relative flex h-8 w-14 items-center justify-center [&_svg]:size-6">
              {/* Active indicator, plus a state layer that follows its shape. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 scale-x-[0.4] rounded-shape-full bg-secondary-container opacity-0 transition-[transform,opacity] spring-spatial-fast group-data-active:scale-x-100 group-data-active:opacity-100"
              />
              <span aria-hidden="true" className="state-layer absolute inset-0 rounded-shape-full group-hover:before:opacity-(--ex-state-hover) group-active:before:opacity-(--ex-state-pressed)" />
              <span className="relative flex group-data-active:text-on-secondary-container">
                {active && activeIcon ? activeIcon : icon}
              </span>
              {badge !== undefined && <Badge value={badge} />}
            </span>
            <span className="group-data-active:font-bold">{label}</span>
          </>
        ),
      } as React.ComponentProps<"a">,
      props,
    ),
  });
}
