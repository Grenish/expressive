"use client";

import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn } from "@/registry/lib/utils";
import type { MotionProp } from "@/registry/lib/use-motion";

/*
 * Toasts: richer notifications than a snackbar. Several can be on screen at
 * once; they stack in a corner and fan out on hover or focus. Each has a
 * title, an optional description, a type icon and an optional action, and
 * can be swiped away. For a single short message, use the snackbar instead.
 *
 *   <ToastProvider>…app…</ToastProvider>
 *   const toast = useToast();
 *   toast.success("Saved", { description: "All changes are synced." });
 *   toast.promise(upload(), { loading: "Uploading…", success: "Uploaded", error: "Upload failed" });
 */

export type ToastType = "info" | "success" | "warning" | "error" | "loading";

export interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Picks the icon and its color. Omit for a plain toast. */
  type?: ToastType;
  action?: { label: string; onClick: () => void };
  /** ms before auto-dismiss; 0 keeps it open. Defaults to the provider's timeout. */
  timeout?: number;
}

type Shorthand = Omit<ToastOptions, "title" | "type">;
type PromiseState<T> = React.ReactNode | ((value: T) => React.ReactNode) | ToastOptions;

function toManagerOptions(manager: ReturnType<typeof BaseToast.useToastManager>, { action, ...options }: ToastOptions) {
  return {
    ...options,
    // Using the action also dismisses the toast.
    actionProps: action
      ? {
          children: action.label,
          onClick: (event: React.MouseEvent) => {
            action.onClick();
            const root = (event.currentTarget as HTMLElement).closest("[data-toast-id]");
            if (root) manager.close(root.getAttribute("data-toast-id")!);
          },
        }
      : undefined,
  };
}

export function useToast() {
  const manager = BaseToast.useToastManager();
  return React.useMemo(() => {
    const show = (options: ToastOptions) => manager.add(toManagerOptions(manager, options));
    const typed = (type: ToastType) => (title: React.ReactNode, options: Shorthand = {}) => show({ ...options, title, type });
    return {
      show,
      info: typed("info"),
      success: typed("success"),
      warning: typed("warning"),
      error: typed("error"),
      /** A loading toast that turns into a success or error toast when `promise` settles. */
      promise: <T,>(promise: Promise<T>, states: { loading: PromiseState<void>; success: PromiseState<T>; error: PromiseState<unknown> }) => {
        const state = <V,>(value: PromiseState<V>, type: ToastType) => (result: V) => {
          if (typeof value === "function") return toManagerOptions(manager, { title: (value as (v: V) => React.ReactNode)(result), type });
          if (value && typeof value === "object" && !React.isValidElement(value)) return toManagerOptions(manager, { type, ...(value as ToastOptions) });
          return toManagerOptions(manager, { title: value as React.ReactNode, type });
        };
        return manager.promise(promise, {
          loading: state(states.loading, "loading")(undefined),
          success: state(states.success, "success"),
          error: state(states.error, "error"),
        });
      },
      dismiss: (id?: string) => manager.close(id),
    };
  }, [manager]);
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Corner (or bottom edge) the stack sits in. */
  position?: "bottom-left" | "bottom-center" | "bottom-right";
  /** How many toasts show at once; older ones fade out of the stack. */
  limit?: number;
  /** Default ms before auto-dismiss. */
  timeout?: number;
  motion?: MotionProp;
  className?: string;
}

const positions = {
  "bottom-left": "left-4 sm:left-6",
  "bottom-center": "inset-x-0 mx-auto",
  "bottom-right": "right-4 sm:right-6",
};

