import type { Metadata } from "next";
import { Code } from "@/components/code";
import { C, Callout, DocsPage, H2, List, P } from "@/components/docs/prose";
import { SpringPlot } from "@/components/docs/foundations";

export const metadata: Metadata = { title: "Motion" };

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
      </List>
      <P>
        Set the default in your theme (<C>{`createTheme({ motion: { scheme: "standard" } })`}</C>), or per component with the{" "}
        <C>motion</C> prop:
      </P>
      <Code code={`<Button motion="standard">Save</Button>\n<Dialog>…<DialogContent motion="expressive">…</DialogContent></Dialog>\n<Switch motion="none" />`} />

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
        When the operating system asks for reduced motion, every spring duration becomes 0 and <C>useMotion</C> jumps straight to the
        final state. You don&apos;t need to handle it yourself. <C>motion=&quot;none&quot;</C> does the same for one component.
      </P>
      <Callout>Indeterminate progress indicators keep animating, because their movement is the information.</Callout>
    </DocsPage>
  );
}
