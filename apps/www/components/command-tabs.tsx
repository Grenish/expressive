"use client";

import * as React from "react";
import { CopyButton } from "@/components/copy-button";
import { LABELS, MANAGERS, type PackageManager, cliCommand } from "@/lib/package-managers";

/*
 * The chosen package manager is shared by every command block on the page and
 * remembered across visits. Storage can be unavailable (private mode, blocked
 * site data), so every access is guarded and npm is the fallback.
 */
const KEY = "expressive:package-manager";
const listeners = new Set<() => void>();
let current: PackageManager | null = null;

function read(): PackageManager {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored && (MANAGERS as string[]).includes(stored)) return stored as PackageManager;
  } catch {}
  return "npm";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    current = read();
    onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function choose(manager: PackageManager) {
  current = manager;
  try {
    localStorage.setItem(KEY, manager);
  } catch {}
  for (const listener of listeners) listener();
}

function usePackageManager() {
  return React.useSyncExternalStore(
    subscribe,
    () => (current ??= read()),
    () => "npm" as const,
  );
}

// Brand marks from Simple Icons (CC0). pnpm and Bun's dark parts follow the text color so they read in dark mode.
function Logo({ manager }: { manager: PackageManager }) {
  const props = { viewBox: "0 0 24 24", className: "size-4 shrink-0", "aria-hidden": true } as const;
  switch (manager) {
    case "npm":
      return (
        <svg {...props}>
          <path
            fill="#CB3837"
            d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"
          />
        </svg>
      );
    case "pnpm":
      return (
        <svg {...props}>
          <path fill="#F9AD00" d="M0 0h7.5v7.5H0zm8.25 0h7.5v7.5h-7.5zm8.25 0H24v7.5h-7.5zm0 8.25H24v7.5h-7.5z" />
          <path fill="currentColor" d="M8.25 8.25h7.5v7.5h-7.5zM0 16.5h7.5V24H0zm8.25 0h7.5V24h-7.5zm8.25 0H24V24h-7.5z" />
        </svg>
      );
    case "yarn":
      return (
        <svg {...props}>
          <path
            fill="#2C8EBB"
            d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm.768 4.105c.183 0 .363.053.525.157.125.083.287.185.755 1.154.31-.088.468-.042.551-.019.204.056.366.19.463.375.477.917.542 2.553.334 3.605-.241 1.232-.755 2.029-1.131 2.576.324.329.778.899 1.117 1.825.278.774.31 1.478.273 2.015a5.51 5.51 0 0 0 .602-.329c.593-.366 1.487-.917 2.553-.931.714-.009 1.269.445 1.353 1.103a1.23 1.23 0 0 1-.945 1.362c-.649.158-.95.278-1.821.843-1.232.797-2.539 1.242-3.012 1.39a1.686 1.686 0 0 1-.704.343c-.737.181-3.266.315-3.466.315h-.046c-.783 0-1.214-.241-1.45-.491-.658.329-1.51.19-2.122-.134a1.078 1.078 0 0 1-.58-1.153 1.243 1.243 0 0 1-.153-.195c-.162-.25-.528-.936-.454-1.946.056-.723.556-1.367.88-1.71a5.522 5.522 0 0 1 .408-2.256c.306-.727.885-1.348 1.32-1.737-.32-.537-.644-1.367-.329-2.21.227-.602.412-.936.82-1.08h-.005c.199-.074.389-.153.486-.259a3.418 3.418 0 0 1 2.298-1.103c.037-.093.079-.185.125-.283.31-.658.639-1.029 1.024-1.168a.94.94 0 0 1 .328-.06zm.006.7c-.507.016-1.001 1.519-1.001 1.519s-1.27-.204-2.266.871c-.199.218-.468.334-.746.44-.079.028-.176.023-.417.672-.371.991.625 2.094.625 2.094s-1.186.839-1.626 1.881c-.486 1.144-.338 2.261-.338 2.261s-.843.732-.899 1.487c-.051.663.139 1.2.343 1.515.227.343.51.176.51.176s-.561.653-.037.931c.477.25 1.283.394 1.71-.037.31-.31.371-1.001.486-1.283.028-.065.12.111.209.199.097.093.264.195.264.195s-.755.324-.445 1.066c.102.246.468.403 1.066.398.222-.005 2.664-.139 3.313-.296.375-.088.505-.283.505-.283s1.566-.431 2.998-1.357c.917-.598 1.293-.76 2.034-.936.612-.148.57-1.098-.241-1.084-.839.009-1.575.44-2.196.825-1.163.718-1.742.672-1.742.672l-.018-.032c-.079-.13.371-1.293-.134-2.678-.547-1.515-1.413-1.881-1.344-1.997.297-.5 1.038-1.297 1.334-2.78.176-.899.13-2.377-.269-3.151-.074-.144-.732.241-.732.241s-.616-1.371-.788-1.483a.271.271 0 0 0-.157-.046z"
          />
        </svg>
      );
    case "bun":
      return (
        <svg {...props}>
          <path
            fill="currentColor"
            d="M12 22.596c6.628 0 12-4.338 12-9.688 0-3.318-2.057-6.248-5.219-7.986-1.286-.715-2.297-1.357-3.139-1.89C14.058 2.025 13.08 1.404 12 1.404c-1.097 0-2.334.785-3.966 1.821a49.92 49.92 0 0 1-2.816 1.697C2.057 6.66 0 9.59 0 12.908c0 5.35 5.372 9.687 12 9.687v.001ZM10.599 4.715c.334-.759.503-1.58.498-2.409 0-.145.202-.187.23-.029.658 2.783-.902 4.162-2.057 4.624-.124.048-.199-.121-.103-.209a5.763 5.763 0 0 0 1.432-1.977Zm2.058-.102a5.82 5.82 0 0 0-.782-2.306v-.016c-.069-.123.086-.263.185-.172 1.962 2.111 1.307 4.067.556 5.051-.082.103-.23-.003-.189-.126a5.85 5.85 0 0 0 .23-2.431Zm1.776-.561a5.727 5.727 0 0 0-1.612-1.806v-.014c-.112-.085-.024-.274.114-.218 2.595 1.087 2.774 3.18 2.459 4.407a.116.116 0 0 1-.049.071.11.11 0 0 1-.153-.026.122.122 0 0 1-.022-.083 5.891 5.891 0 0 0-.737-2.331Zm-5.087.561c-.617.546-1.282.76-2.063 1-.117 0-.195-.078-.156-.181 1.752-.909 2.376-1.649 2.999-2.778 0 0 .155-.118.188.085 0 .304-.349 1.329-.968 1.874Zm4.945 11.237a2.957 2.957 0 0 1-.937 1.553c-.346.346-.8.565-1.286.62a2.178 2.178 0 0 1-1.327-.62 2.955 2.955 0 0 1-.925-1.553.244.244 0 0 1 .064-.198.234.234 0 0 1 .193-.069h3.965a.226.226 0 0 1 .19.07c.05.053.073.125.063.197Zm-5.458-2.176a1.862 1.862 0 0 1-2.384-.245 1.98 1.98 0 0 1-.233-2.447c.207-.319.503-.566.848-.713a1.84 1.84 0 0 1 1.092-.11c.366.075.703.261.967.531a1.98 1.98 0 0 1 .408 2.114 1.931 1.931 0 0 1-.698.869v.001Zm8.495.005a1.86 1.86 0 0 1-2.381-.253 1.964 1.964 0 0 1-.547-1.366c0-.384.11-.76.32-1.079.207-.319.503-.567.849-.713a1.844 1.844 0 0 1 1.093-.108c.367.076.704.262.968.534a1.98 1.98 0 0 1 .4 2.117 1.932 1.932 0 0 1-.702.868Z"
          />
        </svg>
      );
  }
}

