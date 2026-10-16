import "server-only";
import { type BundledLanguage, type Highlighter, createHighlighter } from "shiki";

let highlighter: Promise<Highlighter> | undefined;

/** Build-time syntax highlighting with light + dark themes (no client JS). */
export async function highlight(code: string, lang: BundledLanguage = "tsx") {
  highlighter ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: ["tsx", "ts", "bash", "css", "json"],
  });
  return (await highlighter).codeToHtml(code.trimEnd(), {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: "light",
  });
}
