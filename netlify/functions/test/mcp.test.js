"use strict";
const { test } = require("node:test");
const assert = require("node:assert");

function load() {
  delete require.cache[require.resolve("../mcp.js")];
  return require("../mcp.js");
}
function withData(map, fn) {
  const orig = global.fetch;
  global.fetch = async (url) => {
    const file = String(url).split("/").pop();
    if (map[file]) return { ok: true, json: async () => map[file] };
    return { ok: false, status: 404, json: async () => ({}) };
  };
  return fn().finally(() => {
    global.fetch = orig;
  });
}
function rpc(handler, body) {
  return handler({ httpMethod: "POST", headers: {}, body: JSON.stringify(body) });
}

test("GET returns the info document", async () => {
  const { handler } = load();
  const res = await handler({ httpMethod: "GET", headers: {} });
  assert.strictEqual(res.statusCode, 200);
  assert.match(res.body, /"name": "ntlsn"/);
});

test("parse error → -32700", async () => {
  const { handler } = load();
  const res = await handler({ httpMethod: "POST", headers: {}, body: "{not json" });
  assert.strictEqual(JSON.parse(res.body).error.code, -32700);
});

test("unknown method → -32601", async () => {
  const { handler } = load();
  const res = await rpc(handler, { jsonrpc: "2.0", id: 1, method: "nope" });
  assert.strictEqual(JSON.parse(res.body).error.code, -32601);
});

test("notifications/initialized → 202 no body", async () => {
  const { handler } = load();
  const res = await rpc(handler, { jsonrpc: "2.0", method: "notifications/initialized" });
  assert.strictEqual(res.statusCode, 202);
});

test("search_archive with empty query → -32602", async () => {
  const { handler } = load();
  await withData({ "ltr.json": [{ t: "x", a: "y" }] }, async () => {
    const res = await rpc(handler, { jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "search_archive", arguments: { query: "  " } } });
    assert.strictEqual(JSON.parse(res.body).error.code, -32602);
  });
});

test("limit is clamped to <=100 even when a caller asks for a huge value", async () => {
  const { handler } = load();
  const many = Array.from({ length: 500 }, (_v, i) => ({ t: "work " + i, a: "author" }));
  await withData({ "ltr.json": many }, async () => {
    const res = await rpc(handler, { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "search_archive", arguments: { query: "work", limit: 99999 } } });
    const rows = JSON.parse(JSON.parse(res.body).result.content[0].text);
    assert.strictEqual(rows.length, 100);
  });
});

test("upcoming_events filters to today-or-later and defaults sensibly", async () => {
  const { handler } = load();
  const events = [
    { uni: "usq", date: "2000-01-01", title: "past" },
    { uni: "usq", date: "2999-01-01", title: "future" },
  ];
  await withData({ "events.json": events }, async () => {
    const res = await rpc(handler, { jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "upcoming_events", arguments: {} } });
    const rows = JSON.parse(JSON.parse(res.body).result.content[0].text);
    assert.strictEqual(rows.length, 1);
    assert.strictEqual(rows[0].title, "future");
  });
});

test("unknown tool → -32602 params error", async () => {
  const { handler } = load();
  const res = await rpc(handler, { jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "does_not_exist", arguments: {} } });
  assert.strictEqual(JSON.parse(res.body).error.code, -32602);
});

test("upcoming_events keeps a multi-day event on its second day (endDate honoured)", async () => {
  // Regression for audit v2 L8: the old filter compared only e.date, so an event was dropped
  // from "what's on" on days 2..N of its own span while still running.
  const { handler } = load();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const events = [
    { uni: "usq", date: yesterday, endDate: today, title: "day2-of-symposium" },
    { uni: "usq", date: yesterday, endDate: yesterday, title: "ended-yesterday" },
  ];
  await withData({ "events.json": events }, async () => {
    const res = await rpc(handler, { jsonrpc: "2.0", id: 6, method: "tools/call", params: { name: "upcoming_events", arguments: {} } });
    const rows = JSON.parse(JSON.parse(res.body).result.content[0].text);
    assert.strictEqual(rows.length, 1);
    assert.strictEqual(rows[0].title, "day2-of-symposium");
  });
});

