# SCRIPTMØNKS WEBSITE: V4 REVISION SPEC FOR OPENCODE

> **This is a NEW session with NO memory.** The agent must rebuild its understanding from the repository, not from chat history.
> **How to use:** save as `SPEC_V4.md` in the repo root (next to `SPEC.md`, `SPEC_V2.md`, `SPEC_V3.md`). Then tell OpenCode:
> *"Read SPEC_V4.md fully, including Section 0. Run Task V4-0 only. Stop and report with real command output."* Continue V4-1 … V4-8, one at a time.
> If OpenCode does not automatically load `AGENTS.md`, paste its contents at the start of each session.

---

## 0. BOOTSTRAP FOR A FRESH SESSION

### 0.1 Reading order (mandatory)
1. `AGENTS.md`, then `SPEC_V3.md` **Sections 0 (anti-hallucination protocol) and 1 (confidentiality firewall)**. Both remain in force for all work.
2. `SPEC_V3.md` Sections 2–8, then `SPEC_V2.md` and `SPEC.md` as background.
3. This file.
If any of these files is missing, **stop and tell the owner**. Do not reconstruct them from guesswork.

### 0.2 Precedence
This file overrides earlier specs where they conflict. Specific overrides:
| Earlier rule | V4 rule |
|---|---|
| Company display name `Scriptmonks` | **`ScriptMønks`** (Section 2) |
| V3: accent themes cyan/amber/rose unlock at levels | **All accent themes and CRT mode are free for everyone** (Section 3). Level rewards shrink to rank titles, badges, and the `matrix` terminal command |
| V3: "no database, no storage" | Still true for **orders and contact messages (email only)**. **Community Updates (Section 6) is the one feature that stores data** |
| V3: four games | **Six games** (Section 7) |
| Terms/Privacy text in V3 Section 5 | Extended with the exact added text in Section 6.9 |

