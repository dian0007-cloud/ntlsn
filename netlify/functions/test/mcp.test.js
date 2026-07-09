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
