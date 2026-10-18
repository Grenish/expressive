// Runs after `next build`. Reads the prerendered pages and writes, into public/:
//   pagefind/        the client-side search index
//   <page>.md        a Markdown copy of every page (/docs/color.md, /index.md, …)
//   llms.txt         an llmstxt.org index of the docs, linking the Markdown copies
//   llms-full.txt    every page's Markdown in one file
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";
import * as pagefind from "pagefind";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const SITE = "https://expressive.grenishrai.pro";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const server = join(root, ".next/server");
const pub = join(root, "public");

const fail = (message) => {
  console.error(`postbuild: ${message}`);
  process.exit(1);
};

// Prerendered output, keyed by route file ("docs/color.html", "sitemap.xml.body"). Next writes it to
// .next/server/app/<route>, or, when a deployment adapter is loaded (Vercel's is), to
// .next/server/route-cache/<kind>/<hash>/$/<route>. Index both so the script works locally and on Vercel.
const prerendered = new Map();
for (const dir of ["app", "route-cache"]) {
  const base = join(server, dir);
  for (const file of await readdir(base, { recursive: true }).catch(() => [])) {
    if (!/\.(html|body)$/.test(file)) continue;
    const route = dir === "app" ? file : file.split(`${sep}$${sep}`)[1];
    if (route) prerendered.set(route.split(sep).join("/"), join(base, file));
  }
}
const builtFile = (route) => prerendered.get(route) ?? join(server, "app", route);

// Pages in navigation order, from the generated sitemap.
const sitemap = await readFile(builtFile("sitemap.xml.body"), "utf8").catch(() => fail("sitemap.xml not found; run next build first"));
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const htmlFile = (path) => builtFile(path === "/" ? "index.html" : `${path.slice(1)}.html`);
const mdPath = (path) => (path === "/" ? "/index.md" : `${path}.md`);

const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-", emDelimiter: "*" });
turndown.use(gfm);
turndown.addRule("fencedWithLanguage", {
  filter: (node) => node.nodeName === "PRE" && node.getAttribute("data-lang") !== null,
  replacement: (_content, node) => `\n\n\`\`\`${node.getAttribute("data-lang")}\n${node.textContent.replace(/\n$/, "")}\n\`\`\`\n\n`,
});

