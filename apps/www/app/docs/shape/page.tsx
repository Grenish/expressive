import type { Metadata } from "next";
import { Code } from "@/components/code";
import { C, Callout, DocsPage, H2, P, Preview } from "@/components/docs/prose";
import { CornerScale, ShapeStyles } from "@/components/docs/foundations";

export const metadata: Metadata = { title: "Shape" };

export default function Shape() {
  return (
    <DocsPage
      href="/docs/shape"
      eyebrow="Foundations"
      title="Shape"
      lead="A corner scale from none to full, plus corner styles beyond plain rounding. In M3 Expressive, shapes also respond: corners morph when you press or select something."
    >
      <H2>Corner scale</H2>
      <Preview>
        <CornerScale />
      </Preview>
      <P>
        Use them as <C>rounded-shape-*</C> utilities or <C>--ex-shape-corner-*</C> variables. The CLI&apos;s corner scale option
        multiplies the whole scale: <C>soft</C> by 1.25, <C>sharp</C> by 0.5.
      </P>

      <H2>Corner styles</H2>
      <P>Press one to see its corners morph.</P>
      <Preview>
        <ShapeStyles />
      </Preview>
      <Code
        code={`<div className="rounded-shape-extra-large corner-squircle" />
<div className="rounded-shape-large corner-cut" />
<button className="rounded-pill [--ex-control-height:3rem] h-(--ex-control-height)" />`}
      />
      <Callout title="Browser support">
        <C>corner-squircle</C> and <C>corner-cut</C> use the CSS <C>corner-shape</C> property. Browsers without it show ordinary
        rounded corners, so nothing breaks.
      </Callout>

      <H2>Pills that animate well</H2>
      <P>
        A &quot;full&quot; radius is usually written as 9999px. That&apos;s fine at rest, but a spring animating from 9999px to 16px
        stays round for most of the animation, then snaps, and its overshoot can briefly clamp to a sharp square.{" "}
        <C>rounded-pill</C> uses half the control&apos;s real height instead (from <C>--ex-control-height</C>), so the morph stays
        smooth. Use it for anything round that changes shape.
      </P>

      <H2>Customizing</H2>
      <Code code={`createTheme({ shape: { corners: { medium: 14, large: 20, "extra-large": 32 } } });`} />
    </DocsPage>
  );
}
