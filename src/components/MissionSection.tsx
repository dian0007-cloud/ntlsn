/**
 * #ntlsn-mission — "Our mission" (Epic 1.2 PR-E), ported verbatim from the
 * ntlsn-mission-script patch.
 */
export default function MissionSection() {
  return (
    <section
      id="ntlsn-mission"
      aria-labelledby="ntlsn-mission-heading"
      className="relative mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[46px]"
    >
      <div className="mx-auto max-w-[860px] text-center">
        <p className="mb-3.5 text-[11px] font-extrabold tracking-[2px] text-[#8fb081] uppercase">
          Our mission
        </p>
        <h2
          id="ntlsn-mission-heading"
          className="mb-3.5 text-[clamp(22px,3vw,34px)] leading-[1.2] font-extrabold text-white"
        >
          Connecting the tertiary sector. One Zoom, one Teams, one API at a
          time.
        </h2>
        <p className="text-[clamp(15px,1.9vw,19px)] leading-relaxed text-[#bca98f] italic">
          At the heart of the sector&rsquo;s connectedness is the heart of the
          educator, and the hands of the pedagogue.
        </p>
        <p className="mx-auto mt-[18px] max-w-[640px] text-[clamp(14px,1.7vw,17px)] leading-[1.7] font-semibold text-[#d9cdb6]">
          Learning from others. Learning from ourselves. Learning from our
          students, our staff, our community, our industry. This is our centre
          for connection.
        </p>
        <p className="mt-[22px] text-[clamp(16px,2vw,20px)] font-extrabold tracking-[0.3px] text-[#8fb081]">
          Our purpose, in three words: sharing is caring.
        </p>
      </div>
    </section>
  );
}
