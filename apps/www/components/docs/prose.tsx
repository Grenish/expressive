import Link from "next/link";
import { CopyPage } from "@/components/copy-page";
import { Icon } from "@/components/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { neighbours } from "@/lib/docs-nav";
import { PAGES, markdownPath, pageJsonLd } from "@/lib/seo";

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Render `inline code` spans inside plain strings. */
export function rich(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) => (part.startsWith("`") ? <C key={i}>{part.slice(1, -1)}</C> : part));
}

export function DocsPage({
  href,
  eyebrow,
  title,
  lead,
  children,
}: {
  href: string;
  eyebrow?: string;
  title: string;
  lead: React.ReactNode;
  children: React.ReactNode;
}) {
  const { prev, next } = neighbours(href);
  const seo = PAGES[href];
  // Search indexes only the article (data-pagefind-body); the Markdown copy drops anything marked data-md-skip.
  return (
    <article className="flex min-w-0 flex-col pb-20" data-pagefind-body="" data-pagefind-filter={seo?.section ? `section:${seo.section}` : undefined}>
      {seo && <JsonLd data={pageJsonLd(href)} />}
      <header className="flex flex-col gap-3 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-2" data-pagefind-ignore="all" data-md-skip="">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-label-large">
              {href !== "/docs" && (
                <li className="flex items-center gap-1.5">
                  <Link href="/docs" className="focus-ring rounded-shape-extra-small text-on-surface-variant hover:text-on-surface">
                    Docs
                  </Link>
                  <span aria-hidden="true" className="text-outline">
                    /
                  </span>
                </li>
              )}
              {eyebrow && <li className="text-primary">{eyebrow}</li>}
            </ol>
          </nav>
          {seo && <CopyPage href={markdownPath(href)} />}
        </div>
        <h1 className="font-display text-display-small font-semibold tracking-tight text-on-surface sm:text-display-medium">{title}</h1>
        <p className="max-w-2xl text-body-large text-on-surface-variant">{lead}</p>
      </header>
      <div className="flex flex-col gap-5">{children}</div>
      <nav aria-label="Pagination" data-pagefind-ignore="all" data-md-skip="" className="mt-16 grid gap-3 border-t border-outline-variant/60 pt-6 sm:grid-cols-2">
        {prev ? (
          <Link href={prev.href} className="state-layer focus-ring flex flex-col gap-1 rounded-shape-large border border-outline-variant p-4">
            <span className="text-label-medium text-on-surface-variant">Previous</span>
            <span className="text-title-medium text-on-surface">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={next.href} className="state-layer focus-ring flex flex-col items-end gap-1 rounded-shape-large border border-outline-variant p-4 text-right">
            <span className="text-label-medium text-on-surface-variant">Next</span>
            <span className="text-title-medium text-on-surface">{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}

export function H2({ children }: { children: string }) {
  const id = slug(children);
  return (
    <h2 id={id} className="group mt-8 scroll-mt-24 font-display text-headline-small font-semibold tracking-tight text-on-surface">
      <a href={`#${id}`} className="focus-ring rounded-shape-small">
        {children}
        <span aria-hidden="true" data-md-skip="" data-pagefind-ignore="" className="ml-2 text-outline opacity-0 group-hover:opacity-100">
          #
        </span>
      </a>
    </h2>
  );
}

export function H3({ children }: { children: string }) {
  return (
    <h3 id={slug(children)} className="mt-4 scroll-mt-24 text-title-large text-on-surface">
      {children}
    </h3>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="max-w-3xl text-body-large text-on-surface-variant [&_strong]:text-on-surface">{children}</p>;
}

export function C({ children }: { children: React.ReactNode }) {
  return <code className="rounded-shape-extra-small bg-surface-container-high px-1.5 py-0.5 font-mono text-[0.875em] text-on-surface">{children}</code>;
}

export function List({ children }: { children: React.ReactNode }) {
  return <ul className="flex max-w-3xl list-disc flex-col gap-2 pl-6 text-body-large text-on-surface-variant marker:text-primary [&_strong]:text-on-surface">{children}</ul>;
}

export function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="flex max-w-3xl gap-3 rounded-shape-large bg-secondary-container p-4 text-body-medium text-on-secondary-container">
      <Icon name="info" className="mt-0.5 size-5 shrink-0" />
      <div className="flex flex-col gap-1">
        {title && <strong className="text-title-small">{title}</strong>}
        <div>{children}</div>
      </div>
    </aside>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  const className = "focus-ring rounded-shape-extra-small text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary";
  return external ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="max-w-full overflow-x-auto rounded-shape-large border border-outline-variant">
      <table className="w-full min-w-[36rem] border-collapse text-left text-body-medium">
        <thead className="bg-surface-container text-label-large text-on-surface">
          <tr>
            <th scope="col" className="px-4 py-3">Prop</th>
            <th scope="col" className="px-4 py-3">Type</th>
            <th scope="col" className="px-4 py-3">Default</th>
            <th scope="col" className="px-4 py-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-outline-variant/60 align-top">
              <td className="px-4 py-3 font-mono text-[13px] text-primary">{row.name}</td>
              <td className="px-4 py-3 font-mono text-[12px] text-on-surface-variant">{row.type}</td>
              <td className="px-4 py-3 font-mono text-[12px] text-on-surface-variant">{row.default ?? "—"}</td>
              <td className="px-4 py-3 text-on-surface-variant">{rich(row.description)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Live example frame. */
export function Preview({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-md-skip="" className={`rounded-shape-extra-large border border-outline-variant p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}
