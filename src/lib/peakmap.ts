/**
 * #ntlsn-peakmap — "How the peak bodies thread the sector together."
 * (Epic 1.2 PR-D), verbatim from the production ntlsn-peakmap-script patch:
 * five peak bodies on the left, three sector categories on the right, every
 * body threaded to every category.
 */

/** [name, one-line role] — the five peak bodies, in production order. */
export const PEAK_BODIES: ReadonlyArray<readonly [string, string]> = [
  ["CAULLT", "Councils of L&T leaders"],
  ["HERDSA", "Research & development"],
  ["ASCILITE", "Technology in tertiary ed"],
  ["ACODE", "Open, distance & digital learning"],
  ["Advance HE", "Fellowships & the PSF"],
];

/** [emoji, label, href] — the three categories the bodies thread into. */
export const PEAK_CATEGORIES: ReadonlyArray<readonly [string, string, string]> =
  [
    ["🏛️", "Institutions", "#ntlsn-network"],
    ["🏅", "Recognition", "/recognition-navigator.html"],
    ["🤝", "Partnerships", "#ntlsn-sap"],
  ];

/** Node y-centres in the 880×480 viewBox (production's PY/CY). */
export const PEAK_Y = [52, 148, 244, 340, 436] as const;
export const CAT_Y = [120, 244, 368] as const;
