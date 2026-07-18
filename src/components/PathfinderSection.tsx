/**
 * #ntlsn-pathfinder — "Recognise your skills — past, present and emerging."
 * (Epic 1.2 PR-G, recognition band). Ported verbatim from the production
 * ntlsn-pathfinder-script injector: the Past/Present/Emerging lanes and the
 * Global Academic RPL 2029 roadmap card (PSF/AQF/Open Badges/W3C VC
 * standards chips word-for-word).
 */
const LANES: ReadonlyArray<{
  eyebrow: string;
  title: string;
  body: string;
  colour: string;
  links: ReadonlyArray<[string, string]>;
}> = [
  {
    eyebrow: "Past",
    title: "Recognition of prior learning",
    body: "Years of teaching, service and leadership that never got formally counted. Surface it, evidence it, and turn it into a portable record.",
    colour: "#8fb081",
    links: [
      ["See what counts", "/psf-evidence-audit.html"],
      ["Count it", "/recognition-points.html"],
    ],
  },
  {
    eyebrow: "Present",
    title: "Your current practice",
    body: "Your portfolio now — peer review, calibration, course quality, and your promotion case, all in one place.",
    colour: "#c66c3f",
    links: [
      ["Peer review", "#ntlsn-coming2027"],
      ["Map to your level", "/recognition-navigator.html"],
    ],
  },
  {
    eyebrow: "Emerging",
    title: "The skills the sector is racing to recognise",
    body: "AI in teaching, micro-credentials and new pedagogies — recognised as they appear, not years late.",
    colour: "#a8737f",
    links: [
      ["Course quality", "/course-quality.html"],
      ["Open standards", "#ntlsn-coming2028"],
    ],
  },
];

const STANDARD_CHIPS: readonly string[] = [
  "CEDEFOP 4-phase RPL",
  "PSF 2023 & AQF",
  "Open Badges 3.0",
  "W3C Verifiable Credentials",
  "My eQuals · Credly",
  "No crypto",
];

export default function PathfinderSection() {
  return (
    <section
      id="ntlsn-pathfinder"
      aria-labelledby="ntlsn-pathfinder-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto max-w-[1000px]">
        <div className="mx-auto mb-[26px] max-w-[720px] text-center">
          <div className="mb-[11px] inline-block text-[11px] font-extrabold tracking-[1.6px] text-[#8fb081] uppercase">
            Recognition Pathfinder
          </div>
          <h2
            id="ntlsn-pathfinder-heading"
            className="mb-3 text-[clamp(26px,3.5vw,40px)] leading-[1.14] font-extrabold text-white"
          >
            Recognise your skills — past, present and emerging.
          </h2>
          <p className="text-[clamp(14.5px,1.7vw,17px)] leading-[1.6] text-[#bca98f]">
            Tell us what you are recognising, and we will point you to the
            right tool.{" "}
            <b className="text-[#d8e0cc]">
              Free for staff, forever, no paywall
            </b>{" "}
            — your record is yours, on open standards.
          </p>
        </div>
        <div className="mb-6 flex flex-wrap gap-3.5">
          {LANES.map((lane) => (
            <div
              key={lane.eyebrow}
              className="min-w-[240px] flex-1 rounded-[15px] border border-white/[0.08] bg-[#2a2218] px-[21px] py-5"
              style={{ borderTop: `3px solid ${lane.colour}` }}
            >
              <div
                className="mb-2 text-[10.5px] font-extrabold tracking-[1.4px] uppercase"
                style={{ color: lane.colour }}
              >
                {lane.eyebrow}
              </div>
              <div className="mb-[7px] text-[16px] leading-[1.25] font-extrabold text-white">
                {lane.title}
              </div>
              <div className="mb-3.5 text-[13px] leading-[1.55] text-[#b3a48c]">
                {lane.body}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {lane.links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="inline-block rounded-lg px-[13px] py-[7px] text-[12.5px] font-bold no-underline"
                    style={{
                      color: lane.colour,
                      background: `${lane.colour}14`,
                      border: `1px solid ${lane.colour}40`,
                    }}
                  >
                    {label} →
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-[18px] border border-[rgba(198,108,63,.28)] bg-[radial-gradient(120%_140%_at_50%_0%,rgba(198,108,63,.12),rgba(37,30,21,0)_70%),#251e15] px-[26px] py-6 text-center">
          <div className="mb-[13px] inline-block rounded-full border border-[rgba(230,163,60,.4)] px-3 py-1 text-[10px] font-extrabold tracking-[1.4px] text-amber uppercase">
            Global Academic RPL · in design · 2029
          </div>
          <h3 className="mb-2.5 text-[clamp(19px,2.2vw,26px)] leading-[1.18] font-extrabold text-white">
            Recognition that travels.
          </h3>
          <p className="mx-auto mb-3.5 max-w-[720px] text-[clamp(13.5px,1.6vw,16px)] leading-[1.62] text-[#d9cdb6]">
            By 2029, the goal is teaching recognition that crosses borders:
            assessed once against the{" "}
            <b className="text-white">
              Professional Standards Framework and AQF
            </b>
            , issued as{" "}
            <b className="text-white">
              Open Badges 3.0 and W3C Verifiable Credentials
            </b>{" "}
            — cryptographically signed and tamper-evident, with{" "}
            <b className="text-white">no blockchain</b> — carried in
            My&nbsp;eQuals and Credly, and portable through the Groningen
            Declaration Network. The standards the sector already trusts, made
            to travel.
          </p>
          <div className="flex flex-wrap justify-center gap-[7px]">
            {STANDARD_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/[0.12] bg-white/[0.05] px-[11px] py-1 text-[11px] font-semibold text-[#b3a48c]"
              >
                {chip}
              </span>
            ))}
          </div>
          <p className="mt-3.5 text-[11px] text-[#a0907a]">
            A roadmap track, not a live feature — aligned with the principles
            of the UNESCO Global Convention and the Tokyo Convention for the
            teaching domain they leave uncovered.
          </p>
        </div>
      </div>
    </section>
  );
}
