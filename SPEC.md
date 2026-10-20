# SCRIPTMONKS WEBSITE: MASTER IMPLEMENTATION SPEC FOR OPENCODE

> **How to use:** Save this file in the repo root as `SPEC.md`. Start OpenCode and say:
> *"Read SPEC.md fully. Execute Task 1 only. Stop and report when its acceptance criteria pass."* Then proceed task by task (Section 5).
> **Rule for the agent:** Never invent client names, metrics, testimonials, or product claims. Use the placeholders defined in `src/data/*.ts` and leave `TODO(OWNER)` markers.

---

## 0. PROJECT BRIEF

| Key | Value |
|---|---|
| Company | **Scriptmonks**: solo-founded software house and digital agency |
| Site goal | Convert visitors into commission leads via an interactive **Order a Project** portal |
| Aesthetic | Neo-brutalist technical minimalism / modern terminal |
| Contact email | `script.monks.mail@gmail.com` |
| Instagram | `@Script_monks` → `https://instagram.com/Script_monks` |
| Discord | Community hub (invite URL via env `NEXT_PUBLIC_DISCORD_INVITE_URL`) |
| Proof | 4 delivered client commissions + 2 proprietary products: **Wolf** (Tauri/Rust desktop app) and **DeployMonk** (CLI scaffolder) |

### 0.1 Owner inputs still required (do NOT fabricate)
1. Final tagline approval (a default is provided in 3.1).
2. For each of the 4 client projects: title, one-line outcome, stack tags, year, and optionally a URL. Anonymized is fine.
3. Wolf: one-line description, repo/download URL, stack tags.
4. DeployMonk: one-line description, repo/npm URL, install command.
5. Discord invite URL, Discord webhook URL, Resend API key.
6. Availability status (open/limited/closed).

---

## 1. PROJECT ARCHITECTURE & TECH STACK

### 1.1 Decisions (final, not options)

| Concern | Choice | Reason |
|---|---|---|
| Framework | **Next.js 14+ (App Router), TypeScript strict** | API routes and server actions in one deploy; SEO; Vercel-ready |
| Styling | **Tailwind CSS v3.4** + CSS variables | Deterministic config |
| UI primitives | **shadcn/ui pattern** (hand-authored in `src/components/ui`, Radix where useful) restyled to the terminal aesthetic | Own the code, no default rounded/soft look |
| Icons | **lucide-react** | |
| Forms | **react-hook-form + zod + @hookform/resolvers** | One schema shared by client and server |
| Motion | **framer-motion** (minimal: step transitions, card hover, status pulse) | Respect `prefers-reduced-motion` |
| Email | **Resend** (server-side) | EmailJS is client-side and exposes keys, so it is not used |
| Chat delivery | **Discord webhook** (server-side only) | |
| Delivery mode | Env `LEAD_DELIVERY=discord \| email \| both` (default `both`) | Switchable without code changes |
| Fonts | `next/font/google`: **JetBrains Mono** (mono) + **Manrope** (sans) | |
| Hosting target | Vercel | |
| Package manager | `pnpm` | |
| Lint/format | ESLint (next/core-web-vitals), Prettier + `prettier-plugin-tailwindcss` | |

### 1.2 Folder structure

