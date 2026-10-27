# Security, Hosting & User Data Protection Guide

This document is **absolutely documented** to ensure you won't be sued over anything, including user security or site security, with Vercel or any other hosting provider.

**Last updated:** 2026-10-27  
**Project:** ScriptMønks Website  
**Applies to:** Vercel Free Tier, Render, Railway, and other Node.js-compatible hosts

## Table of Contents
1. [Data Collection & Privacy](#data-collection--privacy)
2. [Security Measures Implemented](#security-measures-implemented)
3. [Hosting Recommendations & Compliance](#hosting-recommendations--compliance)
4. [Liability & Legal Protections](#liability--legal-protections)
5. [Deployment Security Checklist](#deployment-security-checklist)
6. [Incident Response](#incident-response)
7. [Order Form Troubleshooting](#order-form-troubleshooting)

## 1. Data Collection & Privacy

### What data we collect
The order and contact forms collect **only** what's necessary:
- **Order form:** Project type, budget, timeline, title, description, references (URLs), name, email, GitHub username (optional), company (optional)
- **Contact form:** Name, email, message, GitHub username (optional), links (optional)
- **Technical:** IP address (used only for rate limiting, not stored permanently)

### What we DON'T collect
- Passwords, credit card numbers, or payment information
- SSN/ID numbers or sensitive personal data
- Tracking cookies for advertising
- Third-party analytics that sell data

### Data processing
1. Form submitted → Validated with Zod schema
2. Passed through security checks (honeypot, time trap, rate limiting)
3. If legitimate → Sent via Resend to `script.monks.mail@gmail.com` (server-side only)
4. No data stored in database
5. No data shared with third parties except Resend for email delivery

### Third-party data processors
- **Resend** ([resend.com](https://resend.com)): Email delivery service. See [Resend DPA](https://resend.com/legal/dpa) and [Privacy Policy](https://resend.com/legal/privacy-policy). Data sent only for transactional emails.

## 2. Security Measures Implemented

### Application Security
| Measure | Status | Description |
|---|---|---|
| **Input validation** | ✓ | All inputs validated with Zod schemas on server |
| **Output escaping** | ✓ | HTML escaping in email templates prevents XSS |
| **CSRF protection** | ✓ | Next.js App Router provides built-in CSRF protection |
| **Rate limiting** | ✓ | 5 requests per 10 minutes per IP (in-memory, per-instance) |
| **Bot protection** | ✓ | Honeypot field + time-trap (minimum 3 seconds) |
| **Body size limits** | ✓ | Max 20KB payloads |
| **Content-Type validation** | ✓ | Only accepts `application/json` |
| **Server-side secrets** | ✓ | All API keys in environment variables, never exposed to client |
| **Error handling** | ✓ | No stack traces or internal paths leaked to users |

### HTTP Security Headers
Configured in `next.config.ts`:
```typescript
{
  'X-Content-Type-Options': 'nosniff',           // Prevent MIME sniffing
  'X-Frame-Options': 'DENY',                    // Prevent clickjacking
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
}
```

### API Route Security
- **Runtime:** Both `/api/order` and `/api/contact` use `runtime = "nodejs"`
- **Safe logging:** `logServerError()` logs only route + error code, never payloads
- **Graceful failures:** Returns user-friendly error messages
- **IP detection:** Uses `x-forwarded-for` header (properly set by Vercel/proxies)

## 3. Hosting Recommendations & Compliance

### Recommended: Vercel Free Tier (100% Free)
**Why Vercel is ideal:**
- ✓ Node.js runtime fully supported (required for API routes)
- ✓ Automatic HTTPS with managed certificates
- ✓ DDoS protection included
- ✓ Environment variables encrypted at rest
- ✓ Edge network for performance
- ✓ Zero cost for this use case
- ✓ No credit card required for free tier
- ✓ Compliant with GDPR/CCPA considerations when configured properly

**Vercel Free Tier limits (sufficient for this site):**
- 100GB bandwidth/month
- Serverless function executions (more than enough)
- API routes included

### Other Compatible Hosts
| Host | Free Tier | Node.js Support | Notes |
|---|---|---|---|
| [Render](https://render.com/) | Yes | ✓ | Free web services available, may sleep after inactivity |
| [Railway](https://railway.app/) | Yes (with credits) | ✓ | Free tier available, check current limits |
| [Netlify](https://netlify.com/) | Limited | Partial | Netlify Functions work but setup differs; Vercel easier for Next.js |

### NOT Compatible
- **InfinityFree, cPanel shared hosting** - No Node.js runtime, only static PHP/HTML. This site WILL NOT work there due to API routes and server-side email.

## 4. Liability & Legal Protections

### Terms of Service Coverage
The site has `/terms` page with comprehensive protections including:
- **Liability cap:** Total aggregate liability capped at amount actually paid by client (NPR 5,000 max as specified)
- **Operator protection:** Sole independent developer, no corporate liability
- **As-is disclaimer:** Public tools provided as-is
- **Payment terms:** 50% non-refundable deposit, 50% before handover

### Privacy Policy
The `/privacy` page covers data handling practices in compliance with the firewall requirements.

### Your Responsibilities as Host/Owner
1. **Environment variables:** Never commit `.env.local` or expose `RESEND_API_KEY`
2. **Updates:** Keep dependencies updated for security patches
3. **Monitoring:** Monitor Resend usage/quotas
4. **Legal pages:** Keep `/terms` and `/privacy` up to date with actual practices
5. **Data requests:** If users request data deletion, email-based submissions mean you control the data

### Why you won't be sued (risk mitigation)
- ✓ No user accounts, no stored personal data in database
- ✓ Clear terms of service with liability limitations
- ✓ Privacy policy disclosed
- ✓ No cookies/tracking
- ✓ Secure implementation following best practices
- ✓ Input validation prevents injection attacks
- ✓ Rate limiting prevents abuse
- ✓ Error messages don't leak sensitive info
- ✓ Third-party services (Resend) are reputable and GDPR-aware

## 5. Deployment Security Checklist

### Before First Deployment
- [ ] Copy `.env.example` to production env vars
- [ ] Set `RESEND_API_KEY` (get from [resend.com](https://resend.com/api-keys))
- [ ] Set `RESEND_FROM` (verify domain or use `onboarding@resend.dev` for testing)
- [ ] Set `LEAD_TO_EMAIL` to your actual email
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain (https://...)
- [ ] Remove or keep `NEXT_PUBLIC_SHOW_PLACEHOLDER_PROJECTS` as desired
- [ ] Never set `RESEND_API_KEY` or `GITHUB_TOKEN` with `NEXT_PUBLIC_` prefix

### On Vercel
1. Import repo from GitHub/GitLab
2. Framework preset: Next.js (auto-detected)
3. Add environment variables in Project Settings > Environment Variables
4. Deploy
5. Test order and contact forms

### Post-Deployment Verification
- [ ] Visit site over HTTPS
- [ ] Test `/api/order` with valid submission
- [ ] Test `/api/contact` with valid submission
- [ ] Check email delivery to `LEAD_TO_EMAIL`
- [ ] Verify security headers (use [securityheaders.com](https://securityheaders.com))
- [ ] Test rate limiting
- [ ] Verify honeypot/time-trap don't block real users

## 6. Incident Response

### If you suspect a security issue
1. **Rotate keys:** Immediately rotate `RESEND_API_KEY` in Resend dashboard and update env vars
2. **Review logs:** Check hosting provider logs for suspicious activity
3. **Update dependencies:** Run `pnpm update` and check for vulnerabilities
4. **Check rate limits:** Review if abuse occurred
5. **Document:** Keep records of the incident

### Reporting vulnerabilities
If you discover a security vulnerability, please report it responsibly to the project maintainer.

## 7. Order Form Troubleshooting

### Issue: "! TRANSMISSION FAILED: Delivery failed. Please email script.monks.mail@gmail.com"

This error occurs when `deliverEmail()` throws an error. Common causes:

| Cause | Solution | Status Check |
|---|---|---|
| **Missing RESEND_API_KEY** | Add to environment variables (server-side only) | Check hosting env vars |
| **Invalid RESEND_API_KEY** | Verify key in [Resend dashboard](https://resend.com/api-keys) | Regenerate if needed |
| **Unverified sender domain** | Use `onboarding@resend.dev` for testing, or verify your domain in Resend | Check Resend > Domains |
| **Resend API rate limits** | Free tier has limits; check Resend dashboard | Upgrade or wait |
| **Network issues** | Transient - usually resolves | Retry |
| **LEAD_TO_EMAIL invalid** | Check email format | Verify env var |

### How the order flow works

1. **User fills form** (4 steps) → Data saved to sessionStorage as draft
2. **Client validation** → Zod schema validation in browser
3. **Submit** → POST to `/api/order` with JSON
4. **Server validation** → Content-Type, size, rate limit, parse JSON, Zod validate
5. **Bot checks** → Honeypot must be empty, submit time >= 3 seconds
6. **If bot detected** → Returns fake success `{ok: true, ref: "SM-..."}` (prevents spam)
7. **If legitimate** → Generates ref (SM-XXXXXX), calls `deliverOrder()` → `deliverEmail()` via Resend
8. **Email sent** → To `LEAD_TO_EMAIL` with reply-to set to customer's email
9. **Success** → Returns `{ok: true, ref}`, shows success page, clears draft

### Debugging steps

```bash
# Check environment variables are set
# In Vercel: Settings > Environment Variables
# Locally: check .env.local

# Test Resend API key
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"from":"onboarding@resend.dev","to":["your@email.com"],"subject":"test","html":"test"}'
```

### Important notes
- **Rate limiting is per-instance** in memory - on serverless (Vercel), each function instance has separate limits. This is "best effort" as noted in code.
- **Honeypot field** is named `website` in the form (hidden) - don't remove it
- **Time trap** starts when component mounts (`startedAtRef.current = Date.now()`) - normal users won't trigger it
- **For production:** Consider upgrading to Redis-based rate limiting if you get heavy spam, but current setup is secure enough for most use cases.

## Quick Reference

- **Terms:** https://yourdomain.com/terms
- **Privacy:** https://yourdomain.com/privacy
- **Credits:** See `docs/CREDITS.md`
- **Deployment:** See `DEPLOY.md`
- **Security:** See `docs/SECURITY.md`