test("clampLimit edges: 0->1, negative->1, non-numeric->default, fractional floors, caps 100, null->1", () => {
  // Regression for audit v2 L10: clampLimit was covered only at the upper bound. Pin its
  // non-obvious behaviours so a refactor (floor->round, or treating 0 as default) can't slip through.
  const { clampLimit } = load();
  assert.strictEqual(clampLimit(0, 10), 1, "0 is finite -> clamped to min 1, not the default");
  assert.strictEqual(clampLimit(-2, 10), 1);
  assert.strictEqual(clampLimit("abc", 10), 10, "non-numeric -> default");
  assert.strictEqual(clampLimit(undefined, 10), 10);
  assert.strictEqual(clampLimit(1.9, 10), 1, "fractional floors");
  assert.strictEqual(clampLimit(50, 10), 50);
  assert.strictEqual(clampLimit(100, 10), 100);
  assert.strictEqual(clampLimit(101, 10), 100, "caps at 100");
  assert.strictEqual(clampLimit(null, 10), 1, "Number(null)=0 -> clamped to 1 (not default)");
});

// --- Increment 1: new read-only tools -------------------------------------
// Mock external (ORCID/Crossref/ROR) fetches by URL substring; records every call so the
// cost-control claims (negative cache, single-flight) can be asserted directly.
function mockUrls(map) {
  const calls = [];
  const orig = global.fetch;
  global.fetch = async (url) => {
    const u = String(url);
    calls.push(u);
    for (const key of Object.keys(map)) {
      if (u.includes(key)) {
        const m = map[key];
        const status = m.status || 200;
        return {
          ok: status >= 200 && status < 300,
          status,
          headers: { get: (h) => (String(h).toLowerCase() === "retry-after" ? m.retryAfter : null) },
          json: async () => m.body,
        };
      }
    }
    return { ok: false, status: 404, headers: { get: () => null }, json: async () => ({}) };
  };
  return { calls, restore: () => { global.fetch = orig; } };
}

test("tools/list advertises all nine tools", async () => {
  const { handler } = load();
  const res = await rpc(handler, { jsonrpc: "2.0", id: 1, method: "tools/list" });
  const names = JSON.parse(res.body).result.tools.map((t) => t.name);
  for (const n of ["upcoming_events", "events_by_type", "event_detail", "search_archive", "best_practice", "universities", "recognition_framework", "recognition_crosswalk", "scholarly_lookup"]) {
    assert.ok(names.includes(n), `tools/list missing ${n}`);
  }
});

test("event_detail returns a Schema.org Event with organiser joined from universities", async () => {
  const { handler } = load();
  const events = [{ id: 7, title: "Symposium", uni: "usq", date: "2030-01-01", endDate: "2030-01-02", type: "symposium", desc: "d", url: "https://e" }];
  const unis = [{ id: "usq", name: "University of Southern Queensland", city: "Toowoomba", state: "QLD", tlUrl: "https://tl" }];
  await withData({ "events.json": events, "universities.json": unis }, async () => {
    const res = await rpc(handler, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "event_detail", arguments: { id: 7 } } });
    const ev = JSON.parse(JSON.parse(res.body).result.content[0].text);
    assert.strictEqual(ev["@type"], "Event");
    assert.strictEqual(ev.name, "Symposium");
    assert.strictEqual(ev.startDate, "2030-01-01");
    assert.strictEqual(ev.endDate, "2030-01-02");
    assert.strictEqual(ev.eventStatus, "https://schema.org/EventScheduled");
    assert.strictEqual(ev.organizer["@type"], "CollegeOrUniversity");
    assert.strictEqual(ev.organizer.name, "University of Southern Queensland");
    assert.strictEqual(ev.location.address.addressRegion, "QLD");
    assert.strictEqual(ev.location.address.addressCountry, "AU");
  });
});

test("event_detail unknown id → null (not an error)", async () => {
  const { handler } = load();
  await withData({ "events.json": [{ id: 1, title: "x", uni: "usq" }], "universities.json": [] }, async () => {
    const res = await rpc(handler, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "event_detail", arguments: { id: 999 } } });
    assert.strictEqual(JSON.parse(res.body).result.content[0].text, "null");
  });
});

