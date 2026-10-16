/* Small geometry helpers to draw the illustrative product (a desk phone stand)
   consistently across the hero, the iteration row and the OG image. */

export type Pt = [number, number];

/** Side profiles of the stand, units ≈ mm, y grows downward. */
export const standProfiles: Record<'v1' | 'v2' | 'v3', Pt[]> = {
  v1: [[0, 100], [56, 100], [56, 92], [38, 92], [62, 14], [54, 10], [24, 92], [14, 92], [14, 80], [6, 80], [6, 92], [0, 92]],
  v2: [[0, 100], [62, 100], [62, 92], [42, 92], [70, 14], [62, 10], [24, 92], [14, 92], [14, 80], [6, 80], [6, 92], [0, 92]],
  v3: [[0, 100], [86, 100], [86, 92], [42, 92], [70, 14], [62, 10], [24, 92], [14, 92], [14, 80], [6, 80], [6, 92], [0, 92]],
};

export const tf = (pts: Pt[], s = 1, ox = 0, oy = 0): Pt[] => pts.map(([x, y]) => [ox + x * s, oy + y * s]);

export const poly = (pts: Pt[], close = true) =>
  'M' + pts.map(([x, y]) => `${r(x)} ${r(y)}`).join(' L') + (close ? ' Z' : '');

const r = (n: number) => Math.round(n * 10) / 10;

/** Wireframe extrusion: front outline, back outline and connecting edges. */
export function extrude(pts: Pt[], dx: number, dy: number) {
  const back = pts.map(([x, y]) => [x + dx, y + dy] as Pt);
  const edges = pts.map(([x, y], i) => `M${r(x)} ${r(y)} L${r(back[i][0])} ${r(back[i][1])}`).join(' ');
  return { front: poly(pts), back: poly(back), edges };
}

/** Deterministic PRNG so the "hand sketch" looks the same on every build. */
export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hand-drawn look: every edge is a slightly bowed stroke that overshoots its corners. */
export function sketch(pts: Pt[], seed = 7, wobble = 1.6, overshoot = 3): string[] {
  const rand = rng(seed);
  const n = (a = 1) => (rand() - 0.5) * 2 * a;
  return pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length];
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
    const ux = (q[0] - p[0]) / len;
    const uy = (q[1] - p[1]) / len;
    const o1 = overshoot * (0.4 + rand());
    const o2 = overshoot * (0.4 + rand());
    const a: Pt = [p[0] - ux * o1 + n(0.6), p[1] - uy * o1 + n(0.6)];
    const b: Pt = [q[0] + ux * o2 + n(0.6), q[1] + uy * o2 + n(0.6)];
    const bow = n(wobble) * Math.min(1, len / 30);
    const c: Pt = [(a[0] + b[0]) / 2 - uy * bow, (a[1] + b[1]) / 2 + ux * bow];
    return `M${r(a[0])} ${r(a[1])} Q${r(c[0])} ${r(c[1])} ${r(b[0])} ${r(b[1])}`;
  });
}
