# SCRIPTMØNKS WEBSITE: V5 MASTER SPEC FOR OPENCODE

> **This is a NEW session with NO memory.** Rebuild understanding from the repository, never from guesses.
> **How to use:** save as `SPEC_V5.md` in the repo root. Tell OpenCode:
> *"Read SPEC_V5.md fully. Run Task V5-0 only. Stop and report with real command output."* Then V5-1 … V5-11, one task at a time. If a session fills up, start a new one and say: *"Read SPEC_V5.md and docs/PROGRESS.md, then continue with the next task."*
> If OpenCode does not load `AGENTS.md` automatically, paste it at the start of each session.

---

## 0. WHAT THIS PROJECT IS

**ScriptMønks** (brand spelling; ASCII identifiers stay `Scriptmonks`/`Script_monks`) is a solo-founded, independent software development house and digital agency, and an independent software incubator. It earns from client commissions (custom software, web apps, utilities, API backends, freelance gigs) and builds in-house products. Track record: **4 client commissions delivered, 2 in-house projects completed** (Wolf, DeployMonk), plus LONEWOLF (private, closed source).

The website is a **Next.js (App Router) + TypeScript + Tailwind** site in a neo-brutalist terminal style (dark `#09181B`, accent coral `#FF7A65`, dot-matrix background, bracketed `[ LABEL ]` buttons, mono accents, sans body). Core feature: an **Order a Project** wizard that emails leads to `script.monks.mail@gmail.com`. The owner **loves the design: it stays locked.**

### Owner/public facts (the only facts you may use)
- Name `ScriptMønks`; email `script.monks.mail@gmail.com`; Instagram `@Script_monks` and `@monk_mango` (`TODO(OWNER)`: confirm the second is public); GitHub company `@Script_monks`, developer `@ArthurJosephLawson`; domain `scriptmonks.com`.
- Founder: Arthur Joseph Lawson (alias Monk_Mango), Founder & Lead Developer.
- Prices: **NPR 200 – 5,000 per project**; payment **NPR, cash only for now** (online payment may come later); 50% before work starts, 50% before final delivery.
- Products: **Wolf** (local-first Linux desktop companion, Tauri + Rust + React/TypeScript, SQLite, no network requests, MIT), **DeployMonk** (zero-config CLI project scaffolder, npm `deploymonk`, MIT), **LONEWOLF** (private self-hosted command center, FastAPI + SQLite + Jinja2, closed source).
- **Do not hard-code Wolf's version number.** The owner's own materials disagree (v0.3.0 vs v0.4.0). Read the latest release tag from the GitHub API with a safe fallback (Section 8.2).
- Detailed source documents are the earlier spec files (`SPEC.md`, `SPEC_V2.md`, `SPEC_V3.md`, `SPEC_V4.md`). Exact legal text lives in `SPEC_V3.md` §5 and `SPEC_V4.md` §6.9. **If any of these files is missing, stop and tell the owner. Never recreate legal text from memory.**

---

## 1. BOOTSTRAP & PROTOCOL (applies to every task)

### 1.1 Rules (all earlier rules remain in force)
1. **Anti-hallucination:** `SPEC_V3.md` §0 and the confidentiality firewall in `SPEC_V3.md` §1 are mandatory. Facts only from this document and the earlier specs. Missing facts become `TODO(OWNER)`. Never claim success without pasted real command output.
2. **Verify unfamiliar APIs against current documentation** before using them. Use your web search/fetch tools (for example the connected search MCPs) on official sources: nextjs.org, supabase.com/docs, resend.com/docs, developers.cloudflare.com, vercel.com/docs, playwright.dev. Do not rely on memory for Next.js caching, CSP, or Supabase calls: check the installed version's types and docs.
3. **Design is locked** (tokens, fonts, dot-matrix, bracketed buttons, brutal shadows, 2px radius cap). Layout and spacing may be improved (Section 10) but tokens may not change. The only allowed Tailwind config change is the CSS-variable theme indirection from `SPEC_V4.md` §3.
4. **No new dependencies** except those named in this file or the earlier specs. Use `pnpm add` and keep the versions it resolves.
5. **Work sequentially.** If you spawn sub-agents or background tasks, give them disjoint files and review every diff before accepting it.
6. **Context hygiene:** read files selectively, keep reports short, and update `docs/PROGRESS.md` after every task.
7. **Commits:** first run `git status`. If there are uncommitted changes from an earlier session, commit them as `chore: checkpoint before V5`. Then commit after each task (`V5-n: summary`). Never rewrite history, never discard work.

### 1.2 Master checklist: review what is done (Task V5-0)

For every row, inspect the repo and mark `DONE | PARTIAL | MISSING` with **concrete evidence** (file path, script output, or a screenshot). Present the full table. **Leave DONE items alone. Finish PARTIAL items. Build MISSING items** by following the referenced spec section exactly. Do this in the order shown, one group at a time, reporting after each group.

