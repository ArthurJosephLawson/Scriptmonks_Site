"use client";

import { useEffect, useState } from "react";

/**
 * Development-only trigger for the segment error boundary (app/error.tsx).
 *
 * Constraints that shape the design:
 *  - A throw during the *server* render is caught by Next's built-in error
 *    document, not the segment boundary, so the page would never show
 *    app/error.tsx.
 *  - Client Components are still server-rendered for hydration, so an
 *    unconditional render throw would fire on the server too.
 *  - React error boundaries do not catch errors thrown in effects.
 *
 * The first render (server + hydration) stays inert; the effect flips the flag,
 * and the resulting re-render throws. Error boundaries do catch render errors,
 * so app/error.tsx takes over at that point.
 */
export function ForceErrorClient() {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberately arms the throw after hydration
    setArmed(true);
  }, []);

  if (armed) {
    throw new Error("Forced test error from the development-only test route.");
  }

  return null;
}
