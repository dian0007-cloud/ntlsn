/**
 * #ntlsn-consortium — "From a national commons to an international
 * consortium." (Epic 1.2 PR-G, recognition band). Ported verbatim from the
 * production ntlsn-consortium-script injector: the federated-mesh SVG
 * (Australia as founding node), the 2027→2030+ stages and the
 * how-a-node-joins grid.
 */
const FONT =
  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif';

type Node = {
  id: string;
  l: string;
  s?: string;
  x: number;
  y: number;
  r: number;
  f?: boolean;
};

const NODES: readonly Node[] = [
  { id: "au", l: "Australia", s: "Founding node", x: 300, y: 185, r: 33, f: true },
  { id: "nz", l: "Aotearoa", x: 300, y: 58, r: 21 },
  { id: "pac", l: "Pacific", x: 432, y: 112, r: 21 },
  { id: "sea", l: "SE Asia", x: 456, y: 248, r: 21 },
  { id: "uk", l: "UK", x: 300, y: 312, r: 21 },
  { id: "ca", l: "Canada", x: 144, y: 248, r: 21 },
  { id: "za", l: "Sthn Africa", x: 168, y: 112, r: 21 },
];

const EDGES: ReadonlyArray<[string, string]> = [
  ["au", "nz"],
  ["au", "pac"],
  ["au", "sea"],
  ["au", "uk"],
  ["au", "ca"],
  ["au", "za"],
  ["nz", "pac"],
  ["pac", "sea"],
  ["uk", "ca"],
  ["ca", "za"],
  ["za", "nz"],
];

const STAGES: ReadonlyArray<[string, string, string]> = [
  [
    "2027",
    "Australia matures",
    "The founding node proven at home — back-end, recognition, symposiums.",
  ],
  [
    "2028",
    "The first border crossing",
    "Aotearoa and the Pacific: the model’s first journey beyond Australia.",
  ],
  [
    "2029",
    "The mesh begins",
    "The UK, Canada and Southeast Asia invited to run their own national nodes.",
  ],
  [
    "2030+",
    "A global consortium",
    "A self-governing federation of national teaching commons, owned by no one.",
  ],
];

const STAGE_COLOURS = ["#8fb081", "#c66c3f", "#a8737f", "#e6a33c"] as const;

const JOIN: ReadonlyArray<[string, string]> = [
  ["Adopt the open framework", "Free, open, and yours to localise."],
  ["Govern locally", "Your node, your governance, your data and custodianship."],
  [
    "Connect via open standards",
    "No central owner, no lock-in — a federation of equals.",
  ],
  ["Keep what is yours", "Indigenous knowledges stay custodian-led, per node."],
];

export default function ConsortiumSection() {
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
  return (
    <section
      id="ntlsn-consortium"
      aria-labelledby="ntlsn-consortium-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto max-w-[880px] text-center">
        <div className="mb-[11px] text-[11px] font-extrabold tracking-[1.6px] text-amber uppercase">
          The long game · in design · 2029
        </div>
        <h2
          id="ntlsn-consortium-heading"
          className="mb-3 text-[clamp(26px,3.5vw,40px)] leading-[1.14] font-extrabold text-white"
        >
          From a national commons to an international consortium.
        </h2>
        <p className="mx-auto mb-2 max-w-[660px] text-[clamp(14.5px,1.7vw,17px)] leading-[1.6] text-[#bca98f]">
          NTLSN starts in Australia, but the architecture was built to travel.
          Each country runs its own nationally-governed node, connected through
          open standards into a federated global commons — one node at a time.
        </p>
        <p className="mx-auto mb-6 max-w-[560px] text-[13px] leading-[1.5] text-[#a0907a]">
          The model is the international consortium — shared infrastructure,
          local sovereignty, no central owner.
        </p>
        <svg
          viewBox="0 0 600 372"
          width="100%"
          role="img"
          aria-label="A federated global mesh of national teaching-and-learning nodes, with Australia as the founding node"
          className="mx-auto block max-w-[560px] overflow-visible"
        >
          {EDGES.map(([a, b]) => {
            const na = byId[a];
            const nb = byId[b];
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke="#2a2218"
                strokeWidth={1.2}
              />
            );
          })}
          {NODES.map((n) => {
            const col = n.f ? "#8fb081" : "#c66c3f";
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={n.f ? "#1f1810" : "#2a2218"}
                  stroke={col}
                  strokeWidth={n.f ? 2.4 : 1.6}
                />
                <text
                  x={n.x}
                  y={n.y + (n.f ? -1 : 4)}
                  textAnchor="middle"
                  fontFamily={FONT}
                  fontSize={n.f ? 11 : 9.5}
                  fontWeight={n.f ? 800 : 700}
                  fill={n.f ? "#fff" : "#dfeaf3"}
                >
                  {n.l}
                </text>
                {n.f && n.s && (
                  <text
                    x={n.x}
                    y={n.y + 11}
                    textAnchor="middle"
                    fontFamily={FONT}
                    fontSize={7.5}
                    fontWeight={700}
                    fill="#9fe7d8"
                  >
                    {n.s}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <div className="mt-[30px] mb-3 text-[10.5px] font-bold tracking-[0.7px] text-[#a0907a] uppercase">
          One node at a time
        </div>
        <div className="flex flex-wrap gap-[11px] text-left">
          {STAGES.map(([year, title, body], i) => (
            <div
              key={year}
              className="min-w-[200px] flex-1 rounded-b-[12px] bg-[#2a2218] px-4 py-3.5"
              style={{ borderTop: `3px solid ${STAGE_COLOURS[i]}` }}
            >
              <div
                className="text-[16px] font-extrabold"
                style={{ color: STAGE_COLOURS[i] }}
              >
                {year}
              </div>
              <div className="mt-[3px] mb-[5px] text-[13px] font-bold text-white">
                {title}
              </div>
              <div className="text-[12px] leading-[1.5] text-[#a0907a]">
                {body}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-[30px] mb-3 text-[10.5px] font-bold tracking-[0.7px] text-[#a0907a] uppercase">
          How a node joins
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[11px] text-left">
          {JOIN.map(([title, body]) => (
            <div
              key={title}
              className="rounded-[10px] border border-white/[0.07] border-l-[3px] border-l-teal bg-white/[0.03] px-[15px] py-[13px]"
            >
              <div className="mb-[3px] text-[13px] font-bold text-[#d8e0cc]">
                {title}
              </div>
              <div className="text-[12px] leading-[1.5] text-[#a0907a]">
                {body}
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-[680px] text-[12px] leading-[1.6] text-[#97876f]">
          A roadmap, not a claim. Built on open standards — no crypto, no
          lock-in. Every node governs its own content, including Indigenous
          knowledges, locally and under community custodianship. Aligned with
          the principles of the UNESCO Global Convention.
        </p>
      </div>
    </section>
  );
}
