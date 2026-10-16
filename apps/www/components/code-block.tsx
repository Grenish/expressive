"use client";

import * as React from "react";
import { IconButton } from "@/registry/components/icon-button";
import { Icon } from "@/components/icons";

export function CodeBlock({
  code,
  className = "",
}: {
  code: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div
      className={`relative rounded-shape-large bg-surface-container-highest text-on-surface ${className}`}
    >
      <pre className="overflow-x-auto p-4 pr-14 font-mono text-[13px] leading-6">
        <code>{code}</code>
      </pre>
      <IconButton
        aria-label={copied ? "Copied" : "Copy code"}
        size="xs"
        className="absolute top-2.5 right-2.5"
        onClick={copy}
      >
        <Icon name={copied ? "check" : "copy"} />
      </IconButton>
    </div>
  );
}
