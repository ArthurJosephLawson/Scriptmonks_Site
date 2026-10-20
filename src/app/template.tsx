import type { ReactNode } from "react";

/**
 * Route transition (SPEC_V4 §4): a 180 ms fade plus 8 px upward slide applied
 * by CSS only (transform/opacity), disabled under reduced motion. Re-mounted by
 * the App Router on every navigation, so the animation replays per route.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
