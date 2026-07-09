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
const SD = "https://schema.org/";

const TOOLS = [
  {
    name: "upcoming_events",
    description: "Upcoming Australian higher-education teaching & learning events — conferences, showcases, workshops and webinars across the 42 universities. Optional university id (e.g. 'usq') and a limit.",
    inputSchema: { type: "object", properties: { uni: { type: "string" }, limit: { type: "integer", default: 10 } } },
  },
  {
    name: "events_by_type",
    description: "Upcoming Australian higher-education events of one type (e.g. 'conference', 'workshop', 'webinar', 'symposium', 'showcase'). Returned chronologically. Optional limit.",
    inputSchema: { type: "object", properties: { type: { type: "string" }, limit: { type: "integer", default: 10 } }, required: ["type"] },
  },
  {
    name: "event_detail",
    description: "One NTLSN event by its numeric id, returned as a Schema.org Event (JSON-LD): name, dates, description, organiser institution and place. Call upcoming_events / events_by_type first to find ids.",
    inputSchema: { type: "object", properties: { id: { type: "integer" } }, required: ["id"] },
  },
  {
    name: "search_archive",
    description: "Search the rescued archive of 1,431 ALTC- and OLT-funded teaching-scholarship works (1994-2025) by title or author.",
    inputSchema: { type: "object", properties: { query: { type: "string" }, limit: { type: "integer", default: 15 } }, required: ["query"] },
  },
  {
    name: "best_practice",
    description: "Search 80 curated higher-education learning-&-teaching best-practice works (the LTR best-practice collection) by title or author.",
    inputSchema: { type: "object", properties: { query: { type: "string" }, limit: { type: "integer", default: 15 } }, required: ["query"] },
  },
  {
    name: "universities",
    description: "All 42 Australian universities with their Learning & Teaching team pages, alliance group, and the Traditional Country each stands on.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "recognition_framework",
    description: "The NTLSN Recognition Credit Framework v1.0 — recognition tiers, point thresholds and domains for sector teaching-and-learning scholarship. Editorial draft (evidence-informed; not a sector-ratified standard).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "recognition_crosswalk",
    description: "Illustrative cross-walk of teaching-recognition evidence (e.g. student feedback data, a teaching award, SoTL publications) against four Australian HE recognition pathways — PSF 2023 fellowship, AAUT national awards, a promotion case, and Scholarship of T&L. Not an official equivalence. Optional keyword matches evidence names; omit to return every evidence type and both frameworks.",
    inputSchema: { type: "object", properties: { evidence: { type: "string" } } },
  },
  {
    name: "scholarly_lookup",
    description: "Look up one scholarly entity via its public API: an ORCID iD (researcher profile), a DOI (Crossref work record) or a ROR id (research institution). Pass exactly ONE of orcid / doi / ror. Cached and rate-limited.",
    inputSchema: {
      type: "object",
      properties: { orcid: { type: "string" }, doi: { type: "string" }, ror: { type: "string" } },
    },
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

// --- Schema.org Event shaping ----------------------------------------------
// Mirrors the shape scripts/build-feeds.mjs emits in events-ld.json so the agent payload
// and the web-page JSON-LD are the same object where fields overlap. events.json carries no
// per-event stream URL or attendance mode, so VirtualLocation / eventAttendanceMode are
// omitted here rather than fabricated (they extend trivially once that data exists).
function toSchemaOrgEvent(ev, uniMap) {
  if (!ev) return null;
  const uni = (uniMap && uniMap.get(ev.uni)) || {};
  const out = { "@type": "Event", name: ev.title };
  if (ev.date) out.startDate = ev.date;
  if (ev.endDate) out.endDate = ev.endDate;
  out.eventStatus = `${SD}EventScheduled`;
  if (ev.desc) out.description = ev.desc;
  if (ev.url) out.url = ev.url;
  if (uni.name) {
    const address = { "@type": "PostalAddress", addressCountry: "AU" };
    if (uni.city) address.addressLocality = uni.city;
    if (uni.state) address.addressRegion = uni.state;
    out.location = { "@type": "Place", name: uni.name, address };
    out.organizer = { "@type": "CollegeOrUniversity", name: uni.name };
    if (uni.tlUrl) out.organizer.url = uni.tlUrl;
  }
  return out;
}

// --- External scholarly look-ups (ORCID / Crossref / ROR) ------------------
// Cost controls (mirrors the patterns verified in academic-tools-mcp): a fail-fast
// per-provider concurrency cap (backpressure), single-flight coalescing of identical
// concurrent requests, one transparent retry honouring Retry-After, an 8s timeout, and a
// 24h NEGATIVE cache of definitive 404s so retry-happy agents can't burn invocations looking
// up the same bad DOI/ORCID. All state is in-process per warm instance (no edge product needed).
const NEG_TTL_MS = 24 * 60 * 60 * 1000;
const negCache = new Map();      // `${provider}:${url}` -> expiry ms (404s only)
const inflight = new Map();       // `${provider}:${url}` -> Promise (single-flight)
const providerSlots = new Map(); // provider -> {active, max}
const PROVIDER_MAX = { orcid: 3, crossref: 4, ror: 3 };
const EXT_TIMEOUT_MS = 8000;
const MAX_RETRY_WAIT_MS = 5000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseRetryAfter(v) {
  if (!v) return 0;
  const n = Number(v);
  if (Number.isFinite(n)) return Math.min(n * 1000, MAX_RETRY_WAIT_MS); // delta-seconds
  const t = Date.parse(v);
  if (Number.isFinite(t)) return Math.min(Math.max(0, t - Date.now()), MAX_RETRY_WAIT_MS); // HTTP-date
  return 0;
}

function acquireSlot(provider) {
  const max = PROVIDER_MAX[provider] || 3;
  let s = providerSlots.get(provider);
  if (!s) {
    s = { active: 0, max };
    providerSlots.set(provider, s);
  }
  if (s.active >= s.max) return null; // backpressure — fail fast, tell the agent to retry
  s.active++;
  return () => {
    s.active--;
  };
}

async function fetchExternal(provider, url) {
  const key = `${provider}:${url}`;
  const neg = negCache.get(key);
  if (neg && neg > Date.now()) {
    const e = new Error(`${provider}: not found (cached)`);
    e.code = 404;
    e.retryable = false;
    throw e;
  }
  // Single-flight: identical concurrent look-ups share one fetch.
  let p = inflight.get(key);
  if (!p) {
    p = doFetchExternal(provider, url, key).finally(() => inflight.delete(key));
    inflight.set(key, p);
  }
  return p;
}

async function doFetchExternal(provider, url, key) {
  const release = acquireSlot(provider);
  if (!release) {
    const e = new Error(`${provider}: busy, retry shortly`);
    e.code = 503;
    e.retryable = true;
    e.backpressure = true;
    throw e;
  }
  try {
    let lastErr;
    for (let attempt = 0; attempt < 2; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), EXT_TIMEOUT_MS);
      try {
        const r = await fetch(url, { headers: { Accept: "application/json" }, signal: ctrl.signal });
        if (r.status === 404) {
          negCache.set(key, Date.now() + NEG_TTL_MS);
          const e = new Error(`${provider}: not found`);
          e.code = 404;
          e.retryable = false;
          throw e;
        }
        if (r.status === 429 || r.status >= 500) {
          const e = new Error(`${provider}: upstream ${r.status}`);
          e.code = r.status;
          e.retryable = true;
          e.backpressure = true;
          if (attempt === 0) {
            const wait = parseRetryAfter(r.headers.get("retry-after"));
            if (wait > 0) await sleep(wait);
            else throw e; // nothing to honour — surface as retryable now
            continue;
          }
          throw e;
        }
        if (!r.ok) {
          const e = new Error(`${provider}: upstream ${r.status}`);
          e.code = r.status;
          e.retryable = false;
          throw e;
        }
        return await r.json();
      } catch (e) {
        if (e && e.code) throw e; // already classified (404 / 4xx / 5xx / backpressure)
        // Network/timeout: one transparent retry, then fail-soft as unreachable.
        lastErr = e;
      } finally {
        clearTimeout(timer);
      }
    }
    const e = new Error(`${provider}: unreachable`);
    e.code = 502;
    e.retryable = true;
    e.cause = lastErr && lastErr.message;
    throw e;
  } finally {
    release();
  }
}

