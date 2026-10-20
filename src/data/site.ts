export const AVAILABILITY_LABELS = {
  open: "ACCEPTING ORDERS",
  limited: "LIMITED SLOTS",
  closed: "WAITLIST ONLY",
} as const;

export type Availability = keyof typeof AVAILABILITY_LABELS;

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  availability: Availability;
  siteUrl: string;
  links: {
    email: string;
    instagram: string;
    instagramHandle: string;
    github: { company: string; dev: string };
  };
  founder: { name: string; alias: string; role: string };
  lifecycle: string[];
  principles: string[];
  deliveredClientCount: number;
  footerNote: string;
  extraMetric: { value: string; label: string } | undefined;
}

export const currentYear = new Date().getFullYear();

export const siteConfig: SiteConfig = {
  name: "scriptmonks",
  tagline: "We write the scripts that run your ideas.",
  description:
    "Scriptmonks is a solo-founded software house. Full-stack apps, CLI tools, desktop utilities, and API backends, shipped clean and on time.",
  availability: "open",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://scriptmonks.com",
  links: {
    email: "script.monks.mail@gmail.com",
    instagram: "https://instagram.com/Script_monks",
    instagramHandle: "@Script_monks",
    github: {
      company: "https://github.com/Script_monks",
      dev: "https://github.com/ArthurJosephLawson",
    },
  },
  founder: {
    name: "Arthur Joseph Lawson",
    alias: "Monk_Mango",
    role: "Founder & Lead Developer",
  },
  lifecycle: [
    "Lead Qualification",
    "Scope Proposal (SOW)",
    "Onboarding",
    "Sprint Execution",
    "Review/Staging",
    "Final Transfer (upon full payment)",
  ],
  principles: [
    "Clean code architecture",
    "Scalable system design",
    "Modular development",
    "Automated deployment setups",
  ],
  deliveredClientCount: 4,
  footerNote: "BUILT WITH CAFFEINE & RUST",
  extraMetric: undefined,
};
