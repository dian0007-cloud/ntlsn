/**
 * #ntlsn-network — "A sector that finally connects." graph data (Epic 1.2
 * PR-D), verbatim from the production ntlsn-network-script patch: NTLSN at
 * the hub, an inner ring of what it connects and an outer ring of sector
 * bodies, with the full edge list. Layout is the same deterministic
 * polar-coordinate maths as production (no force simulation).
 */

export type NetGroup = "hub" | "core" | "people" | "open" | "sector" | "body";

export const NET_COLOURS: Record<NetGroup, string> = {
  hub: "#ffffff",
  core: "#8fb081",
  people: "#c66c3f",
  open: "#a8737f",
  sector: "#e6a33c",
  body: "#FFC36B",
};

export interface NetNode {
  id: string;
  label: string;
  g: NetGroup;
  /** Anchor (same-page "#…" scrolls; "/….html" opens the page). */
  a: string;
  hub?: boolean;
  ring?: "in" | "out";
}

export const NET_NODES: readonly NetNode[] = [
  { id: "ntlsn", label: "NTLSN", g: "hub", a: "#hero", hub: true },
  {
    id: "teachers",
    label: "Academics",
    g: "people",
    a: "/recognition-navigator.html",
    ring: "in",
  },
  {
    id: "students",
    label: "Students",
    g: "people",
    a: "#ntlsn-coming2028",
    ring: "in",
  },
  {
    id: "institutions",
    label: "Institutions",
    g: "sector",
    a: "#ntlsn-choosepackage",
    ring: "in",
  },
  {
    id: "recognition",
    label: "Recognition",
    g: "core",
    a: "/recognition-navigator.html",
    ring: "in",
  },
  {
    id: "partnership",
    label: "Partnership",
    g: "core",
    a: "#ntlsn-coming2028",
    ring: "in",
  },
  { id: "symposiums", label: "Symposiums", g: "core", a: "#events", ring: "in" },
  {
    id: "commons",
    label: "Commons",
    g: "open",
    a: "#ntlsn-repository",
    ring: "in",
  },
  { id: "oer", label: "OER", g: "open", a: "#ntlsn-oer", ring: "in" },
  { id: "caullt", label: "CAULLT", g: "body", a: "#events", ring: "out" },
  { id: "herdsa", label: "HERDSA", g: "body", a: "#events", ring: "out" },
  { id: "ascilite", label: "ASCILITE", g: "body", a: "#events", ring: "out" },
  { id: "acode", label: "ACODE", g: "body", a: "#ntlsn-coming2027", ring: "out" },
  { id: "acen", label: "WIL", g: "body", a: "#events", ring: "out" },
  {
    id: "advancehe",
    label: "Advance HE",
    g: "body",
    a: "/recognition-navigator.html",
    ring: "out",
  },
  {
    id: "cradle",
    label: "CRADLE",
    g: "body",
    a: "/course-quality.html",
    ring: "out",
  },
  { id: "issotl", label: "ISSoTL", g: "body", a: "#ntlsn-journal", ring: "out" },
  { id: "stars", label: "STARS", g: "body", a: "#events", ring: "out" },
  { id: "aitsl", label: "AITSL", g: "body", a: "#ntlsn-coming2027", ring: "out" },
  { id: "caul", label: "CAUL", g: "body", a: "#ntlsn-oer", ring: "out" },
  { id: "uniaust", label: "Univ. Australia", g: "body", a: "#events", ring: "out" },
  { id: "teqsa", label: "TEQSA", g: "body", a: "#ntlsn-coming2027", ring: "out" },
  {
    id: "atec",
    label: "ATEC",
    g: "body",
    a: "/recognition-navigator.html",
    ring: "out",
  },
  { id: "accord", label: "Accord", g: "body", a: "#frameworks", ring: "out" },
];

