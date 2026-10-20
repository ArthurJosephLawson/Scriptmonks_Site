"use client";

import { useEffect, useState } from "react";

/**
 * Boot splash (SPEC_V4 §3.1 + §4 perf). Decorative, client-only, and never an
 * LCP candidate: the mark is drawn with a CSS mask over the live accent colour
 * (no per-theme PNG, no `<img>`), so it cannot be reported as the largest
 * contentful paint and costs no image bytes on first load.
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
      className={`pointer-events-none fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#09181B] transition-opacity duration-100 ${hide ? "opacity-0" : "opacity-100"}`}
      aria-hidden
    >
      <span
        aria-hidden
        className="brand-mask block h-24 w-auto aspect-[186/351] animate-fade-in"
      />
      <div className="mt-8 space-y-1 text-left font-mono text-xs text-muted-teal">
        <div className="opacity-90">&gt; booting scriptmønks...</div>
        <div className="opacity-90">&gt; loading modules [ OK ]</div>
        <div className="opacity-90">&gt; ready_</div>
      </div>
    </div>
  );
}
