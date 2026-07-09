// NTLSN — LTI 1.3 Deep Linking return endpoint. The picker (lti-launch.js) POSTs here
// with a session JWT and the selected item ids; this signs the LtiDeepLinkingResponse
// (IMS Deep Linking 2.0) and auto-submits it back to the platform's deep_link_return_url.
//
// Trust model, in one line: everything that matters comes from something WE signed or WE
// host. The session JWT (return URL, issuer, client_id, deployment_id, opaque `data`) is
// verified against NTLSN's own public key before use; selections are ids resolved against
// data/lti-content.json server-side — any client-supplied titles/URLs are ignored, so the
// browser can only choose from the menu, never add to it.
"use strict";

const crypto = require("crypto");
const { sign, verify, publicJwk } = require("../lib/lti-jwt");
const { lookupItems } = require("../lib/lti-content");

const MSG_TYPE_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/message_type";
const VERSION_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/version";
const DEPLOY_ID_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/deployment_id";
const DL_DATA_CLAIM = "https://purl.imsglobal.org/spec/lti-dl/claim/data";
const DL_CONTENT_ITEMS_CLAIM = "https://purl.imsglobal.org/spec/lti-dl/claim/content_items";

// Same rule as lti-launch.js: escape everything interpolated into HTML, whatever its source.
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "POST only" };

  let params;
  try {
    params = new URLSearchParams(event.body || "");
  } catch (_e) {
    return { statusCode: 400, body: "malformed request body" };
  }

  const ourKey = publicJwk();
  if (!ourKey) return { statusCode: 503, body: "LTI signing key not configured" };

  // The session JWT was signed by lti-launch.js with NTLSN's own key — verify() checks
  // signature + expiry; the `purpose` pin rejects any other NTLSN-signed token replayed here.
  const session = verify(params.get("session"), ourKey);
  if (!session || session.purpose !== "lti-dl-session") {
    return { statusCode: 400, body: "invalid or expired picker session — please relaunch from your LMS" };
  }

  // Selections are ids only; lookupItems drops unknown ids and returns registry order.
  // Zero selections is valid — an empty content_items array is the spec-correct
  // "user chose nothing / cancelled" response, and the platform handles it gracefully.
  let items;
  try {
    items = await lookupItems(params.getAll("item"));
  } catch (e) {
    return { statusCode: 502, body: "content registry unavailable: " + (e.message || e) };
  }

  const contentItems = items.map((it) => {
    const ci = { type: "link", url: it.url, title: it.title };
    if (it.description) ci.text = it.description;
    if (it.icon) ci.icon = { url: it.icon };
    return ci;
  });

  // LtiDeepLinkingResponse (IMS Deep Linking 2.0 §3.4): the tool speaks as the OAuth
  // client, so iss/aud are the REVERSE of the launch id_token — iss is our client_id at
  // the platform, aud is the platform's issuer.
  const now = Math.floor(Date.now() / 1000);
  const response = {
    iss: session.clientId,
    aud: session.iss,
    exp: now + 300,
    iat: now,
    nonce: crypto.randomBytes(16).toString("hex"),
    [MSG_TYPE_CLAIM]: "LtiDeepLinkingResponse",
    [VERSION_CLAIM]: "1.3.0",
    [DEPLOY_ID_CLAIM]: session.deploymentId,
    [DL_CONTENT_ITEMS_CLAIM]: contentItems,
  };
  // Opaque round-trip token: echoed back verbatim ONLY when the platform sent one.
  if (typeof session.data === "string" && session.data) response[DL_DATA_CLAIM] = session.data;

  const jwt = sign(response);

  // Auto-submitting form_post back to the platform (the deep_link_return_url came out of
  // OUR verified session JWT, not the request body). <noscript> keeps it usable without JS.
  const body =
    `<!doctype html><html><head><meta charset="utf-8"><title>Returning to your LMS…</title></head>` +
    `<body style="font-family:-apple-system,sans-serif;max-width:640px;margin:3rem auto;padding:0 1.5rem">` +
    `<p>Returning ${contentItems.length ? contentItems.length + " resource" + (contentItems.length === 1 ? "" : "s") : "you"} to your LMS…</p>` +
    `<form method="post" action="${esc(session.deep_link_return_url)}">` +
    `<input type="hidden" name="JWT" value="${esc(jwt)}">` +
    `<noscript><button type="submit">Continue to your LMS</button></noscript>` +
    `</form>` +
    `<script>document.forms[0].submit()</script>` +
    `</body></html>`;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    body,
  };
};
