import { useState } from "react";

/**
 * #ntlsn-passport — "Your teaching, in a passport that travels." (Epic 1.2
 * PR-G, recognition band). Ported from the production ntlsn-passport-script
 * injector: name/hours inputs drive the live passport card preview
 * (points = floor(hours), badges = floor(hours / 6) — the injector's exact
 * arithmetic). Copy verbatim; sample preview only, nothing stored.
 */
const CHIPS: readonly string[] = [
  "Mentoring",
  "Assessing",
  "Peer review",
  "Calibration",
  "Presenting",
];

const INPUT_CLASS =
  "w-full rounded-[9px] border border-white/[0.14] bg-navy px-3 py-2.5 text-[14px] text-white";

export default function PassportSection() {
  const [name, setName] = useState("");
  const [hours, setHours] = useState("");

  const hv = (() => {
    const v = parseFloat(hours);
    return v > 0 && isFinite(v) ? v : 0;
  })();
  const points = Math.floor(hv);
  const badges = Math.floor(hv / 6);
  const displayName = name.trim() || "Your name";

  return (
    <section
      id="ntlsn-passport"
      aria-labelledby="ntlsn-passport-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto max-w-[880px]">
        <div className="mx-auto mb-6 max-w-[700px] text-center">
          <div className="mb-3.5 inline-flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-[#8fb081] px-3 py-1 text-[11px] font-extrabold tracking-[1.5px] text-[#1f1810] uppercase">
              ▶ Try it
            </span>
            <span className="rounded-full border border-[rgba(230,163,60,.4)] px-[11px] py-1 text-[10.5px] font-extrabold tracking-[1.2px] text-amber uppercase">
              Preview · in design · 2027
            </span>
          </div>
          <h2
            id="ntlsn-passport-heading"
            className="mb-3 text-[clamp(25px,3.4vw,38px)] leading-[1.15] font-extrabold text-white"
          >
            Your teaching, in a passport that travels.
          </h2>
          <p className="text-[clamp(14.5px,1.7vw,17px)] leading-[1.6] text-[#bca98f]">
            Every hour you put in becomes portable, verifiable recognition that
            follows you between institutions. Preview your passport below.
            Points are illustrative, around one per recognised hour; the
            verified Open Badges 3.0 and My eQuals issuance ships in 2027.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-[26px]">
          <div className="grid min-w-full max-w-[360px] flex-1 gap-2.5 sm:min-w-[280px]">
            <label className="sr-only" htmlFor="pp-name">
              Your name
            </label>
            <input
              id="pp-name"
              placeholder="Your name"
              className={INPUT_CLASS}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              id="pp-hours"
              type="number"
              min={0}
              step={1}
              placeholder="Recognised hours this year"
              aria-label="Recognised hours this year"
              className={INPUT_CLASS}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
            <div className="text-[12px] text-[#a0907a]">
              Mentoring, assessing, peer review, calibration, presenting, it
              all counts.
            </div>
            <a
              href="/trp.html"
              className="mt-0.5 inline-flex items-center gap-1.5 self-start rounded-full bg-[#8fb081] px-4 py-[9px] text-[13px] leading-none font-bold text-[#1f1810] no-underline"
            >
              Open the full builder →
            </a>
            <div className="text-[11.5px] text-[#a0907a]">
              Build your record now, stored only in your browser. Verified
              issuance via Open&nbsp;Badges&nbsp;3.0 and My&nbsp;eQuals is in
              design for 2027.
            </div>
          </div>
          <div className="min-w-[280px] flex-1">
            <div className="mx-auto max-w-[380px] rounded-[18px] bg-[linear-gradient(135deg,#8fb081,#c66c3f,#a8737f)] p-[1.5px]">
              <div className="rounded-[16.5px] bg-[#251e15] p-[22px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-[1.4px] text-[#8fb081] uppercase">
                    Teaching Recognition Passport
                  </span>
                  <span aria-hidden="true" className="text-[16px] text-[#c66c3f]">
                    ◈
                  </span>
                </div>
                <div className="mt-3 mb-0.5 text-[22px] leading-[1.2] font-extrabold text-white">
                  {displayName}
                </div>
                <div className="text-[12.5px] font-semibold text-[#b3a48c]">
                  NTLSN · national
                </div>
                <div className="my-4 flex gap-[22px]">
                  <div>
                    <div className="text-[26px] leading-none font-extrabold text-[#8fb081]">
                      {points}
                    </div>
                    <div className="text-[11px] font-medium text-[#b3a48c]">
                      points
                    </div>
                  </div>
                  <div>
                    <div className="text-[26px] leading-none font-extrabold text-amber">
                      {badges}
                    </div>
                    <div className="text-[11px] font-medium text-[#b3a48c]">
                      badges
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  {CHIPS.map((chip) => (
                    <span
                      key={chip}
                      className="mr-[5px] mb-[5px] inline-block rounded-full border border-white/[0.14] bg-white/[0.06] px-[9px] py-[3px] text-[10.5px] font-semibold text-[#d9cdb6]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <div className="border-t border-white/[0.08] pt-2.5 text-[11px] font-semibold text-[#a0907a]">
                  Open Badges 3.0 · My eQuals · verifiable, portable
                </div>
                <div className="mt-1 text-[10.5px] text-[#a0907a]">
                  Sample preview, not a live credential. Issuance in 2027.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
