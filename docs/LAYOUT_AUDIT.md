# LAYOUT AUDIT — ScriptMønks (SPEC_V5 §7.1, §10.1)

Started with Task V5-1 (navbar). Evidence: `scripts/check-header.mjs <baseUrl> <before|after>`,
screenshots in `docs/audit/header-before/` (V5-1) — widths 320, 375, 414, 768, 1024, 1280,
1440, 1920, 2560 + iPhone 14 + Pixel 7 emulation, home route.

Raw result of the first run (before any fix):

```
w320       header 320/320 bar h=72px  overflow=0 overlaps=0 cta=false
w375       header 375/375 bar h=72px  overflow=0 overlaps=0 cta=false
w414       header 414/414 bar h=72px  overflow=0 overlaps=0 cta=false
w768       header 769/768 bar h=118px overflow=2 overlaps=0 cta=false
w1024      header 1024/1024 bar h=98px overflow=0 overlaps=0 cta=true
w1280      header 1280/1280 bar h=98px overflow=0 overlaps=0 cta=true
w1440      header 1440/1440 bar h=98px overflow=0 overlaps=0 cta=true
w1920      header 1920/1920 bar h=98px overflow=0 overlaps=0 cta=true
w2560      header 2560/2560 bar h=98px overflow=0 overlaps=0 cta=true
iphone-14  header 390/390 bar h=72px  overflow=0 overlaps=0 cta=false
pixel-7    header 412/412 bar h=72px  overflow=0 overlaps=0 cta=false
header-check: FAILED — 8 defect(s)
```

## Navbar defects (V5-1)

| ID | Route | Width | Description | Severity | Fix |
|---|---|---|---|---|---|
| H-01 | / | 768 | Desktop nav turns on at `md` but does not fit: `nav` box spans to x=769 (> 768), the bar wraps to 118 px tall, `[ ORDER PROJECT ]` clipped past the viewport. | **major** | Nav only at `lg` (≥1024); at 1024–1279 reduced link set; fixed `h-16` bar. |
| H-02 | / | 320–768, mobile devices | Primary CTA not visible: `/order` button lives only inside the desktop nav; below 1024 only a hamburger exists. Spec §7.3 requires `[ ORDER ]` always visible. | **major** | Right zone shows `[ ORDER ]` at every width; hamburger beside it. |
| H-03 | / | all | Header height inconsistent (72 px mobile, 98 px desktop, 118 px at 768); no `--header-h` CSS variable; `scroll-padding-top: 5rem` hard-coded. | minor | Fixed `h-16` + `--header-h` used by scroll-padding and the sheet. |
| H-04 | / | ≥1024 | Nav composition vs spec §7.3: no `MORE ▾` dropdown (About/FAQ are top-level), palette button hidden below `lg`, actions mixed into the nav zone instead of a separate right zone. (`ARCADE`, `UPDATES`, `INFO` links pending their routes — see ruling in PROGRESS V5-1.) | minor | Three zones; `MORE ▾` (About, FAQ); actions zone with palette/theme/CTA at ≥1024. |
| H-05 | / | ≥1024 | `WORK ▾` dropdown: click-only (no 120 ms hover-intent), opens `left-0` always (no collision awareness), no close-on-route-change (only link clicks close it). | minor | Hover-intent + click, collision-aware (open leftwards near right edge), close on pathname change, `aria-haspopup`/`aria-expanded` kept. |
| H-06 | / | <1024 | Mobile panel is an inline block: no `100dvh - header` sheet, body scroll not locked, no `inert` page content, no focus trap, items < 48 px, no `NAVIGATE/WORK/TOOLS/FOLLOW` groups, `[ ORDER PROJECT ]` not pinned with safe-area. | **major** | Full sheet per §7.5. |
| H-07 | / | all | No `aria-current="page"` active state, no home-section scroll-spy. | minor | Active underline via `usePathname`; IntersectionObserver scroll-spy on home. |
| H-08 | / | all | Padding `px-6` at all widths; spec wants `px-4 sm:px-6`. | minor | Match spec. |
| H-09 | / | 320 | Wordmark has no truncation guard (`scriptmønks_` + mark could clip with larger text). | minor | `min-w-0 truncate` on the wordmark. |

## Rules applied (V5-1 §7.3)
- ≥1280: `SERVICES PROCESS WORK ▾ CONTACT MORE ▾` + palette (with label), theme, `[ ORDER PROJECT ]`.
  `ARCADE`, `UPDATES`, `INFO` omitted until their routes exist (no dead links) — ruling logged in `docs/PROGRESS.md`.
  XP pill omitted until the XP system (D2) exists.
- 1024–1279: `WORK ▾ CONTACT MORE ▾` + icon-only actions, `[ ORDER ]`.
- <1024: logo + `[ ORDER ]` + hamburger; everything else in the sheet.

## After-fix results

`node scripts/check-header.mjs http://localhost:3100 after` (screenshots in `docs/audit/header-after/`):

```
w320 … w2560, iphone-14, pixel-7 — all: header W/W bar h=64px overflow=0 overlaps=0 cta=true
header-check: OK — zero defects at all widths
```

`node scripts/check-nav-behavior.mjs` (dropdown + sheet mechanics, §7.4–§7.6): **16/16 PASS** —
hover-intent open, menus inside viewport, Esc close, `aria-current`, close-on-route-change,
sheet 100dvh−header, body scroll lock, inert content, group labels, all items ≥ 48 px,
pinned CTA with safe-area, focus into sheet, restore on close.

Fixes applied: full `navbar.tsx` rewrite (three zones, `lg`-gated nav, `MORE ▾` dropdown with
collision-aware open, mobile sheet with trap/lock/inert/groups/pinned CTA, `--header-h` +
`.mobile-sheet` in `globals.css`, `ThemeSwitcher` gained a `compact` icon-only prop).
Wordmark truncates at very narrow widths (right zone `shrink-0`) per §7.2.