// A clean "not found" result for an expected 404 — the agent reads this and stops retrying,
// rather than the generic isError path which implies a server fault.
function notFound(type, identifier) {
  return { "@type": type, identifier, notFound: true };
}

// Condense each provider's record to the fields an agent actually needs.
async function lookupOrcid(raw) {
  const orcid = String(raw || "").trim();
  if (!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(orcid)) {
    const e = new Error("orcid must be 16 digits in ####-####-####-### format");
    e.code = -32602;
    throw e;
  }
  let rec;
  try {
    rec = await fetchExternal("orcid", `https://pub.orcid.org/v3.0/${orcid}/person`);
  } catch (e) {
    if (e.code === 404) return notFound("Person", `https://orcid.org/${orcid}`);
    throw e;
  }
  const name = rec.name || {};
  const urls = (rec["researcher-urls"] && rec["researcher-urls"]["researcher-url"]) || [];
  return {
    "@type": "Person",
    identifier: `https://orcid.org/${orcid}`,
    name: [name["given-names"], name["family-name"]].filter(Boolean).join(" ") || undefined,
    biography: rec.biography && rec.biography.content,
    keywords: (rec.keywords && rec.keywords.keyword || []).map((k) => k.content).filter(Boolean),
    researcherUrls: urls.map((u) => u.url && u.url.value).filter(Boolean),
  };
}

