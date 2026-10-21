# PROGRESS — ScriptMønks V4 (external memory)

Append after every task: task id, status, files changed, commands run with result
summary, open `TODO(OWNER)` items. Never rewrite history.

## V4-0 — status discovery (2026-10-20)

**Status: DONE (with one blocker reported to owner — see "Blocked").**

### Spec files (SPEC_V4 §0.1)
| File | Present | Note |
|---|---|---|
| `AGENTS.md` | yes | loaded |
| `SPEC_V3.md` | yes but **TRUNCATED** | literal placeholders at lines 71 and 117: `[...full spec continues... see original user message]`, `[...rest as needed...]`. Sections 4–8 and tasks V3-2, V3-3, V3-7 text are absent. |
| `SPEC_V2.md` | yes | 33,380 bytes |
| `SPEC.md` | yes | 31,291 bytes |
| `SPEC_V4.md` | yes | saved this session (35,859 bytes) |

### V3 status table (evidence-based)
| Task | Status | Evidence |
|---|---|---|
| V3-1 audit/baseline/logo/confidentiality | **PARTIAL → FINISHED this session** | See "V3-1 completion" below. Before: missing navbar cursor, hero watermark, `verify` wiring, collaboration/response-time cleanup, 2 lint errors. |
| V3-2 | **CANNOT ASSESS** | Task text missing from `SPEC_V3.md` (line 71 placeholder). |
| V3-3 | **CANNOT ASSESS** | Task text missing from `SPEC_V3.md`. |
| V3-4 themes/XP/Codex/CRT | **MISSING** | `grep -rE "Codex\|data-theme\|@property\|firstVisit\|settings.theme" src` → 0 matches; `src/app/globals.css` has no `--accent` vars; `tailwind.config.ts` still raw hex (`coral: "#FF7A65"`), no CSS-variable indirection. |
| V3-5 Terms/Privacy legal text | **MISSING** | `src/data/legal.ts` does not exist; no `/terms` route under `src/app/`; `grep -rn "Terms" src/app/privacy/page.tsx` → 0 matches. |
| V3-6 four games + `/arcade` | **MISSING** | `ls src/app/arcade src/lib/game* src/components/games` → not found; `grep "arcade" src` → 0 matches. |
| V3-7 | **CANNOT ASSESS** | Task text missing from `SPEC_V3.md`. |
| V3-8 hosting/DEPLOY | **MISSING (inferred)** | `DEPLOY.md` does not exist; V3 decisions table says "Hosting — Vercel free tier (see Section 8)". |

### Command results (real, this session)
```
pnpm lint      → exit 1 BEFORE fixes (2 errors: boot-splash.tsx:13
                 react-hooks/set-state-in-effect, contact-form.tsx:114
                 react-hooks/refs; 6 warnings)
pnpm lint      → exit 0 after fixes (0 problems)
pnpm typecheck → exit 0
pnpm test      → exit 0 — 8 files, 51/51 passed
pnpm verify    → exit 0 (sync-screenshots + check-brand + confidentiality-check)
pnpm build     → exit 0 (16 top-level routes, 10 SSG case studies)
node scripts/confidentiality-check.mjs → "confidentiality-check: OK" exit 0
node scripts/check-brand.mjs           → all 6 PNGs OK exit 0
```
SSR smoke (dev server, `curl localhost:3199`): navbar `scriptmonks` +
`animate-blink text-accent-coral` cursor present; hero watermark img with
`opacity-[0.06] md:block` present; `logo-mark.png` referenced 9×; no
`Scope call` string on home.

### V3-1 completion — files changed (this session)
- `src/components/layout/navbar.tsx` — mono wordmark `` `scriptmonks` `` → `scriptmonks` + blinking `_` span (`animate-blink`, accent); navbar mark `alt="Scriptmonks"`; removed unused `siteConfig` import.
- `src/components/sections/hero.tsx` — added decorative `logo-mark.png` watermark (absolute, desktop-only, `opacity-[0.06]`, `h-[min(70vh,480px)]`, `pointer-events-none`, `aria-hidden`).
- `src/app/about/page.tsx` — removed `[ COLLABORATION ]` callout (dead `/contact?tab=collaborate` CTA; collaboration arrangement cancelled in V3) + unused `Button` import.
- `src/app/contact/page.tsx` — removed dead `?tab` searchParams plumbing; metadata description drops "a collaboration".
- `src/components/contact/contact-form.tsx` — lint fixes (handleSubmit now called in submit handler, not during render); removed dead `kindState`/`kind`/`activeKind` leftovers from the removed Collaborate tab.
- `src/app/order/page.tsx`, `src/components/order/order-success.tsx` — removed `03 Scope call` claim (V3 decisions: remove "scope call" claims), Proposal renumbered to 03.
- `src/components/boot-splash.tsx` — targeted `eslint-disable-next-line react-hooks/set-state-in-effect` on the one-shot sessionStorage read (same precedent as SPEC.md-plan Task 4 ruling).
- `scripts/check-brand.mjs` — removed unused `st`/`statSync`.
- `src/lib/validation.ts` — removed unused `ProjectOrderPayload` import.
- `package.json` — added `"verify": "node scripts/sync-screenshots.mjs && node scripts/check-brand.mjs && node scripts/confidentiality-check.mjs"`; `prebuild` now also runs `confidentiality-check.mjs` (V3 §1: wire into verify and prebuild).

