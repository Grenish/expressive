import Link from "next/link";
import { Button } from "@/registry/components/button";
import { Code } from "@/components/code";
import { CommandPill } from "@/components/command-tabs";
import { PackageCommand } from "@/components/package-command";
import { ColorRoles } from "@/components/docs/foundations";
import { Icon } from "@/components/icons";
import { SeedDial } from "@/components/landing/seed-dial";
import { Gallery, HeroSpecimen, MotionShowcase, SeedHint, ShapeShowcase } from "@/components/landing/sections";
import { GITHUB_URL, SiteHeader } from "@/components/site-header";
import { TonalPalettes } from "@/components/theme-controls";

function Section({ id, title, lead, children }: { id: string; title: string; lead: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="flex flex-col gap-3">
        <h2 id={`${id}-title`} className="font-display text-headline-large font-semibold tracking-tight text-balance">
          {title}
        </h2>
        <p className="max-w-md text-body-large text-on-surface-variant">{lead}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default function Landing() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-7xl flex-col gap-28 px-4 pt-12 pb-24 lg:px-6 lg:pt-20">
        {/* Hero: the seed dial re-themes everything on the page. */}
        <section aria-labelledby="hero-title" className="grid items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          <div className="flex flex-col items-start gap-7">
            <h1
              id="hero-title"
              className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] font-bold tracking-[-0.035em] text-balance text-on-surface [font-stretch:85%]"
            >
              One color. <span className="text-primary">A whole</span> design system.
            </h1>
            <p className="max-w-xl text-body-large text-on-surface-variant sm:text-[1.125rem] sm:leading-7">
              Expressive brings Material 3 Expressive&apos;s color, motion and shape to React and Tailwind CSS, as components you copy
              into your app and own. Turn the dial: everything here is generated from that one seed.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="md" render={<Link href="/docs/installation" />} nativeButton={false} icon={<Icon name="terminal" />}>
                Get started
              </Button>
              <Button size="md" variant="outlined" render={<Link href="/docs/components/button" />} nativeButton={false}>
                Browse components
              </Button>
            </div>
            <CommandPill args="init" className="rounded-shape-full bg-surface-container px-4 py-2 font-mono text-[13px] text-on-surface-variant" />
          </div>
          <div className="flex flex-col gap-5">
            <SeedDial />
            <div className="text-center">
              <SeedHint />
            </div>
            <HeroSpecimen />
          </div>
        </section>

        <Section
          id="color"
          title="Every role, from one seed"
          lead="Google's Material color algorithm turns your seed into five tonal palettes, then assigns each color role in light and dark. Contrast between a role and its on-role is built in."
        >
          <div className="flex flex-col gap-6">
            <TonalPalettes />
            <ColorRoles />
          </div>
        </Section>

        <Section
          id="motion"
          title="Motion that springs"
          lead="Movement uses spring physics instead of fixed durations. Same move, three schemes: expressive overshoots, standard settles, and fluid drifts like a droplet, stretching with speed and wobbling as it lands."
        >
          <MotionShowcase />
        </Section>

        <Section
          id="shape"
          title="Shapes that respond"
          lead="All 35 Material 3 Expressive shapes, from cookies and clovers to the burst and the flower, morphing into each other on springs. And corners are tokens that move: press and hold a tile."
        >
          <ShapeShowcase />
        </Section>

        <Section
          id="ownership"
          title="The code is yours"
          lead="The CLI copies each component's source into your project and rewrites imports to your paths. No package to upgrade around, nothing hidden in node_modules."
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <PackageCommand args={["init", "add button dialog", `theme --seed "#0B57D0"`, "diff button"]} />
            <Code
              lang="bash"
              title="your project"
              code={`src/
├── components/expressive/
│   ├── button.tsx
│   └── dialog.tsx
└── lib/expressive/
    ├── adapters/
    └── tokens/
        ├── colors.ts
        └── motion.ts`}
            />
          </div>
        </Section>

        <section aria-labelledby="gallery-title" className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="gallery-title" className="font-display text-headline-large font-semibold tracking-tight">
              19 components, all on Base UI
            </h2>
            <Button variant="text" render={<Link href="/docs/components/button" />} nativeButton={false}>
              See them all
            </Button>
          </div>
          <Gallery />
        </section>

        <section className="flex flex-col items-start gap-6 rounded-shape-extra-extra-large bg-primary-container p-8 text-on-primary-container sm:p-12">
          <h2 className="max-w-2xl font-display text-display-small font-semibold tracking-tight text-balance">
            Start with one command.
          </h2>
          <p className="max-w-xl text-body-large">Needs React 19 and Tailwind CSS v4. Works with Next.js, Vite, React Router, TanStack Start and Astro.</p>
          <div className="flex flex-wrap gap-3">
            <Button size="md" render={<Link href="/docs/installation" />} nativeButton={false}>
              Read the installation guide
            </Button>
            <Button size="md" variant="text" render={<a href={GITHUB_URL} />} nativeButton={false} icon={<Icon name="github" />} className="text-on-primary-container">
              View on GitHub
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-outline-variant/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-body-small text-on-surface-variant lg:px-6">
          <span>Expressive is MIT licensed. Inspired by Material 3 Expressive; not affiliated with Google.</span>
          <nav aria-label="Footer" className="flex gap-4">
            <Link className="focus-ring rounded-shape-extra-small hover:text-on-surface" href="/docs">
              Docs
            </Link>
            <a className="focus-ring rounded-shape-extra-small hover:text-on-surface" href={GITHUB_URL}>
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
