# NTLSN data dictionary

NTLSN's calendar feeds (`events.ics`, `feed.xml`), the JSON API and the embed widget are all generated from two canonical files. Treat these as the **source of truth** — edit them, then run `node scripts/build-feeds.mjs`.

---

## `data/events.json`

An array of event objects.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | number | ✅ | Unique. There are 94 events; the highest current id is 99 — use `100` or higher for new entries. |
| `title` | string | ✅ | The event's public name. Australian English. |
| `uni` | string | ✅ | Host institution `id` — **must exist** in `universities.json` (e.g. `usq`, `unimelb`, `curtin`). For sector-wide events with no single host, use the special value `national`. |
| `date` | string | ✅ | Start date, `YYYY-MM-DD`. |
| `endDate` | string | optional | End date, `YYYY-MM-DD`. Omit for single-day events (it defaults to `date`). If present, must be ≥ `date`. |
| `type` | string | ✅ | One of: `conference`, `symposium`, `workshop`, `webinar`, `seminar`, `forum`, `summit`, `masterclass`, `roundtable`, `showcase`, `week`. |
| `desc` | string | ✅ | One or two sentences. What it is, who it's for, the theme. No marketing fluff. |
| `url` | string | optional | The official event/registration page (https). Powers the "Details →" link and "Add to calendar" buttons. |
| `verified` | boolean | ✅ | `true` only after a maintainer has confirmed the URL resolves and the dates match the organiser's page. **New submissions should be `false`.** |

> **Validation:** `node scripts/validate-data.mjs` checks every entry (and runs automatically in CI on each PR, and inside `build-feeds`). It fails on missing required fields, unknown `uni` ids, duplicate ids, bad dates, `endDate < date`, or malformed urls. Machine-readable schemas live in [`schemas/`](schemas/).

### Example

```json
{
  "id": 100,
  "title": "UNE Learning & Teaching Symposium",
  "uni": "une",
  "date": "2026-07-21",
  "endDate": "2026-07-21",
  "type": "symposium",
  "desc": "UNE's annual cross-disciplinary L&T symposium — practice-sharing across the institution, open to the sector.",
  "url": "https://www.une.edu.au/example-symposium",
  "verified": false
}
```

---

## `data/universities.json`

An array of institution objects.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Short lowercase id (e.g. `usq`, `anu`, `unimelb`). Used to join events → institutions and by the embed widget's `data-uni`. |
| `name` | string | Full official name. |
| `abbr` | string | Common abbreviation (e.g. `ANU`, `UniSQ`). |
| `city` | string | Primary campus city. |
| `state` | string | `NSW` `VIC` `QLD` `WA` `SA` `TAS` `ACT` `NT`. |
| `lat` / `lng` | number | Decimal coordinates for the map. |
| `group` | string | `Go8`, `ATN`, `IRU`, `RUN`, or `Unaligned`. |
| `tlUrl` | string | The institution's teaching & learning / academic-development unit page. |
| `traditionalCountry` | string | The Traditional Country/Countries of the campus. **Not decorative — never strip, abbreviate or reorder for layout.** |

---

## Validation checklist (before opening a PR)

- [ ] `id` is unique and is the next integer up.
- [ ] `uni` matches an existing institution `id` (or is `national`).
- [ ] `date` is `YYYY-MM-DD`; if `endDate` is present it is ≥ `date`.
- [ ] `type` is from the allowed list.
- [ ] `url`, if present, is a working `https://` link to the official page.
- [ ] `verified` is `false` (a maintainer flips it to `true`).
- [ ] `node scripts/validate-data.mjs` passes (CI runs this on your PR anyway).