### 0.3 Status discovery (Task V4-0)
Do not assume V3 was finished. Inspect the repo and produce a table for each V3 task (V3-1 … V3-8): `DONE | PARTIAL | MISSING`, with **concrete evidence** (file paths, script outputs). Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` and report real results. Then:
- Create `docs/PROGRESS.md` (external memory). After **every** task, append: task id, status, files changed, commands run with result summary, open `TODO(OWNER)` items.
- If any V3 task is `PARTIAL` or `MISSING`, **finish it first** (one task at a time, following `SPEC_V3.md` exactly, and the V4 overrides above), then continue. Report before moving on.
- Make a git commit after each task (`git add -A && git commit -m "<task id>: <summary>"`). Never rewrite history.

### 0.4 Rules carried over and added
- Design is locked (tokens, fonts, dot-matrix, bracketed buttons, brutal shadows, 2px radius cap). Do not redesign.
- Facts only from the spec files. Missing facts become `TODO(OWNER)`.
- No new dependencies except those approved here: `@supabase/supabase-js`, `obscenity` (verify it exists with `pnpm view obscenity`; if it does not exist, use the fallback described in 6.5), plus those already approved in V3. Install with `pnpm add` and use the versions it resolves, never versions from memory.
- Never claim success without pasted evidence.
- **Secrets:** nothing secret in the repo, in `NEXT_PUBLIC_*` variables, in logs, or in the client bundle.

---

## 1. NOTES ON WHAT TO KEEP

- **Keep the blinking-cursor text beside the logo in the navbar exactly as it is.** Do not remove, redesign, or "improve" it. After the rename it reads `scriptmønks_` with the same blinking cursor element and animation.
- Keep everything the owner approved in V2 and V3 unless a section below changes it.

---

## 2. RENAME: Scriptmonks → ScriptMønks (Task V4-1)

**Display name:** `ScriptMønks` (capital S, capital M, lowercase `ø`). The logo image already says ScriptMønks.

### 2.1 Change (visible copy only)
Replace the brand name in: navbar mono text (`scriptmønks_`, lowercase for the mono wordmark), footer, hero copy, about, process, FAQ, work pages, terminal output, command palette, toasts, page `<title>` template (`%s | ScriptMønks`), default title (`ScriptMønks | Software House & Digital Agency`), Open Graph and Twitter metadata, `opengraph-image.tsx`, email subjects and bodies (`[ScriptMønks] New order …`), `data/legal.ts` (Terms and Privacy: name substitution only; do not alter any clause), `README.md`, `DEPLOY.md`, `AGENTS.md`, copyright line (`© {year} ScriptMønks`).

### 2.2 DO NOT change (these are identifiers, not display names)
- Email `script.monks.mail@gmail.com`
- Handles and URLs: `@Script_monks`, `github.com/Script_monks`, `instagram.com/Script_monks`, `github.com/ArthurJosephLawson`
- Domain `scriptmonks.com`, `NEXT_PUBLIC_SITE_URL`
- `package.json` `name`, repo and folder names, npm package `deploymonk`, env variable names, CSS class names, TypeScript identifiers
- The `RESEND_FROM` display name may stay ASCII (`Scriptmonks Orders <…>`) for deliverability. First test whether Resend accepts `ScriptMønks Orders`; if it does, use it, otherwise keep ASCII.

### 2.3 Typography and encoding
- All files UTF-8. The `ø` must render in **both** fonts: set `subsets: ["latin", "latin-ext"]` in both `next/font/google` calls (JetBrains Mono and Manrope).
- Mono labels use CSS `uppercase`, which renders `SCRIPTMØNKS`. Confirm it looks correct.
- Verify `opengraph-image` renders the `ø` by viewing the generated image. If the glyph is missing, load a font file that includes it for `ImageResponse`.

### 2.4 SEO (so people searching the ASCII spelling still find it)
- JSON-LD `Organization`: `name: "ScriptMønks"`, `alternateName: ["Scriptmonks", "Script Monks"]`.
- Metadata `keywords` includes `Scriptmonks` and `ScriptMønks`.

### 2.5 Enforcement script
Create `scripts/brand-check.mjs` (add to `verify` and `prebuild`). It scans `src/`, `public/`, `README.md`, `DEPLOY.md`, `.env.example` for `/script[\s_.-]?monks/i`, and fails (exit 1, listing file:line) on any match **except** these allowlisted forms: `script.monks.mail@gmail.com`, `Script_monks`, `scriptmonks.com`, `alternateName`, `keywords`, `RESEND_FROM`, `package.json` name. Print the real output.

**Acceptance:** `pnpm brand:check` passes; the navbar still shows the blinking cursor; the `ø` renders in navbar, footer, OG image and page titles; emails show `[ScriptMønks]` in the subject (verified by unit test on the subject builder).

---

## 3. SMOOTH THEME CHANGER (Task V4-2)

### 3.1 Themes (all free for everyone)
| id | Label | Accent RGB | Dim RGB |
|---|---|---|---|
| `coral` (default) | CORAL | `255 122 101` | `200 91 75` |
| `cyan` | CYAN | `34 211 238` | `14 165 190` |
| `amber` | AMBER | `251 191 36` | `202 150 20` |
| `rose` | ROSE | `251 113 133` | `210 80 100` |
| `violet` | VIOLET | `167 139 250` | `130 105 210` |
The dark base palette never changes. Status colors (`status-ok`, errors) never change with the theme. The default must stay **pixel-identical** to the current coral look (compare against screenshots).

### 3.2 Implementation: animate the variables, not the elements
Replace V3's single-triplet variables with three registered numeric properties so the browser can interpolate the accent smoothly:

```css
@property --ar { syntax: "<number>"; inherits: true; initial-value: 255; }
@property --ag { syntax: "<number>"; inherits: true; initial-value: 122; }
@property --ab { syntax: "<number>"; inherits: true; initial-value: 101; }
@property --dr { syntax: "<number>"; inherits: true; initial-value: 200; }
@property --dg { syntax: "<number>"; inherits: true; initial-value: 91; }
@property --db { syntax: "<number>"; inherits: true; initial-value: 75; }

