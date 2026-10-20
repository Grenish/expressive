"use client";

import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";
import { cn } from "@/registry/lib/utils";

/*
 * Toolbars (M3 Expressive) hold actions for the current page. A `floating`
 * toolbar is a pill that sits above content, horizontally or vertically, often
 * next to a FAB; a `docked` toolbar spans the bottom of the window. Base UI
 * makes it one tab stop with arrow-key navigation between the items.
 *
 * Make each control a toolbar item with `render`:
 *   <ToolbarButton render={<IconButton aria-label="Bold" />}><BoldIcon /></ToolbarButton>
 */

export interface ToolbarProps extends Omit<BaseToolbar.Root.Props, "className"> {
  variant?: "floating" | "docked";
  /** `vibrant` uses primary-container colors for more emphasis. */
  color?: "standard" | "vibrant";
  className?: string;
}

export function Toolbar({ className, variant = "floating", color = "standard", orientation = "horizontal", ...props }: ToolbarProps) {
  const vertical = orientation === "vertical";
  return (
    <BaseToolbar.Root
      data-slot="toolbar"
      data-variant={variant}
      data-color={color}
      orientation={orientation}
      className={cn(
        "flex items-center gap-1",
        "bg-surface-container text-on-surface-variant data-[color=vibrant]:bg-primary-container data-[color=vibrant]:text-on-primary-container",
        variant === "floating" && "w-fit rounded-shape-full shadow-elevation-3",
        variant === "floating" && (vertical ? "flex-col px-2 py-4" : "h-16 px-2"),
        variant === "docked" && "h-16 w-full justify-between px-4",
        // Standard icon buttons pick up the toolbar's colors; filled and tonal ones keep their own.
        "[&_[data-slot=icon-button][data-variant=standard]]:text-current",
        "data-[color=vibrant]:[&_[data-slot=icon-button][data-variant=standard][data-pressed]]:bg-surface-container data-[color=vibrant]:[&_[data-slot=icon-button][data-variant=standard][data-pressed]]:text-on-surface",
        "data-[color=standard]:[&_[data-slot=icon-button][data-variant=standard][data-pressed]]:bg-secondary-container data-[color=standard]:[&_[data-slot=icon-button][data-variant=standard][data-pressed]]:text-on-secondary-container",
        className,
      )}
      {...props}
    />
  );
}

export const ToolbarButton = BaseToolbar.Button;
export const ToolbarLink = BaseToolbar.Link;

export function ToolbarGroup({ className, ...props }: BaseToolbar.Group.Props & { className?: string }) {
  return <BaseToolbar.Group data-slot="toolbar-group" className={cn("flex items-center gap-1 data-[orientation=vertical]:flex-col", className)} {...props} />;
}

export function ToolbarSeparator({ className, ...props }: BaseToolbar.Separator.Props & { className?: string }) {
  return (
    <BaseToolbar.Separator
      data-slot="toolbar-separator"
      className={cn(
        "shrink-0 bg-current opacity-20",
        "data-[orientation=vertical]:mx-1 data-[orientation=vertical]:h-6 data-[orientation=vertical]:w-px",
        "data-[orientation=horizontal]:my-1 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-6",
        className,
      )}
      {...props}
    />
  );
}
