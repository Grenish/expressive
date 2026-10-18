import type { Metadata } from "next";
import { Code } from "@/components/code";
import { PackageCommand } from "@/components/package-command";
import { C, DocsPage, H2, List, P, Preview } from "@/components/docs/prose";
import { ColorRoles, SurfaceLadder } from "@/components/docs/foundations";
import { TonalPalettes } from "@/components/theme-controls";

export const metadata: Metadata = { title: "Color" };

export default function Color() {
  return (
    <DocsPage
      href="/docs/color"
      eyebrow="Foundations"
      title="Color"
      lead="You choose one seed color. Expressive derives five tonal palettes from it, then assigns every color role in light and dark from those palettes."
    >
      <H2>From seed to palettes</H2>
      <P>
        Expressive uses Google&apos;s <C>material-color-utilities</C>, the same algorithm behind Material You. It works in HCT, a
        color space built so that tone (lightness) is perceptually even. Each palette keeps one hue and chroma and varies tone from 0
        (black) to 100 (white). The palettes below come from the seed in Customize.
      </P>
      <Preview>
        <TonalPalettes />
      </Preview>

      <H2>Color roles</H2>
      <P>
        Components never reference palettes or hex values. They use roles, and every role has a matching <C>on-</C> role for content
        placed on it, so text always has enough contrast.
      </P>
      <Preview>
        <ColorRoles />
      </Preview>
      <List>
        <li>
          <strong>primary</strong>: key actions and the active state of controls.
        </li>
        <li>
          <strong>secondary</strong>: less prominent elements like filter chips and tonal buttons.
        </li>
        <li>
          <strong>tertiary</strong>: contrasting accents that balance primary and secondary.
        </li>
        <li>
          <strong>error</strong>: errors and destructive actions.
        </li>
        <li>
          <strong>*-container</strong>: softer fills for components like FABs and selected chips.
        </li>
      </List>

      <H2>Surfaces</H2>
      <P>
        Material builds depth from surface tone more than shadows. Five container levels step from the lowest to the highest
        emphasis: a navigation rail on <C>surface-container</C>, a dialog on <C>surface-container-high</C>.
      </P>
      <Preview>
        <SurfaceLadder />
      </Preview>

      <H2>Schemes</H2>
      <P>
        The <C>variant</C> decides how the seed is interpreted. <C>expressive</C> (the default) shifts hues for livelier secondary and
        tertiary colors; <C>tonal-spot</C> is the calmer classic Material look; <C>monochrome</C> removes chroma entirely. Try them in
        Customize.
      </P>
      <PackageCommand args={["theme --variant tonal-spot", "theme --contrast 0.5   # higher contrast"]} />

      <H2>Using color</H2>
      <Code
        code={`<div className="bg-primary-container text-on-primary-container" />
<p className="text-on-surface-variant" />
<div style={{ borderColor: "var(--ex-color-outline-variant)" }} />`}
      />
      <P>
        Every role is available as <C>bg-*</C>, <C>text-*</C>, <C>border-*</C> and the other Tailwind color utilities, and as{" "}
        <C>--ex-color-*</C> variables. To override one role, pass it to <C>createTheme</C>:
      </P>
      <Code code={`createTheme({ colors: { seed: "#6750A4", overrides: { light: { primary: "#4F378B" } } } });`} />
    </DocsPage>
  );
}
