/**
 * Global decorative constellation backdrop — faint earthy nodes + connecting
 * edges behind the whole page ("nodes throughout"). Static by design: no
 * requestAnimationFrame, fully reduced-motion-safe, zero layout cost.
 * pointer-events:none + aria-hidden so it never interferes with content or AT.
 *
 * The production bundle's ntlsn-netbg-script page-wide canvas was dropped in
 * the rebuild (NetworkSection note); this is its quiet, earthy successor.
 */
import { useMemo } from "react";

const W = 1440;
const H = 1000;
const N = 52;
const PALETTE = ["#8fb081", "#c9a962", "#a8737f"]; // sage, gold, plum

/** Deterministic PRNG (no Math.random) → stable across renders. */
function mulberry(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function ConstellationBg() {
  const { nodes, edges } = useMemo(() => {
    const rnd = mulberry(20260722);
    const nodes = Array.from({ length: N }, (_, i) => ({
      x: rnd() * W,
      y: rnd() * H,
      r: 1.2 + rnd() * 2.4,
      fill: PALETTE[i % PALETTE.length],
      o: 0.16 + rnd() * 0.3,
    }));
    // connect each node to its nearest neighbour (within range)
    const edges: Array<[number, number]> = [];
    for (let i = 0; i < nodes.length; i++) {
      let best = -1;
      let bestD = 290 * 290;
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = j;
        }
      }
      if (best >= 0) edges.push([i, best]);
    }
    return { nodes, edges };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {edges.map(([a, b], i) => (
          <line
            key={`e${i}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="#8fb081"
            strokeWidth={1}
            opacity={0.06}
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={`n${i}`}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.fill}
            opacity={n.o}
          />
        ))}
      </svg>
    </div>
  );
}