```
scriptmonks/
├─ SPEC.md
├─ AGENTS.md                      # agent rules (see 1.3)
├─ .env.example
├─ tailwind.config.ts
├─ next.config.mjs
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx               # fonts, metadata, <DotMatrix/>, <Navbar/>, <Footer/>
│  │  ├─ page.tsx                 # Hero → Services → Portfolio → CTA band
│  │  ├─ order/page.tsx           # dedicated order portal page
│  │  ├─ globals.css
│  │  ├─ not-found.tsx
│  │  ├─ sitemap.ts
│  │  ├─ robots.ts
│  │  └─ api/order/route.ts       # POST handler
│  ├─ components/
│  │  ├─ ui/                      # button, input, textarea, label, badge, card, progress, radio-card
│  │  ├─ layout/                  # navbar, footer, dot-matrix, section-label
│  │  ├─ sections/                # hero, services, portfolio, metrics-grid, cta-band
│  │  └─ order/                   # order-wizard, step-scope, step-budget, step-brief, step-contact, step-review, order-success
│  ├─ data/
│  │  ├─ site.ts                  # siteConfig (links, availability, tagline)
│  │  ├─ services.ts
│  │  └─ portfolio.ts             # products + clientProjects (TODO(OWNER) placeholders)
│  ├─ lib/
│  │  ├─ utils.ts                 # cn()
│  │  ├─ validation.ts            # zod schemas (shared client/server)
│  │  ├─ delivery/
│  │  │  ├─ discord.ts
│  │  │  ├─ email.ts
│  │  │  └─ index.ts              # dispatch by LEAD_DELIVERY
│  │  └─ rate-limit.ts
│  └─ types/order.ts              # ProjectOrderPayload & enums
└─ public/
   ├─ og.png                      # placeholder 1200x630
   └─ favicon.png                 # coral "[S]" glyph
```

### 1.3 `AGENTS.md` (create this file verbatim in Task 1)

```md
# Agent rules
- TypeScript strict. No `any`. No unused exports.
- Never hardcode secrets. Read from process.env; document in .env.example.
- Never expose DISCORD_WEBHOOK_URL or RESEND_API_KEY to the client (no NEXT_PUBLIC_ prefix).
- Use design tokens from tailwind.config.ts only. No arbitrary hex values in components.
- No border-radius above 2px anywhere. No gradients except the dot-matrix mask.
- Every interactive element needs a visible focus ring (coral) and keyboard access.
- Do not invent portfolio/client/product facts. Use TODO(OWNER) placeholders.
- After each task: run `pnpm lint && pnpm typecheck && pnpm build` and fix all errors before reporting.
```

### 1.4 `.env.example`

```
LEAD_DELIVERY=both
DISCORD_WEBHOOK_URL=
RESEND_API_KEY=
RESEND_FROM="Scriptmonks Leads <onboarding@resend.dev>"
LEAD_TO_EMAIL=script.monks.mail@gmail.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DISCORD_INVITE_URL=
```

> **Resend note for the owner:** until a custom domain is verified, `onboarding@resend.dev` can only deliver to the email that owns the Resend account. Register the Resend account with `script.monks.mail@gmail.com`.

---

## 2. DESIGN SYSTEM & TAILWIND CONFIGURATION

### 2.1 Color tokens

| Token (Tailwind class) | Hex | Use |
|---|---|---|
| `bg-dark` | `#09181B` | Page background |
| `bg-dark-surface` | `#0D2125` | Cards, inputs |
| `bg-dark-raised` | `#122A2F` | Hover/selected surfaces |
| `border-dark-border` | `#1D3B41` | Default 1px borders |
| `text-accent-coral` / `bg-accent-coral` | `#FF7A65` | Primary accent, CTAs, focus, status |
| `accent-coral-dim` | `#C85B4B` | Pressed state |
| `text-muted-teal` | `#6F9399` | Secondary text, labels |
| `text-ink` | `#E8F2F3` | Primary text |
| `matrix-dot` | `#2A4A50` | Dot-matrix dots |
| `status-ok` | `#5BE3A1` | "Accepting commissions" dot |

