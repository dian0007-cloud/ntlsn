# NTLSN Serverless Backend — Phase 1 Security Audit

**Scope:** 7 Netlify functions powering the ORCID sign-in + Zoom streaming pilot (`symposium-streaming.html`).
**Files:** `orcid-oauth-start.js`, `orcid-callback.js`, `zoom-oauth-start.js`, `zoom-oauth-callback.js`, `zoom-webhooks.js`, `zoom-meeting-signature.js`, `mcp.js`.
**Status:** Pilot is not yet live (ORCID `clientId=''`, Zoom/SDK/webhook secrets unset). Most security impact is therefore **latent** — real defects that become exploitable the moment credentials are configured and the TODO handlers do real work. Fix them before go-live, not after.

---

## Executive summary

| Severity | Count |
|---|---|
| Critical | 0 |
| High | 0 |
| **Medium** | **4** |
| Low | 13 |
| Info | 12 |

No currently-exploitable Critical/High issues exist — chiefly because the pilot is unconfigured and every webhook/route handler is a no-op stub. The four Medium findings are latent design defects on the security-critical paths (webhook authenticity, signature minting, CSRF) that must be corrected before the pilot ships.

### Fix these three first

1. **Webhook fail-open (`zoom-webhooks.js:32`)** — signature verification is wrapped in `if (secret){…}`, so an unset/blank `ZOOM_WEBHOOK_SECRET_TOKEN` accepts *any* forged event. Make verification mandatory (fail closed), matching the CRC branch which already 500s at line 26. Land this before any handler persists state.
2. **Webhook CRC signing oracle (`zoom-webhooks.js:25-29`)** — the `url_validation` branch returns `HMAC(secret, attacker_plainToken)` using the *same key and primitive* as event-signature verification. An attacker sets `plainToken = "v0:<ts>:<raw>"`, reads back a valid signature, and forges any event. Domain-separate the CRC input / key so `HMAC(secret, arbitrary)` is never exposed.
3. **Unauthenticated signature-minting oracle (`zoom-meeting-signature.js:24-49`)** — no server-side auth; the only "gate" is a CORS allowlist, which browsers enforce and `curl` ignores. Any client mints a valid attendee JWT + `sdkKey`. Gate behind the (not-yet-minted) ORCID session and stop treating CORS as authorization.

---

## Per-function health

| Function | CSRF / state | Token handling | Signature verification | Error handling |
|---|---|---|---|---|
| `orcid-oauth-start.js` | ✅ 128-bit state + HttpOnly cookie set; ⚠️ no PKCE | n/a | n/a | ⚠️ returns 200 JSON on nav when unconfigured |
| `orcid-callback.js` | ⚠️ unanchored cookie regex; state check otherwise fail-closed | ❌ no session minted; identity passed/leaked via URL | n/a | ⚠️ no try/catch around exchange + `r.json()` |
| `zoom-oauth-start.js` | ✅ correct double-submit (stale comment only) | n/a | n/a | ⚠️ 200 JSON on nav when unconfigured |
| `zoom-oauth-callback.js` | ⚠️ unanchored cookie regex; cookie cleared only on success | ⚠️ no timeout/try-catch on exchange | n/a | ⚠️ 200 on missing env; opaque 500 on network fault |
| `zoom-webhooks.js` | n/a | n/a | ❌ **fail-open** when secret unset; ❌ **CRC signing oracle** (HMAC itself is correct: `timingSafeEqual` + length guard + 300s freshness) | ✅ CRC fails closed |
| `zoom-meeting-signature.js` | n/a | ❌ **no auth**; CORS treated as access control | ✅ HS256 correct, role hardcoded to 0 (no host escalation); ❌ no `meetingNumber` allowlist, no rate limit | ⚠️ 200 on missing creds |
| `mcp.js` | n/a (public read-only) | n/a | n/a | ⚠️ raw error messages, wrong JSON-RPC channel; no cache/timeout |

---

## Medium

### M1 — Meeting-SDK signature endpoint is an unauthenticated JWT-minting oracle
**File:** `netlify/functions/zoom-meeting-signature.js:9-21, 24-49` · **Category:** authz / cors

