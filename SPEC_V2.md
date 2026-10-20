# SCRIPTMONKS WEBSITE: V2 REVISION SPEC FOR OPENCODE

> **Mode: REVISION, not rewrite.** The site from `SPEC.md` already exists and the owner loves the design.
> **How to use:** Save as `SPEC_V2.md` in the repo root. Tell OpenCode:
> *"Read SPEC_V2.md fully. Audit the existing codebase first. Execute Task R1 only. Stop and report when its acceptance criteria pass."* Then continue R2 to R7, one at a time.

---

## 0. NON-NEGOTIABLE RULES

1. **The design is locked.** Do not change color tokens, fonts, dot-matrix background, bracketed `[ LABEL ]` buttons, brutal shadows, or the 2px radius cap. New UI must be built from the existing `ui/` primitives and tokens in `tailwind.config.ts`.
2. **Incremental edits only.** Read the current code, reuse existing components, and delete only what this spec says to delete.
3. **Facts come from Section 2 only.** Where a field is not listed there, leave `TODO(OWNER)`. Do not add testimonials, quotes, revenue figures, percentage results, or customer counts anywhere.
4. **Illustrative content is flagged.** Every invented portfolio entry carries `isPlaceholder: true` (see 4.5) and can be hidden with one env flag.
5. After every task: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`, fix everything, then summarize changed files.

---

## 1. CHANGE SUMMARY

| # | Change | Task |
|---|---|---|
| 1 | Remove the round **"N" button** at the bottom-left of the page | R1 |
| 2 | Use `logo.png` from the repo root as navbar logo, footer logo, favicon, and OG image | R1 |
| 3 | **Remove all Discord** (webhook, form field, footer link, success-screen button, env vars). Delivery becomes **email only (Resend)** | R1 |
| 4 | GitHub links: company **@Script_monks** and developer **@ArthurJosephLawson** | R1 |
| 5 | Replace placeholder portfolio with real products (Wolf, DeployMonk, LONEWOLF) plus 4 client projects and 3 extra builds | R2 |
| 6 | LONEWOLF showcase with an auto-discovered screenshot gallery from `/screenshots` | R3 |
| 7 | New pages: `/work`, `/work/[slug]`, `/process`, `/about`, `/contact`, `/faq`, `/privacy` | R3, R4 |
| 8 | New nav with a Work dropdown | R4 |
| 9 | Contact and Collaborate form (`/api/contact`) | R5 |
| 10 | Command palette (Ctrl/Cmd+K), live GitHub stats, copy-email, scroll progress, back-to-top, lightbox, filter tabs | R3, R6 |

---

## 2. SOURCE-OF-TRUTH FACTS (from the owner's READMEs and company overview)

### 2.1 Company
- **Scriptmonks**: solo-founded independent software development house, digital agency and software incubator.
- Hybrid model: client commissions (cash flow) plus proprietary products (equity and brand authority).
- Delivered **4 client commissions**; completed **2 in-house projects** (Wolf, DeployMonk).
- Founder: **Arthur Joseph Lawson** ("Monk_Mango"), Freelance Software Engineer, Founder and Lead Developer.
- Plans to onboard technical members and contributors through **project-based profit/revenue-sharing** arrangements.
- Engineering standards: clean code architecture, scalable system design, modular development, automated deployment setups.
- Website: `https://scriptmonks.com` (use as `NEXT_PUBLIC_SITE_URL` default in production).
- Email: `script.monks.mail@gmail.com`.
- 6-stage client lifecycle: **Lead Qualification → Scope Proposal (SOW) → Onboarding → Sprint Execution → Review/Staging → Final Transfer (upon full payment)**.

### 2.2 Links (single source: `src/data/site.ts`)
| Key | Value |
|---|---|
| `github.company` | `https://github.com/Script_monks` (display `@Script_monks`) |
| `github.dev` | `https://github.com/ArthurJosephLawson` (display `@ArthurJosephLawson`) |
| `instagram` | `https://instagram.com/Script_monks`, `TODO(OWNER): the owner's READMEs list @monk_mango as the Instagram handle; confirm which to show` |
| `email` | `script.monks.mail@gmail.com` |

> Spelling check: the correct developer handle is **ArthurJosephLawson** (with the "t"). Do not use "ArhurJosephLawson".