### 2.2 `tailwind.config.ts` (create exactly)

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#09181B",
          surface: "#0D2125",
          raised: "#122A2F",
          border: "#1D3B41",
        },
        accent: { coral: "#FF7A65", "coral-dim": "#C85B4B" },
        muted: { teal: "#6F9399" },
        ink: "#E8F2F3",
        matrix: { dot: "#2A4A50" },
        status: { ok: "#5BE3A1" },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: { none: "0", sm: "2px", DEFAULT: "2px" },
      boxShadow: {
        brutal: "4px 4px 0 0 #FF7A65",
        "brutal-sm": "2px 2px 0 0 #FF7A65",
        "brutal-muted": "4px 4px 0 0 #1D3B41",
      },
      keyframes: {
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
        pulseDot: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(91,227,161,.55)" },
          "70%": { boxShadow: "0 0 0 8px rgba(91,227,161,0)" },
        },
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
        "pulse-dot": "pulseDot 2s ease-out infinite",
      },
      maxWidth: { content: "72rem" },
    },
  },
  plugins: [],
};
export default config;
```

### 2.3 Typography rules

- **Mono (`font-mono`, JetBrains Mono):** all bracketed UI, section labels, step indicators, tags/badges, buttons, nav links, status text, code/CLI snippets. Always uppercase with `tracking-widest` for brackets and labels.
- **Sans (`font-sans`, Manrope):** headings (weight 700–800, `tracking-tight`) and body copy (400–500).
- Scale: H1 `text-4xl md:text-6xl`, H2 `text-3xl md:text-4xl`, body `text-base text-muted-teal` (use `text-ink` for emphasis), label `text-xs font-mono uppercase tracking-widest`.
- Bracket pattern (reusable): `[ LABEL ]` with spaces inside brackets. Brackets are rendered in `text-muted-teal`, the label text in `text-accent-coral` when active/primary.

### 2.4 `globals.css` (core rules)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { background: #09181B; color-scheme: dark; scroll-behavior: smooth; }
  body { @apply bg-transparent font-sans text-ink antialiased; }
  ::selection { background: #FF7A65; color: #09181B; }
  :focus-visible { outline: 2px solid #FF7A65; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
}

/* Dot-matrix background (rendered by <DotMatrix/>) */
.dot-matrix {
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background-color: #09181B;
  background-image: radial-gradient(circle at center, #2A4A50 1px, transparent 1.4px);
  background-size: 24px 24px;
  background-position: 12px 12px;
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, rgba(0,0,0,.35) 75%, rgba(0,0,0,.18) 100%);
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, rgba(0,0,0,.35) 75%, rgba(0,0,0,.18) 100%);
}
```

`<DotMatrix />` is simply `<div aria-hidden className="dot-matrix" />` rendered once in `layout.tsx`. **Do not use a `<canvas>`**; pure CSS keeps it light and SSR-safe.

### 2.5 Component styling contract

| Component | Spec |
|---|---|
| **Button (primary)** | `font-mono uppercase tracking-widest text-sm px-5 py-3 bg-accent-coral text-dark border border-accent-coral shadow-brutal-sm`; hover: `translate-x-[2px] translate-y-[2px] shadow-none`; label rendered as `[ LABEL ]` |
| **Button (secondary)** | Transparent bg, `border border-dark-border text-ink`, hover `border-accent-coral text-accent-coral` |
| **Card** | `bg-dark-surface border border-dark-border`; hover: `border-accent-coral shadow-brutal -translate-x-[2px] -translate-y-[2px]` (transition 150ms) |
| **Input/Textarea** | `bg-dark-surface border border-dark-border px-4 py-3 font-mono text-sm`; focus: `border-accent-coral`; error: `border-red-400` + mono error line prefixed `! ` |
| **Radio-card** | A selectable card; selected state = coral border + `shadow-brutal-sm` + `[ x ]` indicator, unselected = `[   ]` |
| **Badge/Tag** | `font-mono text-[11px] uppercase border border-dark-border px-2 py-0.5 text-muted-teal` |
| **Section label** | `// 01_SERVICES` style mono line in `text-accent-coral` above each H2 |
| **Progress** | Segmented 4-block bar plus text `STEP 02/04` |

---

## 3. CORE PAGES & UI SPECIFICATIONS

Global: max content width `max-w-content mx-auto px-6`. Sections separated by `border-t border-dark-border` with `py-24`. Fully responsive (mobile-first, test at 375px).

### 3.0 Navbar and layout
- Sticky top, `bg-dark/80 backdrop-blur border-b border-dark-border`.
- Left: wordmark `scriptmonks` with coral blinking cursor `_` (`animate-blink`).
- Right (desktop): `[ SERVICES ]` `[ WORK ]` `[ CONTACT ]` anchor links + primary button `[ ORDER PROJECT ]` → `/order`.
- Mobile: hamburger toggling a full-width panel (accessible: `aria-expanded`, Esc closes).

