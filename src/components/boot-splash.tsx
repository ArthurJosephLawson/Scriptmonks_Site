"use client";

import { useEffect, useState } from "react";

const BOOT_KEY = "sm_boot_v1";

/**
 * Boot splash (SPEC_V4 §3.1 + §4 perf, SPEC_V3 §106).
 * Appears once per browser session, lasts at most 1.4 s, fades out, then unmounts.
 * Skippable by any key or click, skipped under prefers-reduced-motion.
 */
export function BootSplash() {
  const [visible, setVisible] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(BOOT_KEY) === "1";
      sessionStorage.setItem(BOOT_KEY, "1");
    } catch {}
    if (alreadySeen) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot mount reveal
    setVisible(true);

    const t1 = setTimeout(() => setHide(true), 1400);
    const t2 = setTimeout(() => {
      setHide(true);
      setVisible(false);
    }, 1500);
    const dismiss = () => {
      clearTimeout(t1);
      clearTimeout(t2);
      setHide(true);
      setVisible(false);
    };
    const onKey = () => dismiss();
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
