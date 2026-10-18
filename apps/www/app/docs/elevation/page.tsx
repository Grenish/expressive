import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Code } from "@/components/code";
import { C, DocsPage, H2, P, Preview } from "@/components/docs/prose";
import { ElevationLevels } from "@/components/docs/foundations";

export const metadata: Metadata = pageMetadata("/docs/elevation");

export default function Elevation() {
  return (
    <DocsPage
      href="/docs/elevation"
      eyebrow="Foundations"
      title="Elevation"
      lead="Six levels of elevation. In Material, depth comes mainly from surface color; shadows are a secondary cue for things that float, like FABs and menus."
    >
      <H2>Levels</H2>
      <Preview>
        <ElevationLevels />
      </Preview>
      <P>
        Each level pairs a shadow with a surface role: level 1 with <C>surface-container-low</C>, level 3 with{" "}
        <C>surface-container-high</C>, and so on. Shadows are tinted with the theme&apos;s <C>shadow</C> color.
      </P>

      <H2>Using elevation</H2>
      <Code code={`<div className="bg-surface-container-low shadow-elevation-1 hover:shadow-elevation-2" />`} />
      <P>
        Prefer a stronger surface over a shadow for static content. Reach for shadows when something moves above the page or needs to
        stand out on a busy background.
      </P>
    </DocsPage>
  );
}
