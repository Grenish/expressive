/** Landing page FAQ: shown on the page and published as FAQPage structured data. */
export const FAQ = [
  {
    q: "What is Expressive?",
    a: "A React design system that brings Material 3 Expressive's color, typography, shape and motion to the web. Instead of installing a component library, a CLI copies each component's source into your project, so you can read and change everything.",
  },
  {
    q: "Is Expressive made by Google?",
    a: "No. Expressive is an independent, MIT-licensed project inspired by Google's Material 3 Expressive design language. It is not affiliated with or endorsed by Google.",
  },
  {
    q: "How is it different from a component library?",
    a: "A component library is a dependency you configure from the outside. Expressive works like shadcn/ui: the code lands in components/expressive and lib/expressive, imports are rewritten to your paths, and expressive diff shows how your copy differs from the original.",
  },
  {
    q: "Which frameworks does it work with?",
    a: "Any React 19 project that uses Tailwind CSS v4, including Next.js, Vite, React Router, TanStack Start and Astro with React islands. Components are built on Base UI.",
  },
  {
    q: "Does it support dark mode and accessibility?",
    a: "Yes. Every theme is generated in light and dark from your seed color, with contrast built into each color role. Components handle keyboard interaction, focus, screen reader semantics and reduced motion.",
  },
  {
    q: "Is it free?",
    a: "Yes. Expressive is open source under the MIT license, including the CLI and every component.",
  },
] as const;
