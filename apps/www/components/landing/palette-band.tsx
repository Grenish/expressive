"use client";

import { usePlayground } from "@/lib/playground";
import { cn } from "@/registry/lib/utils";
import { spec } from "@/components/landing/tokens";

const TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const;
const PALETTES = [
  ["primary", "primary", "pri"],
  ["secondary", "secondary", "sec"],
  ["tertiary", "tertiary", "ter"],
  ["neutral", "neutral", "neu"],
  ["neutralVariant", "neutral variant", "n·v"],
] as const;

/** The five tonal palettes from the current seed, as one flat, edge-to-edge field of swatches. */
export function PaletteBand() {
  const { theme } = usePlayground();
  return (
    <div className="grid grid-cols-[auto_repeat(13,minmax(0,1fr))]">
      {PALETTES.map(([key, label, short]) => (
        <div key={key} className="contents">
          <div className={cn(spec, "flex items-center bg-surface px-3 text-on-surface-variant sm:px-5")}>
            <span className="sm:hidden" aria-hidden="true">{short}</span>
            <span className="max-sm:sr-only">{label}</span>
          </div>
          {TONES.map((tone) => {
            const color = theme.colors.palettes[key][tone];
            return (
              <div
                key={tone}
                title={`${label} ${tone}: ${color}`}
                className="flex h-14 items-end p-1.5 font-mono text-[10px] sm:h-20 sm:p-2"
                style={{ backgroundColor: color, color: tone > 55 ? "#00000099" : "#ffffffaa" }}
              >
                <span className="max-sm:hidden">{tone}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