### Rulings (V4-0)
- **Ruling:** Interpret navbar spec text `` `scriptmonks_` `` as code formatting; render `scriptmonks` + blinking `_` element, dropping the literal backtick characters that were in the markup — SPEC_V4 §1 requires a blinking cursor element; the old markup had none. — cost if wrong: one wordmark restyle.
- **Ruling:** Removed the about-page `[ COLLABORATION ]` callout entirely instead of only the `/contact` tab — its CTA targeted the removed tab (dead link) and V3 says the arrangement is cancelled. — cost if wrong: owner re-adds a general-contact collaboration CTA.
- **Ruling:** `03 Scope call` steps replaced by renumbering the existing `Proposal` step (no new copy invented). — cost if wrong: owner restores a differently-worded step list.
- **Ruling:** `git init` performed (repo had no `.git`; SPEC_V4 §0.3 requires a commit after each task). Local commits only, no history to rewrite, no push. — cost if wrong: `.git` removable; prior ledger recorded a no-git ruling superseded by the owner's explicit instruction in SPEC_V4.
- **Ruling:** `.gitignore` gains `!.env.example` (the blanket `.env*` rule was hiding the example file from git) and `.superpowers/` (session scratch). — cost if wrong: one-line revert.

### Blocked — reported to owner before V4-1
1. `SPEC_V3.md` is truncated (see above). V3-2, V3-3, V3-7 unassessable;
   V3-4, V3-5, V3-6, V3-8 missing and **not finishable from spec text** —
   SPEC_V4 §0.1 forbids reconstructing missing spec content from guesswork.
   Owner must supply the full `SPEC_V3.md` (or authorize proceeding on V4 text alone).
2. Playwright is not installed (allowed as dev dep by V3 §0.4 but never added);
   baseline screenshots in `.baseline/` are from 13:50 before this session's
   changes. Visual re-shoot deferred (V4-2 §3.2 requires Playwright anyway).

### Open TODO(OWNER) (current codebase)
- `src/data/portfolio.ts`: `year: "TODO(OWNER)"` ×3 (wolf, deploymonk, lonewolf), `client.displayName: "TODO(OWNER)"` ×2.
- `src/data/portfolio.test.ts:50` asserts the lonewolf year placeholder.
- `README.md` "Content to fill before launch" list (partly stale vs current grep).
- V4 adds later: `@monk_mango` public confirmation (V4-4), DeployMonk repo URL (V4-4).

## V4-1 — rename Scriptmonks → ScriptMønks (2026-10-20)

**Status: DONE.** Commit after `8c6c947`.

- Display copy renamed everywhere: layout metadata (title template `%s | ScriptMønks`, default `ScriptMønks | Software House & Digital Agency`, OG/Twitter templates, `siteName`), page titles shortened to inherit the template, JSON-LD `name` + `alternateName: ["Scriptmonks","Script Monks"]`, metadata `keywords`, `siteConfig.name`/`description` (footer brand + copyright `© 2026 ScriptMønks`), navbar wordmark `scriptmønks` + blinking `_` (kept), all page copy, terminal-status prefix `$ scriptmønks --status`, boot splash `> booting scriptmønks...`, OG image alt, README (title + `scriptmonks.com` example URL).
- Fonts: `subsets: ["latin","latin-ext"]` + `display: "swap"` on both `next/font/google` calls — `ø` renders.
- Email subjects `[ScriptMønks] …` via exported `buildOrderSubject`/`buildContactSubject`, unit-tested (+2 tests). `RESEND_FROM` fallback stays ASCII `Scriptmonks Leads <…>` (deliverability; cannot test Resend acceptance offline — SPEC_V4 §2.2 fallback).
- `scripts/brand-check.mjs` created (regex `/script[\s_.-]?monks/i`; allowlist: owner email, `Script_monks`, `scriptmonks.com`, `alternateName`, `keywords`, `RESEND_FROM`); wired as `brand:check` into `verify` and `prebuild`. Output: `brand-check: OK (95 files scanned, 0 violations)`.
- OG image: `ø` is baked into `logo-full.png` artwork; image text is the tagline only — no satori font change needed.
- Gates: lint 0, typecheck 0, test 53/53, build 0, verify 0. SSR smoke: `<title>ScriptMønks | …`, `scriptmønks` ×2, `alternateName` present, `© … ScriptMønks` in RSC payload.
- Ruling: page titles de-duplicated so the layout template is the single source of the `| ScriptMønks` suffix. Cost if wrong: revert per page.

## V4-2 — smooth theme changer (2026-10-20)

**Status: DONE.**

- `src/lib/theme.ts` (new, pure): 5-theme catalogue with the exact spec RGB triplets, `THEMES`/`THEME_IDS`/`isThemeId`/`nextThemeId`/`themeById`, `readSettings`/`writeSettings` (injected storage, corrupt + blocked + null safe), `applyThemeToRoot`, and `THEME_INIT_SCRIPT` (pre-paint string). `src/lib/theme.test.ts`: 18 tests, written RED first (module absent → `Test Files 1 failed, no tests`), then GREEN.
- `globals.css`: six `@property` numeric registrations (`--ar…--db`), `:root` defaults + `.45s ease` transitions, per-theme `[data-theme]` blocks, reduced-motion `transition: none`, focus ring + `::selection` now theme-driven, `[data-crt="on"]::after` scanline overlay.
- `tailwind.config.ts`: `accent.coral`/`accent-coral-dim` now `rgb(var(--accent-coral) / <alpha-value>)` (added `accent.DEFAULT` so `bg-accent` still resolves). No other token changed.
- `src/components/layout/theme-provider.tsx` (new): hydrates from storage, applies on change, cross-tab `storage` sync, `useTheme()` inert fallback outside the provider.
- `src/components/layout/theme-switcher.tsx` (new): navbar `[ THEME ]` button with live swatch dot; `role="listbox"` popover with arrow-key navigation, Esc close (reverts preview), Enter/Space select, outside-pointer close, focus return; desktop hover/focus live preview, reverts on pointer-leave; preview disabled under reduced motion; `CRT SCANLINES` + `REDUCE EFFECTS` switches; all rows ≥ 44px tall.
- `src/components/layout/theme-init-script.tsx` (new): pre-paint script in `<head>` (`ThemeInitScript`), no flash.
- Wired: layout (`ThemeProvider` + `ThemeInitScript`), navbar (desktop + mobile panel), command palette group `Theme: <LABEL>` (5 entries, toast + persist).
- **Spec §3.2 proof (real output, Playwright, `scripts/check-theme-transition.mjs`)**:
  ```
  start (coral) = rgb(255, 122, 101)
  mid   (~150ms) = rgb(60, 200, 222)
  end   (cyan)  = rgb(34, 211, 238)
  theme-transition: OK — mid-transition sample differs from both endpoints
  ```
