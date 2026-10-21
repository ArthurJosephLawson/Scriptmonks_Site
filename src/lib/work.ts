import type { ProjectEntry, ProjectStatus } from "@/types/project";
import type { ProjectType } from "@/types/order";

export const WORK_FILTERS = ["all", "client", "product", "private", "lab"] as const;
export type WorkFilter = (typeof WORK_FILTERS)[number];

export const WORK_FILTER_LABELS: Record<WorkFilter, string> = {
  all: "ALL",
  client: "CLIENT",
  product: "PRODUCTS",
  private: "PRIVATE",
  lab: "LABS",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  delivered: "DELIVERED",
  released: "RELEASED",
  private: "PRIVATE · CLOSED SOURCE",
  prototype: "PROTOTYPE",
};

export function isWorkFilter(value: string | undefined): value is WorkFilter {
  return value !== undefined && (WORK_FILTERS as readonly string[]).includes(value);
}

export function filterByKind(
  list: readonly ProjectEntry[],
  filter: WorkFilter,
): ProjectEntry[] {
  return filter === "all" ? [...list] : list.filter((p) => p.kind === filter);
}

const SUGGESTED_TYPE: Record<string, ProjectType> = {
  wolf: "utility",
  deploymonk: "cli",
  lonewolf: "full-app",
  shopledger: "full-app",
  routesheet: "full-app",
  streamdock: "custom-software",
  booknook: "full-app",
  pingpost: "utility",
  envlint: "cli",
  invoicemonk: "cli",
};

export function suggestedType(slug: string): ProjectType {
  return SUGGESTED_TYPE[slug] ?? "custom-software";
}

export function clientLine(project: ProjectEntry): string {
  const client = project.client;
  if (!client) return "";
  if (client.display === "anonymous") return "CLIENT: Confidential";
  return client.region
    ? `CLIENT: ${client.displayName} · ${client.region}`
    : `CLIENT: ${client.displayName}`;
}

export function releaseLabel(url: string): string {
  const tag = url.split("/").pop();
  // Only treat a version-like last segment as a tag; a bare `/releases` page
  // is the version-free fallback, so it gets the generic label.
  if (tag && /^v?\d/.test(tag)) return `[ RELEASE ${tag} ]`;
  return "[ LATEST RELEASE ]";
}
