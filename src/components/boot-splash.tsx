"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function BootSplash() {
  const [visible, setVisible] = useState(true);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("sm_boot_v1")) {
        // One-shot read of an external system (sessionStorage) at mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(false);
        return;
      }
      sessionStorage.setItem("sm_boot_v1", "1");
    } catch {}

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setVisible(false);
      return;
    }

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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#09181B] transition-opacity duration-100 ${hide ? "opacity-0" : "opacity-100"}`}
      aria-hidden
    >
      <Image src="/brand/logo-mark-coral.png" alt="" width={186} height={351} className="h-24 w-auto animate-fade-in" />
      <div className="mt-8 space-y-1 text-left font-mono text-xs text-muted-teal">
        <div className="opacity-90">&gt; booting scriptmønks...</div>
        <div className="opacity-90">&gt; loading modules [ OK ]</div>
        <div className="opacity-90">&gt; ready_</div>
      </div>
    </div>
  );
}
