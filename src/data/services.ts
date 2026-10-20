import type { LucideIcon } from "lucide-react";
import { Globe, Handshake, Server, Wrench } from "lucide-react";

export interface Service {
  index: string;
  title: string;
  icon: LucideIcon;
  description: string;
  tags: string[];
}

export const services: Service[] = [
  {
    index: "01",
    title: "Full-Stack Web",
    icon: Globe,
    description:
      "Production web apps, from landing pages to authenticated SaaS dashboards.",
    tags: ["Next.js", "React", "Postgres"],
  },
  {
    index: "02",
    title: "Custom Utilities",
    icon: Wrench,
    description:
      "Desktop and automation tools that remove repetitive work from your day.",
    tags: ["Tauri", "Rust", "Automation"],
  },
  {
    index: "03",
    title: "API Backends",
    icon: Server,
    description: "Typed, documented, scalable APIs and integrations behind your product.",
    tags: ["REST", "Node", "Auth"],
  },
  {
    index: "04",
    title: "Project Orders",
    icon: Handshake,
    description:
      "Hire a senior solo engineer for a defined scope with direct communication.",
    tags: ["Fixed-scope", "Retainer"],
  },
];
