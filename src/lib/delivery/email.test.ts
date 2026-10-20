import { describe, expect, it } from "vitest";
import { buildOrderHtml, buildOrderSubject, escapeHtml } from "@/lib/delivery/email";
import { buildContactSubject } from "@/lib/delivery/contact-email";
import type { ProjectOrderPayload } from "@/types/order";

describe("brand subject builders", () => {
  it("order subject shows [ScriptMønks]", () => {
    expect(buildOrderSubject("SM-TEST01", "Title")).toBe(
      "[ScriptMønks] New order SM-TEST01: Title",
    );
  });

  it("contact subject shows [ScriptMønks]", () => {
    expect(buildContactSubject("General inquiry", "Ada")).toBe(
      "[ScriptMønks] General inquiry: Ada",
    );
  });
});

describe("escapeHtml", () => {
  it("escapes all HTML-special characters", () => {
    expect(escapeHtml(`<script>alert("x") & 'y'</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;) &amp; &#39;y&#39;&lt;/script&gt;",
    );
  });

  it("leaves safe text unchanged", () => {
    expect(escapeHtml("plain@email.test")).toBe("plain@email.test");
  });
});

function makePayload(contact: ProjectOrderPayload["contact"]): ProjectOrderPayload {
  return {
    scope: { projectType: "custom-software" },
    commercial: { budget: "250-1k", timeline: "2-4-weeks" },
    brief: { title: "Title", description: "x".repeat(60), references: [] },
    contact,
    meta: { startedAt: 1, honeypot: "", source: "web:/order" },
  };
}

describe("buildOrderHtml github row", () => {
  it("links to the github profile when present", () => {
    const html = buildOrderHtml(makePayload({ name: "Ada", email: "a@b.co", github: "ada" }), "SM-TEST01");
    expect(html).toContain('https://github.com/ada');
    expect(html).toContain(">ada</a>");
  });

  it("escapes the github username in the link", () => {
    const html = buildOrderHtml(
      makePayload({ name: "Ada", email: "a@b.co", github: '"><img src=x onerror=alert(1)>' }),
      "SM-TEST01",
    );
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });

  it("shows an em dash when github is empty", () => {
    const html = buildOrderHtml(makePayload({ name: "Ada", email: "a@b.co" }), "SM-TEST01");
    expect(html).toContain(">GitHub</td>");
    expect(html).toContain("vertical-align:top;\">—</td>");
    expect(html).not.toContain("github.com");
  });
});