export const NET_EDGES: ReadonlyArray<readonly [string, string]> = [
  ["ntlsn", "recognition"],
  ["ntlsn", "partnership"],
  ["ntlsn", "symposiums"],
  ["ntlsn", "teachers"],
  ["ntlsn", "students"],
  ["ntlsn", "commons"],
  ["ntlsn", "oer"],
  ["ntlsn", "institutions"],
  ["teachers", "recognition"],
  ["students", "partnership"],
  ["recognition", "symposiums"],
  ["institutions", "recognition"],
  ["commons", "oer"],
  ["ntlsn", "caullt"],
  ["ntlsn", "herdsa"],
  ["ntlsn", "ascilite"],
  ["ntlsn", "acode"],
  ["ntlsn", "acen"],
  ["ntlsn", "advancehe"],
  ["ntlsn", "cradle"],
  ["ntlsn", "issotl"],
  ["ntlsn", "stars"],
  ["ntlsn", "aitsl"],
  ["ntlsn", "caul"],
  ["ntlsn", "uniaust"],
  ["ntlsn", "teqsa"],
  ["ntlsn", "atec"],
  ["ntlsn", "accord"],
  ["caullt", "teachers"],
  ["herdsa", "teachers"],
  ["ascilite", "teachers"],
  ["acen", "teachers"],
  ["advancehe", "teachers"],
  ["cradle", "teachers"],
  ["stars", "teachers"],
  ["aitsl", "teachers"],
  ["uniaust", "teachers"],
  ["caullt", "symposiums"],
  ["herdsa", "symposiums"],
  ["ascilite", "symposiums"],
  ["acode", "symposiums"],
  ["acen", "symposiums"],
  ["advancehe", "symposiums"],
  ["cradle", "symposiums"],
  ["issotl", "symposiums"],
  ["stars", "symposiums"],
  ["aitsl", "symposiums"],
  ["uniaust", "symposiums"],
  ["teqsa", "symposiums"],
  ["accord", "symposiums"],
  ["acode", "institutions"],
  ["advancehe", "institutions"],
  ["advancehe", "partnership"],
  ["acen", "students"],
  ["issotl", "partnership"],
  ["caul", "commons"],
  ["caul", "oer"],
  ["uniaust", "students"],
  ["uniaust", "institutions"],
  ["uniaust", "partnership"],
  ["teqsa", "institutions"],
  ["atec", "institutions"],
  ["accord", "institutions"],
  ["teqsa", "atec"],
  ["atec", "accord"],
  ["teqsa", "accord"],
  ["herdsa", "caullt"],
  ["institutions", "herdsa"],
  ["institutions", "caullt"],
  ["institutions", "stars"],
  ["institutions", "cradle"],
  ["institutions", "acen"],
  ["institutions", "caul"],
  ["institutions", "issotl"],
];

/* ── Layout (production's exact polar maths) ─────────────────────────────── */

export const NET_VIEW = { w: 1000, h: 860, cx: 500, cy: 410 } as const;
const R_IN = 150;
const R_OUT = 320;

export interface PlacedNode extends NetNode {
  x: number;
  y: number;
  /** Node circle radius. */
  r: number;
}

/** Deterministic node positions — hub centred, rings spread from -90°. */
export function placeNodes(): PlacedNode[] {
  const inner = NET_NODES.filter((n) => n.ring === "in");
  const outer = NET_NODES.filter((n) => n.ring === "out");
  const place = (
    nodes: readonly NetNode[],
    radius: number,
  ): Map<string, { x: number; y: number }> => {
    const m = new Map<string, { x: number; y: number }>();
    nodes.forEach((n, i) => {
      const angle = ((-90 + i * (360 / nodes.length)) * Math.PI) / 180;
      m.set(n.id, {
        x: NET_VIEW.cx + radius * Math.cos(angle),
        y: NET_VIEW.cy + radius * Math.sin(angle),
      });
    });
    return m;
  };
  const innerPos = place(inner, R_IN);
  const outerPos = place(outer, R_OUT);
  return NET_NODES.map((n) => {
    const pos = n.hub
      ? { x: NET_VIEW.cx, y: NET_VIEW.cy }
      : (innerPos.get(n.id) ?? outerPos.get(n.id))!;
    return { ...n, ...pos, r: n.hub ? 38 : n.ring === "out" ? 14 : 21 };
  });
}

/** Adjacency map (both directions), for hover/focus tracing. */
export function buildAdjacency(): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  NET_NODES.forEach((n) => (adj[n.id] = []));
  NET_EDGES.forEach(([a, b]) => {
    adj[a].push(b);
    adj[b].push(a);
  });
  return adj;
}
