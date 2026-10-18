import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Code } from "@/components/code";
import { PackageCommand } from "@/components/package-command";
import { C, DocsPage, H2, List, P, PropsTable } from "@/components/docs/prose";

export const metadata: Metadata = pageMetadata("/docs/cli");

const common = [
  { name: "-c, --cwd <path>", type: "path", default: "current dir", description: "Project directory." },
  { name: "-r, --registry <url|path>", type: "url | path", default: "from expressive.json", description: "Registry to read components from." },
];

export default function Cli() {
  return (
    <DocsPage
      href="/docs/cli"
      eyebrow="Getting started"
      title="CLI"
      lead="The expressive CLI sets up your project, copies components in, regenerates your theme, and shows how your copies differ from the originals."
    >
      <P>
        Run it through your package manager: every example below has a tab for npm, pnpm, Yarn and Bun. If you install it
        globally (<C>npm i -g @grenishrai/expressive</C>), the command is simply <C>expressive</C>.
      </P>
      <H2>init</H2>
      <P>Sets up config, tokens, the motion layer, the stylesheet and your theme. Run it once.</P>
      <PackageCommand args={["init", `init --yes --seed "#0B57D0" --motion motion`]} />
      <PropsTable
        rows={[
          { name: "-y, --yes", type: "flag", description: "Skip prompts and use defaults for anything not passed." },
          { name: "--seed <hex>", type: "string", default: "#6750A4", description: "Seed color." },
          { name: "--variant <scheme>", type: "string", default: "expressive", description: "`expressive`, `tonal-spot`, `vibrant`, `neutral`, `monochrome`, `fidelity`, `content`, `rainbow` or `fruit-salad`." },
          { name: "--font <family>", type: "string", default: "Roboto Flex", description: "Font family, or a CSS variable like `var(--font-geist)`." },
          { name: "--scheme <scheme>", type: "expressive | standard | fluid", default: "expressive", description: "Default motion scheme. `fluid` needs the Motion or GSAP engine." },
          { name: "--motion <engine>", type: "css | motion | gsap", default: "css (motion for fluid)", description: "Motion engine." },
          { name: "--shape <scale>", type: "expressive | soft | sharp", default: "expressive", description: "Corner scale." },
          { name: "--css <file>", type: "path", default: "detected", description: "Global CSS file that imports Tailwind." },
          { name: "--no-install", type: "flag", description: "Don't install npm packages." },
          ...common,
        ]}
      />

      <H2>add</H2>
      <P>Copies components, and anything they depend on, into your project.</P>
      <PackageCommand args="add button text-field navigation-bar" />
      <P>
        If a file already exists and you&apos;ve changed it, <C>add</C> asks before replacing it. With <C>--yes</C> it skips those
        files and tells you which ones; with <C>--overwrite</C> it replaces them.
      </P>
      <PropsTable
        rows={[
          { name: "-o, --overwrite", type: "flag", description: "Replace files that have local changes." },
          { name: "-y, --yes", type: "flag", description: "Don't prompt; keep locally changed files." },
          { name: "--no-install", type: "flag", description: "Don't install npm packages." },
          ...common,
        ]}
      />

      <H2>theme</H2>
      <P>
        Regenerates the theme variables in your global CSS (between the <C>expressive:theme</C> markers) and saves the new settings
        to <C>expressive.json</C>.
      </P>
      <PackageCommand args={[`theme --seed "#B3261E" --variant vibrant`, "theme --contrast 0.5", "theme --scheme fluid --motion motion"]} />
      <PropsTable
        rows={[
          { name: "--seed <hex>", type: "string", description: "New seed color." },
          { name: "--variant <scheme>", type: "string", description: "New color scheme." },
          { name: "--contrast <level>", type: "number", description: "From -1 (lower) through 0 (standard) to 1 (high contrast)." },
          { name: "--font <family>", type: "string", description: "New font family." },
          { name: "--shape <scale>", type: "string", description: "New corner scale." },
          { name: "--scheme <scheme>", type: "expressive | standard | fluid", description: "New default motion scheme." },
          { name: "--motion <engine>", type: "css | motion | gsap", description: "Switch engine: installs its adapter and repoints `tokens/motion.ts`." },
          { name: "-c, --cwd <path>", type: "path", description: "Project directory." },
        ]}
      />

      <H2>list</H2>
      <P>Lists available components and marks the ones you&apos;ve installed.</P>
      <PackageCommand args="list" />

      <H2>diff</H2>
      <P>Shows how your copy of a component differs from the registry version, for example before updating it.</P>
      <PackageCommand args="diff button" />

      <H2>expressive.json</H2>
      <P>
        Written by <C>init</C>. Edit it to move files or change aliases; the CLI reads it on every command.
      </P>
      <Code
        lang="json"
        title="expressive.json"
        code={`{
  "registry": "https://expressive.grenishrai.pro/r",
  "framework": "next",
  "rsc": true,
  "css": "src/app/globals.css",
  "motion": "css",
  "theme": {
    "seed": "#6750A4",
    "variant": "expressive",
    "contrast": 0,
    "font": { "brand": "Roboto Flex", "plain": "Roboto Flex" },
    "shape": "expressive",
    "motionScheme": "expressive"
  },
  "dirs": {
    "components": "src/components/expressive",
    "lib": "src/lib/expressive",
    "tokens": "src/lib/expressive/tokens",
    "styles": "src/app"
  },
  "aliases": {
    "components": "@/components/expressive",
    "lib": "@/lib/expressive",
    "tokens": "@/lib/expressive/tokens"
  }
}`}
      />
      <List>
        <li>
          <C>rsc</C>: keep <C>&quot;use client&quot;</C> directives. On for the Next.js App Router, off elsewhere.
        </li>
        <li>
          <C>aliases</C>: import prefixes from your <C>tsconfig.json</C> paths. Leave it empty to get relative imports.
        </li>
      </List>
    </DocsPage>
  );
}
