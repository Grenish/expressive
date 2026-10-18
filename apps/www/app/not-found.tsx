import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/registry/components/button";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

/** Branded 404. Next marks it noindex automatically. */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-4 py-24 lg:px-6">
        <p className="text-label-large text-primary">404</p>
        <h1 className="font-display text-display-small font-semibold tracking-tight text-on-surface sm:text-display-medium">
          This page doesn&apos;t exist.
        </h1>
        <p className="max-w-xl text-body-large text-on-surface-variant">
          It may have moved. Try the docs, the installation guide or the component list.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="md" render={<Link href="/docs" />} nativeButton={false}>
            Read the docs
          </Button>
          <Button size="md" variant="tonal" render={<Link href="/docs/installation" />} nativeButton={false}>
            Installation
          </Button>
          <Button size="md" variant="text" render={<Link href="/docs/components/button" />} nativeButton={false}>
            Components
          </Button>
        </div>
      </main>
    </>
  );
}
