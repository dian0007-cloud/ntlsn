import { useState } from "react";
import { universities, type University } from "../data";
import {
  MAINLAND_PATH,
  MAP_VIEWBOX,
  PULSE_CLUSTERS,
  projectToMap,
  TASMANIA_PATH,
} from "../lib/australia";
import { GROUP_ORDER, groupMeta } from "../lib/institutions";
import InstitutionModal from "./InstitutionModal";
import UncededCaption from "./UncededCaption";

/**
 * #map — the national connection map (TASKS.md 1.2, fourth ported section).
 *
 * The SVG is production's: same viewBox (0 0 900 750), same mainland +
 * lutruwita (Tasmania) coastline paths, same water-ripple pattern clipped to
 * the landmass, same pulse-ring clusters, and the exact lat/lng → x/y
 * projection recovered from the bundle (see lib/australia.ts) — so all 43
 * dots land where production plots them, in production's network-group
 * colours. Header copy, network filter pills, the Traditional Country
 * toggle, legend and the AIATSIS attribution block are ported verbatim.
 *
 * Traditional Country layer: production hand-curates ~24 label placements
 * with leader lines; the rebuild generates labels from the canonical
 * traditionalCountry data (deduplicated where institutions share Country,
 * edge-clamped) — same visual language, driven by data/universities.json.
 *
 * A11y (new code must not rely on the patch scripts): every dot is a
 * keyboard-focusable SVG button named "<university> — <city, state>. Located
 * on <country> Country." that opens the institution dialog; an enlarged
 * transparent hit-circle sits over each visible dot so targets aren't
 * 5.5px; the #directory section is the parallel accessible list of the same
 * 43 institutions. Decorative layers are aria-hidden.
 */
