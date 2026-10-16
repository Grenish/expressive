"use client";

import { schemeVariants, type SchemeVariant } from "@/registry/tokens/colors";
import type { MotionScheme } from "@/registry/tokens/motion";
import { Switch } from "@/registry/components/switch";
import { engines, fonts, usePlayground } from "@/lib/playground";

const swatches = [
  "#6750A4",
  "#0B57D0",
  "#146C2E",
  "#B3261E",
  "#E8710A",
  "#00696D",
  "#7D5260",
];

const field = "flex flex-col gap-1.5 text-label-medium text-on-surface-variant";
const select =
  "focus-ring h-10 rounded-shape-small border border-outline-variant bg-surface-container-low px-3 text-body-medium text-on-surface";

export function ThemeControls() {
  const { state, update } = usePlayground();

  return (
    <div className="flex flex-col gap-5">
      <div className={field}>
        <span id="seed-label">Seed color</span>
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-labelledby="seed-label"
        >
          {swatches.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Seed ${color}`}
              aria-pressed={state.seed.toLowerCase() === color.toLowerCase()}
              onClick={() => update({ seed: color })}
              className="focus-ring size-8 cursor-pointer rounded-pill [--ex-control-height:2rem] transition-[border-radius] spring-spatial-fast aria-pressed:rounded-shape-small"
              style={{ backgroundColor: color }}
            />
          ))}
          <label className="focus-within:outline-(--ex-focus-ring-color) relative size-8 cursor-pointer overflow-hidden rounded-shape-full border border-outline focus-within:outline-(length:--ex-focus-ring-width) focus-within:outline-solid">
            <span className="sr-only">Custom seed color</span>
            <input
              type="color"
              value={state.seed}
              onChange={(event) => update({ seed: event.target.value })}
              className="absolute -inset-2 size-12 cursor-pointer"
            />
          </label>
          <code className="text-label-medium text-on-surface">
            {state.seed.toUpperCase()}
          </code>
        </div>
      </div>

      <label className={field}>
        Scheme
        <select
          className={select}
          value={state.variant}
          onChange={(e) => update({ variant: e.target.value as SchemeVariant })}
        >
          {Object.keys(schemeVariants).map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>

      <label className={field}>
        Font
        <select
          className={select}
          value={state.font}
          onChange={(e) =>
            update({ font: e.target.value as keyof typeof fonts })
          }
        >
          {Object.keys(fonts).map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className={field}>
          Motion
          <select
            className={select}
            value={state.motion}
            onChange={(e) => update({ motion: e.target.value as MotionScheme })}
          >
            <option value="expressive">expressive</option>
            <option value="standard">standard</option>
            <option value="fluid">fluid</option>
          </select>
        </label>
        <label className={field}>
          Engine
          <select
            className={select}
            value={state.engine}
            onChange={(e) =>
              update({ engine: e.target.value as keyof typeof engines })
            }
          >
            {Object.keys(engines).map((name) => (
              <option key={name} disabled={state.motion === "fluid" && name === "css"}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {state.motion === "fluid" && (
        <p className="-mt-2 text-body-small text-on-surface-variant">Fluid runs on Motion or GSAP; CSS can&apos;t track velocity.</p>
      )}

      <label className="flex items-center justify-between gap-4 text-body-large text-on-surface">
        Dark theme
        <Switch
          icons
          checked={state.dark}
          onCheckedChange={(dark) => update({ dark })}
        />
      </label>
    </div>
  );
}

export function TonalPalettes() {
  const { theme } = usePlayground();
  const tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const;
  return (
    <div className="flex flex-col gap-2">
      {(
        [
          "primary",
          "secondary",
          "tertiary",
          "neutral",
          "neutralVariant",
        ] as const
      ).map((name) => (
        <div key={name} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-label-medium text-on-surface-variant">
            {name}
          </span>
          <div className="flex h-9 flex-1 overflow-hidden rounded-shape-medium">
            {tones.map((tone) => (
              <div
                key={tone}
                title={`${name} ${tone}: ${theme.colors.palettes[name][tone]}`}
                className="flex flex-1 items-end justify-center pb-0.5 text-[9px]"
                style={{
                  backgroundColor: theme.colors.palettes[name][tone],
                  color: tone > 50 ? "#000" : "#fff",
                }}
              >
                <span className="hidden sm:inline">{tone}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
