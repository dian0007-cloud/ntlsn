import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { universities } from "../data";
import {
  ASSOC_PACKAGES,
  OEP_CHIP_GROUPS,
  PRICING_BENEFITS,
  PRICING_ROLE_EVENT,
  PRICING_ROLES,
  PRICING_TIERS,
  SYMP_PACKAGES,
  SYMP_STEPS,
  type PricingRole,
  type PricingTier,
} from "../lib/pricing";
import PortalModal, { type PortalTalk } from "./PortalModal";

/**
 * #pricing — the open-core model section (Epic 1.2 PR-E), ported from
 * ntlsn-pricing-script — production's largest patch (39KB, ~400 elements).
 * Front-of-house copy is word-for-word: the free-forever guarantee is the
 * section's whole point (CLAUDE.md credibility claims). Counts derive from
 * the data layer (lib/pricing.ts) instead of the patch's hardcoded figures.
 *
 * Pieces: header + benefits · role router ("Where would you like to
 * start?") · the $0-forever OEP card · Universities / Symposiums /
 * Associations tabs (tier cards, founding offers, on-campus day, symposium
 * packages + university picker + Portal concept modal, association
 * packages) · footing note.
 *
 * Folded satellites: ntlsn-pricelinks-script (smooth in-page scrolling for
 * #pricing anchors) is subsumed by the global scroll-behavior/scroll-padding
 * CSS; #ntlsn-choosepackage's role hand-off arrives via the
 * PRICING_ROLE_EVENT CustomEvent (production clicked our chips by DOM
 * query).
 *
 * NOT ported here (deliberately): ntlsn-pricing-script's injectNav() — the
 * fixed "◆ Open the Portal" launcher and the extra top-nav buttons are nav
 * chrome, owned by the PR-F cross-cutting nav/megamenu pass, not by this
 * section.
 */

type TabId = "pt-uni" | "pt-symp" | "pt-assoc";

const TABS: ReadonlyArray<{ id: TabId; label: string }> = [
  { id: "pt-uni", label: "Universities" },
  { id: "pt-symp", label: "Symposiums" },
  { id: "pt-assoc", label: "Associations" },
];

function StatusBadge({ inDesign }: { inDesign: boolean }) {
  return inDesign ? (
    <span className="ml-1.5 rounded-full border border-amber/45 px-1.5 py-px text-[9px] font-bold tracking-[0.5px] text-amber">
      IN DESIGN
    </span>
  ) : (
    <span className="ml-1.5 rounded-full border border-teal/45 px-1.5 py-px text-[9px] font-bold tracking-[0.5px] text-teal">
      LIVE
    </span>
  );
}

