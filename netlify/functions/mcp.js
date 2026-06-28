// NTLSN — hosted MCP server (Model Context Protocol over HTTP, serverless).
// Exposes NTLSN's open sector data as MCP tools any AI client can call by URL —
// no local Python, no key. Endpoint: https://www.ntlsn.com/.netlify/functions/mcp
//   • POST  JSON-RPC 2.0  → MCP (initialize / tools/list / tools/call)
//   • GET                 → human/AI-readable info
// Dependency-free (Node 18+ global fetch). Reads the CORS-open /data/*.json.

const DATA = "https://www.ntlsn.com/data";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Mcp-Session-Id",
  "Content-Type": "application/json",
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

async function getJSON(file) {
  const r = await fetch(`${DATA}/${file}`);
  if (!r.ok) throw new Error(`data ${file} ${r.status}`);
  return r.json();
}

async function callTool(name, args) {
  args = args || {};
  if (name === "upcoming_events") {
    let d = await getJSON("events.json");
    const today = new Date().toISOString().slice(0, 10);
    d = d.filter((e) => (e.date || "") >= today);
    if (args.uni) d = d.filter((e) => e.uni === String(args.uni).toLowerCase());
    d.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return d.slice(0, args.limit || 10);
  }
  if (name === "search_archive") {
    const q = String(args.query || "").toLowerCase();
    const d = await getJSON("ltr.json");
    return d.filter((w) => ((w.t || "") + " " + (w.a || "")).toLowerCase().includes(q)).slice(0, args.limit || 15);
  }
  if (name === "universities") return getJSON("universities.json");
  throw new Error(`unknown tool: ${name}`);
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
  } catch (e) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }) };
  }
  const { id, method, params } = req;
  const ok = (result) => ({ statusCode: 200, headers: CORS, body: JSON.stringify({ jsonrpc: "2.0", id, result }) });
  const fail = (code, message) => ({ statusCode: 200, headers: CORS, body: JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }) });

  try {
    if (method === "initialize")
      return ok({ protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "ntlsn", version: "1.0.0" } });
    if (method === "notifications/initialized" || method === "notifications/cancelled")
      return { statusCode: 202, headers: CORS, body: "" };
    if (method === "ping") return ok({});
    if (method === "tools/list") return ok({ tools: TOOLS });
    if (method === "tools/call") {
      const data = await callTool(params && params.name, params && params.arguments);
      return ok({ content: [{ type: "text", text: JSON.stringify(data) }] });
    }
    return fail(-32601, `Method not found: ${method}`);
  } catch (e) {
    return fail(-32603, String(e.message || e));
  }
};
