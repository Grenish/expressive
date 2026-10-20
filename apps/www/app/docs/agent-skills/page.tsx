import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Code } from "@/components/code";
import { C, Callout, DocsPage, H2, H3, LinkTiles, List, P, TextLink } from "@/components/docs/prose";
import { GITHUB_URL } from "@/lib/links";

export const metadata: Metadata = pageMetadata("/docs/agent-skills");

const skills = `${GITHUB_URL}/tree/main/skills`;

export default function AgentSkills() {
  return (
    <DocsPage
      href="/docs/agent-skills"
      eyebrow="Getting started"
      title="Agent skills"
      lead="Teach Claude Code, Codex, Cursor and other coding agents to build with Expressive: the right component, the token rules, motion, accessibility and common patterns."
      specs={[
        ["skills", "2"],
        ["format", "SKILL.md"],
        ["source", "skills/ in the repo"],
        ["install", "npx skills add"],
      ]}
    >
      <P>
        Coding agents write UI from what they already know, which usually means hex colors, <C>rounded-lg</C> and hand-rolled buttons.
        An agent skill is a set of instructions the agent loads when a task needs it. Expressive&apos;s skills teach it to set the
        project up, reach for the installed components, use tokens instead of raw values, keep things accessible, and explain how
        Expressive compares with other libraries.
      </P>

      <H2>Install</H2>
      <P>
        Skills install with the open <TextLink href="https://github.com/vercel-labs/skills">skills</TextLink> CLI, which puts them where
        your agents look for them. In your app&apos;s root:
      </P>
      <Code code="npx skills add Grenish/expressive --skill expressive" lang="bash" />
      <List>
        <li>
          <C>-g</C> installs for your user instead of the current project.
        </li>
        <li>
          <C>-a claude-code</C> (or <C>codex</C>, <C>cursor</C>, <C>gemini-cli</C>…) picks the agents; without it the CLI asks.
        </li>
        <li>
          <C>--skill &apos;*&apos;</C> installs both skills; <C>--list</C> shows them without installing.
        </li>
        <li>
          <C>npx skills update</C> pulls newer versions later.
        </li>
      </List>
      <P>
        Then ask for UI as usual (&ldquo;add a settings screen with a list of switches&rdquo;). Agents pick the skill up on their own when
        the project has an <C>expressive.json</C>, imports Expressive components, or you ask for Material 3 UI.
      </P>

      <H2>The skills</H2>

      <H3>expressive</H3>
      <P>For anyone building an app with Expressive. A short main file the agent always reads, plus references it loads only when needed:</P>
      <List>
        <li>
          <strong>First steps in a project:</strong> read <C>expressive.json</C> for folders and import aliases, see which components are
          installed, and add missing ones with the CLI instead of recreating them.
        </li>
        <li>
          <strong>Ten rules:</strong> tokens instead of hex, palette colors, pixel radii and durations; container colors paired with their{" "}
          <C>on-</C> colors; <C>rounded-pill</C> for anything that morphs; <C>state-layer focus-ring</C> on custom controls; accessible
          names everywhere; the <C>render</C> prop for links; and more.
        </li>
        <li>
          <strong>A component picker:</strong> for each need, the component to use and the one not to (snackbar or toast, switch or
          checkbox, dialog or bottom sheet).
        </li>
        <li>
          <strong>Component reference:</strong> every component&apos;s install command, usage, props, accessibility and notes, generated
          from the same data as these docs so it never drifts.
        </li>
        <li>
          <strong>Setup and CLI, theming and tokens, motion:</strong> every flag, every color and type role with its purpose, the corner
          scale, the three motion schemes and when to use each, fluid motion and engines.
        </li>
        <li>
          <strong>Patterns:</strong> an adaptive app shell (navigation bar, rail and drawer by window size), forms, settings, list–detail,
          data tables with TanStack Table, which overlay to use, notifications, per-customer themes, Next.js App Router notes.
        </li>
        <li>
          <strong>Alternatives:</strong> the comparison on <TextLink href="/docs/why">Why Expressive</TextLink> in more depth, including
          when another library is the better choice and migration tables from MUI and shadcn/ui.
        </li>
        <li>
          <strong>Troubleshooting:</strong> symptom, cause and fix for setup, theme, motion and component problems.
        </li>
      </List>

      <H3>expressive-contributor</H3>
      <P>
        For agents working on Expressive itself: the repository map and commands, the full checklist for adding a component (about ten
        files, including the docs site and the component count), component and testing conventions, Base UI quirks, and how to verify a
        change in the browser. Install it in your clone of the repo:
      </P>
      <Code code="npx skills add Grenish/expressive --skill expressive-contributor" lang="bash" />

      <H2>What changes in practice</H2>
      <P>Asked for &ldquo;a card that shows a trip and can be selected&rdquo;, an agent without the skill tends to write:</P>
      <Code
        code={`<div onClick={select} className={\`rounded-lg p-4 \${selected ? "bg-blue-100" : "bg-white"} hover:shadow-md transition duration-300\`}>
  <h3 className="text-lg font-semibold">{title}</h3>
  <p className="text-sm text-gray-500">{dates}</p>
</div>`}
      />
      <P>With it, the agent writes code that themes, darkens, animates and announces itself correctly:</P>
      <Code
        code={`<button
  type="button"
  onClick={select}
  aria-pressed={selected}
  className="state-layer focus-ring flex w-full flex-col gap-1 rounded-shape-large bg-surface-container p-4 text-start text-on-surface
    transition-[border-radius,background-color] spring-spatial-fast active:rounded-shape-medium
    aria-pressed:bg-secondary-container aria-pressed:text-on-secondary-container"
>
  <span className="text-title-medium">{title}</span>
  <span className="text-body-medium text-on-surface-variant">{dates}</span>
</button>`}
      />

      <H2>Without skills</H2>
      <P>
        Agents that don&apos;t support skills can still read the documentation directly: <TextLink href="/llms.txt">llms.txt</TextLink>{" "}
        lists every page, <TextLink href="/llms-full.txt">llms-full.txt</TextLink> has all of it in one file, and every page has a{" "}
        <strong>Copy as Markdown</strong> button.
      </P>

      <Callout title="Skills are plain files">
        Each skill is a <C>SKILL.md</C> with Markdown references, in the <TextLink href={skills}>skills folder</TextLink> of the repo. Read
        them, fork them, or add your team&apos;s own rules next to them.
      </Callout>

      <H2>Next steps</H2>
      <LinkTiles
        items={[
          { href: "/docs/installation", title: "Install", description: "Set up Expressive in a React project with one command." },
          { href: "/docs/why", title: "Why Expressive", description: "How it compares with MUI, Material Web and shadcn/ui." },
          { href: "/docs/accessibility", title: "Accessibility", description: "What's built in, and what's still up to you." },
        ]}
      />
    </DocsPage>
  );
}