### 2.3 Wolf (in-house, open source, MIT)
- Local-first **Linux** desktop productivity companion. **Tauri + React + TypeScript + Rust**, SQLite storage.
- Tasks, habits (streaks plus 28-day grid), calendar (repeating events with desktop reminders), focus timer (Pomodoro-style with 7-day sparkline), progress (XP, levels, countdowns, commit log), weekly review, settings (accent: cyan/amber/rose, backup export/import).
- Animated desktop wolf: **11 states, 37 frames** generated from a single 28x28 matrix; transparent always-on-top window; silent; reacts to the cursor.
- **Zero network requests.** Passwords hashed with Argon2; vault encrypted with AES-256-GCM; all data stays local.
- Version **0.4.0**, an early prototype. **252 frontend tests, 169 Rust tests.** Packages: `.deb` and AppImage.
- Repo: `https://github.com/ArthurJosephLawson/Wolf`. Release: `https://github.com/ArthurJosephLawson/Wolf/releases/tag/v0.4.0`.
- Earlier free edition (v0.3.1): `https://github.com/ArthurJosephLawson/Wolf_Free` (show as a small secondary link only).

### 2.4 DeployMonk (in-house, open source, MIT)
- Zero-configuration CLI scaffolder. Node >= 18, TypeScript strict, published on npm as **`deploymonk`**.
- Two templates: **`node-express`** (Node + Express) and **`fastapi-tailwind`** (FastAPI + Tailwind), each with a health endpoint and its own passing test suite.
- Guarantees: zero unresolved `{{ ... }}` placeholders, byte-identical reproducible output, safe overwrite strategies (`abort | merge | replace`), honest dependency install (PEP 668 venv fallback), correct exit codes, no telemetry, no unrequested network calls, CI-friendly (`--yes`, `--dry-run`).
- Install: `npm install -g deploymonk`, then run `deploymonk`. Non-interactive example: `deploymonk -n my-api -t node-express --yes`.
- npm: `https://www.npmjs.com/package/deploymonk`. GitHub: `TODO(OWNER): the README mentions github.com/monk_mango/deploymonk but the developer account is ArthurJosephLawson; confirm the repo URL. Default to https://github.com/ArthurJosephLawson/deploymonk`.

### 2.5 LONEWOLF (private, CLOSED SOURCE, the owner's own system)
- Self-hosted, single-user "private command center" with a terminal-styled web UI. **Not open source. No repo link, no download link.**
- Stack: **FastAPI + SQLite + server-rendered Jinja2 + vanilla JS**. No frontend build step, no external services at runtime.
- Modules: Dashboard (streak, XP ring), Tasks, Goals, Habits, Diary, Achievements, Updates/Projects, Commits (GitHub public-repo import), Gallery (content-sniffed uploads), Code Snippets (Pygments), Debug Logs, Lab (JS flowchart editor, JSON nodes/edges), Profile/Settings, **Sneak** (live CPU/memory/disk/network/process monitor), XP and levels.
- Security and quality: CSRF protection, login rate limiting, upload sniffing, path-traversal and SQL-injection guards, XSS escaping, **85 tests**, backup/restore CLI, built-in security audit command.
- Screenshots: owner places files in `/screenshots` at the repo root (see R3).

---

## 3. REVISED DATA STRUCTURES

### 3.1 `ProjectOrderPayload` (replace in `src/types/order.ts`; Discord removed)

```ts
export interface ProjectOrderPayload {
  scope: { projectType: ProjectType };
  commercial: { budget: BudgetRange; timeline: Timeline };
  brief: { title: string; description: string; references: string[] };
  contact: {
    name: string;
    email: string;
    github?: string;     // GitHub username without "@" (optional)
    company?: string;
  };
  meta: { startedAt: number; honeypot: string; source: string };
}
```

Delete `CONTACT_METHODS`, `ContactMethod`, `preferredContact`, and the `discord` field everywhere, including the zod superRefine.

### 3.2 `src/types/contact.ts` (new)

```ts
export type ContactKind = "general" | "collaborate";
export type CollabRole = "developer" | "designer" | "other";

export interface ContactPayload {
  kind: ContactKind;
  name: string;
  email: string;
  github?: string;
  role?: CollabRole;        // required when kind === "collaborate"
  message: string;          // 20-2000 chars
  links: string[];          // optional, max 3 URLs (portfolio, repo)
  meta: { startedAt: number; honeypot: string; source: string };
}
```

### 3.3 `src/types/project.ts` (new, used by all portfolio data)