### 3.1 Hero (`sections/hero.tsx`)
- **Live status pill** (top): pulsing `status-ok` dot + mono text from `siteConfig.availability`:
  - `open` → `ACCEPTING COMMISSIONS`
  - `limited` → `LIMITED SLOTS`
  - `closed` → `WAITLIST ONLY` (dot switches to coral, no pulse)
- **H1 default tagline:** `We write the scripts that run your ideas.` (owner may override in `siteConfig.tagline`; the word "scripts" is colored coral).
- **Sub-copy (≤ 30 words):** `Scriptmonks is a solo-founded software house. Full-stack apps, CLI tools, desktop utilities, and API backends, shipped clean and on time.`
- **CTAs:** `[ EXPLORE WORK ]` (secondary → `#work`) and `[ ORDER PROJECT ]` (primary → `/order`).
- **Terminal decoration (right or below on mobile):** a static, non-interactive mono panel styled as a terminal (3 lines, typed-in on mount unless reduced motion):
  ```
  $ scriptmonks --status
  > projects_delivered: 4
  > products_shipped: 2
  > accepting_commissions: true
  ```
  Values are read from `siteConfig`/`portfolio.ts`, never hardcoded in JSX.

### 3.2 Services (`sections/services.tsx`), anchor `#services`
Label `// 01_SERVICES`, H2 `What we build`. 2x2 card grid (1 col mobile). Each card: lucide icon, mono index `01`, title, 2-line description, 3 tags.

| # | Title | Icon | Description | Tags |
|---|---|---|---|---|
| 01 | Full-Stack Web | `Globe` | Production web apps, from landing pages to authenticated SaaS dashboards. | Next.js, React, Postgres |
| 02 | Custom Utilities | `Wrench` | Desktop and automation tools that remove repetitive work from your day. | Tauri, Rust, Automation |
| 03 | API Backends | `Server` | Typed, documented, scalable APIs and integrations behind your product. | REST, Node, Auth |
| 04 | Freelance Commissions | `Handshake` | Hire a senior solo engineer for a defined scope with direct communication. | Fixed-scope, Retainer |

Data lives in `src/data/services.ts` as a typed array.

### 3.3 Portfolio / Track Record (`sections/portfolio.tsx`), anchor `#work`
Label `// 02_WORK`, H2 `Track record`.

**A. Metrics grid (`metrics-grid.tsx`):** 4 equal tiles (2x2 on mobile). Large mono numerals, label below.

| Tile | Value source |
|---|---|
| `04` Client projects delivered | `clientProjects.length` |
| `02` Proprietary products | `products.length` |
| `01` Founder, direct line | static text `SOLO` |
| `TODO(OWNER)` metric (e.g. years active) | `siteConfig.extraMetric`, hidden if undefined |

**B. Proprietary products (2 large interactive cards)**
Each card has: title, type badge, 1-line description, stack tags, a mono "terminal snippet" area, and links.

- **Wolf**: badge `DESKTOP APP`, tags `Tauri` `Rust` (+ owner extras). Card shows a mock window chrome (three square dots in the header) and a placeholder screenshot box (`public/work/wolf.png`; if missing, render a dotted placeholder with `[ SCREENSHOT PENDING ]`). Links: `[ VIEW ]` → `href` from data (hide if unset).
- **DeployMonk**: badge `CLI SCAFFOLDER`. Shows an interactive copy-to-clipboard snippet block with the install/run command from data (`TODO(OWNER)` default: `npx deploymonk init`). Clicking copies and flips the label to `[ COPIED ]` for 1.5s.
- **Interaction:** hover/focus lifts the card (see Card spec); on desktop, expanding a card is NOT required. Keep it simple and fast.

**C. Delivered client projects (4 cards, 2x2 grid, smaller than product cards)**
Fields per item: `id`, `title`, `category`, `year`, `outcome` (1 line), `stack[]`, optional `url`. Render with `[ DELIVERED ]` badge. Placeholders until owner fills:
```ts
{ id: "client-01", title: "TODO(OWNER): Project title", category: "TODO(OWNER)", year: "TODO(OWNER)", outcome: "TODO(OWNER): one-line result", stack: [] }
```
Cards without a `url` are non-clickable (no dead links).

### 3.4 Interactive Project Ordering Flow (CORE FEATURE), route `/order`

