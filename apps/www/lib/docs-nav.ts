import { groups, titles } from "@/lib/site";

export interface NavLink {
  title: string;
  href: string;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

export const docsNav: NavSection[] = [
  {
    title: "Getting started",
    links: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "CLI", href: "/docs/cli" },
      { title: "Theming", href: "/docs/theming" },
    ],
  },
  {
    title: "Foundations",
    links: [
      { title: "Color", href: "/docs/color" },
      { title: "Typography", href: "/docs/typography" },
      { title: "Shape", href: "/docs/shape" },
      { title: "Motion", href: "/docs/motion" },
      { title: "Elevation", href: "/docs/elevation" },
      { title: "Interaction", href: "/docs/interaction" },
      { title: "Accessibility", href: "/docs/accessibility" },
    ],
  },
  ...groups.map((group) => ({
    title: group.title,
    links: group.items.map((name) => ({ title: titles[name] ?? name, href: `/docs/components/${name}` })),
  })),
];

const flat = docsNav.flatMap((section) => section.links);

export function neighbours(href: string) {
  const index = flat.findIndex((link) => link.href === href);
  return { prev: index > 0 ? flat[index - 1] : undefined, next: index >= 0 ? flat[index + 1] : undefined };
}