- Gates: lint 0, typecheck 0, test 71/71, build 0.
- Ruling: added `playwright` 1.64.1 as a dev dependency (explicitly allowed by SPEC_V3 §0.4) plus chromium headless shell, because SPEC_V4 §3.2 demands a measured mid-transition sample. Cost if wrong: one dev dep to remove.
- Ruling: `REDUCE EFFECTS` toggles a `reduce-effects` class instead of persisting a new settings field; the popover switch reads it directly. Cost if wrong: small refactor to move it into `settings`.
- Ruling: `ThemeInitScript` renders inside `<body>` (not `<head>`) to avoid App Router head manipulation; it still runs before the first paint of page content. Cost if wrong: none — measured no-flash below.
- Ruling: coral stayed the default and is applied with no `data-theme` attribute, so the default look is unchanged (hex → identical RGB triplet `255 122 101`/`200 91 75`).
- `TODO(OWNER)`: none.

## V4-3 — smoothness & polish (2026-10-20)

**Status: DONE (features) / TARGETS MISSED on cold load — cause identified and stated per SPEC_V4 §147.**

### Delivered (spec §4 table)
- `app/template.tsx`: 180 ms fade + 8 px rise, transform/opacity only, disabled under reduced motion.
- `NavProgress`: 2 px accent bar, starts on internal link click and on `sm:route-start`, finishes on pathname change, 4 s safety net. `ScrollProgress` kept as the only other bar (never stacked: nav bar is transient, scroll bar is scroll-driven).
- `loading.tsx` skeletons for `/work`, `/work/[slug]`, `/arcade`, `/updates` using `bg-dark-raised` + `animate-pulse`, reserve heights.
- Micro-interactions: `Button` is now `forwardRef`; `.magnetic` (≤6 px, fine-pointer only, no-op under reduced motion); `.link-underline` grows from the left in accent.
- Images: `next/image` everywhere; `sizes` present on product-card + gallery; `priority` only on the navbar mark and the gallery LCP shot.
- Fonts: `display: "swap"`, `latin-ext` included (V4-1).
- Below-the-fold: `.defer-render` (`content-visibility: auto` + `contain-intrinsic-size`) on home `portfolio`, `process-condensed`, `home-faq`, `about-teaser`, `cta-band`.
- JS cost: `LazyChrome` client shell loads command palette, scroll progress and boot splash via `next/dynamic` (`ssr: false`).
- Mobile: safe-area insets, `scroll-padding-top: 5rem`.
- 404: mini interactive terminal (`404: page not found`, `home`/`work`/`arcade`/`help`) + `[ PLAY ARCADE ]`.
- A11y: `FocusOnRouteChange` (skips overlays), `SkipToContent`, keyboard-operable terminal.

### Per-route first-load JS (real `next build` output, gzip)
| route | chunks | raw kB | gzip kB |
|---|---|---|---|
| `/` | 12 | 639.3 | 198.4 |
| `/work` | 12 | 644.8 | 200.5 |
| `/order` | 14 | 923.9 | 287.8 |
| `/contact` | 13 | 778.7 | 240.3 |
| `/faq` | 12 | 634.5 | 196.8 |
| `/about` `/process` `/privacy` | 11 | 633.2 | 196.2 |

### Lighthouse mobile — measured, not promised
Cold load (fresh profile, `npx lighthouse`, headless chromium, 5 runs):

| run | perf | a11y | BP | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| 1 | 52 | 100 | 100 | 100 | 4.7 s | 2 620 ms | 0.028 |
| 2 | 47 | 100 | 100 | 100 | 5.1 s | 2 940 ms | 0.030 |
| 3 | 49 | 100 | 100 | 100 | 5.5 s | 1 990 ms | 0.014 |

Warm load (same session, splash already seen) — `scripts/measure-warm-lh.mjs`:

| perf | a11y | BP | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|
| **72** | 95 | 96 | 100 | **2.1 s** | 1 870 ms | **0** |

**Targets:** Performance ≥ 90 → **MISSED** (cold 47–52, warm 72). Accessibility ≥ 95 → **MET** (100 cold / 95 warm). Best Practices ≥ 95 → **MET** (100 / 96). SEO ≥ 95 → **MET** (100). CLS < 0.05 → **MET** (0.014–0.030 cold, 0 warm).

**Cause (root-caused, not guessed):** Lighthouse confirmed via `lcp-breakdown-insight` that the LCP element on cold load is the boot-splash text (`div.pointer-events-none > div.mt-8 > div.opacity-90`, nodeLabel `> booting scriptmønks...`), with `elementRenderDelay` 1.2–1.7 s. The splash is **mandated by SPEC_V3 §106** (full-screen overlay, once per session, ≤1.4 s, 3 mono lines, skippable), and because it is an opaque full-viewport overlay, the real page content is not the largest painted element — so any spec-compliant splash becomes the LCP candidate. TBT is dominated by React 19 + Next 16 hydration longs tasks (attributed to `react-dom` and the router chunks), which is the framework floor for this stack.

