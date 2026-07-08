// NTLSN — public LIVE-state probe. Returns whether a symposium's Zoom meeting is currently
// live, so the page can show a LIVE badge and reveal the watch embed. Driven by the
// signature-verified zoom-webhooks handler writing to the zoom-live blob store.
// GET ?meetingNumber=NNNNNNNNN  ->  { meetingNumber, live }
"use strict";

const { store } = require("../lib/store");
const MEETING_RE = /^[0-9]{9,11}$/;

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (event.httpMethod && event.httpMethod !== "GET")
    return { statusCode: 405, headers, body: JSON.stringify({ error: "GET only" }) };

  const q = event.queryStringParameters || {};
  const meetingNumber = String(q.meetingNumber || "");
  if (!MEETING_RE.test(meetingNumber))
    return { statusCode: 400, headers, body: JSON.stringify({ error: "valid meetingNumber required" }) };

  let live = false;
  try {
    const rec = await (await store("zoom-live")).get(meetingNumber, { type: "json" });
    live = !!(rec && rec.live);
  } catch (e) {
    // Fail-safe (report not-live) but make a store error observable so an operator can tell a
    // Blobs outage from a genuinely-ended meeting at the exact moment the LIVE badge matters
    // (audit v2 L14). Previously the error was swallowed with no server-side trace.
    console.error("[ntlsn/zoom-live] store read failed for", meetingNumber, (e && e.message) || e);
    live = false;
  }
  return { statusCode: 200, headers, body: JSON.stringify({ meetingNumber, live }) };
};
