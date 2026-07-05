// NTLSN — Zoom "Connect your Zoom" — step 2: exchange the auth code for tokens.
// REAL exchange logic. Needs env: ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_REDIRECT_URI.
// ⚠️ The TODO below is the genuine gap: a 3-legged refresh token must be PERSISTED
//    per-tenant (encrypted) in a store — Netlify Functions are stateless. Until that store
//    exists this verifies the flow end-to-end but cannot keep the connection alive.
// Persistence options + design notes: docs/backend-audit.md.
"use strict";

const { readCookie, safeEqual } = require("../lib/cookies");
const { store, durable } = require("../lib/store");
const enc = require("../lib/crypto");

// Clear the transient state cookie on every exit path (success or failure).
const CLEAR = ["ntlsn_zoom_state=; Path=/; Max-Age=0"];

// Persist the tenant's refresh token (encrypted) keyed by Zoom account_id, so the connection
// survives access-token expiry. Best-effort: a storage/lookup failure must not break the
// user-facing redirect (the flow still verified end-to-end; it just won't auto-refresh).
async function persistTenant(t) {
  if (!durable() || !enc.configured() || !t || !t.refresh_token) return;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    let me;
    try {
      me = await fetch("https://api.zoom.us/v2/users/me", {
        headers: { Authorization: `Bearer ${t.access_token}` },
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    if (!me || !me.ok) return;
    const acct = await me.json();
    const accountId = acct && (acct.account_id || acct.id);
    if (!accountId) return;
    const tokens = await store("zoom-tokens");
    await tokens.setJSON(String(accountId), {
      refresh_token_enc: enc.encrypt(t.refresh_token),
      scope: t.scope || "",
      updated_at: Math.floor(Date.now() / 1000),
    });
  } catch (_e) {
    // swallow — persistence is best-effort at this layer
  }
}

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
  if (!id || !secret || !redirect) return J(200, { error: "Set ZOOM_CLIENT_ID / ZOOM_CLIENT_SECRET / ZOOM_REDIRECT_URI", configured: false });

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
