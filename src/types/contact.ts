export type ContactKind = "general";
export type CollabRole = "developer" | "designer" | "other";

export interface ContactPayload {
  kind: ContactKind;
  name: string;
  email: string;
  github?: string;
  
  message: string; // 20-2000 chars
  links: string[]; // optional, max 3 URLs (portfolio, repo)
  meta: { startedAt: number; honeypot: string; source: string };
}
