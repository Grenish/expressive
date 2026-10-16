"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/lib/docs-nav";
import { cn } from "@/registry/lib/utils";

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Documentation" className="flex flex-col gap-6">
      {docsNav.map((section) => (
        <div key={section.title} className="flex flex-col gap-0.5">
          <span className="px-3 pb-1 text-label-medium text-on-surface-variant">{section.title}</span>
          {section.links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "state-layer focus-ring rounded-shape-full px-3 py-1.5 text-label-large text-on-surface-variant",
                  "aria-[current=page]:bg-secondary-container aria-[current=page]:text-on-secondary-container",
                )}
              >
                {link.title}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
