// NTLSN — "Sign in with ORCID" — step 1: build the consent URL with a CSRF state and set it
// in an HttpOnly cookie (client JS deliberately cannot set HttpOnly), then redirect to ORCID.
// The callback (orcid-callback.js) fails closed unless this cookie matches the returned state.
// Needs env: ORCID_CLIENT_ID, ORCID_REDIRECT_URI, ORCID_ENV(sandbox|production).
// Works on the FREE ORCID Public API. Spec: ~/Desktop/NTLSN-symposium-streaming-spec.md

const crypto = require("crypto");

exports.handler = async (event) => {
  const id = process.env.ORCID_CLIENT_ID, redirect = process.env.ORCID_REDIRECT_URI;
  if (!id || !redirect)
    return { statusCode: 200, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Set ORCID_CLIENT_ID / ORCID_REDIRECT_URI (free at orcid.org/developer-tools).", configured: false }) };

  const base = process.env.ORCID_ENV === "production" ? "https://orcid.org" : "https://sandbox.orcid.org";
  const state = crypto.randomBytes(16).toString("hex");
  const url = base + "/oauth/authorize?response_type=code&scope=openid"
    + "&client_id=" + encodeURIComponent(id)
    + "&redirect_uri=" + encodeURIComponent(redirect)
    + "&state=" + state;

  return {
    statusCode: 302,
    headers: {
      Location: url,
      "Set-Cookie": `ntlsn_orcid_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
    },
    body: "",
  };
};
