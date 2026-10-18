import type { Metadata } from "next";
import { docsNav } from "@/lib/docs-nav";
import { SITE_SEED } from "@/lib/brand";
import { GITHUB_URL, NPM_URL, SITE_URL } from "@/lib/links";
import { groups, titles } from "@/lib/site";

/*
 * Single source of truth for search and social metadata: titles,
 * descriptions, canonical URLs, Open Graph cards, structured data, the
 * sitemap, llms.txt and the search index all read from here.
 */

export const SITE = {
  url: SITE_URL,
  name: "Expressive",
  description:
    "Material 3 Expressive for React and Tailwind CSS v4. Copy-paste components, seed-based color, spring motion and 35 morphing shapes. Free and open source.",
  author: { name: "Grenish Rai", url: "https://github.com/Grenish" },
  github: GITHUB_URL,
  npm: NPM_URL,
  locale: "en_US",
} as const;

export const TITLE_SUFFIX = " · Expressive";

/** Seed colors for each page's Open Graph card (one hue per section, so the set reads as a family). */
export const OG_SEEDS = {
  signature: SITE_SEED,
  amber: "#B5770D",
  rose: "#B4246E",
  coral: "#C2521C",
  blue: "#1A5FD0",
  green: "#3B7D2E",
} as const;
type Seed = keyof typeof OG_SEEDS;

export type OgArt =
  | "home"
  | "intro"
  | "install"
  | "cli"
  | "theming"
  | "color"
  | "typography"
  | "shape"
  | "motion"
  | "elevation"
  | "interaction"
  | "accessibility"
  | { component: string };

export interface PageSeo {
  path: string;
  /** Title without the site suffix (the home page's is absolute). */
  title: string;
  /** Short name for breadcrumbs and cards. */
  name: string;
  description: string;
  /** Docs section the page belongs to (from the docs navigation). */
  section?: string;
  /** `subtitle` overrides the card line derived from the description. */
  og: { seed: Seed; art: OgArt; eyebrow: string; headline: string; subtitle?: string; command?: string };
}

