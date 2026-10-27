# ScriptMønks Website — Progress Report
*Generated: 2026-10-24 | Branch: main | HEAD: 6765bd6*

## Executive summary

The site is in a **buildable, verifiably green** state. All automated gates pass, the core product flow works, hosting is documented honestly (including the InfinityFree constraint), legal pages are published with firewall-compliant redactions, and the cold-performance boot-splash trade-off has been resolved by owner decision.

- **Stack:** Next.js 16.4.2 (App Router), React 19.3.0, TypeScript 5 (strict), Tailwind CSS 3.4.19, pnpm 12.14.0
- **Source:** 120 files in `src/` · 8,369 total lines of TS/TSX
- **Tests:** 11 test files · 102 tests passing
- **Routes:** 16 page/route handlers (static, SSG, and server routes)
- **Gates:** lint 0, typecheck 0, test 102/102, build 0, verify 0

## Git history (recent)

| Commit | Message |
|---|---|
| `6765bd6` | docs: record owner confirmation of the V5-5 non-covering splash |
| `2acd486` | V5-5: non-covering boot splash + stop shipping zod to every route |
| `febe6b7` | V5-4: hosting readiness and documentation set |
| `a2cabbf` | V5-3: remove dead routes/links, version-free Wolf release, canonical /terms + /privacy |
| `1d69caf` | docs: correct the hydration-fix evidence with the dev-mode control test |
| `490d0c2` | V5-2: error pages & error handling (SPEC_V5 §2) |

Working tree is clean.

## Routes and rendering

| Route | Mode | Purpose |
|---|---|---|
| `/` | Static | Home page (hero, terminal, portfolio, services, process, FAQ, about teaser, CTA) |
| `/about`, `/contact`, `/faq`, `/order`, `/process`, `/privacy`, `/terms`, `/work` | Static | Public pages |
| `/work/[slug]` | SSG | Portfolio case studies (`generateStaticParams`, `dynamicParams = false`). Slugs: wolf, deploymonk, lonewolf, shopledger, routesheet, streamdock, booknook, pingpost, envlint, invoicemonk |
| `/api/order`, `/api/contact` | Dynamic (Node, `runtime = "nodejs"`) | Email delivery via Resend. Rate-limited (5/10 min), honeypot + 3s time trap, body cap 20KB, zod validation |
| `/error/403`, `/error/429`, `/error/503` | Static (`noindex`) | Branded error pages |
| `/dev/force-error` | Dynamic | Dev-only error-testing route |
| `/sitemap.xml`, `/robots.txt` | Static | Generated at build time |

## Portfolio

10 projects in `src/data/portfolio.ts`. Only real, non-placeholder entries are shown by default; placeholders require `NEXT_PUBLIC_SHOW_PLACEHOLDER_PROJECTS=true`.

| Slug | Kind | Status | Notes |
|---|---|---|---|
| `wolf` | product | released | Tauri/Rust desktop app. Release tag resolved from GitHub API (never hard-coded). Repo wired via `src/lib/github.ts`. |
| `deploymonk` | product | released | CLI tool on npm. Wired to GitHub API. |
| `lonewolf` | private | private | Closed-source; screenshot gallery system in place. |
| `shopledger`, `routesheet`, `streamdock`, `booknook` | client | delivered | Marked `isPlaceholder: true`. Year and client identity are `TODO(OWNER)`. |
| `pingpost`, `envlint`, `invoicemonk` | lab | prototype | Marked `isPlaceholder: true`. 5 lab-entry facts still `TODO(OWNER)`. |

Company facts (from `src/data/site.ts` and `Description.md`): ScriptMønks is a solo-founded software house/digital agency/software incubator. **4 client commissions delivered, 2 in-house products shipped** (Wolf, DeployMonk). 6-stage client lifecycle documented. Availability is configurable.

## Legal and compliance

**Published (firewall-compliant):**
- `/terms` and `/privacy` render from `src/data/legal.ts` via `src/components/legal/legal-page.tsx`. All text comes from `DOCCUMENTS/TERMS OF SERVICE & PRIVACY POLICY.docx` (2026-09-27, v1.0) with brand-name substitution only.
- Genuine clauses are published verbatim: acceptance, IP/usage rights and payment-contingent ownership, "as-is" disclaimer, NPR pricing and the 50/50 payment structure with delivery lock, late payments, liability and liability cap, the full Privacy Policy.

**Redacted (by owner-mandated firewall, `scripts/confidentiality-check.mjs`):**
| Section | Status | Reason |
|---|---|---|
| 4.2 — Payment methods | `TODO(OWNER)` | eSewa/Khalti/bank details withheld |
| 4.4 — Third-party arrangements | `TODO(OWNER)` | Named party and rate withheld (was described in the source as a referral arrangement) |
| 1.1 — Operator status | Generalised | Age/guardian/family language removed |
| 6 — Community posts | `TODO(OWNER)` | Updates feature not shipped; not published speculatively |

The rationale is fully documented in `docs/LEGAL.md`. The confidentiality and brand checks both pass.

## Performance and the boot splash (V5-5)

This was the owner's confirmed decision.

| Aspect | Before | After |
|---|---|---|
| Boot splash | Full-screen opaque overlay (`inset-0`) | Contained bottom-left panel (320×90, 2.5% viewport) |
| LCP element | Boot-splash text | Navbar wordmark (`scriptmønks_`) — real content |
| LCP render time | 4.7–5.5 s | ~0.9–1.1 s |
| elementRenderDelay | 1.2–1.7 s | 822 ms |
| All §106 requirements | Met | Met (session-only, ≤1.4s, 3 mono lines verbatim, key/click skip, reduced-motion skip, try/catch storage) |

