import { animate, motionValue } from "motion";
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
  // Fluid: a motion value animated by Motion's spring; its velocity drives deformation.
  fluid: {
    spring({ from, to, velocity = 0, spring, onUpdate, onComplete }) {
      const value = motionValue(from);
      const unsubscribe = value.on("change", (latest) => onUpdate(latest, value.getVelocity()));
      const controls = animate(value, to, {
        type: "spring",
        stiffness: spring.stiffness,
        damping: 2 * spring.dampingRatio * Math.sqrt(spring.stiffness),
        mass: 1,
        velocity,
        restDelta: Math.max(Math.abs(to - from), 1) * 0.002,
        restSpeed: Math.max(Math.abs(to - from), 1) * 0.02,
        onComplete: () => {
          onUpdate(to, 0);
          onComplete?.();
        },
      });
      return {
        stop() {
          controls.stop();
          unsubscribe();
          value.destroy();
        },
      };
    },
  },
};
