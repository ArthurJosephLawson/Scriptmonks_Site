import { describe, expect, it } from "vitest";
import { allProjects, filterProjects, projects } from "@/data/portfolio";
import { siteConfig } from "@/data/site";

describe("portfolio data", () => {
  it("has exactly 10 entries: 3 real, 7 placeholders", () => {
    expect(allProjects).toHaveLength(10);
    expect(allProjects.filter((p) => !p.isPlaceholder)).toHaveLength(3);
    expect(allProjects.filter((p) => p.isPlaceholder)).toHaveLength(7);
  });

  it("has 4 client entries, all placeholders", () => {
    const clients = allProjects.filter((p) => p.kind === "client");
    expect(clients).toHaveLength(4);
    expect(clients.every((p) => p.isPlaceholder && p.status === "delivered")).toBe(true);
  });

  it("filters placeholders off when the switch is false", () => {
    const filtered = filterProjects(allProjects, false);
    expect(filtered).toHaveLength(3);
    expect(filtered.every((p) => !p.isPlaceholder)).toBe(true);
  });

  it("keeps every entry when the switch is true", () => {
    expect(filterProjects(allProjects, true)).toHaveLength(10);
  });

  it("matches NEXT_PUBLIC_SHOW_PLACEHOLDER_PROJECTS", () => {
    const expected =
      process.env.NEXT_PUBLIC_SHOW_PLACEHOLDER_PROJECTS === "true" ? 10 : 3;
    expect(projects).toHaveLength(expected);
  });

  it("ships exact Wolf and DeployMonk links", () => {
    const wolf = allProjects.find((p) => p.slug === "wolf");
    expect(wolf?.links).toEqual({
      repo: "https://github.com/ArthurJosephLawson/Wolf",
      release: "https://github.com/ArthurJosephLawson/Wolf/releases/tag/v0.4.0",
    });
    const deploymonk = allProjects.find((p) => p.slug === "deploymonk");
    expect(deploymonk?.links?.npm).toBe("https://www.npmjs.com/package/deploymonk");
    expect(deploymonk?.install).toBe("npm install -g deploymonk");
  });

  it("keeps LONEWOLF closed: no links, lonewolf gallery", () => {
    const lonewolf = allProjects.find((p) => p.slug === "lonewolf");
    expect(lonewolf?.links).toBeUndefined();
    expect(lonewolf?.gallery).toBe("lonewolf");
    expect(lonewolf?.status).toBe("private");
    expect(lonewolf?.year).toBe("TODO(OWNER)");
  });

  it("validates entry shape: tagline <= 80 chars, 3-6 highlights, non-empty stack", () => {
    for (const p of allProjects) {
      expect(p.tagline.length, p.slug).toBeLessThanOrEqual(80);
      expect(p.highlights.length, p.slug).toBeGreaterThanOrEqual(3);
      expect(p.highlights.length, p.slug).toBeLessThanOrEqual(6);
      expect(p.stack.length, p.slug).toBeGreaterThan(0);
      expect(p.summary.length, p.slug).toBeGreaterThan(0);
    }
  });

  it("uses 2026 for lab entries with no links", () => {
    const labs = allProjects.filter((p) => p.kind === "lab");
    expect(labs).toHaveLength(3);
    for (const lab of labs) {
      expect(lab.year).toBe("2026");
      expect(lab.links).toBeUndefined();
      expect(lab.status).toBe("prototype");
      expect(lab.isPlaceholder).toBe(true);
    }
  });

  it("has no forbidden marketing claims in entries", () => {
    const banned = /\b(revenue|profit|testimonial|rated)\b|client said|⭐/i;
    for (const p of allProjects) {
      const text = [p.tagline, p.summary, ...p.highlights].join(" ");
      expect(banned.test(text), p.slug).toBe(false);
    }
  });
});

describe("site config", () => {
  it("reports 4 delivered clients per section 2.1", () => {
    expect(siteConfig.deliveredClientCount).toBe(4);
  });

  it("has the 6-stage lifecycle and 4 principles", () => {
    expect(siteConfig.lifecycle).toHaveLength(6);
    expect(siteConfig.principles).toHaveLength(4);
  });

  it("founder matches section 2.1", () => {
    expect(siteConfig.founder).toEqual({
      name: "Arthur Joseph Lawson",
      alias: "Monk_Mango",
      role: "Founder & Lead Developer",
    });
  });
});
