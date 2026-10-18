"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/registry/components/button";
import { IconButton } from "@/registry/components/icon-button";
import { Dialog, DialogActions, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/registry/components/dialog";
import { Tooltip } from "@/registry/components/tooltip";
import { ThemeControls } from "@/components/theme-controls";
import { Icon } from "@/components/icons";
import { Search } from "@/components/search";
import { usePlayground } from "@/lib/playground";
import { cn } from "@/registry/lib/utils";
import { GITHUB_URL } from "@/lib/links";

export { GITHUB_URL };

export function Logo() {
  return (
    <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-shape-medium">
      {/* public/expressive-logo.svg as a mask, so the mark takes the theme's text color. */}
      <span
        aria-hidden="true"
        className="h-6 w-10 bg-on-surface [mask:url(/expressive-logo.svg)_center/contain_no-repeat]"
      />
      <span className="font-display text-title-large font-semibold tracking-tight max-[360px]:sr-only">Expressive</span>
    </Link>
  );
}

export function CustomizeDialog({ children }: { children: React.ReactElement }) {
  return (
    <Dialog>
      <DialogTrigger render={children} />
      <DialogContent className="max-w-md">
        <DialogTitle>Customize theme</DialogTitle>
        <DialogDescription>Every page on this site is built from these settings. Change one and watch it all follow.</DialogDescription>
        <ThemeControls />
        <DialogActions>
          <DialogClose render={<Button variant="text" />}>Done</DialogClose>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export function SiteHeader({ menu }: { menu?: React.ReactNode }) {
  const pathname = usePathname();
  const { state, update } = usePlayground();
  const link = (href: string, label: string, active: boolean) => (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "state-layer focus-ring rounded-shape-full px-3 py-2 text-label-large text-on-surface-variant",
        active && "text-on-surface",
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/50 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 lg:px-6">
        {menu}
        <Logo />
        <nav aria-label="Site" className="ml-4 hidden items-center gap-1 sm:flex">
          {link("/docs", "Docs", pathname.startsWith("/docs") && !pathname.startsWith("/docs/components"))}
          {link("/docs/components/button", "Components", pathname.startsWith("/docs/components"))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Search />
          <CustomizeDialog>
            <Button variant="tonal" size="sm" icon={<Icon name="palette" />} aria-label="Customize theme" className="max-sm:px-2.5">
              <span className="max-sm:sr-only">Customize</span>
            </Button>
          </CustomizeDialog>
          <Tooltip content={state.dark ? "Light theme" : "Dark theme"}>
            <IconButton aria-label="Toggle dark theme" aria-pressed={state.dark} onClick={() => update({ dark: !state.dark })}>
              <Icon name={state.dark ? "sun" : "moon"} />
            </IconButton>
          </Tooltip>
          {/* Hidden on narrow phones so the header fits; GitHub is linked from the landing page and footer too. */}
          <Tooltip content="GitHub">
            <IconButton aria-label="GitHub repository" render={<a href={GITHUB_URL} />} nativeButton={false} className="max-[420px]:hidden">
              <Icon name="github" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
