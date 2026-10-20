# SCRIPTMONKS WEBSITE: V3 REVISION SPEC FOR OPENCODE

> **Mode: REVISION.** The site from `SPEC.md` and `SPEC_V2.md` exists. The owner loves the design. This file **overrides** any conflicting statement in those two files.
> **How to use:** save as `SPEC_V3.md` in the repo root. Tell OpenCode:
> *"Read SPEC_V3.md fully, including Section 0. Run Task V3-1 only. Stop and report with real command output."* Then V3-2 … V3-8, one at a time.

---

## 0. ANTI-HALLUCINATION PROTOCOL (applies to every task)

1. **Audit before editing.** List the files you will touch and read them first. Never assume a file, component, prop, or export exists. Check with `ls`, `grep`, or by opening it.
2. **Only facts from this spec.** Do not invent prices, timelines, response times, client details, testimonials, metrics, legal wording, business hours, or product claims. If a fact is missing, write `TODO(OWNER)` in code and list it in your report. Where this spec gives exact text, copy that text.
3. **Never claim success without evidence.** After every task run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` and paste the real tail of the output. If a command fails, show the failure and fix it. Never write "should work".
4. **No unrequested dependencies.** Allowed new packages: `sharp` (dev), `cmdk`, `playwright` (dev, for screenshots), `vitest` (already present). Anything else needs a written reason and owner approval. Pin exact versions from what `pnpm add` actually installs; never type version numbers from memory.
5. **Design is locked.** Tokens, fonts, dot-matrix, bracketed `[ LABEL ]` buttons, brutal shadows, and the 2px radius cap stay exactly as they are. New UI is built from existing `ui/` primitives. The only allowed change to `tailwind.config.ts` is the CSS-variable indirection in V3-4, which must render **pixel-identical** to the current default (prove it with before/after screenshots).
6. **Do not touch** `logo.png` (the original), `screenshots/`, or any file not named in the task. Do not delete pages that exist unless this spec says so.
7. **If something is ambiguous or this spec conflicts with the code, stop and ask in your report.** Do not guess.
8. **Visual verification.** At the start of V3-1, use Playwright to save baseline screenshots (375px and 1440px) of `/`, `/order`, `/work` into `.baseline/` (git-ignored). After each task, re-shoot and list what visibly changed. If you cannot view images, report numeric checks instead (e.g. image `naturalWidth > 0`, bounding boxes, computed colors).

---

## 1. CONFIDENTIALITY FIREWALL (owner's internal documents are secret)

The owner supplied internal agreements (NDA, referral agreement, invoice template, SOW, client agreement, terms). **Public information was extracted for this spec; everything else must never appear on the website, in code, comments, README, tests, env examples, commit messages, or generated files.**

**NEVER include, mention, hint at, or paraphrase:**
- Any referral/promoter/middleman program, commission rates or caps, or any named promoter.
- The names `Inesh`, `Kshettri`, `Ksheetri`, `K Sheetri`, `Noah`, `Huber` anywhere (client identities are confidential).
- Payment account details of any kind: eSewa, Khalti, bank, account numbers, routing numbers, QR codes, phone numbers.
- The operator's age, guardian/parent/family language, or home address. (Founder name `Arthur Joseph Lawson` and country-level currency NPR are already public and allowed.)
- NDA contents, internal agreement titles, revenue data, product roadmaps, credentials, API keys, tokens, `.env` values.
- Discord (removed in V2).
- Any "profit-sharing" or "team revenue share" wording (that arrangement was cancelled).

**Enforcement script (create in V3-1, wire into `verify` and `prebuild`):** `scripts/confidentiality-check.mjs` scans `src/`, `public/`, `README.md`, `DEPLOY.md`, `.env.example`, and fails with exit code 1 listing file:line for any match of these case-insensitive patterns (the spec files themselves are excluded):

```
/\b(inesh|kshettri|ksheetri|sheetri|noah|huber)\b/
/promoter|referral|commission|middleman/
/esewa|khalti|account\s*number|routing|swift|neft/
/\bnda\b|non-disclosure/
/guardian|sole minor|minor developer|under the age|age of majority/
/discord/
/profit[- ]?shar|revenue[- ]?shar/
/\b9[78]\d{8}\b/
```
Allowlist: the phrase `minor revisions` (used in Terms). Report the script's real output.

---

## 2. DECISIONS & CORRECTIONS (source of truth)

| Topic | Decision |
|---|---|
| Currency | **NPR only.** Remove every `$`, `USD`, dollar amount from the site. |
| Project price range | **NPR 200 minimum, NPR 5,000 maximum** per project. Larger ideas are split into separate phases/SOWs, each at or below NPR 5,000. |
| Payment method | **Cash only, in NPR.** No online payment system exists yet; it may come later. The site has **no payment integration, no payment account details, and no checkout.** |
| Payment structure (public in Terms) | 50% upfront before work starts (non-refundable once development begins); 50% before final delivery. |
| Order delivery | Orders go **straight to `script.monks.mail@gmail.com`** by email (Resend, server-side). **No database, no storage, no admin panel.** Nothing is logged except error codes. |
| Client identities | **All client entries are anonymous** (confidential per owner's own agreements). Show industry only. |
| Contact | Email `script.monks.mail@gmail.com`; Instagram `@Script_monks`; GitHub company `@Script_monks`, developer `@ArthurJosephLawson`. |
| Response-time claims | **Remove** every "24-48h", "reply within", "scope call" claim added earlier. Replace with `We reply by email.` |
| Collaboration | **Remove** the Collaborate tab, the profit-sharing callout, and `kind: "collaborate"` from `/contact` and `/api/contact` (the arrangement is cancelled). `/contact` becomes General only. |
| Prizes | **Cosmetic and non-monetary only** (badges, titles, rank, accent themes, CRT mode, secret terminal commands). **No discounts, vouchers, cash, or price changes.** Client-side game state is forgeable, so it can never carry monetary value. |
| Games data | Stored only in the visitor's own browser. No server, no accounts, no global leaderboard, no free-text names. |
| Hosting | Vercel free tier (see Section 8). |

---

## 3. LOGO FIX (Task V3-1)
[...full spec continues... see original user message]

### 3.1 Measured facts about `/logo.png` (verified by pixel analysis, do not re-guess)
- Size **1408 x 768**, RGBA. Background is an **opaque cream** (about `#F3F3EB`). This is why it looks wrong on the dark `#09181B` site: it is a light rectangle.
- Artwork is a single charcoal ink (about `#3B4141`): a hooded monk figure plus the wordmark `ScriptMønks` (note the **ø**).
- Monk figure bounding box: **x 621–786, y 147–477** (166 x 331 px).
- Wordmark bounding box: **x 415–992, y 525–618** (578 x 94 px).
- A faint light **sparkle mark sits in the bottom-right corner** (around x 1290, y 650). It is not part of the logo. It must not appear in any output.
- Source resolution is limited: **never upscale** beyond 1x.

