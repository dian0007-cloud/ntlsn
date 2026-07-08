// NTLSN — Zoom "Connect your Zoom" — step 2: exchange the auth code for tokens.
// REAL exchange logic. Needs env: ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_REDIRECT_URI.
// ⚠️ The TODO below is the genuine gap: a 3-legged refresh token must be PERSISTED
//    per-tenant (encrypted) in a store — Netlify Functions are stateless. Until that store
//    exists this verifies the flow end-to-end but cannot keep the connection alive.
// Persistence options + design notes: docs/backend-audit.md.
"use strict";

const { readCookie, safeEqual } = require("../lib/cookies");
const { open } = require("../lib/store");
const enc = require("../lib/crypto");

// Clear the transient state cookie on every exit path (success or failure).
const CLEAR = ["ntlsn_zoom_state=; Path=/; Max-Age=0"];

// Persist the tenant's refresh token (encrypted) keyed by Zoom account_id, so the connection
// survives access-token expiry. Best-effort: a storage/lookup failure must not break the
// user-facing redirect (the flow still verified end-to-end; it just won't auto-refresh).
// Gated on the REAL durability of the store (open().durable), not an env-var guess — and
// bound by a hard ceiling so it can never blow the function budget after the single-use code
// is consumed (audit v2 L2 / L15).
async function persistTenant(t, openFn) {
  if (!enc.configured() || !t || !t.refresh_token) return;
  const { store: tokens, durable } = await (openFn || open)("zoom-tokens");
  if (!durable) return; // no durable store -> refresh token can't survive a cold start; don't pretend
  const work = (async () => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    try {
      const me = await fetch("https://api.zoom.us/v2/users/me", {
        headers: { Authorization: `Bearer ${t.access_token}` },
        signal: ctrl.signal,
      });
      if (!me || !me.ok) return;
      const acct = await me.json();
      const accountId = acct && (acct.account_id || acct.id);
      if (!accountId) return;
      await tokens.setJSON(String(accountId), {
        refresh_token_enc: enc.encrypt(t.refresh_token),
        scope: t.scope || "",
        updated_at: Math.floor(Date.now() / 1000),
      });
    } finally {
      clearTimeout(timer);
    }
  })();
  try {
    await Promise.race([
      work,
      new Promise((_resolve, reject) => setTimeout(() => reject(new Error("persist timeout")), 3500)),
    ]);
  } catch (_e) {
    // swallow — persistence is best-effort at this layer
  }
}

exports.persistTenant = persistTenant;

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

  if (q.error) return J(400, { error: q.error, desc: q.error_description });
  if (!code) return J(400, { error: "missing code" });

  // CSRF: exact-match the state cookie (not a substring) and constant-time compare.
  const cookie = event.headers.cookie || event.headers.Cookie || "";
  const cookieState = readCookie(cookie, "ntlsn_zoom_state");
  if (!cookieState || !state || !safeEqual(cookieState, state))
    return J(401, { error: "state mismatch (possible CSRF)" });

  const id = process.env.ZOOM_CLIENT_ID,
    secret = process.env.ZOOM_CLIENT_SECRET,
    redirect = process.env.ZOOM_REDIRECT_URI;
  if (!id || !secret || !redirect) {
    // Reached by a top-level navigation (Zoom's 302 back here after consent). Mirror the start
    // endpoint: bounce to the page with an error flag instead of raw JSON, and clear the state
    // cookie (audit v2 L13).
    return {
      statusCode: 302,
      headers: { Location: "/symposium-streaming.html?zoom_error=unconfigured" },
      multiValueHeaders: { "Set-Cookie": CLEAR },
      body: "",
    };
  }

  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    let r;
    try {
      r = await fetch("https://zoom.us/oauth/token", {
        method: "POST",
        headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirect }),
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    if (!r.ok) return J(502, { error: "token exchange failed", status: r.status });
    const t = await r.json(); // { access_token, refresh_token, expires_in, scope, ... } — never logged.
    // Persist the encrypted refresh token per tenant (best-effort; won't block the redirect).
    await persistTenant(t);
  } catch (_e) {
    return J(502, { error: "token exchange unreachable" });
  }

  return {
    statusCode: 302,
    headers: { Location: "/symposium-streaming.html?connected=1", ...nosniff },
    multiValueHeaders: { "Set-Cookie": CLEAR },
    body: "",
  };
};
