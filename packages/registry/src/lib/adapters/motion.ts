import { animate } from "motion";
import type { MotionAdapter } from "./types";

/** Motion (formerly Framer Motion) engine using real spring physics. */
export const adapter: MotionAdapter = {
  name: "motion",
  animate(element, keyframes, { spring, delay = 0 }) {
    const controls = animate(element, keyframes, {
      type: "spring",
      stiffness: spring.stiffness,
      damping: 2 * spring.dampingRatio * Math.sqrt(spring.stiffness),
      mass: 1,
      delay: delay / 1000,
    });
    return {
      finished: controls.finished.then(() => undefined),
      cancel: () => controls.stop(),
    };
  },
};