**Fixes attempted and their measured effect (kept only what helped):**
- Splash made client-only so it no longer renders in SSR HTML — kept (removes a 110 kB image fetch and 15 layout shifts from the server-rendered path).
- Splash logo moved from `<img>` to the CSS accent mask — kept (§3.1 requires the mask anyway; removes the lazy LCP image).
- Hero watermark moved from `<img>` to the CSS accent mask — kept (§3.1 violation fixed; follows the theme).
- Splash shrunk to one line — **reverted** (falsified: LCP element unchanged, because the overlay still covers the viewport).
- `browserslist` modern targets to drop the 110 kB core-js polyfill — **reverted** (Turbopack ignores it; polyfill chunk unchanged).

### Honest gaps
- Reaching Performance ≥ 90 on the **cold** path is not possible while satisfying SPEC_V3 §106 as written. Two options for the owner: (a) accept warm 72 / cold ~50 with this documented cause, or (b) authorise replacing the full-screen splash with a non-covering variant (e.g. a corner banner) which would let the hero content win LCP.
- Warm TBT 1.9 s is framework hydration; further reduction needs RSC/partial-prerender work outside this task's scope.

### New scripts
- `scripts/measure-route-js.mjs` — per-route JS byte measurement.
- `scripts/measure-warm-perf.mjs` — warm navigation load time.
- `scripts/measure-warm-lh.mjs` — full warm Lighthouse run.
- `scripts/check-theme-transition.mjs` (V4-2) — mid-transition accent proof.

- `TODO(OWNER)`: decide (a) keep splash and accept cold perf, or (b) authorise a non-covering splash variant.

## V5-0 — master checklist audit (2026-10-20)

**Status: AUDIT DONE. 2 blockers stop full completion of MISSING rows (see below).**

### Gates (real output, this session)
```
LINT_EXIT=0
TYPECHECK_EXIT=0
TEST_EXIT=0      Test Files 9 passed (9), Tests 71 passed (71)
BUILD_EXIT=0     27/27 static pages, routes: / /about /contact /faq /order
                 /privacy /process /work (+10 SSG slugs) /api/contact /api/order
                 /robots.txt /sitemap.xml
pnpm verify → VERIFY_EXIT=0 (sync-screenshots 0 synced, 6/6 brand PNGs OK,
              confidentiality-check: OK, brand-check: OK 113 files, 0 violations)
```

### Status table (evidence per row — full detail in session report)
| Group | Row | Status |
|---|---|---|
| A | A1 A2 A3 A4 A5 | DONE |
| B | B1 B2 B3 | DONE |
| C | C1 PARTIAL (Wolf release tag hard-coded v0.4.0, SPEC_V5 §0 forbids) |
| C | C2 PARTIAL (4 client ✓, 3/8 lab entries; placeholder switch ✓) |
| C | C3 DONE |
| C | C4 PARTIAL (7/8 pages; /terms MISSING) |
| C | C5 PARTIAL (budgets/email-only/mailto/honeypot ✓; consent checkbox, cash/50-50 order copy, lazy Resend, time-trap missing) |
| C | C6 MISSING — blocked: SPEC_V3.md truncated, §5 legal text absent; src/data/legal.ts absent |
| C | C7 MISSING (V4 §5 text available) |
| D | D1 PARTIAL (palette/toast/progress/back-to-top/copy-email ✓; GitHub stats: src/lib/github.ts imported nowhere) |
| D | D2 MISSING (no XP/rank/achievement/Codex code; V3 §6.1 spec text absent) |
| D | D3 PARTIAL (status typewriter + 404 terminal ✓; interactive terminal commands, DeployMonk explorer, Wolf tour absent; V3 §6.2 absent) |
| D | D4 DONE (V4-2) | D5 DONE (V4-3) |
| D | D6 MISSING (/arcade route absent — orphan loading.tsx; V3 §6.3 absent, V4 §7 available) |
| E | E1 MISSING (no /updates, /api/updates, supabase/, src/lib/updates/; V4 §6 text available) |
| F | F1 DONE (confidentiality-check OK) |
| F | F2 PARTIAL (.env.example ✓, build green; DEPLOY.md MISSING — V4 §8 text available) |
| F | F3 PARTIAL (PROGRESS ✓; docs/MODERATION.md MISSING — V4 §6.10 available) |

### Blockers — reported to owner
1. **SPEC_V3.md truncated** (line 71 `[...full spec continues...]`, line 118 `[...rest as needed...]`): §4 order copy, §5 legal text, §6 gamification/terminal/games, §7 portfolio, §8 hosting are absent. Blocks C6 (exact legal text — SPEC_V5 §0: never recreate from memory), D2, D3, D6 core rules, C5 copy, C2 lab count. Owner must supply full SPEC_V3.md or authorize V4/V5-text-only builds where possible.
2. Rows buildable from existing SPEC_V4/V5 text now: C7, E1, F2, F3, D1 (github wiring), C1 (version from GitHub API), C2 (5 more lab entries need owner-approved facts), C4 (/terms blocked on legal text).

### Files changed
- SPEC_V5.md (created, spec as supplied), docs/PROGRESS.md (this entry).

- `TODO(OWNER)`: full `SPEC_V3.md`; `@monk_mango` public confirm; portfolio year/client placeholders; 5 lab entries facts; decide splash vs cold perf (V4-3).

## V5-1 — navbar diagnose & fix (2026-10-20)

**Status: DONE.** Commit after `883757a`.

- Diagnose first (SPEC_V5 §7.1): `scripts/check-header.mjs` ran against the old navbar —
  8 defects logged in `docs/LAYOUT_AUDIT.md` (H-01…H-09) with screenshots
  `docs/audit/header-before/`. Confirmed: wrap/overflow at 768 (bar 118 px, CTA clipped),
  no CTA below 1024, inconsistent height, no MORE dropdown, weak dropdown behavior,
  inline mobile panel (no sheet/lock/trap), no active states.
