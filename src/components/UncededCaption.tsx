/**
 * "Unceded Lands" caption — the credibility-critical element under the map
 * (asserted verbatim by tests/smoke.spec.js test (c): id `unceded-caption`,
 * "Unceded Lands", "sovereignty was never ceded").
 *
 * This folds the production ntlsn "Unceded Lands" patch script into the
 * source tree: exact same id, markup, inline treatment and wording. The
 * Aboriginal flag accent (black/red/yellow) appears here and ONLY here
 * (CLAUDE.md palette rule). Never strip, abbreviate or reorder this element
 * for layout convenience.
 */
export default function UncededCaption() {
  return (
    <div
      id="unceded-caption"
      style={{
        marginTop: "2.5rem",
        paddingTop: "1.75rem",
        borderTop: "1px solid rgba(255,255,255,.06)",
        textAlign: "center",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          height: 4,
          width: 132,
          margin: "0 auto 16px",
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          boxShadow: "0 0 0 1px rgba(255,255,255,.08)",
        }}
      >
        <span style={{ flex: 1, background: "#111" }} />
        <span style={{ flex: 1, background: "#C8102E" }} />
        <span style={{ flex: 1, background: "#e6a33c" }} />
      </div>
      <div
        style={{
          fontSize: 11,
          letterSpacing: ".34em",
          textTransform: "uppercase",
          color: "#e6a33c",
          fontWeight: 700,
        }}
      >
        Unceded Lands
      </div>
      <div
        style={{
          fontSize: ".85rem",
          color: "rgba(255,255,255,.5)",
          margin: ".6rem auto 0",
          maxWidth: "40rem",
          lineHeight: 1.65,
        }}
      >
        Every university mapped here stands on unceded Aboriginal and Torres
        Strait Islander Country. We pay our respects to Elders past, present
        and emerging — sovereignty was never ceded.
      </div>
    </div>
  );
}
