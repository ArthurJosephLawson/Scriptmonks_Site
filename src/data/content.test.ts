import { describe, expect, it } from "vitest";
import { FAQ_ITEMS } from "@/data/faq";
import { PROCESS_STAGES } from "@/data/process";
import { siteConfig } from "@/data/site";

describe("process data", () => {
  it("has 6 numbered stages per the section 4.8 table", () => {
    expect(PROCESS_STAGES).toHaveLength(6);
    expect(PROCESS_STAGES.map((s) => s.number)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
    ]);
    expect(PROCESS_STAGES.map((s) => s.title)).toEqual([
      "Lead Qualification",
      "Scope Proposal (SOW)",
      "Onboarding",
      "Sprint Execution",
      "Review / Staging",
      "Final Transfer",
    ]);
    expect(siteConfig.lifecycle).toHaveLength(6);
  });

  it("gives every stage exactly one descriptive sentence", () => {
    for (const stage of PROCESS_STAGES) {
      expect(stage.description.split(/\.\s|\.$/).filter(Boolean)).toHaveLength(1);
    }
  });

  it("invents no timeframes or prices", () => {
    const text = PROCESS_STAGES.map((s) => `${s.title} ${s.description}`).join(" ");
    expect(text).not.toMatch(/\b(weeks?|months?|hours?|days?|\$\d)\b|per hour/i);
  });
});

describe("faq data", () => {
  it("has the 7 spec questions", () => {
    expect(FAQ_ITEMS).toHaveLength(7);
    expect(FAQ_ITEMS[0].question).toBe("How does a project work?");
    expect(FAQ_ITEMS[6].question).toBe("Are your products open source?");
  });

  it("invents no timeframes or prices", () => {
    const text = FAQ_ITEMS.map((q) => `${q.question} ${q.answer}`).join(" ");
    expect(text).not.toMatch(/\b(weeks?|months?|\$\d)\b|per hour/i);
  });

  it("links the process answer to /process and the start answer to /order", () => {
    expect(FAQ_ITEMS[0].link?.href).toBe("/process");
    expect(FAQ_ITEMS[4].link?.href).toBe("/order");
  });
});
