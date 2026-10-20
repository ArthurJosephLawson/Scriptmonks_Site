"use client";

export function ScrollTopButton() {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0 })}
      className="font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral"
    >
      [ ↑ TOP ]
    </button>
  );
}
