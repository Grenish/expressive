import type { Metadata } from "next";
import { C, DocsPage, H2, List, P, TextLink } from "@/components/docs/prose";

export const metadata: Metadata = { title: "Accessibility" };

export default function Accessibility() {
  return (
    <DocsPage
      href="/docs/accessibility"
      eyebrow="Foundations"
      title="Accessibility"
      lead="Keyboard support, screen reader semantics, focus management and reduced motion come built in. Here's what Expressive handles, and what's still up to you."
    >
      <H2>What&apos;s built in</H2>
      <List>
        <li>
          <strong>Behavior from Base UI.</strong> Interactive components are built on <TextLink href="https://base-ui.com">Base UI</TextLink>{" "}
          primitives, which handle roles, ARIA state, keyboard interaction and focus management (for example the dialog&apos;s focus
          trap and the radio group&apos;s arrow keys).
        </li>
        <li>
          <strong>Required names.</strong> Icon buttons and icon-only FABs don&apos;t type-check without <C>aria-label</C> or{" "}
          <C>aria-labelledby</C>.
        </li>
        <li>
          <strong>Contrast by construction.</strong> Every color role has an <C>on-</C> role generated to contrast with it. The{" "}
          <C>contrast</C> option raises it further.
        </li>
        <li>
          <strong>Visible keyboard focus</strong> on every interactive element, only when navigating by keyboard.
        </li>
        <li>
          <strong>Reduced motion.</strong> Springs drop to zero duration and ripples are skipped when the OS asks for reduced motion.
        </li>
        <li>
          <strong>Tested.</strong> Each component has tests for keyboard use and ARIA state, and an automated axe check.
        </li>
      </List>

      <H2>What&apos;s up to you</H2>
      <List>
        <li>Label every form control: wrap checkboxes, radios and switches in a <C>&lt;label&gt;</C>, and give sliders <C>thumbLabels</C>.</li>
        <li>Give each dialog a <C>DialogTitle</C>, and each radio group a name.</li>
        <li>Check contrast for colors you add yourself, outside the roles.</li>
        <li>Don&apos;t put information only in a tooltip; it isn&apos;t reachable on touch screens.</li>
        <li>When you change a component&apos;s code, keep its roles and keyboard handling intact.</li>
      </List>
    </DocsPage>
  );
}
