"use client";

import { useEffect, useState } from "react";

/**
 * Boot splash (SPEC_V4 §3.1 + §4 perf, SPEC_V3 §106).
 *
 * Behaviour required by SPEC_V3 §106: on the first page load of a browser
 * session (`sessionStorage` key `sm_boot_v1`) show the coral mark fading in
 * with the 3 mono lines for at most 1.4 s; any key or click skips it;
 * `prefers-reduced-motion` skips it entirely; storage access is wrapped in
 * try/catch.
 *
 * NON-COVERING VARIANT (owner decision, V5-5): the spec's "full-screen overlay"
 * made the splash the Largest Contentful Paint on the cold path, because an
 * opaque full-viewport layer hides the real hero content and becomes the
 * largest painted element — measured in V4-3 at 4.7–5.5 s LCP, giving
 * Performance 47–52 against a ≥90 target. This variant keeps every other
 * requirement identical but anchors the splash to a contained panel, so the
 * page underneath paints normally and the hero wins LCP.
 *
 * It is client-only and lazy-loaded, so it never enters the server render and
 * costs no image bytes: the mark is drawn with a CSS mask over the live accent
 * colour (no per-theme PNG).
 */
export function BootSplash() {
  const [visible, setVisible] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem("sm_boot_v1") === "1";
      sessionStorage.setItem("sm_boot_v1", "1");
    } catch {}
    if (alreadySeen) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot mount reveal
    setVisible(true);

    const t1 = setTimeout(() => setHide(true), 1400);
    const t2 = setTimeout(() => setVisible(false), 1500);
    const onKey = () => {
      clearTimeout(t1);
      clearTimeout(t2);
      setVisible(false);
    };
    window.addEventListener("keydown", onKey, { once: true });
    window.addEventListener("click", onKey, { once: true });
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onKey);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`pointer-events-none fixed bottom-6 left-6 z-[9999] hidden w-[min(20rem,calc(100vw-3rem))] border border-dark-border bg-[#09181B] p-4 shadow-brutal-muted transition-opacity duration-100 sm:block ${hide ? "opacity-0" : "opacity-100"}`}
      aria-hidden
      data-boot-splash
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="brand-mask block h-12 w-auto shrink-0 aspect-[186/351] animate-fade-in"
        />
        <div className="space-y-1 font-mono text-xs text-muted-teal">
          <div className="opacity-90">&gt; booting scriptmønks...</div>
          <div className="opacity-90">&gt; loading modules [ OK ]</div>
          <div className="opacity-90">&gt; ready_</div>
        </div>
      </div>
    </div>
  );
}
