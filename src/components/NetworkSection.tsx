import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildAdjacency,
  NET_COLOURS,
  NET_EDGES,
  NET_VIEW,
  placeNodes,
  type PlacedNode,
} from "../lib/network";

/**
 * #ntlsn-network — "A sector that finally connects." (Epic 1.2 PR-D),
 * ported from the ntlsn-network-script patch. NOFOLD in production (never
 * wrapped in a cfold) — rendered expanded here too.
 *
 * Porting choices, per the PR-D brief:
 * - The section's own SVG graph is ported in full: deterministic polar
 *   layout, the "big bang" entrance (nodes expand from the hub on first
 *   view), hover/focus connection tracing, and click-through anchors.
 *   Nodes are real links (<a> in SVG) so keyboard users get the same
 *   click-through the patch only gave pointers (WCAG 2.1.1/2.4.4).
 * - Under prefers-reduced-motion the entrance animation is fully disabled:
 *   no requestAnimationFrame runs, the graph renders in its final state.
 * - The page-wide decorative 3D canvas backdrop (ntlsn-netbg-script) and
 *   glow FX satellites are cosmetic decoration and are deliberately not
 *   ported (stocktake: "port the visual result, not the script").
 * - The patch's <700px fallback (hide the SVG, show link chips) is kept,
 *   via CSS classes instead of injected media queries.
 */

const ENTRANCE_MS = 1200;