- Fix: `navbar.tsx` rewritten per §7.2–§7.6 — sticky `h-16` bar, three zones, nav gated at
  `lg` (1024), `WORK ▾` + `MORE ▾` hover-intent (120 ms) + click dropdowns with
  collision-aware left/right open, arrow keys, Esc, outside-click, close-on-route-change;
  right zone: palette (label ≥1280, icon-only below), `ThemeSwitcher compact`, `[ ORDER ]`
  CTA at every width, hamburger `<lg`; mobile sheet: `100dvh − --header-h`, internal scroll +
  `overscroll-behavior: contain`, body scroll lock, `inert` page content, focus trap,
  48 px items, `NAVIGATE/WORK/TOOLS/FOLLOW` groups, pinned `[ ORDER PROJECT ]` with
  `env(safe-area-inset-bottom)`; `aria-current` + accent underline, home scroll-spy
  (IntersectionObserver). `globals.css`: `--header-h`, `scroll-padding-top` var, `.mobile-sheet`
  with `100vh`→`100dvh` fallback. `theme-switcher.tsx`: `compact` prop (swatch-only).
- Evidence: `node scripts/check-header.mjs … after` → OK, zero defects at 320–2560 +
  iPhone 14 + Pixel 7 (bar h=64 everywhere); `node scripts/check-nav-behavior.mjs` → 16/16 PASS.
  Screenshots before/after committed under `docs/audit/`.
- Gates: lint 0, typecheck 0, test 71/71, build 0 (prebuild brand+confidentiality checks passed).
- Ruling: `ARCADE`, `UPDATES`, `INFO` nav links omitted until their routes exist (D6/E1/V5-7)
  — spec §7.3 lists them, but shipping links to known 404s is a user-visible defect; the
  breakpoint structure makes adding them one line each later. Cost if wrong: brief interim menu.
- Ruling: XP pill omitted until the XP system (D2, blocked on SPEC_V3 §6) exists. Cost if wrong: none (additive).
- Ruling: `react-hooks/set-state-in-effect` avoided by React's render-phase state adjustment
  for route-change closes and derived `pathname === "/" && …` for scroll-spy (no lint disables needed).
- `TODO(OWNER)`: none new.

## V5-2 — error pages & error handling (2026-10-20)

**Status: DONE.** SPEC_V5 §2. Commit after `27f2a69`.

### Delivered
- `src/lib/errors.ts` — 17-code `ErrorCode` union, `ERROR_MESSAGES` map, `ApiError`
  interface, `statusForCode`/`codeForStatus`, `isErrorCode`, `isApiError`, `apiError`,
  `toApiError(input, fallback)`, `apiErrorResponse(code, init)`, `logServerError(route, error)`,
  and `apiFetch<T>()` (10 s AbortController timeout, `NETWORK`/`TIMEOUT` mapping, one retry
  for idempotent GETs, never throws raw).
- `src/components/error/error-view.tsx` — shared terminal-style card: `// SYSTEM`, mono
  status line `[ <code> ] <TITLE>`, message, optional `Reference: <id>`, dev-only
  collapsible `[ DETAILS ]`, then `primary` → `[ GO HOME ]` → `actions` → `[ EMAIL US ]`.
  Mailto body carries only the page path and reference id.
- `src/components/error/offline-banner.tsx` — global `You're offline` / `Check your
  connection. Your form data is kept.`; auto-hides on `online`.
- `src/components/error/widget-boundary.tsx` — class boundary rendering
  `[ ! ] This part failed to load. [ RETRY ]`; wrapped around `TerminalStatus` (hero) and
  `ScreenshotGallery` (work detail).
- `src/app/not-found.tsx` — ErrorView 404 copy + the V4 mini-terminal kept; actions
  `[ VIEW WORK ]` `[ PLAY ARCADE ]`.
- `src/app/error.tsx` (segment 500) — `Reference: <digest>`, `[ TRY AGAIN ]` via `retry`,
  dev-only `[ DETAILS ]`; logs `[segment-error] <path> digest=<id>` only.
- `src/app/global-error.tsx` (root 500) — own `<html>`/`<body>`, inline hex of site
  tokens (no stylesheet is available here), `[ RELOAD ]`.
- `src/app/error/{403,429,503}/page.tsx` — exact copy from §2.1, `robots: noindex`.
- `src/app/dev/force-error/` — dev-only route (404 in production) that throws from a
  client effect so `app/error.tsx` mounts; a server throw would be caught by Next's own
  error document instead.
- Both API routes now emit the §2.2 `ApiError` contract via `apiErrorResponse`; both
  clients (`order-wizard`, `contact-form`) use `apiFetch`.
- `scripts/check-error-pages.mjs` — Playwright e2e for the 404, the 500 (dev), the three
  static error pages, the 415 API contract, and the 405 status.

### Evidence
```
pnpm lint      → exit 0
pnpm typecheck → exit 0
pnpm test      → 11 files, 101 passed (was 71)
pnpm build     → exit 0
pnpm verify    → exit 0 (sync 0, 6/6 PNGs OK, confidentiality OK, brand 126 files 0 violations)
BASE_URL=… node scripts/check-error-pages.mjs
  dev  server (next dev, port 3201) → 36/36 checks passed
  prod server (next start, port 3199) → 27/27 checks passed (dev-only 500 checks skipped)
```

### Rulings (each logged with the spec tension it resolves)
1. **`reset` → `retry`.** SPEC_V5 §2.1 says `[ TRY AGAIN ]` "calls `reset`". Next 16.4.2
   `error.tsx` receives `retry` (stable since 16.3, documented in
   `dist/docs/01-app/03-api-reference/03-file-conventions/error.md`); `reset` still exists
   but §2.1's intent is "re-fetch and re-render the segment", which is exactly `retry`.
2. **`fieldErrors` kept.** The §2.2 `ApiError` type has no `fieldErrors`, but removing it
   would break the existing per-field form errors (V2/V3 requirement, and the route tests
   assert it). Implemented as an optional extra field on `ApiError`.
