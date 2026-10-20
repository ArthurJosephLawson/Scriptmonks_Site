"use client";

import * as React from "react";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === "string") {
        setMessage(detail);
      }
    }
    window.addEventListener("sm:toast", onToast as EventListener);
    return () => window.removeEventListener("sm:toast", onToast as EventListener);
  }, []);

  React.useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 2000);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <>
      {children}
      {message ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-dark-border bg-dark-surface px-4 py-2 font-mono text-xs text-ink shadow-brutal"
        >
          {message}
        </div>
      ) : null}
    </>
  );
}
