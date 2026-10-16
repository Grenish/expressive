"use client";

import * as React from "react";
import {
  type MotionScheme,
  type SpringSpeed,
  type SpringType,
  adapter,
  defaultMotion,
  getSpring,
} from "@/registry/tokens/motion";
import type { Keyframes, MotionAdapter, MotionControls } from "@/registry/lib/adapters/types";
import { useReducedMotion } from "@/registry/lib/use-reduced-motion";

export type MotionProp = MotionScheme | "none";

export interface MotionAnimateOptions {
  type?: SpringType;
  speed?: SpringSpeed;
  delay?: number;
}

/**
 * Override the engine from `tokens/motion.ts` for part of the tree,
 * e.g. `<MotionAdapterContext value={gsapAdapter}>` in tests or demos.
 */
export const MotionAdapterContext = React.createContext<MotionAdapter>(adapter);

const noop: MotionControls = { finished: Promise.resolve(), cancel() {} };

/**
 * Imperative animations through the active motion adapter (CSS, Motion, GSAP
 * or your own). Respects `prefers-reduced-motion` and `motion="none"` by
 * jumping straight to the final keyframe.
 */
export function useMotion(motion: MotionProp = defaultMotion.scheme) {
  const engine = React.useContext(MotionAdapterContext);
  const reducedMotion = useReducedMotion();
  const disabled = reducedMotion || motion === "none";

  const animate = React.useCallback(
    (element: Element | null, keyframes: Keyframes, { type = "spatial", speed = "default", delay }: MotionAnimateOptions = {}) => {
      if (!element) return noop;
      if (disabled) {
        const style = (element as HTMLElement).style;
        for (const [property, values] of Object.entries(keyframes)) {
          style.setProperty(property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`), String(values[values.length - 1]));
        }
        return noop;
      }
      return engine.animate(element, keyframes, { spring: getSpring(motion as MotionScheme, type, speed), delay });
    },
    [disabled, engine, motion],
  );

  return { animate, reducedMotion: disabled, engine: engine.name };
}
