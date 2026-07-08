# NTLSN Serverless Backend — Phase 1 Audit v2 (second pass on hardened code)

**Scope:** the NTLSN Netlify Functions backend after PR #10's hardening — `netlify/functions/*`
(9 functions: `orcid-oauth-start`, `orcid-callback`, `zoom-oauth-start`, `zoom-oauth-callback`,
`zoom-meeting-signature`, `zoom-webhooks`, `mcp`, `me`, `zoom-live`), `netlify/lib/*`
(`store`, `session`, `crypto`, `pkce`, `cookies`), `_headers`, `_redirects`, `netlify.toml`.
**Base:** `origin/main @ c2b306d` (PR #10's hardening + tests are included).
**Status of the prior pass:** PR #10 (`docs/backend-audit.md`) found and fixed 4 Medium + 13 Low + 12 Info
issues (fail-open webhook, CRC signing oracle, unauth signature oracle, unanchored cookie regex, no PKCE,
no session, …). **This v2 pass finds what that hardening missed** — chiefly subtle correctness/logic
bugs in the *newly added* `lib/` layer and functions, and test-coverage gaps around the new code.

**Method:** 12-dimension fan-out audit (one auditor per backend unit) → 37 raw findings → each
adversarially verified by an independent skeptic that must **refute unless certain**.
49 agents, ~2.15M tokens, ~49 min. **37 raised → 29 survived → 8 refuted.**

### Severity (post-verification)
| Severity | Count |
|---|---|
| Critical | 0 |
| High | 0 |
| **Medium** | **3** |
| Low | 24 |
| Info | 2 |

No Critical/High: PR #10 closed the exploitable classes; what remains is latent design/correctness
defects and coverage gaps that bite at scale or on misconfiguration, not live exploits (the pilot is
still unconfigured). The three Mediums are the priority; the Lows are mostly "harden the new code +
test it."

### Disposition legend
🔧 = fixing in Phase 2 (this PR) · 📋 = Phase 3 proposal (needs Seb's sign-off) · 📝 = document only

### Phase 2 outcome (all 🔧 items landed; test suite 55 → 73, all green)
Every 🔧 finding below is fixed on branch `backend-security-audit` (7 commits, base `origin/main @ c2b306d`),
each with a regression test. Documented/Phase-3 items carry their disposition. The Netlify build now runs
`npm test`, so a function regression blocks deploy. Net new behaviour to flag for review:
- `me.js` returns **503** (was 200) when `NTLSN_SESSION_SECRET` is unset — surfaces a broken deploy to
  5xx alerting. The page already treats non-2xx as "not signed in", so UX is unchanged.
- `netlify.toml` build command is now `npm test` (was a no-op echo) — **production deploys now fail on a
  red test suite**. Revert to the echo if you'd rather gate via CI status checks instead.
- `recording.completed` keys changed from `${meeting}` to `${account_id}:${meeting}` (enables deauth
  cleanup; no reader exists, so no downstream impact).

---

## Medium

### M1 — `app_deauthorized` does unbounded sequential `list`+`delete` before acking the webhook
**File:** `netlify/functions/zoom-webhooks.js:57-59` · **Category:** efficiency/availability · 🔧
For an account with many registrants, `applyEvent` is `await`ed before the 200, and inside it
`reg.list({prefix})` pages sequentially then a serial `for…await reg.delete()` issues N round-trips.
At ~30-50 ms/delete the 10 s Netlify timeout is exhausted at ~150-300 registrants — well within a real
symposium. Zoom then retries (re-running the whole wipe) and may disable the endpoint; PII is left
partially un-purged (Zoom Marketplace data-compliance requirement unmet). Tests use the synchronous
memStore so it never surfaces.
**Fix:** bounded-parallel deletion (chunks of ~50 via `Promise.all`) with a ceiling. Full fix (ack
first, cleanup in a Background Function) → 📋 Phase 3.

### M2 — `app_deauthorized` does not delete recording share URLs (data-compliance gap)
**File:** `netlify/functions/zoom-webhooks.js:47, 51-61` · **Category:** compliance/data-retention · 🔧
`recording.completed` writes `zoom-recordings` keyed by bare `meeting` (no account), so the deauth
wipe — which matches by `${acct}:` prefix — cannot find or delete a deauthorized tenant's recording
records. (Same issue touches `zoom-live`, but that's read by `zoom-live.js` via bare `meetingNumber`,
so scoping it needs an account→meetings index.)
**Fix:** re-key `zoom-recordings` by `${account_id}:${meeting}` and list+delete on deauth (recordings
have no readers, so safe). The `zoom-live` index → 📋 Phase 3 (needs `zoom-live.js` coordination).

### M3 — `persistTenant` (the core at-rest-security feature) is never exercised by any test
**File:** `netlify/functions/zoom-oauth-callback.js:19-46` · **Category:** test-coverage · 🔧
No test reaches the composition `fetch /users/me → extract account_id → enc.encrypt(refresh_token) →
store.setJSON`. The success test makes `durable()` false and the mock has no `account_id`, so it bails
at line 20/35. A regression that stores the refresh token in plaintext, keys by the wrong field, or
swaps `account_id||id` precedence would pass the whole suite.
**Fix:** a test that forces the durable path (`NETLIFY=1` + `NTLSN_TOKEN_ENC_KEY`), routes the fetch
mock per-URL, and asserts the stored blob round-trips through `enc.decrypt`.

---

## Low

### Auth/session/crypto
- **L1 — `session.verify` accepts never-expiring tokens on `exp:0`/missing/non-numeric `exp`** (`netlify/lib/session.js:37`). Truthiness gate bypasses the check; MAC-bound so not live-exploitable, but a future "invalidate via `exp:0`" signer would mint a *permanent* session. 🔧 Gate on presence+type, reject missing `exp`.
- **L2 — `store.durable()` reports `onNetlify`, not actual Blobs availability** (`netlify/lib/store.js:74`). When Blobs fails to import or `getStore` throws, `store()` silently falls back to per-instance `_mem` while `durable()` still returns true → `persistTenant` writes the refresh token to ephemeral memory (auto-refresh silently dead), rate-limit/live state split-brain across instances, all masked by healthy 200s. 🔧 Make `store()` surface real construction success (`open(name)→{store,durable}`) and log the fallback.

### Zoom webhooks
- **L3 — signature verify throws (500) on a non-ASCII `x-zm-signature` of matching *string* length** (`zoom-webhooks.js:109-112`). The length guard compares UTF-16 code units; `timingSafeEqual` compares UTF-8 bytes; a single ≥0x80 byte passes the guard then throws `RangeError` → opaque 500 instead of 401. Trivially triggerable by any unauthenticated caller. (The prior audit's Appendix certified this guard "correct" — it was wrong.) 🔧 Compare `Buffer` byte lengths + wrap in try/catch → 401.
- **L4 — `app_deauthorized` registrant cleanup is a serial per-key loop that times out for large accounts** (`zoom-webhooks.js:57-59`). Same root cause as M1; the PII-retention tail is the compliance sting. 🔧 (folded into M1's bounded-parallel fix.)

### Zoom signature / rate-limit
- **L5 — durable rate-limit blob keys (`${orcid}:${windowId}`) are never GC'd** (`zoom-meeting-signature.js:52-56`). ~1,440 permanent keys/day per minting user; unbounded Blobs growth. 🔧 Key by `${orcid}` only and overwrite one `{windowId,n}` record.
- **L6 — in-memory rate-limit `_mem` Map never evicts per-orcid entries** (`zoom-meeting-signature.js:62-65`). Memory leak across warm instances during a Blobs hiccup. 🔧 Delete empty arrays; cap `_mem.size`.
- **L7 — non-atomic read-modify-write race lets a single user exceed the per-window cap** (`zoom-meeting-signature.js:52-56`). Burst concurrency reads stale `count`, all pass the gate, all overwrite. Netlify Blobs has no CAS. 📝 Accepted limitation (rate limit is secondary; session gate + allowlist are primary). Add a concurrent test to characterize; move to edge rate-limitting in Phase 3.

### MCP
- **L8 — `upcoming_events` silently drops in-progress multi-day events** (`mcp.js:73`). Filters on `e.date` only; an event on day 2..N of its span is dropped while still running. 🔧 Filter on `e.endDate || e.date`.
- **L9 — tool-error path says "see server logs" but nothing is logged** (`mcp.js:142`). There are zero `console.*` calls in the backend. 🔧 `console.error` the failure server-side, keep the client message generic.
- **L10 — `clampLimit` edge cases (0→1, negative→1, non-numeric→default, fractional→floor) untested** (`mcp.js:62`). 🔧 Export + unit-test.

### Error-handling consistency (the "200-on-misconfig masks monitoring" anti-pattern)
- **L11 — `me.js` returns `200 signedIn:false` for everyone when `NTLSN_SESSION_SECRET` is unset** (`me.js:21`). Fail-*safe* but invisible — looks identical to a normal unsigned request. 🔧 Return 503 (or a `configured:false` field) when the secret is missing.
- **L12 — `orcid-callback` returns 200 JSON on a top-level navigation when env is partially unset** (`orcid-callback.js:46-50`). Same anti-pattern PR #10 fixed in the *start* endpoints; the callback (reached by the provider's 302) was missed. 🔧 302 to `?auth_error=…`.
- **L13 — `zoom-oauth-callback` returns 200 JSON when env unset** (`zoom-oauth-callback.js:72`). Same as L12. 🔧 302 to `?zoom_error=…`.
- **L14 — `zoom-live` swallows all blob errors into `live:false`** (`zoom-live.js:28`). Conflates "store error" with "not live"; no operator signal at the exact moment the LIVE badge matters. 🔧 Log the error server-side (fail-safe `live:false` kept).

### Correctness (Zoom OAuth)
- **L15 — best-effort `persistTenant` runs in the redirect's critical path and can timeout after the single-use code is consumed** (`zoom-oauth-callback.js:92`). The 8 s `/users/me` fetch + blob write can exceed the function budget after the code is spent. 🔧 Bound `persistTenant` with a tight overall ceiling (Promise.race ~3 s); JWT-decode `account_id` to skip `/users/me` → 📋 Phase 3 (verify token format first).

### Test-coverage (the bulk of the Lows)
- **L16 — Zoom token-exchange catch/timeout branch (502 'unreachable') untested** (ORCID + Zoom callbacks). 🔧
- **L17 — durable (Netlify Blobs) rate-limit path untested and diverges from the tested in-memory path** (`zoom-meeting-signature.js:49`). Fixed-window (prod) vs sliding-window (tested) — test asserts a policy prod doesn't enforce. 🔧 Inject a fake durable store.
- **L18 — `zoom-oauth-start.js` has no test file at all** (entire Zoom-OAuth start endpoint untested; `orcid-oauth-start` is fully covered). 🔧 Mirror the ORCID test.
- **L19 — `zoom-oauth-callback` env-unset 200 branch + cookie-clear-on-502 unasserted**. 🔧 (after L13's 302 fix)
- **L20 — webhook has no test for a forged event with missing `ts`/`signature` headers; meeting allowlist tested only for rejection, not acceptance.** 🔧 (cheap; were refuted but worth pinning)

---

## Info
- **I1 — CSP `script-src 'unsafe-inline' 'unsafe-eval'`** (`_headers:9`). Architectural trade-off of the inline React bundle; effective XSS containment impossible until the Epic 1 source rebuild. 📝 (carry from v1 I10.)
- **I2 — `CLAUDE.md` still documents the SPA fallback `_redirects` deliberately removed**. The `/* → /404.html 404` change is *correct* for the multi-page static site; only the docs are stale (regression hazard). 🔧 Update CLAUDE.md.

---

## Appendix A — Refuted (8) — adversarial skeptics rejected these
- ORCID-callback echoing upstream HTTP status (not sensitive; status code only).
- Refresh-token key falling back to user UUID when `account_id` absent (still a valid unique key).
- MCP "cache stampede" / no single-flight (warm instances; minor).
- **Node 20 EOL** — refuted as "not a code defect," but it *is* EOL (2026-04-30); recorded as a 📋 Phase 3 maintenance item (bump `NODE_VERSION` to 22) rather than a silent runtime change.
- CSP `*.zoom.us` wildcard (SDK needs it).
- `durable()` over-report — **duplicate of L2**, folded in.
- (2 test-coverage refutations folded into L20 as cheap-to-add.)

## Appendix B — Verified-correct carryover (checked again, still safe)
- ORCID + Zoom CSRF state (double-submit HttpOnly cookie, exact-match `readCookie`, constant-time compare, cleared on all callback exit paths). ✅
- Webhook fail-closed (500 before routing when secret missing) + CRC signing-oracle closure (`PLAINTOKEN_RE` excludes `:` so a `v0:ts:body` plainToken is rejected). ✅
- Webhook HMAC over `event.body` (Netlify delivers JSON as plain UTF-8) + 5-min replay window (seconds). ✅
- Signature endpoint session-gate + allowlist + role-0-only + rate-limit. ✅
- AES-256-GCM at-rest (random IV, auth-tag, tamper throws). ✅

## Phase 3 proposals (need Seb's sign-off before building)
1. **Zoom deauth as a Background Function** — ack the webhook in <100 ms, do the wipe asynchronously so large accounts can't timeout (full fix for M1/L4).
2. **Account→meetings index** so `app_deauthorized` can also clean `zoom-live` (completes M2) and so recordings/live are fully account-scoped.
3. **Decode `account_id` from the Zoom access-token JWT** to skip the `/users/me` round-trip in `persistTenant` (verify Zoom's current token format first) — removes the critical-path network call (L15).
4. **Edge/CDN rate-limiting** for the signature endpoint — atomic, vs the current best-effort racy counter (L7).
5. **Bump Functions runtime Node 20 → 22 LTS** (Node 20 is EOL).
6. **Epic 1 source rebuild** → drop CSP `'unsafe-inline'`/`'unsafe-eval'` (I1).
7. **ORCID commercial-relationship wall**: the Public API is non-commercial; confirm ORCID membership before any *paid* gate depends on ORCID sign-in (carry from v1).
