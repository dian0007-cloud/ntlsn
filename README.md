# NTLSN — National Teaching & Learning Sector Navigator

Australia's **free, open-source** hub mapping the higher education teaching & learning sector — every symposium, workshop, PD opportunity, framework, grant and conference across all 42 universities. One page, one portal.

🔗 **Live:** https://www.ntlsn.com

> **Acknowledgement of Country.** NTLSN is built and used on the unceded lands of First Nations peoples across Australia. We pay respect to Elders past and present, and recognise that teaching and learning have been practised on this continent for tens of thousands of years.

---

## What's in this repo

| Path | What it is |
|---|---|
| `index.html` | The deployable site — a single-file build (compiled React + a set of small, documented patch scripts). |
| `data/events.json` | **Canonical event data**. The source of truth for the calendar feeds. |
| `data/universities.json` | **Canonical institution data** (43 institutions). |
| `scripts/build-feeds.mjs` | Regenerates `events.ics`, `feed.xml`, `sitemap.xml` and the Event JSON-LD from the data files. |
| `events.ics` · `feed.xml` | Subscribable calendar + RSS, generated from the data. |
| `widget.js` | Embeddable "what's on" widget any institution can drop on its own site (see below). |
| `_headers` · `_redirects` | Security/CSP headers + SPA fallback. Applied automatically by the host. |
| `CLAUDE.md` · `TASKS.md` | Architecture notes and the maintenance backlog. |

---

## Open data & feeds (use these freely)

NTLSN is an index, not a walled garden. Everything is CORS-open:

- **Subscribe to the sector calendar:** `https://www.ntlsn.com/events.ics` (works in Google/Apple/Outlook — `webcal://www.ntlsn.com/events.ics`)
- **RSS:** `https://www.ntlsn.com/feed.xml`
- **JSON API:** `https://www.ntlsn.com/data/events.json` and `/data/universities.json`
- **Weekly email digest:** a Monday "what's on this fortnight" email, rendered by `scripts/build-digest.mjs` and sent by `.github/workflows/digest.yml`. To activate sending, create a free [Buttondown](https://buttondown.email) account, add a `BUTTONDOWN_API_KEY` repo secret, and set your Buttondown username in the `ntlsn-digest-card` patch script to show the on-site signup form. Without setup, the Action still runs weekly and uploads the digest HTML as a preview artifact.

### Query NTLSN from your AI assistant (MCP)

NTLSN ships an [MCP server](mcp/README.md) — point Claude Desktop/Claude Code (or any MCP client) at `mcp/ntlsn-mcp.mjs` and ask things like *"what's on in QLD next month?"* or *"whose Country does UniSQ stand on?"* directly from the live data.

### Embed NTLSN on your site

Drop this on any university L&T page to show the sector's next events:

```html
<script src="https://www.ntlsn.com/widget.js" data-limit="5"></script>
```

Add `data-uni="usq"` (any institution `id` from `data/universities.json`) to filter to one institution. The widget renders in a scoped shadow root (no CSS clashes), is ~5KB, and links back to NTLSN.

---

## Contributing an event

The whole point of the open data layer: **anyone can add an event with a small PR.** No build tools required to propose one.

1. Add an entry to [`data/events.json`](data/events.json) following the schema in **[DATA.md](DATA.md)**.
2. Leave `"verified": false` — a maintainer confirms the URL and dates before it goes live.
3. Open a PR. See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full guide.

---

## Deploy

- **Quick:** drag this folder onto your site's **Deploys** tab in Netlify.
- **Continuous:** connect this repo to Netlify/Cloudflare Pages for auto-deploy on push.
- After any data edit, regenerate the feeds: `node scripts/build-feeds.mjs`

---

## Licence

NTLSN is licensed in tiers (see [LICENSE](LICENSE), rationale in [docs/licensing-rationale.md](docs/licensing-rationale.md)):

| Layer | Licence |
|---|---|
| **Code** — scripts, functions, tests, widgets, patch scripts | MIT |
| **Data** — `data/*.json`, feeds, calendar | CC BY 4.0 (resolver table CC0 as declared) |
| **Methodology & standards** — SoTL Index methodology, Recognition GPS crosswalk | CC BY 4.0 |
| **Content** — page prose, crash courses, guides | CC BY-NC-SA 4.0 |
| **First Nations ICIP** | No licence granted — authority rests with First Nations peoples |

External resources linked from NTLSN remain the property of their respective organisations.

## Team

Founder: **A/Prof Dr Seb Dianati** (UniSQ) · Co-Founder: **Dr Kashmira Davé** (UNE)