```ts
export type ProjectKind = "client" | "product" | "private" | "lab";
export type ProjectStatus = "delivered" | "released" | "private" | "prototype";

export interface ProjectEntry {
  slug: string;
  kind: ProjectKind;
  status: ProjectStatus;
  title: string;
  tagline: string;                 // <= 80 chars
  summary: string;                 // 1-3 sentences
  year: string;
  stack: string[];
  highlights: string[];            // 3-6 bullets
  client?: { displayName: string; region?: string; display: "named" | "anonymous" };
  links?: { repo?: string; release?: string; npm?: string };
  install?: string;                // shown as copyable snippet
  gallery?: "lonewolf";            // uses generated screenshots
  isPlaceholder: boolean;          // true = invented / illustrative content
}
```

### 3.4 Site config additions (`src/data/site.ts`)
Add `links` (2.2), `siteUrl`, `founder: { name: "Arthur Joseph Lawson", alias: "Monk_Mango", role: "Founder & Lead Developer" }`, `lifecycle` (the 6 stages, see 4.7), `principles` (4 engineering standards, see 4.8). Remove `discord` entirely.

### 3.5 Portfolio data (`src/data/portfolio.ts`): exact content

**Products and private (real facts, `isPlaceholder: false`)**

| slug | kind | status | title | tagline | stack | highlights (use 2.3-2.5 only) |
|---|---|---|---|---|---|---|
| `wolf` | product | released | Wolf | A local-first desktop companion with a wolf that reacts to you | Tauri, Rust, React, TypeScript, SQLite | Tasks, habits, calendar, focus timer; animated desktop wolf (11 states, 37 frames); zero network requests; 252 + 169 automated tests; `.deb` and AppImage |
| `deploymonk` | product | released | DeployMonk | Scaffold a tested full-stack project from your terminal | Node.js, TypeScript, npm | Two production-shaped templates; zero unresolved placeholders guaranteed; reproducible byte-identical output; `--yes` and `--dry-run` for CI; no telemetry |
| `lonewolf` | private | private | LONEWOLF | A private command center for one operator | FastAPI, SQLite, Jinja2, JavaScript | Tasks, goals, habits, diary, XP and levels; live system monitor; flowchart lab; 85 tests with CSRF, upload-sniffing and rate-limit coverage; closed source |

- `wolf.links`: `repo`, `release` (2.3). `deploymonk.links`: `npm`, `repo`. `deploymonk.install`: `npm install -g deploymonk`.
- `lonewolf`: no `links`; `gallery: "lonewolf"`; year `TODO(OWNER)`.

**Client commissions (4; the 4 delivered; `isPlaceholder: true`)**

| slug | client | year | title | tagline | summary | stack | highlights |
|---|---|---|---|---|---|---|---|
| `shopledger` | `Inesh Kshettri`, `display: "named"` | 2025 | ShopLedger | Inventory and billing for a neighbourhood shop | A web-based stock and billing desk that replaces paper registers for a small retail business. | Next.js, TypeScript, PostgreSQL, Node.js | Product catalogue with SKU search; stock-in and stock-out tracking; printable PDF invoices; daily sales summary; staff logins with roles |
| `routesheet` | `Noah Huber`, region `Australia`, `display: "named"` | 2026 | RouteSheet | Job scheduling and dispatch for a field-services team | Custom software that lets a small team plan jobs, assign technicians and print daily run sheets. | Python, FastAPI, React, SQLite | Drag-and-drop job board; technician availability calendar; daily run sheets exported to PDF; searchable job history |
| `streamdock` | `Confidential creator client`, `display: "anonymous"` | 2025 | StreamDock | Overlay and alerts manager API for an online creator | A backend and control panel for managing stream overlays, scenes and alert rules. | Node.js, Express, WebSockets, SQLite | REST API plus live WebSocket channel; scene and overlay presets; alert rule editor; moderation queue |
| `booknook` | `Confidential small business`, `display: "anonymous"` | 2026 | BookNook | Online booking site with an admin dashboard | A booking website with a staff dashboard for a small appointment-based business. | Next.js, Tailwind CSS, PostgreSQL | Service and slot management; public booking flow; admin calendar view; email confirmations |

**Extra builds (3; kind `lab`; status `prototype`; `isPlaceholder: true`)**