### 3.2 Rules
- **Do not redraw, retype, vectorize freehand, or "improve" the artwork.** Only derive assets from the supplied file by removing the background and recoloring.
- Keep the original `logo.png` untouched in the repo root.

### 3.3 Brand asset build script
Create `scripts/build-brand.mjs` (uses `sharp`) and `package.json` script `"brand": "node scripts/build-brand.mjs"`. Commit the generated files.

### 3.4 Brand asset check (`scripts/check-brand.mjs`, part of `verify`)
Must assert, for every PNG in `public/brand/` and the two `src/app` icons:
1. File exists, width and height > 0, and no dimension exceeds the source scale (no upscaling).
2. For `logo-*.png`: all four corner pixels have alpha `0`; opaque pixels are between 3% and 70% of the image; no pixel with alpha > 0 lies in the right-most 5% of columns beyond the artwork (guards against the corner sparkle).
3. `logo-mark*.png` aspect ratio (w/h) between 0.45 and 0.65.
Print a table of results.

### 3.5 Placement on the site (replace the current logo usage)
| Place | Asset | Spec |
|---|---|---|
| Navbar | `logo-mark.png` + existing mono text `scriptmonks_` (blinking cursor) | Mark `h-10 w-auto`, vertically centered, 10px gap before text. Remove any large/cream/boxed logo that exists now. |
| Footer | `logo-full.png` | `w-44` (176px), `opacity-90`. |
| Hero (decorative) | `logo-mark.png` | Absolutely positioned behind the hero text on desktop only, `opacity-[0.06]`, height `min(70vh, 480px)`, `pointer-events-none`, `aria-hidden`. |
| About page | `logo-full.png` | `w-56`. |
| Favicon / Apple icon | `src/app/icon.png`, `src/app/apple-icon.png` | Generated by the script. |
| OG image | `opengraph-image.tsx` | `#09181B` background, `logo-full.png` centered (about 360px wide), tagline below in `text-muted-teal`, 2px coral border. |
- Use `next/image` with explicit `width`/`height` equal to the PNG's real dimensions; navbar logo gets `priority`.
- `alt="Scriptmonks"` on the navbar mark; decorative uses `alt=""`.
- **Boot splash (small interactive touch):** on the first page load of a browser session (`sessionStorage` key `sm_boot_v1`), show a full-screen `#09181B` overlay for at most 1.4 s: coral `logo-mark` fading in with 3 mono lines (`> booting scriptmonks...`, `> loading modules [ OK ]`, `> ready_`). Any key or click skips it. Skipped entirely with `prefers-reduced-motion`. Wrap storage in try/catch.
- Logo easter egg: clicking the navbar mark 5 times within 3 seconds triggers the `monk-mode` achievement (see V3-4).

---

## 9. EXECUTION PLAN

### V3-1: Audit, baseline, logo, confidentiality script
> Read SPEC_V3.md. Do Section 0 steps 1 and 8 (audit plus baseline screenshots). Then execute Section 3 (brand script, check script, placements, boot splash), create `scripts/confidentiality-check.mjs` per Section 1, and remove every violation it reports (including `Inesh`, `Noah`, Discord leftovers, profit-sharing wording, collaboration tab, and invented response-time claims).

**Acceptance:** `public/brand/*.png` exist with transparent backgrounds; check scripts pass with real output shown; navbar/footer/hero/OG show the recolored logo without any cream box or corner sparkle; boot splash skippable; confidentiality script exits 0.

[...rest as needed...]
