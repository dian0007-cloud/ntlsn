import {
  FN_BAR_SEGMENTS,
  FN_FRAMINGS,
  FN_SOURCE,
  FN_STATS,
} from "../lib/fnawards";

/**
 * #ntlsn-fnawards — "First Nations teaching excellence: who recognises it?"
 * (Epic 1.2 PR-D). FIRST NATIONS CONTENT — every sentence is verbatim from
 * the production ntlsn-fnawards-script patch (plus the "Beyond
 * acknowledgement" lead-in card its ntlsn-fnmap-script satellite injected
 * at the top of the section). See src/lib/fnawards.ts for the cultural-care
 * rules: nothing here may be truncated, abbreviated or reworded, and the
 * attribution line is word-for-word.
 */
export default function FnAwardsSection() {
  return (
    <section
      id="ntlsn-fnawards"
      aria-labelledby="ntlsn-fnawards-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-16"
    >
      {/* Lead-in card (ntlsn-fnmap-script satellite). */}
      <div
        className="mx-auto mb-[30px] max-w-[760px] rounded-[14px] border px-[22px] py-[18px] text-center"
        style={{
          background:
            "linear-gradient(90deg, rgba(201, 169, 98,.07), rgba(143, 176, 129,.05))",
          borderColor: "rgba(201, 169, 98,.22)",
        }}
      >
        <p className="mb-2 text-xs leading-none font-bold tracking-[1.5px] text-[#e6a33c] uppercase">
          Beyond acknowledgement
        </p>
        <p className="mb-1.5 text-base leading-normal font-semibold text-white">
          Indigenising the curriculum, across the sector.
        </p>
        <p className="text-sm leading-relaxed text-[#b3a48c]">
          Every university here stands on unceded Country — and many are
          embedding First Nations knowledges and pedagogies into how they
          teach. The benchmark below maps how the sector recognises that
          work.
        </p>
      </div>

      <div className="mx-auto mb-3.5 max-w-[840px] text-center">
        <p className="mb-[13px] inline-block text-[11px] font-extrabold tracking-[2px] text-[#8fb081] uppercase">
          Sector benchmark · Research
        </p>
        <h2
          id="ntlsn-fnawards-heading"
          className="mb-[13px] text-[clamp(26px,3.6vw,40px)] leading-[1.15] font-extrabold text-white"
        >
          First Nations teaching excellence: who recognises it?
        </h2>
        <p className="text-[clamp(15px,1.8vw,18px)] leading-relaxed text-[#bca98f]">
          An audit of all 43 Australian universities — how the sector
          formally recognises First Nations teaching and learning. The
          national anchor is the{" "}
          <b className="text-white">
            AAUT Neville Bonner Award for Indigenous Education
          </b>{" "}
          (established 2002; a $15,000 award for Indigenous teaching staff).
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-[999px] border border-amber/[0.22] bg-amber/[0.08] px-[15px] py-[7px] text-xs font-semibold text-[#FFD79A]">
          First Nations recognition is First Nations-led. This maps the
          public landscape — it does not rank institutions. And read
          everything critically — including this site: much of NTLSN is
          machine-assembled, human-steered. Spotting the tells (those tidy em
          dashes, for a start) is the same critical literacy the sector
          teaches.
        </p>
      </div>

      <ul className="mx-auto mt-[26px] flex max-w-[900px] list-none flex-wrap gap-3.5">
        {FN_STATS.map(([value, caption, colour]) => (
          <li
            key={caption}
            className="min-w-[175px] flex-1 rounded-[14px] border border-white/[0.08] bg-[#2a2218] px-[18px] py-5 text-center"
            style={{ borderTop: `3px solid ${colour}` }}
          >
            <p
              className="text-[40px] leading-none font-extrabold"
              style={{ color: colour }}
            >
              {value}
            </p>
            <p className="mt-[9px] text-[12.5px] leading-snug font-medium text-[#bca98f]">
              {caption}
            </p>
          </li>
        ))}
      </ul>

      <div
        role="img"
        aria-label="Of 43 universities: 17 dedicated, 5 partial, 21 with no dedicated First Nations teaching award"
        className="mx-auto mt-5 mb-1.5 flex h-3.5 max-w-[760px] overflow-hidden rounded-lg border border-white/[0.08]"
      >
        {FN_BAR_SEGMENTS.map(([width, colour]) => (
          <div key={colour} style={{ width, background: colour }} />
        ))}
      </div>
      <p className="mx-auto max-w-[760px] text-center text-[13px] font-medium text-[#a0907a]">
        Of 43 universities: 17 dedicated · 5 partial ·{" "}
        <b className="text-[#c66c3f]">
          21 with no dedicated First Nations teaching award
        </b>{" "}
        — more than half the sector.
      </p>

      <div className="mx-auto mt-[30px] max-w-[780px] rounded-r-[14px] border border-white/[0.08] bg-[#2a2218] px-6 py-5 [border-left:3px_solid_#e6a33c]">
        <p className="mb-2 text-xs font-extrabold tracking-[1px] text-amber uppercase">
          The gap
        </p>
        <p className="text-[14.5px] leading-relaxed text-[#d9cdb6]">
          Almost half the sector has no dedicated way to recognise First
          Nations teaching. And across all 43 universities, none publicly
          mandates First Nations representation on its award assessment
          panels — a sector-wide governance gap, not a fault of any one
          institution.
        </p>
      </div>

      <div className="mx-auto mt-[30px] max-w-[840px] text-center">
        <p className="mb-3 text-xs font-bold tracking-[1.5px] text-[#b3a48c] uppercase">
          Five ways the sector frames the award
        </p>
        <ul className="flex list-none flex-wrap justify-center gap-[9px]">
          {FN_FRAMINGS.map((framing) => (
            <li key={framing}>
              <span className="rounded-[999px] border border-white/10 bg-white/[0.04] px-3.5 py-[7px] text-[12.5px] font-semibold text-[#d9cdb6]">
                {framing}
              </span>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-[18px] max-w-[710px] text-[13px] leading-relaxed text-[#a0907a]">
          Eligibility runs three ways — exclusive to First Nations staff,
          open on First Nations contribution, or a dual track. Assessment
          centres four things general awards miss: sustained impact, Elder
          and community recognition, Indigenous knowledge and scholarship,
          and culturally-grounded innovation.
        </p>
      </div>

      <p className="mx-auto mt-[26px] max-w-[760px] text-center text-xs text-[#a0907a] italic">
        Audited from publicly available award information across 43
        institutions, and grounded in peer-reviewed sector research:{" "}
        <a
          href={FN_SOURCE.doi}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-[#9cbb8c]/40 text-[#9cbb8c] no-underline"
        >
          Dianati &amp; Bolt (2025), The Australian Journal of Indigenous
          Education
        </a>
        . Shared as sector evidence; the design of First Nations recognition
        remains First Nations-led.
      </p>
    </section>
  );
}