const docs: Array<Omit<PageSeo, "section">> = [
  {
    path: "/docs",
    name: "Introduction",
    title: "Introduction: Material 3 Expressive for React",
    description:
      "What Expressive is: Material 3 Expressive's color, type, shape and motion for React and Tailwind CSS, as source code you copy into your app and own.",
    og: { seed: "signature", art: "intro", eyebrow: "Documentation", headline: "Material 3 Expressive, for React", subtitle: "Color, type, shape and motion for React and Tailwind CSS, as code you own." },
  },
  {
    path: "/docs/installation",
    name: "Installation",
    title: "Install Material 3 Expressive in React",
    description:
      "Set up Expressive in Next.js, Vite, React Router, TanStack Start or Astro with Tailwind CSS v4. One command with npm, pnpm, Yarn or Bun, then add components.",
    og: { seed: "amber", art: "install", eyebrow: "Getting started", headline: "Installation", command: "npx @grenishrai/expressive init" },
  },
  {
    path: "/docs/cli",
    name: "CLI",
    title: "Expressive CLI: init, add, theme and diff",
    description:
      "Reference for the Expressive CLI: set up tokens, copy Material 3 Expressive components into your project, regenerate your theme and diff your copies.",
    og: { seed: "amber", art: "cli", eyebrow: "Getting started", headline: "The Expressive CLI", command: "npx @grenishrai/expressive add button" },
  },
  {
    path: "/docs/theming",
    name: "Theming",
    title: "Theming with Material 3 design tokens",
    description:
      "Combine color, type, shape, motion and elevation tokens into one theme. Expressive outputs CSS variables for Tailwind CSS v4 that every component reads.",
    og: { seed: "rose", art: "theming", eyebrow: "Getting started", headline: "Theming" },
  },
  {
    path: "/docs/color",
    name: "Color",
    title: "Material 3 color scheme from one seed color",
    description:
      "Generate a full Material 3 color scheme from one seed: five tonal palettes, every color role in light and dark, nine scheme variants and adjustable contrast.",
    og: { seed: "signature", art: "color", eyebrow: "Foundations", headline: "Color from one seed" },
  },
  {
    path: "/docs/typography",
    name: "Typography",
    title: "Material 3 type scale for React and Tailwind",
    description:
      "Fifteen Material 3 type roles with emphasized variants, as Tailwind CSS utilities. Works with any font, including variable fonts like Roboto Flex.",
    og: { seed: "rose", art: "typography", eyebrow: "Foundations", headline: "Typography" },
  },
  {
    path: "/docs/shape",
    name: "Shape",
    title: "Material 3 Expressive shapes and corner tokens",
    description:
      "All 35 Material 3 Expressive shapes as SVG, a corner scale from none to full, and corners that morph on press. Use them as masks, icons or components.",
    og: { seed: "coral", art: "shape", eyebrow: "Foundations", headline: "Shape", subtitle: "35 shapes that morph into each other, plus a corner scale from none to full." },
  },
  {
    path: "/docs/motion",
    name: "Motion",
    title: "Material 3 Expressive motion and spring physics",
    description:
      "Spring-based motion tokens from M3 Expressive: expressive, standard and fluid schemes, running on CSS, Motion or GSAP, with reduced motion built in.",
    og: { seed: "blue", art: "motion", eyebrow: "Foundations", headline: "Motion that springs" },
  },
  {
    path: "/docs/elevation",
    name: "Elevation",
    title: "Material 3 elevation levels and tonal surfaces",
    description:
      "Six Material 3 elevation levels where depth comes from tonal surface colors first and shadows second, available as design tokens and Tailwind utilities.",
    og: { seed: "green", art: "elevation", eyebrow: "Foundations", headline: "Elevation", subtitle: "Six levels of depth: tonal surfaces first, shadows second." },
  },
  {
    path: "/docs/interaction",
    name: "Interaction",
    title: "Material 3 state layers, ripple and focus rings",
    description:
      "Hover, focus, press and drag states from one set of Material 3 interaction tokens: state layers, pointer ripples and accessible focus rings for React.",
    og: { seed: "blue", art: "interaction", eyebrow: "Foundations", headline: "Interaction" },
  },
  {
    path: "/docs/accessibility",
    name: "Accessibility",
    title: "Accessible Material 3 components for React",
    description:
      "Keyboard support, screen reader semantics, focus management and reduced motion built into every Expressive component, plus what is still up to you.",
    og: { seed: "blue", art: "accessibility", eyebrow: "Foundations", headline: "Accessibility", subtitle: "Keyboard, screen reader, focus and reduced-motion support in every component." },
  },
];

