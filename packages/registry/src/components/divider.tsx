import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { cn } from "@/registry/lib/utils";

/*
 * A thin line that groups content in lists and layouts. Horizontal dividers
 * can be inset from the leading edge or from both edges.
 */

export interface DividerProps extends Omit<BaseSeparator.Props, "className"> {
  orientation?: "horizontal" | "vertical";
  /** `start` insets the leading edge by 16px; `middle` insets both ends. */
  inset?: "none" | "start" | "middle";
  className?: string;
}

export function Divider({ className, orientation = "horizontal", inset = "none", ...props }: DividerProps) {
  const vertical = orientation === "vertical";
  return (
    <BaseSeparator
      data-slot="divider"
      orientation={orientation}
      className={cn(
        "shrink-0 border-0 bg-outline-variant",
        vertical ? "w-px self-stretch" : "h-px w-auto",
        !vertical && inset === "start" && "ms-4",
        !vertical && inset === "middle" && "mx-4",
        vertical && inset === "middle" && "my-2",
        className,
      )}
      {...props}
    />
  );
}