**What's wrong:** The handler performs no authentication or authorization before issuing a Zoom Meeting SDK signature. The only control is `cors()`, which never *rejects* — for a disallowed/absent Origin it just falls back `Access-Control-Allow-Origin: ALLOWED[0]` (line 15) and execution continues to the 200 response. CORS is browser-enforced only; it does nothing to a direct HTTP caller. The code comment (lines 9-11) explicitly — and wrongly — claims the allowlist stops "any website" from minting tokens.

**Failure scenario:** Once `ZOOM_SDK_KEY`/`ZOOM_SDK_SECRET` are set, `curl -X POST .../zoom-meeting-signature -d '{"meetingNumber":"88812345678"}'` (no Origin) returns a valid role-0 HS256 signature + `sdkKey` for that meeting. Bounded impact: role is correctly hardcoded to `0` (attendee), and a signature does not bypass a meeting passcode/waiting room — so this abuses *NTLSN's SDK app credentials* (signing oracle, quota exhaustion, scripted mass joins of passcode-less meetings), not arbitrary account takeover.

**Fix:** Validate an authenticated caller (the ORCID session cookie / a signed app token) at the top of the handler; return 401 when absent. Keep the CORS allowlist but make it *reject* disallowed origins, and never treat it as the authorization boundary.

### M2 — Webhook signature verification is fail-open when the secret is unset
**File:** `netlify/functions/zoom-webhooks.js:32-44` · **Category:** webhook-sig

**What's wrong:** The HMAC signature + 300s freshness check is wrapped in `if (secret) { … }` with no `else`. When `ZOOM_WEBHOOK_SECRET_TOKEN` is unset/blank (rotation gap, wrong environment, typo), verification is skipped entirely and execution falls through to the event router, returning 200 for any well-formed JSON POST. This is inconsistent with the CRC handshake, which correctly fails closed (500) when the secret is missing (line 26).

**Failure scenario:** A deploy without the secret configured accepts `POST {"event":"app_deauthorized", …}` with no signature headers as genuine. Impact is nil *today* (all switch cases are `TODO(2027 DB)` no-ops), but the moment `recording.completed` / `registration_created` / `app_deauthorized` do real work (publish replay URLs, store registrants, delete tenant tokens/PII at line 64), this becomes remote event injection. The 200 also masks the misconfiguration from monitoring.

**Fix:** Fail closed — hoist `if (!secret) return 500` before routing so verification is mandatory for all non-handshake events, mirroring line 26. Land this before any handler persists state.

### M3 — CRC handshake is a signing oracle enabling full event-signature forgery
**File:** `netlify/functions/zoom-webhooks.js:25-29` (CRC) vs `:35-39` (verify) · **Category:** webhook-sig

**What's wrong:** The `endpoint.url_validation` branch runs *before* signature verification and returns `crypto.createHmac("sha256", secret).update(msg.payload.plainToken).digest("hex")` for a fully attacker-controlled `plainToken`. The event-verify branch computes the same primitive over the string `v0:${ts}:${raw}`. Because that message is an ordinary string, an attacker sets `plainToken` equal to exactly `v0:<ts>:<raw>` for the event they want, reads the correct HMAC from the CRC response, and replays it as `x-zm-signature`. Same key, same primitive, unauthenticated attacker-chosen input → forgery. (Lengths match: 64 hex + `v0=` = 67 chars, so the length guard and `timingSafeEqual` pass.)

**Failure scenario:** Attacker POSTs `{event:"endpoint.url_validation", payload:{plainToken:"v0:1751690000:{\"event\":\"recording.completed\",…}"}}`, receives `encryptedToken`, then POSTs the forged `recording.completed` body with `x-zm-request-timestamp: 1751690000` and `x-zm-signature: v0=<encryptedToken>`. Freshness + `timingSafeEqual` both pass. No-op today; becomes event injection once handlers do real work.

**Fix:** Never expose `HMAC(secret, arbitrary_input)`. Domain-separate the two paths — derive a distinct key for event-signature verification, or prefix the CRC input so it can never equal a `v0:ts:raw` message the verify path produces. Additionally rate-limit/log `url_validation` and reject it after initial endpoint setup.

### M4 — Unanchored cookie regex weakens the OAuth CSRF state check
**Files:** `netlify/functions/orcid-callback.js:17`, `netlify/functions/zoom-oauth-callback.js:18` · **Category:** csrf

