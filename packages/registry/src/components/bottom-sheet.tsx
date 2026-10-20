"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";

/*
 * Modal bottom sheet. Base UI's drawer provides focus trapping, Escape,
 * scrim dismissal, drag-to-dismiss and snap points; the sheet springs up from
 * the bottom edge on the spatial motion tokens.
 *
 *   <BottomSheet snapPoints={["20rem", 1]}>…</BottomSheet>
 */

export const BottomSheet = BaseDrawer.Root;
export const BottomSheetTrigger = BaseDrawer.Trigger;
export const BottomSheetClose = BaseDrawer.Close;

export interface BottomSheetContentProps extends Omit<BaseDrawer.Popup.Props, "className"> {
  /** Show the drag handle. Keep it whenever the sheet can be dragged. */
  handle?: boolean;
  motion?: MotionProp;
  className?: string;
}

export function BottomSheetContent({ className, handle = true, motion, children, ...props }: BottomSheetContentProps) {
  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop
        data-slot="bottom-sheet-backdrop"
        data-motion={motion}
        className={cn(
          // Not faded by swipe progress: at a partial snap point Base UI reports progress 1, which would hide the scrim.
          "fixed inset-0 z-50 bg-scrim/32",
          "transition-opacity spring-effects-default",
          "data-starting-style:opacity-0 data-ending-style:opacity-0",
        )}
      />
      <BaseDrawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
        <BaseDrawer.Popup
          data-slot="bottom-sheet"
          data-motion={motion}
          className={cn(
            "relative flex max-h-[calc(100dvh-4.5rem)] w-full max-w-160 flex-col rounded-t-shape-extra-large bg-surface-container-low text-on-surface shadow-elevation-1 outline-none",
            // Follows the finger while dragging, rests at the active snap point.
            "[transform:translateY(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)))]",
            "transition-transform spring-spatial-default data-swiping:transition-none data-swiping:select-none",
            "data-starting-style:[transform:translateY(100%)] data-ending-style:[transform:translateY(100%)]",
            // A strip of sheet color below the edge, so the spring's overshoot never shows a gap.
            "after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-12 after:bg-inherit after:content-['']",
            className,
          )}
          {...props}
        >
          {handle && (
            <div aria-hidden="true" className="flex shrink-0 justify-center pt-4 pb-2">
              <div className="h-1 w-8 rounded-shape-full bg-on-surface-variant/40" />
            </div>
          )}
          <BaseDrawer.Content className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]", !handle && "pt-6")}>
            {children}
          </BaseDrawer.Content>
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
}

export function BottomSheetTitle({ className, ...props }: BaseDrawer.Title.Props & { className?: string }) {
  return <BaseDrawer.Title data-slot="bottom-sheet-title" className={cn("text-title-large text-on-surface", className)} {...props} />;
}

export function BottomSheetDescription({ className, ...props }: BaseDrawer.Description.Props & { className?: string }) {
  return <BaseDrawer.Description data-slot="bottom-sheet-description" className={cn("text-body-medium text-on-surface-variant", className)} {...props} />;
}
