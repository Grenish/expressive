"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";

export interface SliderProps extends Omit<BaseSlider.Root.Props, "className"> {
  className?: string;
  motion?: MotionProp;
  /** Accessible names for the thumbs, e.g. `["Minimum price", "Maximum price"]`. */
  thumbLabels?: string[];
}

/*
 * M3 Expressive slider: a 16px track with a bar-shaped handle that narrows
 * while dragged. The gap around the handle is drawn with a ring in
 * `--ex-slider-gap-color` (defaults to `surface`); set it to the slider's
 * background when it sits on another surface.
 */
export function Slider({ className, motion, thumbLabels, value, defaultValue, ...props }: SliderProps) {
  const current = value ?? defaultValue;
  const count = Array.isArray(current) ? current.length : 1;

  return (
    <BaseSlider.Root
      data-slot="slider"
      data-motion={motion}
      value={value}
      defaultValue={defaultValue}
      className={cn("group w-full data-disabled:opacity-(--ex-disabled-content)", className)}
      {...props}
    >
      <BaseSlider.Control className="flex h-11 w-full touch-none items-center select-none">
        <BaseSlider.Track className="relative h-4 w-full rounded-shape-full bg-secondary-container">
          <BaseSlider.Indicator className="rounded-shape-full bg-primary group-data-disabled:bg-on-surface" />
          {Array.from({ length: count }, (_, index) => (
            <BaseSlider.Thumb
              key={index}
              index={index}
              aria-label={thumbLabels?.[index]}
              className={cn(
                "h-11 w-1 cursor-grab rounded-shape-full bg-primary select-none",
                "ring-6 ring-(--ex-slider-gap-color,var(--ex-color-surface))",
                "transition-[width] spring-spatial-fast data-dragging:w-0.5 data-dragging:cursor-grabbing",
                "has-focus-visible:outline-(length:--ex-focus-ring-width) has-focus-visible:outline-offset-(--ex-focus-ring-offset) has-focus-visible:outline-(--ex-focus-ring-color) has-focus-visible:outline-solid",
                "group-data-disabled:bg-on-surface",
              )}
            />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