/** Handwritten so each component page has a unique, specific search snippet. */
const componentDescriptions: Record<string, string> = {
  button:
    "Material 3 Expressive buttons for React: filled, tonal, outlined, text and elevated, with shape morphing on press and toggle mode. Copy it in one command.",
  "icon-button":
    "Material 3 Expressive icon buttons for React in four styles and three widths, with toggle mode and press shape morphing. Built on Base UI and Tailwind CSS v4.",
  fab: "Material 3 Expressive floating action buttons for React in three sizes, plus the extended FAB with a label. Accessible, themed from your seed color.",
  chip: "Material 3 chips for React: assist, suggestion, filter and input chips with selected states, styled with Tailwind CSS v4 and Expressive design tokens.",
  card: "Material 3 cards for React in elevated, filled and outlined styles, optionally interactive with state layers. Source code you copy into your project.",
  dialog:
    "Accessible Material 3 Expressive dialog for React with focus trapping, a scrim and spring enter and exit motion. Built on Base UI; copy it with one command.",
  checkbox:
    "Material 3 Expressive checkbox for React with a springy check mark, indeterminate and error states, and full keyboard support. Built on Base UI.",
  "radio-group":
    "Material 3 radio buttons for React with arrow-key navigation, focus rings and accessible labels, styled with Tailwind CSS v4 and Expressive tokens.",
  slider:
    "Material 3 Expressive slider for React with the new bar handle and single or range values. Keyboard accessible, built on Base UI and Tailwind CSS v4.",
  switch:
    "Material 3 switch for React with the growing handle, optional icons and spring motion. An accessible toggle built on Base UI and Tailwind CSS v4.",
  "text-field":
    "Material 3 text fields for React, filled and outlined, with floating labels, leading and trailing icons, supporting text and error states.",
  "navigation-bar":
    "Material 3 Expressive navigation bar for React: bottom navigation with a springy active indicator, icons, labels and badges. Copy the source in one command.",
  "navigation-rail":
    "Material 3 Expressive navigation rail for React, collapsed or expanded, for tablet and desktop layouts. Accessible and themed from one seed color.",
  "top-app-bar":
    "Material 3 top app bars for React: small, center-aligned, medium and large, tinting on scroll. Built with Tailwind CSS v4 and Expressive design tokens.",
  progress:
    "Material 3 Expressive progress indicators for React: linear, wavy and circular, determinate or indeterminate, with reduced-motion support built in.",
  snackbar:
    "Material 3 snackbar for React with an optional action, shown one at a time through a useSnackbar() hook and announced to screen readers.",
  tooltip:
    "Material 3 plain and rich tooltips for React with hover and keyboard triggers and accessible labels. Built on Base UI, styled by Expressive tokens.",
  shape:
    "All 35 Material 3 Expressive shapes for React: flower, cookies, clovers, bursts and more, as SVG components and masks that morph into each other on springs.",
  loading:
    "Material 3 Expressive loading indicator for React: the shape-morphing loader, plus circular, wavy, spinning-shape, bouncing dots and pulse variants.",
};

/** One short line for each component's social card. */
const componentTaglines: Record<string, string> = {
  button: "Five styles, with shape morphing on press and toggle mode.",
  "icon-button": "Four styles and three widths, with toggle mode.",
  fab: "Three sizes, plus the extended FAB with a label.",
  chip: "Assist, suggestion, filter and input chips.",
  card: "Elevated, filled and outlined cards, optionally interactive.",
  dialog: "Focus trapping, a scrim and spring enter and exit motion.",
  checkbox: "A springy check mark, indeterminate and error states.",
  "radio-group": "Radio buttons with arrow-key navigation.",
  slider: "The new bar handle, with single or range values.",
  switch: "The growing handle, optional icons and spring motion.",
  "text-field": "Filled and outlined, with floating labels and error states.",
  "navigation-bar": "Bottom navigation with a springy indicator and badges.",
  "navigation-rail": "Collapsed or expanded navigation for larger screens.",
  "top-app-bar": "Small, center-aligned, medium and large, tinting on scroll.",
  progress: "Linear, wavy and circular; determinate or indeterminate.",
  snackbar: "One-at-a-time messages with an optional action.",
  tooltip: "Plain and rich tooltips with hover and keyboard triggers.",
  shape: "All 35 Material 3 Expressive shapes, morphing on springs.",
  loading: "The shape-morphing loader, plus five more variants.",
};

const groupSeeds: Record<string, Seed> = {
  Actions: "signature",
  "Selection & input": "blue",
  Navigation: "blue",
  Containment: "coral",
  Communication: "green",
};

function componentTitle(name: string) {
  const full = `${name}: Material 3 Expressive React component`;
  return full.length + TITLE_SUFFIX.length <= 60 ? full : `${name}: M3 Expressive React component`;
}

const componentPages: Array<Omit<PageSeo, "section">> = groups.flatMap((group) =>
  group.items.map((slug) => {
    const name = titles[slug] ?? slug;
    return {
      path: `/docs/components/${slug}`,
      name,
      title: componentTitle(name),
      description: componentDescriptions[slug] ?? "",
      og: {
        seed: groupSeeds[group.title] ?? "signature",
        art: { component: slug },
        eyebrow: `Component · ${group.title}`,
        headline: name,
        subtitle: componentTaglines[slug],
        command: `npx @grenishrai/expressive add ${slug}`,
      },
    };
  }),
);

