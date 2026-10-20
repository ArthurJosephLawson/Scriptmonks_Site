# Scriptmonks — marketing site + order portal

Next.js 16 (App Router) + TypeScript strict + Tailwind v3.4. Solo software-house
site with an interactive project-ordering flow (`/order`) that delivers leads
by email (Resend).

## Setup

```bash
pnpm install
cp .env.example .env.local   # fill in values
pnpm dev                     # http://localhost:3000
```

Scripts:

| Command | What it does |
|---|---|
| `pnpm dev` | dev server |
| `pnpm build` | production build |
| `pnpm start` | serve production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest unit tests |
| `pnpm exec tsc scripts/check-validation.ts --module commonjs --target es2022 --moduleResolution node --esModuleInterop --skipLibCheck --strict --outDir /tmp/check && NODE_PATH="$PWD/node_modules" node /tmp/check/scripts/check-validation.js` | schema check script |

## Environment variables (`.env.local`)

| Var | Required | Notes |
|---|---|---|
| `RESEND_API_KEY` | yes | Resend dashboard → API Keys |
| `RESEND_FROM` | yes | e.g. `Scriptmonks Leads <onboarding@resend.dev>`; must be a verified sender/domain in Resend |
| `LEAD_TO_EMAIL` | no | defaults to `script.monks.mail@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | yes in prod | canonical origin, used by metadata/sitemap/robots/JSON-LD |
| `NEXT_PUBLIC_SHOW_PLACEHOLDER_PROJECTS` | no | `true` shows placeholder portfolio cards |
| `GITHUB_TOKEN` | no | raises GitHub API rate limit (used by R5 project fetch) |

**Secrets:** `RESEND_API_KEY` and `GITHUB_TOKEN` are read only in server
code. Never prefix them with `NEXT_PUBLIC_`. The build output is grepped to
confirm they never reach client bundles.

### Resend note

Resend needs a **verified sender** (domain or single address) before
`RESEND_FROM` will deliver. `onboarding@resend.dev` works only for testing to
the account owner. For production: add your domain in Resend, set the DNS
records, then use e.g. `leads@yourdomain.com`. Delivery failure returns `502`
with a mailto fallback in the UI.

## LONEWOLF screenshots

1. Drop images into `screenshots/` (repo root). Filenames become captions; a
   leading number sets the order (e.g. `01 dashboard.png`).
2. `pnpm dev` / `pnpm build` run `scripts/sync-screenshots.mjs` automatically
   (`predev` / `prebuild`), copying files to `public/screenshots/lonewolf/` and
   regenerating `src/data/screenshots.generated.ts`. Manual run:
   `pnpm sync:screenshots`.
3. The gallery renders on `/work/lonewolf`; the first screenshot is the hero
   image on the LONEWOLF cards. Empty folder shows `[ SCREENSHOTS COMING SOON ]`.
4. **Blur or crop any personal data before adding screenshots.**

## Lead flow

`POST /api/order`: rate-limited (5 / 10 min per IP, in-memory — per-instance on
serverless; upgrade path is a shared store like Upstash Redis), zod-validated,
spam-checked (honeypot + 3s fill-time trap return a fake success and deliver
nothing), then delivered by email. Delivery failure returns `502` with a
mailto fallback in the UI.

## Deployment (Vercel)

1. Push the repo to GitHub (owner task) and import it in Vercel.
2. Set the environment variables above in **Project → Settings → Environment
   Variables** (Production + Preview).
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin (e.g.
   `https://scriptmonks.site`).
4. Deploy. `/order` and `/api/order` are dynamic; `/`, `/sitemap.xml`,
   `/robots.txt` are static.
5. Point the Resend domain at production values.

## Content to fill before launch

All placeholders live in `src/data/portfolio.ts` and are marked `TODO(OWNER)`:

- **Wolf** description (`TODO(OWNER): one-line description`)
- **DeployMonk** description (`TODO(OWNER): one-line description`)
- **4 client project cards**: title, category, year, outcome (all
  `TODO(OWNER)`)
- Wolf screenshot asset `public/work/wolf.png` (`TODO(OWNER)` — falls back to
  `[ SCREENSHOT PENDING ]` while missing)- Optional: `siteConfig.extraMetric` in `src/data/site.ts` (5th metrics tile,
  hidden while `undefined`)
- Optional: `siteConfig.availability` (`open` | `limited` | `closed`)
- `logo.png` (repo root) has an opaque cream background (#F0F2E5) — owner may
  want a transparent/dark variant for the navbar

## Audit notes (Task 6)

- **Reduced motion:** `useReducedMotion` disables wizard slide transitions;
  CSS `prefers-reduced-motion` rules park the status pulse, blink cursor, and
  marquee-style animations.
- **Focus rings:** every interactive element has a coral visible focus ring
  (`focus-visible` / `has-[:focus-visible]` on radio-cards).
- **Contrast:** coral `#FF7A65` on `#0A0A0A` ≈ 7.75:1 (passes AA for all text
  sizes); muted teal used for small secondary text.
- **Alt text:** product screenshot has descriptive alt + `[ SCREENSHOT
  PENDING ]` fallback on error; decorative layers are `aria-hidden`.
- **Layout shift:** fonts via `next/font`; the screenshot box is aspect-boxed;
  no injected content above the fold.

## Content to fill before launch

The following `TODO(OWNER)` placeholders remain in the codebase and must be
updated with final factual content before publishing:

- `src/data/portfolio.ts` — 3 client entries have `year: "TODO(OWNER)"`
- `src/data/portfolio.test.ts` — asserts lonewolf year is `TODO(OWNER)` (update if year changes)

Notes: All other content is derived from SPEC_V2.md facts (no invented
prices/timeframes). Placeholder projects are gated by
`NEXT_PUBLIC_SHOW_PLACEHOLDER_PROJECTS === "true"`.
