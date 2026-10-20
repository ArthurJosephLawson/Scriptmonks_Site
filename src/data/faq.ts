export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  link?: { href: string; label: string };
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-does-a-project-work",
    question: "How does a project work?",
    answer: "Six stages from lead qualification to final transfer.",
    link: { href: "/process", label: "See the stages" },
  },
  {
    id: "who-will-i-work-with",
    question: "Who will I work with?",
    answer: "Directly with the founder and lead developer.",
  },
  {
    id: "who-owns-the-code",
    question: "Who owns the code?",
    answer: "Final transfer happens after full payment is received.",
  },
  {
    id: "what-can-you-build",
    question: "What can you build?",
    answer:
      "Full-stack web platforms, custom utilities, API backends, bespoke tools, and CLI tooling.",
  },
  {
    id: "how-do-i-start",
    question: "How do I start?",
    answer: "Submit the order form; replies are sent by email.",
    link: { href: "/order", label: "Open the order form" },
  },
  {
    id: "small-businesses-and-creators",
    question: "Do you work with small businesses and creators?",
    answer:
      "Yes: individual clients, small businesses, and online creators.",
  },
  {
    id: "products-open-source",
    question: "Are your products open source?",
    answer:
      "Wolf and DeployMonk are MIT-licensed; LONEWOLF is private.",
  },
];