Also render a compact CTA band (`sections/cta-band.tsx`) on the home page: `Have a project in mind?` + `[ ORDER PROJECT ]`.

**Layout:** two columns on desktop. Left: sticky info panel (what happens next: `01 You submit → 02 Reply within 24-48h → 03 Scope call → 04 Proposal`) and the contact email. Right: wizard card.

**Wizard behavior (`order-wizard.tsx`, client component)**
- Single `useForm<OrderFormValues>` with `mode: "onTouched"`; state machine `step: 1|2|3|4|5(review)|"success"`.
- Per-step validation using that step's zod sub-schema via `trigger([...fields])` before advancing.
- Progress component at top: `STEP 0X/04` + 4-segment bar. Review is shown as step 4's final sub-screen ("confirm") before submit.
- Buttons: `[ BACK ]` (hidden on step 1) and `[ NEXT ]`; on the final screen `[ SUBMIT ORDER ]`.
- Framer-motion slide/fade between steps (150-200ms); disabled under reduced motion.
- Persist draft in `sessionStorage` (key `sm_order_draft_v1`), restore on mount, clear on success.
- Keyboard: Enter advances (except inside textarea); focus moves to the step heading on step change; errors use `aria-live="polite"`.
- Submit → `POST /api/order`; show loading state `[ TRANSMITTING... ]`; on error show inline mono error `! TRANSMISSION FAILED: <message>` plus fallback line `Email us directly: script.monks.mail@gmail.com`; do not clear the form.
- Success screen: `[ ORDER RECEIVED ]`, reference ID (`SM-` + 6 char uppercase from server response `ref`), what happens next, button `[ BACK HOME ]`, and `[ JOIN DISCORD ]`.

**Step 1: Scope & Type** (field `projectType`, required, radio-cards, 2x2)
| Value | Label | Hint |
|---|---|---|
| `custom-software` | Custom Software | Bespoke systems built around your workflow |
| `utility` | Utility | Focused tool or automation |
| `cli` | CLI | Developer-facing command-line tooling |
| `full-app` | Full App | End-to-end web/desktop/mobile product |

**Step 2: Budget & Timeline** (both required, radio-cards in a stacked list)
- `budget` (USD): `under-250` "< $250", `250-1k` "$250 – $1k", `1k-3k` "$1k – $3k", `3k-10k` "$3k – $10k", `10k-plus` "$10k+", `not-sure` "Not sure yet".
- `timeline`: `asap` "ASAP (< 2 weeks)", `2-4-weeks` "2 – 4 weeks", `1-2-months` "1 – 2 months", `flexible` "Flexible".

**Step 3: Project Brief**
- `title` (required, 3–80 chars): "Project name / working title".
- `description` (required, 40–3000 chars), textarea with live counter `0123/3000` (mono). Placeholder prompts: goals, target users, must-have features, existing systems.
- `references` (optional, up to 3 URLs, one per line input or repeatable field), each must be a valid URL.

**Step 4: Contact**
- `name` (required, 2–80).
- `email` (required, valid email).
- `discord` (optional, validated by regex `^(?!.*\.\.)[a-z0-9_.]{2,32}$` after lowercasing and stripping a leading `@`; helper text: "Your Discord username so we can reply fast").
- `company` (optional).
- `preferredContact`: `email | discord` (default `email`; if `discord` selected then `discord` becomes required, via zod `superRefine`).
- Hidden honeypot field `website` (visually hidden, `tabIndex={-1}`, `autoComplete="off"`).
- Consent line (static text, no checkbox): "By submitting you agree we may contact you about this project."

**Review screen:** read-only summary of all fields grouped by step with `[ EDIT ]` links jumping back to that step.

### 3.5 Footer (`layout/footer.tsx`)
- 3 columns (stack on mobile): brand + one-line description / nav links / connect.
- Connect links (all `rel="noopener noreferrer" target="_blank"` for external):
  - `[ DISCORD ]` → `NEXT_PUBLIC_DISCORD_INVITE_URL` (hidden if empty)
  - `[ INSTAGRAM ]` → `https://instagram.com/Script_monks` (display `@Script_monks`)
  - `[ EMAIL ]` → `mailto:script.monks.mail@gmail.com`
