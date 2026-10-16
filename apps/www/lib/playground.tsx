"use client";

import * as React from "react";
import type { SchemeVariant } from "@/registry/tokens/colors";
import { createTheme, DEFAULT_SEED } from "@/registry/tokens/theme";
import type { MotionScheme } from "@/registry/tokens/motion";
import { ThemeProvider } from "@/registry/lib/theme-provider";
import { SnackbarProvider } from "@/registry/components/snackbar";
import { TooltipProvider } from "@/registry/components/tooltip";
import { MotionAdapterContext } from "@/registry/lib/use-motion";
import type { MotionAdapter } from "@/registry/lib/adapters/types";
import { adapter as cssAdapter } from "@/registry/lib/adapters/css";
import { adapter as motionAdapter } from "@/registry/lib/adapters/motion";
import { adapter as gsapAdapter } from "@/registry/lib/adapters/gsap";

export const fonts = {
  "Roboto Flex": "var(--font-roboto-flex)",
  Geist: "var(--font-geist)",
  Inter: "var(--font-inter)",
  Manrope: "var(--font-manrope)",
} as const;

export const engines = { css: cssAdapter, motion: motionAdapter, gsap: gsapAdapter } satisfies Record<string, MotionAdapter>;

export interface PlaygroundState {
  seed: string;
  variant: SchemeVariant;
  dark: boolean;
  motion: MotionScheme;
  engine: keyof typeof engines;
  font: keyof typeof fonts;
}

const initial: PlaygroundState = {
  seed: DEFAULT_SEED,
  variant: "expressive",
  dark: false,
  motion: "expressive",
  engine: "css",
  font: "Roboto Flex",
};

const STORAGE_KEY = "expressive-playground";

const PlaygroundContext = React.createContext<{
  state: PlaygroundState;
  update: (patch: Partial<PlaygroundState>) => void;
  theme: ReturnType<typeof createTheme>;
} | null>(null);

export function usePlayground() {
  const context = React.useContext(PlaygroundContext);
  if (!context) throw new Error("usePlayground must be used inside <Playground>");
  return context;
}

export function Playground({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState(initial);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const next = { ...initial, ...JSON.parse(saved) };
        if (next.motion === "fluid" && next.engine === "css") next.engine = "motion";
        setState(next);
      }
      else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setState((s) => ({ ...s, dark: true }));
    } catch {}
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", state.dark);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const update = React.useCallback(
    (patch: Partial<PlaygroundState>) =>
      setState((s) => {
        const next = { ...s, ...patch };
        // Fluid needs per-frame velocity: move off the CSS engine when it's chosen.
        if (next.motion === "fluid" && next.engine === "css") next.engine = "motion";
        return next;
      }),
    [],
  );

  const theme = React.useMemo(() => {
    const font = `${fonts[state.font]}, ui-sans-serif, system-ui, sans-serif`;
    return createTheme({
      colors: { seed: state.seed, variant: state.variant },
      typography: { fonts: { brand: font, plain: font } },
      motion: { scheme: state.motion },
    });
  }, [state.seed, state.variant, state.font, state.motion]);

  return (
    <PlaygroundContext value={{ state, update, theme }}>
      <MotionAdapterContext value={engines[state.engine]}>
        <ThemeProvider theme={theme}>
          <TooltipProvider>
            <SnackbarProvider>{children}</SnackbarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </MotionAdapterContext>
    </PlaygroundContext>
  );
}
