"use client";

import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";

/*
 * Accordion: stacked sections that expand to show their content, built on
 * Base UI (arrow keys move between headers, Enter and Space toggle). The
 * `segmented` look matches Expressive's segmented lists: each section is its
 * own tile, and an open section grows rounder corners. Panels spring open on
 * the spatial motion tokens.
 */

type Variant = "segmented" | "divided";
const VariantContext = React.createContext<Variant>("segmented");

export interface AccordionProps extends Omit<BaseAccordion.Root.Props, "className"> {
  /** `segmented`: separate rounded tiles. `divided`: rows separated by lines. */
  variant?: Variant;
  motion?: MotionProp;
  className?: string;
}

export function Accordion({ className, variant = "segmented", motion, ...props }: AccordionProps) {
  return (
    <VariantContext value={variant}>
      <BaseAccordion.Root
        data-slot="accordion"
        data-variant={variant}
        data-motion={motion}
        className={cn("flex w-full flex-col", variant === "segmented" && "gap-0.5", className)}
        {...props}
      />
    </VariantContext>
  );
}

export interface AccordionItemProps extends Omit<BaseAccordion.Item.Props, "className"> {
  className?: string;
}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  const variant = React.useContext(VariantContext);
  return (
    <BaseAccordion.Item
      data-slot="accordion-item"
      className={cn(
        "transition-[border-radius,background-color] spring-spatial-fast",
        variant === "segmented"
          ? [
              "overflow-hidden rounded-shape-extra-small bg-surface-container text-on-surface",
              // Larger corners at the ends of the stack, and on an open section.
              "first:rounded-t-shape-large last:rounded-b-shape-large data-open:rounded-shape-large",
            ]
          : "border-b border-outline-variant text-on-surface",
        className,
      )}
      {...props}
    />
  );
}

export interface AccordionTriggerProps extends Omit<BaseAccordion.Trigger.Props, "className"> {
  /** Leading icon. */
  icon?: React.ReactNode;
  /** Smaller text under the title. */
  supportingText?: React.ReactNode;
  className?: string;
}

export function AccordionTrigger({ className, icon, supportingText, children, ...props }: AccordionTriggerProps) {
  return (
    <BaseAccordion.Header className="flex">
      <BaseAccordion.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group state-layer focus-ring flex min-h-14 w-full cursor-pointer items-center gap-4 px-4 py-3 text-start",
          "data-disabled:cursor-default data-disabled:opacity-(--ex-disabled-content)",
          "[&_svg]:size-6 [&_svg]:shrink-0",
          className,
        )}
        {...props}
      >
        {icon && <span className="flex text-on-surface-variant">{icon}</span>}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-title-medium">{children}</span>
          {supportingText && <span className="text-body-medium text-on-surface-variant">{supportingText}</span>}
        </span>
        {/* Chevron in a tonal circle that flips when the section opens. */}
        <span className="flex size-8 shrink-0 items-center justify-center rounded-shape-full text-on-surface-variant transition-[transform,background-color] spring-spatial-fast group-data-panel-open:rotate-180 group-data-panel-open:bg-secondary-container group-data-panel-open:text-on-secondary-container">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="size-5!">
            <path d="m12 15.4-6-6L7.4 8l4.6 4.6L16.6 8 18 9.4Z" />
          </svg>
        </span>
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export interface AccordionPanelProps extends Omit<BaseAccordion.Panel.Props, "className"> {
  className?: string;
}

export function AccordionPanel({ className, children, ...props }: AccordionPanelProps) {
  return (
    <BaseAccordion.Panel
      data-slot="accordion-panel"
      className={cn(
        "h-(--accordion-panel-height) overflow-hidden text-body-medium text-on-surface-variant",
        "transition-[height,opacity] spring-spatial-default data-starting-style:h-0 data-starting-style:opacity-0 data-ending-style:h-0 data-ending-style:opacity-0",
      )}
      {...props}
    >
      <div className={cn("px-4 pb-4", className)}>{children}</div>
    </BaseAccordion.Panel>
  );
}