const sectionOf = (path: string) => docsNav.find((section) => section.links.some((link) => link.href === path))?.title;

export const PAGES: Record<string, PageSeo> = Object.fromEntries(
  [
    {
      path: "/",
      name: "Expressive",
      title: "Expressive: Material 3 Expressive components for React",
      description: SITE.description,
      og: { seed: "signature", art: "home", eyebrow: "Material 3 Expressive for React", headline: "One color. A whole design system." },
    } satisfies PageSeo,
    ...docs,
    ...componentPages,
  ].map((page) => [page.path, { ...page, section: page.path === "/" ? undefined : sectionOf(page.path) }]),
);

/** Every indexable path, in navigation order. */
export const PATHS = ["/", ...docsNav.flatMap((section) => section.links.map((link) => link.href))];

/** Absolute URL; the root has no trailing slash, matching the canonical Next.js emits. */
export const absoluteUrl = (path: string) => (path === "/" ? SITE.url : new URL(path, SITE.url).toString());

/** Where the Markdown copy of a page is published (written by scripts/postbuild.mjs). */
export const markdownPath = (path: string) => (path === "/" ? "/index.md" : `${path}.md`);

export function fullTitle(page: PageSeo) {
  return page.path === "/" ? page.title : page.title + TITLE_SUFFIX;
}

export function getPage(path: string) {
  const page = PAGES[path];
  if (!page) throw new Error(`No SEO entry for ${path}`);
  return page;
}

/** Complete metadata for a page: title, description, canonical URL, social cards and its Markdown alternate. */
export function pageMetadata(path: string): Metadata {
  const page = getPage(path);
  const title = fullTitle(page);
  return {
    title: path === "/" ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: { canonical: path, types: { "text/markdown": markdownPath(path) } },
    openGraph: {
      type: path === "/" ? "website" : "article",
      url: path,
      title,
      description: page.description,
      siteName: SITE.name,
      locale: SITE.locale,
    },
    twitter: { card: "summary_large_image", title, description: page.description },
  };
}

// --- Structured data (schema.org JSON-LD) -------------------------------------

const person = { "@type": "Person", name: SITE.author.name, url: SITE.author.url } as const;
const WEBSITE_ID = `${SITE.url}/#website`;

/** URL of a page's generated Open Graph card. */
export const ogImagePath = (path: string) => (path === "/" ? "/opengraph-image" : `${path}/opengraph-image`);

/** Visible and structured breadcrumb trail: Docs, then the page (the home page has none). */
export function breadcrumbs(path: string): Array<{ name: string; path: string }> {
  if (path === "/") return [];
  const trail = [{ name: "Docs", path: "/docs" }];
  if (path !== "/docs") trail.push({ name: getPage(path).name, path });
  return trail;
}

export function siteJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      inLanguage: "en",
      publisher: person,
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: "Expressive",
      description: SITE.description,
      url: SITE.url,
      codeRepository: SITE.github,
      programmingLanguage: ["TypeScript", "React"],
      runtimePlatform: "React 19",
      license: "https://opensource.org/licenses/MIT",
      author: person,
      keywords: ["Material 3 Expressive", "React", "Tailwind CSS", "design system", "components", "Base UI"],
    },
  ];
}

export function pageJsonLd(path: string) {
  const page = getPage(path);
  const items = [{ name: SITE.name, path: "/" }, ...breadcrumbs(path)];
  return [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: page.title,
      description: page.description,
      url: absoluteUrl(path),
      mainEntityOfPage: absoluteUrl(path),
      image: absoluteUrl(ogImagePath(path)),
      inLanguage: "en",
      author: person,
      publisher: person,
      isPartOf: { "@id": WEBSITE_ID },
      ...(page.section ? { articleSection: page.section } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
    },
  ];
}

export function faqJsonLd(faq: ReadonlyArray<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}
