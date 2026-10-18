import type { BundledLanguage } from "shiki";
import { highlight } from "@/lib/highlight";
import { CopyButton } from "@/components/copy-button";

interface CodeProps {
  code: string;
  lang?: BundledLanguage;
  /** File name or label shown above the code. */
  title?: string;
  className?: string;
  /** Cap the height and scroll (for long sources). */
  scroll?: boolean;
}

export async function Code({ code, lang = "tsx", title, className = "", scroll = false }: CodeProps) {
  const html = await highlight(code, lang);
  return (
    <figure data-lang={lang} className={`code-block relative overflow-hidden rounded-shape-large bg-surface-container ${className}`}>
      {title && (
        <figcaption data-code-title="" className="border-b border-outline-variant/60 px-4 py-2 font-mono text-[12px] text-on-surface-variant">{title}</figcaption>
      )}
      <div
        className={`overflow-x-auto p-4 pr-14 font-mono text-[13px] leading-6 ${scroll ? "max-h-[34rem] overflow-y-auto" : ""}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CopyButton value={code.trimEnd()} className={`absolute right-2.5 ${title ? "top-11" : "top-2.5"}`} />
    </figure>
  );
}
