// NTLSN — Zoom "Connect your university Zoom" — step 1 of 3-legged OAuth.
// Builds the consent URL with a CSRF state and stashes that state in an HttpOnly cookie;
// zoom-oauth-callback.js verifies it fail-closed. Redirects the uni's Zoom admin to Zoom.
// Needs env: ZOOM_CLIENT_ID, ZOOM_REDIRECT_URI (must EXACTLY match the app's registered URI).
// The multi-tenant "any uni connects" flow requires the General app to be PUBLISHED or UNLISTED
// (Zoom review). Against your OWN account it works pre-review. Audit: docs/backend-audit.md.
"use strict";

const crypto = require("crypto");

exports.handler = async (event) => {
  const clientId = process.env.ZOOM_CLIENT_ID;
  const redirectUri = process.env.ZOOM_REDIRECT_URI;

  // Unconfigured: bounce back to the page with a flag rather than raw JSON in the tab
  // (this endpoint is reached via a top-level navigation from the "Connect" button).
  if (!clientId || !redirectUri) {
    return {
      statusCode: 302,
      headers: { Location: "/symposium-streaming.html?zoom_error=unconfigured" },
    };
  }

  // CSRF state — a fresh random nonce; the double-submit HttpOnly cookie below is the
  // second half the callback checks. (No signing needed: the cookie is unforgeable to
  // client JS, and the value is single-use and unpredictable.)
  const state = crypto.randomBytes(16).toString("hex");
  const scopes = [
    "meeting:write:meeting:admin", "meeting:read:meeting:admin",
    "meeting:write:registrant:admin", "meeting:read:list_registrants:admin",
    "webinar:write:webinar:admin", "webinar:write:registrant:admin",
    "cloud_recording:read:list_recording_files:admin", "user:read:user:admin",
  ].join(" ");
  const url =
    "https://zoom.us/oauth/authorize?response_type=code" +
    "&client_id=" + encodeURIComponent(clientId) +
    "&redirect_uri=" + encodeURIComponent(redirectUri) +
    "&state=" + state +
    "&scope=" + encodeURIComponent(scopes);

  return {
    statusCode: 302,
    headers: {
      Location: url,
      "Set-Cookie": `ntlsn_zoom_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
      "X-Content-Type-Options": "nosniff",
    },
    body: "",
  };
};
