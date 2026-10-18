"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { IconButton } from "@/registry/components/icon-button";
import { Icon } from "@/components/icons";
import { cn } from "@/registry/lib/utils";

/*
 * Docs search, powered by Pagefind. The index is written to /pagefind by
 * scripts/postbuild.mjs after `next build` and loaded lazily on first open, so
 * search costs nothing until someone uses it. In `next dev` there is no index.
 */

interface PagefindHit {
  url: string;
  meta: { title?: string };
  excerpt: string;
  filters?: { section?: string[] };
  sub_results?: Array<{ title: string; url: string; excerpt: string }>;
}
interface Pagefind {
  search: (query: string) => Promise<{ results: Array<{ id: string; data: () => Promise<PagefindHit> }> } | null>;
  options?: (options: Record<string, unknown>) => Promise<void>;
  init?: () => Promise<void>;
}

let loader: Promise<Pagefind | null> | undefined;
function loadPagefind() {
  const url = "/pagefind/pagefind.js";
  loader ??= import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url)
    .then(async (module: Pagefind) => {
      await module.options?.({ excerptLength: 20 });
      await module.init?.();
      return module;
    })
    .catch(() => null);
  return loader;
}

interface Option {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  section?: string;
  sub?: boolean;
}

const SUGGESTIONS = [
  { title: "Installation", url: "/docs/installation" },
  { title: "Color", url: "/docs/color" },
  { title: "Motion", url: "/docs/motion" },
  { title: "Button", url: "/docs/components/button" },
  { title: "Loading", url: "/docs/components/loading" },
];