test("event_detail missing/non-integer id → -32602", async () => {
  const { handler } = load();
  const res = await rpc(handler, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "event_detail", arguments: {} } });
  assert.strictEqual(JSON.parse(res.body).error.code, -32602);
});

test("events_by_type filters by type and keeps only upcoming", async () => {
  const { handler } = load();
  const events = [
    { type: "conference", date: "2000-01-01", title: "past-conf" },
    { type: "conference", date: "2999-01-01", title: "future-conf" },
    { type: "workshop", date: "2999-01-01", title: "future-work" },
  ];
  await withData({ "events.json": events }, async () => {
    const res = await rpc(handler, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "events_by_type", arguments: { type: "CONFERENCE" } } });
    const rows = JSON.parse(JSON.parse(res.body).result.content[0].text);
    assert.strictEqual(rows.length, 1);
    assert.strictEqual(rows[0].title, "future-conf");
  });
});

test("events_by_type missing type → -32602", async () => {
  const { handler } = load();
  const res = await rpc(handler, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "events_by_type", arguments: {} } });
  assert.strictEqual(JSON.parse(res.body).error.code, -32602);
});

test("best_practice searches title/author and clamps", async () => {
  const { handler } = load();
  await withData({ "ltr-bestpractice.json": [{ t: "Active learning design", a: "Lee" }, { t: "Other", a: "Ng" }] }, async () => {
    const res = await rpc(handler, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "best_practice", arguments: { query: "active" } } });
    const rows = JSON.parse(JSON.parse(res.body).result.content[0].text);
    assert.strictEqual(rows.length, 1);
    assert.strictEqual(rows[0].t, "Active learning design");
  });
});

test("best_practice empty query → -32602", async () => {
  const { handler } = load();
  const res = await rpc(handler, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "best_practice", arguments: { query: "  " } } });
  assert.strictEqual(JSON.parse(res.body).error.code, -32602);
});

test("recognition_framework returns the framework document", async () => {
  const { handler } = load();
  await withData({ "rcf.json": { framework: "NTLSN Recognition Credit Framework", version: "1.0", tiers: [{ name: "Emerging" }] } }, async () => {
    const res = await rpc(handler, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "recognition_framework", arguments: {} } });
    const doc = JSON.parse(JSON.parse(res.body).result.content[0].text);
    assert.strictEqual(doc.framework, "NTLSN Recognition Credit Framework");
    assert.ok(Array.isArray(doc.tiers));
  });
});

test("recognition_crosswalk returns all evidence + frameworks when no keyword given", async () => {
  const { handler } = load();
  const cw = {
    frameworks: [{ key: "PSF", name: "PSF 2023", cells: [{ key: "A", label: "Areas of Activity" }] }],
    evidence: [
      { id: "a", name: "A teaching award or nomination", maps: { PSF: ["A"] } },
      { id: "b", name: "Mentoring records", maps: { PSF: ["A"] } },
    ],
    disclaimer: "Illustrative only.",
    license: "CC-BY-4.0",
  };
  await withData({ "recognition-crosswalk.json": cw }, async () => {
    const res = await rpc(handler, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "recognition_crosswalk", arguments: {} } });
    const doc = JSON.parse(JSON.parse(res.body).result.content[0].text);
    assert.strictEqual(doc.evidence.length, 2);
    assert.strictEqual(doc.frameworks.length, 1);
    assert.strictEqual(doc.disclaimer, "Illustrative only.");
  });
});

test("recognition_crosswalk filters evidence by keyword, case-insensitively", async () => {
  const { handler } = load();
  const cw = {
    frameworks: [],
    evidence: [
      { id: "a", name: "A teaching award or nomination", maps: {} },
      { id: "b", name: "Mentoring records", maps: {} },
    ],
    disclaimer: "d",
    license: "CC-BY-4.0",
  };
  await withData({ "recognition-crosswalk.json": cw }, async () => {
    const res = await rpc(handler, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "recognition_crosswalk", arguments: { evidence: "AWARD" } } });
    const doc = JSON.parse(JSON.parse(res.body).result.content[0].text);
    assert.strictEqual(doc.evidence.length, 1);
    assert.strictEqual(doc.evidence[0].id, "a");
  });
});

