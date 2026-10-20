"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "@/registry/lib/utils";

/*
 * Lists: a column of items with a headline, optional overline and supporting
 * text, and leading/trailing slots. The `segmented` variant is the M3
 * Expressive look: each item is its own rounded tile, separated by a small gap,
 * with larger corners at the ends of the list.
 *
 * Items are static by default. Make one interactive by rendering it as a link
 * or button: `render={<a href="/inbox" />}` or `render={<button type="button" />}`.
 */

export interface ListProps extends React.ComponentProps<"ul"> {
  variant?: "standard" | "segmented";
}

export function List({ className, variant = "standard", ...props }: ListProps) {
  return (
    <ul
      data-slot="list"
      data-variant={variant}
      // Safari drops list semantics when list-style is none; restore them.
      role="list"
      className={cn("group/list flex flex-col py-2 data-[variant=segmented]:gap-0.5 data-[variant=segmented]:py-0", className)}
      {...props}
    />
  );
}

export interface ListItemProps extends Omit<useRender.ComponentProps<"div">, "children"> {
  headline: React.ReactNode;
  /** Small text above the headline. */
  overline?: React.ReactNode;
  /** Text below the headline. Long text wraps to a three-line item. */
  supportingText?: React.ReactNode;
  /** Icon (24px), avatar (40px) or image, before the text. */
  leading?: React.ReactNode;
  /** Icon, checkbox, switch or short text after the text. */
  trailing?: React.ReactNode;
  /** Selected state, e.g. the current item in a list-detail layout. */
  selected?: boolean;
  disabled?: boolean;
  /** Props for the `<li>` wrapper. */
  itemProps?: React.ComponentProps<"li">;
}

export function ListItem({
  className,
  headline,
  overline,
  supportingText,
  leading,
  trailing,
  selected = false,
  disabled = false,
  itemProps,
  render,
  ref,
  ...props
}: ListItemProps) {
  const interactive = render !== undefined;
  const row = useRender({
    defaultTagName: "div",
    render,
    ref,
    props: mergeProps<"div">(
      {
        "data-slot": "list-item",
        "data-selected": selected ? "" : undefined,
        "data-disabled": disabled ? "" : undefined,
        "aria-disabled": interactive && disabled ? true : undefined,
        "aria-current": interactive && selected ? "true" : undefined,
        className: cn(
          "flex min-h-14 w-full items-center gap-4 py-2 ps-4 pe-6 text-start text-on-surface-variant",
          "transition-[background-color,border-radius] spring-effects-fast",
          "[&_svg]:size-6 [&_svg]:shrink-0",
          // Two-line items are 72px tall, three-line 88px.
          supportingText && "min-h-18",
          overline && supportingText && "min-h-22 items-start py-3",
          interactive && "state-layer focus-ring cursor-pointer",
          "data-selected:bg-secondary-container data-selected:text-on-secondary-container",
          "data-disabled:pointer-events-none data-disabled:opacity-(--ex-disabled-content)",
          // Segmented: each item is a tile; corners grow at the ends and when selected.
          "group-data-[variant=segmented]/list:rounded-shape-extra-small group-data-[variant=segmented]/list:bg-surface-container",
          "group-data-[variant=segmented]/list:data-selected:rounded-shape-large group-data-[variant=segmented]/list:data-selected:bg-secondary-container",
          className,
        ),
        children: (
          <>
            {leading && (
              <span data-slot="list-item-leading" className="flex shrink-0 items-center justify-center">
                {leading}
              </span>
            )}
            <span className="flex min-w-0 flex-1 flex-col">
              {overline && <span className="text-label-medium">{overline}</span>}
              <span className="text-body-large text-on-surface in-data-selected:text-on-secondary-container">{headline}</span>
              {supportingText && <span className="line-clamp-2 text-body-medium">{supportingText}</span>}
            </span>
            {trailing && (
              <span data-slot="list-item-trailing" className="flex shrink-0 items-center text-label-small [&_svg]:size-6">
                {trailing}
              </span>
            )}
          </>
        ),
      } as React.ComponentProps<"div">,
      props,
    ),
  });
  return (
    <li
      {...itemProps}
      className={cn(
        "flex",
        // Segmented ends: the first and last tiles get large outer corners.
        "group-data-[variant=segmented]/list:first:[&>*]:rounded-t-shape-large group-data-[variant=segmented]/list:last:[&>*]:rounded-b-shape-large",
        itemProps?.className,
      )}
    >
      {row}
    </li>
  );
}
