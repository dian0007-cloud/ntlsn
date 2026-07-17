/**
 * #ntlsn-scope — "Clear on scope" (Epic 1.2 PR-E), ported verbatim from the
 * ntlsn-scope-script patch: what NTLSN does vs what it is not, with the
 * no-data-harvesting footer line.
 */
const SCOPE_DOES: readonly string[] = [
  "Maps the sector’s open teaching & learning work",
  "Helps you find, use and adapt it",
  "Connects you to peers across the sector",
  "Helps your teaching be recognised, on open standards",
];

const SCOPE_NOT: readonly string[] = [
  "A learning management system",
  "A student information system",
  "A credentialing authority",
  "A store of — or owner of — your data",
];

function ScopeList({
  items,
  colour,
  mark,
}: {
  items: readonly string[];
  colour: string;
  mark: string;
}) {
  return (
    <ul className="list-none">
      {items.map((text) => (
        <li key={text} className="flex items-start gap-[9px] py-1.5">
          <span
            aria-hidden="true"
            className="flex-none text-[13px] leading-normal font-extrabold"
            style={{ color: colour }}
          >
            {mark}
          </span>
          <span className="text-[13.5px] leading-normal text-[#CBD8E6]">
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ScopeSection() {
  return (
    <section
      id="ntlsn-scope"
      aria-labelledby="ntlsn-scope-heading"
      className="relative mx-auto max-w-[92rem] scroll-mt-20 px-6 py-12"
    >
      <div className="mx-auto max-w-[760px] rounded-[18px] border border-white/[0.08] bg-[#0f1f3a] px-[30px] pt-[30px] pb-[26px]">
        <div className="mx-auto mb-[22px] max-w-[560px] text-center">
          <p className="mb-2.5 text-[11px] font-extrabold tracking-[1.6px] text-[#8AA0B6] uppercase">
            Clear on scope
          </p>
          <h2
            id="ntlsn-scope-heading"
            className="mb-[9px] text-[clamp(20px,2.6vw,28px)] leading-[1.2] font-extrabold text-white"
          >
            A navigator and a connector — not a system of record.
          </h2>
          <p className="text-sm leading-relaxed text-[#AEBFCE]">
            So you know exactly what you are adopting. NTLSN complements the
            systems you already run; it never replaces them.
          </p>
        </div>
        <div className="flex flex-wrap gap-6">
          <div className="min-w-[240px] flex-1">
            <h3 className="mb-2 text-[11px] font-extrabold tracking-[0.6px] text-[#2DD4BF] uppercase">
              What NTLSN does
            </h3>
            <ScopeList items={SCOPE_DOES} colour="#2DD4BF" mark="✓" />
          </div>
          <div className="min-w-[240px] flex-1">
            <h3 className="mb-2 text-[11px] font-extrabold tracking-[0.6px] text-[#8AA0B6] uppercase">
              What NTLSN is not
            </h3>
            <ScopeList items={SCOPE_NOT} colour="#8AA0B6" mark="×" />
          </div>
        </div>
        <p className="mx-auto mt-5 max-w-[600px] border-t border-white/[0.07] pt-4 text-center text-[12.5px] leading-normal font-semibold text-[#8AA0B6]">
          It does not store, sell or own your data — personalisation lives in
          your browser. Your work stays yours, on open standards, with no
          lock-in.
        </p>
      </div>
    </section>
  );
}