function TierCard({ tier, pulsed }: { tier: PricingTier; pulsed: boolean }) {
  return (
    <div
      className="rounded-[14px] border border-white/[0.08] bg-[#0f1f38] p-5 transition-shadow duration-300"
      style={{
        borderTop: `3px solid ${tier.colour}`,
        boxShadow: pulsed
          ? "0 0 0 2px #4ECDC4, 0 18px 40px -12px rgba(78,205,196,0.45)"
          : undefined,
      }}
    >
      <h4 className="text-[19px] font-extrabold text-white">{tier.name}</h4>
      <p className="mb-2 text-[13px] text-[#8AA0B6]">{tier.blurb}</p>
      <p
        className="mb-2.5 inline-block rounded-full px-[9px] py-[3px] text-[11px] font-bold tracking-[0.5px]"
        style={{
          color: tier.colour,
          background: `${tier.colour}1a`,
          border: `1px solid ${tier.colour}55`,
        }}
      >
        ◆ {tier.multiplier}
      </p>
      <p className="text-[28px] font-extrabold" style={{ color: tier.colour }}>
        {tier.price}
        <span className="text-sm font-normal text-[#8AA0B6]"> /yr</span>
      </p>
      <p className="mt-1 text-[12.5px] font-bold text-[#9FB3C8]">
        or <b className="text-white">3 years for the price of 2</b>{" "}
        <span className="text-teal">
          · save ${tier.priceK}k — third year free
        </span>
      </p>
      <p className="mt-1.5 mb-3 text-[10px] font-bold tracking-[1px] text-[#8AA0B6] uppercase">
        Founding · 2026–27 pilot
      </p>
      <ul className="flex list-none flex-col gap-2">
        {tier.features.map((feature) => {
          if (feature.meta || !feature.href) {
            return (
              <li
                key={feature.title}
                className="py-px pl-2.5"
                style={{ borderLeft: `2px solid ${tier.colour}` }}
              >
                <span className="text-sm font-bold text-[#E8F0F7]">
                  {feature.title}
                </span>
                <p className="mt-px text-xs leading-[1.45] text-[#8499AD]">
                  {feature.desc}
                </p>
              </li>
            );
          }
          const external = !feature.href.startsWith("#");
          const inDesign =
            Boolean(feature.inDesign) ||
            feature.href.startsWith("#ntlsn-coming");
          return (
            <li key={feature.title}>
              <a
                href={feature.href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="block rounded-r-md py-0.5 pl-2.5 no-underline"
                style={{ borderLeft: `2px solid ${tier.colour}` }}
              >
                <span className="text-sm font-bold text-[#E8F0F7]">
                  {feature.title}
                </span>
                <StatusBadge inDesign={inDesign} />{" "}
                <span
                  aria-hidden="true"
                  className="font-extrabold"
                  style={{ color: tier.colour }}
                >
                  →
                </span>
                <p className="mt-px text-xs leading-[1.45] text-[#8499AD]">
                  {feature.desc}
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState<TabId>("pt-uni");
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [pulsedTier, setPulsedTier] = useState<string | null>(null);
  const [selectedUni, setSelectedUni] = useState("");
  const [ctaVisible, setCtaVisible] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [talks, setTalks] = useState<readonly PortalTalk[]>([]);
  const oepRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<TabId, HTMLButtonElement>());
  const pulseTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const sortedUnis = useMemo(
    () =>
      [...universities].sort((a, b) =>
        (a.name || "").localeCompare(b.name || ""),
      ),
    [],
  );
  const selected = sortedUnis.find((u) => u.name === selectedUni);
  const who = selectedUni || "your university";

  function applyRole(role: PricingRole) {
    setActiveRole(role.id);
    if (role.tab) {
      setActiveTab(role.tab);
      if (role.tier) {
        clearTimeout(pulseTimer.current);
        setPulsedTier(role.tier);
        pulseTimer.current = setTimeout(() => setPulsedTier(null), 2400);
      }
    } else {
      oepRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // #ntlsn-choosepackage hand-off: its cards anchor to #pricing and dispatch
  // the role label (production clicked the matching .pt-role chip instead).
  useEffect(() => {
    const onRole = (e: Event) => {
      const label = (e as CustomEvent<string>).detail;
      const role = PRICING_ROLES.find((r) => r.label.includes(label));
      if (role) applyRole(role);
    };
    window.addEventListener(PRICING_ROLE_EVENT, onRole);
    return () => window.removeEventListener(PRICING_ROLE_EVENT, onRole);
  }, []);

  function onTablistKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const ids = TABS.map((t) => t.id);
    const idx = ids.indexOf(activeTab);
    let next: TabId | undefined;
    if (e.key === "ArrowRight") next = ids[(idx + 1) % ids.length];
    else if (e.key === "ArrowLeft")
      next = ids[(idx - 1 + ids.length) % ids.length];
    else if (e.key === "Home") next = ids[0];
    else if (e.key === "End") next = ids[ids.length - 1];
    if (next) {
      e.preventDefault();
      setActiveTab(next);
      tabRefs.current.get(next)?.focus();
    }
  }

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative mx-auto max-w-[1140px] scroll-mt-20 px-6 py-16"
    >
      {/* Header */}
      <p className="mb-2.5 text-center text-[13px] font-bold tracking-[2px] text-teal uppercase">
        ◎ For schools &amp; institutions
      </p>
      <h2
        id="pricing-heading"
        className="mb-3 text-center text-[clamp(28px,4vw,44px)] leading-[1.1] font-extrabold text-white"
      >
        NTLSN is free for every educator, forever. Institutions can go
        further.
      </h2>
      <p className="mx-auto mb-[30px] max-w-[740px] text-center text-[17px] leading-relaxed text-[#9FB3C8]">
        The whole navigator — every event, the map, 2,000+ resources, the
        sector archive — is{" "}
        <b className="text-[#CFE9E5]">free, forever, no login</b>, as Open
        Educational Practice. No individual educator will ever be asked to
        pay — that guarantee is the point. Schools, institutions and
        associations partner with NTLSN to <i>run their own</i>: embedded
        practice support for schools, assurance and sector visibility for
        institutions. An open API/MCP is there for anyone who wants to build
        on it — second to the commons, never the price of entry.
      </p>
      <ul className="mx-auto mb-[30px] grid max-w-[1000px] list-none grid-cols-1 gap-x-6 gap-y-[13px] sm:grid-cols-2 lg:grid-cols-3">
        {PRICING_BENEFITS.map(([head, body]) => (
          <li key={head} className="flex items-start gap-[9px]">
            <span aria-hidden="true" className="leading-[1.4] font-extrabold text-teal">
              ◆
            </span>
            <div>
              <p className="text-sm font-bold text-[#E8F0F7]">{head}</p>
              <p className="text-[12.5px] leading-[1.45] text-[#8499AD]">
                {body}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Role router */}
      <div className="mb-[30px] text-center">
        <p className="mb-2 text-xs font-bold tracking-[2px] text-[#8FA7FF] uppercase">
          ◎ Where would you like to start?
        </p>
        <p className="mb-4 text-[15px] text-[#9FB3C8]">
          Tell us who you are — we&rsquo;ll take you to the right place.
          Everything stays free unless you run your own.
        </p>
        <div className="mx-auto flex max-w-[780px] flex-wrap justify-center gap-2">
          {PRICING_ROLES.map((role) => {
            const on = activeRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                aria-pressed={on}
                onClick={() => applyRole(role)}
                className={`cursor-pointer rounded-full border px-[19px] py-[11px] text-[15px] font-bold transition-all duration-200 ${
                  on
                    ? "border-teal bg-teal/[0.14] text-white"
                    : "border-white/15 bg-white/[0.03] text-[#CBD8E6] hover:border-white/30"
                }`}
              >
                <span aria-hidden="true">{role.icon}</span> {role.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* $0 forever — OEP */}
      <div
        ref={oepRef}
        id="pt-oep"
        className="mb-[34px] rounded-[18px] border border-teal/[0.32] px-7 py-[34px] text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(78,205,196,0.12), rgba(124,156,255,0.05))",
        }}
      >
        <p className="mb-2.5 text-xs font-bold tracking-[2px] text-teal uppercase">
          ♡ OEP · Open Educational Practices · free, open, forever
        </p>
        <p className="mb-1.5 text-[clamp(36px,7vw,56px)] leading-none font-extrabold text-white">
          $0{" "}
          <span className="text-[0.4em] font-semibold text-[#9FB3C8]">
            forever
          </span>
        </p>
        <p className="mb-[18px] text-[17px] font-semibold text-[#CFE9E5]">
          Everything on this site — for everyone, no account. Open by
          default, CC&nbsp;BY-NC-SA.
        </p>
        <div className="mx-auto mb-[18px] max-w-[1080px]">
          {OEP_CHIP_GROUPS.map((group) => (
            <div key={group.title} className="mb-[18px]">
              <p className="mb-2.5 text-center text-[11px] font-extrabold tracking-[1.4px] text-teal uppercase">
                {group.title}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-[15px] py-2 text-[15px] font-bold text-[#CBD8E6]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm font-semibold text-[#8AA0B6]">
          No paywall. No login. The commons stays free — always.{" "}
          <a href="#ntlsn-why" className="text-teal no-underline">
            Why OEP →
          </a>
        </p>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Packages for universities, symposiums and associations"
        onKeyDown={onTablistKeyDown}
        className="mb-6 flex flex-wrap justify-center gap-2"
      >
        {TABS.map((tab) => {
          const on = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
                else tabRefs.current.delete(tab.id);
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={on}
              aria-controls={tab.id}
              tabIndex={on ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer rounded-full border px-[22px] py-2.5 text-[15px] font-bold transition-all duration-200 ${
                on
                  ? "border-teal bg-teal/[0.16] text-white"
                  : "border-white/15 bg-transparent text-[#9FB3C8] hover:border-white/30"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Universities panel ── */}
      <div
        id="pt-uni"
        role="tabpanel"
        aria-labelledby="tab-pt-uni"
        hidden={activeTab !== "pt-uni"}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {PRICING_TIERS.map((tier) => (
            <TierCard
              key={tier.name}
              tier={tier}
              pulsed={pulsedTier === tier.name}
            />
          ))}
        </div>
        <div className="mt-[18px] mb-1 flex flex-wrap gap-3.5">
          <div className="min-w-[240px] flex-1 rounded-[14px] border border-[#FF8A6B]/30 bg-[#0f1f38] p-[18px]">
            <p className="text-xl font-extrabold text-[#FF8A6B]">50% off</p>
            <p className="mt-0.5 mb-1 text-[15px] font-bold text-white">
              First 10 universities
            </p>
            <p className="text-[13px] leading-normal text-[#9FB3C8]">
              Held for the life of membership ·{" "}
              <b className="text-[#CBD8E6]">representative by design</b>:
              capped at three per network (Go8 · ATN · IRU · RUN), every state
              and territory represented, and no single faculty, role or group
              exceeding half the cohort.
            </p>
          </div>
          <div className="min-w-[240px] flex-1 rounded-[14px] border border-[#C9A962]/[0.28] bg-[#0f1f38] p-[18px]">
            <p className="text-xl font-extrabold text-[#C9A962]">Save 33%</p>
            <p className="mt-0.5 mb-1 text-[15px] font-bold text-white">
              3-year contract
            </p>
            <p className="text-[13px] leading-normal text-[#9FB3C8]">
              Equivalent to your third year at no charge, on a three-year
              agreement (standard pricing). Founding-cohort members retain
              their 50% rate; the offers are not combined.
            </p>
          </div>
        </div>
        <p className="mx-auto mt-3 max-w-[790px] text-center text-[13px] leading-[1.7] text-[#8AA0B6]">
          Every paid tier also includes: white-label styling · an analytics
          dashboard · priority support · early access to new tools · priority
          listing in the national calendar · a co-design voice in the
          roadmap.
        </p>
        <div
          className="mt-[18px] rounded-2xl border border-[#C9A962]/30 p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,169,98,0.1), rgba(124,156,255,0.04))",
          }}
        >
          <p className="mb-1.5 text-[11px] font-bold tracking-[1px] text-[#C9A962] uppercase">
            ◆ NTLSN on campus — the teaching, learning &amp; research day
          </p>
          <p className="mb-1.5 text-lg font-extrabold text-white">
            We come to you. <span className="text-[#C9A962]">$30k</span> —
            all-inclusive, no hidden fees.
          </p>
          <p className="max-w-[700px] text-sm leading-relaxed text-[#9FB3C8]">
            For a new Head of School building a culture of teaching, learning
            and research — especially after a restructure. A full day,
            MC&rsquo;d and run end-to-end by the founder: guided facilitation
            of your strategic plans, fully branded to your school, captured
            on video and audio for your team to keep. Everything from
            registration and abstract submission through to the day itself —{" "}
            <b className="text-[#CBD8E6]">fully catered, all included</b>.
            You keep full IT control; we cover the rest.
          </p>
        </div>
      </div>

      {/* ── Symposiums panel ── */}
      <div
        id="pt-symp"
        role="tabpanel"
        aria-labelledby="tab-pt-symp"
        hidden={activeTab !== "pt-symp"}
      >
        <p className="mb-1 text-lg font-extrabold text-white">
          Run it yourself — or we run it
        </p>
        <p className="mb-3.5 text-sm leading-relaxed text-[#9FB3C8]">
          Registration and submission are{" "}
          <b className="text-[#CBD8E6]">
            included in every School and Institution plan
          </b>{" "}
          — flat annual, unlimited events (organisers elsewhere pay ~
          <b className="text-[#CBD8E6]">$1.5k–8k per event</b>). Want us on
          the ground? Facilitation comes in three catered tiers. Or share a
          one-off symposium with the sector,{" "}
          <a href="#architecture" className="text-teal">
            free
          </a>
          .
        </p>
        <div className="mb-[18px] grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {SYMP_PACKAGES.map((pkg) => (
            <div
              key={pkg.label}
              className="rounded-[14px] p-[18px]"
              style={{
                background: pkg.premium
                  ? "linear-gradient(135deg, rgba(201,169,98,0.12), rgba(124,156,255,0.04))"
                  : "#0f1f38",
                border: pkg.premium
                  ? "1px solid rgba(201,169,98,0.4)"
                  : "1px solid rgba(124,156,255,0.25)",
              }}
            >
              <p
                className="mb-1 text-xs font-bold tracking-[1px] uppercase"
                style={{ color: pkg.colour }}
              >
                {pkg.label}
              </p>
              <p className="mb-1.5 text-base font-extrabold text-white">
                {pkg.price}
              </p>
              <p className="text-[13px] leading-[1.55] text-[#9FB3C8]">
                {pkg.desc}
              </p>
            </div>
          ))}
          <div className="rounded-[14px] border border-white/[0.08] bg-navy px-5 py-[18px] text-left sm:col-span-2 lg:col-span-3">
            <p className="mb-3 text-[11px] font-bold tracking-[0.6px] text-[#C9A962] uppercase">
              Take part, in three steps
            </p>
            <div className="flex flex-wrap gap-3">
              {SYMP_STEPS.map(([n, head, body]) => (
                <div
                  key={n}
                  className="min-w-[168px] flex-1 rounded-[11px] border border-white/[0.08] bg-[#0f1f38] px-[15px] py-3.5"
                >
                  <p className="mb-1.5 flex items-center gap-[9px]">
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-[#C9A962]/50 bg-[#C9A962]/[0.18] text-xs font-extrabold text-[#C9A962]"
                    >
                      {n}
                    </span>
                    <span className="text-[13.5px] font-bold text-white">
                      {head}
                    </span>
                  </p>
                  <p className="text-[12.5px] leading-[1.45] text-[#9FB3C8]">
                    {body}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-[13px] text-[12.5px] leading-normal text-[#9FB3C8]">
              Your interest is collected through a secure Microsoft Form and
              flows into the national{" "}
              <a
                href="#ntlsn-coming2027"
                className="text-[#2DD4BF] no-underline"
              >
                Peer-Review Exchange
              </a>
              , so presenting and being reviewed become one connected step.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0f1f38] p-7">
          <p className="mb-1 text-[22px] font-extrabold text-white">
            Run your symposium on NTLSN
          </p>
          <p className="mb-[18px] max-w-[640px] text-[15px] leading-relaxed text-[#9FB3C8]">
            We map all {universities.length} universities and link each to
            its Learning &amp; Teaching team. Pick yours to reach its team
            now, and preview how the Portal — abstract submission,
            registration, your own Teaching &amp; Learning Week — would work
            for you. Founding institutions shape it. Exploring the Portal is
            a preview — selecting a university here doesn&rsquo;t imply it
            takes part or endorses NTLSN.
          </p>
          <div className="flex max-w-[680px] flex-wrap items-center gap-2.5">
            <label htmlFor="pricing-uni" className="sr-only">
              Find your university
            </label>
            <select
              id="pricing-uni"
              value={selectedUni}
              onChange={(e) => {
                setSelectedUni(e.target.value);
                setCtaVisible(true);
              }}
              className="min-w-[220px] flex-1 rounded-[10px] border border-white/[0.18] bg-navy px-[13px] py-[11px] text-base text-white"
            >
              <option value="">Find your university…</option>
              {sortedUnis.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setPortalOpen(true)}
              className="cursor-pointer rounded-[10px] border border-teal bg-transparent px-[18px] py-3 text-[15px] font-extrabold text-teal"
            >
              Preview the 2027 Portal →
            </button>
          </div>
          <p className="mt-2.5 text-[13px] text-[#8AA0B6]">
            Preview — the Portal opens to founding institutions in 2027.
          </p>
          {ctaVisible ? (
            <div className="mt-4 rounded-xl border border-teal/25 bg-teal/[0.08] p-[18px]">
              {selectedUni ? (
                <>
                  <p className="mb-1 text-xs tracking-[0.12em] text-[#8AA0B6] uppercase">
                    Your Learning &amp; Teaching team
                  </p>
                  <p className="mb-3 text-lg font-bold text-white">{who}</p>
                  {selected?.tlUrl ? (
                    <a
                      href={selected.tlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-[10px] bg-teal px-5 py-3 text-base font-extrabold text-[#08131F] no-underline"
                    >
                      Visit the team →
                    </a>
                  ) : (
                    <p className="text-[15px] text-[#9FB3C8]">
                      Confirming this team&rsquo;s page —{" "}
                      <a href="#ntlsn-network" className="text-teal">
                        browse the national network →
                      </a>
                    </p>
                  )}
                </>
              ) : (
                <p className="mb-2 text-sm text-[#FFCF8A]">
                  Pick your university above to personalise this.
                </p>
              )}
              <p className="mt-3.5 mb-3.5 text-sm leading-relaxed text-[#9FB3C8]">
                Submit abstracts · register attendees · run {who}&rsquo;s own
                Teaching &amp; Learning Week — all in one place.{" "}
                <span className="text-[#8AA0B6]">
                  (Coming 2027 — founding institutions first.)
                </span>
              </p>
              <a
                href="#ntlsn-coming2028"
                className="inline-block rounded-[10px] bg-teal px-[18px] py-[11px] text-[15px] font-extrabold text-[#08131F] no-underline"
              >
                Register {who}&rsquo;s interest →
              </a>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Associations panel ── */}
      <div
        id="pt-assoc"
        role="tabpanel"
        aria-labelledby="tab-pt-assoc"
        hidden={activeTab !== "pt-assoc"}
      >
        <div className="mb-4 rounded-2xl border border-teal/[0.28] bg-[#0f1f38] p-[22px]">
          <p className="text-lg font-extrabold text-teal">
            Free{" "}
            <span className="font-medium text-[#9FB3C8]">year 1</span>, then
            $5k/yr
          </p>
          <p className="mt-0.5 mb-1.5 text-[15px] font-bold text-white">
            Peak bodies, scholarly associations &amp; regulators
          </p>
          <p className="text-[13px] leading-relaxed text-[#9FB3C8]">
            Free in year one (no obligation), then{" "}
            <b className="text-[#CBD8E6]">$5k/yr</b> under a standard MoU —
            each body co-designs{" "}
            <b className="text-[#CBD8E6]">its own tailored package</b> below.
            A <b className="text-[#CBD8E6]">complement</b> to the
            sector&rsquo;s peak bodies, never a competitor.{" "}
            <a href="#architecture" className="text-teal">
              See where they sit →
            </a>
          </p>
          <p className="mt-3 border-t border-white/[0.08] pt-2.5 text-[13px] leading-relaxed text-[#CBD8E6]">
            ◆ Every package can add a{" "}
            <b className="text-white">
              founder-facilitated General Meeting or symposium
            </b>{" "}
            — we fly to you and run it end-to-end, catered (the on-campus
            day, for your association).
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ASSOC_PACKAGES.map((pkg) => {
            const external = !pkg.href.startsWith("#");
            return (
              <a
                key={pkg.name}
                href={pkg.href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="block rounded-[14px] border border-[#7C9CFF]/[0.22] bg-[#0f1f38] p-[15px] no-underline transition-colors hover:border-[#7C9CFF]/50"
              >
                <span className="mb-[3px] flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-extrabold text-white">
                    {pkg.name}
                  </span>
                  <span className="text-[13px] font-extrabold whitespace-nowrap text-[#7C9CFF]">
                    $5k/yr
                  </span>
                </span>
                <span className="block text-xs leading-normal text-[#9FB3C8]">
                  {pkg.benefit}{" "}
                  {pkg.tag === "live" ? (
                    <span className="ml-1 rounded-full border border-teal/45 px-1.5 py-px text-[9px] font-bold tracking-[0.5px] text-teal">
                      LIVE
                    </span>
                  ) : pkg.tag === "2028" ? (
                    <span className="ml-1 rounded-full border border-[#C9A962]/45 px-1.5 py-px text-[9px] font-bold tracking-[0.5px] text-[#C9A962]">
                      2028
                    </span>
                  ) : (
                    <span className="ml-1 rounded-full border border-amber/45 px-1.5 py-px text-[9px] font-bold tracking-[0.5px] text-amber">
                      IN DESIGN
                    </span>
                  )}
                </span>
              </a>
            );
          })}
        </div>
        <p className="mt-3.5 max-w-[680px] text-xs leading-relaxed text-[#7D92A8]">
          Proposed packages for co-design. Naming a peak body does not imply
          endorsement or an existing agreement — LIVE badges refer to the
          NTLSN tool, not a partnership.
        </p>
      </div>

      <p className="mx-auto mt-[18px] max-w-[680px] text-center text-[13px] text-[#8AA0B6]">
        Prices are founding-cohort rates for the 2026–27 pilots — we&rsquo;re
        inviting founding partners now, not charging yet.{" "}
        <a href="#ntlsn-coming2028" className="text-teal">
          See the roadmap →
        </a>
      </p>

      <PortalModal
        open={portalOpen}
        uni={selectedUni}
        talks={talks}
        onAddTalk={(talk) => setTalks((t) => [...t, talk])}
        onRemoveTalk={(index) =>
          setTalks((t) => t.filter((_, i) => i !== index))
        }
        onClose={() => setPortalOpen(false)}
      />
    </section>
  );
}
