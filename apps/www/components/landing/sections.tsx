"use client";

import * as React from "react";
import { engines, usePlayground } from "@/lib/playground";
import { MotionAdapterContext } from "@/registry/lib/use-motion";
import { useFluidLayout } from "@/registry/lib/use-fluid";
import { cn } from "@/registry/lib/utils";

const schemes = ["expressive", "standard"] as const;

function Track({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-label-large text-on-surface-variant">{label}</span>
      <div className="relative h-16 rounded-shape-full bg-surface-container">{children}</div>
    </div>
  );
}

const dot = (on: boolean) =>
  cn(
    // rounded-pill (half of 3rem), not the 9999px "full" corner: springing from it
    // overshoots below zero and flashes a hard square.
    "absolute top-2 left-2 size-12 bg-primary [--ex-control-height:3rem] transition-[left,border-radius,background-color] spring-spatial-default",
    on ? "left-[calc(100%-3.5rem)] rounded-shape-medium bg-tertiary" : "rounded-pill",
  );

/** Fluid: the dot jumps to its new spot and drifts there, stretching like a droplet. */
function FluidDot({ on }: { on: boolean }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  useFluidLayout(ref, { attributes: ["data-on"], motion: "fluid" });
  return <span ref={ref} data-on={on ? "" : undefined} className={cn(dot(on), "fluid:transition-[border-radius,background-color]")} />;
}

/** The same move under every motion scheme, side by side. */
export function MotionShowcase() {
  const { state } = usePlayground();
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 1800);
    return () => clearInterval(id);
  }, []);
  // Fluid needs a velocity-aware engine; use Motion here if CSS is selected.
  const fluidEngine = state.engine === "css" ? engines.motion : engines[state.engine];
  return (
    <div className="flex flex-col gap-4">
      {schemes.map((scheme) => (
        <div key={scheme} data-motion={scheme}>
          <Track label={scheme}>
            <span className={dot(on)} />
          </Track>
        </div>
      ))}
      <div data-motion="fluid">
        <MotionAdapterContext value={fluidEngine}>
          <Track label={`fluid · ${fluidEngine.name}`}>
            <FluidDot on={on} />
          </Track>
        </MotionAdapterContext>
      </div>
    </div>
  );
}
