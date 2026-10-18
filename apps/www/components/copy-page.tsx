"use client";

import * as React from "react";
import { Button } from "@/registry/components/button";
import { Icon } from "@/components/icons";

/** Copies the page's Markdown copy (written at build time) for pasting into an AI chat or notes. */
export function CopyPage({ href }: { href: string }) {
  const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle");
  const copy = async () => {
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error(String(response.status));
      await navigator.clipboard.writeText(await response.text());
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 1800);
  };
  return (
    <Button variant="text" size="xs" icon={<Icon name={state === "copied" ? "check" : "copy"} />} onClick={copy} aria-live="polite">
      {state === "copied" ? "Copied" : state === "failed" ? "Not available" : "Copy as Markdown"}
    </Button>
  );
}
