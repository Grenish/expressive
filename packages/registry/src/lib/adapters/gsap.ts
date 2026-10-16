import gsap from "gsap";
import { springDuration, springEasing } from "@/registry/lib/spring";
import type { MotionAdapter } from "./types";

/** GSAP engine. GSAP has no spring ease, so we pass the solved spring curve. */
export const adapter: MotionAdapter = {
  name: "gsap",
  animate(element, keyframes, { spring, delay = 0 }) {
    const from: gsap.TweenVars = {};
    const to: gsap.TweenVars = {};
    for (const [property, values] of Object.entries(keyframes)) {
      from[property] = values[0];
      to[property] = values[values.length - 1];
    }
    let resolve!: () => void;
    const finished = new Promise<void>((r) => (resolve = r));
    const tween = gsap.fromTo(element, from, {
      ...to,
      duration: springDuration(spring) / 1000,
      ease: springEasing(spring),
      delay: delay / 1000,
      onComplete: resolve,
      onInterrupt: resolve,
    });
    return { finished, cancel: () => tween.kill() };
  },
};