| slug | title | tagline | summary | stack | highlights |
|---|---|---|---|---|---|
| `pingpost` | PingPost | A self-hosted uptime monitor with a tiny dashboard | Checks your endpoints on a schedule and shows their history on a single page. | Rust, SQLite | Interval checks; status history; single binary; zero external services |
| `envlint` | EnvLint | Catch missing environment variables before deploy | A CLI that diffs `.env` against `.env.example` and fails CI on mismatches. | TypeScript, Node.js | Diff and report; CI exit codes; JSON output mode |
| `invoicemonk` | InvoiceMonk | Turn a YAML file into a clean PDF invoice | A command-line invoice generator for freelancers. | TypeScript, Node.js | YAML in, PDF out; reusable templates; no network calls |

Each `lab` entry: year `2026`, no links.

> Do not add any metrics, quotes, ratings, revenue claims, or "client said" text to any entry.

---

## 4. UI SPECIFICATION CHANGES

### 4.1 Remove the "N" button (Task R1)
The round "N" at the bottom-left is the **Next.js development indicator**. It only appears in `next dev`, never in production. Remove it for good:
- In `next.config.mjs`: if Next >= 15.2 use `devIndicators: false`; on older versions use `devIndicators: { appIsrStatus: false, buildActivity: false }` (check the installed version in `package.json` first).
- Confirm no custom element with a similar position exists (`grep -rn "fixed bottom" src/`) and report what you find.

### 4.2 Logo (`logo.png` in the repo root)
1. Inspect it (dimensions, transparency) and report.
2. Copy to `public/logo.png`. Copy again to `src/app/icon.png` (Next favicon convention) and `src/app/apple-icon.png`. Do not edit the source file.
3. Navbar: replace the text wordmark with `<Image src="/logo.png" alt="Scriptmonks" height={32} width={...} priority className="h-8 w-auto object-contain" />` followed by the existing mono wordmark `scriptmonks_` (blinking cursor). If the logo already contains the wordmark text, show the logo only. Decide by viewing the image.
4. Footer: logo at `h-10`.
5. OG image: generate `src/app/opengraph-image.tsx` (ImageResponse) with `#09181B` background, the logo, the tagline, and the coral border. Remove the `/og.png` placeholder reference.
6. Logo must have a transparent or dark-compatible background. If it has a white background that clashes, tell the owner; do not alter the file.

### 4.3 Remove Discord and switch to GitHub (Task R1)
Run `grep -rniE "discord" . --include=* --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git` and eliminate **every** hit except this spec file:
- Delete `lib/delivery/discord.ts`; simplify `lib/delivery/index.ts` to email only; remove `LEAD_DELIVERY` logic.
- Remove the Discord field, its helper text, regex, and the `preferredContact` radio from the order wizard, review screen, and zod schemas.
- Add an optional **GitHub username** field in step 4 (label `GitHub username (optional)`, placeholder `octocat`, helper `So we can look at your repo or project if relevant`).
- Footer: remove `[ DISCORD ]`; add `[ GITHUB · @Script_monks ]` (company) and `[ DEV · @ArthurJosephLawson ]` (developer); keep Instagram and email.
- Order success screen: replace `[ JOIN DISCORD ]` with `[ VIEW GITHUB ]` → company GitHub.
- Order page side panel: change any "Discord" copy to email-only language ("We reply by email within 24-48h").
- `.env.example`: remove `LEAD_DELIVERY`, `DISCORD_WEBHOOK_URL`, `NEXT_PUBLIC_DISCORD_INVITE_URL`; add `GITHUB_TOKEN=` (optional, raises GitHub API rate limit) and `NEXT_PUBLIC_SHOW_PLACEHOLDER_PROJECTS=true`.
- Email template: replace the Discord row with a GitHub row linking to `https://github.com/<username>` (escape the username, show `-` if empty).
- API route: delivery failure message now reads `Delivery failed. Please email script.monks.mail@gmail.com`. Keep honeypot, time-trap, rate limit.
- Update `orderPayloadSchema`:

```ts
const githubUser = z
  .string()
  .trim()
  .transform((v) => v.replace(/^@/, ""))
  .refine((v) => v === "" || /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(v), "Enter a valid GitHub username")
  .optional();
```

- Update Vitest tests: remove Discord/`clip()` Discord tests, add tests for the GitHub normalizer, email-only delivery, and email HTML escaping of the GitHub field.
- JSON-LD `sameAs`: GitHub company, GitHub developer, Instagram.