The amendment to SPEC_V3 §106's "full-screen overlay" wording is **owner-confirmed** (committed in `6765bd6`). A separate fix removed zod and framer-motion from the client bundle for routes that don't use them: home page JS dropped from **639 kB → 543 kB raw**. Zod now only loads on `/order` and `/contact`.

## Hosting readiness

Documented across `DEPLOY.md` and `docs/HOSTING.md`.

| Host | Full app? | Order/Contact forms | Notes |
|---|---|---|---|
| **Vercel** (recommended) | Yes | Yes | Native Next.js, Route Handlers, `headers()`. |
| **Cloudflare Workers** (vinext) | Yes | Yes | Supported via vinext. |
| **Any Node host** (Railway, Render, Fly, VPS) | Yes | Yes | `pnpm build && pnpm start` with Node 20+. |
| **InfinityFree** | **No** | No | Shared PHP hosting with no Node runtime. `/api/order` and `/api/contact` require a server to call Resend, and `next.config.ts` headers aren't supported by a static export. A static export (`output: "export"`) is possible but degrades forms to mailto and drops headers — not recommended without owner approval. |

Environment variables documented in `.env.example`. `RESEND_API_KEY` and `GITHUB_TOKEN` are server-only, never exposed to the client.

## Error handling

V5-2 delivered a complete error surface: `src/lib/errors.ts` (17 error codes, `ApiError`, timeout/retry for GETs), `ErrorView` component, 404 page with branded UI and mini terminal, `error.tsx`/`global-error.tsx`, route-specific error pages at `/error/{403,429,503}`, offline banner, widget boundary, and dev `force-error` route. All e2e error-page checks pass.

## Verification and quality

**Current gate results (verified):**
```
lint       0
typecheck  0
test       11 passed / 11  |  102 passed / 102
build      0
verify     0  (sync-screenshots + check-brand + confidentiality-check + brand-check)
```

**E2e checks (all passing):**
- `check-error-pages.mjs`: 27/27 (production)
- `check-nav-behavior.mjs`: 16/16
- `check-header.mjs`: 0 defects at all widths

**Test suite:** `src/app/api/*` route tests, `components/error/error-view.test.tsx`, `lib/errors.test.ts`, `lib/validation.test.ts`, `lib/work.test.ts`, `lib/theme.test.ts`, `lib/delivery/*`, `data/portfolio.test.ts`, `data/content.test.ts`.

**Linting/formatting/typing:** ESLint 9, Prettier (with tailwind plugin), TypeScript strict. No `any`, no unused exports.

## Documentation set

| File | Purpose |
|---|---|
| `README.md` | Setup, scripts, routes, env vars, deployment pointers |
| `AGENTS.md` | Rules for coding agents |
| `DEPLOY.md` | Full deployment guide for all hosts, env reference, post-deploy checklist |
| `docs/HOSTING.md` | Host comparison + InfinityFree constraint (concise) |
| `docs/LEGAL.md` | Legal text sources and firewall redaction record |
| `docs/SOURCE_DOCUMENTS.md` | Index of the 6 `DOCCUMENTS/*.docx` files |
| `docs/CACHING.md` | Per-route caching strategy (verified against build) |
| `docs/SECURITY.md` | Implemented measures vs. planned backlog (honest split) |
| `docs/LAYOUT_AUDIT.md` | Navbar/layout defect log from V5-1 |
| `docs/PROGRESS.md` | Per-task history with real command evidence (V4-0 through V5-5) |
| `SPEC_V5.md` | Master spec (used for this work) |
| `SPEC_V4.md`, `SPEC_V3.md` (truncated), `SPEC_V2.md`, `SPEC.md` | Historical specs |

## Open TODOs (owner decisions / items)

| Item | Location | Status |
|---|---|---|
| Wolf/DeployMonk/LONEWOLF `year` + 2 client entries' `displayName` + 5 lab facts | `src/data/portfolio.ts` | `TODO(OWNER)` placeholders (5 in portfolio) |
| Payment methods and third-party arrangements wording | `src/data/legal.ts` sections 4.2, 4.4 | `TODO(OWNER)`, redacted for firewall |
| Updates/community-posts clause | `src/data/legal.ts` section 6 | `TODO(OWNER)`, feature not shipped |
| Optional 5th metrics tile | `src/data/site.ts` (`extraMetric`) | Optional |
| Confirm second Instagram handle `@monk_mango` is public | `src/data/site.ts` | Pending confirmation |
| Static export for InfinityFree | — | Decision needed: keep Vercel/Node only, or allow degraded static-export path |
| `SPEC_V3.md` full text missing (truncated at lines 71, 118) | `SPEC_V3.md` | Blocks verifying some historical tasks against the original spec |

## Security posture (current)

- Secrets only on server; never `NEXT_PUBLIC_`. `.env*` gitignored.
- Firewall (`confidentiality-check`) blocks forbidden terms from `src/`, `public/`, `README.md`, `DEPLOY.md`, `.env.example`. Brand check enforces `ScriptMønks` display spelling.
- Zod validation on all API inputs. Rate limiting (5/10 min/IP), honeypot + time trap, 20KB body cap.
- Headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`. CSP/HSTS/Permissions-Policy not yet set (backlog).
- No `dangerouslySetInnerHTML` outside JSON-LD. Errors never leak stack traces to visitors.
- In-memory rate limiting is per-instance only (documented upgrade path).

## Quick start

```bash
pnpm install
cp .env.example .env.local   # fill RESEND_API_KEY, RESEND_FROM, NEXT_PUBLIC_SITE_URL
pnpm dev                     # http://localhost:3000
pnpm verify                  # all offline checks
pnpm build && pnpm start     # production
```