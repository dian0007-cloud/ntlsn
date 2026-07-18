import { useState } from "react";

/**
 * #ntlsn-service — "Your service counts too." (Epic 1.2 PR-G, recognition
 * band). Ported from the production ntlsn-service-script injector: the
 * governance/committee role chips (toggleable), the service-hours and
 * scholarship-points inputs, and the live portable-record summary line —
 * same arithmetic (points ≈ one per recognised hour, floor()ed).
 */
const GROUPS: ReadonlyArray<[string, readonly string[]]> = [
  [
    "Governance & boards",
    [
      "Academic Board member",
      "Board Chair / Deputy Chair",
      "Academic Board Executive",
      "University Council member",
      "Governance officer",
    ],
  ],
  [
    "Audit, risk & ethics",
    ["Audit & Risk Committee", "Human Research Ethics", "Animal Ethics"],
  ],
  [
    "Research & HDR",
    [
      "Research Committee",
      "Research Training Subcommittee",
      "HDR grievance resolution",
    ],
  ],
  [
    "Education, curriculum & quality",
    [
      "Education Committee",
      "Program / course proposal review",
      "Programmatic assessment working party",
      "LMS working party",
      "Workload-model redesign",
      "Academic Quality Framework review",
    ],
  ],
  [
    "Students & selection",
    [
      "Student Academic Appeals",
      "Student Senate / student rep",
      "Search / selection committees",
    ],
  ],
];

const INPUT_CLASS =
  "w-full rounded-[9px] border border-white/[0.14] bg-navy px-3 py-2.5 text-[14px] text-white";

function toCount(v: string): number {
  const n = parseFloat(v);
  return n > 0 && isFinite(n) ? Math.floor(n) : 0;
}

export default function ServiceSection() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [hours, setHours] = useState("");
  const [sch, setSch] = useState("");

  const toggle = (role: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
  };

  const nRoles = selected.size;
  const svc = toCount(hours);
  const schP = toCount(sch);
  const total = svc + schP;
  const empty = !nRoles && !svc && !schP;

  return (
    <section
      id="ntlsn-service"
      aria-labelledby="ntlsn-service-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto max-w-[880px]">
        <div className="mx-auto mb-6 max-w-[720px] text-center">
          <div className="mb-3.5 inline-flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-[#8fb081] px-3 py-1 text-[11px] font-extrabold tracking-[1.5px] text-[#1f1810] uppercase">
              ▶ Try it
            </span>
            <span className="rounded-full border border-[rgba(230,163,60,.4)] px-[11px] py-1 text-[10.5px] font-extrabold tracking-[1.2px] text-amber uppercase">
              Preview · in design · 2027
            </span>
          </div>
          <h2
            id="ntlsn-service-heading"
            className="mb-3 text-[clamp(25px,3.4vw,38px)] leading-[1.15] font-extrabold text-white"
          >
            Your service counts too.
          </h2>
          <p className="text-[clamp(14.5px,1.7vw,17px)] leading-[1.6] text-[#bca98f]">
            The hours that hold a university together, Academic Board,
            committees, council, ethics panels, working parties, mentoring and
            outreach, rarely show up in a workload model and are hard to
            evidence at promotion. Log them here, alongside your scholarship,
            in one portable record. NTLSN records and verifies; your
            institution awards the credit.
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#2a2218] p-[22px]">
          <div className="mb-3 text-[11px] font-bold tracking-[0.5px] text-[#a0907a] uppercase">
            Tick the service you do
          </div>
          {GROUPS.map(([group, roles]) => (
            <div key={group} className="mb-[13px]">
              <div className="mb-[7px] text-[10.5px] font-bold tracking-[0.5px] text-[#a0907a] uppercase">
                {group}
              </div>
              <div className="flex flex-wrap gap-[7px]">
                {roles.map((role) => {
                  const on = selected.has(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(role)}
                      className="cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors select-none"
                      style={
                        on
                          ? {
                              background: "rgba(143,176,129,.16)",
                              border: "1px solid rgba(143,176,129,.5)",
                              color: "#eafffb",
                            }
                          : {
                              background: "rgba(255,255,255,.06)",
                              border: "1px solid rgba(255,255,255,.14)",
                              color: "#d9cdb6",
                            }
                      }
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
            <div>
              <label
                className="mb-[5px] block text-[11.5px] font-semibold text-[#b3a48c]"
                htmlFor="sv-hours"
              >
                Service hours this year
              </label>
              <input
                id="sv-hours"
                type="number"
                min={0}
                step={1}
                placeholder="e.g. 40"
                className={INPUT_CLASS}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div>
              <label
                className="mb-[5px] block text-[11.5px] font-semibold text-[#b3a48c]"
                htmlFor="sv-sch"
              >
                Scholarship points (from your record)
              </label>
              <input
                id="sv-sch"
                type="number"
                min={0}
                step={1}
                placeholder="e.g. 60"
                className={INPUT_CLASS}
                value={sch}
                onChange={(e) => setSch(e.target.value)}
              />
            </div>
          </div>
          <div
            className="mt-4 rounded-[10px] border border-[rgba(143,176,129,.22)] bg-[rgba(143,176,129,.08)] px-[15px] py-[13px] text-center text-[14px] leading-[1.55] font-semibold text-[#d9cdb6]"
            role="status"
          >
            {empty ? (
              "Tick the service you do, and add your hours, to see your portable record build."
            ) : (
              <>
                You have logged <b className="text-white">{nRoles}</b> service
                role{nRoles === 1 ? "" : "s"} and{" "}
                <b className="text-white">{svc}</b> service hour
                {svc === 1 ? "" : "s"}. With{" "}
                <b className="text-white">{schP}</b> scholarship point
                {schP === 1 ? "" : "s"}, that is{" "}
                <b className="text-[#8fb081]">
                  {total} point{total === 1 ? "" : "s"}
                </b>{" "}
                in one portable record.
              </>
            )}
          </div>
        </div>
        <p className="mx-auto mt-[18px] max-w-[640px] text-center text-[13.5px] font-semibold text-[#8fb081]">
          Future-proof yourself: badge your service and your scholarship.
          Easier to recognise, harder to overlook.
        </p>
        <p className="mx-auto mt-2 max-w-[660px] text-center text-[12px] leading-[1.55] text-[#a0907a]">
          Points are illustrative, roughly one per recognised hour, consistent
          with the recognition record. NTLSN issues the record; your
          institution awards the RPL or credit. Issuance in 2027.
        </p>
      </div>
    </section>
  );
}
