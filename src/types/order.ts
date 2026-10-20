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
export interface OrderApiError {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}