/** A one-line command (e.g. in a hero) that follows the visitor's chosen package manager. */
export function CommandPill({ args, className = "" }: { args: string; className?: string }) {
  const manager = usePackageManager();
  return (
    <code className={className}>
      <span className="text-primary">$</span> {cliCommand(manager, args)}
    </code>
  );
}

interface CommandTabsProps {
  /** One pre-highlighted command per package manager (see PackageCommand). */
  items: Array<{ manager: PackageManager; command: string; html: string }>;
  className?: string;
}

/** A CLI command with a tab per package manager. Tabs slide a tonal indicator on Expressive's spatial spring. */
export function CommandTabs({ items, className = "" }: CommandTabsProps) {
  const active = usePackageManager();
  const id = React.useId();
  const listRef = React.useRef<HTMLDivElement>(null);
  const tabs = React.useRef<Partial<Record<PackageManager, HTMLButtonElement | null>>>({});
  const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null);
  // Don't animate the indicator while the stored choice replaces the server default on load.
  const [animate, setAnimate] = React.useState(false);

  const measure = React.useCallback(() => {
    const tab = tabs.current[active];
    if (tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
  }, [active]);

  React.useLayoutEffect(measure, [measure]);
  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [measure]);
  React.useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = items.findIndex((item) => item.manager === active);
    const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: items.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const manager = items[(next + items.length) % items.length]!.manager;
    choose(manager);
    tabs.current[manager]?.focus();
  };

  const command = items.find((item) => item.manager === active)?.command ?? items[0]!.command;

  return (
    <figure data-lang="bash" data-command-tabs="" className={`code-block @container relative overflow-hidden rounded-shape-large bg-surface-container ${className}`}>
      {/* Sized by the block, not the viewport: roomy from 24rem, tight below, logos only under 21rem. */}
      <div data-pagefind-ignore="all" data-md-skip="" className="flex items-center gap-1 border-b border-outline-variant/60 py-1.5 pl-1.5 pr-2 @sm:gap-2 @sm:pr-2.5">
        <div ref={listRef} role="tablist" aria-label="Package manager" className="relative flex items-center gap-0.5" onKeyDown={onKeyDown}>
          {indicator && (
            <span
              aria-hidden
              className={`absolute top-0 h-8 rounded-full bg-secondary-container ${animate ? "transition-[left,width] spring-spatial-default" : ""}`}
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
          {items.map(({ manager }) => {
            const selected = manager === active;
            return (
              <button
                key={manager}
                ref={(el) => {
                  tabs.current[manager] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-${manager}-tab`}
                aria-selected={selected}
                aria-controls={`${id}-${manager}-panel`}
                tabIndex={selected ? 0 : -1}
                title={LABELS[manager]}
                onClick={() => choose(manager)}
                className={`state-layer focus-ring relative inline-flex h-8 cursor-pointer select-none items-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium transition-colors spring-effects-fast @sm:gap-2 @sm:px-3 ${
                  selected ? "text-on-secondary-container" : "text-on-surface-variant hover:text-on-surface"
                } ${selected && !indicator ? "bg-secondary-container" : ""}`}
              >
                <Logo manager={manager} />
                <span className="sr-only @[21rem]:not-sr-only">{LABELS[manager]}</span>
              </button>
            );
          })}
        </div>
        <CopyButton value={command} className="ml-auto" />
      </div>
      {items.map(({ manager, html }) => (
        <div
          key={manager}
          role="tabpanel"
          id={`${id}-${manager}-panel`}
          aria-labelledby={`${id}-${manager}-tab`}
          hidden={manager !== active}
          data-manager={manager}
          // Index and export the npm variant only; the others are the same command.
          data-pagefind-ignore={manager === "npm" ? undefined : "all"}
          className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ))}
    </figure>
  );
}
