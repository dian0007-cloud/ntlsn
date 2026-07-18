/**
 * Acknowledgement of Country — proper in-flow markup near the top of the
 * page, replacing the runtime-injected fixed strip. Wording is verbatim from
 * production (asserted in tests/smoke.spec.js test (c)) — per CLAUDE.md it
 * must never be stripped, abbreviated or reordered for layout convenience.
 *
 * Keeps the production id (#ntlsn-ack-strip) and aria-label so existing
 * anchors/tests keep working after cutover.
 */
export default function Acknowledgement() {
  return (
    <div
      id="ntlsn-ack-strip"
      role="note"
      aria-label="Acknowledgement of Country"
      className="border-b border-[#d8965a]/40 bg-gradient-to-r from-[#13243f] to-[#0f1f3a] px-5 py-3 text-center text-[12.7px] leading-relaxed tracking-[0.1px] text-[#d3dde8]"
    >
      <span aria-hidden="true" className="text-[#d8965a]">
        ◇
      </span>{" "}
      NTLSN acknowledges the Traditional Custodians of the lands, waters and
      skies across Australia on which we live, work, teach and learn — and pays
      respect to Elders past and present, honouring their continuing connection
      to Country, knowledge and community.
    </div>
  );
}
