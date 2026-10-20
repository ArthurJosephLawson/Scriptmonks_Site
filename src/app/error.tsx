"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { ErrorView } from "@/components/error/error-view";
import { Button } from "@/components/ui/button";

function digestOf(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "digest" in error) {
    const { digest } = error as { digest?: unknown };
    if (typeof digest === "string") return digest;
  }
  return undefined;
}

/**
 * Segment error boundary (SPEC_V5 §2.1, "500 (segment)").
 * Next.js 16 passes `retry` (the documented replacement for `reset`) — the
 * [ TRY AGAIN ] action calls it. Never renders `error.message` outside
 * development; production shows only the digest as `Reference:`.
 */
export default function SegmentError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const digest = digestOf(error);
  const details =
    process.env.NODE_ENV === "development" && error instanceof Error
      ? error.message
      : undefined;

  useEffect(() => {
    // Digest + route only — no request bodies or personal data.
    console.error(
      `[segment-error] ${window.location.pathname} digest=${digest ?? "unknown"}`,
    );
  }, [digest]);

  return (
    <ErrorView
      code={500}
      title="Something broke on our side"
      message="Sorry about that. It's not your fault. Please try again, and if it keeps happening, email us."
      reference={digest}
      details={details}
      primary={<Button onClick={retry}>TRY AGAIN</Button>}
    />
  );
}
