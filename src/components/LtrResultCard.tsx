import type { LtrRecord } from "../lib/ltrSearch";

/**
 * One Learning & Teaching Repository search result — the card treatment
 * shared by #ntlsn-archive (amber accent) and #ntlsn-bestpractice (green
 * accent). Every card links out to the full text at ltr.edu.au.
 */
export default function LtrResultCard({
  record,
  accent,
  borderClass,
}: {
  record: LtrRecord;
  /** Accent colour for the "full text at LTR" affordance. */
  accent: string;
  /** Border utility, e.g. "border-amber/[0.16]". */
  borderClass: string;
}) {
  return (
    <li>
      <a
        href={record.u}
        target="_blank"
        rel="noopener noreferrer"
        className={`mb-2 block rounded-xl border bg-[#2a2218] px-4 py-3.5 no-underline ${borderClass}`}
      >
        <span className="block text-[15px] leading-snug font-semibold text-white">
          {record.t}
        </span>
        <span className="mt-1 block text-[13px] leading-snug text-[#b3a48c]">
          {record.a}
          {record.a && record.y ? " · " : ""}
          {record.y}{" "}
          <span style={{ color: accent }}>→ full text at LTR</span>
        </span>
      </a>
    </li>
  );
}