**What's wrong:** Both callbacks extract the state cookie with an unanchored substring match — `cookie.match(/ntlsn_orcid_state=([A-Za-z0-9-]+)/)` and `cookie.match(/ntlsn_zoom_state=([a-f0-9]+)/)` — with no `(?:^|;\s*)` prefix or `(?:;|$)` suffix boundary. Non-global `String.match` returns the *first* header-order occurrence, so a cookie whose name ends in `…ntlsn_zoom_state` (e.g. `evil_ntlsn_zoom_state=<hex>`) is captured instead of the genuine HttpOnly cookie. Since the attacker also supplies the `state` query param, they control both sides of the line-19/20 comparison.

**Failure scenario:** Attacker plants `x_ntlsn_zoom_state=<state_A>` on `ntlsn.com` (subdomain cookie-tossing; a cookie set with a longer `Path` sorts ahead in the header), completes their own OAuth to obtain `(code_A, state_A)`, then lures the victim to `.../zoom-oauth-callback?code=<code_A>&state=<state_A>`. The regex matches the planted value first, the check passes, and the victim is login-CSRF'd into the attacker's identity.

**Caveat / severity note:** The attack is fully contingent on a cookie-write foothold on the domain — which, being a double-submit-cookie scheme, already partially defeats the control regardless of anchoring (an attacker who can plant `x_…` can plant the exact name too). Anchoring is a genuine, cheap hardening that closes the distinct-name gap; the durable fix for login-CSRF is a `__Host-` prefixed cookie plus subdomain hygiene (and, ideally, binding state to a signed/authenticated session).

**Fix:** Parse the Cookie header into name→value pairs and exact-match the key, or anchor: `/(?:^|;\s*)ntlsn_zoom_state=([a-f0-9]+)(?:;|$)/`. Apply to both files; compare with `crypto.timingSafeEqual`.

---

## Low

### L1 — No server-verifiable session; ORCID identity is spoofable via URL
**File:** `netlify/functions/orcid-callback.js:37-41` (+ `symposium-streaming.html:157-163`) · **Category:** session/auth-correctness
On success the callback mints **no** session cookie (line 36 is an explicit `TODO(session)`); it 302-redirects to `/symposium-streaming.html?orcid=<iD>&name=<name>` and clears only the state cookie. The page derives "signed in" purely from `p.get('orcid')` (line 157), validating iD *format* only (line 161), not authenticity.
**Failure scenario:** Visiting `…?orcid=0000-0002-1825-0097&name=Somebody%20Else` renders "✓ Signed in as Somebody Else" with no OAuth round-trip. Currently cosmetic (nothing is gated on this; `esc()` prevents XSS), but any future gating that trusts it is bypassable.
**Fix:** Mint a signed HttpOnly (Secure, SameSite=Lax) session cookie keyed on the verified iD; have the page/`zoom-meeting-signature` derive state from that cookie, never the URL. Must land before any gated functionality.

### L2 — Verified ORCID iD/name leaked in the redirect query string
**File:** `netlify/functions/orcid-callback.js:37-41` · **Category:** token-storage
Same root cause as L1: identity in the URL lands in browser history and CDN/proxy/function access logs. (The Referer vector is weak under the modern `strict-origin-when-cross-origin` default, and ORCID iDs are public identifiers, so this is login-metadata leakage, not secret disclosure.)
**Fix:** Same as L1 — set identity in a cookie, redirect to a clean path, expose state via a `/me` function.

### L3 — ORCID authorization request omits PKCE
**File:** `netlify/functions/orcid-oauth-start.js:17-20` (+ `orcid-callback.js:29`) · **Category:** pkce
No `code_challenge`/`code_challenge_method` on authorize; no `code_verifier` on exchange. Defense-in-depth only (confidential client — the server-held secret is the real barrier), but recommended by current OAuth BCP.
**Fix:** Generate a `code_verifier`, store it alongside `state` in the HttpOnly cookie, send an S256 challenge, include the verifier in the exchange.

### L4 — `orcid-oauth-start` returns 200 JSON on a top-level navigation when unconfigured
**File:** `netlify/functions/orcid-oauth-start.js:11-13` · **Category:** error-handling
Reached via full-page `location.assign(...)` (`symposium-streaming.html:175`). When env vars are unset it returns `200 {error, configured:false}` — the user sees raw JSON in the tab, and 200 masks the misconfig from uptime checks. Reachable because the client guard uses a *separate* hardcoded `ORCID.clientId` (html:152) that can diverge from server env.
**Fix:** Return a 302 back to the page with an error flag (or a 503 with HTML), and drive the button's enabled state from a single server-provided config source.

