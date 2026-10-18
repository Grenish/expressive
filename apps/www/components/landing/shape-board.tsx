"use client";

import * as React from "react";
import { Shape } from "@/registry/components/shape";
import { type MaterialShapeName, shapeLabels, shapeNames, shapePaths } from "@/registry/tokens/material-shapes";
import { cn } from "@/registry/lib/utils";
import { spec } from "@/components/landing/tokens";

/** All 35 shapes. Point at (or focus) one and the large shape morphs into it on a spring. */
export function ShapeBoard() {
  const [name, setName] = React.useState<MaterialShapeName>("flower");
  return (
    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="flex flex-col items-center gap-4">
        <Shape name={name} className="size-56 text-on-tertiary-container drop-shadow-[0_18px_24px_rgb(0_0_0/0.16)] sm:size-64" />
        <span aria-live="polite" className={cn(spec, "opacity-70")}>
          {shapeLabels[name]}
        </span>
      </div>
      <ul className="grid grid-cols-7 gap-1 sm:gap-2" aria-label="Material 3 Expressive shapes">
        {shapeNames.map((shape) => (
          <li key={shape}>
            <button
              type="button"
              aria-label={shapeLabels[shape]}
              aria-pressed={name === shape}
              onPointerEnter={() => setName(shape)}
              onFocus={() => setName(shape)}
              onClick={() => setName(shape)}
              className={cn(
                "state-layer focus-ring grid aspect-square w-full cursor-pointer place-items-center rounded-shape-medium transition-colors",
                name === shape && "bg-on-tertiary-container/10",
              )}
            >
              <svg viewBox="0 0 100 100" aria-hidden="true" className="size-[72%] transition-transform spring-spatial-fast hover:scale-110">
                <path d={shapePaths[shape]} fill="currentColor" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
