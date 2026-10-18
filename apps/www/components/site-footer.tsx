import Link from "next/link";
import { GITHUB_URL, NPM_URL } from "@/lib/links";
import { cn } from "@/registry/lib/utils";

const link = "focus-ring rounded-shape-extra-small hover:text-on-surface";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("flex flex-wrap items-center justify-between gap-4 py-8 text-body-small text-on-surface-variant", className)}>
      <span>Expressive is MIT licensed. Inspired by Material 3 Expressive; not affiliated with Google.</span>
      <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
        <Link className={link} href="/docs">
          Docs
        </Link>
        <Link className={link} href="/docs/components/button">
          Components
        </Link>
        <a className={link} href="/llms.txt">
          llms.txt
        </a>
        <a className={link} href={GITHUB_URL}>
          GitHub
        </a>
        <a className={link} href={NPM_URL}>
          npm
        </a>
      </nav>
    </footer>
  );
}
