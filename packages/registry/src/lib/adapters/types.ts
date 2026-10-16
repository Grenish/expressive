import type { Spring } from "@/registry/lib/spring";

export type Keyframes = Record<string, Array<string | number>>;

export interface AnimateOptions {
  spring: Spring;
  delay?: number;
}

export interface MotionControls {
  finished: Promise<void>;
  cancel(): void;
}

/**
 * Contract every motion engine implements. Write your own (`my-motion.ts`)
 * and export it as `adapter` from `tokens/motion.ts`.
 */
export interface MotionAdapter {
  name: string;
  animate(element: Element, keyframes: Keyframes, options: AnimateOptions): MotionControls;
}
