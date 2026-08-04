import {
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
  type TransitionEvent,
} from "react";
import { flushSync } from "react-dom";
import { readCfoldState, writeCfoldState } from "../lib/cfoldState";

/**
 * useCfold — the shared disclosure engine behind CollapsibleSection and
 * CollapsibleGroup (Collapse v2). One implementation so the two components
 * can never drift: APG button+region disclosure, grid-row collapse animation,
 * hash deep-link auto-open, localStorage persistence, and find-in-page
 * (hidden="until-found" / beforematch) reveal.
 *
 * State precedence (resolved in the useState INITIALIZER, deliberately not
 * in effects, so there is no post-paint pop and no effect-ordering race):
 *   1. hash deep-link targeting an id in `ids` → open (and NOT persisted);
 *   2. stored user choice (lib/cfoldState) → restored;
 *   3. defaultOpen.
 * Persistence writes happen ONLY in toggle() — an effect watching `open`
 * could not distinguish user toggles from hash/beforematch opens.
 *
 * Find-in-page reveal — two branches, feature-detected once:
 *
 * SUPPORTED ("onbeforematch" in document.body — Chromium/Edge): the closed
 * panel drops `inert` and instead marks the panel inner with
 * hidden="until-found". The UA style for until-found is
 * content-visibility:hidden, which already removes the contents from
 * rendering, the focus order and the accessibility tree — so focus
 * containment is preserved without inert (inert would defeat the whole
 * feature: the HTML spec has UAs ignore inert subtrees for find-in-page).
 * Both the attribute and the beforematch listener are managed IMPERATIVELY
 * via a ref: React 19 coerces hidden="until-found" to boolean hidden=""
 * (display:none — silently killing the feature) and has no onBeforeMatch
 * prop. On beforematch we run the same instant-open path as a hash
 * deep-link, flushed synchronously (flushSync) so the panel is at full
 * height BEFORE the UA computes its scroll-to-match target; with nested
 * layers (fold inside group) the UA fires beforematch on every until-found
 * ancestor and each layer flushes itself the same way. The attribute is
 * (re)applied ~500ms after closing — matching the settle fallback — so the
 * closing animation still shows content instead of a blank collapsing box;
 * during that window the content is still tabbable, exactly like today's
 * mid-animation close.
 *
 * UNSUPPORTED (Safari/Firefox): keep `inert` on the closed panel exactly as
 * before, and NEVER set hidden="until-found" — unknown hidden values
 * collapse to boolean hidden (display:none) there, which would change
 * closed-state semantics (scrollIntoView no-ops, different AT tree).
 */

let untilFoundSupport: boolean | undefined;
function supportsUntilFound(): boolean {
  if (untilFoundSupport === undefined) {
    untilFoundSupport =
      typeof document !== "undefined" &&
      document.body != null &&
      "onbeforematch" in document.body;
  }
  return untilFoundSupport;
}

export interface CfoldApi {
  open: boolean;
  buttonId: string;
  panelId: string;
  /** Attach to the panel inner (the element wrapping the searchable text). */
  innerRef: RefObject<HTMLDivElement | null>;
  /** Boolean `inert` for the panel — false on until-found browsers. */
  inertClosed: boolean;
  /** Panel className, cfold-* classes included. */
  panelClass: string;
  toggle: () => void;
  onTransitionEnd: (e: TransitionEvent<HTMLDivElement>) => void;
}

