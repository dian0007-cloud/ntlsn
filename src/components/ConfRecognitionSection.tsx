/**
 * #ntlsn-confrecognition — "Don't just attend. Get recognised for the whole
 * arc." (Epic 1.2 PR-G, recognition band). Ported verbatim from the
 * production ntlsn-confrecognition-script injector: the three-step
 * proof → reflection → hours cards and the parity note.
 */
const STEPS: ReadonlyArray<[string, string, string]> = [
  [
    "1",
    "Upload your proof",
    "Your registration, or confirmation that you presented.",
  ],
  [
    "2",
    "Reflect, in 500 words",
    "What did it change in your teaching? The reflection is the assessment that makes it count.",
  ],
  [
    "3",
    "Earn the hours",
    "One hour for preparation and one for reflection, recognised for every conference, on top of the time in the room.",
  ],
];

export default function ConfRecognitionSection() {
  return (
    <section
      id="ntlsn-confrecognition"
      aria-labelledby="ntlsn-confrecognition-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 pt-12 pb-[60px]"
    >
      <div className="mx-auto max-w-[900px]">
        <div className="mx-auto mb-6 max-w-[740px] text-center">
          <div className="mb-[13px] inline-block rounded-full border border-[rgba(230,163,60,.4)] px-3 py-1 text-[10.5px] font-extrabold tracking-[1.4px] text-amber uppercase">
            Recognition · in design · 2027
          </div>
          <h2
            id="ntlsn-confrecognition-heading"
            className="mb-3 text-[clamp(24px,3.3vw,36px)] leading-[1.15] font-extrabold text-white"
          >
            Don’t just attend. Get recognised for the whole arc.
          </h2>
          <p className="text-[clamp(14.5px,1.7vw,17px)] leading-[1.65] text-[#d9cdb6]">
            A conference is more than the days in the room. The preparation
            before, and the reflection after, are where it changes your
            teaching. NTLSN recognises all of it: attending or presenting, at
            your own institution or another, here or overseas.
          </p>
        </div>
        <div className="flex flex-wrap gap-3.5">
          {STEPS.map(([n, title, body]) => (
            <div
              key={n}
              className="min-w-[210px] flex-1 rounded-[14px] border border-white/[0.08] bg-[#2a2218] px-5 py-[18px]"
            >
              <div className="mb-2 flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[rgba(143,176,129,.5)] bg-[rgba(143,176,129,.16)] text-[13px] font-extrabold text-[#8fb081]"
                >
                  {n}
                </span>
                <span className="text-[14.5px] font-bold text-white">
                  {title}
                </span>
              </div>
              <div className="text-[13.5px] leading-[1.55] text-[#b3a48c]">
                {body}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-[14px] border border-[rgba(143,176,129,.22)] bg-[rgba(143,176,129,.07)] px-5 py-4 text-center text-[14px] leading-[1.6] text-[#d9cdb6]">
          Presenting at your own institution’s symposium counts as much as a
          keynote overseas. The invisible work, the prep and the reflection,
          finally counts. It all becomes portable recognition: a verified
          My&nbsp;eQuals badge you carry as{" "}
          <a
            href="/recognition-navigator.html"
            className="text-[#8fb081] no-underline"
          >
            RPL between universities
          </a>
          .
        </div>
        <p className="mx-auto mt-4 max-w-[680px] text-center text-[12px] text-[#a0907a]">
          <a href="/recognition-points.html" className="text-[#b3a48c]">
            See how hours become points →
          </a>{" "}
          · The recognition engine and My&nbsp;eQuals issuance ship in 2027;
          points are illustrative.
        </p>
      </div>
    </section>
  );
}
