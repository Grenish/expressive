"use client";

import * as React from "react";
import { Tabs } from "@base-ui/react/tabs";
import { cn } from "@/registry/lib/utils";

/*
 * Code blocks: copyable snippets with a header, icons and line numbers.
 *
 * <CodeBlock> shows one snippet. <CodeTabs> shows several behind tabs: one
 * command per package manager, or the files of an example. Blocks that share a
 * `syncKey` switch together and remember the choice (pick pnpm once and every
 * install command on the page follows).
 *
 * Neither bundles a syntax highlighter: pass plain `code`, or `html` from one
 * you already use, such as Shiki on the server:
 *
 *   const html = await codeToHtml(code, { lang: "tsx", theme: "github-dark" });
 *   <CodeBlock code={code} html={html} title="button.tsx" language="tsx" />
 *
 * `code` is still required with `html`: it's what the copy button copies.
 */

/* ------------------------------------------------------------------ icons */

const shells = new Set(["bash", "sh", "shell", "zsh", "fish", "console", "terminal", "powershell", "ps1", "cmd"]);

/** A generic icon for a language: terminal, braces, document or code brackets. */
export function CodeLanguageIcon({ language, className }: { language?: string; className?: string }) {
  const lang = language?.toLowerCase() ?? "";
  const props = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, className: cn("size-4.5 shrink-0", className) } as const;
  if (shells.has(lang)) {
    return (
      <svg {...props}>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="m7 9 3 3-3 3M13 15h4" />
      </svg>
    );
  }
  if (lang === "json" || lang === "jsonc") {
    return (
      <svg {...props}>
        <path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1" />
      </svg>
    );
  }
  if (lang === "md" || lang === "mdx" || lang === "markdown" || lang === "txt" || lang === "text") {
    return (
      <svg {...props}>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
    </svg>
  );
}

/* --------------------------------------------------------------- sync store */

/*
 * Choices shared by every <CodeTabs> with the same syncKey, and remembered in
 * localStorage. Storage can be unavailable (private mode, blocked site data),
 * so every access is guarded.
 */
const syncListeners = new Map<string, Set<() => void>>();
const syncValues = new Map<string, string | null>();

function readSync(key: string): string | null {
  if (!syncValues.has(key)) {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(`expressive:code-tabs:${key}`);
    } catch {}
    syncValues.set(key, stored);
  }
  return syncValues.get(key) ?? null;
}

function writeSync(key: string, value: string) {
  syncValues.set(key, value);
  try {
    localStorage.setItem(`expressive:code-tabs:${key}`, value);
  } catch {}
  for (const listener of syncListeners.get(key) ?? []) listener();
}

function useSyncedValue(key: string | undefined) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (!key) return () => {};
      const listeners = syncListeners.get(key) ?? new Set();
      syncListeners.set(key, listeners);
      listeners.add(onChange);
      // Other tabs and windows.
      const onStorage = (event: StorageEvent) => {
        if (event.key !== `expressive:code-tabs:${key}`) return;
        syncValues.set(key, event.newValue);
        onChange();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(onChange);
        window.removeEventListener("storage", onStorage);
      };
    },
    [key],
  );
  const value = React.useSyncExternalStore(
    subscribe,
    () => (key ? readSync(key) : null),
    () => null,
  );
  return [value, (next: string) => key && writeSync(key, next)] as const;
}

/* ------------------------------------------------------------ shared parts */

interface BodyOptions {
  lineNumbers?: boolean;
  wrap?: boolean;
  maxHeight?: string;
}

function CodeBody({ code, html, lineNumbers, wrap, maxHeight }: BodyOptions & { code: string; html?: string }) {
  const lines = html ? null : code.replace(/\n$/, "").split("\n");
  return (
    <div
      className={cn(
        "overflow-auto text-body-medium [counter-reset:line] focus-ring",
        // Shiki's <pre> brings a background; let the block's surface show.
        "[&_pre]:m-0 [&_pre]:bg-transparent! [&_pre]:p-4 [&_pre]:font-mono [&_code]:font-mono",
        wrap ? "[&_pre]:whitespace-pre-wrap [&_pre]:break-words" : "[&_pre]:w-max [&_pre]:min-w-full",
        lineNumbers &&
          "[&_.line]:before:me-4 [&_.line]:before:inline-block [&_.line]:before:w-6 [&_.line]:before:text-end [&_.line]:before:text-on-surface-variant/60 [&_.line]:before:content-[counter(line)] [&_.line]:before:[counter-increment:line]",
      )}
      style={maxHeight ? { maxHeight } : undefined}
      // A scrollable region must be reachable by keyboard.
      tabIndex={0}
    >
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre>
          <code>
            {lines!.map((line, i) => (
              <React.Fragment key={i}>
                <span className="line">{line}</span>
                {i < lines!.length - 1 ? "\n" : null}
              </React.Fragment>
            ))}
          </code>
        </pre>
      )}
    </div>
  );
}

type CopyLabels = { copy?: string; copied?: string };

