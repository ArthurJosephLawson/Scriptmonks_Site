import { describe, expect, it } from "vitest";
import { allProjects } from "@/data/portfolio";
import {
  STATUS_LABELS,
  WORK_FILTERS,
  clientLine,
  filterByKind,
  isWorkFilter,
  releaseLabel,
  suggestedType,
} from "@/lib/work";

describe("work filters", () => {
  it("has 5 filters: all, client, product, private, lab", () => {
    expect(WORK_FILTERS).toEqual(["all", "client", "product", "private", "lab"]);
  });

  it("filters each kind exactly", () => {
    expect(filterByKind(allProjects, "all")).toHaveLength(10);
    expect(filterByKind(allProjects, "client")).toHaveLength(4);
    expect(filterByKind(allProjects, "product")).toHaveLength(2);
    expect(filterByKind(allProjects, "private")).toHaveLength(1);
    expect(filterByKind(allProjects, "lab")).toHaveLength(3);
  });

  it("validates ?filter= values", () => {
    expect(isWorkFilter("client")).toBe(true);
    expect(isWorkFilter("products")).toBe(false);
    expect(isWorkFilter(undefined)).toBe(false);
  });
});

describe("status labels", () => {
  it("covers every status per 4.6", () => {
    expect(STATUS_LABELS).toEqual({
      delivered: "DELIVERED",
      released: "RELEASED",
      private: "PRIVATE · CLOSED SOURCE",
      prototype: "PROTOTYPE",
    });
  });
});

describe("suggestedType", () => {
  it("maps every known slug", () => {
    expect(suggestedType("wolf")).toBe("utility");
    expect(suggestedType("deploymonk")).toBe("cli");
    expect(suggestedType("lonewolf")).toBe("full-app");
    expect(suggestedType("shopledger")).toBe("full-app");
    expect(suggestedType("routesheet")).toBe("full-app");
    expect(suggestedType("streamdock")).toBe("custom-software");
    expect(suggestedType("booknook")).toBe("full-app");
    expect(suggestedType("pingpost")).toBe("utility");
    expect(suggestedType("envlint")).toBe("cli");
    expect(suggestedType("invoicemonk")).toBe("cli");
  });
});

describe("clientLine", () => {
  it("formats named clients with region", () => {
    const routesheet = allProjects.find((p) => p.slug === "routesheet");
    expect(routesheet && clientLine(routesheet)).toContain("CLIENT:");
  });

  it("hides anonymous client names", () => {
    const streamdock = allProjects.find((p) => p.slug === "streamdock");
    expect(streamdock && clientLine(streamdock)).toBe("CLIENT: Confidential");
  });

  it("returns empty for non-client entries", () => {
    const wolf = allProjects.find((p) => p.slug === "wolf");
    expect(wolf && clientLine(wolf)).toBe("");
  });
});

describe("releaseLabel", () => {
  it("extracts the tag from a tag URL", () => {
    expect(releaseLabel("https://github.com/ArthurJosephLawson/Wolf/releases/tag/v0.4.0")).toBe(
      "[ RELEASE v0.4.0 ]",
    );
  });

  it("labels a version-free releases page generically", () => {
    expect(releaseLabel("https://github.com/ArthurJosephLawson/Wolf/releases")).toBe(
      "[ LATEST RELEASE ]",
    );
  });
});
