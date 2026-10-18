import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Code } from "@/components/code";
import { PackageCommand } from "@/components/package-command";
import { Demo, type DemoName } from "@/components/demos";
import { C, DocsPage, H2, H3, LinkTiles, List, P, Preview, PropsTable, rich } from "@/components/docs/prose";
import { componentDocs } from "@/lib/component-docs";
import { PAGES, pageMetadata } from "@/lib/seo";
import { components, groups, titles } from "@/lib/site";

export function generateStaticParams() {
  return components.map((item) => ({ slug: item.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return PAGES[`/docs/components/${slug}`] ? pageMetadata(`/docs/components/${slug}`) : {};
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

  // Same-group siblings first, then the next two components in nav order, for internal linking.
  const order = groups.flatMap((g) => g.items);
  const siblings = groups.find((g) => g.items.includes(slug))?.items.filter((other) => other !== slug) ?? [];
  const after = [1, 2].map((step) => order[(order.indexOf(slug) + siblings.length + step) % order.length]!);
  const related = [...new Set([...siblings, ...after])]
    .filter((other) => other !== slug)
    .slice(0, 6)
    .map((other) => ({ slug: other, name: titles[other] ?? other, tagline: PAGES[`/docs/components/${other}`]?.og.subtitle ?? "" }));

  return (
    <DocsPage
      href={`/docs/components/${slug}`}
      eyebrow={group}
      title={titles[slug] ?? slug}
      lead={item.description}
      specs={[
        ["group", group ?? "—"],
        ["files", sources.map((s) => s.path.split("/").pop()).join(", ")],
        ["depends on", npmDeps.length ? npmDeps.join(", ") : "—"],
        ["add", `add ${slug}`],
      ]}
    >
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

      {/* Internal links: kept out of search so they don't add incidental matches. */}
      <div data-pagefind-ignore="all" className="flex flex-col gap-5">
        <H2>Related components</H2>
        <LinkTiles items={related.map(({ slug: other, name, tagline }) => ({ href: `/docs/components/${other}`, title: name, description: tagline }))} />
      </div>

      <H2>Source</H2>
      <P>This is the file the CLI writes into your project, shown with the default import paths. It&apos;s yours to change.</P>
      {/* Full listings stay out of the search index (they'd swamp the rankings); the Markdown copy keeps them. */}
      <div data-pagefind-ignore="all" className="flex flex-col gap-5">
        {sources.map(({ path, code }) => (
          <Code key={path} code={code} title={path} scroll />
        ))}
      </div>
    </DocsPage>
  );
}
