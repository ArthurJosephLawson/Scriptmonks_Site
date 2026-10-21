# DEPLOY — hosting ScriptMønks

This document covers **every supported host**, in order of how well it fits, and
states plainly which hosts can and cannot run this application.

- [0. What this app needs](#0-what-this-app-needs)
- [1. Vercel (recommended)](#1-vercel-recommended)
- [2. Cloudflare Workers / Pages](#2-cloudflare-workers--pages)
- [3. Any Node host (VPS, Railway, Render, Fly.io)](#3-any-node-host-vps-railway-render-flyio)
- [4. Static hosts, including InfinityFree](#4-static-hosts-including-infinityfree)
- [5. Environment variables](#5-environment-variables)
- [6. Post-deploy checklist](#6-post-deploy-checklist)

---

## 0. What this app needs

| Need | Why | Evidence in the repo |
|---|---|---|
| A **Node.js runtime** | `POST /api/order` and `POST /api/contact` build and send email server-side through Resend. Route Handlers cannot be prerendered. | `src/app/api/order/route.ts`, `src/app/api/contact/route.ts` both declare `export const runtime = "nodejs"` |
| Response **headers** | Security headers are set in `next.config.ts` `headers()`. This is not supported by a static export. | `next.config.ts` |
| Server-side `fetch` with `revalidate` | The Wolf/DeployMonk release tag is read from the GitHub API at build/render time. | `src/lib/github.ts`, `src/app/work/[slug]/page.tsx` |
| Reading env vars at request time | `RESEND_API_KEY` and `GITHUB_TOKEN` are read lazily on the server, never bundled. | `.env.example`, `src/lib/delivery/*` |

**Node version:** Next.js 16.4.2 requires **Node 20.9 or later**. Use Node 20 LTS
or Node 22 LTS. The repo pins the package manager with
`"packageManager": "pnpm@12.14.0"`.

**Build command:** `pnpm install --frozen-lockfile && pnpm build`
**Start command:** `pnpm start` (runs `next start`)

`pnpm build` succeeds **with no environment variables set**. Missing secrets only
disable the features that need them; the public pages still build.

---

## 1. Vercel (recommended)

Vercel runs Next.js natively, including Route Handlers, `headers()`, and ISR.

1. Push the repository to GitHub.
2. In Vercel: **Add New → Project → Import** the repository.
3. Vercel detects Next.js. Accept the defaults:
   - Framework preset: **Next.js**
   - Build command: `pnpm build`
   - Output directory: **leave empty** (Vercel handles `.next` automatically)
   - Install command: `pnpm install`
4. Add the environment variables from [section 5](#5-environment-variables) to
   **Settings → Environment Variables** (Production **and** Preview).
5. Set `NEXT_PUBLIC_SITE_URL` to the production origin, e.g.
   `https://scriptmonks.com`.
6. **Deploy.**
7. Add the custom domain in **Settings → Domains**, then point DNS as instructed.

**Route behaviour after deploy** (matches the local `next build` table):
`/`, `/about`, `/contact`, `/faq`, `/order`, `/privacy`, `/process`, `/terms`,
`/work`, `/sitemap.xml`, `/robots.txt` are static; `/api/order`, `/api/contact`
are dynamic (`ƒ`); `/work/[slug]` is SSG.

**Note:** the in-memory rate limiter is per-instance on serverless. It is a
best-effort layer only; a shared store is the documented upgrade path (see
`SPEC_V5.md` §4).

---

## 2. Cloudflare Workers / Pages

Cloudflare is a good second option.

- **Full app on Workers:** Cloudflare's recommended path is
  [vinext](https://vinext.dev/), a Vite plugin that reimplements the Next.js API
  surface. Run `npx vinext check` first, then follow the
  [Cloudflare Next.js guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/).
- **Static site on Pages:** only possible if you accept the static-export limits
  in [section 4](#4-static-hosts-including-infinityfree). With a static export the
  order and contact forms cannot deliver email server-side.

---

## 3. Any Node host (VPS, Railway, Render, Fly.io)

Any host that can run `node` works.

1. Provision **Node 20+** (or Node 22).
2. Set the environment variables from [section 5](#5-environment-variables).
3. Build and run:

   ```bash
   pnpm install --frozen-lockfile
   pnpm build
   pnpm start          # serves on PORT (default 3000)
   ```

4. Put a reverse proxy (Nginx/Caddy) in front and terminate TLS there.
5. **Never write to disk at runtime.** That rule is already respected in the
   code; Vercel's filesystem is read-only and other hosts should be treated the
   same way.

The process must be kept alive (systemd, pm2, or the host's supervisor) and
restarted on deploy.

---

## 4. Static hosts, including InfinityFree

**InfinityFree is shared PHP hosting. It has no Node.js runtime**, so this
Next.js application **cannot run there as-is.** The order and contact forms need
a server route to call Resend, and `next.config.ts` `headers()` is not supported
by a static export.

Two honest options:

### Option A — host elsewhere (recommended)

Use Vercel, Cloudflare, or a Node host. This keeps the order form and the
security headers working, and is a five-minute setup.

### Option B — static export, with the forms degraded

If you must host static files on InfinityFree or any plain web host:

1. Set `output: "export"` in `next.config.ts`.
   Per the [Next.js static-export docs](https://nextjs.org/docs/app/guides/static-exports),
   the following are **unsupported** and must be removed or replaced:
   - `headers()` in `next.config.ts` (security headers move to the host, if it
     allows them)
   - `POST` Route Handlers — so `/api/order` and `/api/contact` must be dropped
     and the forms switched to the existing **mailto fallback**
   - `rewrites`, `redirects`, ISR

2. Build, then upload the generated `out/` directory:

   ```bash
   pnpm build      # writes ./out
   ```

3. Upload the contents of `out/` to the host's `htdocs/` (InfinityFree) or web
   root.

**Consequences you must accept for Option B:** visitors lose inline form
submission and are sent to their mail client instead; security headers are only
whatever the host offers; and the GitHub release tag is frozen at build time.

**Do not** attempt Option B without first confirming with the owner that losing
server-side form delivery is acceptable.

---

## 5. Environment variables

Copy `.env.example` to `.env.local` for local development. All values below are
server-side unless prefixed `NEXT_PUBLIC_`.

| Var | Required | Notes |
|---|---|---|
| `RESEND_API_KEY` | yes (forms) | Resend dashboard → API Keys. **Server only** — never `NEXT_PUBLIC_`. |
| `RESEND_FROM` | yes (forms) | e.g. `Scriptmonks Leads <leads@scriptmonks.com>`. Must be a verified sender/domain in Resend. |
| `LEAD_TO_EMAIL` | no | defaults to `script.monks.mail@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | yes in prod | canonical origin, used by metadata, sitemap, robots, JSON-LD |
| `NEXT_PUBLIC_SHOW_PLACEHOLDER_PROJECTS` | no | `true` shows placeholder portfolio cards |
| `GITHUB_TOKEN` | no | raises the GitHub API rate limit; falls back to a safe default when absent |

**Secrets never reach the browser.** `RESEND_API_KEY` and `GITHUB_TOKEN` are read
only on the server. `pnpm verify` runs `scripts/brand-check.mjs` and
`scripts/confidentiality-check.mjs`; the build output is checked to confirm no
secret appears in client bundles.

### Resend note

Resend needs a **verified sender** (a domain or a single address) before
`RESEND_FROM` delivers. `onboarding@resend.dev` only sends to the account owner
and is for testing. For production: add the domain in Resend, set the DNS
records, then use something like `leads@scriptmonks.com`. A delivery failure
returns `502` and the UI shows a mailto fallback.

---

## 6. Post-deploy checklist

- [ ] `pnpm build` succeeded with **no** environment variables set.
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm verify` all exit 0.
- [ ] `NEXT_PUBLIC_SITE_URL` matches the live origin.
- [ ] The order form sends a real email to `LEAD_TO_EMAIL`.
- [ ] The contact form sends a real email.
- [ ] Submitting an order twice in a row shows the friendly rate-limit message.
- [ ] `/this-page-does-not-exist` shows the branded 404, not a raw error.
- [ ] `view-source:` on the home page contains **no** secret values.
- [ ] `https://<domain>/robots.txt` and `/sitemap.xml` resolve.
- [ ] The Wolf case study shows a release link whose version came from GitHub.

## Related documents

| File | Contents |
|---|---|
| `README.md` | Local setup and project overview |
| `docs/HOSTING.md` | Host comparison table and the InfinityFree constraint, in short form |
| `docs/LEGAL.md` | The legal-text source documents and the firewall redaction record |
| `docs/SOURCE_DOCUMENTS.md` | Index of the owner's `DOCCUMENTS/` folder |
| `docs/PROGRESS.md` | Per-task history and evidence |
