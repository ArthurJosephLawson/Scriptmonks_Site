import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ForceErrorClient } from "./force-error-client";

/**
 * Development-only test route for the V5-2 e2e check: triggers a client-side
 * throw so the segment error boundary (app/error.tsx) renders. Disabled (404)
 * whenever NODE_ENV is production.
 *
 * A server-side throw would be caught by Next's built-in error document rather
 * than the segment boundary, which is why the throw lives in a client
 * component (see force-error-client.tsx).
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Test error route",
  robots: { index: false, follow: false },
};

export default function ForceErrorPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ForceErrorClient />;
}
