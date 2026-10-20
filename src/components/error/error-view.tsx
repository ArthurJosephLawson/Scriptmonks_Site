"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";

export interface ErrorViewProps {
  /** HTTP status (or short code) shown as `[ 404 ] …`. */
  code: number | string;
  /** Sentence-case heading; rendered uppercase on the status line. */
  title: string;
  /** Plain-language explanation. */
  message: string;
  /** Primary recovery action (e.g. TRY AGAIN), rendered first. */
  primary?: ReactNode;
  /** Situation-specific action buttons, between GO HOME and EMAIL US. */
  actions?: ReactNode;
  /** Small `Reference: <id>` line (error digest, submission ref, …). */
  reference?: string;
  /** Development-only collapsible details. Never pass in production. */
  details?: string;
}

function mailtoHref(pathname: string, reference?: string): string {
  // Body contains only the page path and reference id — no personal data.
  const lines = [`Page: ${pathname}`];
  if (reference) lines.push(`Reference: ${reference}`);
  const subject = `Problem on ${pathname}`;
  return `mailto:${siteConfig.links.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

/**
 * Shared terminal-style error card (SPEC_V5 §2.1).
 * Always renders `[ GO HOME ]` and `[ EMAIL US ]`; situation actions pass
 * via `actions`. Never renders raw error text unless `details` is provided
 * (development only, supplied by `app/error.tsx`).
 */
export function ErrorView({
  code,
  title,
  message,
  primary,
  actions,
  reference,
  details,
}: ErrorViewProps) {
  const pathname = usePathname() ?? "/";

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-content flex-col items-start justify-center px-4 py-16 sm:px-6 md:py-24">
      <div className="w-full max-w-2xl border border-dark-border bg-dark-surface p-6 shadow-brutal-muted md:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-teal">
          {"// SYSTEM"}
        </p>
        <h1
          id="page-title"
          tabIndex={-1}
          className="mt-4 font-mono text-2xl uppercase tracking-widest sm:text-3xl md:text-4xl"
        >
          <span className="text-accent-coral">[ {code} ]</span>{" "}
          <span className="text-ink">{title}</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-teal">
          {message}
        </p>
        {reference ? (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-teal">
            Reference: {reference}
          </p>
        ) : null}
        {details ? (
          <details className="mt-4 border border-dark-border bg-dark-raised p-3">
            <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-muted-teal focus-visible:outline-none">
              [ DETAILS ]
            </summary>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all font-mono text-[11px] text-muted-teal">
              {details}
            </pre>
          </details>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {primary}
          <Button href="/">GO HOME</Button>
          {actions}
          <Button href={mailtoHref(pathname, reference)} variant="secondary">
            EMAIL US
          </Button>
        </div>
      </div>
    </main>
  );
}
