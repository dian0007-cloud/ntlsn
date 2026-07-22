import { useState } from "react";

/**
 * #ntlsn-rpcalc — the Recognition-points calculator (Epic 1.2 PR-G,
 * recognition band). Ported from the production ntlsn-rpcalc-script
 * injector: 30 recognition moves across six domains; picking moves builds a
 * ledger with per-move domain/kind/RPL-hours/earns lines, a live explain
 * line, and the hours-toward-RPL total. Copy and figures verbatim
 * (illustrative, in design for 2027).
 */
type Move = readonly [string, string, number, string, string];
type Domain = readonly [string, string, string, readonly Move[]];

const DATA: readonly Domain[] = [
  [
    "teach",
    "Teaching",
    "#8fb081",
    [
      ["Redesigned a unit or assessment", "curriculum design", 15, "a Teaching badge", ""],
      ["Mentored sessional or casual staff", "developing others", 10, "a PD badge", ""],
      ["Led peer review of teaching", "quality assurance", 8, "a peer-review record", "#ntlsn-coming2027"],
      ["Calibrated marking across a team", "shared standards", 6, "a calibration record", "#ntlsn-coming2027"],
      ["Built an open educational resource", "open practice", 12, "an OEP badge", ""],
    ],
  ],
  [
    "sotl",
    "SoTL",
    "#c66c3f",
    [
      ["Presented at a symposium", "scholarly dissemination", 20, "a DOI and a My eQuals badge", "#events"],
      ["Published a peer-reviewed SoTL article", "scholarly output", 40, "a citable output with a DOI", ""],
      ["Ran a scholarly evaluation of a teaching change", "evidence-building", 25, "a project record", ""],
      ["Reviewed for a teaching-and-learning journal", "peer service", 6, "reviewer credit", ""],
      ["Co-authored SoTL with a student partner", "partnership", 20, "a co-authorship record", "#ntlsn-coming2028"],
    ],
  ],
  [
    "research",
    "Research",
    "#a8737f",
    [
      ["Published a peer-reviewed article", "research output", 40, "a citable output", ""],
      ["Secured a competitive grant", "research funding", 60, "a funding record", ""],
      ["Supervised an HDR to completion", "researcher development", 80, "a supervision record", ""],
      ["Reviewed for a journal or grant panel", "research esteem", 8, "an esteem record", ""],
      ["Delivered a keynote or invited address", "research esteem", 15, "an esteem record", ""],
    ],
  ],
  [
    "service",
    "Service",
    "#e6a33c",
    [
      ["Convened a community of practice or SIG", "community leadership", 15, "a community badge", "#network"],
      ["Chaired a committee", "governance service", 20, "a service record", ""],
      ["Mentored an early-career colleague", "developing others", 12, "a mentoring badge", ""],
      ["Reviewed grants or examined theses externally", "external service", 10, "an external-service record", ""],
      ["Led outreach to schools or the public", "engagement", 8, "an engagement record", ""],
    ],
  ],
  [
    "lead",
    "Leadership",
    "#8fb081",
    [
      ["Held a formal leadership role", "role leadership", 100, "a leadership record", ""],
      ["Coached colleagues through promotion", "developing leaders", 15, "a leadership record", ""],
      ["Led a curriculum or digital transformation", "change leadership", 40, "a leadership record", ""],
      ["Built a high-performing, inclusive team", "culture leadership", 30, "a leadership record", ""],
      ["Led calibration or peer review across a school", "standards leadership", 20, "a leadership record", "#ntlsn-coming2027"],
    ],
  ],
  [
    "impact",
    "Impact",
    "#a8737f",
    [
      ["Had your work adopted by another institution", "reach", 12, "an adoption record", ""],
      ["Informed policy or professional standards", "significance", 15, "an esteem record", ""],
      ["Improved measurable student outcomes", "outcomes evidence", 12, "an evidence record", ""],
      ["Reached the public via media or commentary", "public engagement", 8, "an engagement record", ""],
      ["Created a tool or framework others cite", "enduring artefact", 15, "a citation record", ""],
    ],
  ],
];

type Pick = { gi: number; oi: number };

