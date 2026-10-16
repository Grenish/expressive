import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/registry/components/card";
import { CodeBlock } from "@/components/code-block";
import { Demo, type DemoName } from "@/components/demos";
import { components, titles } from "@/lib/site";

export function generateStaticParams() {
  return components.map((item) => ({ slug: item.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${titles[slug] ?? slug} · Expressive` };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = components.find((component) => component.name === slug);
  if (!item) notFound();

  const sources = await Promise.all(
    item.files.map(async (file) => ({
      path: file.path,
      code: await readFile(
        join(process.cwd(), "../../packages/registry/src", file.path),
        "utf8",
      ),
    })),
  );

  return (
    <article className="flex flex-col gap-8 pb-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-display-small font-brand">{titles[slug]}</h1>
        <p className="max-w-2xl text-body-large text-on-surface-variant">
          {item.description}
        </p>
      </header>

      <Card variant="outlined" shape="extra-large">
        <CardContent className="p-6 sm:p-8">
          <Demo name={slug as DemoName} />
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small font-brand">Installation</h2>
        <CodeBlock code={`npx expressive add ${slug}`} />
      </section>

      {item.dependencies && item.dependencies.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-headline-small font-brand">Dependencies</h2>
          <ul className="flex flex-wrap gap-2">
            {[...item.dependencies, ...(item.registryDependencies ?? [])].map(
              (dep) => (
                <li
                  key={dep}
                  className="rounded-shape-small bg-secondary-container px-3 py-1 text-label-large text-on-secondary-container"
                >
                  {dep.replace(/(?<=.)@[^@]*$/, "")}
                </li>
              ),
            )}
          </ul>
        </section>
      )}

      {sources.map(({ path, code }) => (
        <section key={path} className="flex flex-col gap-3">
          <h2 className="text-headline-small font-brand">Source</h2>
          <p className="text-body-medium text-on-surface-variant">
            <code>{path}</code> — this is the file the CLI copies into your
            project.
          </p>
          <CodeBlock code={code} className="max-h-[32rem] overflow-y-auto" />
        </section>
      ))}
    </article>
  );
}
