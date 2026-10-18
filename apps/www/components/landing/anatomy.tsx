"use client";

import * as React from "react";
import { cn } from "@/registry/lib/utils";
import { spec } from "@/components/landing/tokens";

/*
 * Anatomy of a button, drawn like an annotated hardware diagram: every part of
 * the button is a token. Point at a callout and the button demonstrates it.
 * The button here is a diagram (states are forced on), not an interactive one.
 */

type Part = "container" | "label" | "shape" | "state" | "focus" | "motion";

const CALLOUTS: Array<{ part: Part; name: string; token: string; side: "left" | "right" }> = [
  { part: "container", name: "container", token: "color · primary", side: "left" },
  { part: "label", name: "label", token: "on-primary · title-large", side: "left" },
  { part: "shape", name: "shape", token: "full → large on press", side: "left" },
  { part: "state", name: "state layer", token: "8% hover · 10% press", side: "right" },
  { part: "focus", name: "focus ring", token: "3 px secondary · 2 px out", side: "right" },
  { part: "motion", name: "motion", token: "spring · spatial-fast", side: "right" },
];

function Callout({ part, name, token, side, active, onActive }: (typeof CALLOUTS)[number] & { active: boolean; onActive: (part: Part | null) => void }) {
  return (
    <li>
      <button
        type="button"
        onPointerEnter={() => onActive(part)}
        onPointerLeave={() => onActive(null)}
        onFocus={() => onActive(part)}
        onBlur={() => onActive(null)}
        aria-pressed={active}
        className={cn(
          "focus-ring group flex w-full cursor-default items-center gap-3 rounded-shape-small py-2 text-left",
          side === "right" ? "lg:flex-row-reverse lg:text-right" : "",
        )}
      >
        <span className="flex min-w-0 flex-col">
          <span className={cn("text-title-medium transition-colors", active ? "text-primary" : "text-on-surface")}>{name}</span>
          <span className={cn(spec, "text-on-surface-variant")}>{token}</span>
        </span>
        {/* Leader line toward the button (desktop) */}
        <span aria-hidden="true" className={cn("hidden h-px flex-1 transition-colors lg:block", active ? "bg-primary" : "bg-outline-variant")} />
        <span aria-hidden="true" className={cn("hidden size-2 shrink-0 rounded-full transition-colors lg:block", active ? "bg-primary" : "bg-outline")} />
      </button>
    </li>
  );
}

export function Anatomy() {
  const [active, setActive] = React.useState<Part | null>(null);
  const [pulse, setPulse] = React.useState(false);

  // "motion": press and release on a loop, so the spring is visible.
  React.useEffect(() => {
    if (active !== "motion") return setPulse(false);
    const id = setInterval(() => setPulse((p) => !p), 700);
    return () => clearInterval(id);
  }, [active]);

  const pressed = active === "shape" || (active === "motion" && pulse);
  const left = CALLOUTS.filter((c) => c.side === "left");
  const right = CALLOUTS.filter((c) => c.side === "right");

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6">
      <ul className="order-2 flex flex-col gap-2 lg:order-1">
        {left.map((c) => (
          <Callout key={c.part} {...c} active={active === c.part} onActive={setActive} />
        ))}
      </ul>

      <div className="order-1 flex justify-center px-6 py-10 lg:order-2" aria-hidden="true">
        <div
          className={cn(
            "relative flex h-32 items-center px-16 text-headline-medium outline-offset-[6px] outline-secondary",
            "bg-primary text-on-primary transition-[border-radius,scale,box-shadow] spring-spatial-fast",
            pressed ? "scale-[0.97] rounded-shape-extra-large" : "rounded-pill [--ex-control-height:8rem]",
            active === "focus" && "outline-[6px] outline-solid",
            active === "container" && "shadow-[0_0_0_10px_color-mix(in_oklab,var(--ex-color-primary)_22%,transparent)]",
          )}
        >
          <span
            className={cn(
              "pointer-events-none absolute inset-0 rounded-[inherit] bg-on-primary transition-opacity",
              active === "state" ? "opacity-(--ex-state-hover)" : pressed ? "opacity-(--ex-state-pressed)" : "opacity-0",
            )}
          />
          <span className={cn("relative transition-[letter-spacing] spring-spatial-fast", active === "label" && "underline decoration-2 underline-offset-8")}>Get started</span>
        </div>
      </div>

      <ul className="order-3 flex flex-col gap-2">
        {right.map((c) => (
          <Callout key={c.part} {...c} active={active === c.part} onActive={setActive} />
        ))}
      </ul>
    </div>
  );
}
