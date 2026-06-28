// NTLSN — Zoom "Connect your Zoom" — step 2: exchange the auth code for tokens.
// REAL exchange logic. Needs env: ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_REDIRECT_URI.
// ⚠️ The TODO below is the genuine 2027 gap: a 3-legged refresh token must be PERSISTED
//    per-tenant (encrypted) in a database — Netlify Functions are stateless. Until that DB
//    exists this verifies the flow end-to-end but cannot keep the connection alive.
// Spec + DB options: ~/Desktop/NTLSN-symposium-streaming-spec.md

exports.handler = async (event) => {
  const q = event.queryStringParameters || {};
  const code = q.code, state = q.state;
  const J = (s, o) => ({ statusCode: s, headers: { "Content-Type": "application/json" }, body: JSON.stringify(o) });

  if (q.error) return J(400, { error: q.error, desc: q.error_description });
  if (!code) return J(400, { error: "missing code" });

  // CSRF: compare `state` to the value set in the httpOnly cookie at start.
  const cookie = (event.headers.cookie || "");
  const m = cookie.match(/ntlsn_zoom_state=([a-f0-9]+)/);
  if (m && state && m[1] !== state) return J(401, { error: "state mismatch (possible CSRF)" });

  const id = process.env.ZOOM_CLIENT_ID, secret = process.env.ZOOM_CLIENT_SECRET, redirect = process.env.ZOOM_REDIRECT_URI;
  if (!id || !secret || !redirect) return J(200, { error: "Set ZOOM_CLIENT_ID / ZOOM_CLIENT_SECRET / ZOOM_REDIRECT_URI", configured: false });

  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  const r = await fetch("https://zoom.us/oauth/token", {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirect }),
  });
  if (!r.ok) return J(502, { error: "token exchange failed", status: r.status });
  const t = await r.json(); // { access_token, refresh_token, expires_in, scope, ... }

  // TODO(2027 DB): look up the account via GET https://api.zoom.us/v2/users/me with the access_token,
  // then UPSERT { account_id -> encrypted refresh_token } and rotate on every refresh.
  // For now, confirm success without persisting (the connection won't survive token expiry).

  return {
    statusCode: 302,
    headers: { Location: "/symposium-streaming.html?connected=1", "Set-Cookie": "ntlsn_zoom_state=; Path=/; Max-Age=0" },
    body: "",
  };
};
