"use client";

import * as React from "react";
import { IconButton } from "@/registry/components/icon-button";
import { Icon } from "@/components/icons";

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <IconButton aria-label={copied ? "Copied" : "Copy code"} size="xs" className={className} onClick={copy}>
      <Icon name={copied ? "check" : "copy"} />
    </IconButton>
  );
}
