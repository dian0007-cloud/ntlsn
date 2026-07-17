/**
 * #ntlsn-journal — "Critical Learner Partnerships" (Epic 1.2 PR-C), ported
 * from the ntlsn-journal-script patch: the diamond open-access journal
 * announcement card (in design). Static content, verbatim, including the
 * honest "name, editorial board and partner still to be confirmed" note and
 * the link to /critical-learner-partnerships.html.
 */
export default function JournalSection() {
  return (
    <section
      id="ntlsn-journal"
      aria-labelledby="ntlsn-journal-heading"
      className="relative scroll-mt-20 px-4 py-14"
    >
      <div className="mx-auto max-w-[820px] rounded-[18px] border border-white/[0.09] bg-[#0f1f3a] p-[30px] text-center [border-top:3px_solid_#C9A962]">
        <p className="mb-[15px] inline-block rounded-full border border-amber/40 px-[13px] py-[5px] text-[10.5px] font-extrabold tracking-[1.6px] text-amber uppercase">
          New journal · diamond open-access · in design
        </p>
        <h2
          id="ntlsn-journal-heading"
          className="mb-3 text-[clamp(22px,2.8vw,32px)] leading-[1.18] font-extrabold text-white"
        >
          Critical Learner Partnerships
        </h2>
        <p className="mx-auto mb-[18px] max-w-[640px] text-[clamp(14.5px,1.7vw,17px)] leading-[1.65] text-[#CBD8E6]">
          A diamond open-access journal — free to read, free to publish —
          with one commitment that sets it apart: students are{" "}
          <b className="text-white">
            formally recognised for their partnership
          </b>{" "}
          in the work itself, not just thanked in a footnote. Developed with
          students, reviewed with students, published with students.
        </p>
        <p className="mx-auto mb-[18px] max-w-[560px] rounded-xl border border-[#C9A962]/30 bg-[#C9A962]/10 px-[18px] py-3 text-[13.5px] font-semibold text-[#F0E3C4]">
          The recognition every other partnership journal leaves implicit —
          made explicit.
        </p>
        <p className="mx-auto mb-4 max-w-[560px] text-[12.5px] text-[#8DA1B5]">
          Name, editorial board and partner still to be confirmed.
        </p>
        <a
          href="/critical-learner-partnerships.html"
          className="inline-block rounded-xl bg-[#C9A962] px-[26px] py-3 text-sm font-extrabold text-[#1A1407] no-underline"
        >
          Explore the journal →
        </a>
      </div>
    </section>
  );
}
