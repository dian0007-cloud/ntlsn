// NTLSN — hosted MCP server (Model Context Protocol over HTTP, serverless).
// Exposes NTLSN's open sector data as MCP tools any AI client can call by URL —
// no local Python, no key. Endpoint: https://www.ntlsn.com/.netlify/functions/mcp
//   • POST  JSON-RPC 2.0  → MCP (initialize / tools/list / tools/call)
//   • GET                 → human/AI-readable info
// Dependency-free (Node 18+ global fetch). Reads the CORS-open /data/*.json.
"use strict";

// Data origin: prefer this deploy's own URL so Deploy Previews serve the preview's data,
// not production. Falls back to production for local/stdio use.
const ORIGIN =
  process.env.DEPLOY_PRIME_URL || process.env.URL || "https://www.ntlsn.com";
const DATA = `${ORIGIN.replace(/\/$/, "")}/data`;
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Mcp-Session-Id",
  "Content-Type": "application/json",
  "X-Content-Type-Options": "nosniff",
};

const TOOLS = [
  {
    name: "upcoming_events",
    description: "Upcoming Australian higher-education teaching & learning events — conferences, showcases, workshops and webinars across the 42 universities. Optional university id (e.g. 'usq') and a limit.",
    inputSchema: { type: "object", properties: { uni: { type: "string" }, limit: { type: "integer", default: 10 } } },
  },
  {
    name: "search_archive",
    description: "Search the rescued archive of 1,431 ALTC- and OLT-funded teaching-scholarship works (1994-2025) by title or author.",
    inputSchema: { type: "object", properties: { query: { type: "string" }, limit: { type: "integer", default: 15 } }, required: ["query"] },
  },
  {
    name: "universities",
    description: "All 42 Australian universities with their Learning & Teaching team pages, alliance group, and the Traditional Country each stands on.",
    inputSchema: { type: "object", properties: {} },
  },
];

// Module-scope cache — Netlify keeps warm instances, so repeated tool calls reuse the
// parsed JSON instead of re-fetching the full file each time (matches the ~60s docs claim).
const cache = new Map();
const TTL_MS = 60 * 1000;

async function getJSON(file) {
  const hit = cache.get(file);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(`${DATA}/${file}`, { signal: ctrl.signal });
    if (!r.ok) throw new Error(`data ${file} ${r.status}`);
    const data = await r.json();
    cache.set(file, { at: Date.now(), data });
    return data;
  } finally {
    clearTimeout(timer);
  }
}

// Clamp a caller-supplied limit to [1, 100] with a sane default.
function clampLimit(v, dflt) {
  const n = Number(v);
  if (!Number.isFinite(n)) return dflt;
  return Math.min(Math.max(1, Math.floor(n)), 100);
}

async function callTool(name, args) {
  args = args || {};
  if (name === "upcoming_events") {
    let d = await getJSON("events.json");
    const today = new Date().toISOString().slice(0, 10);
    d = d.filter((e) => (e.date || "") >= today);
    if (args.uni) d = d.filter((e) => e.uni === String(args.uni).toLowerCase());
    d.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return d.slice(0, clampLimit(args.limit, 10));
  }
  if (name === "search_archive") {
    const q = String(args.query == null ? "" : args.query).toLowerCase().trim();
    if (!q) {
      const err = new Error("query is required");
      err.code = -32602;
      throw err;
    }
    const d = await getJSON("ltr.json");
    return d.filter((w) => ((w.t || "") + " " + (w.a || "")).toLowerCase().includes(q)).slice(0, clampLimit(args.limit, 15));
  }
  if (name === "universities") return getJSON("universities.json");
  const err = new Error(`unknown tool: ${name}`);
  err.code = -32602;
  throw err;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify(
        {
          name: "ntlsn",
          description: "NTLSN hosted MCP server — Australian higher-education teaching & learning open data.",
          transport: "Model Context Protocol over HTTP — POST JSON-RPC 2.0 to this URL.",
          methods: ["initialize", "tools/list", "tools/call", "ping"],
          tools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
          example: { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "upcoming_events", arguments: { limit: 3 } } },
          docs: "https://www.ntlsn.com/developers.html",
        },
        null,
        2
      ),
    };
  }

  let req;
  try {
    req = JSON.parse(event.body || "{}");
  } catch (_e) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }) };
  }
  const { id, method, params } = req;
  const ok = (result) => ({ statusCode: 200, headers: CORS, body: JSON.stringify({ jsonrpc: "2.0", id: id == null ? null : id, result }) });
  const fail = (code, message) => ({ statusCode: 200, headers: CORS, body: JSON.stringify({ jsonrpc: "2.0", id: id == null ? null : id, error: { code, message } }) });

  try {
    if (method === "initialize")
      return ok({ protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "ntlsn", version: "1.0.0" } });
    if (method === "notifications/initialized" || method === "notifications/cancelled")
      return { statusCode: 202, headers: CORS, body: "" };
    if (method === "ping") return ok({});
    if (method === "tools/list") return ok({ tools: TOOLS });
    if (method === "tools/call") {
      try {
        const data = await callTool(params && params.name, params && params.arguments);
        return ok({ content: [{ type: "text", text: JSON.stringify(data) }] });
      } catch (e) {
        // Argument errors surface as JSON-RPC protocol errors; genuine tool/runtime
        // failures come back as an MCP tool result with isError so the client can show it.
        if (e && e.code === -32602) return fail(-32602, String(e.message || "invalid params"));
        return ok({ content: [{ type: "text", text: "tool error — see server logs" }], isError: true });
      }
    }
    return fail(-32601, `Method not found: ${method}`);
  } catch (e) {
    return fail(-32603, "internal error");
  }
};
