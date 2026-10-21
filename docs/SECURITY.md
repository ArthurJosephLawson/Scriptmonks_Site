# SECURITY — measures in place

Honest status: this site does not claim to be "100% secure". This file records
what is implemented **today**, what is planned, and how to respond to a leak.
Nothing here contains a secret.

## Implemented

| Area | Measure | Where |
|---|---|---|
| Secrets isolation | `RESEND_API_KEY` and `GITHUB_TOKEN` are read only in server code; never prefixed `NEXT_PUBLIC_` | `src/lib/delivery/*`, `src/lib/github.ts` |
| Secret scanning | `scripts/confidentiality-check.mjs` runs in `verify` and `prebuild` and fails the build on any firewall term | `scripts/confidentiality-check.mjs` |
| Brand integrity | `scripts/brand-check.mjs` fails on the stale ASCII brand spelling in display copy | `scripts/brand-check.mjs` |
| Input validation | Every API body is parsed with a `zod` schema; unknown keys are rejected | `src/lib/validation.ts` |
| Rate limiting | In-memory limiter: 5 requests / 10 min per IP on both API routes | `src/lib/rate-limit.ts` |
| Spam traps | Honeypot field plus a 3-second minimum fill-time trap; both return a fake success and deliver nothing | `src/app/api/order/route.ts`, `src/app/api/contact/route.ts` |
| Body size cap | Requests over 20,000 bytes are rejected before parsing | `src/app/api/*/route.ts` |
| Error handling | A central error module maps every failure to a safe, human-readable message; raw errors and stack traces never reach the visitor | `src/lib/errors.ts`, `src/components/error/*` |
| Response headers | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` | `next.config.ts` |
| XSS | React escapes by default; `dangerouslySetInnerHTML` is banned outside a single JSON-LD component | `src/` |
| Env hygiene | `.gitignore` excludes `.env*` except `.env.example` | `.gitignore` |

## Not yet implemented (tracked in `SPEC_V5.md`)

- **Content-Security-Policy** — no CSP header yet. `SPEC_V5.md` §3.4 describes
  the nonce-based (Option A) and static-friendly (Option B) policies.
- **HSTS, Permissions-Policy, Cross-Origin-Opener-Policy** — not set yet.
- **Persistent rate limiting** — the current limiter is in-memory and
  per-instance, so it does not hold across serverless invocations across
  instances. `SPEC_V5.md` §4 specifies a Supabase-backed limiter.
- **`scripts/secret-scan.mjs`** and `scripts/security-lint.mjs` — planned, not
  present.
- **CI workflow and Dependabot** — `.github/` does not exist yet.
- **`/.well-known/security.txt`** — not generated yet.

Treat the "Not yet implemented" list as the backlog. Do not claim these
protections until the code exists and the tests pass.

## Reporting a vulnerability

Email **script.monks.mail@gmail.com** with the affected URL, a description, and
steps to reproduce. Do not include another person's personal data.

## Key rotation

If a key is exposed:

1. **Resend** — delete the key in the Resend dashboard, create a new one, and
   update `RESEND_API_KEY` in the host's environment variables. Redeploy.
2. **GitHub token** — revoke the token in GitHub → Settings → Developer settings
   → Personal access tokens, create a replacement, update `GITHUB_TOKEN`, and
   redeploy.
3. Confirm the old value appears nowhere: `git grep <old-value>` and check
   `view-source:` on the live site.
4. If a key was committed, rotate first, then remove it from history. **Do not**
   rewrite history without the owner's explicit approval.
