"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";

/*
 * Basic dialog. Base UI handles focus trapping, ARIA wiring, Escape and
 * outside-press dismissal; enter/exit transitions read the motion tokens.
 */

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;

export interface DialogContentProps extends BaseDialog.Popup.Props {
  motion?: MotionProp;
  className?: string;
}

export function DialogContent({ className, motion, children, ...props }: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        data-slot="dialog-backdrop"
        data-motion={motion}
        className={cn(
          "fixed inset-0 z-50 bg-scrim/32",
          "transition-opacity spring-effects-default",
          "data-starting-style:opacity-0 data-ending-style:opacity-0",
        )}
      />
      <BaseDialog.Viewport className="fixed inset-0 z-50 grid place-items-center p-6">
        <BaseDialog.Popup
          data-slot="dialog"
          data-motion={motion}
          className={cn(
            "focus-ring flex w-full min-w-70 max-w-140 flex-col gap-4 rounded-shape-extra-large bg-surface-container-high p-6 text-on-surface shadow-elevation-3",
            "origin-top [transition:transform_var(--ex-spring-spatial-default-duration)_var(--ex-spring-spatial-default-easing),opacity_var(--ex-spring-effects-default-duration)_var(--ex-spring-effects-default-easing)]",
            "data-starting-style:-translate-y-4 data-starting-style:scale-y-75 data-starting-style:opacity-0",
            "data-ending-style:scale-95 data-ending-style:opacity-0",
            className,
          )}
          {...props}
        >
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

/** Optional hero icon, centered above the title. */
export function DialogIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-icon"
      className={cn("flex justify-center text-secondary [&_svg]:size-6 [&+*]:text-center", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: BaseDialog.Title.Props & { className?: string }) {
  return <BaseDialog.Title data-slot="dialog-title" className={cn("text-headline-small text-on-surface", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: BaseDialog.Description.Props & { className?: string }) {
  return (
    <BaseDialog.Description
      data-slot="dialog-description"
      className={cn("text-body-medium text-on-surface-variant", className)}
      {...props}
    />
  );
}

export function DialogActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-actions" className={cn("mt-2 flex justify-end gap-2", className)} {...props} />;
}