- Bottom bar: `© {new Date().getFullYear()} Scriptmonks` and mono `BUILT WITH CAFFEINE & RUST`. The owner may change this later; keep as constant in `siteConfig`.

### 3.6 SEO and meta
Title `Scriptmonks | Software House & Digital Agency`, description from hero sub-copy, OpenGraph + Twitter card (`/og.png`), `sitemap.ts` (`/`, `/order`), `robots.ts`, JSON-LD `Organization` on the home page.

---

## 4. DATA STRUCTURES & API LOGIC

### 4.1 `src/types/order.ts`

```ts
export const PROJECT_TYPES = ["custom-software", "utility", "cli", "full-app"] as const;
export const BUDGETS = ["under-250", "250-1k", "1k-3k", "3k-10k", "10k-plus", "not-sure"] as const;
export const TIMELINES = ["asap", "2-4-weeks", "1-2-months", "flexible"] as const;
export const CONTACT_METHODS = ["email", "discord"] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type BudgetRange = (typeof BUDGETS)[number];
export type Timeline = (typeof TIMELINES)[number];
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export interface ProjectOrderPayload {
  scope: { projectType: ProjectType };
  commercial: { budget: BudgetRange; timeline: Timeline };
  brief: { title: string; description: string; references: string[] };
  contact: {
    name: string;
    email: string;
    discord?: string;
    company?: string;
    preferredContact: ContactMethod;
  };
  meta: {
    startedAt: number;   // epoch ms when wizard mounted (time-trap)
    honeypot: string;    // must be "" for humans
    source: string;      // e.g. "web:/order"
  };
}

export interface OrderApiSuccess { ok: true; ref: string }
export interface OrderApiError { ok: false; error: string; fieldErrors?: Record<string, string[]> }
```

### 4.2 `src/lib/validation.ts` (single source of truth)

Implement with zod, exporting:
- `stepScopeSchema`, `stepCommercialSchema`, `stepBriefSchema`, `stepContactSchema` (used by the client per step).
- `orderPayloadSchema` = composition of the above plus `meta`, typed to match `ProjectOrderPayload` (`z.infer` must be assignable; add a compile-time check).
- Normalizers: trim all strings, lowercase email, strip leading `@` from `discord` and lowercase it, drop empty reference strings.
- `contact` `superRefine`: if `preferredContact === "discord"` then `discord` is required.
- Export human-readable label maps: `PROJECT_TYPE_LABELS`, `BUDGET_LABELS`, `TIMELINE_LABELS` (used by the form, the Discord embed, and the email).

### 4.3 `src/app/api/order/route.ts` (POST)

**Runtime:** `export const runtime = "nodejs"`.

**Algorithm (in order):**
1. Reject non-JSON or bodies > 20 KB → `413/400` with `OrderApiError`.
2. **Rate limit:** `rateLimit(ip, { max: 5, windowMs: 10 * 60_000 })` using `x-forwarded-for` first IP; return `429` with `Retry-After`. `lib/rate-limit.ts` is an in-memory `Map` (document in a code comment that it is best-effort on serverless; Upstash Redis is the upgrade path).
3. Parse with `orderPayloadSchema.safeParse`; on failure return `400` with `fieldErrors` from `error.flatten().fieldErrors`.
4. **Spam checks:** if `meta.honeypot !== ""` → return a fake `200 { ok: true, ref }` and do NOT deliver. If `Date.now() - meta.startedAt < 3000` → same silent drop.
5. Generate `ref = "SM-" + random 6 chars [A-Z0-9]` (use `crypto.randomBytes`).
6. `await deliverOrder(payload, ref)` from `lib/delivery/index.ts`:
   - Reads `LEAD_DELIVERY` (`discord | email | both`, default `both`).
   - Runs selected channels with `Promise.allSettled`.
   - **Success if at least one channel succeeded.** Log (console.error) failed channels without leaking secrets.
   - If all selected channels fail → throw → route returns `502 { ok:false, error:"Delivery failed. Please email script.monks.mail@gmail.com" }`.
