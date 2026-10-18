"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { spec } from "@/components/landing/tokens";
import { pad } from "@/lib/docs-nav";
import { cn } from "@/registry/lib/utils";

interface Item {
  id: string;
  text: string;
  level: 2 | 3;
  /** Section number for H2s, matching the counter printed above each H2. */
  number?: number;
}

/** The header offset (sticky header plus breathing room) at which a heading counts as "current". */
const OFFSET = 140;

/*
 * "On this page": built from the article's own H2/H3 headings (they already
 * carry slug ids), with the current section tracked while scrolling.
 */
export function OnThisPage() {
  const pathname = usePathname();
  const [items, setItems] = React.useState<Item[]>([]);
  const [active, setActive] = React.useState<string | null>(null);

  React.useEffect(() => {
    const article = document.querySelector("#content [data-pagefind-body]");
    const headings = article ? [...article.querySelectorAll<HTMLElement>("h2[id], h3[id]")] : [];
    let section = 0;
    setItems(
      headings.map((heading) => {
        const level = heading.tagName === "H3" ? 3 : 2;
        return {
          id: heading.id,
          // H2s end with a hidden "#" anchor glyph.
          text: (heading.textContent ?? "").replace(/#\s*$/, "").trim(),
          level,
          number: level === 2 ? ++section : undefined,
        };
      }),
    );
    if (!headings.length) return;

    let frame = 0;
    const update = () => {
      let current = headings[0]!.id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= OFFSET) current = heading.id;
        else break;
      }
      // At the very bottom, the last section is current even if its heading never reached the offset.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = headings.at(-1)!.id;
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  if (!items.length) return null;

  return (
    <nav aria-label="On this page" className="flex flex-col gap-4">
      <span className={cn(spec, "text-on-surface-variant")}>On this page</span>
      <ul className="flex flex-col border-l border-outline-variant/70">
        {items.map((item) => {
          const current = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "focus-ring -ml-px flex gap-3 rounded-r-shape-small border-l-2 py-1.5 pr-2 text-body-medium transition-colors",
                  item.level === 3 ? "pl-11" : "pl-4",
                  current ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface",
                )}
              >
                {item.number !== undefined && (
                  <span aria-hidden="true" className="w-4 shrink-0 pt-px font-mono text-[11px] tabular-nums opacity-70">
                    {pad(item.number)}
                  </span>
                )}
                <span>{item.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <a href="#" onClick={() => window.scrollTo({ top: 0 })} className={cn(spec, "focus-ring self-start rounded-shape-extra-small text-on-surface-variant hover:text-on-surface")}>
        Back to top ↑
      </a>
    </nav>
  );
}