| ID | Requirement | Spec reference |
|---|---|---|
| A1 | Next.js App Router, TS strict, Tailwind 3.4, pnpm; `lint`, `typecheck`, `test`, `build`, `verify` scripts | SPEC §1 |
| A2 | Design tokens, fonts, dot-matrix CSS, `ui/` primitives | SPEC §2 |
| A3 | Hero (status pill, tagline, CTAs), Services (4 cards), Footer | SPEC §3; V2 §4 |
| A4 | Order wizard: 4 steps + review + success; shared zod schemas | SPEC §3.4, §4; V3 §4 |
| A5 | SEO: metadata, sitemap, robots, JSON-LD, OG image | SPEC §3.6; V3 §3.5 |
| B1 | Next.js dev "N" indicator removed | V2 §4.1 |
| B2 | Logo assets in `public/brand`, brand scripts, navbar/footer/hero placement, boot splash | V3 §3 |
| B3 | Rename to ScriptMønks with `brand-check` script; blinking cursor kept | V4 §1, §2 |
| C1 | Real facts for Wolf, DeployMonk, LONEWOLF only | V2 §2, §3.5 |
| C2 | 4 anonymous client entries + 8 lab entries, `isPlaceholder` flag and hide switch | V3 §7 |
| C3 | LONEWOLF screenshot pipeline (`/screenshots` → gallery + lightbox) | V2 §5 |
| C4 | Pages: `/work`, `/work/[slug]`, `/process`, `/about`, `/faq`, `/contact` (general only), `/terms`, `/privacy` | V2 §4; V3 §5 |
| C5 | NPR 200–5,000 budgets, cash payment copy, consent checkbox, email-only delivery, mailto fallback, lazy Resend | V3 §4 |
| C6 | Legal text exactly as specified, including Updates additions | V3 §5; V4 §6.9 |
| C7 | Follow section (Instagram, GitHub, stars) | V4 §5 |
| D1 | Command palette, GitHub stats, toast, scroll progress, back-to-top, copy email | V2 §6 |
| D2 | Progress/XP/ranks/achievements/Codex (accent themes and CRT free for all) | V3 §6.1; V4 §0.2, §3.3 |
| D3 | Interactive terminal, dot glow, scroll reveal, DeployMonk explorer, Wolf tour | V3 §6.2 |
| D4 | Smooth theme changer with live preview | V4 §3 |
| D5 | Route transitions, nav progress, skeletons, 404 terminal | V4 §4 |
| D6 | Arcade with six games and daily Cracker | V3 §6.3; V4 §7 |
| E1 | Community Updates: schema, store, filter, rate limits, image handling, moderation email/page, UI | V4 §6 |
| F1 | `confidentiality-check` passes | V3 §1 |
| F2 | Host-ready: `DEPLOY.md`, env example, build passes with no env vars | V3 §8; V4 §8 |
| F3 | `docs/MODERATION.md`, `docs/PROGRESS.md` | V4 §6.10, §0.3 |

Also run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` and report the tail of the real output. Create `docs/PROGRESS.md` (task id, status, files changed, commands run, open `TODO(OWNER)` items) and append to it after every task.

---

## 2. ERROR PAGES & ERROR HANDLING (Task V5-2)

**Goal:** when anything goes wrong, the visitor sees a clear, friendly message in the site's style, never a blank page, raw JSON, a stack trace, or a cryptic code.

### 2.1 Shared `ErrorView` component (`components/error/error-view.tsx`)
Props: `code` (number or string), `title`, `message`, `actions`, `reference?`. Layout: terminal-style card on the dot-matrix, big mono status line (`[ 404 ] PAGE NOT FOUND`), plain-language explanation, optional `Reference: <id>` in small muted mono, and action buttons. Always includes `[ GO HOME ]` and `[ EMAIL US ]` (mailto with a prefilled subject and body containing only the page path and reference id, no personal data).

| Situation | Where | Title and message (exact) | Actions |
|---|---|---|---|
| 404 | `app/not-found.tsx` (keep the V4 mini-terminal) | `Page not found` / `We couldn't find that page. It may have moved, or the link may be wrong.` | `[ GO HOME ]` `[ VIEW WORK ]` `[ PLAY ARCADE ]` |
| 500 (segment) | `app/error.tsx` (client component) | `Something broke on our side` / `Sorry about that. It's not your fault. Please try again, and if it keeps happening, email us.` | `[ TRY AGAIN ]` (calls `reset`) `[ GO HOME ]` `[ EMAIL US ]` |
| 500 (root) | `app/global-error.tsx` (must render its own `<html>` and `<body>`) | Same as above, minimal inline styles in the site colors | `[ RELOAD ]` |
| 403 | `/error/403` | `Access denied` / `You don't have permission to view this page.` | `[ GO HOME ]` |
| 429 | `/error/429` | `Too many requests` / `You're going a little fast. Please wait a moment and try again.` | `[ GO HOME ]` |
| 503 | `/error/503` | `Temporarily unavailable` / `This part of the site is paused right now. Please try again later.` | `[ GO HOME ]` `[ EMAIL US ]` |
| Invalid or expired moderation link | `/moderate/[token]` | `This link isn't valid` / `It may have expired or already been used.` | `[ GO HOME ]` |
| Offline | global client banner | `You're offline` / `Check your connection. Your form data is kept.` | none (auto-hides when back online) |