### 4.4 Navigation (Task R4)
Desktop nav order: `[ SERVICES ]` `[ PROCESS ]` `[ WORK ▾ ]` `[ ABOUT ]` `[ CONTACT ]` | `[ ⌘K ]` | primary `[ ORDER PROJECT ]`.
- **Work dropdown** (keyboard accessible, closes on Esc and outside click): `ALL WORK` → `/work`, `CLIENT PROJECTS` → `/work?filter=client`, `PRODUCTS` → `/work?filter=product`, `PRIVATE BUILDS` → `/work?filter=private`, `LABS` → `/work?filter=lab`.
- On home page, anchors still scroll smoothly to sections; on other pages links go to `/#section`.
- Mobile: the existing hamburger panel lists everything, Work items nested and expanded.
- `[ ⌘K ]` opens the command palette (6.1). Show `[ CTRL K ]` on non-Mac.

### 4.5 Home page order (Task R4)
Hero → **Stack strip** → Services → **Process (condensed)** → Work (featured + metrics) → **About teaser** → **FAQ (top 4)** → CTA band.

- **Stack strip:** a single row of mono badges (Next.js, React, TypeScript, Rust, Tauri, FastAPI, Node.js, Python, SQLite, PostgreSQL), static, wraps on mobile. No logo imagery from third parties.
- **Work (featured):** the 3 non-client entries as large cards in this order: Wolf, DeployMonk, LONEWOLF; metrics grid; the 4 client cards; link `[ VIEW ALL WORK ]` → `/work`.
- Client cards: `[ DELIVERED ]` badge; show the client name only when `client.display === "named"`, formatted `CLIENT: Noah Huber · Australia`. Anonymous ones show `CLIENT: Confidential`. Cards link to `/work/[slug]`.
- **Placeholder switch:** if `NEXT_PUBLIC_SHOW_PLACEHOLDER_PROJECTS !== "true"`, filter out every `isPlaceholder` entry everywhere (home, `/work`, sitemap, `generateStaticParams`), and the metrics grid reads its count from `siteConfig.deliveredClientCount = 4` instead of the array length.

### 4.6 `/work` page
- Header `// 02_WORK`, H1 `All work`.
- Filter tabs (mono, bracketed): `[ ALL ]` `[ CLIENT ]` `[ PRODUCTS ]` `[ PRIVATE ]` `[ LABS ]`; state synced to `?filter=`; count in each tab.
- Responsive grid of project cards (reuse home cards). Statuses displayed as badges: `[ DELIVERED ]`, `[ RELEASED ]`, `[ PRIVATE · CLOSED SOURCE ]`, `[ PROTOTYPE ]`.

### 4.7 `/work/[slug]` case study page
Static params from data. Layout:
1. Breadcrumb `WORK / <KIND> / <TITLE>` in mono.
2. Title, tagline, status badge, year, client line (per 4.5).
3. Summary and a **Highlights** list (`> ` prefix in coral).
4. **Stack** badges.
5. Links row (only those present): `[ VIEW ON GITHUB ]`, `[ RELEASE v0.4.0 ]`, `[ NPM ]`.
6. If `install`: copyable terminal block (`[ COPY ]` → `[ COPIED ]`).
7. If `gallery === "lonewolf"`: the screenshot gallery (R3).
8. If `isPlaceholder` and `kind === "client"`: footer note in muted mono: `Project details simplified for client privacy.`
9. Bottom CTA: `[ ORDER A SIMILAR PROJECT ]` → `/order?type=<suggested>`; the order page reads `?type=` and preselects (`custom-software | utility | cli | full-app`). Map: web/dashboard apps → `full-app`, API/backend → `custom-software`, CLI → `cli`, desktop tools → `utility`.
10. Previous/next project links.
11. Metadata per page via `generateMetadata`; `notFound()` for unknown slugs.

LONEWOLF page extra copy: a mono banner `[ PRIVATE · CLOSED SOURCE ] This is Scriptmonks' own system. It is not open source and there is no public repository.`

### 4.8 `/process` page and the home condensed block
Six stages, rendered as a vertical terminal-style timeline (`01`..`06`), each with a title and one sentence; no invented timeframes.