export default function MapSection() {
  const [networkFilter, setNetworkFilter] = useState("All");
  const [showCountry, setShowCountry] = useState(true);
  const [selected, setSelected] = useState<University | null>(null);

  const visible = universities.filter(
    (u) => networkFilter === "All" || u.group === networkFilter,
  );

  // One Country label per unique traditionalCountry among visible dots
  // (shared-metro Country is labelled once, matching production's dedupe).
  // Labels whose anchors crowd a metro cluster are staggered downwards so
  // every attribution stays legible — Acknowledgement data is never dropped.
  const labelled = new Set<string>();
  const anchors: Array<{ x: number; y: number }> = [];
  const countryLabels = showCountry
    ? visible.flatMap((u) => {
        if (labelled.has(u.traditionalCountry)) return [];
        labelled.add(u.traditionalCountry);
        const { x, y } = projectToMap(u.lat, u.lng);
        const crowd = anchors.filter(
          (a) => Math.abs(a.x - x) < 60 && Math.abs(a.y - y) < 14,
        ).length;
        anchors.push({ x, y });
        return [{ uni: u, x, y: y + crowd * 10 }];
      })
    : [];

  return (
    <section
      id="map"
      aria-labelledby="map-heading"
      className="relative scroll-mt-20 px-4 py-24"
    >
      <div id="reveal-map" className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#C9A962] uppercase">
            Volume I
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            Interactive Map
          </p>
          <h2 id="map-heading" className="mb-4 text-3xl font-bold md:text-4xl">
            40+ Universities. 250+ First Nations Countries.{" "}
            <span className="text-teal">A Connected Tertiary Sector.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-white/50">
            Every university here stands on unceded Aboriginal and Torres
            Strait Islander Country. One map to see, share, and connect
            teaching and learning across the sector — click any dot to
            explore.
          </p>
          <p className="mt-3 text-xs text-[#C9A962]/60 italic">
            National Reconciliation Week 2026 — All In
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter by university network"
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          <button
            type="button"
            aria-pressed={networkFilter === "All"}
            onClick={() => setNetworkFilter("All")}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              networkFilter === "All"
                ? "border-white/20 bg-white/10 text-white"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            All Networks
          </button>
          {GROUP_ORDER.map((group) => {
            const meta = groupMeta(group);
            const active = networkFilter === group;
            return (
              <button
                key={group}
                type="button"
                aria-pressed={active}
                onClick={() => setNetworkFilter(group)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                {meta.label}
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
              </button>
            );
          })}
        </div>

        <div className="mb-6 flex justify-center">
          <button
            type="button"
            aria-pressed={showCountry}
            onClick={() => setShowCountry((v) => !v)}
            className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
              showCountry
                ? "border-[#C9A962]/40 bg-[#C9A962]/20 text-[#C9A962] shadow-lg shadow-[#C9A962]/10"
                : "border-white/10 bg-white/5 text-white/50 hover:text-white/70"
            }`}
          >
            <span className="text-base" aria-hidden="true">
              🌊
            </span>
            {showCountry
              ? "Showing Traditional Country"
              : "Show Traditional Country"}
          </button>
        </div>

        <div className="relative overflow-hidden">
          <svg
            viewBox={MAP_VIEWBOX}
            className="h-auto w-full"
            aria-label={`Map of Australia — ${visible.length} universities plotted by campus location`}
          >
            <defs>
              <pattern
                id="water-ripples"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="4" fill="none" stroke="#4ECDC4" strokeWidth="0.3" strokeOpacity="0.06" />
                <circle cx="30" cy="30" r="10" fill="none" stroke="#4ECDC4" strokeWidth="0.2" strokeOpacity="0.04" />
                <circle cx="30" cy="30" r="18" fill="none" stroke="#C9A962" strokeWidth="0.2" strokeOpacity="0.03" />
                <circle cx="30" cy="30" r="26" fill="none" stroke="#4ECDC4" strokeWidth="0.15" strokeOpacity="0.02" />
              </pattern>
              <clipPath id="land-clip">
                <path d={MAINLAND_PATH} />
                <path d={TASMANIA_PATH} />
              </clipPath>
              <radialGradient id="country-warm" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C9A962" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#C9A962" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Landmass — production's exact coastline */}
            <path
              d={MAINLAND_PATH}
              fill="#0f1d32"
              stroke="#4ECDC4"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
            <path
              d={TASMANIA_PATH}
              fill="#0f1d32"
              stroke="#4ECDC4"
              strokeWidth="1"
              strokeOpacity="0.3"
            />

            {/* Decorative water ripples + pulse rings, clipped to land */}
            <g clipPath="url(#land-clip)" opacity="0.8" aria-hidden="true">
              <rect x="0" y="0" width="900" height="750" fill="url(#water-ripples)" />
              {PULSE_CLUSTERS.map(([cx, cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="30" fill="none" stroke="#C9A962" strokeWidth="0.4" strokeOpacity="0.08" className="map-pulse" style={{ animationDuration: "6s", animationDelay: `${i * 0.8}s` }} />
                  <circle cx={cx} cy={cy} r="50" fill="none" stroke="#4ECDC4" strokeWidth="0.3" strokeOpacity="0.05" className="map-pulse" style={{ animationDuration: "8s", animationDelay: `${i * 0.8 + 1}s` }} />
                  <circle cx={cx} cy={cy} r="75" fill="none" stroke="#C9A962" strokeWidth="0.2" strokeOpacity="0.03" className="map-pulse" style={{ animationDuration: "10s", animationDelay: `${i * 0.8 + 2}s` }} />
                </g>
              ))}
            </g>

            {/* Traditional Country layer — warm glow per dot, one label per
                unique Country. Decorative here: every dot's accessible name
                below carries the same Country attribution. */}
            {showCountry && (
              <g aria-hidden="true" pointerEvents="none" opacity="0.9">
                {visible.map((u) => {
                  const { x, y } = projectToMap(u.lat, u.lng);
                  return (
                    <circle
                      key={u.id}
                      cx={x}
                      cy={y}
                      r="18"
                      fill="url(#country-warm)"
                    />
                  );
                })}
                {countryLabels.map(({ uni: u, x, y }) => {
                  const flip = x > 660;
                  const lx = flip ? x - 9 : x + 9;
                  const anchor = flip ? "end" : "start";
                  return (
                    <g key={`label-${u.id}`}>
                      <text
                        x={lx}
                        y={y - 2}
                        textAnchor={anchor}
                        fill="#C9A962"
                        style={{
                          fontSize: 7,
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          opacity: 0.9,
                        }}
                      >
                        {u.traditionalCountry}
                      </text>
                      <text
                        x={lx}
                        y={y + 6}
                        textAnchor={anchor}
                        fill="#C9A962"
                        style={{
                          fontSize: 3.5,
                          fontWeight: 400,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          opacity: 0.4,
                        }}
                      >
                        Unceded Land
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* University dots — plotted from canonical lat/lng */}
            {visible.map((u) => {
              const { x, y } = projectToMap(u.lat, u.lng);
              const color = groupMeta(u.group).color;
              return (
                <g key={u.id}>
                  <circle aria-hidden="true" cx={x} cy={y} r="12" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.1" className="map-pulse" style={{ animationDuration: "3s" }} />
                  <circle aria-hidden="true" cx={x} cy={y} r="8" fill="none" stroke={color} strokeWidth="0.3" strokeOpacity="0.08" className="map-pulse" style={{ animationDuration: "4s", animationDelay: "1s" }} />
                  <circle aria-hidden="true" cx={x} cy={y} r="5.5" fill={color} fillOpacity="0.85" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
                  {/* Enlarged transparent hit/focus target over the dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r="11"
                    fill="transparent"
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-label={`${u.name} — ${u.city}, ${u.state}. Located on ${u.traditionalCountry} Country.`}
                    className="cursor-pointer"
                    onClick={() => setSelected(u)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(u);
                      }
                    }}
                  >
                    <title>{u.name}</title>
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>

        <ul className="mt-6 flex list-none flex-wrap justify-center gap-4">
          {GROUP_ORDER.map((group) => {
            const meta = groupMeta(group);
            return (
              <li
                key={group}
                className="flex items-center gap-2 text-sm text-white/50"
              >
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                {meta.label}
              </li>
            );
          })}
        </ul>

        <div className="mx-auto mt-10 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A962]/10 bg-[#C9A962]/5 px-4 py-2">
            <span className="text-sm" aria-hidden="true">
              🌊
            </span>
            <p className="text-[11px] text-[#C9A962]/60">
              Traditional Country data sourced from university
              Acknowledgements of Country. Map inspired by the{" "}
              <a
                href="https://aiatsis.gov.au/explore/map-indigenous-australia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A962]/80 underline underline-offset-2 transition-colors hover:text-[#C9A962]"
              >
                AIATSIS Map of Indigenous Australia
              </a>{" "}
              and the NRW 2026 <em>Gaagal</em> artwork by Otis Hope Carey.
            </p>
          </div>
          <p className="mt-3 text-[10px] text-white/20">
            Aboriginal and Torres Strait Islander peoples should be aware that
            this website may contain names and images of deceased persons.
          </p>
          <p className="mt-2 text-[10px] text-[#C9A962]/40">
            Traditional Country attributions reflect each university’s own
            published Acknowledgement of Country. If an attribution requires
            correction, please{" "}
            <a
              href="mailto:dian0007@gmail.com?subject=NTLSN%20Country%20Attribution%20Correction"
              className="underline underline-offset-2 transition-colors hover:text-[#C9A962]/70"
            >
              contact us
            </a>
            .
          </p>
        </div>

        <UncededCaption />
      </div>
      {selected && (
        <InstitutionModal uni={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
