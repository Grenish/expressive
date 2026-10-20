"use client";

import * as React from "react";
import { cn } from "@/registry/lib/utils";

/*
 * Data table: rows of records with sortable column headers, selectable rows
 * and numeric alignment, on Expressive surfaces and type. It's a real
 * <table>, so screen readers announce headers and positions; wide tables
 * scroll sideways inside their container instead of the page.
 *
 *   <Table aria-label="Orders">
 *     <TableHeader><TableRow><TableHead sort="ascending" onSort={…}>Date</TableHead>…</TableRow></TableHeader>
 *     <TableBody><TableRow><TableCell>…</TableCell></TableRow></TableBody>
 *   </Table>
 */

type Density = "comfortable" | "compact";
const DensityContext = React.createContext<Density>("comfortable");

export interface TableProps extends React.ComponentProps<"table"> {
  /** `outlined` draws a border around the table; `filled` sits on a tonal surface. */
  variant?: "outlined" | "filled" | "plain";
  /** Row height: 52px (comfortable) or 40px (compact). */
  density?: Density;
  /** Keep the header row visible while the body scrolls (give the container a max height). */
  stickyHeader?: boolean;
  /** Props for the scrolling wrapper, e.g. a `className` with a max height. */
  containerProps?: React.ComponentProps<"div">;
}

export function Table({ className, variant = "outlined", density = "comfortable", stickyHeader = false, containerProps, ...props }: TableProps) {
  return (
    <DensityContext value={density}>
      <div
        data-slot="table-container"
        data-variant={variant}
        {...containerProps}
        className={cn(
          "group/table w-full overflow-auto rounded-shape-large",
          variant === "outlined" && "border border-outline-variant bg-surface",
          variant === "filled" && "bg-surface-container-low",
          stickyHeader && "[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10",
          containerProps?.className,
        )}
      >
        <table
          data-slot="table"
          data-density={density}
          className={cn("w-full caption-bottom border-collapse text-body-medium text-on-surface", className)}
          {...props}
        />
      </div>
    </DensityContext>
  );
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b [&_tr]:border-outline-variant", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("border-t border-outline-variant text-title-small", className)} {...props} />;
}

export interface TableRowProps extends React.ComponentProps<"tr"> {
  /** Highlights the row and sets `aria-selected`. Pair it with a Checkbox in the first cell. */
  selected?: boolean;
}

export function TableRow({ className, selected, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      data-selected={selected ? "" : undefined}
      aria-selected={selected}
      className={cn(
        "border-b border-outline-variant/60 transition-colors spring-effects-fast",
        // Body rows get a hover tint; header rows don't.
        "[tbody>&]:hover:bg-on-surface/(--ex-state-hover)",
        "data-selected:bg-secondary-container data-selected:text-on-secondary-container data-selected:hover:bg-secondary-container",
        className,
      )}
      {...props}
    />
  );
}

export type SortDirection = "ascending" | "descending" | "none";

export interface TableHeadProps extends React.ComponentProps<"th"> {
  /** Right-align, for numbers (and their headers). */
  numeric?: boolean;
  /** Current sort of this column. Set it (even to "none") to make the header a sort button. */
  sort?: SortDirection;
  /**
   * Called when the sort button is pressed; decide the next direction yourself.
   * Gets the click event, so TanStack Table's `getToggleSortingHandler()` fits directly (shift-click multi-sorts).
   */
  onSort?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function TableHead({ className, numeric, sort, onSort, children, ...props }: TableHeadProps) {
  const density = React.useContext(DensityContext);
  const sortable = sort !== undefined;
  return (
    <th
      data-slot="table-head"
      scope="col"
      aria-sort={sortable && sort !== "none" ? sort : undefined}
      className={cn(
        "bg-inherit px-4 text-start align-middle text-title-small whitespace-nowrap text-on-surface-variant",
        "group-data-[variant=outlined]/table:bg-surface group-data-[variant=filled]/table:bg-surface-container-low",
        density === "compact" ? "h-10" : "h-14",
        numeric && "text-end",
        sortable && "px-2",
        className,
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          data-sort={sort}
          className={cn(
            "group/sort state-layer focus-ring inline-flex h-8 cursor-pointer items-center gap-1 rounded-shape-full px-2 text-title-small",
            "data-[sort=ascending]:text-on-surface data-[sort=descending]:text-on-surface",
            numeric && "flex-row-reverse",
          )}
        >
          {children}
          {/* Arrow: faint until the column is sorted, flipped for descending. */}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="currentColor"
            className={cn(
              "size-4.5 shrink-0 transition-[transform,opacity] spring-spatial-fast",
              "opacity-0 group-hover/sort:opacity-60 group-focus-visible/sort:opacity-60",
              "group-data-[sort=ascending]/sort:opacity-100 group-data-[sort=descending]/sort:rotate-180 group-data-[sort=descending]/sort:opacity-100",
            )}
          >
            <path d="M11 20V7.83l-5.6 5.6L4 12l8-8 8 8-1.4 1.43-5.6-5.6V20Z" />
          </svg>
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export interface TableCellProps extends React.ComponentProps<"td"> {
  /** Right-align with tabular figures, for numbers. */
  numeric?: boolean;
}

export function TableCell({ className, numeric, ...props }: TableCellProps) {
  const density = React.useContext(DensityContext);
  return (
    <td
      data-slot="table-cell"
      className={cn(
        // Values stay on one line (the table scrolls instead); add `whitespace-normal` for long text.
        "px-4 align-middle whitespace-nowrap",
        density === "compact" ? "h-10" : "h-13",
        numeric && "text-end tabular-nums",
        // A Checkbox or IconButton as the only child sits flush with the padding.
        "has-[>[role=checkbox]]:w-0 has-[>[role=checkbox]]:pe-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("px-4 py-3 text-start text-body-small text-on-surface-variant", className)} {...props} />;
}