7. Return `200 { ok: true, ref }`.

### 4.4 `lib/delivery/discord.ts`

POST JSON to `process.env.DISCORD_WEBHOOK_URL`. **Respect Discord limits** (embed title ≤ 256, field name ≤ 256, field value ≤ 1024, description ≤ 4096, total embed ≤ 6000). Write a `clip(str, max)` helper that appends `…`.

```ts
// Payload shape
{
  username: "Scriptmonks Leads",
  allowed_mentions: { parse: [] },   // prevent @everyone/@here injection from user text
  embeds: [{
    title: `📥 New Project Order · ${ref}`,
    color: 0xFF7A65,
    description: clip(brief.description, 1800),
    fields: [
      { name: "Project",  value: clip(brief.title, 200), inline: false },
      { name: "Type",     value: PROJECT_TYPE_LABELS[type], inline: true },
      { name: "Budget",   value: BUDGET_LABELS[budget],     inline: true },
      { name: "Timeline", value: TIMELINE_LABELS[timeline], inline: true },
      { name: "Name",     value: clip(name, 200),           inline: true },
      { name: "Email",    value: email,                     inline: true },
      { name: "Discord",  value: discord ? `\`${discord}\`` : "—", inline: true },
      { name: "Company",  value: company || "—",            inline: true },
      { name: "Prefers",  value: preferredContact,          inline: true },
      { name: "References", value: refs.length ? clip(refs.join("\n"), 1000) : "—" }
    ],
    timestamp: new Date().toISOString(),
    footer: { text: "scriptmonks.site /order" }
  }]
}
```
Treat any non-2xx as failure (`throw new Error("discord " + res.status)`). Escape markdown in user text where used inside field values (backticks, `*`, `_`, `~`, `|`, `>`).

### 4.5 `lib/delivery/email.ts`

```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: process.env.RESEND_FROM!,
  to: [process.env.LEAD_TO_EMAIL ?? "script.monks.mail@gmail.com"],
  replyTo: payload.contact.email,
  subject: `[Scriptmonks] New order ${ref}: ${payload.brief.title}`,
  html,   // built by buildOrderHtml(); escape ALL user input with an escapeHtml() helper
  text,   // plain-text fallback with the same fields
});
```
- `buildOrderHtml` uses a simple table, dark-on-light safe styling (inline CSS only), coral header bar, and a `Reply` mailto button. **Escape every interpolated value.** Check the `{ error }` field in Resend's response and throw if present.

### 4.6 Security checklist (must pass)
- Secrets only in server code; grep build output for `DISCORD_WEBHOOK_URL`/`RESEND_API_KEY` (must be absent from client bundles).
- Zod validation server-side regardless of client validation.
- `allowed_mentions.parse = []` on Discord.
- HTML-escaped email; no raw user HTML.
- Add basic security headers in `next.config.mjs`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`.

---

## 5. STEP-BY-STEP OPENCODE EXECUTION PLAN

Run one task per session prompt. After each task the agent must run `pnpm lint && pnpm typecheck && pnpm build`, then summarize files changed. **Do not start the next task until asked.**

### TASK 1: Setup & Design Tokens
**Prompt to OpenCode:**
> Read SPEC.md. Execute Task 1. Initialize Next.js (App Router, TypeScript, Tailwind v3.4, ESLint, `src/` dir, pnpm). Install: `lucide-react framer-motion react-hook-form zod @hookform/resolvers resend clsx tailwind-merge class-variance-authority`; dev: `prettier prettier-plugin-tailwindcss`. Create `tailwind.config.ts` exactly per Section 2.2, `globals.css` per 2.4, `AGENTS.md` per 1.3, `.env.example` per 1.4, and `src/lib/utils.ts` (`cn`). Configure `next/font/google` with JetBrains Mono (`--font-mono`) and Manrope (`--font-sans`) in `layout.tsx`. Add the `typecheck` script (`tsc --noEmit`).

**Acceptance:** build passes; a scratch page shows `bg-dark`, coral text, mono and sans fonts correctly; no default Next boilerplate remains.

