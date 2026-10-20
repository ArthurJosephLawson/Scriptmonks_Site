import {
  BUDGET_LABELS,
  orderFormSchema,
  orderPayloadSchema,
  PROJECT_TYPE_LABELS,
  stepBriefSchema,
  stepCommercialSchema,
  stepContactSchema,
  stepScopeSchema,
  TIMELINE_LABELS,
} from "../src/lib/validation";
import {
  BUDGETS,
  type ProjectOrderPayload,
  PROJECT_TYPES,
  TIMELINES,
} from "../src/types/order";

let failed = 0;

function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) {
    console.log(`ok: ${name}`);
  } else {
    failed += 1;
    console.error(`FAIL: ${name}`, detail ?? "");
  }
}

check("scope rejects missing projectType", stepScopeSchema.safeParse({}).success === false);
check("scope rejects invalid projectType", stepScopeSchema.safeParse({ projectType: "nope" }).success === false);
check(
  "scope accepts every project type",
  PROJECT_TYPES.every((t) => stepScopeSchema.safeParse({ projectType: t }).success),
);

check("commercial rejects empty", stepCommercialSchema.safeParse({}).success === false);
check(
  "commercial accepts valid pair",
  stepCommercialSchema.safeParse({ budget: "1k-3k", timeline: "2-4-weeks" }).success,
);
check("commercial rejects bad budget", stepCommercialSchema.safeParse({ budget: "x", timeline: "asap" }).success === false);

const longTitle = "a".repeat(81);
const shortDescription = "b".repeat(39);
const goodDescription = "c".repeat(60);
check("brief rejects title under 3 chars", stepBriefSchema.safeParse({ title: "ab", description: goodDescription, references: [] }).success === false);
check("brief rejects title over 80 chars", stepBriefSchema.safeParse({ title: longTitle, description: goodDescription, references: [] }).success === false);
check("brief rejects description under 40 chars", stepBriefSchema.safeParse({ title: "ok title", description: shortDescription, references: [] }).success === false);
check("brief rejects bad url", stepBriefSchema.safeParse({ title: "ok title", description: goodDescription, references: ["not-a-url"] }).success === false);
check("brief rejects over 3 references", stepBriefSchema.safeParse({ title: "ok title", description: goodDescription, references: ["https://a.dev", "https://b.dev", "https://c.dev", "https://d.dev"] }).success === false);
check("brief accepts 3 valid urls", stepBriefSchema.safeParse({ title: "ok title", description: goodDescription, references: ["https://a.dev", "https://b.dev", "https://c.dev"] }).success);

const contactBase = { name: "Ada", email: "a@b.co", github: "", company: "" };
check("contact ok without github", stepContactSchema.safeParse(contactBase).success);
check(
  "contact rejects invalid github",
  stepContactSchema.safeParse({ ...contactBase, github: "has space" }).success === false,
);
check(
  "contact accepts valid github with leading @",
  stepContactSchema.safeParse({ ...contactBase, github: "@ada-lovelace" }).success,
);
check(
  "contact rejects github with trailing hyphen",
  stepContactSchema.safeParse({ ...contactBase, github: "ada-" }).success === false,
);
check("contact rejects bad email", stepContactSchema.safeParse({ ...contactBase, email: "nope" }).success === false);

const validForm = {
  projectType: "full-app",
  budget: "1k-3k",
  timeline: "2-4-weeks",
  title: "ok title",
  description: goodDescription,
  references: ["https://a.dev"],
  name: "Ada",
  email: "a@b.co",
  github: "",
  company: "",
  website: "",
} as const;

check("form schema accepts complete valid form", orderFormSchema.safeParse(validForm).success);
check("form schema rejects empty projectType", orderFormSchema.safeParse({ ...validForm, projectType: "" }).success === false);

const fixture: ProjectOrderPayload = {
  scope: { projectType: "full-app" },
  commercial: { budget: "1k-3k", timeline: "2-4-weeks" },
  brief: {
    title: "  My Project  ",
    description: goodDescription,
    references: ["https://a.dev", "", "https://b.dev"],
  },
  contact: {
    name: "  Ada  ",
    email: "  ADA@Example.COM ",
    github: "@Ada-Lovelace",
    company: "",
  },
  meta: { startedAt: 1_700_000_000_000, honeypot: "", source: "web:/order" },
} as ProjectOrderPayload;

const parsed = orderPayloadSchema.safeParse(fixture);
check("payload schema accepts fixture with untrimmed input", parsed.success, parsed.success ? undefined : parsed.error.issues);
if (parsed.success) {
  const out: ProjectOrderPayload = parsed.data;
  check("payload trims title", out.brief.title === "My Project", out.brief.title);
  check("payload lowercases and trims email", out.contact.email === "ada@example.com", out.contact.email);
  check("payload strips @ from github", out.contact.github === "Ada-Lovelace", out.contact.github);
  check("payload drops empty company", out.contact.company === undefined, out.contact.company);
  check("payload drops empty reference strings", out.brief.references.length === 2 && out.brief.references[0] === "https://a.dev", out.brief.references);
}

const invalidGithub = JSON.parse(JSON.stringify(fixture));
invalidGithub.contact.github = "bad user";
check(
  "payload rejects invalid github",
  orderPayloadSchema.safeParse(invalidGithub).success === false,
);

const omitGithub = JSON.parse(JSON.stringify(fixture));
delete omitGithub.contact.github;
check("payload accepts absent github", orderPayloadSchema.safeParse(omitGithub).success);

const omitCompany = JSON.parse(JSON.stringify(fixture));
delete omitCompany.contact.company;
check("payload accepts absent company", orderPayloadSchema.safeParse(omitCompany).success);

if (parsed.success) {
  check(
    "payload output re-validates (round trip)",
    orderPayloadSchema.safeParse(parsed.data).success,
  );
}

check(
  "project type labels complete",
  PROJECT_TYPES.every((t) => typeof PROJECT_TYPE_LABELS[t] === "string" && PROJECT_TYPE_LABELS[t].length > 0),
);
check(
  "budget labels complete",
  BUDGETS.every((b) => typeof BUDGET_LABELS[b] === "string" && BUDGET_LABELS[b].length > 0),
);
check(
  "timeline labels complete",
  TIMELINES.every((t) => typeof TIMELINE_LABELS[t] === "string" && TIMELINE_LABELS[t].length > 0),
);

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nall checks passed");
