import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Code } from "@/components/code";
import { C, DocsPage, H2, List, P, TextLink } from "@/components/docs/prose";
import { PackageCommand } from "@/components/package-command";

export const metadata: Metadata = pageMetadata("/docs/installation");

export default function Installation() {
  return (
    <DocsPage
      href="/docs/installation"
      eyebrow="Getting started"
      title="Installation"
      lead="Set up Expressive in a React project that uses Tailwind CSS v4. It takes one command, plus one more per component."
    >
      <H2>Requirements</H2>
      <List>
        <li>React 19 and TypeScript.</li>
        <li>
          Tailwind CSS v4, with a CSS file that contains <C>@import &quot;tailwindcss&quot;</C>.
        </li>
        <li>Next.js, Vite, React Router / Remix, TanStack Start or Astro (with React islands).</li>
      </List>

      <H2>1. Initialize</H2>
      <P>Run this in your project root:</P>
      <PackageCommand args="init" />
      <P>It asks for six things, all changeable later:</P>
      <List>
        <li>
          <strong>Seed color</strong>: the hex color your whole scheme is generated from.
        </li>
        <li>
          <strong>Color scheme</strong>: how the seed is interpreted, from <C>expressive</C> (the default) to <C>tonal-spot</C> or{" "}
          <C>monochrome</C>.
        </li>
        <li>
          <strong>Font</strong>: any font family. Variable fonts work best.
        </li>
        <li>
          <strong>Motion scheme</strong>: <C>expressive</C>, <C>standard</C> or <C>fluid</C> (soft and gooey; needs Motion or GSAP).
        </li>
        <li>
          <strong>Motion engine</strong>: CSS (no dependency), Motion or GSAP.
        </li>
        <li>
          <strong>Corner scale</strong>: Material&apos;s default, softer, or sharper.
        </li>
      </List>
      <P>Then it:</P>
      <List>
        <li>
          writes <C>expressive.json</C> with your choices and where files go;
        </li>
        <li>
          copies the tokens and helpers into <C>lib/expressive/</C>;
        </li>
        <li>
          adds <C>expressive.css</C> next to your global CSS and imports it after Tailwind;
        </li>
        <li>generates your theme&apos;s CSS variables into the global CSS file;</li>
        <li>installs the npm packages those files use, with the package manager your lockfile points to.</li>
      </List>

      <H2>2. Add components</H2>
      <PackageCommand args="add button dialog switch" />
      <P>
        Components land in <C>components/expressive/</C>, with imports rewritten to your path aliases (or to relative paths if you
        don&apos;t use aliases). Anything a component depends on is added too.
      </P>
      <Code
        title="app/page.tsx"
        code={`import { Button } from "@/components/expressive/button";

export default function Page() {
  return <Button>Get started</Button>;
}`}
      />

      <H2>3. Load your font</H2>
      <P>
        The theme refers to your font by name; loading it is up to you. In Next.js, use <C>next/font</C> and pass its CSS variable
        as the font:
      </P>
      <Code
        title="app/layout.tsx"
        code={`import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}`}
      />
      <PackageCommand args={`theme --font "var(--font-geist)"`} />

      <H2>Dark mode</H2>
      <P>
        The dark scheme applies under a <C>.dark</C> class on any ancestor, usually <C>&lt;html&gt;</C>. Toggle it however you like,
        for example with <TextLink href="https://github.com/pacocoursey/next-themes">next-themes</TextLink> set to{" "}
        <C>attribute=&quot;class&quot;</C>.
      </P>

      <H2>Troubleshooting</H2>
      <List>
        <li>
          <strong>“Could not find a CSS file with @import &quot;tailwindcss&quot;”</strong>: set up Tailwind v4 first, or point at
          your CSS file with <C>--css src/styles.css</C>.
        </li>
        <li>
          <strong>Styles look unthemed</strong>: make sure <C>expressive.css</C> is imported after Tailwind, and that starter styles
          (like a <C>body</C> background from a project template) aren&apos;t overriding the theme.
        </li>
      </List>
    </DocsPage>
  );
}
