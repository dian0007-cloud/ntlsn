// NTLSN — "Sign in with ORCID" — step 1: build the consent URL with a CSRF state + PKCE
// challenge, stash both the state and the code_verifier in HttpOnly cookies (client JS
// deliberately cannot set HttpOnly), then redirect to ORCID.
// The callback (orcid-callback.js) fails closed unless the state cookie matches the
// returned state, and sends the verifier back to prove the code is ours (PKCE).
// Needs env: ORCID_CLIENT_ID, ORCID_REDIRECT_URI, ORCID_ENV(sandbox|production).
// Works on the FREE ORCID Public API. Audit + design notes: docs/backend-audit.md.
"use strict";

const crypto = require("crypto");
const { createVerifier, challengeS256 } = require("../lib/pkce");

exports.handler = async (event) => {
  const id = process.env.ORCID_CLIENT_ID,
    redirect = process.env.ORCID_REDIRECT_URI;

  // Unconfigured: bounce back to the page with a flag rather than showing raw JSON
  // in the tab (this is reached via a top-level navigation).
  if (!id || !redirect) {
    return {
      statusCode: 302,
      headers: { Location: "/symposium-streaming.html?auth_error=orcid_unconfigured" },
    };
  }

  const base = process.env.ORCID_ENV === "production" ? "https://orcid.org" : "https://sandbox.orcid.org";
  const state = crypto.randomBytes(16).toString("hex");
  const verifier = createVerifier();
  const challenge = challengeS256(verifier);

  const url =
    base +
    "/oauth/authorize?response_type=code&scope=openid" +
    "&client_id=" + encodeURIComponent(id) +
    "&redirect_uri=" + encodeURIComponent(redirect) +
    "&state=" + state +
    "&code_challenge=" + challenge +
    "&code_challenge_method=S256";

  return {
    statusCode: 302,
    headers: { Location: url, "X-Content-Type-Options": "nosniff" },
    multiValueHeaders: {
      "Set-Cookie": [
        `ntlsn_orcid_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
        `ntlsn_orcid_verifier=${verifier}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
      ],
    },
    body: "",
  };
};