- Show `error.digest` (Next.js provides it in `error.tsx`) as the small `Reference:` line. **Never show `error.message`, stack traces, SQL errors, provider errors, or environment details in production.** In development only, add a collapsible `[ DETAILS ]` block.
- Log server-side with `console.error` (digest + route), **never request bodies or personal data**.
- Pages inside `/error/*` are `noindex` and return the matching HTTP status where Next.js allows (use `notFound()` for 404).

### 2.2 API error contract (every API route)
```ts
type ApiError = { ok: false; code: ErrorCode; message: string; retryAfterSeconds?: number; ref?: string };
```
- Codes: `INVALID, FILTER, DUPLICATE, ORIGIN, BOT, BANNED, RATE_LIMIT, PAUSED, TOO_LARGE, UNSUPPORTED, NOT_FOUND, METHOD, DISABLED, IMAGE, NETWORK, TIMEOUT, SERVER`.
- Correct HTTP statuses (400, 403, 404, 405 with `Allow`, 409, 413, 415, 429 with `Retry-After`, 500, 503). `message` is always human-readable and safe to display. Unknown errors become `SERVER` with the generic message above.
- A central `src/lib/errors.ts` holds the code → friendly message map and a `toApiError()` helper; a central `apiFetch()` client wrapper adds a 10 s timeout (AbortController), maps failures to `NETWORK`/`TIMEOUT`, retries **idempotent GETs once**, and never throws raw errors into the UI.
- All forms show the friendly message inline, keep the user's data, and offer the mailto fallback where relevant.

### 2.3 Widget error boundaries
`components/error/widget-boundary.tsx` wraps the terminal, each game, the updates list, the GitHub stats, the Codex, and the screenshot gallery. A failure shows a compact bordered card `[ ! ] This part failed to load. [ RETRY ]` and the rest of the page keeps working.

### 2.4 Tests
Component tests render every `ErrorView` variant; unit tests cover `toApiError` and the code map; an e2e test checks the 404 page and a forced 500 using a development-only test route (disabled when `NODE_ENV === "production"`).

---

## 3. SECURITY HARDENING (Tasks V5-3 and V5-4)

No site can honestly be called "100% secure". The goal is **layered defense with tests as evidence**.

