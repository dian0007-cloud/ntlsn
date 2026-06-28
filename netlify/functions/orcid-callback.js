// NTLSN — "Sign in with ORCID" callback. Exchanges the auth code for the researcher's
// verified ORCID iD + name. REAL logic (verbatim from ORCID's token tutorial); the secret
// stays server-side. Works on the FREE ORCID Public API — no membership needed for login.
// Needs env: ORCID_CLIENT_ID, ORCID_CLIENT_SECRET, ORCID_REDIRECT_URI, ORCID_ENV(sandbox|production)
// Note: ORCID Public API is licensed NON-COMMERCIAL — fine for the free commons; gating a PAID
//   product on ORCID login likely needs ORCID membership. Spec: ~/Desktop/NTLSN-symposium-streaming-spec.md

exports.handler = async (event) => {
  const q = event.queryStringParameters || {};
  const code = q.code, state = q.state;
  const J = (s, o) => ({ statusCode: s, headers: { "Content-Type": "application/json" }, body: JSON.stringify(o) });
  if (q.error) return J(400, { error: q.error });
  if (!code) return J(400, { error: "missing code" });

  // CSRF: verify state against the cookie set at login start.
  const cookie = event.headers.cookie || "";
  const m = cookie.match(/ntlsn_orcid_state=([A-Za-z0-9-]+)/);
  // Fail closed: reject if the state cookie OR the state param is missing, not only on mismatch.
  if (!m || !state || m[1] !== state) return J(401, { error: "state mismatch (possible CSRF)" });

  const id = process.env.ORCID_CLIENT_ID, secret = process.env.ORCID_CLIENT_SECRET, redirect = process.env.ORCID_REDIRECT_URI;
  if (!id || !secret || !redirect)
    return J(200, { error: "Set ORCID_CLIENT_ID / ORCID_CLIENT_SECRET / ORCID_REDIRECT_URI (free at orcid.org/developer-tools).", configured: false });
  const base = process.env.ORCID_ENV === "production" ? "https://orcid.org" : "https://sandbox.orcid.org";

  const r = await fetch(`${base}/oauth/token`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: id, client_secret: secret, grant_type: "authorization_code", code, redirect_uri: redirect }),
  });
  if (!r.ok) return J(502, { error: "ORCID token exchange failed", status: r.status });
  const t = await r.json(); // { access_token, name, orcid, id_token?, scope, ... }

  // The token response itself carries the verified iD + name — no second call needed.
  // (Optional: if scope=openid, verify t.id_token RS256 against `${base}/oauth/jwks`.)
  // TODO(session): mint your own signed httpOnly session cookie; persist the ORCID iD as the user key.
  const orcid = t.orcid || "";
  const name = encodeURIComponent(t.name || "");
  return {
    statusCode: 302,
    headers: { Location: `/symposium-streaming.html?orcid=${encodeURIComponent(orcid)}&name=${name}`, "Set-Cookie": "ntlsn_orcid_state=; Path=/; Max-Age=0" },
    body: "",
  };
};
