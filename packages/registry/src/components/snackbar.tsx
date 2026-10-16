"use client";

import * as React from "react";
import { Toast } from "@base-ui/react/toast";
import { cn } from "@/registry/lib/utils";

/*
 * Snackbars: brief messages at the bottom of the screen, one at a time.
 *
 *   <SnackbarProvider>…app…</SnackbarProvider>
 *   const snackbar = useSnackbar();
 *   snackbar.show({ message: "Photo deleted", action: { label: "Undo", onClick: restore } });
 */

export interface SnackbarOptions {
  message: React.ReactNode;
  action?: { label: string; onClick: () => void };
  /** Show a close icon (recommended for long or actionable messages). */
  closable?: boolean;
  /** ms before auto-dismiss; 0 keeps it open. Defaults to 4000, or 8000 with an action. */
  timeout?: number;
}

interface SnackbarData {
  closable?: boolean;
}

export function useSnackbar() {
  const manager = Toast.useToastManager<SnackbarData>();
  return React.useMemo(
    () => ({
      show: ({ message, action, closable, timeout }: SnackbarOptions) => {
        // Using the action also dismisses the snackbar.
        let id = "";
        id = manager.add({
          description: message,
          timeout: timeout ?? (action ? 8000 : 4000),
          // Default (polite) priority: "high" hides the toast from assistive tech
          // until focused, which would make the action hard to reach.
          actionProps: action
            ? {
                children: action.label,
                onClick: () => {
                  action.onClick();
                  manager.close(id);
                },
              }
            : undefined,
          data: { closable },
        });
        return id;
      },
      dismiss: (id?: string) => manager.close(id),
    }),
    [manager],
  );
}

export interface SnackbarProviderProps {
  children: React.ReactNode;
  className?: string;
}

export function SnackbarProvider({ children, className }: SnackbarProviderProps) {
  return (
    <Toast.Provider limit={1}>
      {children}
      <Toast.Portal>
        <Toast.Viewport
          className={cn("fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[calc(100vw-2rem)] max-w-[42rem] justify-center sm:bottom-6", className)}
        >
          <SnackbarList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function SnackbarList() {
  const { toasts } = Toast.useToastManager<SnackbarData>();
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      data-slot="snackbar"
      className={cn(
        "absolute bottom-0 flex min-h-12 w-full max-w-[42rem] items-center gap-2 rounded-shape-extra-small bg-inverse-surface py-1 pr-2 pl-4 text-body-medium text-inverse-on-surface shadow-elevation-3 sm:w-auto sm:min-w-[22rem]",
        "[transform:translateY(var(--toast-swipe-movement-y))] transition-[transform,opacity] spring-spatial-default",
        "data-starting-style:translate-y-4 data-starting-style:opacity-0 data-ending-style:opacity-0 data-limited:opacity-0",
      )}
    >
      <Toast.Description className="flex-1 py-2.5" />
      <Toast.Action className="state-layer focus-ring h-10 shrink-0 cursor-pointer rounded-shape-full px-3 text-label-large text-inverse-primary" />
      {toast.data?.closable && (
        <Toast.Close
          aria-label="Dismiss"
          className="state-layer focus-ring flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-shape-full"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="size-6">
            <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
          </svg>
        </Toast.Close>
      )}
    </Toast.Root>
  ));
}
