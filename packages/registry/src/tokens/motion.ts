/**
 * Motion tokens — the single source of truth for animation.
 *
 * Components never hardcode durations, easings or springs; they read the
 * semantic tokens below (via CSS variables emitted by `createTheme`) or call
 * the active `adapter` for imperative animations.
 *
 * Switch engines by changing the adapter import:
 *   - "@/registry/lib/adapters/css"     Web Animations + CSS transitions (no dependency)
 *   - "@/registry/lib/adapters/motion"  Motion (formerly Framer Motion)
 *   - "@/registry/lib/adapters/gsap"    GSAP
 *   - "./my-motion"             your own adapter implementing `MotionAdapter`
 */
import type { Spring } from "@/registry/lib/spring";

export { adapter } from "@/registry/lib/adapters/css";

export type MotionScheme = "standard" | "expressive";
export type SpringType = "spatial" | "effects";
export type SpringSpeed = "fast" | "default" | "slow";

export type SpringTokens = Record<SpringType, Record<SpringSpeed, Spring>>;

/**
 * Material 3 Expressive motion schemes.
 * Spatial springs move things (position, size, shape) and may overshoot;
 * effects springs fade and recolor, and never overshoot.
 */
export const springs: Record<MotionScheme, SpringTokens> = {
  expressive: {
    spatial: {
      fast: { dampingRatio: 0.6, stiffness: 800 },
      default: { dampingRatio: 0.8, stiffness: 380 },
      slow: { dampingRatio: 0.8, stiffness: 200 },
    },
    effects: {
      fast: { dampingRatio: 1, stiffness: 3800 },
      default: { dampingRatio: 1, stiffness: 1600 },
      slow: { dampingRatio: 1, stiffness: 800 },
    },
  },
  standard: {
    spatial: {
      fast: { dampingRatio: 0.9, stiffness: 1400 },
      default: { dampingRatio: 0.9, stiffness: 700 },
      slow: { dampingRatio: 0.9, stiffness: 300 },
    },
    effects: {
      fast: { dampingRatio: 1, stiffness: 3800 },
      default: { dampingRatio: 1, stiffness: 1600 },
      slow: { dampingRatio: 1, stiffness: 800 },
    },
  },
};

/** Duration + easing tokens for transitions that are not spring-based. */
export const durations = {
  short: 100,
  medium: 250,
  long: 450,
  "extra-long": 700,
} as const;

export const easings = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  "standard-decelerate": "cubic-bezier(0, 0, 0, 1)",
  "standard-accelerate": "cubic-bezier(0.3, 0, 1, 1)",
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",
  "emphasized-decelerate": "cubic-bezier(0.05, 0.7, 0.1, 1)",
  "emphasized-accelerate": "cubic-bezier(0.3, 0, 0.8, 0.15)",
} as const;

export interface MotionTokens {
  /** Scheme used when a component has no `motion` prop. */
  scheme: MotionScheme;
  springs: Record<MotionScheme, SpringTokens>;
  durations: Record<string, number>;
  easings: Record<string, string>;
}

export const defaultMotion: MotionTokens = { scheme: "expressive", springs, durations, easings };

/** Resolve a spring token, e.g. `getSpring("expressive", "spatial", "fast")`. */
export function getSpring(scheme: MotionScheme, type: SpringType, speed: SpringSpeed = "default"): Spring {
  return springs[scheme][type][speed];
}
