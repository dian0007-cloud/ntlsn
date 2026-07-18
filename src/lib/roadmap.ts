/**
 * Roadmap data for #ntlsn-coming2027 / #ntlsn-coming2028 (Epic 1.2 PR-E).
 *
 * Production built these sections in two layers: ntlsn-comingblocks-script
 * created both sections with a plain header + feature-card grid, then
 * ntlsn-coming2027-script / ntlsn-coming2028-script replaced each header
 * with the richer "road ahead" milestone band (the 2027 one live-fetching
 * /data/universities.json + /data/events.json for its counts). This module
 * is the merged end state: the enriched headers with counts derived from
 * the data imports (per the PR-E brief), and the card grids verbatim.
 */
import { eventCount, universityCount } from "../data";

export interface RoadmapCard {
  title: string;
  desc: string;
  /** "Try it now" target — the feature already works as a free tool. */
  href?: string;
}

export interface RoadmapChip {
  text: string;
  /** "accent" renders in the block colour; "teal" in #2DD4BF; rest neutral. */
  tone: "accent" | "teal" | "neutral";
}

export interface RoadmapBlock {
  id: "ntlsn-coming2027" | "ntlsn-coming2028";
  year: "2027" | "2028";
  /** rgb triplet string, e.g. "255,180,72" (amber 2027 / blue 2028). */
  colour: string;
  eyebrow: string;
  heading: string;
  lede: string;
  /** Bold lead-in inside the lede ("43 institutions" in the 2027 band). */
  ledeBold?: string;
  ledeRest?: string;
  chips: readonly RoadmapChip[];
  cards: readonly RoadmapCard[];
}

export const ROADMAP_2027: RoadmapBlock = {
  id: "ntlsn-coming2027",
  year: "2027",
  colour: "255,180,72",
  eyebrow: "The road ahead · 2027",
  heading: "From a directory to infrastructure you can convene on.",
  lede: "Today NTLSN is live, free and open-source — ",
  ledeBold: `${universityCount} institutions`,
  ledeRest: ` mapped and ${eventCount} verified events on the 2026 calendar (as of July 2026), all readable through a CORS-open data API. The 2027 phase turns a navigator into something you can run things on. Several of the pieces below already work as free tools you can try now; the institutional versions are what we are building toward, and they need a backend and partner cooperation.`,
  chips: [
    { text: `${universityCount} institutions mapped`, tone: "teal" },
    { text: "Free · open-source · live", tone: "neutral" },
    { text: "Open data API (CORS)", tone: "neutral" },
    {
      text: "Building toward 2027 · some features already live",
      tone: "accent",
    },
  ],
  cards: [
    {
      title: "Symposium & abstract engine",
      desc: "Run your own conference — registration, abstracts and programme.",
      href: "symposium-streaming.html",
    },
    {
      title: "Peer-Review Exchange",
      desc: "Review one, get one reviewed — a national registry across institutions.",
      href: "peer-review-exchange.html",
    },
    {
      title: "Pair Review",
      desc: "A focused, two-person developmental review of teaching.",
      href: "peer-observation.html",
    },
    {
      title: "Calibration Suite",
      desc: "Shared rubrics and cross-marker moderation across the sector.",
      href: "calibration-suite.html",
    },
    {
      title: "Curriculum Auditor",
      desc: "Map programme → course → unit outcomes, TELAS-aligned.",
      href: "programme-map.html",
    },
    {
      title: "Ecosystem APIs & LMS",
      desc: "LTI 1.3 for Moodle, Canvas, Blackboard and D2L, plus an open API.",
      href: "developers.html",
    },
    {
      title: "Single sign-on (AAF)",
      desc: "National sign-on via the Australian Access Federation.",
    },
  ],
};

export const ROADMAP_2028: RoadmapBlock = {
  id: "ntlsn-coming2028",
  year: "2028",
  colour: "124,156,255",
  eyebrow: "The road ahead · 2028",
  heading:
    "Portable recognition, and the connective tissue between institutions.",
  lede: "The further-out build sits on the 2027 foundations: making teaching work count wherever an educator goes, and wiring institutions together on open standards so any system can read the commons. Several pieces are live to try now; the sector-wide versions are still in design — and we will only claim them as they land.",
  chips: [
    { text: "Vision for 2028 · in design", tone: "accent" },
    { text: "Open standards · no lock-in", tone: "neutral" },
  ],
  cards: [
    {
      title: "Teaching Recognition Passport",
      // Production hardcoded "all 42 universities"; the count derives from
      // data here (Hero.tsx convention — data/universities.json canonical).
      desc: `A portable record of your teaching across all ${universityCount} universities, via My eQuals.`,
      href: "trp.html",
    },
    {
      title: "National recognition framework",
      desc: "Sector-wide recognition — awards, citations and certification.",
      href: "recognition-framework.html",
    },
    {
      title: "Students-as-Partners Registry",
      desc: "Put your student-partnership work on the national map.",
      href: "student-partnership.html",
    },
    {
      title: "CRM & student-system integration",
      desc: "Connect PeopleSoft, CourseLoop and the wider stack.",
    },
    {
      title: "WCAG 2.1 AA / VPAT",
      desc: "Accessibility conformance for procurement.",
    },
    {
      title: "Sector interoperability (MCP)",
      desc: "An open machine interface so other systems can read the commons.",
    },
    {
      title: "AI-assisted alignment",
      desc: "Optional, model-agnostic curriculum suggestions — you decide.",
    },
  ],
};