export default function RpCalcSection() {
  const [picks, setPicks] = useState<readonly Pick[]>([]);
  const [lastPick, setLastPick] = useState<Pick | null>(null);

  const hrs = picks.reduce((sum, p) => sum + DATA[p.gi][3][p.oi][2], 0);
  const domainNames = [...new Set(picks.map((p) => DATA[p.gi][1]))];

  return (
    <section
      id="ntlsn-rpcalc"
      aria-labelledby="ntlsn-rpcalc-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto mb-[26px] max-w-[760px] text-center">
        <div className="mb-3.5 inline-flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-[#8fb081] px-3 py-1 text-[11px] font-extrabold tracking-[1.5px] text-[#1f1810] uppercase">
            ▶ Try it
          </span>
          <span className="rounded-full border border-[rgba(230,163,60,.4)] px-[11px] py-1 text-[10.5px] font-extrabold tracking-[1.2px] text-amber uppercase">
            Preview · in design · 2027
          </span>
        </div>
        <h2
          id="ntlsn-rpcalc-heading"
          className="mb-3 text-[clamp(25px,3.4vw,38px)] leading-[1.15] font-extrabold text-white"
        >
          Recognition-points calculator
        </h2>
        <p className="text-[clamp(14.5px,1.7vw,17px)] leading-[1.6] text-[#bca98f]">
          Pick from 30 things academics actually do — presenting at a
          symposium, convening a SIG, mentoring, peer review, leadership — and
          build your profile. Each move shows what{" "}
          <b className="text-[#d8e0cc]">domain</b> it sits in and how many
          hours it earns toward a{" "}
          <b className="text-[#d8e0cc]">My&nbsp;eQuals badge</b>—a verified,
          portable record. A working preview; the engine and issuance ship in
          2027.
        </p>
      </div>
      <div
        id="ntlsn-rpcalc-body"
        className="mx-auto max-w-[640px] rounded-2xl border border-white/[0.08] border-t-[3px] border-t-[#8fb081] bg-[#2a2218] px-[26px] py-6"
      >
        <div className="mb-[9px] text-[11px] font-bold tracking-[0.6px] text-[#a0907a] uppercase">
          Build your recognition profile
        </div>
        <select
          id="rp-sel"
          aria-label="Add what you have done"
          className="w-full cursor-pointer rounded-[10px] border border-white/[0.18] bg-navy px-[13px] py-3 text-[14px] font-semibold text-white"
          value=""
          onChange={(e) => {
            if (!e.target.value) return;
            const [gi, oi] = e.target.value.split(":").map(Number);
            setPicks((prev) => [...prev, { gi, oi }]);
            setLastPick({ gi, oi });
          }}
        >
          <option value="">Add what you have done…</option>
          {DATA.map((g, gi) => (
            <optgroup key={g[0]} label={g[1]}>
              {g[3].map((o, oi) => (
                <option key={o[0]} value={`${gi}:${oi}`}>
                  {o[0]}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="mx-0.5 mt-[11px] min-h-[18px] text-[12.5px] leading-[1.5] font-medium text-[#b3a48c]">
          {lastPick ? (
            (() => {
              const g = DATA[lastPick.gi];
              const o = g[3][lastPick.oi];
              return (
                <>
                  <b style={{ color: g[2] }}>{g[1]} move</b> — {o[1]}. It earns{" "}
                  {o[3]} and about {o[2]} hours toward an RPL claim.
                  {o[4] && (
                    <>
                      {" "}
                      <a href={o[4]} className="text-[#8fb081] no-underline">
                        where →
                      </a>
                    </>
                  )}
                </>
              );
            })()
          ) : (
            <>
              Pick from 30 moves above — each shows what kind of recognition it
              is and what it earns.
            </>
          )}
        </div>
        <div className="mt-3.5 flex flex-col gap-[7px]">
          {picks.map((p, idx) => {
            const g = DATA[p.gi];
            const o = g[3][p.oi];
            return (
              <div
                key={`${p.gi}:${p.oi}:${idx}`}
                className="flex items-center gap-[9px] rounded-[9px] border border-white/[0.07] bg-white/[0.03] px-[11px] py-2"
                style={{ borderLeft: `3px solid ${g[2]}` }}
              >
                <span className="flex-1">
                  <span className="text-[13px] font-bold text-[#ece5d6]">
                    {o[0]}
                  </span>
                  <span
                    className="mt-0.5 block text-[11px] font-medium"
                    style={{ color: g[2] }}
                  >
                    {g[1]} · {o[1]} · ~{o[2]}h RPL · earns {o[3]}
                  </span>
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${o[0]}`}
                  onClick={() =>
                    setPicks((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="flex-none cursor-pointer border-0 bg-transparent px-0.5 text-[17px] leading-none font-bold text-[#a0907a]"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-4 rounded-[12px] border border-[rgba(143,176,129,.18)] bg-[rgba(143,176,129,.05)] p-4 text-center">
          {!picks.length ? (
            <div className="text-[12px] italic text-[#a0907a]">
              Add what you have done to build your recognition profile.
            </div>
          ) : (
            <>
              <div className="text-[26px] font-extrabold text-[#8fb081]">
                {hrs}{" "}
                <span className="text-[13px] font-semibold text-[#b3a48c]">
                  hours toward RPL
                </span>
              </div>
              <div className="mt-[5px] text-[13px] font-semibold text-[#d9cdb6]">
                {picks.length} recognition record
                {picks.length === 1 ? "" : "s"} across {domainNames.length}{" "}
                domain{domainNames.length === 1 ? "" : "s"}
              </div>
              <div className="mt-1.5 text-[11.5px] font-medium text-[#a0907a]">
                {domainNames.join(" · ")}
              </div>
              <div className="mt-2 text-[11px] text-[#a0907a]">
                A portable My&nbsp;eQuals record · RPL between universities ·
                illustrative preview
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mx-auto mt-4 max-w-[640px] text-center">
        <p className="text-[12px] leading-[1.6] text-[#a0907a]">
          Each move is tagged to a recognition domain and to the RPL hours
          behind it. A 500-word reflection turns a symposium or course into
          RPL-transferable evidence. NTLSN issues the verified My&nbsp;eQuals
          record; your institution awards the credit. Issuance and figures are
          illustrative, in design for 2027.{" "}
          <a
            href="/psf-evidence-audit.html"
            className="text-[#8fb081] no-underline"
          >
            See all 180 ways your work counts →
          </a>
        </p>
      </div>
    </section>
  );
}
