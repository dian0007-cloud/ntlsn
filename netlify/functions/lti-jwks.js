// NTLSN — LTI 1.3 JWKS endpoint. Publishes the public half of NTLSN_LTI_PRIVATE_KEY so
// platforms can verify Deep Linking responses NTLSN signs. GET only, public, no auth —
// a JWKS is public key material by definition.
"use strict";

const { publicJwk } = require("../lib/lti-jwt");

exports.handler = async (event) => {
  if (event.httpMethod && event.httpMethod !== "GET") {
    return { statusCode: 405, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "GET only" }) };
  }
  const jwk = publicJwk();
  if (!jwk) {
    return {
      statusCode: 503,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ error: "LTI signing key not configured" }),
    };
  }
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3600", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ keys: [jwk] }),
  };
};