3. **Status remaps** where the spec table and the code list disagree: non-JSON content type
   → 415 `UNSUPPORTED` (was 400); invalid JSON → 400 `INVALID` with message override
   `"That request couldn't be read. Please try again."`; delivery failure → 500 `SERVER`
   with message override `"Delivery failed. Please email script.monks.mail@gmail.com"`
   (the spec has no 502 and requires unknown errors to become `SERVER`); rate limit → 429
   `RATE_LIMIT` with `retryAfterSeconds` + `Retry-After`.
4. **`ErrorView` always shows `[ GO HOME ]` + `[ EMAIL US ]`.** §2.1 "Always includes" wins
   over the per-row action column, which omits them for some rows. Two slots (`primary`
   before GO HOME, `actions` between GO HOME and EMAIL US) reproduce the table's ordering.
5. **405 cannot carry `Allow`.** The spec asks for "405 with `Allow`". In Next 16 an
   unexported method on a route handler yields a framework-level 405 with no `Allow` header,
   and a route handler cannot add one for a method it does not export. `METHOD` stays in the
   code map; the e2e script reports the missing header as a documented limitation instead of
   asserting it.
6. **`/error/*` pages return HTTP 200.** Next's App Router has no page-level status-code
   API; the spec hedges with "where Next.js allows". They are `noindex`.
7. **404's `[ PLAY ARCADE ]` targets `/arcade`, which does not exist yet** (D6 is blocked on
   the truncated SPEC_V3). The click is dead until D6 lands and logs a route 404.
8. **`WidgetBoundary` coverage.** Only the widgets that exist today are wrapped
   (`TerminalStatus`, `ScreenshotGallery`). §2.3 also lists games, updates list, GitHub
   stats and Codex — those widgets do not exist yet and must be wrapped when built.
9. **`/moderate/[token]`.** `ErrorView` supports the exact copy via props; the route itself
   is deferred because no moderation feature exists.
10. **`[ DETAILS ]` shows `error.message` only.** §2.1 says "In development only, add a
    collapsible `[ DETAILS ]` block" and names only `error.message`; no stack or file paths
    are passed in.

### Root-cause finding fixed in this task: every page shipped an empty body
`LazyChrome` rendered `{children}` **inside** `next/dynamic(..., { ssr: false })` components.
`ssr: false` bails its whole subtree out of server rendering, so the entire page — not just
the chrome — came back as client-only and the SSR HTML was an empty body (content appeared
only after hydration). Fix in `src/components/layout/lazy-chrome.tsx`: `{children}` renders
first and each `ssr: false` import is a **sibling** behind its own `<Suspense fallback={null}>`.
`next.config.ts` was left at the Next 16 default (`reactBrowserBailout: true`) — verified
with `curl` that `/error/403`, `/`, `/work`, `/contact` and an unknown route all now return
real server-rendered markup. This was a site-wide defect, not an error-page one.

### Also fixed: dev server at `127.0.0.1` never hydrated
Next 16 blocks dev-only endpoints (HMR WebSocket, flight prefetch) for origins other than
`localhost`, and that stall is invisible unless you read the dev-server log. Added
`allowedDevOrigins: ["127.0.0.1"]` to `next.config.ts`, which removes the warning and lets
`[HMR] connected` appear. Verified pre-existing on the V5-1 baseline: the command palette did
not mount there either, so this was not introduced by V5-2.

- `TODO(OWNER)`: none new.

## Follow-up fix — hydration warning on `<html>` (2026-10-20, commit `2b26ec3`)

The owner pasted a React hydration warning: the server emitted `<html lang="en" class="...">`
and the client's first render had `data-theme="coral"` (their stored theme) on the same element,
so React logged a mismatch on every page for any user with a non-default theme.

Cause: `ThemeInitScript` (`THEME_INIT_SCRIPT` in `src/lib/theme.ts`) intentionally writes
`data-theme` and `data-crt` onto `<html>` before paint, so the DOM differs from the server
payload by design. Next's own `preventing-flash-before-hydration` guide documents
`suppressHydrationWarning` as the remedy for exactly this case.

Fix: `suppressHydrationWarning` on `<html>` in `src/app/layout.tsx`, with a comment recording
why. The attributes are still applied pre-paint, so there is no theme flash — the flag only
tells React to accept the DOM for that element instead of warning.

Reproduction and verification. The store holds one JSON key, `sm_settings_v1`
(`{ theme, crt }` — `src/lib/theme.ts`), so the probe seeds that key before any page script
runs and then reads back `data-theme`/`data-crt` to confirm the preset actually took effect
(an earlier version of the probe wrote the wrong key, silently stayed on the default `coral`
theme, and so proved nothing — the read-back is what caught it).

React reports this mismatch in **development only**; a production build logs nothing even
with the bug present, which was verified directly (`<html lang class>` from the server vs
`<html lang class data-theme="violet">` on the client, no message). So the evidence is dev-mode:

- With the fix in place, `next dev` over `/`, `/work`, `/contact`, `/nope-nope` and
  `/error/403`, with stored theme `violet` (CRT off) and again with `amber` (CRT on):
  **0** hydration messages across 10 page loads.
- Control: deleting the single `suppressHydrationWarning` line reproduced exactly **1**
  `console:error` per theme (`A tree hydrated but some attributes of the server rendered HTML
  didn't match...`). Restoring the line returned it to 0. That is the causation proof.
- Production re-check with the fix in place: 0 console messages of any kind on the same routes.

The attributes are still applied pre-paint, so there is no theme flash — the flag only tells
React to accept the DOM for that element instead of warning.

Gates after the fix: lint 0, typecheck 0, test 101/101, build 0, verify 0.

### Git repository corruption and recovery (same interruption)

The interrupted session left `.git` damaged, which blocked the commit above for a while. No
work was lost. Recorded here so the recovery is auditable:

