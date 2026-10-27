# ScriptMønks — website & order portal

Next.js 16 (App Router) + TypeScript strict + Tailwind v3.4. The site for a
solo-founded software house and digital agency, with an interactive
project-ordering flow (`/order`) that delivers leads by email (Resend).

Brand spelling is **`ScriptMønks`** in all display copy. ASCII identifiers stay
`Scriptmonks` / `Script_monks` (email, handles, domain).

## Setup

```bash
pnpm install
cp .env.example .env.local   # fill in values
pnpm dev                     # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | dev server |
| `pnpm build` | production build (runs `prebuild` checks first) |
| `pnpm start` | serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest unit + component tests |
| `pnpm verify` | brand, confidentiality, and asset checks (see below) |
| `pnpm sync:screenshots` | copy `screenshots/` into `public/` and regenerate `src/data/screenshots.generated.ts` |
| `pnpm brand:check` | enforce the `ScriptMønks` display spelling |

`pnpm verify` runs, in order: `sync-screenshots.mjs` → `check-brand.mjs` (asset
dimensions) → `confidentiality-check.mjs` (the firewall) → `brand-check.mjs`
(display spelling). All four must exit 0.

## Routes

| Route | Rendering | Notes |
|---|---|---|
| `/`, `/about`, `/contact`, `/faq`, `/order`, `/privacy`, `/process`, `/terms`, `/work` | Static | |
| `/work/[slug]` | SSG | `generateStaticParams`, `dynamicParams = false` |
| `/api/order`, `/api/contact` | Dynamic (Node) | email delivery via Resend |
| `/sitemap.xml`, `/robots.txt` | Static | |
| `/error/403`, `/error/429`, `/error/503` | Static | `noindex` |
| `/dev/force-error` | Dynamic | **dev only** — 404s in production |

## Environment variables (`.env.local`)

| Var | Required | Notes |
|---|---|---|
| `RESEND_API_KEY` | yes (forms) | Resend dashboard → API Keys. Server only. |
| `RESEND_FROM` | yes (forms) | must be a verified sender/domain in Resend |
| `LEAD_TO_EMAIL` | no | defaults to `script.monks.mail@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | yes in prod | canonical origin, used by metadata/sitemap/robots/JSON-LD |
| `NEXT_PUBLIC_SHOW_PLACEHOLDER_PROJECTS` | no | `true` shows placeholder portfolio cards |
| `GITHUB_TOKEN` | no | raises the GitHub API rate limit (used for the Wolf/DeployMonk release tag) |

**Secrets never reach the browser.** `RESEND_API_KEY` and `GITHUB_TOKEN` are read
only in server code. Never prefix them with `NEXT_PUBLIC_`.

### Resend note

Resend needs a **verified sender** before `RESEND_FROM` delivers.
`onboarding@resend.dev` works only for testing to the account owner. For
production: add the domain in Resend, set the DNS records, then use e.g.
`leads@scriptmonks.com`. A delivery failure returns `502` and the UI shows a
mailto fallback.

## Deployment

See [`DEPLOY.md`](DEPLOY.md) for every supported host, and
[`docs/HOSTING.md`](docs/HOSTING.md) for the one-line summary: this is a Next.js
app with server routes, so it needs a **Node runtime** (Vercel, Cloudflare, or
any Node host). **InfinityFree cannot run it** — it is shared PHP hosting.

## LONEWOLF screenshots

1. Drop images into `screenshots/` (repo root). A leading number sets the order
   (e.g. `01 dashboard.png`); the filename becomes the caption.
2. `pnpm dev` / `pnpm build` run `scripts/sync-screenshots.mjs` automatically.
3. The gallery renders on `/work/lonewolf`. Empty folder shows
   `[ SCREENSHOTS COMING SOON ]`.
4. **Blur or crop any personal data before adding screenshots.**

## Documentation

| File | Contents |
|---|---|
| `DEPLOY.md` | Hosting every supported way |
| `docs/HOSTING.md` | Host comparison and the InfinityFree constraint |
| `docs/LEGAL.md` | Legal-text source and the firewall redaction record |
| `docs/SOURCE_DOCUMENTS.md` | Index of the owner's `DOCCUMENTS/` folder |
| `docs/LAYOUT_AUDIT.md` | Navbar and layout defect log |
| `docs/PROGRESS.md` | Per-task history with real command evidence |
| `AGENTS.md` | Rules for coding agents working in this repo |

## Content to fill before launch (`TODO(OWNER)`)

Placeholders are marked `TODO(OWNER)` in code. Current list:

- `src/data/portfolio.ts` — `year` for Wolf, DeployMonk, and LONEWOLF; the
  `client.displayName` for two client entries; the 5 remaining lab-entry facts.
- `src/data/legal.ts` — sections 4.2 and 4.4 (redacted for the firewall; see
  `docs/LEGAL.md`), and section 6 when the Updates feature ships.
- `src/data/site.ts` — optional `extraMetric` (5th metrics tile) and
  `availability`.
- `@monk_mango` — confirm the second Instagram handle is public.
- ~~Boot-splash vs cold-load performance trade-off~~ — **resolved in V5-5**: the
  splash is now a non-covering panel, so the hero wins LCP. See `docs/PROGRESS.md`, V5-5.
- `SPEC_V3.md` is truncated; some historical tasks cannot be verified against it.

## Credits, Security & Legal
- [Credits & Attributions](docs/CREDITS.md) - All third-party dependencies and licenses
- [Security & Hosting Guide](docs/SECURITY_AND_HOSTING.md) - Complete security documentation, hosting recommendations, and troubleshooting
- [Security Policy](docs/SECURITY.md) - Security practices and reporting
- [Deployment Guide](DEPLOY.md) - Step-by-step deployment instructions
