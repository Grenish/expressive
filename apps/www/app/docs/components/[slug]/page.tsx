import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Code } from "@/components/code";
import { PackageCommand } from "@/components/package-command";
import { Demo, type DemoName } from "@/components/demos";
import { C, DocsPage, H2, H3, List, P, Preview, PropsTable, rich } from "@/components/docs/prose";
import { componentDocs } from "@/lib/component-docs";
import { components, groups, titles } from "@/lib/site";

export function generateStaticParams() {
  return components.map((item) => ({ slug: item.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = components.find((component) => component.name === slug);
  return { title: titles[slug] ?? slug, description: item?.description };
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = components.find((component) => component.name === slug);
  const doc = componentDocs[slug];
  if (!item || !doc) notFound();

  const group = groups.find((g) => g.items.includes(slug))?.title;
  const sources = await Promise.all(
    item.files.map(async (file) => ({
      path: file.path,
      // Show it the way the CLI writes it with the default paths.
      code: (await readFile(join(process.cwd(), "../../packages/registry/src", file.path), "utf8"))
        .replaceAll("@/registry/tokens/", "@/lib/expressive/tokens/")
        .replaceAll("@/registry/lib/", "@/lib/expressive/")
        .replaceAll("@/registry/components/", "@/components/expressive/"),
    })),
  );
  const npmDeps = (item.dependencies ?? []).map((dep) => dep.replace(/(?<=.)@[^@]*$/, ""));

  return (
    <DocsPage href={`/docs/components/${slug}`} eyebrow={group} title={titles[slug] ?? slug} lead={item.description}>
      <Preview>
        <Demo name={slug as DemoName} />
      </Preview>
      <P>{rich(doc.overview)}</P>

      <H2>Installation</H2>
      <PackageCommand args={`add ${slug}`} />
      <P>
        This copies <C>{sources.map((s) => s.path.split("/").pop()).join(", ")}</C> into your components folder
        {item.registryDependencies?.length ? (
          <>
            , along with what it needs from Expressive (<C>{item.registryDependencies.join(", ")}</C>)
          </>
        ) : null}
        {npmDeps.length ? (
          <>
            , and installs <C>{npmDeps.join(", ")}</C>
          </>
        ) : null}
        .
      </P>

      <H2>Usage</H2>
      <Code code={doc.usage} />

      <H2>Props</H2>
      {Object.entries(doc.props).map(([name, rows]) => (
        <div key={name} className="flex flex-col gap-3">
          <H3>{name}</H3>
          <PropsTable rows={rows.map((row) => ({ ...row }))} />
        </div>
      ))}

      <H2>Accessibility</H2>
      <List>
        {doc.accessibility.map((line) => (
          <li key={line}>{rich(line)}</li>
        ))}
      </List>

      {doc.notes && (
        <>
          <H2>Notes</H2>
          <List>
            {doc.notes.map((line) => (
              <li key={line}>{rich(line)}</li>
            ))}
          </List>
        </>
      )}

      <H2>Source</H2>
      <P>This is the file the CLI writes into your project, shown with the default import paths. It&apos;s yours to change.</P>
      {sources.map(({ path, code }) => (
        <Code key={path} code={code} title={path} scroll />
      ))}
    </DocsPage>
  );
}