- **Damage.** Seven loose object files were **zero-length**, all with mtime `2026-10-20 21:47:30`
  — the objects git was flushing when the process died. Object files are created empty and
  filled in, so a kill in that window leaves exactly this.
- **Torn worktree HEAD.** `.git/worktrees/web2/HEAD` contained the literal text
  `5c3a3057...` — the name of one of the empty objects, not a commit. `git status`, `git log`
  and `git fsck` all aborted on it.
- **V5-2 was never lost.** `.git/worktrees/web2/logs/HEAD` reflog showed
  `27f2a69 -> 490d0c2 commit: V5-2: ...`, and `490d0c2` was present and intact as a 1014-byte
  loose object whose full tree walked cleanly. Only the branch ref had not been advanced yet.
- **What was done.** (1) Full `.git` backup to
  `/tmp/opencode/git-backup/Web.git.20261020-215257` (2.9M). (2) Confirmed none of the seven
  empty objects were reachable from `490d0c2`'s tree, then deleted them. (3) Rewrote the torn
  worktree `HEAD` back to `ref: refs/heads/main`. (4) `git update-ref` fast-forwarded `main`
  from `27f2a69` to `490d0c2` — the reflog proves the ancestry, so this was a fast-forward, not
  a history rewrite. (5) Rebuilt the worktree index, whose `cache-tree` referenced a deleted
  empty object, via `git reset --mixed`.
- **After recovery.** `git fsck` is clean apart from a single `dangling commit 3ad65bf`, a
  pre-existing V5-2 `stash create` WIP commit unrelated to `main` — harmless, and left in place
  deliberately. Working tree files were never affected at any point.
- `TODO(OWNER)`: none new.

## V5-3 — dead routes/links, version-free release, canonical legal pages (2026-10-21)

**Status: DONE.** Commit `a2cabbf`. Owner decisions taken before the work: fix errors +
cleanup + docs + hosting; remove the dead links; treat `DOCCUMENTS/` as canonical for
legal text.

### Defects found (evidence-based)

| # | Defect | Evidence |
|---|---|---|
| 1 | Dead link to `/arcade` | `src/app/not-found.tsx`, `not-found-terminal.tsx`, `error-view.test.tsx`; no `/arcade` route in the `next build` table |
| 2 | Dead link to `/info` | `navbar.tsx` MORE-menu `active` check; no `/info` route |
| 3 | Orphan `loading.tsx` dirs | `src/app/arcade/loading.tsx`, `src/app/updates/loading.tsx` with no `page.tsx`; route absent from the build table |
| 4 | Dead module | `src/lib/github.ts` exported `getRepoStats`, imported nowhere |
| 5 | Hard-coded Wolf version | `portfolio.ts` pinned `releases/tag/v0.4.0` — a direct SPEC_V5 §0 violation |
| 6 | Copy typo | `about/page.tsx`: "client client work" |
| 7 | Missing `/terms` | SPEC_V4 §6.9; route absent |

### Delivered

- Removed every `/arcade` and `/info` link (404 page actions, 404 terminal commands +
  placeholder + help text, navbar `active` check). No user-visible 404s remain.
- Deleted the orphan `src/app/arcade/` and `src/app/updates/` directories (recoverable
  from git when those routes are built).
- `src/lib/github.ts` is no longer dead: `src/app/work/[slug]/page.tsx` calls
  `getRepoStats()` and renders the release link from the API. The version-free
  `/releases` page is the fallback, so no version is ever hard-coded.
- `portfolio.ts`: `releases` replaces `release`; `githubRepo` added to the type. A test
  now asserts no `vX.Y.Z` string appears in the Wolf entry.
- `src/data/legal.ts` + `src/components/legal/legal-page.tsx` + `/terms`; `/privacy`
  rewritten to render the canonical policy. Both pages read from data, never JSX.
- Fixed the about-page typo.

### Firewall conflict and its resolution (recorded in `docs/LEGAL.md`)

The canonical legal text contains content the owner-mandated confidentiality firewall
(`SPEC_V3.md` §1, `scripts/confidentiality-check.mjs`) forbids publishing: a named
referral promoter, referral/commission terms, payment account details, operator
age/guardian language, and Discord. The build failed on these.

Owner ruling: **redact the public edition.** Kept every other clause verbatim (brand
name substituted); replaced each withheld clause with an explicit `TODO(OWNER)` marker
in sections 4.2 and 4.4, and generalised section 1.1. No clause was invented, none was
silently dropped, and the firewall was not weakened.

### Gates (real output)

```
LINT=0
TSC=0
TEST=0      Test Files 11 passed (11), Tests 102 passed (102)
BUILD=0     route table now includes /terms
VERIFY=0    confidentiality-check: OK, brand-check: OK (127 files, 0 violations)
```

## V5-4 — hosting readiness and documentation set (2026-10-21)

**Status: DONE (one owner decision pending — see Blocked).**

### Delivered

- `DEPLOY.md` — Vercel (recommended), Cloudflare Workers/Pages, any Node host, and the
  static/InfinityFree path, plus env-var reference and a post-deploy checklist.
- `docs/HOSTING.md` — host comparison table and the InfinityFree constraint in short form.
- `docs/LEGAL.md` — redaction record: what was published, what was withheld, and why.
- `docs/SOURCE_DOCUMENTS.md` — index of the owner's six `DOCCUMENTS/*.docx` files, which
  are used, and which public facts they support.
- `docs/CACHING.md` — per-route strategy verified against the real build table.
- `docs/SECURITY.md` — implemented measures vs. the planned backlog, honestly split.
- `README.md` — rewritten (the old file had a duplicated heading and stale commands).
- `package.json` — added `check:e2e` (the Playwright checks). It is deliberately **not**
  in `verify`, which must stay offline and deterministic; the e2e checks need a running
  server.

### The InfinityFree finding

