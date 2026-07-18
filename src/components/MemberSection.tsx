/**
 * #ntlsn-member — "The commons · Free for students and staff. Forever."
 * (Epic 1.2 PR-E), ported verbatim from the ntlsn-member-script patch.
 * Front-of-house free-forever language is credibility-critical (CLAUDE.md) —
 * word-for-word from production.
 */
const MEMBER_CARDS: ReadonlyArray<readonly [string, string]> = [
  [
    "No fee, ever",
    "Free for every student and every staff member, with no time limit and no tier to upgrade to.",
  ],
  [
    "No login wall",
    "Open to the whole sector — browse, search and use everything without an account.",
  ],
  [
    "Everything, included",
    "Events, frameworks, recognition tools and the sector map — the full commons, for free.",
  ],
];

export default function MemberSection() {
  return (
    <section
      id="ntlsn-member"
      aria-labelledby="ntlsn-member-heading"
      className="relative mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto mb-8 max-w-[820px] text-center">
        <p className="mb-[13px] inline-block text-[11px] font-extrabold tracking-[2px] text-[#8fb081] uppercase">
          The commons
        </p>
        <h2
          id="ntlsn-member-heading"
          className="mb-[15px] text-[clamp(28px,4vw,44px)] leading-[1.12] font-extrabold text-white"
        >
          Free for students and staff. Forever.
        </h2>
        <p className="text-[clamp(15px,1.8vw,18px)] leading-[1.65] text-[#bca98f]">
          Every academic and every student gets everything on NTLSN — no fee,
          no login wall, no catch. The commons stays free for the people who
          teach and learn; the work we do with institutions and partners keeps
          it sustainable, and never gates what&rsquo;s free.
        </p>
      </div>
      <ul className="mx-auto flex max-w-[900px] list-none flex-wrap items-stretch justify-center gap-3.5">
        {MEMBER_CARDS.map(([head, body]) => (
          <li
            key={head}
            className="min-w-[240px] flex-1 rounded-2xl border border-white/[0.08] bg-[#2a2218] px-[22px] py-6 text-left [border-top:3px_solid_#5DCAA5]"
          >
            <h3 className="mb-[9px] text-xs font-extrabold tracking-[1px] text-[#5DCAA5] uppercase">
              {head}
            </h3>
            <p className="text-sm leading-relaxed text-[#bca98f]">{body}</p>
          </li>
        ))}
      </ul>
      <div className="mt-7 text-center">
        <a
          href="#ntlsn-network"
          className="inline-block rounded-xl bg-[#8fb081] px-[30px] py-3.5 text-base font-extrabold text-[#1f1810] no-underline shadow-[0_6px_22px_rgba(143,176,129,0.3)]"
        >
          Explore the network →
        </a>
        <p className="mx-auto mt-[18px] max-w-[660px] text-[13px] text-[#a0907a] italic">
          Free at the front, sustainable at the back — partnerships fund the
          commons, they never gate it.
        </p>
      </div>
    </section>
  );
}
