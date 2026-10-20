"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Accessibility (SPEC_V4 §4): after a route change, move focus to the page
 * `<h1>` (falling back to `#page-title` then `<main>`), unless focus is already
 * inside an interactive overlay such as a dialog or the command palette.
 */
export function FocusOnRouteChange() {
  const pathname = usePathname();
  const firstRender = React.useRef(true);

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const active = document.activeElement as HTMLElement | null;
      if (active && active !== document.body) {
        const role = active.getAttribute("role");
        const inOverlay = active.closest('[role="dialog"], [role="listbox"], [role="menu"]');
        if (role === "dialog" || inOverlay) return;
      }

      const target =
        document.querySelector<HTMLElement>("#page-title") ??
        document.querySelector<HTMLElement>("main h1") ??
        document.querySelector<HTMLElement>("main");
      if (!target) return;
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }, 180);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
