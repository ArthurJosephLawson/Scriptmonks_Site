"use client";

import * as React from "react";

const MAX_PULL = 6;

/**
 * Pointer "magnetic" pull for primary buttons (SPEC_V4 §4), capped at 6 px.
 * Sets `--mag-x` / `--mag-y` custom properties consumed by the `.magnetic`
 * class. Disabled for coarse pointers and under reduced motion.
 */
export function useMagnetic<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let reduced = false;
    let coarse = true;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      coarse = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    } catch {
      coarse = true;
    }
    if (reduced || coarse) return;

    function onMove(event: PointerEvent) {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const clamp = (value: number) =>
        Math.max(-MAX_PULL, Math.min(MAX_PULL, value / 4));
      element.style.setProperty("--mag-x", `${clamp(dx).toFixed(2)}px`);
      element.style.setProperty("--mag-y", `${clamp(dy).toFixed(2)}px`);
    }

    function reset() {
      if (!element) return;
      element.style.setProperty("--mag-x", "0px");
      element.style.setProperty("--mag-y", "0px");
    }

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", reset);
    element.addEventListener("blur", reset);
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", reset);
      element.removeEventListener("blur", reset);
    };
  }, []);

  return ref;
}
