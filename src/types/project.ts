export type ProjectKind = "client" | "product" | "private" | "lab";
export type ProjectStatus = "delivered" | "released" | "private" | "prototype";

export interface ProjectEntry {
  slug: string;
  kind: ProjectKind;
  status: ProjectStatus;
  title: string;
  tagline: string;
  summary: string; // 1-3 sentences
  year: string;
  stack: string[];
  highlights: string[]; // 3-6 bullets
  client?: {
    displayName: string;
    region?: string;
    display: "named" | "anonymous";
  };
  links?: { repo?: string; release?: string; releases?: string; npm?: string };
  /** "owner/repo" — when set, the latest release tag is read from the GitHub API. */
  githubRepo?: string;
  install?: string;
  gallery?: "lonewolf";
  isPlaceholder: boolean; // true = invented / illustrative content
}
