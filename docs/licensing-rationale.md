# Why NTLSN is licensed in tiers

*Decision record, 17 July 2026. Resolves the tension flagged in the TASKS.md §5.1
audit: the hero badge says OPEN-SOURCE while the repo carried a single blanket
CC BY-NC-SA licence — and the code carried no licence at all.*

## The problem with the old arrangement

Before this change the repository had one licence file: CC BY-NC-SA 4.0 over
"content". That left three real defects:

1. **The code had no licence.** Unlicensed code is all-rights-reserved by
   default — nobody could legally fork, adapt or redeploy the very scripts a
   site badged OPEN-SOURCE invites them to. The badge was unsupported where it
   was most checkable.
2. **The data was NonCommercial.** NTLSN publishes a CORS-open JSON API and
   feeds and positions the sector's event layer as public infrastructure
   ("the sector as a public API"). An NC condition on facts-shaped data
   creates exactly the legal ambiguity that stops a university's commercial
   arm, a TAFE, or an ed-tech integrator from federating with the commons —
   the opposite of the design intent. It also contradicted
   `data/library-resolvers.json`, which already declares CC0.
3. **The First Nations ICIP boundary was unstated.** The project's position is
   that no licence it grants extends to First Nations cultural and
   intellectual property — but the LICENSE file never said so.

## The principle (from the commons design itself)

The governing idea is **governed openness, not exposed openness**: a commons
under a share-alike licence may be used, copied and adapted freely, on the
condition that derivatives remain equally open. Attribution keeps provenance
visible; NonCommercial blocks the most direct resale route; ShareAlike
propagates openness to derivatives.

But that instrument is calibrated for the *written commons* — the layer a
commercial re-encloser would actually resell. Other layers need different
calibration:

- **Standards and methodology must travel further than NC allows.** A
  methodology or crosswalk only becomes a sector standard if anyone —
  including commercial implementers — can adopt, inspect and improve it.
  That layer was already deliberately CC BY 4.0 in the project's public
  methodology; the licence file now matches.
- **Open data under NC is not open data.** The datasets exist to be embedded,
  federated and built on. CC BY 4.0 keeps attribution (provenance is the
  flywheel) and removes the ambiguity.
- **Code is not the commons being protected.** The moat is adoption, trust
  and the registry — never the JavaScript. MIT makes the OPEN-SOURCE claim
  literally true and costs nothing the project actually guards.

## What the licence does not do (stated plainly)

A licence binds downstream reusers: it stops a third party copying the
commons and re-enclosing the copy. It does **not** bind the operator — the
rights-holder can relicense, dual-license, or let the free layer decay while
monetising an adjacent paid one. The anti-capture guarantee therefore lives
in governance (the non-gating covenant, independent audit, and forking-clause
instruments on the project roadmap), not in this file. The licence is a wall
around the copies, not a wall around the founder.

## The resulting tiers

| Layer | Licence | Why |
|---|---|---|
| Code (scripts, functions, tests, widgets, patches) | MIT | Makes OPEN-SOURCE true; code is not the guarded asset |
| Data (`data/*.json`, feeds) | CC BY 4.0 | Open data with provenance; NC removed (resolver table stays CC0 as declared) |
| Methodology & standards | CC BY 4.0 | Standards must be adoptable by anyone to become standards |
| Content (prose, courses, guides) | CC BY-NC-SA 4.0 | The governed commons — unchanged |
| First Nations ICIP | **No licence granted** | NTLSN does not hold the authority to license collectively held knowledge; authority rests with First Nations peoples |