export default function useCfold({
  ids,
  defaultOpen = false,
  storageKey,
}: {
  /** Canonical section id(s) wrapped inside — hash targets that auto-open. */
  ids: readonly string[];
  defaultOpen?: boolean;
  /**
   * Persistence key. Defaults to ids[0] (single-id folds). Groups MUST pass
   * a namespaced key ("g:<first-id>") — see lib/cfoldState.ts.
   */
  storageKey?: string;
}): CfoldApi {
  const storageId = storageKey ?? ids[0];

  // Initial state — hash > stored > defaultOpen, all resolved before the
  // first commit (see the hook comment; never a post-mount setState).
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const target = window.location.hash.slice(1);
      if (target && ids.includes(target)) return true;
    }
    return readCfoldState(storageId) ?? defaultOpen;
  });
  // Overflow can only go visible once the opening transition has settled.
  // A panel that MOUNTS open never transitions, so it starts settled.
  const [settled, setSettled] = useState(open);
  // Instant (transition-less) open — hash deep-links and beforematch.
  const [instant, setInstant] = useState(false);
  const openRef = useRef(open);
  openRef.current = open;
  const innerRef = useRef<HTMLDivElement | null>(null);

  const uid = useId();
  const buttonId = `cfold-btn-${uid}`;
  const panelId = `cfold-panel-${uid}`;

  // Hash deep-link → auto-open + re-anchor (initial load and hashchange).
  // Deliberately does NOT write storage.
  useEffect(() => {
    const onHash = () => {
      const target = window.location.hash.slice(1);
      if (!target || !ids.includes(target)) return;
      setInstant(true);
      setOpen(true);
      setSettled(true);
      // Two frames: let the panel lay out at full height, then anchor.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setInstant(false);
          document
            .getElementById(target)
            ?.scrollIntoView({ behavior: "auto", block: "start" });
        });
      });
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [ids]);

  // Find-in-page branch A: manage hidden="until-found" imperatively (React
  // would coerce it to boolean hidden — see hook comment). Applied ~500ms
  // after closing so the close animation still shows content.
  useEffect(() => {
    if (!supportsUntilFound()) return;
    const inner = innerRef.current;
    if (!inner) return;
    if (open) {
      inner.removeAttribute("hidden");
      return;
    }
    const t = setTimeout(() => {
      if (!openRef.current)
        innerRef.current?.setAttribute("hidden", "until-found");
    }, 500);
    return () => clearTimeout(t);
  }, [open]);

  // Find-in-page branch A: beforematch → the hash instant-open path, flushed
  // synchronously so the panel is at full height before the UA scrolls to
  // the match (it fires beforematch, then scrolls, in one algorithm).
  useEffect(() => {
    if (!supportsUntilFound()) return;
    const inner = innerRef.current;
    if (!inner) return;
    const reveal = () => {
      // The UA removes the attribute itself right after dispatch; mirror it
      // so a synthetic dispatch (tests) behaves identically.
      inner.removeAttribute("hidden");
      flushSync(() => {
        setInstant(true);
        setOpen(true);
        setSettled(true);
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setInstant(false));
      });
    };
    inner.addEventListener("beforematch", reveal);
    return () => inner.removeEventListener("beforematch", reveal);
  }, []);

  // Fallback for a missed transitionend (e.g. reduced motion's instant
  // transition can slip a frame): settle shortly after opening regardless.
  useEffect(() => {
    if (!open || settled) return;
    const t = setTimeout(() => {
      if (openRef.current) setSettled(true);
    }, 500);
    return () => clearTimeout(t);
  }, [open, settled]);

  // The ONLY code path that persists — explicit user toggles.
  const toggle = () => {
    const next = !open;
    writeCfoldState(storageId, next);
    if (next) {
      setOpen(true);
    } else {
      // Overflow must be hidden again BEFORE the closing animation starts.
      setSettled(false);
      setOpen(false);
    }
  };

  const onTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    // Guard: transitions from NESTED panels (a fold inside a group) bubble —
    // only this panel's own grid-row transition may settle it.
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "grid-template-rows") return;
    if (openRef.current) setSettled(true);
  };

  return {
    open,
    buttonId,
    panelId,
    innerRef,
    // Find-in-page branch B (no beforematch support): closed panels keep
    // `inert` exactly as before Collapse v2.
    inertClosed: !open && !supportsUntilFound(),
    panelClass: `cfold-panel${open ? " cfold-open" : ""}${
      instant ? " cfold-instant" : ""
    }${settled ? " cfold-settled" : ""}`,
    toggle,
    onTransitionEnd,
  };
}
