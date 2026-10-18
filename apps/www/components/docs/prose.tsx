import Link from "next/link";
import { CopyPage } from "@/components/copy-page";
import { Icon } from "@/components/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { spec } from "@/components/landing/tokens";
import { type NavLink, neighbours, pad, pageCount, pageNumber } from "@/lib/docs-nav";
import { PAGES, markdownPath, pageJsonLd } from "@/lib/seo";
import { cn } from "@/registry/lib/utils";

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
  specs,
  children,
}: {
  href: string;
  eyebrow?: string;
  title: string;
  lead: React.ReactNode;
  /** Short facts shown as a ruled strip under the lead, e.g. a component's files and install command. */
  specs?: [label: string, value: React.ReactNode][];
  children: React.ReactNode;
}) {
  const { prev, next } = neighbours(href);
  const seo = PAGES[href];
  const number = pageNumber(href);
  // Search indexes only the article (data-pagefind-body); the Markdown copy drops anything marked data-md-skip.
  return (
    <article
      className="flex min-w-0 flex-col pb-24 [counter-reset:section]"
      data-pagefind-body=""
      data-pagefind-filter={seo?.section ? `section:${seo.section}` : undefined}
    >
      {seo && <JsonLd data={pageJsonLd(href)} />}
      <header className={cn("flex flex-col", specs ? "pb-6" : "pb-10")}>
        <div
          className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/60 pb-2"
          data-pagefind-ignore="all"
          data-md-skip=""
        >
          <nav aria-label="Breadcrumb">
            <ol className={cn(spec, "flex flex-wrap items-center gap-2 text-on-surface-variant")}>
              {href !== "/docs" && (
                <li className="flex items-center gap-2">
                  <Link href="/docs" className="focus-ring rounded-shape-extra-small hover:text-on-surface">
                    Docs
                  </Link>
                  <span aria-hidden="true" className="text-outline">
                    /
                  </span>
                </li>
              )}
              {eyebrow && <li className="text-on-surface">{eyebrow}</li>}
            </ol>
          </nav>
          {seo && <CopyPage href={markdownPath(href)} />}
        </div>
        {number > 0 && (
          <span aria-hidden="true" data-md-skip="" className={cn(spec, "pt-10 text-primary tabular-nums")}>
            {pad(number)} <span className="text-on-surface-variant">/ {pad(pageCount)}</span>
          </span>
        )}
        <h1 className="pt-3 font-display text-[clamp(2.75rem,5.5vw,4.75rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-on-surface">
          {title}
        </h1>
        <p className="max-w-2xl pt-5 text-title-large font-normal text-on-surface-variant">{lead}</p>
        {specs && (
          <dl data-pagefind-ignore="all" data-md-skip="" className="mt-10 grid grid-cols-2 border-y border-outline-variant/60 sm:grid-cols-4">
            {specs.map(([label, value], i) => (
              <div key={label} className={cn("flex min-w-0 flex-col gap-1.5 py-4", i % 2 === 1 && "pl-4 max-sm:border-l max-sm:border-outline-variant/60", i > 0 && "sm:border-l sm:border-outline-variant/60 sm:pl-4", i >= 2 && "max-sm:border-t max-sm:border-outline-variant/60")}>
                <dt className={cn(spec, "text-on-surface-variant")}>{label}</dt>
                <dd className="truncate font-mono text-[13px] text-on-surface">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>
      <div className="flex flex-col gap-5">{children}</div>
      <nav aria-label="Pagination" data-pagefind-ignore="all" data-md-skip="" className="mt-20 grid gap-2 sm:grid-cols-2">
        {prev && <PageLink link={prev} direction="previous" wide={!next} />}
        {next && <PageLink link={next} direction="next" wide={!prev} />}
      </nav>
    </article>
  );
}

/** A previous/next tile: its index number, direction and title. The next one is the tinted, heavier of the two. */
function PageLink({ link, direction, wide }: { link: NavLink; direction: "previous" | "next"; wide: boolean }) {
  const isNext = direction === "next";
  return (
    <Link
      href={link.href}
      className={cn(
        "state-layer focus-ring group flex min-h-36 flex-col justify-between gap-8 rounded-shape-extra-large p-6",
        isNext ? "bg-secondary-container text-on-secondary-container sm:items-end sm:text-right" : "bg-surface-container-low text-on-surface",
        wide && "sm:col-span-2",
        isNext && wide && "sm:items-start sm:text-left",
      )}
    >
      <span className={cn(spec, "flex items-center gap-2 opacity-75")}>
        {!isNext && <Icon name="arrow" className="size-4 rotate-180" />}
        {direction} · {pad(pageNumber(link.href))}
        {isNext && <Icon name="arrow" className="size-4" />}
      </span>
      <span className="font-display text-headline-medium font-semibold tracking-tight">{link.title}</span>
    </Link>
  );
}

/*
 * Section headings carry a CSS-counter index (01, 02…) on a hairline rule, the
 * same numbering "On this page" shows. The number is a pseudo-element, so it
 * stays out of the heading's text, the search index and the Markdown copy.
 */
export function H2({ children }: { children: string }) {
  const id = slug(children);
  return (
    <h2
      id={id}
      className={cn(
        "group mt-12 scroll-mt-24 border-t border-outline-variant/60 pt-4 font-display text-headline-medium font-semibold tracking-tight text-on-surface",
        "[counter-increment:section] before:mb-3 before:block before:font-mono before:text-[11px] before:font-normal before:tracking-[0.12em] before:text-on-surface-variant before:content-[counter(section,decimal-leading-zero)]",
      )}
    >
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
    <h3 id={slug(children)} className="mt-6 scroll-mt-24 font-display text-title-large font-semibold tracking-tight text-on-surface">
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
    <div className="max-w-full overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left text-body-medium">
        <thead className={cn(spec, "border-b border-outline-variant text-on-surface-variant")}>
          <tr>
            <th scope="col" className="py-2.5 pr-4 font-normal">Prop</th>
            <th scope="col" className="py-2.5 pr-4 font-normal">Type</th>
            <th scope="col" className="py-2.5 pr-4 font-normal">Default</th>
            <th scope="col" className="py-2.5 font-normal">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-outline-variant/60 align-top">
              <td className="py-3 pr-4 font-mono text-[13px] font-medium text-primary">{row.name}</td>
              <td className="py-3 pr-4 font-mono text-[12px] text-on-surface">{row.type}</td>
              <td className="py-3 pr-4 font-mono text-[12px] text-on-surface-variant">{row.default ?? "—"}</td>
              <td className="py-3 text-on-surface-variant">{rich(row.description)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Live example, on a flat tonal tile like the landing page's bench. */
export function Preview({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-md-skip="" className={cn("relative rounded-shape-extra-large bg-surface-container-low px-6 pt-14 pb-8 sm:px-10 sm:pb-10", className)}>
      <span aria-hidden="true" className={cn(spec, "absolute top-5 left-6 flex items-center gap-2 text-on-surface-variant sm:left-10")}>
        <span className="size-1.5 rounded-full bg-primary" />
        live
      </span>
      {children}
    </div>
  );
}

/** A grid of flat link tiles: index number, title, one line of description. */
export function LinkTiles({ items }: { items: { href: string; title: string; description: string }[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="state-layer focus-ring flex h-full flex-col gap-6 rounded-shape-extra-large bg-surface-container-low p-5"
          >
            <span className={cn(spec, "text-on-surface-variant tabular-nums")}>{pad(pageNumber(item.href))}</span>
            <span className="flex flex-col gap-1">
              <span className="font-display text-title-large font-semibold tracking-tight text-on-surface">{item.title}</span>
              <span className="text-body-medium text-on-surface-variant">{item.description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
