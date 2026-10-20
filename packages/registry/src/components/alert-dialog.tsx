"use client";

import * as React from "react";
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";
import { useComposedRef, useFluidEnter } from "@/registry/lib/use-fluid";

/*
 * Alert dialog: interrupts to confirm a consequential action ("Delete 3
 * files?"). Unlike a dialog it can't be dismissed by clicking outside, so the
 * user has to choose. Give it a title, say what will happen in the
 * description, and label the buttons with the outcome ("Delete", not "OK").
 */

export const AlertDialog = BaseAlertDialog.Root;
export const AlertDialogTrigger = BaseAlertDialog.Trigger;
export const AlertDialogClose = BaseAlertDialog.Close;

export interface AlertDialogContentProps extends Omit<BaseAlertDialog.Popup.Props, "className"> {
  motion?: MotionProp;
  className?: string;
}

export function AlertDialogContent({ className, motion, children, ref, ...props }: AlertDialogContentProps) {
  const enter = useFluidEnter({ from: 0.55, motion });
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop
        data-slot="alert-dialog-backdrop"
        data-motion={motion}
        className="fixed inset-0 z-50 bg-scrim/32 transition-opacity spring-effects-default data-starting-style:opacity-0 data-ending-style:opacity-0"
      />
      <BaseAlertDialog.Viewport className="fixed inset-0 z-50 grid place-items-center p-6">
        <BaseAlertDialog.Popup
          ref={useComposedRef(enter, ref)}
          data-slot="alert-dialog"
          data-motion={motion}
          className={cn(
            "focus-ring flex w-full min-w-70 max-w-140 flex-col gap-4 rounded-shape-extra-large bg-surface-container-high p-6 text-on-surface shadow-elevation-3",
            "origin-top [transition:transform_var(--ex-spring-spatial-default-duration)_var(--ex-spring-spatial-default-easing),opacity_var(--ex-spring-effects-default-duration)_var(--ex-spring-effects-default-easing)]",
            "data-starting-style:-translate-y-4 data-starting-style:scale-y-75 data-starting-style:opacity-0",
            "data-ending-style:scale-95 data-ending-style:opacity-0",
            // Fluid: the entrance is script-driven; CSS only fades.
            "fluid:[transition:opacity_var(--ex-spring-effects-default-duration)_var(--ex-spring-effects-default-easing)] fluid:data-ending-style:scale-100",
            className,
          )}
          {...props}
        >
          {children}
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Viewport>
    </BaseAlertDialog.Portal>
  );
}

/** Optional hero icon, centered above the title (which then centers too). */
export function AlertDialogIcon({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-icon" className={cn("flex justify-center text-secondary [&_svg]:size-6 [&+*]:text-center", className)} {...props} />;
}

export function AlertDialogTitle({ className, ...props }: BaseAlertDialog.Title.Props & { className?: string }) {
  return <BaseAlertDialog.Title data-slot="alert-dialog-title" className={cn("text-headline-small text-on-surface", className)} {...props} />;
}

export function AlertDialogDescription({ className, ...props }: BaseAlertDialog.Description.Props & { className?: string }) {
  return (
    <BaseAlertDialog.Description data-slot="alert-dialog-description" className={cn("text-body-medium text-on-surface-variant", className)} {...props} />
  );
}

export function AlertDialogActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-actions" className={cn("mt-2 flex justify-end gap-2", className)} {...props} />;
}
