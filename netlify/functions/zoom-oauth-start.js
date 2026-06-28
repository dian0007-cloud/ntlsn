// NTLSN — Zoom "Connect your university Zoom" — step 1 of 3-legged OAuth.
// Builds the consent URL (with CSRF state) and redirects the uni's Zoom admin to Zoom.
// Needs env: ZOOM_CLIENT_ID, ZOOM_REDIRECT_URI (must EXACTLY match the app's registered URI).
// The multi-tenant "any uni connects" flow requires the General app to be PUBLISHED or UNLISTED
// (Zoom review). Against your OWN account it works pre-review. Spec: ~/Desktop/NTLSN-symposium-streaming-spec.md

const crypto = require("crypto");

exports.handler = async (event) => {
  const clientId = process.env.ZOOM_CLIENT_ID;
  const redirectUri = process.env.ZOOM_REDIRECT_URI;
  if (!clientId || !redirectUri)
    return { statusCode: 200, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Set ZOOM_CLIENT_ID / ZOOM_REDIRECT_URI to enable Connect-your-Zoom.", configured: false }) };

  // CSRF state — in production also stash this in a signed, httpOnly cookie and verify on callback.
  const state = crypto.randomBytes(16).toString("hex");
  const scopes = [
    "meeting:write:meeting:admin", "meeting:read:meeting:admin",
    "meeting:write:registrant:admin", "meeting:read:list_registrants:admin",
    "webinar:write:webinar:admin", "webinar:write:registrant:admin",
    "cloud_recording:read:list_recording_files:admin", "user:read:user:admin",
  ].join(" ");
  const url = "https://zoom.us/oauth/authorize?response_type=code"
    + "&client_id=" + encodeURIComponent(clientId)
    + "&redirect_uri=" + encodeURIComponent(redirectUri)
    + "&state=" + state
    + "&scope=" + encodeURIComponent(scopes);

  return {
    statusCode: 302,
    headers: {
      Location: url,
      "Set-Cookie": `ntlsn_zoom_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
    },
    body: "",
  };
};
