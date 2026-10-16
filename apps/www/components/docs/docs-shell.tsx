"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { IconButton } from "@/registry/components/icon-button";
import { SiteHeader } from "@/components/site-header";
import { DocsSidebar } from "@/components/docs/sidebar";
import { Icon } from "@/components/icons";

/* Docs frame: header, sticky sidebar on large screens, a drawer on small ones. */
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
      <SiteHeader menu={menu} />
      <div className="mx-auto flex max-w-7xl gap-10 px-4 pt-10 lg:px-6">
        <aside className="sticky top-24 hidden h-[calc(100dvh-7rem)] w-60 shrink-0 overflow-y-auto pb-10 lg:block">
          <DocsSidebar />
        </aside>
        <main id="content" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </>
  );
}
