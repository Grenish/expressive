import type { Metadata } from "next";
import { Code } from "@/components/code";
import { PackageCommand } from "@/components/package-command";
import { C, DocsPage, H2, List, P } from "@/components/docs/prose";
import { TypeScale } from "@/components/docs/foundations";

export const metadata: Metadata = { title: "Typography" };

export default function Typography() {
  return (
    <DocsPage
      href="/docs/typography"
      eyebrow="Foundations"
      title="Typography"
      lead="Fifteen type roles in five groups, each with an emphasized version. Use any font you like; the roles keep sizes and rhythm consistent."
    >
      <H2>Type scale</H2>
      <P>Shown in the font chosen in Customize.</P>
      <TypeScale />

      <H2>Roles</H2>
      <List>
        <li>
          <strong>Display</strong>: the largest text, for short, important moments like a hero.
        </li>
        <li>
          <strong>Headline</strong>: section and page headings.
        </li>
        <li>
          <strong>Title</strong>: smaller headings, card titles, app bar titles.
        </li>
        <li>
          <strong>Body</strong>: paragraphs and longer text.
        </li>
        <li>
          <strong>Label</strong>: buttons, chips, tabs and other UI text.
        </li>
      </List>
      <P>
        Each role has an <C>-emphasized</C> version with a heavier weight, which M3 Expressive uses to highlight important text, for
        example <C>text-title-large-emphasized</C>.
      </P>

      <H2>Fonts</H2>
      <P>
        Roles use one of two families: <strong>brand</strong> (display, headline, title-large) and <strong>plain</strong> (the
        rest). By default both are Roboto Flex. Set them to any font, ideally a variable one so weights interpolate smoothly:
      </P>
      <PackageCommand args={`theme --font "Inter"`} />
      <Code code={`createTheme({ typography: { fonts: { brand: "var(--font-display)", plain: "var(--font-sans)" } } });`} />

      <H2>Using type</H2>
      <Code
        code={`<h1 className="text-display-small">Trips</h1>
<p className="text-body-large text-on-surface-variant">Three upcoming</p>
<span className="text-label-medium">Updated today</span>`}
      />
      <P>
        Each <C>text-*</C> utility sets size, line height, letter spacing and weight together. The values are also available as
        variables, like <C>--ex-type-title-large-size</C>.
      </P>
    </DocsPage>
  );
}