### L5 — ORCID token exchange has no try/catch; unhandled rejection on non-JSON 200
**File:** `netlify/functions/orcid-callback.js:26-32` · **Category:** error-handling
`const t = await r.json()` runs after only the `!r.ok` check. A 200 with a non-JSON body (gateway/interstitial HTML, empty body) makes `r.json()` throw; with no surrounding try/catch, Netlify returns an opaque 500 mid-redirect and the state-cookie cleanup on line 41 never runs.
**Fix:** Wrap fetch + parse in try/catch returning `J(502, …)`; validate `t.orcid` is non-empty before redirecting; clear the state cookie on all exit paths.

### L6 — Zoom token exchange has no try/catch and no timeout
**File:** `netlify/functions/zoom-oauth-callback.js:26-32` · **Category:** error-handling
Only `!r.ok` is handled. A thrown `fetch` (DNS/TLS/reset) or non-JSON `r.json()` escapes as an opaque 500, breaking the JSON error contract; no `AbortController` means a hung Zoom endpoint stalls to the function's hard limit. The state cookie is also left set (see I1).
**Fix:** try/catch → `J(502,{error:"token exchange unreachable"})`; add an `AbortController` timeout (~10s); clear the cookie on error returns too.

### L7 — No `meetingNumber` validation or allowlist
**File:** `netlify/functions/zoom-meeting-signature.js:36-40` · **Category:** input-validation
`meetingNumber` is accepted as any non-empty string — no format, ownership, or allowlist check. Combined with M1's missing auth, the endpoint is a signing oracle for arbitrary meeting numbers. (Not SSRF, not injection — it's base64url-encoded into the JWT; the real risk is scope/abuse. A signature alone still doesn't defeat a meeting passcode/waiting room.)
**Fix:** Validate `^[0-9]{9,11}$` and check against a server-side allowlist of events NTLSN is authorised to stream. Prioritise with M1.

### L8 — No rate limiting on the signature endpoint
**File:** `netlify/functions/zoom-meeting-signature.js:24-49` · **Category:** rate-limiting
No throttle, counter, or CAPTCHA. With M1 (no auth) and L7 (no allowlist), it's an unbounded oracle; also a cost/DoS vector against the Netlify invocation budget. Impact bounded by role-0/public-embed intent.
**Fix:** Per-IP/per-session throttle (Netlify edge rate limits or a KV counter), plus the auth gate from M1.

### L9 — Orphaned, publicly-reachable token-minting endpoint with no caller
**File:** `netlify/functions/zoom-meeting-signature.js` (+ `symposium-streaming.html`) · **Category:** dead-code
Nothing in the repo calls this function — `symposium-streaming.html` references only `zoom-oauth-start` (94), `orcid-callback` (152), `orcid-oauth-start` (175); the Meeting SDK is never loaded and line 137 names it only in prose. It ships to prod as an unwired endpoint carrying M1/L7/L8, so it gets no scrutiny yet remains live at a predictable path.
**Fix:** Either wire it in behind the ORCID session (binding `meetingNumber` to a live symposium) or remove it until the embed is built; add rate limiting if kept.

### L10 — `mcp.js` re-fetches remote data on every call with no cache
**File:** `netlify/functions/mcp.js:34-56` · **Category:** efficiency
`getJSON()` does `fetch(`${DATA}/${file}`)` per tool call with no module-scope cache — unlike the stdio reference (`mcp/ntlsn-mcp.mjs:21`, `const cache={}`) and contrary to the docs' "cached ~60s" (`developers.html:173`). Repeated `search_archive` re-fetches the full ~276 KB `ltr.json` each time. Netlify warm module scope persists, so a simple cache eliminates almost all fetches.
**Fix:** Cache parsed JSON at module scope keyed by filename, optional short TTL.