function CopyButton({ code, labels, className }: { code: string; labels?: CopyLabels; className?: string }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard can be unavailable (insecure context, permissions); leave the button as is.
    }
  };
  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? (labels?.copied ?? "Copied") : (labels?.copy ?? "Copy code")}
        className={cn("state-layer focus-ring relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-shape-full text-on-surface-variant", className)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={cn("size-4.5 transition-[transform,opacity] spring-spatial-fast", copied && "scale-50 opacity-0")}>
          <path d="M9 18q-.82 0-1.41-.59Q7 16.83 7 16V4q0-.82.59-1.41Q8.18 2 9 2h9q.82 0 1.41.59Q20 3.18 20 4v12q0 .83-.59 1.41Q18.82 18 18 18Zm0-2h9V4H9v12Zm-4 6q-.82 0-1.41-.59Q3 20.83 3 20V6h2v14h11v2Zm4-6V4v12Z" />
        </svg>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={cn("absolute size-4.5 text-primary transition-[transform,opacity] spring-spatial-fast", !copied && "scale-50 opacity-0")}>
          <path d="M9.55 17.65 4.2 12.3l1.43-1.4 3.92 3.92 8.82-8.82 1.43 1.4Z" />
        </svg>
      </button>
      {/* Announce the copy for screen readers. */}
      <span aria-live="polite" className="sr-only">
        {copied ? (labels?.copied ?? "Copied") : ""}
      </span>
    </>
  );
}

const frame = "group/code relative flex flex-col overflow-hidden rounded-shape-large bg-surface-container-high text-on-surface";
const headerBar = "flex min-h-11 items-center gap-2 border-b border-outline-variant ps-3 pe-1.5 text-label-large text-on-surface-variant";

/* --------------------------------------------------------------- CodeBlock */

export interface CodeBlockProps extends Omit<React.ComponentProps<"figure">, "title">, BodyOptions {
  code: string;
  /** Pre-highlighted HTML (a `<pre>`), e.g. Shiki's output. Only pass trusted HTML. */
  html?: string;
  /** File name or caption, shown in the header. */
  title?: React.ReactNode;
  /** Language label in the header, e.g. "tsx". Also picks the default icon. */
  language?: string;
  /** Header icon. Defaults to one for the language; `null` hides it. */
  icon?: React.ReactNode;
  labels?: CopyLabels;
}

export function CodeBlock({ className, code, html, title, language, icon, lineNumbers = false, wrap = false, maxHeight, labels, ...props }: CodeBlockProps) {
  const header = title || language;
  return (
    <figure data-slot="code-block" className={cn(frame, className)} {...props}>
      {header ? (
        <figcaption className={headerBar}>
          {icon !== null && <span className="flex text-on-surface-variant">{icon ?? <CodeLanguageIcon language={language} />}</span>}
          {title && <span className="min-w-0 truncate font-mono text-on-surface">{title}</span>}
          {language && <span className="ms-auto rounded-shape-small bg-surface-container-highest px-2 py-0.5 text-label-small uppercase">{language}</span>}
          <CopyButton code={code} labels={labels} className={language ? "" : "ms-auto"} />
        </figcaption>
      ) : (
        <CopyButton code={code} labels={labels} className="absolute end-1.5 top-2 z-1" />
      )}
      <CodeBody code={code} html={html} lineNumbers={lineNumbers} wrap={wrap} maxHeight={maxHeight} />
    </figure>
  );
}

/* ---------------------------------------------------------------- CodeTabs */

export interface CodeTab {
  /** Unique id; with `syncKey`, tabs with the same value match across blocks (e.g. "pnpm"). */
  value: string;
  /** Tab text, e.g. "pnpm" or "button.tsx". */
  label: React.ReactNode;
  code: string;
  html?: string;
  language?: string;
  /** Tab icon, e.g. a brand logo. Defaults to one for the language; `null` hides it. */
  icon?: React.ReactNode;
}

export interface CodeTabsProps extends Omit<React.ComponentProps<"div">, "defaultValue">, BodyOptions {
  items: CodeTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Blocks with the same key switch together and remember the choice, e.g. "package-manager". */
  syncKey?: string;
  /** Names the tab list, e.g. "Package manager". */
  "aria-label"?: string;
  labels?: CopyLabels;
}

export function CodeTabs({
  className,
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  syncKey,
  lineNumbers = false,
  wrap = false,
  maxHeight,
  labels,
  "aria-label": ariaLabel = "Code",
  ...props
}: CodeTabsProps) {
  const first = items[0]?.value ?? "";
  const [inner, setInner] = React.useState(defaultValue ?? first);
  const [synced, setSynced] = useSyncedValue(syncKey);
  const known = (candidate: string | null | undefined) => (candidate && items.some((item) => item.value === candidate) ? candidate : undefined);
  // Controlled value wins, then the synced choice, then local state.
  const value = known(valueProp) ?? known(synced) ?? known(inner) ?? first;
  const active = items.find((item) => item.value === value) ?? items[0];

  const change = (next: string) => {
    setInner(next);
    setSynced(next);
    onValueChange?.(next);
  };

  return (
    <div data-slot="code-tabs" className={cn(frame, className)} {...props}>
      <Tabs.Root value={value} onValueChange={(next) => change(String(next))}>
        <div className={headerBar}>
          <Tabs.List aria-label={ariaLabel} className="flex min-w-0 flex-1 gap-1 overflow-x-auto py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((item) => (
              <Tabs.Tab
                key={item.value}
                value={item.value}
                className={cn(
                  "state-layer focus-ring inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-shape-full px-3 text-label-large text-on-surface-variant whitespace-nowrap",
                  "transition-[background-color,color] spring-effects-fast",
                  "data-active:bg-secondary-container data-active:text-on-secondary-container",
                )}
              >
                {item.icon !== null && (item.icon ?? <CodeLanguageIcon language={item.language} />)}
                {item.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {active?.language && <span className="rounded-shape-small bg-surface-container-highest px-2 py-0.5 text-label-small uppercase">{active.language}</span>}
          {active && <CopyButton code={active.code} labels={labels} />}
        </div>
        {items.map((item) => (
          <Tabs.Panel key={item.value} value={item.value} className="outline-none">
            <CodeBody code={item.code} html={item.html} lineNumbers={lineNumbers} wrap={wrap} maxHeight={maxHeight} />
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  );
}
