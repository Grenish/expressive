"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { IconButton } from "@/registry/components/icon-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DocsSidebar } from "@/components/docs/sidebar";
import { OnThisPage } from "@/components/docs/toc";
import { Icon } from "@/components/icons";

/*
 * Docs frame, full width like the landing page: a hairline-ruled navigation
 * rail on the left, a centered reading column, and "On this page" on the right
 * (wide screens). Small screens get the navigation as a drawer.
 */
export function DocsShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const menu = (
    <BaseDialog.Root open={open} onOpenChange={setOpen}>
      <BaseDialog.Trigger render={<IconButton aria-label="Open navigation" className="lg:hidden" />}>
        <Icon name="menu" />
      </BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-scrim/32 transition-opacity spring-effects-default data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <BaseDialog.Popup className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto rounded-r-shape-large bg-surface-container-low p-4 transition-transform spring-spatial-default data-starting-style:-translate-x-full data-ending-style:-translate-x-full">
          <BaseDialog.Title className="sr-only">Documentation</BaseDialog.Title>
          <DocsSidebar onNavigate={() => setOpen(false)} />
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );

  return (
    <>
      <SiteHeader menu={menu} wide />
      <div className="grid lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_16rem]">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-r border-outline-variant/60 py-8 pr-4 pl-12 lg:block">
          <DocsSidebar />
        </aside>
        <main id="content" className="min-w-0 px-4 pt-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-[56rem]">{children}</div>
        </main>
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain py-10 pr-12 pl-2 xl:block">
          <OnThisPage />
        </aside>
      </div>
      <SiteFooter className="border-t border-outline-variant/60 px-4 sm:px-8 lg:px-12" />
    </>
  );
}
