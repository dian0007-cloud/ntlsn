# NTLSN MCP server

Make the National Teaching & Learning Sector Navigator queryable from **any MCP-capable AI assistant** (Claude Desktop, Claude Code, and others). Ask your assistant things like:

> *"What teaching & learning events are on in QLD next month?"*
> *"Whose Country does UniSQ stand on?"*
> *"List the RUN universities and their L&T units."*

…and it answers from NTLSN's live, verified sector data.

**Zero dependencies** — one file, Node 18+. It reads the CORS-open JSON API at `www.ntlsn.com/data/` and falls back to this repo's local `data/` files when offline.

## Tools

| Tool | What it does |
|---|---|
| `search_events` | Search sector events by keyword, state, type, or date range |
| `upcoming_events` | Events starting in the next N days |
| `list_universities` | The 43 institutions, filterable by state or group (Go8/ATN/IRU/RUN/Unaligned), with L&T unit links |
| `whose_country` | The Traditional Country acknowledged for a campus |

## Install

### Claude Code
```bash
claude mcp add ntlsn -- node /path/to/ntlsn/mcp/ntlsn-mcp.mjs
```

### Claude Desktop
Add to `claude_desktop_config.json` (Settings → Developer → Edit Config):
```json
{
  "mcpServers": {
    "ntlsn": {
      "command": "node",
      "args": ["/path/to/ntlsn/mcp/ntlsn-mcp.mjs"]
    }
  }
}
```

### Local development
```bash
NTLSN_ORIGIN=http://localhost:8899 node mcp/ntlsn-mcp.mjs
```

## Notes
- Data is cached in-memory per session; restart the server to refresh.
- Country data is factual campus-acknowledgement information from `data/universities.json`; institutions with their own approved protocols should follow those.
