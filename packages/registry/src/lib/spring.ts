/**
 * Spring physics shared by every motion adapter.
 *
 * Springs are described the way Material does: a damping ratio and a
 * stiffness (mass = 1). From that we can solve the position at any time,
 * find when it settles, and sample it into a CSS `linear()` easing.
 */

export interface Spring {
  /** 1 = critically damped (no overshoot), < 1 = bouncy. */
  dampingRatio: number;
  stiffness: number;
}

const EPSILON = 0.001;

/** Normalized position (0 → 1) of a spring released from rest at time `t` seconds. */
export function springAt({ dampingRatio: zeta, stiffness }: Spring, t: number): number {
  const omega = Math.sqrt(stiffness);
  if (zeta < 1) {
    const omegaD = omega * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * omega * t) * (Math.cos(omegaD * t) + ((zeta * omega) / omegaD) * Math.sin(omegaD * t));
  }
  if (zeta === 1) {
    return 1 - Math.exp(-omega * t) * (1 + omega * t);
  }
  const s = omega * Math.sqrt(zeta * zeta - 1);
  const r1 = -zeta * omega + s;
  const r2 = -zeta * omega - s;
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

/** Time in ms until the spring stays within `EPSILON` of its target. */
export function springDuration(spring: Spring): number {
  const step = 1 / 1000;
  let lastOutside = 0;
  for (let t = 0; t < 10; t += step) {
    if (Math.abs(1 - springAt(spring, t)) > EPSILON) lastOutside = t;
    else if (t - lastOutside > 0.1) break;
  }
  return Math.round((lastOutside + step) * 1000);
}

/** Easing function over normalized progress (0 → 1) of `springDuration`. */
export function springEasing(spring: Spring): (progress: number) => number {
  const seconds = springDuration(spring) / 1000;
  return (progress) => (progress >= 1 ? 1 : springAt(spring, progress * seconds));
}

const round = (n: number) => Math.round(n * 10000) / 10000;

/** CSS `linear()` easing that approximates the spring, ending exactly at 1. */
export function springToLinear(spring: Spring, samples = 40): string {
  const ease = springEasing(spring);
  const points: number[] = [];
  for (let i = 0; i <= samples; i++) points.push(round(ease(i / samples)));
  points[points.length - 1] = 1;
  return `linear(${points.join(", ")})`;
}
