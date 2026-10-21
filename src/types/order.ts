export const PROJECT_TYPES = ["custom-software", "utility", "cli", "full-app"] as const;
export const BUDGETS = ["under-250", "250-1k", "1k-3k", "3k-10k", "10k-plus", "not-sure"] as const;
export const TIMELINES = ["asap", "2-4-weeks", "1-2-months", "flexible"] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type BudgetRange = (typeof BUDGETS)[number];
export type Timeline = (typeof TIMELINES)[number];

export interface ProjectOrderPayload {
  scope: { projectType: ProjectType };
  commercial: { budget: BudgetRange; timeline: Timeline };
  brief: { title: string; description: string; references: string[] };
  contact: {
    name: string;
    email: string;
    github?: string;
    company?: string;
  };
  meta: {
    startedAt: number;
    honeypot: string;
    source: string;
  };
}

export interface OrderApiSuccess {
  ok: true;
  ref: string;
}

/**
 * The order form's value shape.
 *
 * Declared here rather than inferred from the zod schema in
 * `src/lib/validation.ts`, so client components can type their forms without
 * importing zod. `validation.ts` asserts that its schema still produces exactly
 * this type (see the `satisfies` check there), so the two cannot drift.
 */
export interface OrderFormValues {
  projectType: ProjectType;
  budget: BudgetRange;
  timeline: Timeline;
  title: string;
  description: string;
  references: string[];
  name: string;
  email: string;
  github: string;
  company: string;
  website: string;
}

/*
 * Runtime label maps for the order UI.
 *
 * These live here, NOT in `src/lib/validation.ts`, on purpose: client
 * components need the labels but must never pull in zod. When the labels were
 * exported from the validation module, importing them dragged the whole zod
 * runtime into the client bundle for every route (measured: a 144 kB chunk,
 * 99.9% unused on `/`), inflating Total Blocking Time. Keep this module
 * dependency-free.
 */
export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  "custom-software": "Custom Software",
  utility: "Utility",
  cli: "CLI",
  "full-app": "Full App",
};

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  "under-250": "< NPR 250",
  "250-1k": "NPR 250 – NPR 1,000",
  "1k-3k": "NPR 1,000 – NPR 3,000",
  "3k-10k": "NPR 3,000 – NPR 5,000",
  "10k-plus": "NPR 5,000+",
  "not-sure": "Not sure yet",
};

export const TIMELINE_LABELS: Record<Timeline, string> = {
  asap: "ASAP (< 2 weeks)",
  "2-4-weeks": "2 – 4 weeks",
  "1-2-months": "1 – 2 months",
  flexible: "Flexible",
};
