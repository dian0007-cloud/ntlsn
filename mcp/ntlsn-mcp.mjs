#!/usr/bin/env node
/**
 * NTLSN MCP server — makes the National Teaching & Learning Sector Navigator
 * queryable by any MCP-capable AI assistant (Claude Desktop, Claude Code, etc.).
 *
 * Dependency-free (Node 18+, global fetch). Speaks MCP over stdio
 * (newline-delimited JSON-RPC 2.0).
 *
 *   node mcp/ntlsn-mcp.mjs            # uses live www.ntlsn.com data
 *   NTLSN_ORIGIN=http://localhost:8899 node mcp/ntlsn-mcp.mjs   # local testing
 *
 * Tools: search_events, upcoming_events, list_universities, whose_country
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ORIGIN = process.env.NTLSN_ORIGIN || 'https://www.ntlsn.com';
const LOCAL = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');

const cache = {};
async function data(name) {
  if (cache[name]) return cache[name];
  try {
    const r = await fetch(ORIGIN + '/data/' + name + '.json');
    if (r.ok) return (cache[name] = await r.json());
    throw new Error('HTTP ' + r.status);
  } catch (e) {
    // offline / dev fallback: the repo's own data files
    return (cache[name] = JSON.parse(fs.readFileSync(path.join(LOCAL, name + '.json'), 'utf8')));
  }
}

const TOOLS = [
  {
    name: 'search_events',
    description: 'Search Australian higher-education teaching & learning events (conferences, symposiums, workshops, webinars) by keyword, state, type, or date range.',
    inputSchema: { type: 'object', properties: {
      query: { type: 'string', description: 'Keyword matched against title and description' },
      state: { type: 'string', description: 'Host state: NSW, VIC, QLD, WA, SA, TAS, ACT, NT' },
      type: { type: 'string', description: 'conference | symposium | workshop | webinar | showcase | week' },
      from: { type: 'string', description: 'Earliest start date, YYYY-MM-DD' },
      to: { type: 'string', description: 'Latest start date, YYYY-MM-DD' }
    } }
  },
  {
    name: 'upcoming_events',
    description: 'List sector events starting in the next N days (default 30).',
    inputSchema: { type: 'object', properties: {
      days: { type: 'number', description: 'Horizon in days (default 30)' }
    } }
  },
  {
    name: 'list_universities',
    description: 'List Australian universities in the NTLSN dataset, optionally filtered by state or network group (Go8, ATN, IRU, RUN, Unaligned). Includes each institution’s teaching & learning unit URL.',
    inputSchema: { type: 'object', properties: {
      state: { type: 'string' }, group: { type: 'string' }
    } }
  },
  {
    name: 'whose_country',
    description: 'Return the Traditional Country/Custodians acknowledged for a university campus (by id, abbreviation, or name fragment).',
    inputSchema: { type: 'object', properties: {
      university: { type: 'string', description: 'e.g. usq, UniSQ, Melbourne' }
    }, required: ['university'] }
  }
];

const fmtEvent = (e, uniMap) => {
  const u = uniMap[e.uni] || {};
  return `- ${e.title} (${e.type}) — ${e.date}${e.endDate && e.endDate !== e.date ? ' to ' + e.endDate : ''} · ${u.abbr || e.uni}${e.url ? ' · ' + e.url : ''}\n  ${e.desc || ''}`;
};

async function call(name, args = {}) {
  const [events, unis] = await Promise.all([data('events'), data('universities')]);
  const uniMap = Object.fromEntries(unis.map(u => [u.id, u]));
  const today = new Date().toISOString().slice(0, 10);

  if (name === 'search_events') {
    let r = events;
    if (args.query) { const q = args.query.toLowerCase(); r = r.filter(e => (e.title + ' ' + (e.desc || '')).toLowerCase().includes(q)); }
    if (args.state) r = r.filter(e => (uniMap[e.uni] || {}).state === args.state.toUpperCase());
    if (args.type) r = r.filter(e => e.type === args.type.toLowerCase());
    if (args.from) r = r.filter(e => e.date >= args.from);
    if (args.to) r = r.filter(e => e.date <= args.to);
    r = r.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 25);
    return r.length ? `${r.length} event(s):\n` + r.map(e => fmtEvent(e, uniMap)).join('\n') : 'No events matched.';
  }
  if (name === 'upcoming_events') {
    const days = args.days || 30;
    const horizon = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
    const r = events.filter(e => e.date >= today && e.date <= horizon).sort((a, b) => a.date.localeCompare(b.date));
    return r.length ? `${r.length} event(s) in the next ${days} days:\n` + r.map(e => fmtEvent(e, uniMap)).join('\n') : `No events in the next ${days} days.`;
  }
  if (name === 'list_universities') {
    let r = unis;
    if (args.state) r = r.filter(u => u.state === args.state.toUpperCase());
    if (args.group) r = r.filter(u => (u.group || '').toLowerCase() === args.group.toLowerCase());
    return `${r.length} institution(s):\n` + r.map(u => `- ${u.name} (${u.abbr}, ${u.city} ${u.state}, ${u.group}) — L&T unit: ${u.tlUrl}`).join('\n');
  }
  if (name === 'whose_country') {
    const q = String(args.university || '').toLowerCase();
    const u = unis.find(x => x.id === q || (x.abbr || '').toLowerCase() === q) ||
              unis.find(x => (x.name || '').toLowerCase().includes(q));
    if (!u) return `No institution matched "${args.university}".`;
    return `${u.name} (${u.abbr}) in ${u.city}, ${u.state} stands on the Country of the ${u.traditionalCountry} peoples.`;
  }
  throw new Error('Unknown tool: ' + name);
}

// ── MCP stdio plumbing (newline-delimited JSON-RPC 2.0) ──
const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
let buf = '';
process.stdin.on('data', (chunk) => {
  buf += chunk;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
    if (!line) continue;
    let req; try { req = JSON.parse(line); } catch { continue; }
    handle(req);
  }
});

async function handle(req) {
  const { id, method, params } = req;
  try {
    if (method === 'initialize') {
      send({ jsonrpc: '2.0', id, result: {
        protocolVersion: params?.protocolVersion || '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'ntlsn', version: '1.0.0' }
      } });
    } else if (method === 'notifications/initialized' || (method || '').startsWith('notifications/')) {
      // notifications need no response
    } else if (method === 'tools/list') {
      send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
    } else if (method === 'tools/call') {
      const text = await call(params.name, params.arguments || {});
      send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text }] } });
    } else if (method === 'ping') {
      send({ jsonrpc: '2.0', id, result: {} });
    } else if (id !== undefined) {
      send({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found: ' + method } });
    }
  } catch (e) {
    if (id !== undefined) send({ jsonrpc: '2.0', id, error: { code: -32000, message: String(e.message || e) } });
  }
}