async function lookupDoi(raw) {
  const doi = String(raw || "").trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  if (!/^10\./.test(doi)) {
    const e = new Error("doi must start with '10.' (bare or as a doi.org URL)");
    e.code = -32602;
    throw e;
  }
  let rec;
  try {
    rec = await fetchExternal("crossref", `https://api.crossref.org/works/${encodeURIComponent(doi)}`);
  } catch (e) {
    if (e.code === 404) return notFound("ScholarlyArticle", `https://doi.org/${doi}`);
    throw e;
  }
  const m = rec.message || {};
  const first = (a) => (Array.isArray(a) ? a[0] : a);
  const dateParts = (m.published && m.published["date-parts"] && m.published["date-parts"][0]) || [];
  return {
    "@type": "ScholarlyArticle",
    identifier: `https://doi.org/${doi}`,
    name: first(m.title),
    author: (m.author || []).map((a) => [a.given, a.family].filter(Boolean).join(" ")).filter(Boolean),
    isPartOf: first(m["container-title"]) ? { name: first(m["container-title"]) } : undefined,
    datePublished: dateParts.length ? dateParts.join("-") : undefined,
    publisher: m.publisher,
    url: m.URL,
    type: m.type,
  };
}

async function lookupRor(raw) {
  let ror = String(raw || "").trim();
  if (/^https?:\/\/ror\.org\//i.test(ror)) ror = ror.replace(/^https?:\/\/ror\.org\//i, "");
  if (!/^[0-9a-z]+$/.test(ror)) {
    const e = new Error("ror must be a ROR id (e.g. '0489m5b54' or its ror.org URL)");
    e.code = -32602;
    throw e;
  }
  let rec;
  try {
    rec = await fetchExternal("ror", `https://api.ror.org/v2/organizations/${ror}`);
  } catch (e) {
    if (e.code === 404) return notFound("EducationalOrganization", `https://ror.org/${ror}`);
    throw e;
  }
  return {
    "@type": "EducationalOrganization",
    identifier: rec.id || `https://ror.org/${ror}`,
    name: rec.name,
    aliases: rec.aliases,
    acronyms: rec.acronyms,
    types: rec.types,
    country: rec.country && rec.country.country_name,
    url: (rec.links && rec.links[0]) || undefined,
  };
}

// Exactly one identifier per call.
async function scholarlyLookup(args) {
  args = args || {};
  const ids = ["orcid", "doi", "ror"].filter((k) => args[k] != null && args[k] !== "");
  if (ids.length !== 1) {
    const e = new Error(
      ids.length === 0
        ? "provide exactly one of: orcid, doi, ror"
        : `provide exactly ONE of orcid/doi/ror (got ${ids.length}: ${ids.join(", ")})`
    );
    e.code = -32602;
    throw e;
  }
  if (ids[0] === "orcid") return lookupOrcid(args.orcid);
  if (ids[0] === "doi") return lookupDoi(args.doi);
  return lookupRor(args.ror);
}

async function callTool(name, args) {
  args = args || {};
  if (name === "upcoming_events") {
    let d = await getJSON("events.json");
    const today = new Date().toISOString().slice(0, 10);
    // Keep an event while it is still RUNNING, not only before it starts: compare against the
    // END of its span (endDate), falling back to its start date (audit v2 L8 — previously a
    // multi-day event was dropped from "what's on" on its own second day).
    d = d.filter((e) => (e.endDate || e.date || "") >= today);
    if (args.uni) d = d.filter((e) => e.uni === String(args.uni).toLowerCase());
    d.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return d.slice(0, clampLimit(args.limit, 10));
  }
  if (name === "events_by_type") {
    const type = String(args.type == null ? "" : args.type).toLowerCase().trim();
    if (!type) {
      const err = new Error("type is required (e.g. conference, workshop, webinar, symposium)");
      err.code = -32602;
      throw err;
    }
    let d = await getJSON("events.json");
    const today = new Date().toISOString().slice(0, 10);
    d = d.filter((e) => String(e.type || "").toLowerCase() === type && (e.endDate || e.date || "") >= today);
    d.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return d.slice(0, clampLimit(args.limit, 10));
  }
  if (name === "event_detail") {
    const id = Number(args.id);
    if (!Number.isInteger(id)) {
      const err = new Error("id (integer) is required");
      err.code = -32602;
      throw err;
    }
    const [events, unis] = await Promise.all([getJSON("events.json"), getJSON("universities.json")]);
    const uniMap = new Map(unis.map((u) => [u.id, u]));
    const ev = events.find((e) => e.id === id);
    return toSchemaOrgEvent(ev, uniMap); // null when not found
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
  if (name === "best_practice") {
    const q = String(args.query == null ? "" : args.query).toLowerCase().trim();
    if (!q) {
      const err = new Error("query is required");
      err.code = -32602;
      throw err;
    }
    const d = await getJSON("ltr-bestpractice.json");
    return d.filter((w) => ((w.t || "") + " " + (w.a || "")).toLowerCase().includes(q)).slice(0, clampLimit(args.limit, 15));
  }
  if (name === "universities") return getJSON("universities.json");
  if (name === "recognition_framework") return getJSON("rcf.json");
  if (name === "recognition_crosswalk") {
    const cw = await getJSON("recognition-crosswalk.json");
    const q = String(args.evidence == null ? "" : args.evidence).toLowerCase().trim();
    const evidence = q ? cw.evidence.filter((e) => e.name.toLowerCase().includes(q)) : cw.evidence;
    return { frameworks: cw.frameworks, evidence, disclaimer: cw.disclaimer, license: cw.license };
  }
  if (name === "scholarly_lookup") return scholarlyLookup(args);
  const err = new Error(`unknown tool: ${name}`);
  err.code = -32602;
  throw err;
}

exports.clampLimit = clampLimit;
exports.toSchemaOrgEvent = toSchemaOrgEvent;
exports.scholarlyLookup = scholarlyLookup;

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
      return ok({ protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "ntlsn", version: "1.1.0" } });
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
        // The client-facing message references server logs — actually write one so the failure
        // (upstream data fetch, timeout) is diagnosable instead of silently swallowed (audit v2 L9).
        console.error("[ntlsn/mcp] tool error", params && params.name, (e && e.message) || e);
        return ok({ content: [{ type: "text", text: "tool error — see server logs" }], isError: true });
      }
    }
    return fail(-32601, `Method not found: ${method}`);
  } catch (e) {
    return fail(-32603, "internal error");
  }
};
