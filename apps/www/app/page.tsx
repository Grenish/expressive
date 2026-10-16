import Link from "next/link";
import { Button } from "@/registry/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/components/card";
import { CodeBlock } from "@/components/code-block";
import { Demo } from "@/components/demos";
import { TonalPalettes } from "@/components/theme-controls";
import { components, groups, titles } from "@/lib/site";

const ordered = groups.flatMap((group) => group.items).flatMap((name) => components.filter((item) => item.name === name));

const principles = [
  [
    "Tokens, not values",
    "Color, type, shape, motion, elevation and interaction are semantic tokens. Components never hardcode a value.",
  ],
  [
    "Seed-based color",
    "One seed color generates five tonal palettes and every color role, for light and dark, with Material's HCT algorithm.",
  ],
  [
    "One motion layer",
    "Springs live in motion.ts. Use CSS by default, or switch the whole app to Motion or GSAP with one import.",
  ],
  [
    "You own the code",
    "The CLI copies source into your project. Change anything — there's no package to fight.",
  ],
];

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <section className="flex flex-col items-start gap-6 rounded-shape-extra-extra-large bg-primary-container p-8 text-on-primary-container sm:p-12">
        <h1 className="max-w-3xl text-display-medium font-brand sm:text-display-large">
          Material 3 Expressive, as code you own.
        </h1>
        <p className="max-w-2xl text-body-large">
          Expressive brings Material&apos;s motion, color, shape and type
          systems to React and Tailwind CSS, with shadcn/ui&apos;s copy-paste
          model. Pick a seed color and every component follows.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            size="md"
            render={<Link href="/docs/button" />}
            nativeButton={false}
          >
            Browse components
          </Button>
          <Button
            size="md"
            variant="outlined"
            render={<a href="#install" />}
            nativeButton={false}
            className="border-on-primary-container/40 text-on-primary-container"
          >
            Get started
          </Button>
        </div>
      </section>

      <section id="install" className="flex flex-col gap-4">
        <h2 className="text-headline-medium font-brand">Get started</h2>
        <p className="max-w-2xl text-body-large text-on-surface-variant">
          Expressive needs React and Tailwind CSS v4. <code>init</code> writes{" "}
          <code>expressive.json</code>, the token files, the motion layer and
          your theme. <code>add</code> copies components in.
        </p>
        <CodeBlock
          code={"npx expressive init\nnpx expressive add button dialog switch"}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {principles.map(([title, body]) => (
          <Card key={title} variant="filled" shape="large">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-on-surface-variant">
              {body}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-headline-medium font-brand">Tonal palettes</h2>
        <p className="text-body-large text-on-surface-variant">
          Generated from the seed color in the Theme panel.
        </p>
        <TonalPalettes />
      </section>

      {ordered.map((item) => (
        <section key={item.name} className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-headline-medium font-brand">
              {titles[item.name]}
            </h2>
            <Button
              variant="text"
              size="sm"
              render={<Link href={`/docs/${item.name}`} />}
              nativeButton={false}
            >
              Docs
            </Button>
          </div>
          <Card variant="outlined" shape="extra-large">
            <CardContent className="p-6">
              <Demo name={item.name as Parameters<typeof Demo>[0]["name"]} />
            </CardContent>
          </Card>
          <CardDescription>{item.description}</CardDescription>
        </section>
      ))}
    </div>
  );
}
