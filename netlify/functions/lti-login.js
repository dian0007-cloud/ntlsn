// NTLSN — LTI 1.3 OIDC third-party login initiation (IMS Security Framework §5.1.1).
// A registered platform's Deep Linking placement lands here first. NTLSN looks the
// issuer up in data/lti-platforms.json, mints a CSRF state + a single-use nonce, and
// redirects to the platform's own authorization endpoint. Nothing institutional is read
// at this step — the launch this leads to (lti-launch.js) only ever offers NTLSN's free,
// public commons back (see the Deep Linking scope note there).
// Needs env: NTLSN_LTI_PRIVATE_KEY is NOT needed here (that's for signing the eventual
// Deep Linking response, Phase B) — login only needs the platform registry.
"use strict";

const crypto = require("crypto");
const { lookupPlatform } = require("../lib/lti-platforms");
const { store } = require("../lib/store");

const NONCE_TTL_MS = 10 * 60 * 1000;
const LAUNCH_URL = (process.env.URL || process.env.DEPLOY_PRIME_URL || "https://www.ntlsn.com").replace(/\/$/, "") + "/.netlify/functions/lti-launch";

function params(event) {
  if (event.httpMethod === "GET") return event.queryStringParameters || {};
  try {
    return Object.fromEntries(new URLSearchParams(event.body || ""));
  } catch (_e) {
    return {};
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return { statusCode: 405, body: "GET or POST only" };
  }
  const p = params(event);
  const iss = p.iss;
  const loginHint = p.login_hint;
  const targetLinkUri = p.target_link_uri;
  if (!iss || !loginHint || !targetLinkUri) {
    return { statusCode: 400, body: "missing required param(s): iss, login_hint, target_link_uri" };
  }

  let platform;
  try {
    platform = await lookupPlatform(iss, p.client_id);
  } catch (e) {
    return { statusCode: 502, body: "platform registry unavailable: " + (e.message || e) };
  }
  if (!platform) return { statusCode: 400, body: "unregistered platform: " + iss };

  const state = crypto.randomBytes(16).toString("hex");
  const nonce = crypto.randomBytes(16).toString("hex");

  const nonceStore = await store("lti-nonce");
  await nonceStore.set(nonce, String(Date.now() + NONCE_TTL_MS));

  const authUrl = new URL(platform.authLoginUrl);
  authUrl.searchParams.set("response_type", "id_token");
  authUrl.searchParams.set("response_mode", "form_post");
  authUrl.searchParams.set("scope", "openid");
  authUrl.searchParams.set("client_id", platform.clientId);
  authUrl.searchParams.set("redirect_uri", LAUNCH_URL);
  authUrl.searchParams.set("login_hint", loginHint);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("nonce", nonce);
  authUrl.searchParams.set("prompt", "none");
  if (p.lti_message_hint) authUrl.searchParams.set("lti_message_hint", p.lti_message_hint);

  return {
    statusCode: 302,
    headers: { Location: authUrl.toString(), "X-Content-Type-Options": "nosniff" },
    multiValueHeaders: {
      // SameSite=None (not Lax, unlike the ORCID flow's state cookie): the platform's
      // response is a cross-site form_post back to lti-launch, not a top-level GET
      // redirect — Lax cookies are withheld on cross-site POST, which would break every
      // launch. This is the well-known "LTI + SameSite" gotcha; don't "fix" it back to Lax.
      "Set-Cookie": [`ntlsn_lti_state=${state}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=600`],
    },
    body: "",
  };
};