:root {
  --ar: 255; --ag: 122; --ab: 101; --dr: 200; --dg: 91; --db: 75;
  --accent-coral: var(--ar) var(--ag) var(--ab);
  --accent-coral-dim: var(--dr) var(--dg) var(--db);
  transition: --ar .45s ease, --ag .45s ease, --ab .45s ease,
              --dr .45s ease, --dg .45s ease, --db .45s ease;
}
:root[data-theme="cyan"]   { --ar: 34;  --ag: 211; --ab: 238; --dr: 14;  --dg: 165; --db: 190; }
:root[data-theme="amber"]  { --ar: 251; --ag: 191; --ab: 36;  --dr: 202; --dg: 150; --db: 20; }
:root[data-theme="rose"]   { --ar: 251; --ag: 113; --ab: 133; --dr: 210; --dg: 80;  --db: 100; }
:root[data-theme="violet"] { --ar: 167; --ag: 139; --ab: 250; --dr: 130; --dg: 105; --db: 210; }
@media (prefers-reduced-motion: reduce) { :root { transition: none; } }
```
Tailwind keeps `rgb(var(--accent-coral) / <alpha-value>)`, so every existing `*-accent-coral` class animates with no component changes. **Prove it works:** with Playwright, switch the theme and sample the computed `color` of a coral element at ~150 ms; it must differ from both the start and end colors. If a browser lacks `@property` support, the switch is instant (acceptable fallback). Report the test result.

### 3.3 Switcher UI
- Navbar button `[ THEME ]` with a small swatch dot in the current accent. Opens a popover (focus-managed, Esc closes, arrow keys move, Enter selects, `role="listbox"`) listing the 5 swatches with labels, plus toggles `CRT SCANLINES` and `REDUCE EFFECTS`.
- **Hover/focus preview** on desktop: hovering or arrowing onto a swatch previews it live; leaving without choosing reverts. Click commits. No preview under reduced motion (commit only).
- Persist to storage (`settings.theme`, `settings.crt`) with try/catch; the pre-paint inline script from V3 applies `data-theme` before first paint so there is no flash.
- Also reachable via the command palette (`Theme: <name>`) and the terminal (`theme <name>`, `theme list`).
- **Accent-colored logo usage** (e.g. hero watermark) must use a CSS mask (`mask-image: url(/brand/logo-mark.png)` with `background-color: rgb(var(--accent-coral))`) so it follows the theme. Do not generate per-theme PNGs.
- Update the V3 Codex drawer: remove the theme and CRT locks and the level text for them.

---

## 4. SMOOTHNESS & POLISH (Task V4-3)

Make the whole site feel fast and fluid without changing the design.

| Area | Spec |
|---|---|
| Route transitions | Add `app/template.tsx` that wraps children in a 180 ms fade plus 8 px upward slide (CSS animation; transform/opacity only). Disabled under reduced motion. |
| Navigation feedback | `NavProgress`: a 2 px accent bar at the top that starts when an internal link is clicked and finishes when the pathname changes. Reuse the existing scroll-progress component if one exists; do not stack two bars. |
| Scrolling | Native only: `scroll-behavior: smooth` and `scroll-padding-top` equal to the navbar height. **No scroll-hijacking libraries.** |
| Loading states | `loading.tsx` skeletons for `/work`, `/work/[slug]`, `/updates`, `/arcade` using `bg-dark-raised` blocks with a subtle shimmer. Reserve heights so nothing jumps (CLS). |
| Micro-interactions | Primary buttons: press state (`translate`), and on desktop a "magnetic" pull toward the pointer of at most 6 px. Cards already lift on hover (keep). Links: underline grows from the left in accent color. |
| Images | `next/image` everywhere, `sizes` set, `priority` only for the LCP image. |
| Fonts | `display: "swap"`, subsets include `latin-ext`. |
| Below-the-fold sections | `content-visibility: auto` with `contain-intrinsic-size` placeholders. |
| JS cost | Games, terminal, Codex, lightbox, and the updates form load via `next/dynamic`. Report first-load JS per route from the real `next build` output. |
| Mobile | All tap targets at least 44 x 44 px; no horizontal scroll at 320, 375, 768, 1440; respects safe-area insets. |
| 404 page | Mini interactive terminal (`404: page not found`, accepts `home`, `work`, `arcade`, `help`) plus a `[ PLAY ARCADE ]` button. |
| Accessibility | Focus is moved to the page `<h1>` after route changes; skip-to-content link; all new controls keyboard operable. |

**Targets (report real numbers, do not promise):** Lighthouse mobile Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on `/`, `/work`, `/order`, `/updates`, `/arcade`; CLS < 0.05. If a target is missed, state the measured value and the cause.

---

## 5. FOLLOW & SUPPORT (Task V4-4)

Create `components/sections/follow-card.tsx` and show it on: the home page (just before the CTA band), `/about`, `/updates`, the order success screen, and as a compact row in the footer. Terminal command `follow` prints the links.

**Copy (exact):**
- Heading: `Enjoying ScriptMønks?`
- Body: `Like and follow us on Instagram and GitHub, and star our open-source repos. It's free and it helps a lot.`

