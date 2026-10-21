# CACHING — strategy per route

Verified against the real `next build` route table and `src/lib/github.ts`.
Keep this file in sync with the code; if a route's rendering mode changes, update
the table.

## Route table (from `pnpm build`)

| Route | Mode | Symbol | Strategy |
|---|---|---|---|
| `/` | Static | `○` | Prerendered at build time |
| `/about` | Static | `○` | Prerendered |
| `/contact` | Static | `○` | Prerendered; the form posts to `/api/contact` |
| `/faq` | Static | `○` | Prerendered |
| `/order` | Static | `○` | Prerendered; the wizard posts to `/api/order` |
| `/privacy` | Static | `○` | Prerendered; text from `src/data/legal.ts` |
| `/terms` | Static | `○` | Prerendered; text from `src/data/legal.ts` |
| `/process` | Static | `○` | Prerendered |
| `/work` | Static | `○` | Prerendered |
| `/work/[slug]` | SSG | `●` | `generateStaticParams`, `dynamicParams = false` |
| `/api/order` | Dynamic | `ƒ` | `no-store` (state-changing, never cached) |
| `/api/contact` | Dynamic | `ƒ` | `no-store` (state-changing, never cached) |
| `/sitemap.xml` | Static | `○` | Generated at build time |
| `/robots.txt` | Static | `○` | Generated at build time |
| `/error/403`, `/error/429`, `/error/503` | Static | `○` | Prerendered, `noindex` |
| `/dev/force-error` | Dynamic | `ƒ` | Dev only; returns 404 in production |

## Data fetching

| Source | Strategy | Where |
|---|---|---|
| GitHub API — repo stats and latest release tag | `fetch(..., { next: { revalidate: 3600 } })`, falls back to the version-free releases page on any error | `src/lib/github.ts` |
| Portfolio, services, FAQ, process, legal, site config | Plain module data, baked into the static build | `src/data/*.ts` |
| LONEWOLF screenshots | Generated file committed at build time | `src/data/screenshots.generated.ts` |

The GitHub lookup never blocks rendering: `getRepoStats()` returns `null` on any
failure, and the work detail page falls back to `links.releases`.

## Response headers

`next.config.ts` sets these on `/:path*`:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`

**Not yet set** (tracked in `SPEC_V5.md` §3.4): `Strict-Transport-Security`,
`Permissions-Policy`, `Cross-Origin-Opener-Policy`, and a
`Content-Security-Policy`. See [`SECURITY.md`](SECURITY.md).

`headers()` is only supported on a host that runs the Next.js server. A static
export drops it — another reason the site belongs on Vercel or a Node host
(see [`HOSTING.md`](HOSTING.md)).

## Client-side storage

The order wizard keeps its draft in `sessionStorage` and clears it after a
successful submit. The theme is stored locally and applied by a pre-paint script
(`src/components/layout/theme-init-script.tsx`), which is why `<html>` carries
`suppressHydrationWarning`.

**No service worker.** There is no offline caching of pages or API responses.