### L11 — `mcp.js` data origin hardcoded to production; no fetch timeout
**File:** `netlify/functions/mcp.js:8,35` · **Category:** correctness
`DATA = "https://www.ntlsn.com/data"` means Deploy Previews / branch deploys serve *production* data, not the deploy's own — the pilot can't be tested against changed data. No `AbortController` timeout. (The "fails when the CDN is down" angle is weak — the function shares that hostname.)
**Fix:** Use `process.env.URL`/`DEPLOY_PRIME_URL` for the origin (or read bundled JSON from the filesystem via `included_files`); add an `AbortController` timeout.

### L12 — `mcp.js` `limit` argument unvalidated and uncapped
**File:** `netlify/functions/mcp.js:48,53` · **Category:** input-validation
`slice(0, args.limit || N)` with no `Number()` coercion or max. `limit:999999` dumps the whole 1,431-record archive; `limit:0`→default, `limit:-2`→drops last two, `limit:"abc"`→NaN→empty. Low impact (data is public/CORS-open), but a response-amplification and correctness quirk.
**Fix:** `const lim = Math.min(Math.max(1, Number(args.limit)||10), 100)`.

### L13 — Maintainer's local absolute path committed in all 6 function comments
**Files:** `orcid-oauth-start.js:5`, `orcid-callback.js:6`, `zoom-oauth-start.js:5`, `zoom-oauth-callback.js:6`, `zoom-webhooks.js:8`, `zoom-meeting-signature.js:6` · **Category:** secrets-hygiene
Each references `~/Desktop/NTLSN-symposium-streaming-spec.md`, leaking the maintainer's home-directory layout and a private doc name into a public repo. Not a credential; a repeatable hygiene miss.
**Fix:** Replace with a repo-relative path (e.g. `docs/streaming-spec.md`) or drop the lines.

---

## Info