export function Search() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [options, setOptions] = React.useState<Option[]>([]);
  const [active, setActive] = React.useState(0);
  const [status, setStatus] = React.useState<"idle" | "loading" | "ready" | "unavailable">("idle");
  const [mac, setMac] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);
  const list = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  // ⌘K / Ctrl+K anywhere; "/" when not typing.
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "");
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        setOpen((value) => !value || event.key === "/");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (!open || status !== "idle") return;
    setStatus("loading");
    loadPagefind().then((pagefind) => setStatus(pagefind ? "ready" : "unavailable"));
  }, [open, status]);

  React.useEffect(() => {
    if (status !== "ready") return;
    const term = query.trim();
    if (!term) {
      setOptions([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      const pagefind = await loadPagefind();
      const found = await pagefind?.search(term);
      const hits = await Promise.all((found?.results ?? []).slice(0, 8).map((result) => result.data()));
      if (cancelled) return;
      setOptions(
        hits.flatMap((hit, i) => [
          { id: `r${i}`, url: hit.url, title: hit.meta.title ?? hit.url, excerpt: hit.excerpt, section: hit.filters?.section?.[0] },
          ...(hit.sub_results ?? [])
            .filter((sub) => sub.url !== hit.url && sub.title !== hit.meta.title)
            .slice(0, 3)
            .map((sub, j) => ({ id: `r${i}-${j}`, url: sub.url, title: sub.title, excerpt: sub.excerpt, sub: true })),
        ]),
      );
      setActive(0);
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, status]);

  React.useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const count = query.trim() ? options.length : SUGGESTIONS.length;
    if (!count) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index + (event.key === "ArrowDown" ? 1 : -1) + count) % count);
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(query.trim() ? options[active]!.url : SUGGESTIONS[active]!.url);
    }
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
      setOptions([]);
      setActive(0);
    }
  };

  const showing = query.trim() ? options : [];
  const activeId = query.trim() ? showing[active]?.id : `s${active}`;

  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Trigger
        render={
          <button
            type="button"
            className="state-layer focus-ring hidden h-10 w-56 cursor-pointer items-center gap-2 rounded-shape-full bg-surface-container-high pr-2 pl-3.5 text-left text-body-medium text-on-surface-variant lg:flex"
          />
        }
      >
        <Icon name="search" className="size-5 shrink-0" />
        <span className="flex-1">Search docs</span>
        <kbd className="rounded-shape-small bg-surface-container-highest px-1.5 py-0.5 font-mono text-[11px] text-on-surface-variant">{mac ? "⌘K" : "Ctrl K"}</kbd>
      </BaseDialog.Trigger>
      <BaseDialog.Trigger render={<IconButton aria-label="Search docs" className="lg:hidden" />}>
        <Icon name="search" />
      </BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-scrim/32 transition-opacity spring-effects-default data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <BaseDialog.Popup
          initialFocus={input}
          className="fixed top-[max(1rem,10vh)] left-1/2 z-50 flex max-h-[min(36rem,80vh)] w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 flex-col overflow-hidden rounded-shape-extra-large bg-surface-container-high shadow-elevation-3 transition-[opacity,scale] spring-spatial-fast data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0"
        >
          <BaseDialog.Title className="sr-only">Search the documentation</BaseDialog.Title>
          <div className="flex items-center gap-3 border-b border-outline-variant/60 px-5">
            <Icon name="search" className="size-6 shrink-0 text-on-surface-variant" />
            <input
              ref={input}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search components, tokens, guides…"
              aria-label="Search the documentation"
              role="combobox"
              aria-expanded="true"
              aria-controls="search-results"
              aria-activedescendant={activeId}
              aria-autocomplete="list"
              autoComplete="off"
              spellCheck={false}
              className="h-16 min-w-0 flex-1 bg-transparent text-body-large text-on-surface outline-none placeholder:text-on-surface-variant"
            />
            <kbd className="rounded-shape-small bg-surface-container-highest px-1.5 py-0.5 font-mono text-[11px] text-on-surface-variant">Esc</kbd>
          </div>
          <ul ref={list} id="search-results" role="listbox" aria-label="Results" className="flex-1 overflow-y-auto p-2">
            {!query.trim() &&
              SUGGESTIONS.map((item, i) => (
                <li key={item.url} id={`s${i}`} role="option" aria-selected={active === i} data-index={i}>
                  <a
                    href={item.url}
                    onClick={(event) => {
                      event.preventDefault();
                      go(item.url);
                    }}
                    onMouseMove={() => setActive(i)}
                    className={cn("flex items-center gap-3 rounded-shape-large px-3 py-2.5 text-body-large text-on-surface", active === i && "bg-secondary-container text-on-secondary-container")}
                  >
                    <Icon name="arrow" className="size-4 opacity-60" />
                    {item.title}
                  </a>
                </li>
              ))}
            {showing.map((option, i) => (
              <li key={option.id} id={option.id} role="option" aria-selected={active === i} data-index={i}>
                <a
                  href={option.url}
                  onClick={(event) => {
                    event.preventDefault();
                    go(option.url);
                  }}
                  onMouseMove={() => setActive(i)}
                  className={cn(
                    "flex flex-col gap-0.5 rounded-shape-large px-3 py-2.5",
                    option.sub && "ml-6 border-l-2 border-outline-variant pl-4",
                    active === i && "bg-secondary-container",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("text-title-medium", active === i ? "text-on-secondary-container" : "text-on-surface")}>{option.title}</span>
                    {option.section && <span className="text-label-medium text-primary">{option.section}</span>}
                  </span>
                  <span
                    className="line-clamp-2 text-body-medium text-on-surface-variant [&_mark]:rounded-[3px] [&_mark]:bg-tertiary-container [&_mark]:px-0.5 [&_mark]:text-on-tertiary-container"
                    // Pagefind escapes the excerpt and only adds <mark> highlights.
                    dangerouslySetInnerHTML={{ __html: option.excerpt }}
                  />
                </a>
              </li>
            ))}
          </ul>
          <p role="status" className="px-5 pb-4 text-body-small text-on-surface-variant empty:hidden">
            {status === "unavailable"
              ? "Search needs the production index. Run pnpm build, then start the site."
              : status === "loading"
                ? "Loading search…"
                : query.trim() && status === "ready" && !options.length
                  ? `No results for “${query.trim()}”.`
                  : ""}
          </p>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