const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The page's main content as Markdown, plus what llms.txt needs. */
function convert(path, html) {
  // Parse <pre> contents as elements (node-html-parser keeps them as raw text by default) so code text can be extracted.
  const doc = parse(html, { blockTextElements: { script: true, noscript: true, style: true } });
  const title = doc.querySelector("title")?.text.trim() ?? "";
  const description = doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
  const body = doc.querySelector("[data-pagefind-body]");
  if (!body) fail(`no [data-pagefind-body] on ${path}`);
  const section = (body.getAttribute("data-pagefind-filter") ?? "").replace(/^section:/, "") || undefined;
  const heading = body.querySelector("h1")?.text.trim() ?? title;

  for (const el of body.querySelectorAll("[data-md-skip], script, style, svg, button")) el.remove();
  // Package-manager tabs: keep the npm command only.
  for (const figure of body.querySelectorAll("[data-command-tabs]")) {
    const code = figure.querySelector('[data-manager="npm"]')?.text ?? "";
    figure.replaceWith(`<pre data-lang="bash">${escapeHtml(code.trim())}</pre>`);
  }
  // Highlighted code: one fenced block, with its file name above it.
  for (const figure of body.querySelectorAll("figure[data-lang]")) {
    const caption = figure.querySelector("[data-code-title]")?.text.trim();
    const code = figure.querySelector("pre")?.text ?? figure.text;
    figure.replaceWith(`${caption ? `<p><code>${escapeHtml(caption)}</code></p>` : ""}<pre data-lang="${figure.getAttribute("data-lang")}">${escapeHtml(code.replace(/\n$/, ""))}</pre>`);
  }
  // Headings link to themselves on the site; in Markdown they're plain text.
  for (const link of body.querySelectorAll("h1 a, h2 a, h3 a, h4 a")) link.replaceWith(escapeHtml(link.text));
  // Absolute links, so the copy works anywhere.
  for (const link of body.querySelectorAll("a[href^='/']")) link.setAttribute("href", SITE + link.getAttribute("href"));

  let markdown = turndown.turndown(body.innerHTML).replace(/\n{3,}/g, "\n\n").trim();
  // One H1 per copy: add the page title only if the content has none, then cite the source under it.
  if (!/^# /m.test(markdown)) markdown = `# ${heading}\n\n${markdown}`;
  markdown = markdown.replace(/^(# .+)$/m, `$1\n\nSource: ${SITE}${path === "/" ? "/" : path}`);
  return { path, title, heading, description, section, html, markdown: `${markdown}\n` };
}

const pages = [];
for (const path of paths) {
  const html = await readFile(htmlFile(path), "utf8").catch(() => fail(`missing prerendered page for ${path}`));
  pages.push(convert(path, html));
}

// --- Search index -------------------------------------------------------------
await rm(join(pub, "pagefind"), { recursive: true, force: true });
const { index, errors } = await pagefind.createIndex({});
if (!index) fail(`pagefind: ${errors.join(", ")}`);
for (const page of pages) {
  const result = await index.addHTMLFile({ url: page.path, content: page.html });
  if (result.errors.length) fail(`pagefind on ${page.path}: ${result.errors.join(", ")}`);
}
const written = await index.writeFiles({ outputPath: join(pub, "pagefind") });
if (written.errors.length) fail(`pagefind write: ${written.errors.join(", ")}`);
await pagefind.close();

// --- Markdown copies ----------------------------------------------------------
await rm(join(pub, "docs"), { recursive: true, force: true });
for (const page of pages) {
  const file = join(pub, mdPath(page.path).slice(1));
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page.markdown);
}

// --- llms.txt -----------------------------------------------------------------
const home = pages.find((page) => page.path === "/");
const link = (page) => `- [${page.heading}](${SITE}${mdPath(page.path)}): ${page.description}`;
const sections = [];
for (const page of pages.filter((p) => p.section)) {
  let group = sections.find((s) => s.title === page.section);
  if (!group) sections.push((group = { title: page.section, pages: [] }));
  group.pages.push(page);
}
const isComponent = (title) => !["Getting started", "Foundations"].includes(title);
const llms = [
  "# Expressive",
  "",
  `> ${home?.description ?? ""}`,
  "",
  "Expressive is a source-first design system: the CLI (`npx @grenishrai/expressive`) copies Material 3 Expressive components, tokens and the motion layer into a React 19 + Tailwind CSS v4 project, where you own the code. Commands in these docs use npx; `pnpm dlx`, `yarn dlx` and `bunx` work the same.",
  "",
  ...sections.flatMap((s) => [`## ${isComponent(s.title) ? `Components: ${s.title}` : s.title}`, "", ...s.pages.map(link), ""]),
  "## Optional",
  "",
  `- [Overview](${SITE}/index.md): the landing page, with the FAQ`,
  `- [Full documentation](${SITE}/llms-full.txt): every page above in one file`,
  `- [Component registry](${SITE}/r/index.json): machine-readable component index the CLI installs from`,
  "- [Source code](https://github.com/Grenish/expressive): MIT-licensed repository",
  "- [npm package](https://www.npmjs.com/package/@grenishrai/expressive): the CLI",
  "",
].join("\n");
await writeFile(join(pub, "llms.txt"), llms);
// The full file leaves out each component's source listing (it's in the per-page copy and the registry) to stay readable.
const withoutSource = (page) => {
  const [docs] = page.markdown.split(/\n## Source\n/);
  return docs.length < page.markdown.length ? `${docs.trim()}\n\nFull source: ${SITE}${mdPath(page.path)}` : page.markdown.trim();
};
await writeFile(join(pub, "llms-full.txt"), `${pages.map(withoutSource).join("\n\n---\n\n")}\n`);

console.log(`postbuild: indexed ${pages.length} pages; wrote ${pages.length} Markdown copies, llms.txt and llms-full.txt (${relative(root, pub)}/)`);