export default function NetworkSection() {
  const nodes = useMemo(placeNodes, []);
  const adjacency = useMemo(buildAdjacency, []);
  const byId = useMemo(() => {
    const m = new Map<string, PlacedNode>();
    nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  /** null = resting state; otherwise the hovered/focused node id. */
  const [focusId, setFocusId] = useState<string | null>(null);
  /** Entrance progress 0→1 (starts at 1 under reduced motion). */
  const [entrance, setEntrance] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || !("IntersectionObserver" in window)) {
      // Reduced motion (or no IO): final state immediately, zero frames.
      setEntrance(1);
      return;
    }
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const t0 = performance.now();
      const frame = (now: number) => {
        const b = Math.min(1, (now - t0) / ENTRANCE_MS);
        // Production's ease-out quartic.
        setEntrance(1 - Math.pow(1 - b, 4));
        if (b < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
            run();
            io.disconnect();
          }
        });
      },
      { threshold: [0, 0.12, 0.35] },
    );
    io.observe(section);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const { cx, cy } = NET_VIEW;
  /** Interpolate a point from the hub outwards by entrance progress. */
  const ex = (x: number) => cx + (x - cx) * entrance;
  const ey = (y: number) => cy + (y - cy) * entrance;

  const focusSet = useMemo(() => {
    if (!focusId) return null;
    const keep = new Set<string>([focusId]);
    (adjacency[focusId] ?? []).forEach((id) => keep.add(id));
    return keep;
  }, [focusId, adjacency]);

  const focusNode = focusId ? byId.get(focusId) : undefined;
  const focusColour = focusNode ? NET_COLOURS[focusNode.g] : "#5e7d5a";
  const hint = focusNode
    ? focusNode.hub
      ? "NTLSN connects every part of the sector."
      : `${focusNode.label} · ${adjacency[focusNode.id].length} connections · select to open`
    : "The whole sector, one network.";

  return (
    <section
      id="ntlsn-network"
      ref={sectionRef}
      aria-labelledby="ntlsn-network-heading"
      className="scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto max-w-[880px] text-center">
        <p className="mb-[11px] text-[11px] font-extrabold tracking-[1.6px] text-teal uppercase">
          The network
        </p>
        <h2
          id="ntlsn-network-heading"
          className="mb-3 text-[clamp(26px,3.5vw,40px)] leading-[1.14] font-extrabold text-white"
        >
          A sector that finally connects.
        </h2>
        <p className="mx-auto mb-5 max-w-[620px] text-[clamp(14.5px,1.7vw,17px)] leading-relaxed text-[#bca98f]">
          Teaching, recognition, partnership and the open commons have long
          sat in silos. NTLSN is the connective layer between them.{" "}
          <b className="text-[#d8e0cc]">
            Hover a node to trace its connections; select one to open it.
          </b>
        </p>

        <svg
          viewBox={`0 0 ${NET_VIEW.w} ${NET_VIEW.h}`}
          width="100%"
          role="img"
          aria-label="Network map of the teaching and learning sector with NTLSN at the centre"
          className="mx-auto hidden max-w-[1180px] overflow-visible min-[700px]:block"
        >
          {NET_EDGES.map(([a, b]) => {
            const na = byId.get(a)!;
            const nb = byId.get(b)!;
            const active =
              focusId !== null && (a === focusId || b === focusId);
            const dimmed = focusId !== null && !active;
            return (
              <line
                key={`${a}-${b}`}
                x1={ex(na.x).toFixed(1)}
                y1={ey(na.y).toFixed(1)}
                x2={ex(nb.x).toFixed(1)}
                y2={ey(nb.y).toFixed(1)}
                stroke={active ? focusColour : dimmed ? "#2a2218" : "#5e7d5a"}
                strokeWidth={active ? 2.3 : dimmed ? 1 : 1.3}
                opacity={
                  focusId !== null
                    ? active
                      ? 1
                      : 0.28
                    : 0.05 + 0.95 * entrance
                }
              />
            );
          })}
          {nodes.map((n) => {
            const colour = NET_COLOURS[n.g];
            const nodeOpacity = n.hub
              ? 1
              : focusSet
                ? focusSet.has(n.id)
                  ? 1
                  : 0.16
                : 0.16 + 0.84 * entrance;
            const x = ex(n.x);
            const y = ey(n.y);
            return (
              <a
                key={n.id}
                href={n.a}
                aria-label={`${n.label} — open`}
                onMouseEnter={() => setFocusId(n.id)}
                onMouseLeave={() => setFocusId(null)}
                onFocus={() => setFocusId(n.id)}
                onBlur={() => setFocusId(null)}
                style={{
                  opacity: nodeOpacity,
                  transition: "opacity .18s ease",
                  cursor: "pointer",
                }}
              >
                <circle
                  cx={x.toFixed(1)}
                  cy={y.toFixed(1)}
                  r={n.r}
                  fill={n.hub ? "#1f1810" : "#2a2218"}
                  stroke={colour}
                  strokeWidth={n.hub ? 2.6 : 1.8}
                />
                {n.hub ? (
                  <text
                    x={x.toFixed(1)}
                    y={y.toFixed(1)}
                    textAnchor="middle"
                    dy=".34em"
                    fontSize={15}
                    fontWeight={800}
                    fill="#fff"
                  >
                    {n.label}
                  </text>
                ) : (
                  <text
                    x={x.toFixed(1)}
                    y={(y + n.r + (n.ring === "out" ? 11 : 13)).toFixed(1)}
                    textAnchor="middle"
                    fontSize={n.ring === "out" ? 9.5 : 11.5}
                    fontWeight={700}
                    fill="#d8e0cc"
                  >
                    {n.label}
                  </text>
                )}
              </a>
            );
          })}
        </svg>

        {/* <700px fallback: the same destinations as accessible link chips. */}
        <div className="mt-1 min-[700px]:hidden">
          <p className="mb-3 text-xs font-bold tracking-[1px] text-[#b3a48c] uppercase">
            NTLSN connects across the sector
          </p>
          <ul className="flex list-none flex-wrap justify-center gap-2">
            {nodes
              .filter((n) => !n.hub)
              .map((n) => (
                <li key={n.id}>
                  <a
                    href={n.a}
                    className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] font-semibold text-[#d9cdb6] no-underline"
                    style={{ borderLeft: `3px solid ${NET_COLOURS[n.g]}` }}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <p
          aria-live="polite"
          className="mt-4 min-h-[18px] text-[13px] font-semibold text-[#a0907a]"
        >
          {hint}
        </p>
      </div>
    </section>
  );
}
