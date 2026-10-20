"use client";

import { useState } from "react";

export function CommandBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-6 border border-dark-border bg-dark p-4">
      <p className="font-mono text-sm text-muted-teal">
        <span className="text-accent-coral">$</span> {command}
      </p>
      <button
        type="button"
        onClick={copy}
        className="mt-3 border border-dark-border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-ink transition hover:border-accent-coral hover:text-accent-coral"
      >
        {copied ? "[ COPIED ]" : "[ COPY ]"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Command copied to clipboard" : ""}
      </span>
    </div>
  );
}
