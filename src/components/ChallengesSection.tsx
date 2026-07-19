/**
 * #ntlsn-challenges — "The sector is squeezed. Sharing is the affordable
 * response." (Epic 1.2 PR-G, manifesto band). Ported verbatim from the
 * production ntlsn-challenges-script injector: the Universities Australia
 * strain stats, the "where it is going" stats, and both source lines.
 */
const STATS: ReadonlyArray<{ n: string; l: string }> = [
  { n: "13", l: "universities in operating deficit (2024)" },
  { n: "−6%", l: "real funding per student place since 2017" },
  { n: "~⅔", l: "of revenue from now-uncertain enrolments" },
  { n: "~$900M", l: "forward CSP funding cut (2024–26)" },
];

const STATS2: ReadonlyArray<{ n: string; l: string }> = [
  {
    n: "$1.02M",
    l: "average vice-chancellor pay (2024). A tutor earns under $23,000.",
  },
  { n: "$1.8bn", l: "spent on external consultants in a single year (2024)." },
  { n: "~4,000", l: "staff jobs cut nationally in around 18 months." },
  {
    n: "76.5%",
    l: "student experience rating (2024), still below the pre-2020 norm.",
  },
];

export default function ChallengesSection() {
  return (
    <section
      id="ntlsn-challenges"
      aria-labelledby="ntlsn-challenges-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-16"
    >
      <div className="mx-auto mb-[30px] max-w-[780px] text-center">
        <div className="mb-[11px] text-[13px] font-bold tracking-[2px] text-[#d96650] uppercase">
          The sector, right now
        </div>
        <h2
          id="ntlsn-challenges-heading"
          className="mb-[13px] text-[clamp(26px,3.6vw,40px)] leading-[1.15] font-extrabold text-white"
        >
          The sector is squeezed. Sharing is the affordable response.
        </h2>
        <p className="text-[clamp(15px,1.8vw,18px)] leading-[1.6] text-[#bca98f]">
          Australia’s universities are under sustained financial strain. A
          free, shared commons can’t fix the funding — but it can stop the
          sector paying, campus by campus, for connection it could build and
          own <b className="text-white">once, together</b>.
        </p>
      </div>
      <div className="mx-auto flex max-w-[880px] flex-wrap justify-center gap-4">
        {STATS.map((stat) => (
          <div
            key={stat.l}
            className="min-w-[150px] flex-1 rounded-[14px] border border-[rgba(217, 102, 80,.22)] bg-[#2a2218] px-[18px] py-5 text-center"
          >
            <div className="text-[clamp(26px,3.4vw,38px)] leading-none font-extrabold text-[#f4efe4]">
              {stat.n}
            </div>
            <div className="mt-2 text-[12.5px] leading-[1.4] text-[#b3a48c]">
              {stat.l}
            </div>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-[26px] max-w-[720px] text-center text-[12.5px] italic text-[#a0907a]">
        Source: Universities Australia,{" "}
        <i>
          Critical Challenges in Australia’s University Sector: securing a
          sustainable future
        </i>{" "}
        (2025 edition), 18 February 2026.
      </p>
      <div className="mx-auto mt-[34px] max-w-[880px] border-t border-white/[0.08] pt-[30px]">
        <div className="mb-2 text-center text-[13px] font-bold tracking-[2px] text-amber uppercase">
          And where it is going
        </div>
        <h3 className="mx-auto mb-[22px] max-w-[680px] text-center text-[clamp(20px,2.6vw,28px)] leading-[1.2] font-extrabold text-white">
          The money is moving up and out, not to the people who teach.
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {STATS2.map((stat) => (
            <div
              key={stat.l}
              className="min-w-[150px] flex-1 rounded-[14px] border border-white/[0.10] bg-[#2a2218] px-[18px] py-5 text-center"
            >
              <div className="text-[clamp(24px,3.2vw,34px)] leading-none font-extrabold text-[#f4efe4]">
                {stat.n}
              </div>
              <div className="mt-2 text-[12.5px] leading-[1.45] text-[#b3a48c]">
                {stat.l}
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-[640px] text-center text-[clamp(15px,1.8vw,18px)] leading-[1.55] font-semibold text-[#d9cdb6]">
          A free, shared commons returns the work to the people who do it.{" "}
          <b className="text-[#8fb081]">This is why staff come first.</b>
        </p>
        <p className="mx-auto mt-3.5 max-w-[600px] text-center text-[14px] leading-[1.55] font-semibold text-[#d9cdb6]">
          Wherever you sit in this, from a casual tutor to a DVC, there is a
          way in for you.{" "}
          <a
            href="/find-your-path.html"
            className="font-extrabold text-[#8fb081] no-underline"
          >
            See what NTLSN means for your role →
          </a>
        </p>
        <p className="mx-auto mt-4 max-w-[760px] text-center text-[12px] italic text-[#a0907a]">
          Sources: QILT Student Experience Survey National Report 2024; Times
          Higher Education and The Australia Institute on executive pay
          (2025); ABC Four Corners on consultant spend and job losses (2026);
          NTEU wage-theft reporting (2024).
        </p>
      </div>
    </section>
  );
}
