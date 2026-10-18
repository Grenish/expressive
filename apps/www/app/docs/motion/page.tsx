import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Code } from "@/components/code";
import { PackageCommand } from "@/components/package-command";
import { C, Callout, DocsPage, H2, H3, List, P } from "@/components/docs/prose";
import { SpringPlot } from "@/components/docs/foundations";
import { MotionShowcase } from "@/components/landing/sections";

export const metadata: Metadata = pageMetadata("/docs/motion");

export default function Motion() {
  return (
    <DocsPage
      href="/docs/motion"
      eyebrow="Foundations"
      title="Motion"
      lead="Motion in M3 Expressive is physics: springs instead of fixed durations. Expressive keeps every spring in one file, motion.ts, and runs them on plain CSS unless you choose an animation library."
    >
      <H2>Springs</H2>
      <P>
        A spring is described by its stiffness and damping ratio. Two kinds cover everything: <strong>spatial</strong> springs move
        things (position, size, shape) and may overshoot; <strong>effects</strong> springs change color and opacity and never
        overshoot. Each comes in fast, default and slow.
      </P>
      <SpringPlot />

      <H2>Schemes</H2>
      <List>
        <li>
          <strong>expressive</strong> (default): bouncier spatial springs for a lively feel.
        </li>
        <li>
          <strong>standard</strong>: more damped, for calmer, utilitarian products.
        </li>
        <li>
          <strong>fluid</strong>: soft and alive. Shapes drift, stretch and wobble like liquid. Needs the Motion or GSAP engine;
          see <a href="#fluid" className="text-primary underline underline-offset-4">Fluid</a> below.
        </li>
      </List>
      <P>
        Set the default in your theme (<C>{`createTheme({ motion: { scheme: "standard" } })`}</C>), or per component with the{" "}
        <C>motion</C> prop:
      </P>
      <Code code={`<Button motion="standard">Save</Button>\n<Dialog>…<DialogContent motion="expressive">…</DialogContent></Dialog>\n<Switch motion="none" />`} />

      <H2>Fluid</H2>
      <P>
        Fluid motion treats elements like droplets instead of rigid boxes. It&apos;s built from four behaviors, all driven by real
        spring physics and the element&apos;s velocity every frame:
      </P>
      <List>
        <li>
          <strong>Stretch with speed.</strong> A moving element elongates along its direction of travel and thins across it, keeping
          its area, then wobbles back into shape as it settles. It also leans a few degrees into horizontal motion. The switch handle
          does this.
        </li>
        <li>
          <strong>Press jelly.</strong> Buttons, icon buttons, FABs and chips squash when pressed and spring back with a fading
          wide-tall wobble.
        </li>
        <li>
          <strong>Touch response.</strong> Moving the pointer across a control gives it a small squash, in proportion to how fast you
          crossed it.
        </li>
        <li>
          <strong>Gooey arrivals.</strong> Checkboxes, radios and navigation indicators swell in with a jelly settle; dialogs swell in
          from below; ripples spread as irregular blobs that relax into circles.
        </li>
      </List>
      <MotionShowcase />
      <P>
        Momentum carries over: flip a switch back mid-motion and the handle turns around smoothly instead of restarting.
      </P>

      <H3>Requirements</H3>
      <P>
        CSS transitions can&apos;t read velocity, so fluid needs the <strong>Motion</strong> or <strong>GSAP</strong> engine. With
        the CSS engine, fluid falls back to expressive and logs a warning once. The CLI won&apos;t combine them:
      </P>
      <PackageCommand args={["init --scheme fluid            # picks the Motion engine", "theme --scheme fluid --motion gsap"]} />
      <P>
        Or opt in per component with <C>motion=&quot;fluid&quot;</C>. Colors and fades still use CSS transitions, timed by the
        fluid springs.
      </P>

      <H3>Tuning</H3>
      <Code
        code={`createTheme({
  motion: {
    scheme: "fluid",
    fluid: {
      viscosity: 0.045, // stretch per (size / second) of speed
      maxStretch: 0.3,  // up to 30% longer (and ~23% thinner)
      squash: 0.07,     // press squash
      wobble: 0.32,     // damping of the jelly wobble: lower = wobblier
    },
  },
});`}
      />

      <H3>In your own components</H3>
      <P>The same behaviors are hooks. They do nothing unless the element&apos;s scheme is fluid and the engine supports it:</P>
      <Code
        code={`import { useFluidLayout, useFluidPop, useFluidPress } from "@/lib/expressive/use-fluid";

function Tab({ selected }: { selected: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  useFluidPress(ref);                                   // squash on press
  useFluidPop(ref, { attributes: ["data-selected"] });  // jelly when it becomes selected
  return <button ref={ref} data-selected={selected ? "" : undefined} className="fluid:transition-colors" />;
}

function Indicator({ index }: { index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useFluidLayout(ref, { attributes: ["data-index"] });  // drift + stretch on layout change
  return <span ref={ref} data-index={index} style={{ left: index * 96 }} className="absolute fluid:transition-none" />;
}`}
      />
      <P>
        While fluid is active the element gets <C>data-fluid</C>. Use the <C>fluid:</C> variant to switch off CSS transitions of
        whatever the hooks animate, as above, so the two don&apos;t fight.
      </P>

      <H2>How it runs</H2>
      <P>
        Most animation in Expressive is state-driven: a corner morphing on press, a switch handle sliding, a dialog opening. These are
        CSS transitions whose easing is a <C>linear()</C> curve sampled from the spring, so they cost no JavaScript and work with
        server rendering. Use them in your own code with the spring utilities:
      </P>
      <Code code={`<div className="transition-transform spring-spatial-fast hover:scale-105" />\n<div className="transition-opacity spring-effects-default" />`} />
      <P>
        Imperative animation (the ripple, or anything you run with <C>useMotion</C>) goes through an engine:
      </P>
      <Code
        code={`import { useMotion } from "@/lib/expressive/use-motion";

function Pop() {
  const ref = useRef<HTMLDivElement>(null);
  const { animate } = useMotion();
  const pop = () =>
    animate(ref.current, { transform: ["scale(0.8)", "scale(1)"] }, { type: "spatial", speed: "fast" });
  return <div ref={ref} onClick={pop} />;
}`}
      />

      <H2>Engines</H2>
      <P>
        <C>tokens/motion.ts</C> picks the engine with a single export. Switch it by changing that line (the CLI does it for you with{" "}
        <C>--motion</C>):
      </P>
      <Code
        title="lib/expressive/tokens/motion.ts"
        code={`export { adapter } from "@/lib/expressive/adapters/css";     // default, no dependency
// export { adapter } from "@/lib/expressive/adapters/motion"; // Motion (formerly Framer Motion)
// export { adapter } from "@/lib/expressive/adapters/gsap";   // GSAP
// export { adapter } from "./my-motion";                       // your own`}
      />
      <P>An engine is one function. Write your own by implementing the adapter contract:</P>
      <Code
        title="lib/expressive/tokens/my-motion.ts"
        code={`import type { MotionAdapter } from "@/lib/expressive/adapters/types";
import { springDuration, springToLinear } from "@/lib/expressive/spring";

export const adapter: MotionAdapter = {
  name: "my-engine",
  animate(element, keyframes, { spring, delay = 0 }) {
    const animation = element.animate(keyframes as PropertyIndexedKeyframes, {
      duration: springDuration(spring),
      easing: springToLinear(spring),
      delay,
      fill: "forwards",
    });
    return { finished: animation.finished.then(() => {}), cancel: () => animation.cancel() };
  },
};`}
      />

      <H2>Reduced motion</H2>
      <P>
        When the operating system asks for reduced motion, every spring duration becomes 0, <C>useMotion</C> jumps straight to the
        final state, and fluid deformation turns off. You don&apos;t need to handle it yourself. <C>motion=&quot;none&quot;</C> does the same for one component.
      </P>
      <Callout>Indeterminate progress indicators keep animating, because their movement is the information.</Callout>
    </DocsPage>
  );
}