**Buttons (bracketed, open in a new tab with `rel="noopener noreferrer"`):**
| Label | URL |
|---|---|
| `[ INSTAGRAM · @Script_monks ]` | `https://instagram.com/Script_monks` |
| `[ INSTAGRAM · @monk_mango ]` | `https://instagram.com/monk_mango` — `TODO(OWNER): confirm this handle should be public` |
| `[ GITHUB · @Script_monks ]` | `https://github.com/Script_monks` |
| `[ GITHUB · @ArthurJosephLawson ]` | `https://github.com/ArthurJosephLawson` |
| `[ ★ STAR WOLF ]` | `https://github.com/ArthurJosephLawson/Wolf` |
| `[ ★ STAR DEPLOYMONK ]` | from `portfolio.ts` (`links.repo`) — `TODO(OWNER): confirm the DeployMonk repo URL` |
All URLs come from `site.ts`/`portfolio.ts`, not hard-coded in JSX. **Do not show follower counts, and do not give XP for clicking.**

---

## 6. COMMUNITY UPDATES (Tasks V4-5 and V4-6)

A page where visitors can post **bugs, opinions, ideas, and photos**, with strong abuse protection. **All posts are held for the owner's approval; nothing appears publicly until approved.** There is no automatic check that an image is safe, so the owner must look at every image before approving.

### 6.1 Infrastructure (free tier)
- **Supabase** (Postgres + Storage), accessed **only from server code** with the service-role key. Row Level Security enabled on every table with **no public policies**.
- **Cloudflare Turnstile** (free) for bot protection, optional but strongly recommended.
- If Supabase env vars are missing, `/updates` still works: it shows the official updates, and the community area shows `Community posts are not available right now.` The build never fails because of missing env.
- Design a `UpdatesStore` interface (insert, list approved, set status, counters, reactions, reports, bans, rate-event queries) with a Supabase implementation, so all logic can be unit-tested with an in-memory fake. **No network in tests.**

### 6.2 Environment variables (add to `.env.example`)
```
NEXT_PUBLIC_UPDATES_ENABLED=true
UPDATES_IMAGES_ENABLED=false        # set true only when you are ready to review every image
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=          # server only, never NEXT_PUBLIC
IP_HASH_SECRET=                     # random, 32+ bytes (openssl rand -hex 32)
MODERATION_SECRET=                  # random, 32+ bytes
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```
If `UPDATES_IMAGES_ENABLED` is not `true`, the form hides the image field and the API rejects image uploads.

### 6.3 Database (`supabase/schema.sql`, committed)
```sql
create extension if not exists pgcrypto;

create table community_posts (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('opinion','bug','idea','photo')),
  nickname text not null check (char_length(nickname) between 2 and 24),
  title text not null check (char_length(title) between 3 and 80),
  body text not null check (char_length(body) between 10 and 1000),
  image_path text,
  image_alt text check (image_alt is null or char_length(image_alt) <= 120),
  contact_email text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','hidden')),
  content_hash text not null,
  ip_hash text not null,
  like_count int not null default 0,
  report_count int not null default 0,
  created_at timestamptz not null default now(),
  moderated_at timestamptz
);
create index on community_posts (status, created_at desc);
create index on community_posts (ip_hash, created_at desc);
create unique index community_posts_dedupe on community_posts (content_hash) where status in ('pending','approved');

create table abuse_events (
  id bigserial primary key,
  ip_hash text not null,
  kind text not null,                -- 'post' | 'filter_strike' | 'report' | 'reaction'
  created_at timestamptz not null default now()
);
create index on abuse_events (ip_hash, kind, created_at desc);

create table banned_senders (
  ip_hash text primary key,
  reason text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table post_reactions (
  post_id uuid not null references community_posts(id) on delete cascade,
  ip_hash text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, ip_hash)
);

create table post_reports (
  post_id uuid not null references community_posts(id) on delete cascade,
  ip_hash text not null,
  reason text,
  created_at timestamptz not null default now(),
  primary key (post_id, ip_hash)
);

alter table community_posts enable row level security;
alter table abuse_events    enable row level security;
alter table banned_senders  enable row level security;
alter table post_reactions  enable row level security;
alter table post_reports    enable row level security;
-- No policies on purpose: only the server (service role) can read or write.
```
Storage: one **private** bucket named `updates`. Housekeeping runs opportunistically inside each submission (no cron): delete `abuse_events` older than 48 h and `banned_senders` that have expired.

### 6.4 Anti-abuse limits (constants in `src/lib/updates/config.ts`)
All "sender" checks use `ip_hash = HMAC_SHA256(IP_HASH_SECRET, clientIp)`. The raw IP is never stored or logged. Client IP comes from the platform's forwarded header (`x-forwarded-for`, first entry).

