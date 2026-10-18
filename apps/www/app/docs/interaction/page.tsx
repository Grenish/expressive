import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Code } from "@/components/code";
import { C, DocsPage, H2, List, P, Preview } from "@/components/docs/prose";
import { StateLayers } from "@/components/docs/foundations";

export const metadata: Metadata = pageMetadata("/docs/interaction");

export default function Interaction() {
  return (
    <DocsPage
      href="/docs/interaction"
      eyebrow="Foundations"
      title="Interaction"
      lead="Hover, focus, press and drag look the same on every component, because they all come from one set of interaction tokens instead of being styled one by one."
    >
      <H2>State layers</H2>
      <P>
        A state layer is a translucent overlay in the content color. Its opacity says what&apos;s happening: 8% on hover, 10% on
        focus and press, 16% while dragging.
      </P>
      <Preview>
        <StateLayers />
      </Preview>
      <Code code={`<button className="state-layer focus-ring rounded-shape-full bg-secondary-container px-4 py-2">Filter</button>`} />
      <P>
        <C>state-layer</C> handles hover, focus, press and <C>data-dragged</C> automatically. It ignores hover on touch screens, where
        hover sticks after a tap.
      </P>

      <H2>Focus ring</H2>
      <P>
        <C>focus-ring</C> draws an outline in the secondary color, only for keyboard focus (<C>:focus-visible</C>), so mouse users
        don&apos;t see rings on click.
      </P>

      <H2>Ripple</H2>
      <P>
        Buttons, icon buttons, FABs and chips also show a ripple that grows from where you pressed. It runs on the motion engine and
        is skipped when reduced motion is on.
      </P>

      <H2>Tokens</H2>
      <List>
        <li>
          <C>--ex-state-hover</C>, <C>--ex-state-focus</C>, <C>--ex-state-pressed</C>, <C>--ex-state-dragged</C>
        </li>
        <li>
          <C>--ex-disabled-content</C> (38%) and <C>--ex-disabled-container</C> (10%)
        </li>
        <li>
          <C>--ex-focus-ring-width</C>, <C>--ex-focus-ring-offset</C>, <C>--ex-focus-ring-color</C>
        </li>
      </List>
      <Code code={`createTheme({ interaction: { stateLayer: { hover: 0.06 }, focusRing: { width: 2, offset: 3 } } });`} />
    </DocsPage>
  );
}