| # | Stage | Description |
|---|---|---|
| 01 | Lead Qualification | You submit the order form; we check fit, scope and budget. |
| 02 | Scope Proposal (SOW) | A written statement of work defines deliverables, milestones and price. |
| 03 | Onboarding | Access, assets and communication channels are set up. |
| 04 | Sprint Execution | The build proceeds in focused sprints with regular updates. |
| 05 | Review / Staging | You test the work on a staging environment and request revisions. |
| 06 | Final Transfer | Code and assets are handed over after full payment is received. |

Below the timeline, an **Engineering standards** grid (4 cards): Clean code architecture; Scalable system design; Modular development; Automated deployment setups. Home page shows the timeline only (compact, 2 columns on desktop) with `[ FULL PROCESS ]` → `/process`.

### 4.9 `/about` page
- Header `// 03_ABOUT`. Founder block: logo or monogram `[ AJL ]` (no photo unless `public/founder.jpg` exists; check and use it if present), name **Arthur Joseph Lawson** (alias Monk_Mango), role Founder & Lead Developer, 2-3 sentences from 2.1 (independent, hybrid model, engineering standards).
- **Hybrid model** two-column card: `CLIENT SERVICES` vs `IN-HOUSE PRODUCTS` (use 1 sentence each from the overview).
- **Open source** row: Wolf and DeployMonk, both MIT, with repo links.
- **Collaboration** callout: "Scriptmonks plans to bring on technical contributors through project-based profit-sharing." CTA `[ COLLABORATE WITH US ]` → `/contact?tab=collaborate`.
- Links: GitHub company, GitHub developer, Instagram, email.

### 4.10 `/faq` page and home FAQ (accordion, accessible, `aria-expanded`)
Use only these answers (do not invent prices or timelines):
1. **How does a project work?** Six stages from lead qualification to final transfer (link to `/process`).
2. **Who will I work with?** Directly with the founder and lead developer.
3. **Who owns the code?** Final transfer happens after full payment is received.
4. **What can you build?** Full-stack web platforms, custom utilities, API backends, bespoke tools, and CLI tooling.
5. **How do I start?** Submit the order form; replies are sent by email.
6. **Do you work with small businesses and creators?** Yes: individual clients, small businesses, and online creators.
7. **Are your products open source?** Wolf and DeployMonk are MIT-licensed; LONEWOLF is private.

### 4.11 `/privacy` page
Short static page: the order and contact forms collect the fields shown (name, email, optional GitHub username and company, project brief); they are delivered by email to Scriptmonks via Resend; no analytics or third-party trackers are used (verify this is true in code before shipping this sentence; if analytics exist, say so); contact `script.monks.mail@gmail.com` to request deletion. Link it in the footer and under both forms.

### 4.12 `/contact` page
Two tabs (query `?tab=general|collaborate`): `[ GENERAL ]` and `[ COLLABORATE ]`. See R5 for fields and API. Side panel lists email (with copy button), GitHub links and Instagram.

### 4.13 Footer (update)
Columns: brand (logo + one line) / navigate (Services, Process, Work, About, FAQ, Contact, Privacy) / connect (`[ GITHUB · @Script_monks ]`, `[ DEV · @ArthurJosephLawson ]`, `[ INSTAGRAM ]`, `[ EMAIL ]`). Keep the bottom bar. Add `[ ↑ TOP ]` button.

---

## 5. SCREENSHOT PIPELINE FOR LONEWOLF (Task R3)

The owner will drop images into `/screenshots` (repo root), with any filenames.

1. Create `scripts/sync-screenshots.mjs` (Node, no dependencies):