| Rule | Value |
|---|---|
| Posts per sender | **1 per 10 minutes, max 3 per 24 h** (counts pending, approved, and rejected) |
| Global cap | Max **40 new posts per 24 h** across all senders; beyond that the API replies `PAUSED`. This protects the order-email quota. Check Resend's current free limits and mention them in `DEPLOY.md`. |
| Filter strikes | Each post rejected by the language filter adds a strike; **3 strikes in 24 h → sender banned for 24 h** |
| Owner ban | "Ban sender" in moderation bans for **7 days** |
| Duplicates | Reject if the SHA-256 of the normalized `title + body` matches any pending or approved post |
| Reactions | 1 per sender per post; max 60 per 24 h |
| Reports | 1 per sender per post; max 10 per 24 h; **3 distinct reports auto-hide the post** and notify the owner once |
| Request size | Max 3 MB total; 413 beyond that |
| Origin check | `Origin` (or `Referer`) host must equal the site host (allow `localhost` in development), otherwise 403 |
| Bot checks | Honeypot field `website` must be empty; time-trap: form open for ≥ 4 seconds; Turnstile token verified server-side when `TURNSTILE_SECRET_KEY` is set. Failing a bot check returns a generic success-looking response and stores nothing. |

### 6.5 Content filter (`src/lib/updates/moderation.ts`, pure and unit-tested)
Applied to nickname, title, body, and image alt text, **on the server (authoritative)** and in a shared pure module for instant client feedback.
1. **Normalize:** NFKC, strip diacritics, remove zero-width and bidi-control characters, lowercase, collapse repeated letters (`fuuuck` → `fuck` style), map common leetspeak (`0→o, 1→i, 3→e, 4→a, 5→s, 7→t, @→a, $→s`), and produce a second form with all non-letters removed to catch spaced or dotted words (`f u c k`, `f.u.c.k`).
2. **Profanity:** use the `obscenity` library (English dataset with its recommended transformers) against both normalized forms. If `pnpm view obscenity` fails, fall back to a local matcher that uses the same normalization with a word list stored in `src/data/moderation.local.ts`. **Do not write slurs or word lists yourself.** Provide the file empty with a comment so the owner can add words (for example Romanized Nepali terms).
3. **Owner-extensible list:** `src/data/moderation.local.ts` exports `extraBlockedWords: string[]` and `allowedWords: string[]` (to fix false positives), both empty by default and merged into the matcher.
4. **Other rejections:** URLs (`http`, `www.`, `.com/` and similar patterns), email addresses, phone-like digit runs (7+ digits, spaces and dashes ignored), more than 6 repeated identical characters in a row, more than 10 emoji, more than 70% uppercase letters when the text has at least 20 letters, and any HTML-looking tags.
5. **Never reveal what matched.** The API returns the code `FILTER` and the generic message `Your post contains language or content we don't allow. Please edit it and try again.`
6. Output is always rendered as **plain text** (React escaping, `white-space: pre-wrap`). No Markdown, no HTML, no auto-linking.
7. Tests (Vitest) use mild, standard profanity and obfuscation variants, benign words that contain profane substrings (to guard against false positives), URL/email/phone detection, normalization, and the strike/ban logic with an injected clock.

### 6.6 Image handling (`src/lib/updates/image.ts`)
- Only when `UPDATES_IMAGES_ENABLED === "true"` and only for `kind` `bug` or `photo`. Max **1 image, 2 MB**.
- Receive as `multipart/form-data`. Do not trust the filename or `Content-Type`. Detect the real format with `sharp(...).metadata()`; accept only `jpeg`, `png`, `webp`. **No GIF, no SVG.**
- `sharp(input, { limitInputPixels: 25_000_000 })`, `.rotate()` (apply EXIF orientation), resize so the long side is at most 1280 px without enlargement, re-encode to **WebP quality 80** (this strips metadata and any hidden payload). Store as `<uuid>.webp` in the private `updates` bucket. If the DB insert fails, delete the uploaded object.
- Image alt text is optional (max 120 chars, filtered); default `User-submitted image`.
- Public delivery only through `GET /api/updates/image/[id]`, which serves the object **only if the post status is `approved`** (otherwise 404), with headers `Content-Type: image/webp`, `X-Content-Type-Options: nosniff`, `Cache-Control: public, max-age=3600`, `Content-Security-Policy: default-src 'none'; img-src 'self'`.
- Test: generate a PNG in the test with `sharp`, run it through the processor, and assert WebP output, size limits, and that a text file renamed `.png` is rejected.

