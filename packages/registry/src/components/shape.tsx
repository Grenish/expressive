"use client";

import * as React from "react";
import { type MaterialShapeName, shapePaths } from "@/registry/tokens/material-shapes";
import { type SpringSpeed, getSpring } from "@/registry/tokens/motion";
import { type Point, align, lerpPoints, samplePath, smoothPath } from "@/registry/lib/shape-morph";
import { type Spring, springSettled, stepSpring } from "@/registry/lib/spring";
import { resolveScheme } from "@/registry/lib/use-fluid";
import { useReducedMotion } from "@/registry/lib/use-reduced-motion";
import type { MotionProp } from "@/registry/lib/use-motion";
import { cn } from "@/registry/lib/utils";

export interface ShapeProps extends Omit<React.ComponentProps<"svg">, "children"> {
  /** One of the 35 Material shapes. Change it and the shape morphs to the new one. */
  name: MaterialShapeName;
  /** Accessible name. Without it the shape is decorative (hidden from assistive tech). */
  label?: string;
  motion?: MotionProp;
  /** Spring speed of the morph. */
  speed?: SpringSpeed;
  /** Exact spring for the morph, overriding the scheme's (e.g. a loading indicator's). */
  spring?: Spring;
}

const cache = new Map<MaterialShapeName, Point[] | null>();
const sampled = (name: MaterialShapeName) => {
  if (!cache.has(name)) cache.set(name, samplePath(shapePaths[name]));
  return cache.get(name)!;
};

/*
 * A Material 3 Expressive shape, filled with the current text color:
 *   <Shape name="flower" className="size-24 text-primary" />
 * Changing `name` morphs between shapes on the motion scheme's spatial spring
 * (instantly with reduced motion or motion="none").
 */
export function Shape({ name, label, motion, speed = "default", spring: springOverride, className, ...props }: ShapeProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();
  const shown = React.useRef<{ name: MaterialShapeName; points: Point[] | null }>({ name, points: null });
  const frame = React.useRef(0);

  React.useEffect(() => () => cancelAnimationFrame(frame.current), []);

  React.useLayoutEffect(() => {
    const path = pathRef.current;
    const previous = shown.current;
    if (!path || previous.name === name) return;
    cancelAnimationFrame(frame.current);

    const scheme = resolveScheme(svgRef.current, motion);
    // Start from whatever is on screen (mid-morph included), so morphs chain smoothly.
    const from = previous.points ?? sampled(previous.name);
    const target = sampled(name);
    if (reducedMotion || scheme === "none" || !from || !target) {
      shown.current = { name, points: null };
      path.setAttribute("d", shapePaths[name]);
      return;
    }
    const to = align(from, target);
    const spring = springOverride ?? getSpring(scheme, "spatial", speed);
    const state = { value: 0, velocity: 0 };
    let last = performance.now();
    shown.current = { name, points: from };
    // React already wrote the target path; put the starting outline back before paint.
    path.setAttribute("d", smoothPath(from));

    const tick = (now: number) => {
      stepSpring(state, 1, spring, Math.min((now - last) / 1000, 0.064));
      last = now;
      if (springSettled(state, 1, 1)) {
        shown.current = { name, points: null };
        path.setAttribute("d", shapePaths[name]); // land on the exact shape
        return;
      }
      const points = lerpPoints(from, to, state.value);
      shown.current = { name, points };
      path.setAttribute("d", smoothPath(points));
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- a new spring object each render shouldn't restart the morph
  }, [name, motion, reducedMotion, speed]);

  return (
    <svg
      ref={svgRef}
      data-slot="shape"
      viewBox="0 0 100 100"
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("inline-block size-12 shrink-0", className)}
      {...props}
    >
      <path ref={pathRef} d={shapePaths[shown.current.points ? shown.current.name : name]} />
    </svg>
  );
}