### TASK 2: Layout & Matrix Grid
**Prompt:**
> Execute Task 2. Create `ui/` primitives (button with `primary|secondary` variants rendering `[ LABEL ]`, card, badge, input, textarea, label, radio-card, progress) per Section 2.5. Create `layout/dot-matrix.tsx`, `navbar.tsx` (with mobile menu), `footer.tsx`, and `section-label.tsx`. Wire into `layout.tsx` with metadata per 3.6. Implement `data/site.ts` (`siteConfig`: name, tagline, availability, links, extraMetric?). Build the Hero (3.1) and Services (3.2, with `data/services.ts`) on `app/page.tsx`.

**Acceptance:** dot grid visible and fading downward; navbar sticky; hero status pill pulses (static under reduced motion); responsive at 375px and 1440px; Lighthouse accessibility ≥ 95.

### TASK 3: Portfolio Components
**Prompt:**
> Execute Task 3. Create `data/portfolio.ts` with typed `products` (Wolf, DeployMonk) and exactly 4 `clientProjects` placeholders marked `TODO(OWNER)`. Build `metrics-grid.tsx`, product cards (Wolf window-chrome card with screenshot fallback; DeployMonk copy-to-clipboard snippet), and client project cards per Section 3.3. Add `cta-band.tsx`. Assemble on the home page with anchors `#services` and `#work`.

**Acceptance:** exactly 2 product cards and 4 client cards render from data; no dead links; clipboard copy works with `[ COPIED ]` feedback; hover/focus styles keyboard-accessible.

### TASK 4: Multi-step Order Form
**Prompt:**
> Execute Task 4. Create `types/order.ts` and `lib/validation.ts` per 4.1–4.2. Build `/order` page and the wizard components per Section 3.4: 4 steps plus review and success screens, per-step validation, sessionStorage draft, animated transitions, honeypot, time-trap `startedAt`. For now, the submit handler calls `POST /api/order` and handles `ok/ref/error` responses; implement a **temporary** route stub that validates and returns `{ ok: true, ref }` so the UI can be fully tested.

**Acceptance:** cannot advance with invalid data; discord required when it is the preferred contact; draft restores on reload; review screen edit links work; success shows ref; full keyboard operation; no console errors.

### TASK 5: Webhook / Email Integration
**Prompt:**
> Execute Task 5. Replace the stub with the real `app/api/order/route.ts` per 4.3. Implement `lib/rate-limit.ts`, `lib/delivery/discord.ts`, `lib/delivery/email.ts`, and `lib/delivery/index.ts` per 4.4–4.5 with `LEAD_DELIVERY` switching and `Promise.allSettled`. Add security headers per 4.6. Add unit tests (Vitest) for: schema normalization, honeypot/time-trap silent drop, `clip()`, `escapeHtml()`, and delivery mode selection (mock fetch/Resend).

**Acceptance:** with a real webhook URL, a submission produces an orange Discord embed; with a Resend key, an email reaches `script.monks.mail@gmail.com` with `Reply-To` set to the client; if one channel fails in `both` mode the user still sees success; if all fail the user sees the fallback email message; secrets absent from client bundle.

### TASK 6: Polish & Launch Checklist
**Prompt:**
> Execute Task 6. Add `not-found.tsx`, `sitemap.ts`, `robots.ts`, JSON-LD, favicon, and `og.png` placeholder. Audit: reduced-motion behavior, focus rings, color contrast (coral on dark ≥ 4.5:1 for text; use `ink` for small text if not), image alt text, no layout shift. Write a `README.md` covering setup, env vars, Resend note, Discord webhook creation (Server Settings → Integrations → Webhooks), and Vercel deployment.

**Acceptance:** Lighthouse ≥ 95 on Performance, Accessibility, Best Practices, SEO (desktop); all `TODO(OWNER)` markers listed in README under "Content to fill before launch".

---

## 6. DEFINITION OF DONE (GLOBAL)
- [ ] All four order steps work end to end and deliver leads via the configured channel(s).
- [ ] Zero invented facts; every placeholder is marked `TODO(OWNER)`.
- [ ] Only design tokens used; zero rounded corners above 2px.
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` all pass.
- [ ] No secrets in client bundle or repo.
