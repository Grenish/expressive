"use client";

import * as React from "react";
import { cn } from "@/registry/lib/utils";

/*
 * Pagination: move through pages of results. The current page is a filled
 * pill; long ranges collapse into ellipses around it. Buttons by default;
 * pass `getHref` to render links instead (better for pages users may share or
 * open in a new tab).
 */

export interface PaginationProps extends Omit<React.ComponentProps<"nav">, "onChange"> {
  /** Current page, 1-based. */
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** Render pages as links to these URLs instead of buttons. */
  getHref?: (page: number) => string;
  /** Pages shown on each side of the current one. */
  siblingCount?: number;
  /** Labels, for translation. */
  labels?: { previous?: string; next?: string; page?: (page: number) => string };
  "aria-label"?: string;
}

type Slot = number | "start-ellipsis" | "end-ellipsis";

/** Pages to show: always the first and last, the current with its siblings, and ellipses for gaps. */
export function paginationRange(page: number, pageCount: number, siblingCount = 1): Slot[] {
  const total = siblingCount * 2 + 5; // first, last, current, two ellipses
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const left = Math.max(page - siblingCount, 2);
  const right = Math.min(page + siblingCount, pageCount - 1);
  const showLeft = left > 3;
  const showRight = right < pageCount - 2;
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (!showLeft) return [...range(1, 3 + siblingCount * 2), "end-ellipsis", pageCount];
  if (!showRight) return [1, "start-ellipsis", ...range(pageCount - 2 - siblingCount * 2, pageCount)];
  return [1, "start-ellipsis", ...range(left, right), "end-ellipsis", pageCount];
}

const pill =
  "state-layer focus-ring inline-flex h-10 min-w-10 shrink-0 cursor-pointer items-center justify-center rounded-shape-full px-3 text-label-large tabular-nums text-on-surface-variant transition-colors spring-effects-fast";

export function Pagination({
  className,
  page,
  pageCount,
  onPageChange,
  getHref,
  siblingCount = 1,
  labels,
  "aria-label": ariaLabel = "Pagination",
  ...props
}: PaginationProps) {
  const pageLabel = labels?.page ?? ((n: number) => `Page ${n}`);

  const control = (target: number, content: React.ReactNode, extra: Partial<React.ComponentProps<"a">> & { disabled?: boolean } = {}) => {
    const { disabled, className: extraClass, ...rest } = extra;
    if (getHref && !disabled) {
      return (
        <a href={getHref(target)} onClick={() => onPageChange?.(target)} className={cn(pill, extraClass)} {...rest}>
          {content}
        </a>
      );
    }
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onPageChange?.(target)}
        aria-label={rest["aria-label"]}
        aria-current={rest["aria-current"]}
        className={cn(pill, "disabled:cursor-default disabled:opacity-(--ex-disabled-content)", extraClass)}
      >
        {content}
      </button>
    );
  };

  const chevron = (d: string) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="size-5 rtl:-scale-x-100">
      <path d={d} />
    </svg>
  );

  return (
    <nav data-slot="pagination" aria-label={ariaLabel} className={className} {...props}>
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          {control(page - 1, chevron("M14 18 8 12l6-6 1.4 1.4-4.6 4.6 4.6 4.6Z"), {
            disabled: page <= 1,
            "aria-label": labels?.previous ?? "Previous page",
          })}
        </li>
        {paginationRange(page, pageCount, siblingCount).map((slot) =>
          typeof slot === "number" ? (
            <li key={slot}>
              {control(slot, slot, {
                "aria-label": pageLabel(slot),
                "aria-current": slot === page ? "page" : undefined,
                className: slot === page ? "bg-secondary-container text-on-secondary-container" : undefined,
              })}
            </li>
          ) : (
            <li key={slot} aria-hidden="true" className="flex h-10 w-8 items-center justify-center text-on-surface-variant">
              …
            </li>
          ),
        )}
        <li>
          {control(page + 1, chevron("M12.6 12 8 7.4 9.4 6l6 6-6 6L8 16.6Z"), {
            disabled: page >= pageCount,
            "aria-label": labels?.next ?? "Next page",
          })}
        </li>
      </ul>
    </nav>
  );
}
