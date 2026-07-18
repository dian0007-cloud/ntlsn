/**
 * Learning & Teaching Repository search (Epic 1.2 PR-C) — the shared lazy
 * loader + AND-term matcher behind #ntlsn-archive (data/ltr.json, ~1,431
 * records) and #ntlsn-bestpractice (data/ltr-bestpractice.json, 80 records),
 * ported from the ntlsn-archive-script / ntlsn-bestpractice-script patches.
 *
 * The datasets stay OUT of the JS bundle on purpose (ltr.json alone is
 * ~272KB against the §1.3 "JS < 350KB" budget): exactly like production,
 * they are fetched from /data/*.json on first interaction, cached for the
 * session, and every failure is soft — search simply returns nothing until
 * a fetch succeeds. Record shape {t,a,y,u} = title, authors, year, URL;
 * every result links out to the full text at ltr.edu.au.
 */

export interface LtrRecord {
  /** Title. */
  t: string;
  /** Authors. */
  a: string;
  /** Year. */
  y: string;
  /** Full-text URL at the Learning & Teaching Repository. */
  u: string;
}

const cache = new Map<string, LtrRecord[]>();
const loading = new Set<string>();

/**
 * Lazily fetch a repository dataset. Calls `onReady(records)` as soon as
 * the data is available (immediately when cached). Fail-soft: errors are
 * swallowed and `onReady` is simply never called — the patch behaved the
 * same way.
 */
export function loadLtr(
  path: string,
  onReady: (records: readonly LtrRecord[]) => void,
): void {
  const cached = cache.get(path);
  if (cached) {
    onReady(cached);
    return;
  }
  if (loading.has(path)) return;
  loading.add(path);
  fetch(path)
    .then((res) => res.json())
    .then((data: unknown) => {
      loading.delete(path);
      if (!Array.isArray(data)) return;
      const records = data as LtrRecord[];
      cache.set(path, records);
      onReady(records);
    })
    .catch(() => {
      loading.delete(path);
    });
}

/**
 * The patches' exact matcher: split the query on whitespace and require
 * EVERY term as a case-insensitive substring of title+authors. An empty
 * query returns [] for the archive (type-to-search) — the best-practice
 * section passes emptyReturnsAll to browse all 80 guides.
 */
export function searchLtr(
  records: readonly LtrRecord[],
  query: string,
  options: { emptyReturnsAll?: boolean; limit?: number } = {},
): LtrRecord[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) {
    return options.emptyReturnsAll ? [...records] : [];
  }
  const limit = options.limit ?? Number.POSITIVE_INFINITY;
  const out: LtrRecord[] = [];
  for (const record of records) {
    const hay = `${record.t} ${record.a}`.toLowerCase();
    if (terms.every((term) => hay.includes(term))) {
      out.push(record);
      if (out.length >= limit) break;
    }
  }
  return out;
}
