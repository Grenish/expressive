import * as React from "react";
import { cn } from "@/registry/lib/utils";

/*
 * Badges flag new or unread content on an icon. Without `count` the badge is
 * a small 6px dot; with one it grows into a pill showing the number (capped
 * at `max`, e.g. "999+"). Wrap the icon in <BadgeAnchor> to pin the badge to
 * its top-right corner.
 */

export interface BadgeProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** The number (or short text) to show. Omit for a small dot. */
  count?: number | string;
  /** Counts above this show as `${max}+`. */
  max?: number;
  /**
   * Accessible text, e.g. "3 unread messages". Without it the badge is hidden
   * from screen readers, so put the count in the parent's label instead.
   */
  label?: string;
}

export function Badge({ className, count, max = 999, label, ...props }: BadgeProps) {
  const dot = count === undefined;
  const text = typeof count === "number" && count > max ? `${max}+` : count;
  return (
    <span
      data-slot="badge"
      data-dot={dot ? "" : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-shape-full bg-error text-label-small text-on-error",
        dot ? "size-1.5" : "h-4 min-w-4 px-1 tabular-nums",
        className,
      )}
      {...props}
    >
      {text}
    </span>
  );
}

export interface BadgeAnchorProps extends React.ComponentProps<"span"> {
  /** A <Badge>, placed over the top-right corner of `children`. */
  badge: React.ReactNode;
}

/** Positions a badge on an icon (24px icons by default). */
export function BadgeAnchor({ className, badge, children, ...props }: BadgeAnchorProps) {
  return (
    <span
      data-slot="badge-anchor"
      className={cn(
        "relative inline-flex [&>[data-slot=badge]]:absolute",
        // A dot sits just inside the corner; a count straddles it and grows to the right.
        "[&>[data-slot=badge][data-dot]]:top-0.5 [&>[data-slot=badge][data-dot]]:left-[calc(100%-6px)]",
        "[&>[data-slot=badge]:not([data-dot])]:-top-0.5 [&>[data-slot=badge]:not([data-dot])]:left-[calc(100%-10px)]",
        className,
      )}
      {...props}
    >
      {children}
      {badge}
    </span>
  );
}
