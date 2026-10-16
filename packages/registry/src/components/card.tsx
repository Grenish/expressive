import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/registry/lib/utils";

export const cardVariants = cva("relative flex flex-col overflow-hidden text-on-surface", {
  variants: {
    variant: {
      elevated: "bg-surface-container-low shadow-elevation-1",
      filled: "bg-surface-container-highest",
      outlined: "border border-outline-variant bg-surface",
    },
    shape: {
      small: "rounded-shape-small",
      medium: "rounded-shape-medium",
      large: "rounded-shape-large",
      "extra-large": "rounded-shape-extra-large",
      squircle: "rounded-shape-extra-large corner-squircle",
      cut: "rounded-shape-large corner-cut",
    },
    interactive: {
      true: "state-layer focus-ring cursor-pointer text-left transition-[box-shadow,border-radius] spring-spatial-default active:rounded-shape-extra-large",
      false: "",
    },
  },
  compoundVariants: [{ interactive: true, variant: "elevated", className: "hover:shadow-elevation-2" }],
  defaultVariants: { variant: "elevated", shape: "medium", interactive: false },
});

export interface CardProps extends useRender.ComponentProps<"div">, VariantProps<typeof cardVariants> {}

/**
 * A surface for related content. Make the whole card actionable with
 * `interactive` and a `render` element, e.g. `render={<a href="/post" />}`.
 */
export function Card({ className, variant, shape, interactive, render, ...props }: CardProps) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      { "data-slot": "card", className: cn(cardVariants({ variant, shape, interactive }), className) } as React.ComponentProps<"div">,
      props,
    ),
  });
}

export function CardMedia({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-media" className={cn("overflow-hidden [&>img]:size-full [&>img]:object-cover", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-1 px-4 pt-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("text-title-large text-on-surface", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-body-medium text-on-surface-variant", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-4 py-4 text-body-medium", className)} {...props} />;
}

export function CardActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-actions" className={cn("flex items-center justify-end gap-2 px-4 pb-4", className)} {...props} />;
}
