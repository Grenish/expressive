"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "@/registry/lib/utils";

/*
 * Breadcrumb: where the current page sits in the hierarchy. Items are links
 * (pass `href`, or `render={<Link href="…" />}` for your router); the last one
 * is the current page and isn't a link. Chevron separators are drawn between
 * items and hidden from screen readers.
 *
 *   <Breadcrumb>
 *     <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *     <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
 *     <BreadcrumbItem current>Button</BreadcrumbItem>
 *   </Breadcrumb>
 */

export interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  "aria-label"?: string;
}

export function Breadcrumb({ className, children, "aria-label": ariaLabel = "Breadcrumb", ...props }: BreadcrumbProps) {
  return (
    <nav data-slot="breadcrumb" aria-label={ariaLabel} className={className} {...props}>
      <ol className="flex flex-wrap items-center gap-0.5 text-label-large text-on-surface-variant">{children}</ol>
    </nav>
  );
}

export interface BreadcrumbItemProps extends useRender.ComponentProps<"a"> {
  /** The current page: rendered as text with `aria-current="page"`. */
  current?: boolean;
  /** Leading icon, e.g. a home icon on the first item. */
  icon?: React.ReactNode;
}

const separator = (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="size-4.5 shrink-0 text-outline rtl:-scale-x-100">
    <path d="M9.4 18 8 16.6l4.6-4.6L8 7.4 9.4 6l6 6Z" />
  </svg>
);

export function BreadcrumbItem({ className, current = false, icon, children, render, ref, ...props }: BreadcrumbItemProps) {
  const link = useRender({
    defaultTagName: "a",
    render,
    ref,
    props: mergeProps<"a">(
      {
        className: cn(
          "state-layer focus-ring inline-flex h-8 items-center gap-1.5 rounded-shape-full px-2 hover:text-on-surface [&_svg]:size-4.5",
          className,
        ),
        children: (
          <>
            {icon}
            {children}
          </>
        ),
      } as React.ComponentProps<"a">,
      props,
    ),
  });
  return (
    <li data-slot="breadcrumb-item" className="group/crumb flex items-center gap-0.5">
      {/* The separator precedes every item but the first. */}
      <span className="hidden group-not-first/crumb:flex">{separator}</span>
      {current ? (
        <span aria-current="page" className={cn("inline-flex h-8 items-center gap-1.5 px-2 text-on-surface [&_svg]:size-4.5", className)}>
          {icon}
          {children}
        </span>
      ) : (
        link
      )}
    </li>
  );
}
