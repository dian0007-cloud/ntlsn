# NTLSN MCP — Increment 1 plan (read-only tools + Schema.org Event)

**Status:** IMPLEMENTED 2026-07-10 on branch `feature/mcp-publish-tools` (PR pending review/merge). The original plan is below; see **As-built deltas** at the foot for what landed vs what was deferred.
**Scope:** a small, safe, cost-aware first increment on the existing MCP server.
**Strategy parent:** [mcp-publish-strategy.md](./mcp-publish-strategy.md).

## Goal / non-goals

**Goal:** make NTLSN's sector data genuinely consumable by Claude (and other MCP clients) and add the first high-value read-only tools — without auth, without new infrastructure, and with cost controls so external look-ups can't run up the Netlify bill.

**Non-goals (explicitly deferred):** OAuth, MCP-Registry listing, resources/resource-templates, a `people`/`speakers` tool (no data source), per-event stream-URL mapping (no data source), source-rebuild/CSP work.

## Where we start (grounded)

`netlify/functions/mcp.js` already provides, in production at `/.netlify/functions/mcp`:
- **3 tools:** `upcoming_events`, `search_archive` (1,431 ALTC/OLT works), `universities`.
- **Plain JSON-RPC 2.0 over HTTP POST** + GET info; `protocolVersion: "2024-11-05"`.
- **Data layer reused as-is:** `getJSON(file)` reads CORS-open `/data/*.json` from the deploy URL with a 60s module cache + 8s timeout. `clampLimit(v, dflt)` clamps to [1,100].
- **Available datasets not yet exposed:** `data/rcf.json` (~7KB), `data/ltr-bestpractice.json` (~15KB).
- **Already-generated JSON-LD:** `events-ld.json` (Schema.org `Event` ItemList) — a ready-made shape to echo from a tool.
- **Test gate:** `npm test` runs `netlify/functions/test/mcp.test.js` and blocks deploy on red.

## Step 0 — verify the transport (the make-or-break item, do this FIRST)

The current endpoint is a simplified JSON-RPC-over-POST at the *original* protocol version. The Claude connector expects **Streamable HTTP** (content negotiation, `Mcp-Session-Id`, `Accept: application/json, text/event-stream`). Adding tools is wasted effort if the connector can't see the server.

**Action (verification, ~10 min, no code):**
1. Point Claude Desktop (or the API `mcp_servers` connector) at `https://www.ntlsn.com/.netlify/functions/mcp` and try `tools/list` + an `upcoming_events` call.
2. **Two outcomes:**
   - **(a) It works as-is** → transport is fine; skip to Step 1 and just add tools. Cheapest path.
   - **(b) It doesn't connect** → adopt **stateless Streamable HTTP** per Netlify's documented pattern (single endpoint, POST, `sessionIdGenerator` undefined, respond with plain JSON or SSE as negotiated; bump `protocolVersion` to current, e.g. `2025-06-18`/`2025-11-25`). This is a transport-only change — the `callTool` bodies and `TOOLS` array stay identical.

**Why stateless:** Netlify Functions have no long-lived process; the stateless/transactional form is the documented serverless fit and keeps cold-start behaviour simple.

> This is the one place I'm flagging genuine uncertainty. I won't write transport code until Step 0 tells us which branch we're in.

## Step 1 — new read-only tools (data NTLSN already has)

Add to the `TOOLS` array and `callTool()`. All reuse `getJSON`/`clampLimit`.

| Tool | Input | Returns | Data source |
|---|---|---|---|
| `event_detail` | `{ id: integer }` | one event as a **Schema.org `Event`** object (Step 2) | `data/events.json` (+ universities join) |
| `events_by_type` | `{ type: string, limit?: int }` | upcoming events of a given type (`conference`/`workshop`/`webinar`/`symposium`…) | `data/events.json` |
| `archive_work` | `{ id: integer }` | one ALTC/OLT work by id | `data/ltr.json` |
| `research_capability` | `{ query?: string }` | RCF entries (search optional) | `data/rcf.json` *(newly exposed)* |
| `best_practice` | `{ query?: string }` | best-practice entries | `data/ltr-bestpractice.json` *(newly exposed)* |
| `scholarly_lookup` | `{ orcid?, doi?, ror? }` | curated pass-through to ORCID / Crossref / ROR public APIs (Step 3) | external |

Notes:
- `events_by_type` and the two archive/ror passes are cheap wins on data we already ship.
- `scholarly_lookup` is the only tool that hits **external** APIs — it carries the cost controls in Step 3.
- The existing `universities` tool already covers institutions (incl. Traditional Country) — no duplicate.

## Step 2 — Schema.org `Event` JSON-LD from event tools

Map `event_detail` (and optionally `upcoming_events` items) to Schema.org `Event`, joining `universities.json` for organiser/place. Field mapping:

| Schema.org `Event` | NTLSN source |
|---|---|
| `@type` | `"Event"` |
| `name` | `title` |
| `startDate` / `endDate` | `date` / `endDate` |
| `description` | `desc` |
| `url` | `url` |
| `organizer` / `location` (Place → `name`, `address`) | join `universities.json` on `uni` → `name`, `city`, `state` |
| `eventStatus` | `EventScheduled` (or `Cancelled` if we add that state) |

