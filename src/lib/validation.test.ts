import { describe, expect, it } from "vitest";
import { orderPayloadSchema, stepContactSchema } from "@/lib/validation";

const base = {
  scope: { projectType: "custom-software" as const },
  commercial: { budget: "250-1k" as const, timeline: "2-4-weeks" as const },
  brief: {
    title: "  My Project  ",
    description: "x".repeat(60),
    references: ["https://a.dev", "", "https://b.dev"],
  },
  contact: {
    name: "  Ada  ",
    email: "  ADA@Example.COM ",
    github: "@Ada-Lovelace",
    company: "",
  },
  meta: { startedAt: 1_700_000_000_000, honeypot: "", source: "web:/order" },
};

describe("orderPayloadSchema normalization", () => {
  it("trims title and name, lowercases email, strips @ from github, drops empty refs/company", () => {
    const parsed = orderPayloadSchema.parse(base);
    expect(parsed.brief.title).toBe("My Project");
    expect(parsed.contact.name).toBe("Ada");
    expect(parsed.contact.email).toBe("ada@example.com");
    expect(parsed.contact.github).toBe("Ada-Lovelace");
    expect(parsed.brief.references).toEqual(["https://a.dev", "https://b.dev"]);
    expect(parsed.contact.company).toBeUndefined();
  });

  it("output re-validates (round trip)", () => {
    const parsed = orderPayloadSchema.parse(base);
    expect(orderPayloadSchema.safeParse(parsed).success).toBe(true);
  });

  it("accepts absent github", () => {
    const contact: { name: string; email: string; company: string } = {
      name: base.contact.name,
      email: base.contact.email,
      company: base.contact.company,
    };
    const result = orderPayloadSchema.safeParse({ ...base, contact });
    expect(result.success).toBe(true);
  });
});

describe("githubUser normalizer", () => {
  it("accepts valid usernames with and without leading @", () => {
    expect(stepContactSchema.safeParse({ ...base.contact, github: "octocat" }).success).toBe(true);
    expect(stepContactSchema.safeParse({ ...base.contact, github: "@octocat" }).success).toBe(true);
    expect(stepContactSchema.safeParse({ ...base.contact, github: "ada-lovelace" }).success).toBe(true);
    expect(stepContactSchema.safeParse({ ...base.contact, github: "" }).success).toBe(true);
  });

  it("rejects invalid usernames", () => {
    expect(stepContactSchema.safeParse({ ...base.contact, github: "has space" }).success).toBe(false);
    expect(stepContactSchema.safeParse({ ...base.contact, github: "ada-" }).success).toBe(false);
    expect(stepContactSchema.safeParse({ ...base.contact, github: "-ada" }).success).toBe(false);
    expect(stepContactSchema.safeParse({ ...base.contact, github: "a".repeat(40) }).success).toBe(false);
    expect(
      stepContactSchema.safeParse({ ...base.contact, github: "double--hyphen" }).success,
    ).toBe(false);
  });
});