### 6.7 API routes (Node runtime)
| Route | Purpose |
|---|---|
| `POST /api/updates` | Submit a post (multipart). Order of checks: feature flag → Origin → size → bot checks → ban check → rate limits and global cap → validation (zod) → content filter → duplicate check → image processing → insert as `pending` → upload image → email the owner. Responses: `{ ok:true }` or `{ ok:false, code, message, retryAfterSeconds? }` with codes `DISABLED, ORIGIN, TOO_LARGE, BOT, BANNED, RATE_LIMIT, PAUSED, INVALID, FILTER, DUPLICATE, IMAGE, SERVER`. |
| `GET /api/updates` | List approved posts: query `kind`, `cursor`, page size 10, newest first. **Whitelist the returned fields**: `id, kind, nickname, title, body, imageUrl, createdAt, likeCount`. Never return `contact_email`, `ip_hash`, `content_hash`, or status. Cache header `s-maxage=30, stale-while-revalidate=60`. |
| `POST /api/updates/[id]/like` | Add a reaction (one per sender per post). |
| `POST /api/updates/[id]/report` | Report a post (reason from a fixed list: `spam`, `offensive`, `personal-info`, `other`). |
| `GET /api/updates/image/[id]` | Approved images only (6.6). |
| `POST /api/moderate` | Moderator action from the moderation page (6.8). |
Validation (zod): `kind` enum; `nickname` 2–24 chars `[A-Za-z0-9 _.-]`; `title` 3–80; `body` 10–1000; `contactEmail` optional valid email; `imageAlt` optional ≤ 120; `rules` must be `true`. Trim everything. Logging: only `console.error` with an error code and post id, **never names, emails, text, or IPs**.

### 6.8 Owner moderation (no admin password needed)
- Every new post triggers **one email to `script.monks.mail@gmail.com`** via Resend: subject `[ScriptMønks] New <kind> post to review`, body with the nickname, title, body (HTML-escaped), contact email if given, and a link to `/moderate/<token>`. Email failure must not fail the submission (the post stays pending and can still be reviewed in the Supabase table editor; document this in `DEPLOY.md`).
- `token = base64url(postId + "." + expiresAtMs) + "." + hex(HMAC_SHA256(MODERATION_SECRET, payload))`, valid for 7 days, verified with `timingSafeEqual`. Tampered or expired tokens show a generic error.
- The page `/moderate/[token]` (`noindex`, `Cache-Control: no-store`) shows the post and its image (via a token-authorized image route) and three buttons: `[ APPROVE ]`, `[ REJECT ]`, `[ REJECT + BAN SENDER ]`. **Actions are `POST` requests, never links**, so email link scanners cannot approve posts by prefetching.
- Tests: token sign/verify, expiry, tampering, wrong secret, and that `GET` never changes state.