- **I1 — State cookie cleared only on success (`zoom-oauth-callback.js:20,40`)** — cookie (Max-Age=600) survives every error/mismatch return; no server-side single-use invalidation. Harmless (HttpOnly+SameSite means only the victim's browser can re-drive it, and Zoom codes are single-use), but the "possible CSRF" rejection should clear it. *Fix:* read the cookie once at top, set `Max-Age=0` on every return path.
- **I2 — Stale comment claims CSRF cookie unimplemented (`zoom-oauth-start.js:16`)** — comment says "in production also stash this in a signed, httpOnly cookie," but line 34 already sets it and the callback verifies it fail-closed. A maintainer could "fix" a non-bug or delete the check. *Fix:* correct the comment (and drop "signed" — a double-submit random nonce needs no signing).
- **I3 — `zoom-oauth-callback` returns 200 when env vars unset (`:23`)** — reachable when only `ZOOM_CLIENT_SECRET` is dropped (start.js guards ID/REDIRECT_URI only), leaving the user at raw JSON mid-redirect and hiding the misconfig from monitoring. *Fix:* 302 with error flag, or 500.
- **I4 — Missing SDK creds return 200 (`zoom-meeting-signature.js:31-32`)** — intentional graceful-degrade, but 200 hides a broken deploy from status-code alerting. *Fix:* return 503, keep `configured:false` in the body.
- **I5 — `search_archive` doesn't enforce declared required `query` (`mcp.js:50-53`)** — `String(args.query||"").includes("")` is always true, so an empty query returns the first N rows with 200 instead of `-32602`. *Fix:* return JSON-RPC `-32602` on missing/empty query.
- **I6 — Raw error messages / wrong JSON-RPC channel (`mcp.js:36,105`)** — `fail(-32603, e.message)` echoes internals like `data ltr.json 500`; tool failures should be `{content, isError:true}` not a protocol error. (No secret disclosure — files/host are the public data API.) *Fix:* generic message + `isError:true`, log details server-side.
- **I7 — `id:undefined` in responses to id-less requests (`mcp.js:88-90`)** — a request-style method with no `id` still gets a reply whose `id` serializes away, violating JSON-RPC notification semantics. Non-exploitable protocol nit. *Fix:* 202/no-body when `id` is undefined for non-notification methods.
- **I8 — No Node runtime pin** — no `netlify.toml`/`package.json`; functions rely on global `fetch` (Node ≥18) and `base64url` (Node ≥15). Current Netlify defaults satisfy this, so failure requires a manual downgrade. *Fix:* pin via `AWS_LAMBDA_JS_RUNTIME` / `engines.node`.
- **I9 — Function responses bypass `_headers`** — `_headers` covers CDN assets, not `/.netlify/functions/*`, so responses carry only `Content-Type`. No exploit (types are correct; redirect headers don't set the followed request's Referer), but add `X-Content-Type-Options: nosniff` for defense-in-depth.
- **I10 — CSP `connect-src 'self' https:` with `script-src 'unsafe-inline' 'unsafe-eval'` (`_headers:8`)** — permits exfil to any HTTPS host; weak XSS containment. Architectural trade-off of the single-file bundle. *Fix:* tighten `connect-src` to actual origins; the real fix is the Epic 1 rebuild removing `unsafe-inline`/`unsafe-eval`.
- **I11 — No `use strict`; `.gitignore` doesn't exclude `.env`** — no secret committed today, but a maintainer running `netlify dev` has no guardrail against committing a local `.env` full of real secrets. *Fix:* add `.env`/`.env.*` to `.gitignore`.
- **I12 — Inconsistent/misnamed CORS across functions** — `mcp.js` uses `*`, `zoom-meeting-signature` uses an allowlist, `zoom-webhooks.js:11` names a `CORS` const that contains no `Access-Control-*` header. Each posture is individually correct; the naming is a copy-paste foot-gun. *Fix:* rename the webhook const to `HEADERS`; document the intended posture per function.

---

## Appendix — Verified correct (checked and cleared, not bugs)

These were flagged by naive analysis and **confirmed safe**; do not re-open in Phase 2.

- **Zoom OAuth CSRF actually works.** `zoom-oauth-start.js:34` sets `ntlsn_zoom_state` (HttpOnly; Secure; SameSite=Lax; Max-Age=600); `zoom-oauth-callback.js:17-20` reads the same-named cookie and compares fail-closed. SameSite=Lax permits it on the top-level callback navigation; success clears it. The double-submit defense is sound — only the line-16 comment is stale (see I2).
- **Non-constant-time state comparison (`orcid-callback.js:19`, `zoom-oauth-callback.js:20`).** `m[1] !== state` is not timing-safe, but the compared secret is a fresh 128-bit random nonce, single-use, HttpOnly, and unreadable by the attacker — there is no stable, repeatedly-probeable secret and no oracle. Not exploitable. `timingSafeEqual` is optional hardening only.
- **State cookie "not signed."** The `crypto.randomBytes(16)` nonce in an HttpOnly cookie is a correct double-submit token; signing adds nothing against this threat model (there's no session to bind at the OAuth leg, and an attacker with a cookie-write primitive could obtain a validly-signed pair anyway).
- **Webhook replay window "seconds vs milliseconds" (`zoom-webhooks.js:41`).** Premise is wrong — Zoom's `x-zm-request-timestamp` header is Unix **seconds** (10 digits); the 13-digit ms value is `event_ts` *inside the body*. `Math.abs(Date.now()/1000 - Number(ts)) < 300` correctly yields a 5-minute window. Genuine events pass.
- **Webhook signature over `event.body` without base64 handling (`zoom-webhooks.js:18,35`).** Netlify delivers `application/json` bodies as plain UTF-8 (`isBase64Encoded=false`); Zoom always posts JSON, so `raw` is exactly the signed bytes. A non-text content type could induce base64, but such a request carries no valid signature and is rejected anyway.
- **Meeting-SDK signature crypto (`zoom-meeting-signature.js:39-47`).** HS256 over `header.payload` with valid Zoom SDK claims is correct, and `role` is hardcoded to `0` — no host-privilege escalation is possible via this endpoint. (The endpoint's problems are auth/allowlist/rate-limit, not the crypto.)
- **Webhook HMAC verify path itself (`zoom-webhooks.js:35-39`).** `crypto.timingSafeEqual` guarded by a length pre-check over `v0:${ts}:${raw}` is implemented correctly. The defect is that it's conditional on the secret's presence (M2) and shares a key with the CRC oracle (M3), not the comparison itself.
- **Token-endpoint response trusted without re-verifying an `id_token` JWT.** Acceptable — the token comes from a direct server-to-server TLS exchange with ORCID/Zoom, not through the browser, so JWT signature re-validation is not required.
- **`CORS` fallback to `ALLOWED[0]` is not a browser bypass.** Returning the wrong ACAO to a disallowed browser origin causes the browser to *block* the response; it's not an origin-check bypass. (It is, however, a non-defense against non-browser callers — folded into M1.)