**Honest omission:** `eventAttendanceMode` + `VirtualLocation` (stream URL) and `performer` (speakers) are **not populated** — `events.json` holds neither a per-event stream URL nor speakers. When that data exists (Zoom-pilot linkage / a speakers dataset), the mapping extends trivially; it is a data task, not an MCP task. Reusing the `events-ld.json` shape keeps the web payload and the agent payload identical where they overlap.

## Step 3 — cost controls (keeps the Netlify bill flat)

Applied to `scholarly_lookup` (and any future external tool). Patterns lifted from the verified `academic-tools-mcp` source:
- **Negative-cache definitive 404s for 24h** — stops agents re-querying a DOI/ORCID that doesn't exist and burning invocations. (Reuse the module-scope `cache` Map; add a small negative-cache Map with a 24h TTL.)
- **Single-flight** — coalesce identical concurrent look-ups into one fetch.
- **Per-provider concurrency cap** — max N in-flight ORCID/Crossref requests; N+1 fails fast with `{ error, retryable: true, backpressure: true }` so the agent backs off.
- **One transparent retry** honouring `Retry-After`, then fail-soft.
- Keep the existing 8s timeout + the `console.error` diagnostic (audit v2 L9 already landed).

These need **no edge/CDN product** — pure in-function state, same as the existing `getJSON` cache.

## Step 4 — tests (the deploy gate)

Mirror the existing `netlify/functions/test/mcp.test.js` patterns. Add one test per new tool covering the happy path + edge:
- `event_detail`: found (assert Schema.org `@type === "Event"` + a joined `organizer.name`) and not-found (error / empty).
- `events_by_type`: filters correctly; unknown type → empty.
- `archive_work`, `research_capability`, `best_practice`: found + not-found.
- `scholarly_lookup`: mocked upstream — happy path, **404 negative-cache hit**, and **backpressure fast-fail**.
- `clampLimit` edge cases (already exported; pin 0/negative/non-numeric/fractional — audit v2 L10).

Because `netlify.toml` build = `npm test`, a red test blocks production deploy.

## What "done" looks like for this increment
1. Step 0 resolved (transport verified working, or modernised to stateless Streamable HTTP).
2. New tools from Step 1 live and returning data; event tools return Schema.org `Event`.
3. `scholarly_lookup` carries the Step 3 cost controls.
4. New tests green; full suite green; deploy gate passes.
5. No change to the LIVE/FREE/OPEN-SOURCE hero claims, Acknowledgement elements, or section order; CSP not loosened; Australian English.

## Open verification questions (for Seb / before build)
1. **Transport** (Step 0) — does the current endpoint already work with Claude's connector, or do we modernise? *This decides the size of the increment.*
2. Do we want `scholarly_lookup` to **chain** identifiers (ORCID → works → DOIs → Crossref), or stay single-hop in v1? Single-hop is cheaper and simpler; chaining is more useful but more external calls.
3. Is exposing `rcf` / `best_practice` as their own tools wanted, or should they stay internal for now?

---

**Next action on approval:** I implement Steps 1–4 on a fresh branch off `origin/main` (transport code deferred until Step 0's answer), run `npm test`, and hand you a PR to review/merge the same way as PR #21.

---

## As-built deltas (2026-07-10) — what actually landed on `feature/mcp-publish-tools`

**Landed — 5 new read-only tools on the existing zero-dependency handler:**
- `event_detail(id)` → Schema.org `Event` JSON-LD matching the `events-ld.json` convention (organiser/place joined from `universities.json`); `null` for unknown id.
- `events_by_type(type, limit)` → upcoming events of one type.
- `best_practice(query, limit)` → searches `ltr-bestpractice.json` (80 works).
- `recognition_framework` → returns the RCF v1.0 document (`rcf.json`).
- `scholarly_lookup(orcid | doi | ror)` → external ORCID / Crossref / ROR public-API look-ups.

**Cost controls (in-process; no edge product):** 24h negative cache of 404s, single-flight coalescing, fail-fast per-provider concurrency cap (backpressure), one transparent retry honouring `Retry-After`, 8s timeout. 404s return a clean `notFound` result (agent stops retrying) rather than the generic error path. Directly addresses the "Netlify is costing too much" concern for external look-ups.

**Tests:** 17 new in `mcp.test.js` (27 mcp tests / 94-suite green). `npm test` deploy gate unchanged.

**Deferred from this plan → Increment 1b:**
- `archive_work` — **dropped**: `ltr.json` works carry no stable id (archive stays served by `search_archive`).
- `library_access` — **deferred**: `library-resolvers.json` has rows CLAUDE.md flags for re-verification (UNE/VU/Batchelor/Adelaide); won't expose unverified data via a public tool.
- **Transport modernisation (Streamable HTTP)** — **deferred**: current server is plain JSON-RPC at `protocolVersion 2024-11-05` and works; full Streamable HTTP needs either the `@modelcontextprotocol/sdk` dependency (breaks the deliberate zero-dep design) or careful hand-rolled spec compliance + real Claude-connector testing — not doable from this environment. Shipped additive-only to keep the PR zero-risk. (`serverInfo.version` → `1.1.0`.)
- `VirtualLocation` / `eventAttendanceMode` / speakers in `event_detail` — needs data NTLSN doesn't yet hold.
