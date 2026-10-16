import * as React from "react";
import { type Theme, themeToCss } from "@/registry/tokens/theme";

interface ThemeProviderProps {
  /** A theme from `createTheme()`. */
  theme: Theme;
  children?: React.ReactNode;
}

/**
 * Applies a theme at runtime by injecting its CSS variables. Use it when the
 * theme changes while the app runs (user-picked seed, per-tenant brand);
 * otherwise prefer the static CSS written by `expressive init`.
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const css = React.useMemo(() => themeToCss(theme), [theme]);
  return (
    <>
      <style data-expressive-theme="">{css}</style>
      {children}
    </>
  );
}
