/**
 * #ntlsn-representation — "Governed in balance · No single bloc runs it."
 * (Epic 1.2 PR-E), ported verbatim from the ntlsn-representation-script
 * patch: proposed advisory-seat allocation across the university groupings,
 * weighted so the regional/teaching-intensive voice is not outvoted, with
 * the not-yet-ratified disclaimer intact.
 */
interface SeatRow {
  name: string;
  seats: number;
  desc: string;
  colour: string;
}

const SEAT_ROWS: readonly SeatRow[] = [
  {
    name: "Regional Universities Network (RUN)",
    seats: 3,
    desc: "Regional and teaching-intensive, often hit hardest",
    colour: "#2DD4BF",
  },
  {
    name: "Australian Technology Network (ATN)",
    seats: 2,
    desc: "Industry-engaged, practice-focused",
    colour: "#7C9CFF",
  },
  {
    name: "Innovative Research Universities (IRU)",
    seats: 1,
    desc: "Comprehensive and community-minded",
    colour: "#4FD1A5",
  },
  {
    name: "Group of Eight (Go8)",
    seats: 2,
    desc: "Research-intensive",
    colour: "#C57BFF",
  },
  {
    name: "Independent / unaligned",
    seats: 1,
    desc: "Outside the formal groupings",
    colour: "#FFB448",
  },
  {
    name: "Private and NUHEP",
    seats: 1,
    desc: "Non-university higher education providers",
    colour: "#FF8AB0",
  },
];

export default function RepresentationSection() {
  return (
    <section
      id="ntlsn-representation"
      aria-labelledby="ntlsn-representation-heading"
      className="relative mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto max-w-[780px]">
        <div className="mb-6 text-center">
          <p className="mb-3 text-[11px] font-extrabold tracking-[2px] text-[#2DD4BF] uppercase">
            Governed in balance
          </p>
          <h2
            id="ntlsn-representation-heading"
            className="mb-3 text-[clamp(24px,3.4vw,38px)] leading-[1.15] font-extrabold text-white"
          >
            No single bloc runs it.
          </h2>
          <p className="mx-auto max-w-[640px] text-[clamp(14.5px,1.7vw,17px)] leading-[1.65] text-[#CBD8E6]">
            If a national commons is to belong to the whole sector, no one
            grouping can dominate it. Representation is allocated across the
            university groupings, weighted so the regional and
            teaching-intensive voice is not outvoted by the research-intensive
            bloc.
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.09] bg-[#0f1f3a] px-6 pt-2 pb-4">
          <ul className="list-none">
            {SEAT_ROWS.map((row) => (
              <li
                key={row.name}
                className="flex flex-wrap items-center gap-3.5 border-b border-white/[0.06] py-[13px]"
              >
                <div className="min-w-[230px] flex-1">
                  <p className="text-[14.5px] font-bold text-white">
                    {row.name}
                  </p>
                  <p className="text-[12.5px] text-[#8AA0B6]">{row.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="whitespace-nowrap">
                    {Array.from({ length: row.seats }, (_, i) => (
                      <span
                        key={i}
                        className="mr-[5px] inline-block h-[13px] w-[13px] rounded-full"
                        style={{ background: row.colour }}
                      />
                    ))}
                  </span>
                  <span
                    className="text-[13px] font-extrabold whitespace-nowrap"
                    style={{ color: row.colour }}
                  >
                    {row.seats} seat{row.seats === 1 ? "" : "s"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p className="flex items-center justify-between pt-3.5 text-sm font-extrabold text-white">
            <span>Total</span>
            <span className="text-[#2DD4BF]">10 seats</span>
          </p>
        </div>
        <p className="mx-auto mt-5 max-w-[640px] text-center text-[12.5px] text-[#8AA0B6] italic">
          A governance model in design, not yet ratified. Seat allocations by
          grouping are proposed to keep the commons balanced, not weighted by
          funding. Confirmation of institutions and final terms are pending
          stakeholder consultation.
        </p>
      </div>
    </section>
  );
}
