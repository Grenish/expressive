"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";

export interface SwitchProps extends Omit<BaseSwitch.Root.Props, "className"> {
  className?: string;
  /** Show check / close icons inside the handle. */
  icons?: boolean;
  motion?: MotionProp;
}

/*
 * M3 switch: 52×32 track. The handle grows from 16px (off) to 24px (on),
 * and to 28px while pressed; position and size move on a spatial spring.
 */
export function Switch({ className, icons = false, motion, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root
      data-slot="switch"
      data-motion={motion}
      className={cn(
        "group focus-ring relative inline-flex h-8 w-13 shrink-0 cursor-pointer items-center rounded-shape-full",
        "border-2 border-outline bg-surface-container-highest",
        "transition-[background-color,border-color] spring-effects-default",
        "data-checked:border-primary data-checked:bg-primary",
        "data-disabled:cursor-default data-disabled:opacity-(--ex-disabled-content)",
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        data-slot="switch-thumb"
        className={cn(
          // A 40px state-layer target centered on the handle.
          "state-layer pointer-events-none absolute top-1/2 left-3.5 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-shape-full text-on-surface",
          "transition-[left] spring-spatial-fast",
          "group-data-checked:left-[calc(100%-0.875rem)] group-data-checked:text-primary",
          "group-hover:before:opacity-(--ex-state-hover) group-focus-visible:before:opacity-(--ex-state-focus) group-active:before:opacity-(--ex-state-pressed)",
        )}
      >
        <span
          className={cn(
            "flex size-4 items-center justify-center rounded-shape-full bg-outline text-surface-container-highest",
            "transition-[width,height,background-color] spring-spatial-fast",
            "group-data-checked:size-6 group-data-checked:bg-on-primary group-data-checked:text-on-primary-container",
            "group-active:size-7 group-hover:group-data-unchecked:bg-on-surface-variant group-data-checked:group-hover:bg-primary-container",
            icons && "size-6",
            "[&_svg]:size-4",
          )}
        >
          {icons && (
            <>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="hidden group-data-checked:block" fill="currentColor">
                <path d="M9.55 18 3.85 12.3l1.43-1.43 4.27 4.28 9.17-9.18 1.43 1.43Z" />
              </svg>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="block group-data-checked:hidden" fill="currentColor">
                <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
              </svg>
            </>
          )}
        </span>
      </BaseSwitch.Thumb>
    </BaseSwitch.Root>
  );
}
