"use client";

import { useEffect, useState } from "react";

/**
 * Global offline banner (SPEC_V5 §2.1, "Offline" row).
 * Auto-hides when the browser comes back online. Form data stays in the
 * forms (draft/session state) — this banner never blocks input.
 */
export function OfflineBanner() {
  const [offline, setOffline] = useState(
    () => typeof navigator !== "undefined" && navigator.onLine === false,
  );

  useEffect(() => {
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-accent-coral bg-dark-surface px-4 py-3 text-center sm:px-6"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
        You&apos;re offline
      </p>
      <p className="mt-1 text-sm text-muted-teal">
        Check your connection. Your form data is kept.
      </p>
    </div>
  );
}
