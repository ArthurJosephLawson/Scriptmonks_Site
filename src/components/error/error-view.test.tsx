import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ErrorView, type ErrorViewProps } from "@/components/error/error-view";
import { Button } from "@/components/ui/button";
import { ERROR_MESSAGES } from "@/lib/errors";

// Fixed path so the mailto body assertions are deterministic.
vi.mock("next/navigation", () => ({
  usePathname: () => "/mock-path",
}));

// next/link renders a plain anchor here; the Link router is not available
// (or needed) in the node test environment.
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children?: ReactNode;
  } & Record<string, unknown>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

function render(props: ErrorViewProps): string {
  return renderToStaticMarkup(<ErrorView {...props} />);
}

/** Extract the mailto href, undoing HTML entity escaping, fully decoded. */
function mailtoOf(html: string): string {
  const match = /mailto:[^"]*/.exec(html);
  expect(match).not.toBeNull();
  return decodeURIComponent((match?.[0] ?? "").replaceAll("&amp;", "&"));
}

describe("ErrorView", () => {
  it("404 variant: exact copy and table actions", () => {
    const html = render({
      code: 404,
      title: "Page not found",
      message: "We couldn't find that page. It may have moved, or the link may be wrong.",
      actions: (
        <>
          <Button href="/work" variant="secondary">
            VIEW WORK
          </Button>
          <Button href="/contact" variant="secondary">
            CONTACT US
          </Button>
        </>
      ),
    });
    expect(html).toContain("[ 404 ]");
    expect(html).toContain("Page not found");
    expect(html).toContain(
      "We couldn&#x27;t find that page. It may have moved, or the link may be wrong.",
    );
    expect(html).toContain("[ GO HOME ]");
    expect(html).toContain("VIEW WORK");
    expect(html).toContain("CONTACT US");
    expect(html).toContain("[ EMAIL US ]");
    const mailto = mailtoOf(html);
    expect(mailto).toContain("mailto:script.monks.mail@gmail.com");
    expect(mailto).toContain("subject=Problem on /mock-path");
    expect(mailto.split("&body=")[1]).toBe("Page: /mock-path");
  });

  it("500 (segment) variant: TRY AGAIN first, reference, dev details", () => {
    const html = render({
      code: 500,
      title: "Something broke on our side",
      message: ERROR_MESSAGES.SERVER,
      reference: "digest-abc123",
      details: "TypeError: boom at page.tsx",
      primary: <Button onClick={() => undefined}>TRY AGAIN</Button>,
    });
    expect(html).toContain("[ 500 ]");
    expect(html).toContain("Something broke on our side");
    expect(html).toContain("Reference: digest-abc123");
    expect(html).toContain("[ DETAILS ]");
    expect(html).toContain("TypeError: boom at page.tsx");
    expect(html).toContain("[ TRY AGAIN ]");
    expect(html).toContain("[ GO HOME ]");
    expect(html).toContain("[ EMAIL US ]");
    // Mailto body includes only the path and the reference id.
    expect(mailtoOf(html).split("&body=")[1]).toBe(
      "Page: /mock-path\nReference: digest-abc123",
    );
    // Primary action renders before GO HOME (spec table order).
    expect(html.indexOf("[ TRY AGAIN ]")).toBeLessThan(html.indexOf("[ GO HOME ]"));
  });

  it("never renders raw details without an explicit details prop", () => {
    const html = render({
      code: 404,
      title: "Page not found",
      message: "We couldn't find that page. It may have moved, or the link may be wrong.",
    });
    expect(html).not.toContain("[ DETAILS ]");
    expect(html).not.toContain("stack");
    expect(html).not.toContain("Error:");
  });

  it("403 variant: exact copy", () => {
    const html = render({
      code: 403,
      title: "Access denied",
      message: "You don't have permission to view this page.",
    });
    expect(html).toContain("[ 403 ]");
    expect(html).toContain("Access denied");
    expect(html).toContain("You don&#x27;t have permission to view this page.");
    expect(html).toContain("[ GO HOME ]");
    expect(html).toContain("[ EMAIL US ]");
  });

  it("429 variant: exact copy", () => {
    const html = render({
      code: 429,
      title: "Too many requests",
      message: "You're going a little fast. Please wait a moment and try again.",
    });
    expect(html).toContain("[ 429 ]");
    expect(html).toContain("Too many requests");
    expect(html).toContain(
      "You&#x27;re going a little fast. Please wait a moment and try again.",
    );
    expect(html).toContain("[ GO HOME ]");
  });

  it("503 variant: exact copy", () => {
    const html = render({
      code: 503,
      title: "Temporarily unavailable",
      message: "This part of the site is paused right now. Please try again later.",
    });
    expect(html).toContain("[ 503 ]");
    expect(html).toContain("Temporarily unavailable");
    expect(html).toContain(
      "This part of the site is paused right now. Please try again later.",
    );
    expect(html).toContain("[ GO HOME ]");
    expect(html).toContain("[ EMAIL US ]");
  });

  it("mailto body never contains personal data", () => {
    const html = render({
      code: 404,
      title: "Page not found",
      message: "We couldn't find that page. It may have moved, or the link may be wrong.",
      reference: "SM-CABC123",
    });
    const body = mailtoOf(html).split("&body=")[1] ?? "";
    // Only page path and reference id in the body — no email, name, or IP.
    expect(body).toContain("Page: /mock-path");
    expect(body).toContain("Reference: SM-CABC123");
    expect(body.includes("\n")).toBe(true);
    expect(body).not.toMatch(/@/);
    expect(body).not.toMatch(/\bAda\b|\bname\b/i);
  });
});
