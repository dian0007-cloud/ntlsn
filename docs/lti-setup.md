# LTI 1.3 Deep Linking — setup & testing

Status: **Phase A + B** — OIDC login, JWT/JWKS signature verification, platform registry
and launch validation (Phase A), plus the full Deep Linking round trip (Phase B): a
verified launch renders a content picker of curated free-commons resources
(`data/lti-content.json`), and `netlify/functions/lti-deeplink-return.js` signs the
`LtiDeepLinkingResponse` and form_posts it back to the platform. Validated end to end
against synthetic keypairs in the test suite; a real-LMS (MoodleCloud/saltire) end-to-end
test is still pending.

### What the instructor sees

From a course, the instructor clicks the NTLSN placement in their LMS's activity/content
chooser. After the (invisible) OIDC handshake they land on a plain NTLSN page listing the
free commons resources — Crash Courses, Rubric Builder, Recognition GPS and so on — each
with a one-line description and a checkbox. Ticking some and pressing **Add to course**
sends them straight back to the LMS with those links added; submitting with nothing ticked
just returns them with nothing added. No NTLSN account, no student data — the links are the
same free, public pages anyone can open.

### How the round trip stays honest

The platform's `deep_linking_settings` claim (its return URL and opaque `data` token) is
never trusted from the browser: `lti-launch.js` seals it inside a 5-minute session JWT
signed with NTLSN's own key, carried through the picker as a hidden field, and
`lti-deeplink-return.js` verifies that signature before using any of it. Selections are
ids resolved server-side against `data/lti-content.json` — client-supplied titles or URLs
are ignored, and unknown ids are silently dropped.

Scope, deliberately: NTLSN supports **Deep Linking only** (`LtiDeepLinkingRequest`). No
Resource Link launches, no roster (NRPS), no grades (AGS) — this integration is
structurally incapable of reading institutional data, by design (see
`netlify/functions/lti-launch.js`).

## 1. Generate NTLSN's signing key (one-time)

```bash
node scripts/generate-lti-keypair.mjs
```

Paste the printed private key into Netlify's `NTLSN_LTI_PRIVATE_KEY` environment variable
(Site settings → Environment variables). Never commit it. The public half is derived and
served automatically at `/.netlify/functions/lti-jwks` — nothing else to configure.

## 2. Register a platform

A platform (an LMS instance) is one entry in `data/lti-platforms.json` — plain,
PR-reviewable JSON, not a secret (an issuer/client_id/endpoint URL isn't sensitive;
verification relies on the platform's own public JWKS, not a shared secret). See the
`_schema` block at the top of that file for the exact fields.

### Moodle (the pilot target)

In the Moodle site: **Site administration → Plugins → External tool → Manage tools →
configure a tool manually**, LTI version 1.3, and give it:

- **Tool URL / Target Link URI:** `https://www.ntlsn.com/.netlify/functions/lti-launch`
- **Initiate login URL:** `https://www.ntlsn.com/.netlify/functions/lti-login`
- **Redirection URI(s):** same as Tool URL
- **Public key type:** Keyset URL — `https://www.ntlsn.com/.netlify/functions/lti-jwks`
- **Deep Linking:** enabled, same Target Link URI

Moodle then shows you the **Platform ID** (issuer), **Client ID**, and generates its own
**Login URL** / **Keyset URL** / **deployment ID** — copy those four values plus the
deployment ID into a new entry in `data/lti-platforms.json`.

### Getting a Moodle sandbox with no institutional involvement

[MoodleCloud](https://moodlecloud.com) free tier — publicly hosted over HTTPS (required;
LTI launches are browser-mediated redirects, so both sides need a reachable public origin),
LTI-configurable, no institution needed to test the full loop end to end.

## 3. Verify without any LMS at all

`netlify/functions/test/lti.test.js` exercises the entire pipeline (login redirect, JWKS
caching + kid-rotation refetch, signature/state/nonce/deployment/message-type validation,
replay rejection, picker rendering, session-JWT tamper/expiry rejection, and the signed
`LtiDeepLinkingResponse` itself) against synthetic platform keypairs — `npm test` is the
fast path to confirm nothing regressed.

For an external, spec-conformance check before touching a real LMS, IMS's public reference
tool ([saltire.lti.app](https://saltire.lti.app)) can act as a platform and drive a real
OIDC + Deep Linking round trip against `lti-login`/`lti-launch` once a corresponding entry
exists in `data/lti-platforms.json`.

## 4. Nonce replay storage

Single-use nonces live in the `lti-nonce` Netlify Blobs store (via `netlify/lib/store.js`,
the same wrapper the Zoom pilot uses) — best-effort, matching that store's existing
consistency guarantees, with a 10-minute TTL.
