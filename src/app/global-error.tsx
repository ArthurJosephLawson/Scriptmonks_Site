"use client"; // Error boundaries must be Client Components

/**
 * Root error boundary (SPEC_V5 §2.1, "500 (root)").
 * Renders its own <html>/<body> with minimal inline styles, because
 * global-error replaces the root layout and cannot load globals.css or any
 * stylesheet (Next.js docs). Inline hex values are the locked site tokens
 * from tailwind.config.ts (dark / dark-surface / dark-border / ink /
 * muted-teal / accent-coral) — no stylesheet is available here.
 */

const SITE = {
  dark: "#09181B",
  surface: "#0D2125",
  border: "#1D3B41",
  ink: "#E8F2F3",
  muted: "#6F9399",
  coral: "#FF7A65",
} as const;

function digestOf(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "digest" in error) {
    const { digest } = error as { digest?: unknown };
    if (typeof digest === "string") return digest;
  }
  return undefined;
}

export default function GlobalError({
  error,
}: {
  error: unknown;
  retry: () => void;
}) {
  const digest = digestOf(error);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: SITE.dark,
          color: SITE.ink,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <title>Something broke on our side</title>
        <main
          style={{
            maxWidth: "640px",
            width: "100%",
            border: `1px solid ${SITE.border}`,
            backgroundColor: SITE.surface,
            boxShadow: `4px 4px 0 0 ${SITE.coral}`,
            padding: "32px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: SITE.muted,
            }}
          >
            {"// SYSTEM"}
          </p>
          <h1
            style={{
              margin: "16px 0 0",
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: SITE.coral }}>[ 500 ]</span> Something broke
            on our side
          </h1>
          <p style={{ margin: "20px 0 0", fontSize: "14px", lineHeight: 1.6, color: SITE.muted }}>
            Sorry about that. It&apos;s not your fault. Please try again, and if
            it keeps happening, email us.
          </p>
          {digest ? (
            <p
              style={{
                margin: "16px 0 0",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: SITE.muted,
              }}
            >
              Reference: {digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            style={{
              marginTop: "24px",
              border: `1px solid ${SITE.coral}`,
              backgroundColor: SITE.coral,
              color: SITE.dark,
              fontFamily: "inherit",
              fontSize: "13px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            [ RELOAD ]
          </button>
        </main>
      </body>
    </html>
  );
}
