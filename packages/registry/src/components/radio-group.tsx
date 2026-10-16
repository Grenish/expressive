"use client";

import * as React from "react";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";
import { useComposedRef, useFluidPop } from "@/registry/lib/use-fluid";

export interface RadioGroupProps extends Omit<BaseRadioGroup.Props, "className"> {
  className?: string;
}

/** Arrow keys move between options; label it with `aria-labelledby` or `aria-label`. */
export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return <BaseRadioGroup data-slot="radio-group" className={cn("flex flex-col gap-1", className)} {...props} />;
}

export interface RadioProps extends Omit<BaseRadio.Root.Props, "className"> {
  className?: string;
  motion?: MotionProp;
}

/* 20px ring inside a 40px state-layer target; the dot springs in when selected. */
export function Radio({ className, motion, ref, ...props }: RadioProps) {
  const root = React.useRef<HTMLElement>(null);
  const ring = React.useRef<HTMLSpanElement>(null);
  useFluidPop(root, { attributes: ["data-checked"], target: ring, from: 0.75, motion });
  return (
    <BaseRadio.Root
      ref={useComposedRef(root, ref)}
      data-slot="radio"
      data-motion={motion}
      className={cn(
        "group state-layer focus-ring relative inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-shape-full text-on-surface-variant",
        "data-checked:text-primary data-invalid:text-error",
        "data-disabled:cursor-default data-disabled:opacity-(--ex-disabled-content) data-disabled:before:hidden",
        className,
      )}
      {...props}
    >
      <span ref={ring} className="flex size-5 items-center justify-center rounded-shape-full border-2 border-current transition-colors spring-effects-fast">
        <BaseRadio.Indicator
          keepMounted
          className="size-2.5 scale-0 rounded-shape-full bg-current transition-transform spring-spatial-fast data-checked:scale-100"
        />
      </span>
    </BaseRadio.Root>
  );
}
