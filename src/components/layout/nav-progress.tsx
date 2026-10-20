"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Navigation feedback bar (SPEC_V4 §4): 2 px accent bar at the top that starts
 * on an internal link click or programmatic navigation and finishes when the
 * pathname changes.
 */
export function NavProgress() {
  const pathname = usePathname();
  const [active, setActive] = React.useState(false);
  const reduced = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  // Internal link clicks start the bar.
  React.useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      const href = anchor.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return;
      if (href === pathname) return;
      setActive(true);
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [pathname]);

  // Programmatic navigation (command palette, terminal) starts the bar too.
  React.useEffect(() => {
    function onRouteStart() {
      setActive(true);
    }
    window.addEventListener("sm:route-start", onRouteStart);
    return () => window.removeEventListener("sm:route-start", onRouteStart);
  }, []);

  // Finish when the route settles.
  React.useEffect(() => {
    const id = setTimeout(() => setActive(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  // Safety net so the bar can never stay stuck.
  React.useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => setActive(false), 4000);
    return () => clearTimeout(id);
  }, [active]);

  if (reduced) return null;

  return (
    <div aria-hidden className="fixed left-0 top-0 z-[60] h-0.5 w-full">
      <div
        className="h-full bg-accent-coral transition-all duration-300 ease-out"
        style={{ width: active ? "80%" : "0%", opacity: active ? 1 : 0 }}
      />
    </div>
  );
}

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