### 3.1 Secrets (nothing private reaches the browser)
- Create `src/lib/env.server.ts`: starts with `import "server-only"`; exports `getServerEnv()` which parses `process.env` with zod **lazily at call time** (never at import, so `next build` works without env vars). Create `src/lib/env.public.ts` for `NEXT_PUBLIC_*` values only. Client components must never import `env.server`.
- Secrets inventory (server-only, never `NEXT_PUBLIC_`): `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `IP_HASH_SECRET`, `MODERATION_SECRET`, `TURNSTILE_SECRET_KEY`, `GITHUB_TOKEN`. The Supabase anon key is **not used anywhere** (do not add it).
- `next.config.mjs`: `poweredByHeader: false`, `productionBrowserSourceMaps: false`.
- `.gitignore` covers `.env*` except `.env.example`. Verify with `git ls-files | grep -E '^\.env'` (only `.env.example` allowed).
- **`scripts/secret-scan.mjs`** (part of `verify` and `prebuild`, no network): scans tracked files, `public/`, and `.next/static` (when present) for these patterns and fails with file:line (never printing the matched secret): Resend keys `re_[A-Za-z0-9_]{16,}`, JWT-like strings `eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}`, `sk_(live|test)_`, `ghp_`, `github_pat_`, `AKIA[0-9A-Z]{16}`, `-----BEGIN [A-Z ]*PRIVATE KEY-----`, and assignments like `(api[_-]?key|secret|token|password)\s*[:=]\s*["'][A-Za-z0-9_\-]{24,}["']`. **Also** read the values from a local `.env.local` if it exists and fail if any value of 8+ characters appears in `.next/static` or `public/`.
- One-time history audit: run a search of git history for the same patterns (`git log --all -p` piped through the pattern list, output limited to commit hashes and file names). If anything is found, **tell the owner to rotate those keys immediately**. Do not rewrite history.
- `robots.ts` disallows `/api/` and `/moderate/`; those pages are `noindex`.

### 3.2 SQL injection
- All database access goes through the Supabase query builder (parameterized by the API layer). **No string-built SQL anywhere.** If you ever need SQL functions, call them with `rpc` using named parameters and `security invoker`.
- **Never interpolate user input into `.or()`, `.filter()`, `.like()`, `.ilike()`, or any filter string** (PostgREST operator injection). Filters use fixed enums or exact `.eq()` matches only.
- Every external value is validated before it reaches the store: UUIDs with `z.string().uuid()`, enums from allowlists, pagination cursors decoded and validated against `{ createdAt: ISO date, id: uuid }`, page size clamped to 1–20, all strings length-capped and normalized.
- Defense in depth: table CHECK constraints and RLS (no public policies) from `supabase/schema.sql`.
- **Test suite `tests/security/injection.test.ts`:** feed every API input and every query parameter payloads such as `' OR 1=1 --`, `"; DROP TABLE community_posts; --`, `%27`, null bytes, 10,000-character strings, unicode tricks, JSON-in-string, and PostgREST-style fragments (`kind=eq.bug&select=*`, `x),or(id.not.is.null)`). Assert a 400-class response and that the store layer (fake) is never called with an unvalidated value.

### 3.3 XSS
- React escapes by default. **Ban** `dangerouslySetInnerHTML` except one `JsonLd` component that serializes JSON and replaces `<` with `<`. Ban `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function`, string-argument `setTimeout/setInterval`, and `javascript:` URLs.
- **`scripts/security-lint.mjs`** (in `verify`) scans `src/` and fails on any banned pattern outside the allowlisted `JsonLd` file; also enable ESLint `react/no-danger`.
- Any dynamic `href`/`src` passes through `safeHref()` which allows only `https:`, `mailto:`, and relative paths starting with a single `/` (reject `//`, `javascript:`, `data:`).
- Query parameters that are reflected or used (`?filter=`, `?tech=`, `?type=`, `?tab=`) are validated against allowlists; invalid values fall back to defaults.
- Data read from `localStorage`/`sessionStorage` is parsed in try/catch and validated with zod before use (a tampered `theme` value must never reach `document.documentElement.dataset` unchecked).
- Terminal output, post text, moderation pages, and all emails render user text as plain text or with the existing `escapeHtml()`.
- **Tests:** render posts, terminal output, error views, and email builders with payloads like `<script>alert(1)</script>`, `"><img src=x onerror=alert(1)>`, `javascript:alert(1)`; assert the output contains the text escaped and no executable markup.

### 3.4 Headers and CSP
Set these on all routes (via `next.config.mjs` `headers()` and/or middleware):
`Strict-Transport-Security: max-age=63072000; includeSubDomains` (no `preload`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`, `Cross-Origin-Opener-Policy: same-origin`.

**Content-Security-Policy, decision procedure:**
- **Option A (preferred):** nonce-based CSP in `middleware.ts` (generate a nonce per request, pass it to the app, apply it to the inline theme script and JSON-LD). Reference policy (verify the exact mechanism against the current Next.js CSP docs):
```
default-src 'self'; script-src 'self' 'nonce-<nonce>' 'strict-dynamic' https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self';
connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com;
object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```
(add `'unsafe-eval'` to `script-src` in development only). **Trade-off:** per-request nonces make pages dynamically rendered, which reduces static caching.
- **Option B (fallback):** if on a Vercel preview Option A pushes mobile Lighthouse Performance below 90 or TTFB above 600 ms, use a static-friendly policy with `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com` and keep every other directive. Document the choice and the measured numbers in `docs/SECURITY.md`.
- Verify the policy with Playwright: the site must work with **zero CSP violations** in the console (home, order, updates with Turnstile, arcade, 404).

### 3.5 Request safety
- State-changing routes (`POST`) require a same-origin `Origin`/`Referer`, the expected `Content-Type` (`application/json` or `multipart/form-data` only where specified; otherwise 415), a body size cap (read with a byte limit **before** parsing), and `.strict()` zod schemas that reject unknown keys.
- Methods not implemented return `405` with an `Allow` header. CORS: none (same-origin only).
- `getClientIp(headers)` in one place: check the current Vercel docs for the trusted header (`x-real-ip` / `x-forwarded-for`) and document that client-supplied values are only trustworthy behind the platform proxy.

### 3.6 Supply chain and CI
- Report `pnpm audit` results honestly (list findings). Commit `pnpm-lock.yaml`.
- Add `.github/dependabot.yml` (weekly, npm) and `.github/workflows/ci.yml` running `pnpm install --frozen-lockfile`, lint, typecheck, test, build, `secret-scan`, `security-lint`, `confidentiality-check`, `brand-check`.
- Add `public/.well-known/security.txt` generated at build time: `Contact: mailto:script.monks.mail@gmail.com`, `Expires:` (build date + 180 days, ISO), `Preferred-Languages: en`, `Canonical: https://scriptmonks.com/.well-known/security.txt`.
- Write `docs/SECURITY.md` (measures in place, how to rotate keys, what to do if a key leaks, the CSP decision and numbers). It must contain no secrets.

---

## 4. ORDER & CONTACT RATE HANDLING (Task V5-5)

Replace the best-effort in-memory limiter (which does not work across serverless instances) with a **persistent, layered** limiter.

### 4.1 Design
- `RateLimiter` interface in `src/lib/rate-limit/index.ts`. Implementation 1: **Supabase-backed** using the existing `abuse_events` table (`kind` values `order`, `order_email`, `order_hash`, `contact`), keyed by `ip_hash = HMAC_SHA256(IP_HASH_SECRET, ip)` and, for emails, `HMAC_SHA256(IP_HASH_SECRET, lowercased email)`. Implementation 2: in-memory fallback used when Supabase env is absent. Select automatically. Test both with an **injected clock** and an in-memory fake store.
- Add `order` and `contact` handling to the same opportunistic cleanup that already purges old `abuse_events`.

### 4.2 Limits (final values, in `src/lib/rate-limit/config.ts`)
| Rule | Orders | Contact |
|---|---|---|
| Per sender | 1 per 5 min, 3 per hour, 5 per 24 h | 2 per 10 min, 5 per 24 h |
| Per email address | 3 per 24 h | n/a |
| Global | 30 per 24 h, then `PAUSED` with a friendly message and the mailto fallback (protects the email quota; check Resend's current free limits) | 30 per 24 h |
| Duplicates | Same normalized title + description + email within 24 h returns the **same success and same `ref`** without sending a second email | same |
| Time-trap / honeypot | form open ≥ 3 s, honeypot empty | same |
| Bot check | Cloudflare Turnstile verified server-side when keys are set | same |

- `ref` is **deterministic**: `SM-` + 6 characters derived from the content hash, so duplicate submissions get the same reference.
- The client generates an `idempotencyKey` (UUID) when the wizard mounts and sends it; the server treats a repeated key as a duplicate.
- **Failure policy:** if the rate-limit store itself errors, **orders fail open** (never lose a real lead) but apply the strict in-memory limit and log an error code; **community posts fail closed**.

### 4.3 UX
- `429` returns `Retry-After` and JSON `{ code: "RATE_LIMIT", retryAfterSeconds }`. The wizard shows `Too many attempts. You can try again in 4:32.` with a live countdown, disables the submit button until then, **keeps the draft**, and shows `[ OPEN EMAIL DRAFT ]`.
- The Turnstile widget appears in the final order step and in the contact form when keys exist; without keys, the site works with the other protections.

### 4.4 Tests
Unit tests (injected clock): each limit boundary, per-email limit, global cap, duplicate returns same `ref` with no second email, `Retry-After` value, fail-open for orders and fail-closed for posts, spoofed `X-Forwarded-For` handling per the documented trust rule.

---

## 5. CACHING & DATA HANDLING (Task V5-6)

Write `docs/CACHING.md` listing the strategy for every route, and verify it with the real `next build` route table and Playwright header checks.

| Resource | Strategy |
|---|---|
| Marketing pages (`/`, `/process`, `/about`, `/faq`, `/info`, `/terms`, `/privacy`) | Static generation; pages that show GitHub stats use ISR (`revalidate = 3600`) |
| `/work/[slug]` | `generateStaticParams`, `dynamicParams = false` |
| GitHub API (stars, latest release) | Server fetch with `revalidate = 3600`, 4 s timeout, keep the last good value, fall back to static data on any error; optional `GITHUB_TOKEN`; never block rendering |
| `GET /api/updates` | `Cache-Control: public, s-maxage=30, stale-while-revalidate=60`; revalidate the cache tag when a post is approved/hidden (verify `unstable_cache`/`revalidateTag` names against the installed Next.js version) |
| `/api/updates/image/[id]` | Approved only; `public, max-age=3600` |
| `POST` routes, `/api/order`, `/api/contact`, `/moderate/*`, `/error/*` | `Cache-Control: no-store` |
| `public/brand/*`, `public/screenshots/*` | `public, max-age=86400, stale-while-revalidate=604800` via `headers()` |
| Images | `next/image` with AVIF/WebP, sensible `minimumCacheTTL` |
| Service worker | **None.** Do not add offline caching of pages or API responses |

**Client data handling**
- `src/lib/storage.ts` is the only code that touches `localStorage`/`sessionStorage`: namespaced keys (`sm_*`), versioned records, zod-validated reads, try/catch for quota errors and Safari private mode, a size cap (50 KB per key), migration hooks, and `clearAll()` used by `[ RESET PROGRESS ]`.
- Order drafts live in `sessionStorage` only, expire after 24 h (store a timestamp), exclude honeypot/time-trap values, and are cleared after a successful submit.
- `useCachedFetch` hook: in-memory TTL cache (30 s), request de-duplication, abort on unmount, revalidate on tab focus at most once per 60 s. Used by the updates list.
- **Server data retention:** keep the V4 cleanup (abuse events 48 h, expired bans) and additionally purge `rejected` posts and their images after 30 days (opportunistic, no cron). Never log personal data.

---

## 6. INFO PAGE (Task V5-7)

Route `/info`: a single page that lists everything **public** about ScriptMønks. Content comes from `site.ts`, `services.ts`, `portfolio.ts`, `legal.ts`, and the lifecycle/standards data (no copy duplicated in JSX). Header `// 06_INFO`, H1 `ScriptMønks at a glance`. Sticky table of contents on desktop. Sections:
1. **Company:** name and spelling, type (`Digital Development Agency & Independent Software Incubator`), structure (solo-founded, independent), founder, business model (client services + in-house products), website, email, Instagram handles, GitHub handles.
2. **What we do:** the four services and what is not included (Terms §8).
3. **Track record:** 4 client commissions delivered (anonymous), 2 in-house completed projects (Wolf, DeployMonk) with links and licence, LONEWOLF (private, closed source); experiments clearly labelled prototypes. Wolf's version comes from the GitHub release data, never hard-coded.
4. **Pricing & payment:** NPR 200 – 5,000, cash in NPR, 50/50, link to Terms for the full terms.
5. **Process:** the six stages.
6. **Engineering standards:** clean code architecture, scalable system design, modular development, automated deployment setups.
7. **Tech stack** badges.
8. **Open source:** Wolf (MIT, Linux), DeployMonk (MIT, `npm install -g deploymonk`).
9. **Contact & follow:** the Follow card.
10. **Legal & security:** Terms, Privacy, Community rules, `security.txt`.
11. **For press and partners:** a `[ COPY BOILERPLATE ]` button copying this text (facts only): `ScriptMønks is a solo-founded, independent software development house and digital agency. It builds custom software for clients and its own in-house products, including Wolf, a local-first Linux desktop companion built with Tauri, React/TypeScript and Rust, and DeployMonk, a zero-configuration command-line project scaffolder.` Also expose `/info.json` (name, url, email, social links, services, price range, product list).

**Never include** anything from the confidentiality firewall (`SPEC_V3.md` §1). Add `/info` to the footer, the navbar `MORE` menu, the sitemap, the command palette, and the terminal (`info`). First visit +5 XP.

---

## 7. NAVBAR FIX (Task V5-1)

The top menu is currently broken at some widths. **Do not guess.**
1. **Diagnose first:** with Playwright take screenshots of the header at 320, 375, 414, 768, 1024, 1280, 1440, and 1920 px, plus iPhone and Android emulation. List every defect (overflow, wrapping, overlap, clipped dropdowns, misaligned items, z-index problems) in `docs/LAYOUT_AUDIT.md` before changing anything.
2. **Structure:** header `sticky top-0`, height `h-16` (CSS variable `--header-h`, also used for `scroll-padding-top`), `max-w-content`, `px-4 sm:px-6`, three zones: left (logo mark + `scriptmønks_` with the blinking cursor, text may truncate), center (nav, desktop only), right (actions).
3. **Breakpoints and priority:**

| Width | Nav |
|---|---|
| ≥ 1280 | `SERVICES` `PROCESS` `WORK ▾` `ARCADE` `UPDATES` `CONTACT` `MORE ▾` (About, Info, FAQ). Right: icon+label `[ ⌘K ]`, theme, XP pill, primary `[ ORDER PROJECT ]` |
| 1024–1279 | `WORK ▾` `ARCADE` `UPDATES` `CONTACT` `MORE ▾` (Services, Process, About, Info, FAQ). Right actions become icon-only; primary shortened to `[ ORDER ]` |
| < 1024 | Logo + `[ ORDER ]` + hamburger. Everything else in the mobile sheet |

4. **Dropdowns:** hover-intent (120 ms) plus click toggle, `aria-haspopup`/`aria-expanded`, arrow-key navigation, Esc and outside-click close, close on route change, **collision-aware** (open leftwards if near the right edge), never clipped by the header's blur layer.
5. **Mobile sheet:** opens below the header at `100dvh` minus header height, scrolls internally, locks body scroll (with `overscroll-behavior: contain` and `inert` on the page content), traps focus, closes on route change and Esc. Items are at least 48 px tall and grouped `NAVIGATE`, `WORK`, `TOOLS` (theme, palette, Codex), `FOLLOW`. The `[ ORDER PROJECT ]` button is pinned at the bottom with `env(safe-area-inset-bottom)`.
6. Active link uses `aria-current="page"` and an accent underline; on the home page an IntersectionObserver scroll-spy highlights the visible section.
7. **Automated check (Playwright, all widths 320–2560):** the header's `scrollWidth <= clientWidth`, no header child's bounding box extends past the viewport, no two interactive header items overlap, and the primary CTA is always visible.

---

## 8. CROSS-DEVICE & BROWSER SUPPORT (Task V5-8)

Target: macOS (Safari, Chrome), iOS Safari, Android Chrome, Windows/Linux Chrome, Edge, Firefox, and iPad.

### 8.1 Compatibility rules
- `package.json` `browserslist`: `defaults`, `last 2 versions`, `iOS >= 15`, `Safari >= 15`.
- iOS/Safari fixes: all inputs `font-size: 16px` minimum (prevents iOS zoom-on-focus); use `100dvh` with a `100vh` fallback; pair every `backdrop-filter` with `-webkit-backdrop-filter` and every `mask-image` with `-webkit-mask-image`; `touch-action: manipulation` on buttons; `touch-action: none` on game canvases only; `-webkit-tap-highlight-color: transparent`; scale canvases by `devicePixelRatio`; hover styles inside `@media (hover: hover)`; use Pointer Events; avoid regex lookbehind in client code; clipboard fallback when `navigator.clipboard` is unavailable; storage wrapped for Safari private mode (Section 5).
- Keyboard shortcuts: show `⌘K` on Apple devices and `Ctrl K` elsewhere; handle `metaKey || ctrlKey`.
- Theme animation relies on `@property`; unsupported browsers must degrade to an instant switch with no errors.
- Use `-webkit-font-smoothing: antialiased`; verify scroll, sticky, and dropdown behavior in WebKit.

### 8.2 Backend portability
All API routes `runtime = "nodejs"`; no local file writes at runtime (Vercel is read-only); no OS-specific paths; times stored in UTC and formatted client-side with `Intl`; the GitHub release lookup (latest tag for Wolf and DeployMonk) is server-side with the fallback from Section 5.

### 8.3 Installable web app basics (no offline mode)
`app/manifest.ts`: `name` and `short_name` `ScriptMønks`, `start_url: "/"`, `display: "standalone"`, `background_color` and `theme_color` `#09181B`, icons 192, 512 and a maskable 512 (extend `scripts/build-brand.mjs`; keep the no-upscaling rule). Add `appleWebApp` metadata and `viewport` with `viewportFit: "cover"` and `themeColor`. **No service worker.**

### 8.4 Test matrix
Playwright projects: `chromium-desktop`, `firefox-desktop`, `webkit-desktop` (Safari engine), `mobile-chrome` (Pixel 7), `mobile-safari` (iPhone 14), `tablet-safari` (iPad). Smoke suite `tests/e2e/`: home loads with no console errors and no CSP violations; navbar at mobile and desktop (Section 7 check); order wizard validation, rate-limit message, and success with a mocked API; theme switch persists after reload; terminal command; opening each game; updates page with a mocked API; error pages; security headers on key routes; no horizontal scroll at 320 px. Report what actually ran (if browser download is blocked in the environment, say so).
Create `docs/DEVICE_TESTING.md`: a manual checklist for the owner on a real iPhone Safari, Android Chrome, Mac Safari and Chrome, Windows Edge, Linux Firefox. Playwright's WebKit approximates Safari but is not identical, so real-device testing is part of done.

---

## 9. MORE GAMES (Task V5-10)

Add four games to the existing six (V3/V4). Each has a pure-logic module with Vitest tests (injectable RNG/clock, no DOM), lazy-loads on open, is playable by keyboard and touch, pauses when the tab loses focus, and awards XP using the existing rules (game XP cap 50 per day).

| Game | Rules |
|---|---|
| **Minesweeper** `DEFUSE.EXE` | 9x9 grid, 10 mines. First click and its neighbors are always safe. Flood-fill reveal of zero cells. Flagging: right-click, long-press (500 ms), or a `[ FLAG MODE ]` toggle. Keyboard: arrows move, Space reveals, `F` flags. Timer and best time. |
| **Breakout** `BRICKS.EXE` | Logical canvas 480x320 scaled for DPR. Paddle via mouse, touch drag, or arrow keys. 5 rows x 10 bricks, 3 lives, 10 points per brick, ball angle depends on where it hits the paddle, speed +8% per level. Fixed-timestep loop (accumulator) so physics is deterministic; collision logic unit-tested. |
| **Reflex** `REFLEX.SH` | 5 rounds. Wait a random 1.0–4.0 s, then the panel turns `status-ok` green; click, tap, or press Space. Clicking early is a false start (the round repeats, max 3). Uses `performance.now()`. Shows each round and the average. Note on screen: `Results depend on your device and screen.` |
| **Tic-Tac-Toe** `X0.EXE` | Versus the computer. `EASY` (random with 30% best-move) and `HARD` (minimax, unbeatable). Choose X or O. Keys 1–9. Local win/draw/loss stats. |

Progress additions: `bests.mines` (best time), `bests.breakout` (high score), `bests.reflex` (best average ms), `bests.ttt` (wins/draws). New achievements: `mines-win`, `breakout-clear`, `reflex-250` (average under 250 ms), `ttt-hard-draw`. Terminal: `play mines|breakout|reflex|ttt`; add all four to the command palette.

**Arcade page upgrades:** filter chips (`ALL`, `ARCADE`, `PUZZLE`, `SKILL`), `[ RANDOM GAME ]`, a per-game `[ HOW TO PLAY ]` overlay (remembered once dismissed), a fullscreen toggle (Fullscreen API with a graceful fallback), and a local `Personal bests` table. No global leaderboards, no accounts, no data leaves the browser.

---

## 10. LAYOUT UPGRADE & MORE INTERACTIVITY (Task V5-9)

### 10.1 Layout audit first
Using Playwright, screenshot every route at 320, 375, 768, 1024, 1440, and 1920 px. Append to `docs/LAYOUT_AUDIT.md`: issue id, route, width, description, severity, fix. **Fix every major and minor issue**, then re-shoot and show before/after. Tokens stay locked; spacing and structure may change.

### 10.2 Layout standards (apply site-wide)

| Aspect | Standard |
|---|---|
| Container | `max-w-content` (72rem), `px-4 sm:px-6 lg:px-8` |
| Section rhythm | `py-16 md:py-24`, dividers `border-t border-dark-border` |
| Cards | equal heights in a row (`h-full`, grid), consistent padding, consistent hover |
| Text | headings use `text-balance`, paragraphs `text-pretty` and `max-w-prose`; no orphan words in H1/H2 at common widths |
| Section labels | consistent numbering from one `sections.ts` map: `01 Services, 02 Work, 03 About, 04 Arcade, 05 Updates, 06 Info` |
| Images | fixed aspect ratios, `object-cover`/`contain` chosen per type, no layout shift |
| Inner pages | breadcrumb, a back link, sticky side panels on desktop (order, legal pages, info) |
| Overflow | no horizontal scroll at any width 320–2560; wide tables/code scroll inside their own container |
| Icons | lucide only, sizes 16/20/24 |
| Empty and loading states | designed for every list and widget |

### 10.3 Extra interactivity (all keyboard accessible, reduced-motion safe)
1. **Metrics count-up** on first view (once; static under reduced motion).
2. **Click-to-filter tech stack:** the home stack strip links to `/work?tech=<tag>` (validated allowlist) and `/work` shows an active chip.
3. **Interactive process timeline:** stages expand/collapse, a progress line fills with scroll, scroll-spy highlights the current stage.
4. **Project card peek:** on hover/focus (desktop) or tap (mobile) a card expands its highlights without leaving the page.
5. **Keyboard shortcuts overlay** with `?`: `Ctrl/⌘ K` palette, `g h` home, `g w` work, `g o` order, `g a` arcade, `g u` updates, `g i` info. Shortcuts are ignored while typing in a field.
6. **Search in the palette** covers pages, projects, FAQ questions, and info sections.
7. **FAQ search filter** and `#` copy-link buttons on headings; a reading-progress bar on Terms and Privacy.
8. **Order wizard polish:** `DRAFT SAVED` indicator, per-field success ticks, clearer step transitions.
9. **Accessible tooltips** on badges and icon-only buttons.

---

## 11. EXECUTION PLAN

| Task | Content | Acceptance (show evidence) |
|---|---|---|
| **V5-0** | Section 1: status table, `docs/PROGRESS.md`, complete missing/partial checklist items (A→F), one group per report | Full table with evidence; green `lint/typecheck/test/build` output |
| **V5-1** | Section 7: navbar diagnose and fix; start `docs/LAYOUT_AUDIT.md` | Defect list; Playwright header check passes at all widths; before/after screenshots |
| **V5-2** | Section 2: error pages, API error contract, `apiFetch`, widget boundaries | All variants render; no raw errors anywhere; tests pass |
| **V5-3** | Sections 3.1, 3.4: env modules, `secret-scan`, history audit, headers and CSP | Secret scan passes; zero CSP violations; Option A/B decision documented with numbers |
| **V5-4** | Sections 3.2, 3.3, 3.5, 3.6: injection and XSS tests, `security-lint`, request safety, CI, dependabot, `security.txt`, `docs/SECURITY.md` | Security tests pass; `pnpm audit` results reported honestly |
| **V5-5** | Section 4: persistent order/contact limiter, idempotency, Turnstile | Limit tests pass; countdown UX works; duplicate order returns the same ref with no second email |
| **V5-6** | Section 5: caching strategy, storage wrapper, `useCachedFetch`, retention, `docs/CACHING.md` | Build route table and header tests match the strategy |
| **V5-7** | Section 6: `/info`, `/info.json`, boilerplate button | No firewall violations; all facts traceable to data files |
| **V5-8** | Section 8: browserslist, iOS/Safari fixes, manifest, Playwright matrix, `docs/DEVICE_TESTING.md` | Suite results per project reported; no console errors |
| **V5-9** | Section 10: layout audit fixes and interactivity | Before/after screenshots; no horizontal scroll; features keyboard accessible |
| **V5-10** | Section 9: four new games and arcade upgrades | Logic tests pass; keyboard and touch playable; lazy chunks confirmed |
| **V5-11** | Final QA | Full verify suite green; Lighthouse (mobile and desktop) on `/`, `/order`, `/work`, `/arcade`, `/updates`, `/info` (targets ≥ 90 performance, ≥ 95 accessibility, best practices, SEO, with real numbers); updated `DEPLOY.md`, `README.md`, `AGENTS.md`; final list of every `TODO(OWNER)` |

---

## 12. DEFINITION OF DONE
- [ ] Every master checklist row is `DONE` with evidence.
- [ ] The navbar works cleanly from 320 to 2560 px; no overflow or overlap.
- [ ] Every failure shows a friendly, branded message; no raw errors, stack traces, or JSON.
- [ ] No secret in the repo, history audit reported, or client bundle; env access is server-only.
- [ ] Injection and XSS test suites pass; CSP active with zero violations; banned APIs blocked by `security-lint`.
- [ ] Orders and contact messages are rate-limited persistently, with idempotency and a friendly countdown.
- [ ] Caching strategy documented and verified; storage is validated and versioned.
- [ ] `/info` lists all public company information and nothing confidential.
- [ ] Works on Mac, iOS, Android, Windows, and Linux browsers per the matrix; real-device checklist delivered.
- [ ] Ten games in the arcade, tested and lazy-loaded.
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` and all scripts pass, with real output shown.
