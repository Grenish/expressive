import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Code } from "@/components/code";
import { PackageCommand } from "@/components/package-command";
import { C, Callout, DocsPage, H2, List, P, TextLink } from "@/components/docs/prose";

export const metadata: Metadata = pageMetadata("/docs/theming");

export default function Theming() {
  return (
    <DocsPage
      href="/docs/theming"
      eyebrow="Getting started"
      title="Theming"
      lead="A theme is every token system combined into one object. Expressive turns it into CSS variables, and every component reads those variables."
    >
      <H2>Theme from the CLI</H2>
      <P>
        Most apps never touch theme code. <C>init</C> writes your theme as CSS variables into your global stylesheet, and{" "}
        <C>expressive theme</C> regenerates it:
      </P>
      <Code
        title="globals.css"
        lang="css"
        code={`@import "tailwindcss";
@import "./expressive.css";

/* expressive:theme:start */
:root {
  --ex-color-primary: #65558f;
  --ex-color-on-primary: #ffffff;
  --ex-color-surface-container: #f3edf7;
  --ex-type-title-large-size: 1.375rem;
  --ex-shape-corner-large: 16px;
  --ex-spring-spatial-fast-easing: linear(0, 0.0292, …, 1);
  /* … */
}
.dark {
  --ex-color-primary: #cfbdfe;
  /* … */
}
/* expressive:theme:end */`}
      />
      <P>
        Everything between the markers is replaced when you run <C>expressive theme</C>. Put your own overrides below the end marker.
      </P>

      <H2>createTheme</H2>
      <P>
        For full control, build a theme in code. <C>createTheme</C> starts from the defaults and deep-merges whatever you pass:
      </P>
      <Code
        code={`import { createTheme, themeToCss } from "@/lib/expressive/tokens/theme";

const theme = createTheme({
  colors: { seed: "#0B57D0", variant: "tonal-spot", contrast: 0 },
  typography: { fonts: { brand: "var(--font-display)", plain: "var(--font-sans)" } },
  shape: { corners: { large: 20 } },
  motion: { scheme: "standard" },
  interaction: { focusRing: { width: 2 } },
});

const css = themeToCss(theme); // ":root { --ex-color-primary: … }"`}
      />
      <List>
        <li>
          <C>colors</C>: a seed with options, or a full scheme you generated yourself.
        </li>
        <li>
          <C>typography</C>, <C>shape</C>, <C>motion</C>, <C>elevation</C>, <C>spacing</C>, <C>interaction</C>: partial overrides of
          each token system.
        </li>
      </List>

      <H2>Changing the theme at runtime</H2>
      <P>
        When the theme depends on something only known while the app runs, like a color the user picks or a per-customer brand, add
        the theme provider:
      </P>
      <PackageCommand args="add theme-provider" />
      <Code
        code={`"use client";

import { useMemo, useState } from "react";
import { ThemeProvider } from "@/lib/expressive/theme-provider";
import { createTheme } from "@/lib/expressive/tokens/theme";

export function BrandedApp({ children }: { children: React.ReactNode }) {
  const [seed, setSeed] = useState("#6750A4");
  const theme = useMemo(() => createTheme({ colors: { seed } }), [seed]);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}`}
      />
      <Callout>
        This site works exactly like that: the Customize button feeds a seed color into <C>createTheme</C> and{" "}
        <C>ThemeProvider</C>.
      </Callout>

      <H2>Using tokens in your own code</H2>
      <P>Tokens are Tailwind utilities, so your own components match without extra work:</P>
      <Code
        code={`<section className="rounded-shape-extra-large bg-surface-container p-ex-lg text-on-surface shadow-elevation-1">
  <h2 className="text-headline-small">Recent trips</h2>
  <p className="text-body-medium text-on-surface-variant">Three upcoming</p>
</section>`}
      />
      <P>
        Or use the variables directly: <C>var(--ex-color-primary)</C>, <C>var(--ex-shape-corner-large)</C>. See each foundation page
        for the full list: <TextLink href="/docs/color">color</TextLink>, <TextLink href="/docs/typography">typography</TextLink>,{" "}
        <TextLink href="/docs/shape">shape</TextLink>, <TextLink href="/docs/motion">motion</TextLink>.
      </P>
    </DocsPage>
  );
}
