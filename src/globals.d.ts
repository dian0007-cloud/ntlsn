/**
 * Build-time constants injected by vite.config.ts (`define`).
 */

/** data/ltr.json length — the rescued SoTL archive's work count. */
declare const __NTLSN_SOTL_WORKS__: number;

/** data/ltr-bestpractice.json length — the Best Practice Guides count. */
declare const __NTLSN_BP_GUIDES__: number;

/**
 * Archive "Browse by theme" chip counts (PR-D): topic → number of matching
 * ltr.json records, computed at build time with the archive's own matcher.
 */
declare const __NTLSN_ARCH_TOPIC_COUNTS__: Record<string, number>;
