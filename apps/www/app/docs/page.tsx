import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Code } from "@/components/code";
import { C, Callout, DocsPage, H2, LinkTiles, List, P, TextLink } from "@/components/docs/prose";

export const metadata: Metadata = pageMetadata("/docs");

export default function Introduction() {
  return (
    <DocsPage
      href="/docs"
      eyebrow="Getting started"
      title="Introduction"
      lead="Expressive brings Material 3 Expressive's color, motion, shape and type systems to React and Tailwind CSS, as source code you copy into your app and own."
    >
      <P>
        Most component libraries ship as a package: you install it, import from it, and work around it when it doesn&apos;t do what
        you need. Expressive works the other way, like <TextLink href="https://ui.shadcn.com">shadcn/ui</TextLink>. A CLI writes the
        component source into your project. From then on it&apos;s your code, and you change it the way you&apos;d change anything
        else you wrote.
      </P>
      <P>
        What Expressive adds is a design system underneath: every component reads semantic tokens instead of raw values. Change the
        seed color, the font or the motion scheme, and everything follows.
      </P>

      <H2>What you get</H2>
      <List>
        <li>
          <strong>Tokens</strong> for color, typography, shape, motion, elevation, spacing and interaction, written into{" "}
          <C>lib/expressive/tokens</C>.
        </li>
        <li>
          <strong>A color scheme from one seed color</strong>, generated with Google&apos;s Material color algorithm, in light and
          dark.
        </li>
        <li>
          <strong>A motion layer</strong> built on Material&apos;s spring tokens. It runs on plain CSS by default, or on Motion or
          GSAP.
        </li>
        <li>
          <strong>45 components and counting</strong>, built on <TextLink href="https://base-ui.com">Base UI</TextLink> for keyboard, focus and
          screen reader behavior.
        </li>
        <li>
          <strong>A Tailwind v4 bridge</strong>, so tokens are ordinary utilities: <C>bg-primary</C>, <C>text-title-large</C>,{" "}
          <C>rounded-shape-large</C>.
        </li>
      </List>

      <H2>How it fits together</H2>
      <Code
        lang="bash"
        code={`src/
├── app/
│   ├── globals.css          # @import "tailwindcss"; @import "./expressive.css"; + your theme
│   └── expressive.css       # tokens → Tailwind utilities
├── components/expressive/   # button.tsx, dialog.tsx, …  (yours to edit)
└── lib/expressive/
    ├── utils.ts, spring.ts, use-motion.ts, adapters/
    └── tokens/              # colors.ts, motion.ts, shape.ts, theme.ts, …`}
      />
      <P>
        <C>expressive init</C> sets up the tokens, the stylesheet and your theme once. <C>expressive add</C> copies components in.
        The theme itself is plain CSS variables in your global stylesheet, generated from your seed color.
      </P>

      <Callout title="Inspired by, not affiliated with, Material Design">
        Expressive follows the published Material 3 Expressive guidelines. It isn&apos;t a Google project and doesn&apos;t use
        Material Web.
      </Callout>

      <H2>Next steps</H2>
      <LinkTiles
        items={[
          { href: "/docs/installation", title: "Install", description: "Set up Expressive in a React project with one command." },
          { href: "/docs/why", title: "Why Expressive", description: "How it compares with MUI, Material Web and shadcn/ui." },
          { href: "/docs/theming", title: "Theming", description: "Seed color, fonts and motion scheme, as CSS variables." },
          { href: "/docs/components/button", title: "Components", description: "Forty-five and counting, each with a working demo and its source." },
        ]}
      />
    </DocsPage>
  );
}