test("toSchemaOrgEvent: full shape with university join", () => {
  const { toSchemaOrgEvent } = load();
  const ev = toSchemaOrgEvent({ title: "T", date: "2030-01-01", uni: "usq" }, new Map([["usq", { name: "U", city: "C", state: "S", tlUrl: "L" }]]));
  assert.strictEqual(ev["@type"], "Event");
  assert.strictEqual(ev.organizer.url, "L");
  assert.strictEqual(ev.location.address.addressLocality, "C");
});

test("toSchemaOrgEvent: no event → null; no uni → no location/organizer", () => {
  const { toSchemaOrgEvent } = load();
  assert.strictEqual(toSchemaOrgEvent(null, new Map()), null);
  const ev = toSchemaOrgEvent({ title: "T" }, new Map());
  assert.strictEqual(ev.location, undefined);
  assert.strictEqual(ev.organizer, undefined);
});

test("scholarly_lookup: no identifier → -32602", async () => {
  const { scholarlyLookup } = load();
  await assert.rejects(scholarlyLookup({}), (e) => e.code === -32602);
});

test("scholarly_lookup: more than one identifier → -32602", async () => {
  const { scholarlyLookup } = load();
  await assert.rejects(scholarlyLookup({ orcid: "0000-0000-0000-0000", doi: "10.1/x" }), (e) => e.code === -32602);
});

test("scholarly_lookup: malformed identifiers → -32602", async () => {
  const { scholarlyLookup } = load();
  await assert.rejects(scholarlyLookup({ orcid: "nope" }), (e) => e.code === -32602);
  await assert.rejects(scholarlyLookup({ doi: "not-a-doi" }), (e) => e.code === -32602);
  await assert.rejects(scholarlyLookup({ ror: "bad id!" }), (e) => e.code === -32602);
});

test("scholarly_lookup: DOI happy path returns a condensed ScholarlyArticle", async () => {
  const { scholarlyLookup } = load();
  const m = mockUrls({ "api.crossref.org": { body: { message: { title: ["A Paper"], author: [{ given: "A", family: "Bee" }], "container-title": ["Journal"], published: { "date-parts": [[2024, 5]] }, publisher: "Pub", URL: "https://doi.org/10.1/x", type: "journal-article" } } } });
  try {
    const r = await scholarlyLookup({ doi: "https://doi.org/10.1/x" });
    assert.strictEqual(r["@type"], "ScholarlyArticle");
    assert.strictEqual(r.name, "A Paper");
    assert.deepStrictEqual(r.author, ["A Bee"]);
    assert.strictEqual(r.isPartOf.name, "Journal");
    assert.strictEqual(r.datePublished, "2024-5");
    assert.strictEqual(r.identifier, "https://doi.org/10.1/x");
  } finally {
    m.restore();
  }
});

test("scholarly_lookup: 404 is negative-cached — fetched exactly once across two calls", async () => {
  const { scholarlyLookup } = load();
  const m = mockUrls({ "api.crossref.org": { status: 404 } });
  try {
    const a = await scholarlyLookup({ doi: "10.1/missing" });
    const b = await scholarlyLookup({ doi: "10.1/missing" });
    assert.strictEqual(a.notFound, true);
    assert.strictEqual(b.notFound, true);
    assert.strictEqual(m.calls.filter((u) => u.includes("crossref")).length, 1, "second lookup must hit the negative cache, not the network");
  } finally {
    m.restore();
  }
});

test("scholarly_lookup: identical concurrent lookups coalesce via single-flight (one fetch)", async () => {
  const { scholarlyLookup } = load();
  const m = mockUrls({ "api.crossref.org": { body: { message: { title: ["Shared"] } } } });
  try {
    const [a, b] = await Promise.all([scholarlyLookup({ doi: "10.1/x" }), scholarlyLookup({ doi: "10.1/x" })]);
    assert.strictEqual(a.name, "Shared");
    assert.strictEqual(b.name, "Shared");
    assert.strictEqual(m.calls.filter((u) => u.includes("crossref")).length, 1, "single-flight: two concurrent identical lookups share one fetch");
  } finally {
    m.restore();
  }
});
