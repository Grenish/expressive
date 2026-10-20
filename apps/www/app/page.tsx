import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/registry/components/button";
import { cn } from "@/registry/lib/utils";
import { Code } from "@/components/code";
import { CommandPill } from "@/components/command-tabs";
import { PackageCommand } from "@/components/package-command";
import { Icon } from "@/components/icons";
import { Anatomy } from "@/components/landing/anatomy";
import { Instruments } from "@/components/landing/instruments";
import { spec } from "@/components/landing/tokens";
import { PaletteBand } from "@/components/landing/palette-band";
import { SeedKnob } from "@/components/landing/seed-knob";
import { MotionShowcase } from "@/components/landing/sections";
import { ShapeBoard } from "@/components/landing/shape-board";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { FAQ } from "@/lib/faq";
import { GITHUB_URL, NPM_URL } from "@/lib/links";
import { faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/");

/*
 * The landing page as a bench of instruments: flat, full-bleed fields drawn
 * from the current scheme, one live object on each, small lowercase labels and
 * mono specs. The seed knob in the hero re-themes every field and object.
 */

const gutter = "px-4 sm:px-8 lg:px-12";

function SectionHead({ index, id, title, lead, link }: { index: string; id: string; title: string; lead: string; link?: { href: string; label: string } }) {
  return (
    <div className={cn("grid gap-4 border-t border-outline-variant/60 py-10 sm:py-14 lg:grid-cols-12", gutter)}>
      <span className={cn(spec, "text-on-surface-variant lg:col-span-2")}>{index}</span>
      <h2 id={id} className="font-display text-headline-large font-semibold tracking-tight text-balance text-on-surface lg:col-span-5">
        {title}
      </h2>
      <div className="flex flex-col items-start gap-4 lg:col-span-5">
        <p className="max-w-xl text-body-large text-pretty text-on-surface-variant">{lead}</p>
        {link && (
          <Link href={link.href} className="focus-ring group flex items-center gap-1.5 rounded-shape-extra-small text-title-medium text-primary">
            {link.label}
            <Icon name="arrow" className="size-4 transition-transform spring-spatial-fast group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}

const SPECS = [
  ["45", "components, and counting"],
  ["35", "morphing shapes"],
  ["9", "scheme variants"],
  ["3", "motion schemes"],
] as const;

export default function Landing() {
  return (
    <>
      <SiteHeader wide />
      <JsonLd data={[...siteJsonLd(), faqJsonLd(FAQ)]} />
      <main data-pagefind-body="">
        {/* 01 · The instrument: a statement on the left, the seed knob on its own field on the right. */}
        <section aria-labelledby="hero-title" className="grid lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-12">
          <div className={cn("flex flex-col justify-between gap-14 bg-surface pt-12 pb-10 lg:col-span-7 lg:pt-16", gutter)}>
            <div className="flex items-center justify-between gap-4">
              <p className={cn(spec, "text-primary")}>material 3 expressive for react</p>
              <span data-md-skip="" className={cn(spec, "text-on-surface-variant max-sm:hidden")}>mit · open source</span>
            </div>
            <div className="flex flex-col gap-7">
              <h1
                id="hero-title"
                className="font-display text-[clamp(3.25rem,8.4vw,7.5rem)] leading-[0.9] font-bold tracking-[-0.04em] text-balance text-on-surface [font-stretch:85%]"
              >
                One color. A whole design system.
              </h1>
              <p className="max-w-xl text-body-large text-pretty text-on-surface-variant sm:text-[1.125rem] sm:leading-7">
                Expressive brings Material 3 Expressive&apos;s color, motion and shape to React and Tailwind CSS, as components you copy
                into your app and own. Turn the knob: everything on this site is generated from that one seed.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="flex flex-wrap gap-3">
                <Button size="md" render={<Link href="/docs/installation" />} nativeButton={false} icon={<Icon name="terminal" />}>
                  Get started
                </Button>{" "}
                <Button size="md" variant="outlined" render={<Link href="/docs/components/button" />} nativeButton={false}>
                  Browse components
                </Button>
              </div>
              <CommandPill args="init" className="rounded-shape-full bg-surface-container px-4 py-2 font-mono text-[13px] text-on-surface-variant" />
            </div>
          </div>
          <div data-md-skip="" className="relative flex flex-col items-center justify-center gap-6 bg-secondary-container px-4 py-14 text-on-secondary-container lg:col-span-5">
            <span className={cn(spec, "absolute top-5 left-5 opacity-60")}>seed</span>
            <span className={cn(spec, "absolute top-5 right-5 opacity-60")}>drag · arrows</span>
            <SeedKnob />
          </div>
        </section>

        {/* Spec strip */}
        <ul className="grid grid-cols-2 border-t border-outline-variant/60 sm:grid-cols-4">
          {SPECS.map(([value, label], i) => (
            <li key={label} className={cn("flex items-baseline gap-3 py-6", gutter, i > 0 && "sm:border-l sm:border-outline-variant/60", i % 2 === 1 && "max-sm:border-l max-sm:border-outline-variant/60")}>
              <span className="font-display text-headline-large font-semibold tracking-tight text-on-surface tabular-nums">{value}</span>{" "}
              <span className={cn(spec, "text-on-surface-variant")}>{label}</span>
            </li>
          ))}
        </ul>

        {/* 02 · The bench */}
        <section aria-labelledby="bench-title">
          <SectionHead
            index="02"
            id="bench-title"
            title="Forty-five components and counting."
            lead="Every tile is the real component, not a picture of one, themed live by the knob above. Press, drag, toggle: they're yours to play with."
            link={{ href: "/docs/components/button", label: "All components" }}
          />
          <div data-md-skip="">
            <Instruments />
          </div>
        </section>

        {/* 03 · Anatomy */}
        <section aria-labelledby="anatomy-title" className="bg-surface-container-low">
          <SectionHead
            index="03"
            id="anatomy-title"
            title="Anatomy of a button."
            lead="Nothing is hard-coded. Every part of every component reads a token: color roles, the type scale, the corner scale, state layers, springs. Point at a part."
          />
          <div className={cn("pb-16 sm:pb-20", gutter)}>
            <Anatomy />
          </div>
        </section>

        {/* 04 · Color */}
        <section aria-labelledby="color-title">
          <SectionHead
            index="04"
            id="color-title"
            title="One seed, five palettes."
            lead="Google's Material color algorithm turns your seed into five tonal palettes, then assigns every color role in light and dark. Contrast between a role and its on-role is built in."
            link={{ href: "/docs/color", label: "How color works" }}
          />
          <div data-md-skip="">
            <PaletteBand />
          </div>
        </section>

        {/* 05 · Motion and shape: a dark device beside a tertiary field. */}
        <section aria-label="Motion and shape" className="grid border-t border-outline-variant/60 lg:grid-cols-2">
          <div className={cn("dark flex flex-col gap-10 bg-surface-container-lowest py-12 text-on-surface sm:py-16", gutter)}>
            <div className="flex flex-col gap-3">
              <span className={cn(spec, "text-on-surface-variant")}>05 · motion</span>
              <h2 className="font-display text-headline-large font-semibold tracking-tight text-balance">Springs, not durations.</h2>
              <p className="max-w-md text-body-large text-on-surface-variant">
                The same move under each scheme: expressive overshoots, standard settles, and fluid drifts like a droplet, stretching
                with speed.
              </p>
            </div>
            <div data-md-skip="">
              <MotionShowcase />
            </div>
            <Link href="/docs/motion" className="focus-ring group mt-auto flex items-center gap-1.5 self-start rounded-shape-extra-small text-title-medium text-primary">
              The motion system
              <Icon name="arrow" className="size-4 transition-transform spring-spatial-fast group-hover:translate-x-1" />
            </Link>
          </div>
          <div className={cn("flex flex-col gap-10 bg-tertiary-container py-12 text-on-tertiary-container sm:py-16", gutter)}>
            <div className="flex flex-col gap-3">
              <span className={cn(spec, "opacity-70")}>06 · shape</span>
              <h2 className="font-display text-headline-large font-semibold tracking-tight text-balance">35 shapes that morph.</h2>
              <p className="max-w-md text-body-large opacity-80">
                Every Material 3 Expressive shape, from cookies and clovers to the burst and the flower. Point at one.
              </p>
            </div>
            <div data-md-skip="">
              <ShapeBoard />
            </div>
          </div>
        </section>

        {/* 07 · Own the code */}
        <section aria-labelledby="code-title">
          <SectionHead
            index="07"
            id="code-title"
            title="Copy. Paste. Own it."
            lead="The CLI copies each component's source into your project and rewrites imports to your paths. No package to upgrade around, nothing hidden in node_modules."
            link={{ href: "/docs/cli", label: "The CLI" }}
          />
          <div className={cn("grid items-start gap-4 pb-16 sm:pb-20 xl:grid-cols-2", gutter)}>
            <PackageCommand args={["init", "add button dialog", `theme --seed "#00796B"`, "diff button"]} />
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
        </section>

        {/* 08 · Questions */}
        <section aria-labelledby="faq-title" className="bg-surface-container-low">
          <SectionHead index="08" id="faq-title" title="Questions." lead="What Expressive is, what it isn't, and where it runs." />
          <dl className={cn("grid gap-x-12 pb-16 sm:pb-20 md:grid-cols-2", gutter)}>
            {FAQ.map(({ q, a }) => (
              <div key={q} className="flex flex-col gap-2 border-t border-outline-variant/60 py-6">
                <dt className="text-title-large text-on-surface">{q}</dt>
                <dd className="text-body-large text-pretty text-on-surface-variant">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Start */}
        <section aria-labelledby="start-title" className={cn("grid gap-10 bg-primary py-16 text-on-primary sm:py-20 lg:grid-cols-12", gutter)}>
          <div className="flex flex-col gap-4 lg:col-span-6">
            <span className={cn(spec, "opacity-70")}>start</span>
            <h2 id="start-title" className="font-display text-display-medium leading-none font-bold tracking-tight text-balance">
              Start with one command.
            </h2>
            <p className="max-w-lg text-body-large opacity-85">Needs React 19 and Tailwind CSS v4. Works with Next.js, Vite, React Router, TanStack Start and Astro.</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button size="md" variant="tonal" render={<Link href="/docs/installation" />} nativeButton={false}>
                Read the installation guide
              </Button>
              <Button size="md" variant="text" render={<a href={GITHUB_URL} />} nativeButton={false} icon={<Icon name="github" />} className="text-on-primary">
                View on GitHub
              </Button>
            </div>
          </div>
          <div className="flex items-end lg:col-span-6">
            <PackageCommand args="init" className="w-full" />
          </div>
        </section>
      </main>
      <SiteFooter className={gutter} />
    </>
  );
}
