import { useEffect, useRef } from "react";
import { formatCount, SOTL_WORK_COUNT } from "../lib/frontdoor";

/**
 * #ntlsn-nowbanner — "Everything here is live today" (PR-A "Front door").
 * Ported from the ntlsn-nowbanner-script patch: teal AVAILABLE NOW eyebrow,
 * the live-today claim, twin CTAs and the 2027/2028 dating line, over a
 * drifting teal node-net canvas.
 *
 * The canvas is the same node/edge field as production (aria-hidden,
 * pointer-events none, opacity .6). prefers-reduced-motion is honoured the
 * way the patch did it: one static frame, no animation loop.
 *
 * Counts are derived, not copied (PR-A brief): the SoTL work count comes
 * from data/ltr.json via a build-time constant. Production's hardcoded
 * "1,431" stays correct only by accident of time; this stays correct by
 * construction. "30+ teaching tools" is a floor claim kept verbatim — there
 * is no tools dataset in the repo yet.
 */
export default function NowBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
    }
    let W = 0;
    let H = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let stopped = false;

    function size() {
      if (!section || !canvas) return;
      const r = section.getBoundingClientRect();
      W = canvas.width = Math.round(r.width * DPR);
      H = canvas.height = Math.round(r.height * DPR);
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      // Production's density: one node per ~22,000 css px², clamped 26–64.
      const n = Math.min(64, Math.max(26, Math.round((r.width * r.height) / 22000)));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22 * DPR,
        vy: (Math.random() - 0.5) * 0.22 * DPR,
      }));
    }

    function draw() {
      if (!ctx || stopped) return;
      ctx.clearRect(0, 0, W, H);
      const maxD = 140 * DPR;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!reducedMotion) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > W) a.vx *= -1;
          if (a.y < 0 || a.y > H) a.vy *= -1;
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxD) {
            ctx.strokeStyle = `rgba(143, 176, 129,${(0.3 * (1 - d / maxD)).toFixed(3)})`;
            ctx.lineWidth = DPR;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(143, 176, 129,0.8)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, 2 * DPR, 0, 6.2832);
        ctx.fill();
      }
      if (!reducedMotion) raf = requestAnimationFrame(draw);
    }

    size();
    draw();

    const observer = new ResizeObserver(() => {
      size();
      if (reducedMotion) draw();
    });
    observer.observe(section);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ntlsn-nowbanner"
      aria-labelledby="nowbanner-heading"
      className="relative scroll-mt-20 overflow-hidden border-y border-white/[0.06] bg-[#19130d] px-6 py-[42px]"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      />
      <div className="relative z-[1] mx-auto max-w-[1000px] text-center">
        <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-[2.5px] text-teal">
          ◇ Available now · Free &amp; open
        </p>
        <h2
          id="nowbanner-heading"
          className="mb-2.5 text-[clamp(22px,3.4vw,32px)] font-extrabold tracking-[-0.01em] text-white"
        >
          Everything here is live today — free, open, no logins.
        </h2>
        <p className="mx-auto mb-4 max-w-[690px] text-[15px] leading-[1.55] text-[#d9cdb6]">
          A free national commons: search <b>{formatCount(SOTL_WORK_COUNT)}</b>{" "}
          SoTL works, <b>30+ teaching tools</b> you can use right now, every
          sector event, the open T&amp;L map, OER, grants and frameworks. No
          account, no paywall.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <a
            href="#ntlsn-trynow"
            className="rounded-full bg-teal px-[18px] py-2.5 text-[13px] font-extrabold text-[#19130d]"
          >
            Free search &amp; tools →
          </a>
          <a
            href="#ntlsn-archive"
            className="rounded-full border border-white/20 px-[18px] py-2.5 text-[13px] font-bold text-[#ece5d6]"
          >
            Browse the archive →
          </a>
        </div>
        <p className="mt-3.5 text-[11.5px] text-[#97876f]">
          Symposiums arrive 2027 · recognition &amp; interoperability 2028 —
          clearly dated below.
        </p>
      </div>
    </section>
  );
}
