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
