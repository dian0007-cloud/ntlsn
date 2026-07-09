// NTLSN — "Sign in with ORCID" callback. Exchanges the auth code for the researcher's
// verified ORCID iD + name, then mints a signed HttpOnly session cookie and redirects to a
// clean URL (no identity in the query string). The secret stays server-side.
// Works on the FREE ORCID Public API — no membership needed for login.
// Needs env: ORCID_CLIENT_ID, ORCID_CLIENT_SECRET, ORCID_REDIRECT_URI, ORCID_ENV(sandbox|production),
//   NTLSN_SESSION_SECRET (any long random string used to sign the session cookie).
// Note: ORCID Public API is licensed NON-COMMERCIAL — fine for the free commons; gating a PAID
//   product on ORCID login likely needs ORCID membership. Audit: docs/backend-audit.md.
"use strict";

const { readCookie, safeEqual } = require("../lib/cookies");
const session = require("../lib/session");

const ORCID_RE = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
// Clear both transient OAuth cookies on every exit path (success or failure).
const CLEAR = [
  "ntlsn_orcid_state=; Path=/; Max-Age=0",
  "ntlsn_orcid_verifier=; Path=/; Max-Age=0",
];

exports.handler = async (event) => {
  const q = event.queryStringParameters || {};
  const code = q.code,
    state = q.state;
  const nosniff = { "X-Content-Type-Options": "nosniff" };
  const J = (s, o) => ({
    statusCode: s,
    headers: { "Content-Type": "application/json", ...nosniff },
    multiValueHeaders: { "Set-Cookie": CLEAR },
    body: JSON.stringify(o),
  });

  if (q.error) return J(400, { error: q.error });
  if (!code) return J(400, { error: "missing code" });

  // CSRF: exact-match the state cookie (not a substring) and constant-time compare.
  const cookie = event.headers.cookie || event.headers.Cookie || "";
  const cookieState = readCookie(cookie, "ntlsn_orcid_state");
  if (!cookieState || !state || !safeEqual(cookieState, state))
    return J(401, { error: "state mismatch (possible CSRF)" });

  const id = process.env.ORCID_CLIENT_ID,
    secret = process.env.ORCID_CLIENT_SECRET,
    redirect = process.env.ORCID_REDIRECT_URI,
    sessionSecret = process.env.NTLSN_SESSION_SECRET;
  if (!id || !secret || !redirect || !sessionSecret) {
    // Reached by a top-level navigation (ORCID's 302 back here after consent). Mirror the start
    // endpoint: bounce to the page with an error flag instead of rendering raw JSON in the tab,
    // and clear the transient cookies. (audit v2 L12 — the start endpoints were hardened to this
    // pattern in PR #10; the callback, reached the same way, was missed.)
    return {
      statusCode: 302,
      headers: { Location: "/symposium-streaming.html?auth_error=orcid_unconfigured" },
      multiValueHeaders: { "Set-Cookie": CLEAR },
      body: "",
    };
  }

  const base = process.env.ORCID_ENV === "production" ? "https://orcid.org" : "https://sandbox.orcid.org";
  const verifier = readCookie(cookie, "ntlsn_orcid_verifier") || "";

  const params = {
    client_id: id,
    client_secret: secret,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirect,
  };
  if (verifier) params.code_verifier = verifier; // PKCE

  let t;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    let r;
    try {
      r = await fetch(`${base}/oauth/token`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(params),
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    if (!r.ok) return J(502, { error: "ORCID token exchange failed", status: r.status });
    t = await r.json(); // { access_token, name, orcid, id_token?, scope, ... }
  } catch (_e) {
    return J(502, { error: "ORCID token exchange unreachable" });
  }

  // The token response itself carries the verified iD + name — no second call needed.
  // (Trusted: this is a direct server-to-server TLS exchange, not a browser-relayed token,
  //  so re-verifying the id_token JWT signature is not required for authenticity.)
  const orcid = String((t && t.orcid) || "");
  if (!ORCID_RE.test(orcid)) return J(502, { error: "ORCID response missing a valid iD" });
  const name = t && typeof t.name === "string" ? t.name : "";

  const now = Math.floor(Date.now() / 1000);
  const token = session.sign({ orcid, name, iat: now, exp: now + 8 * 60 * 60 }, sessionSecret); // 8h

  // Redirect to a clean path; identity lives in the signed HttpOnly cookie, never the URL.
  return {
    statusCode: 302,
    headers: { Location: "/symposium-streaming.html?signed_in=1", ...nosniff },
    multiValueHeaders: { "Set-Cookie": [...CLEAR, session.cookie(token, 8 * 60 * 60)] },
    body: "",
  };
};
