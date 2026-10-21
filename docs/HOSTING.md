# HOSTING — which service can run this site

Short answer: the site is a **Next.js 16 application with two server routes**
(`/api/order`, `/api/contact`) that send email through Resend. It needs a
**Node.js runtime**. Use **Vercel** (or Cloudflare, or any Node host).

Full instructions live in [`DEPLOY.md`](../DEPLOY.md).

## Host comparison

| Host | Runs the full app? | Order & contact forms | Security headers | Setup effort |
|---|---|---|---|---|
| **Vercel** | Yes | Yes | Yes (`next.config.ts`) | Lowest — import the repo |
| **Cloudflare Workers** (vinext) | Yes | Yes | Yes | Medium |
| **Cloudflare Pages** (static export) | Static only | No — mailto fallback | Host's own only | Medium |
| **Node host** (VPS, Railway, Render, Fly.io) | Yes | Yes | Yes | Medium — you run the process |
| **InfinityFree** | **No — no Node runtime** | **No** | No | — |

## Why InfinityFree cannot host this app

InfinityFree is **shared PHP hosting**. It serves PHP and static files. It does
not provide a Node.js runtime, so `next start` cannot run there, and the two API
routes that deliver orders and contact messages by email cannot execute.

A **static export** (`output: "export"`) is technically uploadable to
InfinityFree, but it changes the product:

- `POST /api/order` and `POST /api/contact` do not exist in a static export
  ([Next.js static-export docs](https://nextjs.org/docs/app/guides/static-exports)).
  The forms must fall back to `mailto:` links, so submissions depend on the
  visitor's own mail client.
- `headers()` in `next.config.ts` is not supported, so the security headers
  (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) are lost
  unless the host lets you set them.
- The GitHub release tag is frozen at build time instead of read live.

**Recommendation:** host on Vercel and point `scriptmonks.com` at it. Keep
InfinityFree only for a static brochure copy if that is genuinely wanted.

## If a static export is ever required

Do it on a branch, not on `main`:

1. Add `output: "export"` to `next.config.ts`.
2. Remove `headers()` from `next.config.ts`.
3. Move the order and contact forms to their existing **mailto fallback**, and
   delete the now-unused `src/app/api/*` routes.
4. `pnpm build` → upload the contents of `out/` to the web root.

Confirm with the owner first: losing server-side form delivery is a product
decision, not a technical one.
