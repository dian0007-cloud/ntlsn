/**
 * #ntlsn-fnawards — "First Nations teaching excellence: who recognises it?"
 * (Epic 1.2 PR-D). FIRST NATIONS CONTENT — CULTURAL CARE APPLIES:
 *
 *   - Every figure, framing and sentence here is VERBATIM from the
 *     production ntlsn-fnawards-script and ntlsn-fnmap-script patches
 *     (HTML entities decoded only). Do not truncate, abbreviate, reword or
 *     "tidy" any of it.
 *   - The attribution to Dianati & Bolt (2025), The Australian Journal of
 *     Indigenous Education, and the closing line "the design of First
 *     Nations recognition remains First Nations-led" are word-for-word and
 *     load-bearing.
 *   - If anything here ever looks like it needs correcting, flag it to Seb
 *     rather than editing.
 */

/** [big number, caption, accent colour] — the four audit stat cards. */
export const FN_STATS: ReadonlyArray<readonly [string, string, string]> = [
  ["43", "universities audited", "#8fb081"],
  ["17", "have a dedicated First Nations teaching award", "#9cbb8c"],
  ["5", "partial or proxy recognition only", "#e6a33c"],
  ["21", "no dedicated recognition at all", "#c66c3f"],
];

/**
 * The distribution bar segments — production's exact widths (30.2% / 11.6%
 * / 58.2%) and colours for dedicated / partial / none.
 */
export const FN_BAR_SEGMENTS: ReadonlyArray<readonly [string, string]> = [
  ["30.2%", "#9cbb8c"],
  ["11.6%", "#e6a33c"],
  ["58.2%", "#c66c3f"],
];

/** "Five ways the sector frames the award" — verbatim chips. */
export const FN_FRAMINGS: readonly string[] = [
  "Reconciliation",
  "Knowledge & Culture",
  "Excellence & Achievement",
  "Advancement",
  "Sovereignty & Empowerment",
];

/** Peer-reviewed grounding for the audit (rendered as the source line). */
export const FN_SOURCE = {
  doi: "https://doi.org/10.55146/ajie.v54i1.1073",
  citation:
    "Dianati & Bolt (2025), The Australian Journal of Indigenous Education",
} as const;
