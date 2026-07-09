# LTI 1.3 Deep Linking — setup & testing

Status: **Phase A (foundation)** — OIDC login, JWT/JWKS signature verification, platform
registry, and launch validation are implemented and tested. There is no content picker yet
(Phase B): a successful launch currently renders a confirmation page proving the crypto
pipeline is correct, not the real "add to course" UI.

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
replay rejection) against synthetic platform keypairs — `npm test` is the fast path to
confirm nothing regressed.

For an external, spec-conformance check before touching a real LMS, IMS's public reference
tool ([saltire.lti.app](https://saltire.lti.app)) can act as a platform and drive a real
OIDC + Deep Linking round trip against `lti-login`/`lti-launch` once a corresponding entry
exists in `data/lti-platforms.json`.

## 4. Nonce replay storage

Single-use nonces live in the `lti-nonce` Netlify Blobs store (via `netlify/lib/store.js`,
the same wrapper the Zoom pilot uses) — best-effort, matching that store's existing
consistency guarantees, with a 10-minute TTL.
