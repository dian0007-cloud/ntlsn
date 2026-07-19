import { useEffect, useRef, useState } from "react";

/**
 * #ntlsn-litmus — "The litmus test" scrollytelling (Epic 1.2 PR-G, manifesto
 * band). Ported from the production ntlsn-litmus-script injector: a 200vh
 * band whose sticky viewport draws 38 canvas nodes that converge from
 * scatter into a connected mesh as you scroll, flipping the copy from
 * "Today, the sector works alone." to "One connected sector." at the
 * halfway point. Copy verbatim; the canvas is aria-hidden decoration.
 *
 * Divergences, documented:
 * - The injector ran its requestAnimationFrame loop forever; here it runs
 *   only while the section is on screen (IntersectionObserver-gated).
 * - The injector had no reduced-motion handling. Under
 *   prefers-reduced-motion the band renders as a static, normal-height
 *   section showing the resolved end state (no canvas, no scroll morph) —
 *   the WCAG 2.2 AA floor in CLAUDE.md beats verbatim behaviour here.
 */
const STATES = [
  {
    eyebrow: "The litmus test",
    eyebrowColour: "#FF8FA3",
    head: "Today, the sector works alone.",
    sub: "Every university runs its own forms, its own events, its own recognition. Many run none. Nothing connects to anything else.",
  },
  {
    eyebrow: "What NTLSN changes",
    eyebrowColour: "#8fb081",
    head: "One connected sector.",
    sub: "A shared commons, open and free — the whole sector, finally a network.",
  },
] as const;

const NODE_COUNT = 38;

type LitNode = {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  x: number;
  y: number;
};

export default function LitmusSection() {
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [stage, setStage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    const sec = sectionRef.current;
    const cv = canvasRef.current;
    if (!sec || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let nodes: LitNode[] = [];
    let raf = 0;
    let running = false;
    let last = -1;

    const mk = () => {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        const ang = (i / NODE_COUNT) * 6.2832;
        const rad = Math.min(W, H) * 0.34;
        nodes.push({
          sx: Math.random() * W,
          sy: Math.random() * H,
          ex: W / 2 + rad * Math.cos(ang) * (0.55 + (i % 5) * 0.09),
          ey: H / 2 + rad * Math.sin(ang) * (0.55 + (i % 5) * 0.09),
          x: 0,
          y: 0,
        });
      }
    };

    const size = () => {
      const r = cv.getBoundingClientRect();
      W = cv.width = Math.round(r.width * DPR);
      H = cv.height = Math.round(r.height * DPR);
      cv.style.width = `${r.width}px`;
      cv.style.height = `${r.height}px`;
      mk();
    };

    const ease = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const draw = () => {
      if (!running) return;
      const r = sec.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight && W) {
        const p = Math.max(
          0,
          Math.min(1, -r.top / (r.height - window.innerHeight)),
        );
        const e = ease(p);
        for (const n of nodes) {
          n.x = n.sx + (n.ex - n.sx) * e;
          n.y = n.sy + (n.ey - n.sy) * e;
        }
        ctx.clearRect(0, 0, W, H);
        const ea = Math.max(0, (p - 0.2) / 0.8);
        const maxD = W * 0.23;
        if (ea > 0) {
          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const a = nodes[i];
              const b = nodes[j];
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const d = Math.sqrt(dx * dx + dy * dy);
              if (d < maxD) {
                ctx.strokeStyle = `rgba(143,176,129,${(
                  ea *
                  0.45 *
                  (1 - d / maxD)
                ).toFixed(3)})`;
                ctx.lineWidth = DPR;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            }
          }
        }
        for (const n of nodes) {
          ctx.fillStyle =
            p < 0.5
              ? `rgba(130,150,168,${(0.45 + p * 0.4).toFixed(2)})`
              : `rgba(143, 176, 129,${(0.55 + p * 0.35).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, (2.4 + p * 1.6) * DPR, 0, 6.2832);
          ctx.fill();
        }
        const st = p < 0.5 ? 0 : 1;
        if (st !== last) {
          last = st;
          setStage(st);
          if (hintRef.current) {
            hintRef.current.style.opacity = st === 0 ? "1" : "0";
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    // Only run the rAF loop while the band is on screen.
    const io = new IntersectionObserver((entries) => {
      const vis = entries.some((entry) => entry.isIntersecting);
      if (vis && !running) {
        running = true;
        if (!W) size();
        raf = requestAnimationFrame(draw);
      } else if (!vis && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(sec);

    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(size, 200);
    };
    window.addEventListener("resize", onResize);
    size();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      clearTimeout(rt);
      window.removeEventListener("resize", onResize);
    };
  }, [reduceMotion]);

  // Reduced motion: the resolved end state, static, at normal height.
  const state = STATES[reduceMotion ? 1 : stage];

  return (
    <section
      ref={sectionRef}
      id="ntlsn-litmus"
      aria-labelledby="ntlsn-litmus-heading"
      className={`relative w-full scroll-mt-20 ${
        reduceMotion ? "py-16" : "h-[200vh]"
      }`}
    >
      <div
        className={
          reduceMotion
            ? "flex items-center justify-center"
            : "sticky top-0 flex h-screen items-center justify-center overflow-hidden"
        }
      >
        {!reduceMotion && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          />
        )}
        <div className="relative z-[1] max-w-[680px] p-6 text-center">
          <div
            className="mb-[13px] text-[11px] font-extrabold tracking-[1.6px] uppercase transition-colors duration-[400ms]"
            style={{ color: state.eyebrowColour }}
          >
            {state.eyebrow}
          </div>
          <h2
            id="ntlsn-litmus-heading"
            className="mb-[15px] text-[clamp(28px,4.2vw,48px)] leading-[1.1] font-extrabold text-white"
          >
            {state.head}
          </h2>
          <p className="mx-auto max-w-[560px] text-[clamp(15px,1.8vw,18px)] leading-[1.55] text-[#bca98f]">
            {state.sub}
          </p>
          {!reduceMotion && (
            <div
              ref={hintRef}
              aria-hidden="true"
              className="mt-[22px] text-[12px] font-semibold text-[#6b7e90] transition-opacity duration-[400ms]"
            >
              Scroll ↓
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
