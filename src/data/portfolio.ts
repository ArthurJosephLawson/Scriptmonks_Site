import type { ProjectEntry } from "@/types/project";

export const SHOW_PLACEHOLDER_PROJECTS =
  process.env.NEXT_PUBLIC_SHOW_PLACEHOLDER_PROJECTS === "true";

export function filterProjects(
  list: readonly ProjectEntry[],
  showPlaceholders: boolean,
): ProjectEntry[] {
  return showPlaceholders ? [...list] : list.filter((p) => !p.isPlaceholder);
}

export const allProjects: ProjectEntry[] = [
  {
    slug: "wolf",
    kind: "product",
    status: "released",
    title: "Wolf",
    tagline: "A local-first desktop companion with a wolf that reacts to you",
    summary:
      "A local-first Linux desktop productivity companion built with Tauri and Rust. Tasks, habits, calendar, focus timer, and an animated wolf that reacts to your cursor. All data stays local with zero network requests.",
    year: "TODO(OWNER)",
    stack: ["Tauri", "Rust", "React", "TypeScript", "SQLite"],
    highlights: [
      "Tasks, habits with a 28-day grid, calendar with desktop reminders, and a focus timer",
      "Animated desktop wolf: 11 states, 37 frames generated from a single 28x28 matrix",
      "Zero network requests; passwords hashed with Argon2, vault encrypted with AES-256-GCM",
      "252 frontend tests and 169 Rust tests",
      "Packages: .deb and AppImage",
    ],
    links: {
      repo: "https://github.com/ArthurJosephLawson/Wolf",
      release:
        "https://github.com/ArthurJosephLawson/Wolf/releases/tag/v0.4.0",
    },
    isPlaceholder: false,
  },
  {
    slug: "deploymonk",
    kind: "product",
    status: "released",
    title: "DeployMonk",
    tagline: "Scaffold a tested full-stack project from your terminal",
    summary:
      "A zero-configuration CLI scaffolder that creates a tested full-stack project from your terminal. Published on npm as deploymonk, with no telemetry and no unrequested network calls.",
    year: "TODO(OWNER)",
    stack: ["Node.js", "TypeScript", "npm"],
    highlights: [
      "Two production-shaped templates: node-express and fastapi-tailwind",
      "Zero unresolved placeholders guaranteed; reproducible byte-identical output",
      "Safe overwrite strategies: abort, merge, replace",
      "--yes and --dry-run flags for CI; correct exit codes, no telemetry",
      "Honest dependency install with a PEP 668 venv fallback",
    ],
    links: {
      npm: "https://www.npmjs.com/package/deploymonk",
      repo: "https://github.com/ArthurJosephLawson/deploymonk",
    },
    install: "npm install -g deploymonk",
    isPlaceholder: false,
  },
  {
    slug: "lonewolf",
    kind: "private",
    status: "private",
    title: "LONEWOLF",
    tagline: "A private command center for one operator",
    summary:
      "A self-hosted, single-user private command center with a terminal-styled web UI. No frontend build step and no external services at runtime. Closed source.",
    year: "TODO(OWNER)",
    stack: ["FastAPI", "SQLite", "Jinja2", "JavaScript"],
    highlights: [
      "Tasks, goals, habits, diary, achievements, XP and levels",
      "Live system monitor, flowchart lab, code snippets with Pygments",
      "CSRF protection, login rate limiting, upload sniffing, path-traversal and XSS guards",
      "85 tests, backup/restore CLI, built-in security audit command",
    ],
    gallery: "lonewolf",
    isPlaceholder: false,
  },
  {
    slug: "shopledger",
    kind: "client",
    status: "delivered",
    title: "ShopLedger",
    tagline: "Inventory and billing for a neighbourhood shop",
    summary:
      "A web-based stock and billing desk that replaces paper registers for a small retail business.",
    year: "2025",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Node.js"],
    highlights: [
      "Product catalogue with SKU search",
      "Stock-in and stock-out tracking",
      "Printable PDF invoices",
      "Daily sales summary",
      "Staff logins with roles",
    ],
    client: { displayName: "TODO(OWNER)", display: "named" },
    isPlaceholder: true,
  },
  {
    slug: "routesheet",
    kind: "client",
    status: "delivered",
    title: "RouteSheet",
    tagline: "Job scheduling and dispatch for a field-services team",
    summary:
      "Custom software that lets a small team plan jobs, assign technicians and print daily run sheets.",
    year: "2026",
    stack: ["Python", "FastAPI", "React", "SQLite"],
    highlights: [
      "Drag-and-drop job board",
      "Technician availability calendar",
      "Daily run sheets exported to PDF",
      "Searchable job history",
    ],
    client: {
      displayName: "TODO(OWNER)",
      region: "Australia",
      display: "named",
    },
    isPlaceholder: true,
  },
  {
    slug: "streamdock",
    kind: "client",
    status: "delivered",
    title: "StreamDock",
    tagline: "Overlay and alerts manager API for an online creator",
    summary:
      "A backend and control panel for managing stream overlays, scenes and alert rules.",
    year: "2025",
    stack: ["Node.js", "Express", "WebSockets", "SQLite"],
    highlights: [
      "REST API plus live WebSocket channel",
      "Scene and overlay presets",
      "Alert rule editor",
      "Moderation queue",
    ],
    client: {
      displayName: "Confidential creator client",
      display: "anonymous",
    },
    isPlaceholder: true,
  },
  {
    slug: "booknook",
    kind: "client",
    status: "delivered",
    title: "BookNook",
    tagline: "Online booking site with an admin dashboard",
    summary:
      "A booking website with a staff dashboard for a small appointment-based business.",
    year: "2026",
    stack: ["Next.js", "Tailwind CSS", "PostgreSQL"],
    highlights: [
      "Service and slot management",
      "Public booking flow",
      "Admin calendar view",
      "Email confirmations",
    ],
    client: {
      displayName: "Confidential small business",
      display: "anonymous",
    },
    isPlaceholder: true,
  },
  {
    slug: "pingpost",
    kind: "lab",
    status: "prototype",
    title: "PingPost",
    tagline: "A self-hosted uptime monitor with a tiny dashboard",
    summary:
      "Checks your endpoints on a schedule and shows their history on a single page.",
    year: "2026",
    stack: ["Rust", "SQLite"],
    highlights: [
      "Interval checks",
      "Status history",
      "Single binary",
      "Zero external services",
    ],
    isPlaceholder: true,
  },
  {
    slug: "envlint",
    kind: "lab",
    status: "prototype",
    title: "EnvLint",
    tagline: "Catch missing environment variables before deploy",
    summary:
      "A CLI that diffs .env against .env.example and fails CI on mismatches.",
    year: "2026",
    stack: ["TypeScript", "Node.js"],
    highlights: ["Diff and report", "CI exit codes", "JSON output mode"],
    isPlaceholder: true,
  },
  {
    slug: "invoicemonk",
    kind: "lab",
    status: "prototype",
    title: "InvoiceMonk",
    tagline: "Turn a YAML file into a clean PDF invoice",
    summary: "A command-line invoice generator for freelancers.",
    year: "2026",
    stack: ["TypeScript", "Node.js"],
    highlights: ["YAML in, PDF out", "Reusable templates", "No network calls"],
    isPlaceholder: true,
  },
];

export const projects: ProjectEntry[] = filterProjects(
  allProjects,
  SHOW_PLACEHOLDER_PROJECTS,
);