```js
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { extname, join, basename } from "node:path";

const SRC = "screenshots";
const DEST = "public/screenshots/lonewolf";
const OUT = "src/data/screenshots.generated.ts";
const EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const caption = (file) => {
  const base = basename(file, extname(file)).replace(/^\d+[\s._-]*/, "").replace(/[-_]+/g, " ").trim();
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : "LONEWOLF screenshot";
};

rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });

const files = existsSync(SRC)
  ? readdirSync(SRC).filter((f) => EXT.has(extname(f).toLowerCase())).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  : [];

const items = files.map((f) => {
  const name = slug(basename(f, extname(f))) + extname(f).toLowerCase();
  cpSync(join(SRC, f), join(DEST, name));
  return { src: `/screenshots/lonewolf/${name}`, caption: caption(f), alt: `LONEWOLF: ${caption(f)}` };
});

writeFileSync(
  OUT,
  `// AUTO-GENERATED by scripts/sync-screenshots.mjs. Do not edit.\nexport const lonewolfScreenshots: { src: string; caption: string; alt: string }[] = ${JSON.stringify(items, null, 2)};\n`
);
console.log(`[screenshots] ${items.length} file(s) synced`);
```

2. `package.json`: `"sync:screenshots": "node scripts/sync-screenshots.mjs"`, `"predev"` and `"prebuild"` both run it. Add `public/screenshots/` and `src/data/screenshots.generated.ts` to `.gitignore` is **not** wanted; commit the generated file so builds work without the script when `/screenshots` is absent. Create `screenshots/.gitkeep` and a `screenshots/README.md` saying "Drop LONEWOLF screenshots here. Filenames become captions; a leading number sets the order (e.g. `01 dashboard.png`)".
3. `components/work/screenshot-gallery.tsx` (client): responsive grid (2 cols mobile, 3 desktop) of `next/image` thumbnails in a bordered `bg-dark-surface` frame with a mono caption; click opens a **lightbox** (Esc closes, left/right arrows navigate, focus trapped, `aria-modal`, caption shown, `[ CLOSE ]` button). Empty state: a dotted frame with `[ SCREENSHOTS COMING SOON ]`.
4. Show the first screenshot as the hero image of the LONEWOLF card on `/work` and home.
5. Add a note in the README: blur or crop any personal data before adding screenshots.

## 6. NEW FUNCTIONS

### 6.1 Command palette (Task R6)
Dependency `cmdk`. Styled with existing tokens (`bg-dark-surface`, coral selected row, mono input prefix `> `). Opens on Ctrl/Cmd+K and the nav button; Esc closes; focus trapped; `aria-label="Command palette"`.
Groups and items:
- **Navigate:** Home, Services, Process, Work, About, FAQ, Contact, Order a project.
- **Projects:** one entry per visible project → `/work/<slug>`.
- **Actions:** Copy email (copies, shows toast `[ COPIED ]`), Open GitHub (company), Open GitHub (developer), Open Instagram, Copy DeployMonk install command (`npm install -g deploymonk`).

### 6.2 Live GitHub stats (Task R6)
`lib/github.ts`: server-side `getRepoStats(fullName)` using `fetch("https://api.github.com/repos/<fullName>", { next: { revalidate: 3600 }, headers: { Accept: "application/vnd.github+json", ...(token && { Authorization: \`Bearer ${token}\` }) } })`. Return `{ stars, forks, pushedAt, latestRelease? } | null`; never throw (try/catch, null on any non-200). Show `★ N` and `UPDATED <relative date>` badges on Wolf and DeployMonk cards **only when data is returned**; render nothing otherwise. Repos to query come from `links.repo`.

### 6.3 Small UX functions (Task R6)
- **Copy email** button (navbar contact, contact page, footer) with toast.
- **Toast** component (bottom-center, mono, auto-dismiss 2s, `role="status"`).
- **Scroll progress** bar: 2px coral line fixed at the top (hidden under reduced motion).
- **Back to top** `[ ↑ TOP ]` appears after 600px scroll.
- **Order page deep links:** `?type=` preselect (4.7).
- **Active nav state:** current route or section highlighted with coral underline.

---

## 7. API: `/api/contact` (Task R5)

`POST`, `runtime = "nodejs"`. Same pipeline as `/api/order` (20 KB cap, rate limit 5 per 10 min per IP using a **separate** key prefix, zod validation, honeypot `meta.honeypot`, 3s time-trap, silent fake success for spam).

Validation (`contactPayloadSchema`):
- `kind`: `general | collaborate`.
- `name` 2-80; `email` valid; `github` via the shared `githubUser` schema; `message` 20-2000; `links` up to 3 valid URLs.
- `role` required when `kind === "collaborate"` (`superRefine`).
Delivery: Resend to `LEAD_TO_EMAIL`. Subject: `[Scriptmonks] General inquiry: <name>` or `[Scriptmonks] Collaboration request: <name>`. Always set `replyTo` to the sender. Escape every interpolated value. Reference id `SM-C` + 5 chars.
Responses: same `OrderApiSuccess`/`OrderApiError` shapes.
UI: success state `[ MESSAGE SENT ]` with the reference id; error state with the mailto fallback.

---

## 8. EXECUTION PLAN

### TASK R1: Hotfixes, logo, Discord removal, GitHub links
> Read SPEC_V2.md. Audit the codebase and list the files you will touch. Execute Task R1: 4.1 (remove the Next.js dev "N" indicator), 4.2 (logo from the repo-root `logo.png`), 4.3 (remove ALL Discord, email-only delivery, GitHub username field, footer GitHub links), and 3.1 payload changes. Update tests and `.env.example`.

**Acceptance:** `grep -rniE discord` returns nothing outside SPEC files; the N badge is gone in `pnpm dev`; navbar, footer, favicon and OG image use the logo; an order submission reaches email only; footer shows both GitHub handles spelled `Script_monks` and `ArthurJosephLawson`; all checks pass.

### TASK R2: Data layer and real facts
> Execute Task R2. Create `types/project.ts`, rewrite `data/portfolio.ts` per 3.5 exactly, update `data/site.ts` per 3.4 and 2.2, and adapt existing components to the new types. Wire `NEXT_PUBLIC_SHOW_PLACEHOLDER_PROJECTS`. Use no facts beyond Section 2 and 3.5.

**Acceptance:** 3 non-client entries, 4 client entries, 3 lab entries render from data; flipping the env flag to `false` hides all 7 placeholders without errors; no TODO(OWNER) strings are visible except where Section 2 lists them in config comments; DeployMonk shows `npm install -g deploymonk`.

### TASK R3: Work pages and LONEWOLF gallery
> Execute Task R3: build `/work` (filters, URL sync), `/work/[slug]` (4.7), the screenshot sync script and gallery with lightbox (Section 5), and update home Work section per 4.5. Add sitemap entries and `generateMetadata`.

**Acceptance:** `/work?filter=client` shows exactly 4 cards; dropping three PNGs into `/screenshots` and running `pnpm dev` shows them on `/work/lonewolf` with captions from filenames; lightbox keyboard-operable; empty-state shows when the folder is empty; LONEWOLF has no repo link.

### TASK R4: New sections, pages and navigation
> Execute Task R4: new nav with Work dropdown (4.4), stack strip, condensed process, about teaser, FAQ (4.5), plus `/process`, `/about`, `/faq`, `/privacy` (4.8-4.11) and the updated footer (4.13).

**Acceptance:** every nav link resolves; dropdown and mobile menu keyboard-accessible; pages share the existing visual language; FAQ accordion uses `aria-expanded`; no invented prices or timeframes anywhere.

### TASK R5: Contact and collaborate
> Execute Task R5: `/contact` with General and Collaborate tabs, `contactPayloadSchema`, `/api/contact` per Section 7, and Vitest tests (validation, role requirement for collaborate, honeypot drop, rate-limit isolation from `/api/order`).

**Acceptance:** both tabs deliver email with correct subjects and `Reply-To`; collaborate without `role` is rejected; spam is silently dropped; the privacy link appears under the form.

### TASK R6: Command palette, GitHub stats, UX functions
> Execute Task R6 per Section 6: command palette with `cmdk`, `lib/github.ts` with ISR and graceful fallback, toast, scroll progress, back-to-top, copy-email, active nav state, `?type=` deep links.

**Acceptance:** Ctrl/Cmd+K opens and every item works; with GitHub unreachable the site builds and renders without star badges; no console errors; all features respect `prefers-reduced-motion`.

### TASK R7: SEO, accessibility, tests, docs
> Execute Task R7: update JSON-LD (`sameAs`), metadata for all new routes, `sitemap.ts` (all pages and project slugs), per-page OG titles, Lighthouse and axe checks, and rewrite `README.md` (setup, env vars, Resend note, how to add screenshots, how to replace placeholder projects, how to turn them off). List every remaining `TODO(OWNER)` in a README section "Content to fill before launch".

**Acceptance:** Lighthouse >= 95 on Performance, Accessibility, Best Practices, SEO for `/`, `/work`, `/order`; sitemap lists every route; `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pass; no secrets in the client bundle.

---

## 9. DEFINITION OF DONE
- [ ] No "N" dev indicator in dev; no Discord reference anywhere in the codebase.
- [ ] Logo is used across navbar, footer, favicon, and social preview.
- [ ] Orders and contact messages are delivered to `script.monks.mail@gmail.com` via Resend.
- [ ] Wolf, DeployMonk and LONEWOLF show only facts from Section 2; invented entries are flagged and switchable.
- [ ] Screenshot folder auto-populates the LONEWOLF gallery.
- [ ] All new pages and features follow the locked design system.
