import { useState } from "react";
import {
  GROW_ENTRIES,
  GROW_FILTERS,
  GROW_TYPE_LABELS,
  type GrowType,
} from "../lib/waysToGrow";

/**
 * #ntlsn-waystogrow — "Not just PD. Ways to grow." (Epic 1.2 PR-D), ported
 * from the ntlsn-waystogrow-script patch: a filterable open directory of
 * communities of practice, fellowships, programs and toolkits. The
 * non-affiliation disclaimer and the "Recognition · in design · 2027"
 * strip are verbatim. Filter chips announce the result count via a polite
 * live region (the patch's #grow-count line).
 */
export default function WaysToGrowSection() {
  const [filter, setFilter] = useState("all");
  const visible = GROW_ENTRIES.filter(
    ([type]) => filter === "all" || type === filter,
  );

  return (
    <section
      id="ntlsn-waystogrow"
      aria-labelledby="ntlsn-waystogrow-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto max-w-[1040px]">
        <div className="mx-auto mb-[22px] max-w-[740px] text-center">
          <p className="mb-3 text-[11px] font-extrabold tracking-[2px] text-[#8fb081] uppercase">
            Grow · Connect · Lead
          </p>
          <h2
            id="ntlsn-waystogrow-heading"
            className="mb-3 text-[clamp(25px,3.4vw,38px)] leading-[1.15] font-extrabold text-white"
          >
            Not just PD. Ways to grow.
          </h2>
          <p className="text-[clamp(14.5px,1.7vw,17px)] leading-relaxed text-[#bca98f]">
            Teaching can isolate you — from the pedagogical shifts, from
            colleagues solving the same problem, from the recognition your
            work deserves. Communities of practice, fellowships, mentoring,
            programs, toolkits, courses and webinars, from peak bodies,
            regulators and leading providers, help you stay connected. Tell
            us what you need.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter ways to grow"
          className="mb-3 flex flex-wrap justify-center gap-2"
        >
          {GROW_FILTERS.map(([key, label]) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(key)}
                className={`cursor-pointer rounded-[999px] border px-3.5 py-[7px] text-[12.5px] font-bold transition-colors ${
                  active
                    ? "border-[#8fb081] bg-[#8fb081] text-[#1f1810]"
                    : "border-white/[0.14] bg-white/[0.06] text-[#d9cdb6] hover:border-[#8fb081]/60"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p
          aria-live="polite"
          className="mb-4 text-center text-[12.5px] font-semibold text-[#a0907a]"
        >
          {visible.length}
          {visible.length === 1 ? " way to grow" : " ways to grow"}
          {filter === "all" ? ", and growing." : "."}
        </p>

        <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3.5">
          {visible.map(([type, name, orgKind, desc, url, licence]) => (
            <li key={name} className="flex">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 flex-col rounded-[13px] border border-white/[0.08] bg-[#2a2218] px-[17px] py-4 no-underline transition-[border-color,transform] duration-150 hover:-translate-y-[2px] hover:border-[#8fb081]/50"
              >
                <span className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[9.5px] font-bold tracking-[0.5px] text-[#a0907a] uppercase">
                    {orgKind}
                  </span>
                  <span className="rounded-[999px] bg-[#8fb081]/[0.12] px-2 py-0.5 text-[9px] font-bold tracking-[0.4px] whitespace-nowrap text-[#8fb081] uppercase">
                    {GROW_TYPE_LABELS[type as GrowType]}
                  </span>
                </span>
                <span className="mb-1.5 text-base leading-tight font-extrabold text-white">
                  {name}
                </span>
                <span className="flex-1 text-[13px] leading-normal text-[#bca98f]">
                  {desc}
                </span>
                <span className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#c66c3f]">
                    Visit ↗
                  </span>
                  {licence && (
                    <span className="rounded-[5px] border border-white/[0.12] px-1.5 py-0.5 text-[9.5px] font-semibold text-[#a0907a]">
                      {licence}
                    </span>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-[#8fb081]/[0.22] bg-[#8fb081]/[0.08] px-4 py-3.5">
          <span className="rounded-[999px] border border-amber/40 px-2.5 py-1 text-[10px] font-extrabold tracking-[1.2px] whitespace-nowrap text-amber uppercase">
            Recognition · in design · 2027
          </span>
          <p className="min-w-[240px] flex-1 text-[13.5px] leading-relaxed font-medium text-[#d9cdb6]">
            Complete one,{" "}
            <a
              href="/recognition-points.html"
              className="text-[#8fb081] no-underline hover:underline"
            >
              log it
            </a>
            , and it counts. Your growth, your service and your scholarship
            become recognition points on one portable record.
          </p>
        </div>

        <p className="mx-auto mt-4 max-w-[720px] text-center text-xs leading-relaxed text-[#a0907a]">
          An open, growing directory of independent professional learning
          from across the sector. Links are provided for the community;
          listing here is not affiliation with or endorsement by NTLSN, and
          these organisations do not endorse NTLSN. Open-source tools are
          linked under their own licences.
        </p>
      </div>
    </section>
  );
}
