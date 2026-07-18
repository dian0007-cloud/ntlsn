/**
 * #ntlsn-recognition — "Recognise the work that counts for nothing." (Epic
 * 1.2 PR-G, recognition band). Ported verbatim from the production
 * ntlsn-recognition-script injector (hidden by the condense list but fully
 * built): the worked Advance HE mentoring ledger, the growing benchmark list
 * (HERDSA · ASCILITE crosswalk language word-for-word), the ATEC note and
 * the hours → badge → RPL flow strip.
 */
const LEDGER_ROWS: ReadonlyArray<{ label: string; hrs: string; sub?: boolean }> =
  [
    { label: "Mentoring", hrs: "5 hrs" },
    { label: "Assessing", hrs: "10 hrs" },
    { label: "Mentor training", hrs: "1 hr", sub: true },
    { label: "Assessing mentor training", hrs: "2 hrs", sub: true },
  ];

const GROWS: ReadonlyArray<[string, string]> = [
  ["Conference attendance & presentation", "HERDSA · ASCILITE"],
  ["Symposium attendance", "40 hrs"],
  ["Peer review & calibration", "per activity"],
  ["Assessment moderation", "per activity"],
  ["Supervision & HDR examining", "per activity"],
];

export default function RecognitionSection() {
  return (
    <section
      id="ntlsn-recognition"
      aria-labelledby="ntlsn-recognition-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-16"
    >
      <div className="mx-auto mb-[34px] max-w-[820px] text-center">
        <div className="mb-[15px] inline-block rounded-full border border-[rgba(255,180,72,.4)] px-[13px] py-[5px] text-[11px] font-extrabold tracking-[2px] text-amber uppercase">
          Recognition benchmark · In design · 2027
        </div>
        <h2
          id="ntlsn-recognition-heading"
          className="mb-[13px] text-[clamp(26px,3.6vw,40px)] leading-[1.15] font-extrabold text-white"
        >
          Recognise the work that counts for nothing.
        </h2>
        <p className="text-[clamp(15px,1.8vw,18px)] leading-[1.6] text-[#aebfce]">
          Mentoring, assessing, training the next mentor, reviewing a peer —
          the labour that sustains the sector, and almost none of it formally
          recognised. NTLSN sets a <b className="text-white">national benchmark</b>:
          meet the hours, earn a verified, portable{" "}
          <b className="text-white">My eQuals badge</b>, and carry it to any
          university as <b className="text-white">RPL</b> — recognised for
          demonstrated effort, not attendance.
        </p>
      </div>
      <div className="mx-auto mb-[22px] max-w-[760px] rounded-[13px] border border-[rgba(124,156,255,.22)] bg-[rgba(124,156,255,.06)] px-5 py-[13px] text-center">
        <span className="mb-[5px] block text-[10px] font-extrabold tracking-[1.5px] text-[#7C9CFF] uppercase">
          Built for the national shift
        </span>
        <span className="text-[13.5px] leading-[1.55] text-[#aebfce]">
          Recognition is going national:{" "}
          <b className="text-[#cfe9e5]">ATEC</b>, the new Australian Tertiary
          Education Commission, is driving recognition and RPL that travel
          across the sector. NTLSN is built on{" "}
          <b className="text-[#cfe9e5]">My eQuals and Open Badges</b> — the
          standards universities already trust — so a record earned here is
          portable and ready for it.
        </span>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-[18px]">
        {/* Worked example ledger */}
        <div className="min-w-[300px] max-w-[460px] flex-1 rounded-[14px] border border-white/[0.08] border-t-[3px] border-t-[#2DD4BF] bg-[#0f1f3a] px-6 py-[22px]">
          <div className="mb-1 text-[12px] font-extrabold tracking-[1px] text-[#2DD4BF] uppercase">
            Worked example
          </div>
          <div className="mb-1.5 text-[18px] font-extrabold text-white">
            Advance HE mentoring
          </div>
          {LEDGER_ROWS.map((row) => (
            <div
              key={row.label}
              className={`flex items-baseline justify-between border-t border-white/[0.06] py-[9px] ${
                row.sub ? "pl-[18px]" : ""
              }`}
            >
              <span
                className={
                  row.sub
                    ? "text-[13px] text-[#9fb3c8]"
                    : "text-[14.5px] font-semibold text-white"
                }
              >
                {row.sub ? "↳ " : ""}
                {row.label}
              </span>
              <span
                className={`whitespace-nowrap font-extrabold ${
                  row.sub ? "text-[13px] text-[#9fb3c8]" : "text-[15px] text-amber"
                }`}
              >
                {row.hrs}
              </span>
            </div>
          ))}
          <div className="mt-1 flex items-baseline justify-between border-t-[1.5px] border-t-[rgba(45,212,191,.4)] pt-[11px]">
            <span className="text-[15px] font-extrabold text-white">
              Recognised hours
            </span>
            <span className="text-[19px] font-extrabold text-[#2DD4BF]">15</span>
          </div>
          <div className="mt-2.5 text-[12.5px] italic text-[#FF8A6B]">
            Today: recognised nowhere.
          </div>
          <div className="mt-[3px] text-[12.5px] italic text-[#2DD4BF]">
            NTLSN standard: a portable mentor badge every 4–8 hrs.
          </div>
        </div>
        {/* The benchmark grows */}
        <div className="min-w-[280px] max-w-[460px] flex-1">
          <div className="mb-3 text-[12px] font-extrabold tracking-[1px] text-purple uppercase">
            The benchmark grows
          </div>
          {GROWS.map(([label, value]) => (
            <div
              key={label}
              className="mb-[9px] flex items-center justify-between rounded-[11px] border border-white/[0.08] bg-[#0f1f3a] px-4 py-[13px]"
            >
              <span className="text-sm font-semibold text-[#cbd8e6]">
                {label}
              </span>
              <span className="text-[13px] font-bold text-purple">{value}</span>
            </div>
          ))}
          <div className="mt-1.5 text-[13px] leading-[1.55] text-[#9fb3c8]">
            Every hour attended is matched by a recognised hour of{" "}
            <b className="text-white">associated work</b> — the reviewing,
            synthesising and applying that makes it stick. One shared standard
            for the invisible work that holds teaching together — set
            nationally, owned by no single vendor.
          </div>
        </div>
      </div>
      <div className="mx-auto mt-[22px] flex max-w-[940px] flex-wrap items-center justify-center gap-x-[18px] gap-y-2.5 rounded-[14px] border border-[rgba(124,156,255,.25)] bg-[linear-gradient(120deg,rgba(45,212,191,.10),rgba(197,123,255,.08))] px-6 py-[18px] text-center">
        <span className="text-[15px] font-bold text-white">
          Hours accumulate
        </span>
        <span aria-hidden="true" className="text-[#8aa0b6]">
          →
        </span>
        <span className="text-[15px] font-bold text-purple">
          verified My eQuals badge
        </span>
        <span aria-hidden="true" className="text-[#8aa0b6]">
          →
        </span>
        <span className="text-[15px] font-bold text-[#2DD4BF]">
          RPL at participating universities
        </span>
      </div>
      <p className="mx-auto mt-6 max-w-[740px] text-center text-[12.5px] italic text-[#8aa0b6]">
        In design — the My eQuals integration is on the 2027 roadmap. NTLSN
        issues the verified record of demonstrated effort; RPL recognition
        grows as universities and bodies (including Advance HE) adopt the
        benchmark.
      </p>
    </section>
  );
}
