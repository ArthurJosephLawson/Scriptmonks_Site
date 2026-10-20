"use client";

import * as React from "react";

function getReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ScrollProgress() {
  const [progress, setProgress] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const id = setTimeout(() => setReduced(getReduced()), 0);
    function update() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      setProgress(p);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      clearTimeout(id);
      window.removeEventListener("scroll", update);
    };
  }, []);

  if (reduced) return null;
  return (
    <div className="fixed left-0 top-0 z-50 h-0.5 w-full">
      <div
        className="h-full bg-accent-coral transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