### 6.9 Pages, UI, and exact text (Task V4-6)
**Route `/updates`** (add `[ UPDATES ]` to the navbar and footer; add `/updates` to the XP first-visit page list, +5). Header `// 05_UPDATES`, H1 `Updates & Community`.
- Tabs: `[ OFFICIAL ]` and `[ COMMUNITY ]`.
- **Official:** list from `src/data/updates.ts` (`{ id, date, title, body, tag }`, newest first). Seed with one entry only: title `Community Updates is live`, body `Share bugs, ideas, opinions, and photos. Every post is reviewed before it appears.` (date = today's build date).
- **Community:** filter chips `[ ALL ] [ BUGS ] [ OPINIONS ] [ IDEAS ] [ PHOTOS ]`, post list with badge, nickname, relative date, text, optional image (reuse the lightbox), `[ +1 ] <count>` and `[ REPORT ]`. `[ LOAD MORE ]` pagination. Empty state `[ NO POSTS YET ]`. Loading skeletons. Optimistic like with rollback on error.
- **`[ NEW POST ]`** opens a focus-trapped dialog with: type radio-cards (Bug / Opinion / Idea / Photo), nickname, title, body with a live counter, optional image (drag-and-drop or click, preview, remove, alt text) only when images are enabled, optional private email (`For bug follow-up. Never shown publicly.`), the Turnstile widget, a required checkbox `I have read the community rules and will follow them`, and the hidden honeypot. Client-side preflight uses the shared pure validators and the shared filter. Error codes map to friendly messages; `RATE_LIMIT` shows the wait time; `PAUSED` shows `New posts are paused for now. Please try again later.`
- Success state: `[ SUBMITTED ] Thanks! Your post is waiting for review and will appear once approved.`
- **Community rules** (shown on the page and linked from the dialog, exact text):
  - Be kind. No profanity, insults, hate, or harassment.
  - No links, email addresses, phone numbers, or other personal information.
  - No spam or advertising. One post every 10 minutes, up to 3 per day.
  - Images: screenshots, project pictures, or your own work only. No photos of people. One image, 2 MB maximum.
  - Every post is reviewed before it appears. We may reject, hide, or delete any post.
  - Repeated violations lead to a ban.
- Home page: a small "Latest updates" teaser with the newest 3 official updates and a link.
- Terminal: command `updates` prints the latest official update and the link; `follow` as in Section 5.

**Add to Terms (`data/legal.ts`), new section 13 (exact):**
`13. Community posts. You may share opinions, bug reports, ideas, and images in the Updates section. Every post is reviewed before it appears, and we may reject, hide, or delete any post at our discretion. You must not post profanity, harassment, hate, spam, advertising, links, personal information, or photos of people, and you may only post images you have the right to share. You keep ownership of what you post and give ScriptMønks permission to display it on this website. Posting limits apply, and repeated rule-breaking may lead to a ban. To request removal of your post, email script.monks.mail@gmail.com.`
(Move the current section 12 `Contact` to number 14.)

**Edit the Privacy Policy (`data/legal.ts`):**
- In section 5 (Sharing) append: `The post form uses a bot-protection check provided by Cloudflare.`
- Add new section 8 (exact) and move `Contact` to 9: `8. Community posts. If you submit a post in the Updates section, we store your nickname, title, text, optional image, optional private email address, and a one-way hashed (non-reversible) form of your IP address used for spam prevention. Your email address and the hashed IP are never shown publicly. Posts appear publicly only after approval; unapproved posts are not public. Posts are stored with our database and storage provider. To have your post removed, email script.monks.mail@gmail.com. Spam-prevention records are deleted automatically within 48 hours, except bans, which last until they expire.`
Keep the existing sentence that order and contact messages are delivered by email and not stored on the website; it stays true.

### 6.10 Security checklist (must be reported with evidence)
- Service-role key and secrets appear nowhere in `.next/static` (grep for `service_role`, `SUPABASE_SERVICE`, `MODERATION_SECRET`, `IP_HASH_SECRET`).
- All tables have RLS enabled and no policies (confirm in `schema.sql`).
- Public JSON never contains private fields (test asserts the exact key set).
- Output is escaped: a stored post containing `<script>alert(1)</script>` renders as text (test).
- Moderation actions work only via `POST` with a valid token.
- `pnpm audit` result is reported (list findings, do not hide them).
- Confidentiality script from V3 Section 1 still passes.
- Create `docs/MODERATION.md` for the owner: how approval works, how to ban, how to handle a bad image (do not download or forward it; reject and ban; if it ever shows a child in danger or anything illegal, report it to the local authorities or an official hotline), and how to turn images or the whole feature off with the env flags. Recommend that the owner tell a parent or guardian before enabling image uploads.

---

## 7. GAMES (Task V4-7)

V3 Section 6.3 already specifies four games (Snake, Code Typer, Memory Match, Bug Squash) and the `/arcade` page. If they are missing, V4-0 completes them first. Then **add two more** and a few refinements. Each game keeps a pure-logic module with Vitest tests.

| New game | Rules |
|---|---|
| **Code Cracker** (`CRACK.PW`) | A secret 4-digit code (digits 0–9, repeats allowed). 8 attempts. After each guess show `[#]` for each digit that is correct and in place, and `[~]` for each digit that exists elsewhere (standard Mastermind scoring; handle duplicates correctly). **Daily mode:** the secret comes from a deterministic PRNG (`mulberry32`) seeded by a hash of the local date `YYYY-MM-DD`, so everyone gets the same puzzle that day with no server. A `Random` mode is also available. Daily streak stored in progress (`dailyStreak`, `lastDailyDate`); a day can be won only once. Keyboard digits + Enter, and an on-screen keypad on touch. |
| **Merge** (`MERGE.SYS`, a 2048-style game) | 4x4 grid, arrow keys/WASD/swipe, tiles of equal value merge on a move, a new tile (2 with 90% chance, otherwise 4) appears after each valid move, score is the sum of merged tile values, game over when no move is possible. Use a seeded-injectable RNG for tests. Best score stored. |

Refinements:
- Snake gets a mode selector `[ CLASSIC ]` (walls kill) and `[ WRAP ]` (edges wrap).
- Every game: `R` restarts, `P` or `Space` pauses, a first-play help overlay with controls (dismissible, remembered).
- Progress additions: `bests.crack` (fewest attempts), `bests.merge`, `dailyStreak`, `lastDailyDate`.
- New achievements: `cracker-daily` (win a daily puzzle), `merge-512` (reach a 512 tile). Keep V3 XP rules (game XP cap 50 per day).
- Terminal: `play crack`, `play merge`. Command palette entries for both.
- The six-game `/arcade` grid stays responsive; each game still lazy-loads on open, and the home page bundle must not grow because of games.

---

## 8. FINAL QA & HOSTING (Task V4-8)

- Update `DEPLOY.md` with the new setup steps (exact):
  1. **Supabase:** create a free project; in the SQL editor run `supabase/schema.sql`; create a **private** storage bucket named `updates`; copy the project URL and the service-role key. Note that free projects may pause after a period of inactivity; check Supabase's current free-tier terms.
  2. **Secrets:** generate `IP_HASH_SECRET` and `MODERATION_SECRET` with `openssl rand -hex 32`.
  3. **Turnstile:** in the Cloudflare dashboard create a free Turnstile site for your domain; copy the site key and secret key.
  4. Add all variables from `.env.example` to Vercel (Project → Settings → Environment Variables), redeploy.
  5. Post-deploy checklist: submit a test post, receive the moderation email, approve it, see it publicly; submit a second post within 10 minutes and confirm the rate limit; submit text containing a mild profanity and confirm it is rejected without echoing the word; check `view-source` contains no secrets.
- `pnpm build` must still succeed with **no environment variables set**.
- Run every script (`brand:check`, `confidentiality-check`, `check-brand`, `sync-screenshots`) in `verify`.
- Final report: commands with real output, Lighthouse numbers, per-route first-load JS, security checklist results (6.10), the list of every remaining `TODO(OWNER)`, and updated `docs/PROGRESS.md`.

---

## 9. EXECUTION PLAN

| Task | Content | Acceptance (must be shown with evidence) |
|---|---|---|
| **V4-0** | Section 0: read specs, status table, `docs/PROGRESS.md`, finish missing V3 tasks | Status table with evidence; green `lint/typecheck/test/build` output |
| **V4-1** | Section 2: rename and brand check script | `brand:check` passes; blinking cursor intact; `ø` renders everywhere including OG image |
| **V4-2** | Section 3: smooth themes | Default pixel-identical; mid-transition color sample differs from start and end; theme persists with no flash |
| **V4-3** | Section 4: smoothness and polish | Route transitions, skeletons, 404 terminal; reduced motion respected; Lighthouse numbers reported |
| **V4-4** | Section 5: follow section | Appears in all listed places; links open in a new tab; no follower counts |
| **V4-5** | Sections 6.1–6.8: schema, store, filter, image, API, moderation, tests | All Vitest suites pass; no network in tests; security items 6.10 verified |
| **V4-6** | Section 6.9: `/updates` UI, rules, legal text, `docs/MODERATION.md` | End-to-end flow works with a fake store in dev; texts match exactly |
| **V4-7** | Section 7: two new games and refinements | Logic tests pass; keyboard and touch play; bundle report shows games are lazy |
| **V4-8** | Section 8: final QA and docs | Clean build without env vars; `DEPLOY.md` complete; final report delivered |

**Backlog, do NOT implement unless the owner asks:** client order-status tracker by reference ID; Nepali language toggle; installable PWA; site-wide search; changelog RSS feed; opt-in sound effects.

---

## 10. DEFINITION OF DONE
- [ ] Brand reads `ScriptMønks` everywhere visible; identifiers (email, handles, domain) unchanged; blinking cursor kept.
- [ ] Smooth, free accent theme switcher with live preview, persistence, and no flash.
- [ ] Route transitions, skeletons, and polish in place with measured results.
- [ ] Follow section with Instagram and GitHub links in all listed places.
- [ ] `/updates` with official updates and moderated community posts: filter, rate limits, bans, duplicate blocking, bot checks, owner approval via email, no private data exposed.
- [ ] Terms and Privacy updated with the exact new text.
- [ ] Six games working, tested, and lazy-loaded.
- [ ] Orders and contact still email-only; confidentiality and brand checks pass.
- [ ] `DEPLOY.md`, `docs/MODERATION.md`, and `docs/PROGRESS.md` are complete and accurate.