export function ToastProvider({ children, position = "bottom-right", limit = 3, timeout = 5000, motion, className }: ToastProviderProps) {
  return (
    <BaseToast.Provider limit={limit} timeout={timeout}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport
          data-motion={motion}
          className={cn("fixed bottom-4 z-50 w-[calc(100vw-2rem)] outline-none sm:bottom-6 sm:w-90", positions[position], className)}
        >
          <ToastList motion={motion} />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

const iconColors: Record<ToastType, string> = {
  info: "bg-secondary-container text-on-secondary-container",
  success: "bg-primary-container text-on-primary-container",
  warning: "bg-tertiary-container text-on-tertiary-container",
  error: "bg-error-container text-on-error-container",
  loading: "bg-surface-container-highest text-primary",
};

const iconPaths: Record<Exclude<ToastType, "loading">, string> = {
  info: "M11 17h2v-6h-2Zm1-8q.43 0 .71-.29Q13 8.43 13 8t-.29-.71Q12.43 7 12 7t-.71.29Q11 7.57 11 8t.29.71Q11.57 9 12 9Zm0 13q-2.08 0-3.9-.79-1.82-.79-3.17-2.14-1.35-1.35-2.14-3.17Q2 14.08 2 12t.79-3.9q.79-1.82 2.14-3.17Q6.28 3.58 8.1 2.79 9.92 2 12 2t3.9.79q1.82.79 3.17 2.14 1.35 1.35 2.14 3.17Q22 9.92 22 12t-.79 3.9q-.79 1.82-2.14 3.17-1.35 1.35-3.17 2.14Q14.08 22 12 22Z",
  success: "M9.55 17.65 4.2 12.3l1.43-1.4 3.92 3.92 8.82-8.82 1.43 1.4Z",
  warning: "M1 21 12 2l11 19Zm11-3q.43 0 .71-.29Q13 17.43 13 17t-.29-.71Q12.43 16 12 16t-.71.29Q11 16.57 11 17t.29.71Q11.57 18 12 18Zm-1-3h2v-5h-2Z",
  error: "M12 17q.43 0 .71-.29Q13 16.43 13 16t-.29-.71Q12.43 15 12 15t-.71.29Q11 15.57 11 16t.29.71Q11.57 17 12 17Zm-1-4h2V7h-2Zm1 9q-2.08 0-3.9-.79-1.82-.79-3.17-2.14-1.35-1.35-2.14-3.17Q2 14.08 2 12t.79-3.9q.79-1.82 2.14-3.17Q6.28 3.58 8.1 2.79 9.92 2 12 2t3.9.79q1.82.79 3.17 2.14 1.35 1.35 2.14 3.17Q22 9.92 22 12t-.79 3.9q-.79 1.82-2.14 3.17-1.35 1.35-3.17 2.14Q14.08 22 12 22Z",
};

function TypeIcon({ type }: { type: ToastType }) {
  return (
    <span aria-hidden="true" className={cn("flex size-10 shrink-0 items-center justify-center rounded-shape-full [&_svg]:size-5", iconColors[type])}>
      {type === "loading" ? (
        <svg viewBox="0 0 24 24" fill="none" className="animate-[ex-progress-spin_1s_linear_infinite]">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="40 100" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d={iconPaths[type]} />
        </svg>
      )}
    </span>
  );
}

function ToastList({ motion }: { motion?: MotionProp }) {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((toast) => {
    const type = toast.type as ToastType | undefined;
    return (
      <BaseToast.Root
        key={toast.id}
        toast={toast}
        data-slot="toast"
        data-toast-id={toast.id}
        data-motion={motion}
        className={cn(
          "absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom select-none",
          "rounded-shape-large bg-surface-container-high text-on-surface shadow-elevation-3",
          // Stacking: collapsed toasts peek out above the front one, a little smaller each step back.
          "[--ex-gap:0.5rem] [--ex-peek:0.625rem] [--ex-scale:calc(max(0,1-(var(--toast-index)*0.06)))]",
          // Collapsed, every toast takes the front one's height so the ones behind peek evenly.
          "[--ex-height:var(--toast-frontmost-height,var(--toast-height))] h-(--ex-height) data-expanded:h-(--toast-height)",
          "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--ex-peek))-((1-var(--ex-scale))*var(--ex-height))))_scale(var(--ex-scale))]",
          // Expanded (hover or focus): fan out into a column.
          "data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-var(--toast-offset-y)-(var(--toast-index)*var(--ex-gap))))]",
          // A hit area across the gap, so moving between toasts doesn't collapse the stack.
          "after:absolute after:top-full after:left-0 after:h-[calc(var(--ex-gap)+1px)] after:w-full after:content-['']",
          "transition-[transform,opacity,height] spring-spatial-default data-swiping:transition-none",
          "data-starting-style:[transform:translateY(150%)] data-limited:opacity-0",
          "data-ending-style:opacity-0 [&[data-ending-style]:not([data-swipe-direction])]:[transform:translateY(150%)]",
          "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
          "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))]",
        )}
      >
        <BaseToast.Content className="flex items-start gap-3 overflow-hidden p-4 transition-opacity spring-effects-fast data-behind:opacity-0 data-expanded:opacity-100">
          {type && <TypeIcon type={type} />}
          <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5", type && "min-h-10 justify-center")}>
            <BaseToast.Title className="text-title-small text-on-surface" />
            <BaseToast.Description className="text-body-medium text-on-surface-variant" />
            {toast.actionProps && (
              <BaseToast.Action className="state-layer focus-ring -ms-3 mt-1 h-10 self-start cursor-pointer rounded-shape-full px-3 text-label-large text-primary" />
            )}
          </div>
          <BaseToast.Close
            aria-label="Dismiss"
            className="state-layer focus-ring -my-1 -me-2 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-shape-full text-on-surface-variant"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="size-5">
              <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
            </svg>
          </BaseToast.Close>
        </BaseToast.Content>
      </BaseToast.Root>
    );
  });
}
