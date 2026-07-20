import { useEffect, useRef } from "react";
import { universities } from "../data";
import { groupMeta } from "../lib/institutions";

/**
 * HeroConstellation — the launch "alive background": every university is a
 * node (coloured by its sector group), drifting gently, joined to its nearest
 * neighbours by faint collaboration edges that breathe. It is literally
 * NTLSN's identity — "a sector that finally connects" — moving behind the hero.
 *
 * Determinism: node base positions are seeded (mulberry32) so the layout is
 * stable across renders/builds (no hydration mismatch, no jarring reshuffle).
 * Performance: one rAF loop, paused via IntersectionObserver when the hero is
 * scrolled out of view. a11y: under prefers-reduced-motion a single static
 * frame is drawn (no animation).
 */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Node = {
  color: string;
  bx: number;
  by: number;
  phase: number;
  amp: number;
  speed: number;
};

const NODES: Node[] = universities.map((u, i) => {
  const r = mulberry32(i * 9973 + 7);
  return {
    color: groupMeta(u.group).color,
    bx: r(),
    by: r(),
    phase: r() * Math.PI * 2,
    amp: 5 + r() * 9,
    speed: 0.00035 + r() * 0.0006,
  };
});

// Stable nearest-2-neighbour edges by base position (sets built once).
const EDGES: Array<[number, number]> = (() => {
  const set = new Set<string>();
  for (let i = 0; i < NODES.length; i++) {
    const nearest = NODES.map((n, j) => ({
      j,
      d: Math.hypot(n.bx - NODES[i].bx, n.by - NODES[i].by),
    }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const o of nearest) {
      const key = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`;
      set.add(key);
    }
  }
  return [...set].map((k) => k.split("-").map(Number) as [number, number]);
})();

export default function HeroConstellation() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const pos = (n: Node, t: number): readonly [number, number] => {
      const w = canvas.width;
      const h = canvas.height;
      const x = (n.bx * 0.86 + 0.07) * w + Math.cos(t * n.speed + n.phase) * n.amp * dpr;
      const y = (n.by * 0.78 + 0.11) * h + Math.sin(t * n.speed * 1.3 + n.phase) * n.amp * dpr;
      return [x, y];
    };

    const draw = (t: number) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const pulse = reduce ? 0.1 : 0.07 + 0.06 * (0.5 + 0.5 * Math.sin(t * 0.0008));
      ctx.lineWidth = dpr;
      for (const [a, b] of EDGES) {
        const [ax, ay] = pos(NODES[a], t);
        const [bx, by] = pos(NODES[b], t);
        ctx.strokeStyle = `rgba(143,176,129,${pulse})`;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
      for (const n of NODES) {
        const [x, y] = pos(n, t);
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(x, y, 7 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(x, y, 2.3 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    if (reduce) draw(0);
    else start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-60"
    />
  );
}
