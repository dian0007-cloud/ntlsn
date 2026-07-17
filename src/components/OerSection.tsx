import { useState } from "react";
import {
  OER_BROWSE,
  OER_DIRECTORY,
  OER_TOPICS,
  openOerSearch,
} from "../lib/oer";

/**
 * #ntlsn-oer — "Search the world's open library of teaching resources"
 * (Epic 1.2 PR-C), ported from the ntlsn-oer-script patch. The search box
 * and every topic chip keep the patch's LINK-OUT behaviour: they open an
 * OER Commons search on oercommons.org in a new tab — nothing is indexed or
 * searched on-site (the buttons say so to screen readers). The four
 * "Browse the commons" cards and the six-category curated directory
 * (<details> folds with per-category source counts derived from the data)
 * are the patch's exact content.
 */
export default function OerSection() {
  const [query, setQuery] = useState("");

  return (
    <section
      id="ntlsn-oer"
      aria-labelledby="ntlsn-oer-heading"
      className="relative scroll-mt-20 px-4 py-[60px]"
    >
      <div className="mx-auto max-w-[880px]">
        <div className="mx-auto mb-6 max-w-[720px] text-center">
          <p className="mb-[11px] text-[11px] font-extrabold tracking-[1.6px] text-teal uppercase">
            Open Educational Resources
          </p>
          <h2
            id="ntlsn-oer-heading"
            className="mb-3 text-[clamp(26px,3.5vw,40px)] leading-[1.14] font-extrabold text-white"
          >
            Search the world&rsquo;s open library of teaching resources.
          </h2>
          <p className="text-[clamp(14.5px,1.7vw,17px)] leading-relaxed text-[#AEBFCE]">
            OER Commons is the open commons of teaching &amp; learning
            materials —{" "}
            <b className="text-[#CFE9E5]">50,000+ openly-licensed resources</b>{" "}
            you can use, adapt and share. Search it from here, or browse by
            collection, provider or hub.
          </p>
        </div>

        <form
          className="mx-auto mb-3.5 flex max-w-[580px] gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            openOerSearch(query);
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search OER Commons — e.g. rubric, UDL, statistics…"
            aria-label="Search OER Commons (opens results on oercommons.org)"
            className="flex-1 rounded-[10px] border border-white/[0.18] bg-navy px-3.5 py-3 text-[15px] font-medium text-white outline-none placeholder:text-white/30 focus:border-teal/50"
          />
          <button
            type="submit"
            className="flex-none cursor-pointer rounded-[10px] bg-teal px-5 text-sm font-extrabold text-[#06243A]"
          >
            Search →
          </button>
        </form>

        <div
          role="group"
          aria-label="Search OER Commons by topic (opens on oercommons.org)"
          className="mb-[26px] flex flex-wrap justify-center gap-[7px]"
        >
          {OER_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => openOerSearch(topic)}
              aria-label={`Search OER Commons for ${topic} (opens in a new tab)`}
              className="cursor-pointer rounded-full border border-white/[0.13] bg-white/5 px-[13px] py-1.5 text-xs font-semibold text-[#CBD8E6] transition-all hover:border-teal/50 hover:text-white"
            >
              {topic}
            </button>
          ))}
        </div>

        <p className="mb-[11px] text-center text-[10.5px] font-bold tracking-[0.6px] text-[#8AA0B6] uppercase">
          Browse the commons
        </p>
        <ul className="grid list-none grid-cols-1 gap-[11px] sm:grid-cols-2 lg:grid-cols-4">
          {OER_BROWSE.map((card) => (
            <li key={card.name}>
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-white/[0.08] bg-[#0f1f3a] p-4 no-underline"
                style={{ borderLeft: `3px solid ${card.colour}` }}
              >
                <span className="mb-1 block text-[14.5px] font-extrabold text-white">
                  {card.name}{" "}
                  <span
                    aria-hidden="true"
                    className="text-[11px] font-bold"
                    style={{ color: card.colour }}
                  >
                    ↗
                  </span>
                </span>
                <span className="block text-[12.5px] leading-normal text-[#9FB3C8]">
                  {card.desc}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-[18px] max-w-[680px] text-center text-xs leading-normal text-[#8AA0B6]">
          OER Commons is an independent open library run by the nonprofit
          ISKME. NTLSN links you straight to it — every result is free and
          openly licensed. Searches and links open on oercommons.org.
        </p>

        <div className="mx-auto mt-9">
          <div className="mx-auto mb-[22px] max-w-[680px] text-center">
            <p className="mb-2 text-[10.5px] font-bold tracking-[0.7px] text-[#8AA0B6] uppercase">
              A curated open directory
            </p>
            <h3 className="mb-2 text-[clamp(20px,2.6vw,28px)] leading-tight font-extrabold text-white">
              Find, reuse and adapt — by resource type.
            </h3>
            <p className="text-[13.5px] leading-relaxed text-[#AEBFCE]">
              Openly-licensed sources across six categories. Each opens the
              original — always check the licence on the resource before you
              reuse it.
            </p>
          </div>
          <div className="grid items-start gap-[13px] sm:grid-cols-2 lg:grid-cols-3">
            {OER_DIRECTORY.map((category) => (
              <details
                key={category.name}
                className="rounded-[13px] border border-white/[0.06] bg-[#0f1f3a] px-[18px] py-3.5"
                style={{ borderLeft: `3px solid ${category.colour}` }}
              >
                <summary
                  className="cursor-pointer text-[13px] font-extrabold"
                  style={{ color: category.colour }}
                >
                  {category.name}{" "}
                  <span className="text-[11px] font-normal text-[#8AA0B6]">
                    ({category.items.length} sources)
                  </span>
                </summary>
                <ul className="mt-3 list-none">
                  {category.items.map((item) => (
                    <li key={item.name} className="mb-2.5">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] font-bold text-[#CFE9E5] no-underline hover:underline"
                      >
                        {item.name}
                      </a>
                      <span
                        className="ml-[7px] rounded-[5px] px-1.5 py-px text-[9px] font-semibold whitespace-nowrap text-[#06243A]"
                        style={{ background: category.colour }}
                      >
                        {item.licence}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] leading-normal text-[#8AA0B6]">
                        {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