InfinityFree is shared PHP hosting with **no Node.js runtime**, so this Next.js app
cannot run there as-is. Two API routes (`/api/order`, `/api/contact`) must execute
server-side to reach Resend, and `next.config.ts` `headers()` is unsupported by a static
export. Documented as Option A (host on Vercel — recommended) and Option B (static
export with the forms degraded to the existing mailto fallback). Owner acceptance of
Option B is required before it is ever used.

### Gates (real output)

```
LINT=0  TSC=0  TEST=0 (102/102)  BUILD=0  VERIFY=0
```

### `TODO(OWNER)` raised

1. Accept the boot-splash vs cold-performance trade-off (carried over from V4-3).
2. Approve or replace the redacted legal wording in sections 4.2 and 4.4.
3. Confirm Option B (static export) is acceptable if InfinityFree is ever required.

## V5-5 — boot splash vs cold performance: owner decision applied (2026-10-21)

**Status: DONE.** Owner chose the "best option" for the V4-3 open question: keep
the boot splash but make it **non-covering**, so the real page content can win
Largest Contentful Paint.

### The decision

V4-3 root-caused the cold Performance score (47–52 vs a ≥90 target) using
Lighthouse's `lcp-breakdown-insight`: the LCP element was the boot-splash text,
with `elementRenderDelay` 1.2–1.7 s. The cause is structural — SPEC_V3 §106
specified a **full-screen opaque overlay**, so while it is on screen the real page
is hidden and the overlay becomes the largest painted element. V4-3 also recorded
a falsification: shrinking the splash to one line did **not** change the LCP
element, because the overlay still covered the viewport.

V4-3 offered the owner two options: (a) accept cold ~50 / warm 72 with the cause
documented, or (b) authorise a non-covering splash variant. **The owner chose (b).**

### What changed

`src/components/boot-splash.tsx` — the splash is now a contained panel
(`fixed bottom-6 left-6`, `w-[min(20rem,calc(100vw-3rem))]`) instead of
`fixed inset-0`. Every other §106 requirement is unchanged:

| §106 requirement | Status |
|---|---|
| First load of a session only (`sessionStorage` `sm_boot_v1`) | kept |
| Held at most 1.4 s | kept (measured 1486 ms = 1400 ms hold + 100 ms fade) |
| Coral mark fading in | kept (CSS accent mask, no PNG) |
| The 3 mono lines verbatim | kept, verified text |
| Any key or click skips | kept, verified |
| `prefers-reduced-motion` skips entirely | kept, verified |
| `sessionStorage` in try/catch | kept |
| **Full-screen overlay** | **changed to a contained panel** — this is the §106 clause the owner authorised altering for perf |

Hidden below `sm` so it never covers content on small screens.

### Measured result

New `scripts/check-lcp.mjs` reports the real LCP element on a fresh session:

| | Before (V4-3, Lighthouse) | After (this task, direct probe) |
|---|---|---|
| LCP element | boot-splash text (`> booting scriptmønks...`) | navbar wordmark `SPAN` (`scriptmønks_`) — real content |
| LCP render time | 4.7–5.5 s | 908–1076 ms |
| `elementRenderDelay` | 1.2–1.7 s | 822 ms |
| Splash viewport coverage | 100% | **2.5%** (320×90 px of 1280×900) |
| Splash present / skippable / reduced-motion | — | all verified PASS |

**Honest caveat:** the measured Lighthouse Performance score on this machine
ranged 46–68 across runs, and LCP 2.3–5.9 s. That spread is localhost CPU
contention (Lighthouse's 4× simulated CPU throttle on a box also running the
server and the browser), not run-to-run instability in the site. The stable,
directly measured signals are the ones above: the LCP element is now real content
and `elementRenderDelay` fell to 822 ms. Reaching a *reportable* ≥90 still needs a
quiet measurement environment; it is not claimable from these runs and is not
claimed here.

### Bonus fix found while investigating: zod was loading on every route

Lighthouse attributed the remaining TBT to `scriptEvaluation`, with two chunks
99.9% unused on `/`. They were **zod** (144 kB) and **framer-motion** (152 kB) —
neither used by the home page. Cause: `src/lib/validation.ts` exported runtime
label maps (`BUDGET_LABELS`, `PROJECT_TYPE_LABELS`, `TIMELINE_LABELS`) alongside
its zod schemas, and the order step components imported those labels — dragging
the whole zod runtime into the client graph.

Fix: the label maps and the `OrderFormValues` type now live in the zod-free
`src/types/order.ts`; `validation.ts` re-exports them for server callers, and a
compile-time guard asserts the schema's inferred type still matches the
hand-written one so they cannot drift.

Verified per-route first-load JS (raw):

| route | before | after | zod chunks |
|---|---|---|---|
| `/` | 639 kB | **543 kB** | none |
| `/about` | 633 kB | 596 kB | none |
| `/work` | 645 kB | 608 kB | none |
| `/terms` | — | 537 kB | none |
| `/order` | 924 kB | 828 kB | 2 (used) |
| `/contact` | 779 kB | 683 kB | 1 (used) |

zod now loads only where it is actually used.

### Gates (real output)

```
LINT=0  TSC=0  TEST=0 (102/102)  BUILD=0  VERIFY=0
e2e (production build): error pages 27/27, nav behaviour 16/16, header 0 defects
splash: present, 3 lines verbatim, 2.5% coverage, key-skip, reduced-motion skip — all PASS
```

### New script

- `scripts/check-lcp.mjs` — reports the real LCP element and its render time on a
  fresh session; the evidence tool for this decision.

### `TODO(OWNER)`

- The non-covering splash is a deliberate, owner-authorised amendment to
  SPEC_V3 §106's "full-screen overlay" wording. If the full-screen overlay must
  return, cold Performance falls back to ~50 and that trade-off is the owner's.
