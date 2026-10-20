export interface ProcessStage {
  number: string;
  title: string;
  description: string;
}

export const PROCESS_STAGES: ProcessStage[] = [
  {
    number: "01",
    title: "Lead Qualification",
    description:
      "You submit the order form; we check fit, scope and budget.",
  },
  {
    number: "02",
    title: "Scope Proposal (SOW)",
    description:
      "A written statement of work defines deliverables, milestones and price.",
  },
  {
    number: "03",
    title: "Onboarding",
    description: "Access, assets and communication channels are set up.",
  },
  {
    number: "04",
    title: "Sprint Execution",
    description:
      "The build proceeds in focused sprints with regular updates.",
  },
  {
    number: "05",
    title: "Review / Staging",
    description:
      "You test the work on a staging environment and request revisions.",
  },
  {
    number: "06",
    title: "Final Transfer",
    description:
      "Code and assets are handed over after full payment is received.",
  },
];
