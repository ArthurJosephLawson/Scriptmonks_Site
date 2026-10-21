# LEGAL — website legal text and its source

This file records **where the legal text on the website comes from**, what was
published, and what was deliberately withheld. It is a record, not legal advice.

## Source documents

The canonical legal text lives in the owner's folder
`/home/arthur/Workspace/ScriptMønks/DOCCUMENTS/` (see
[`SOURCE_DOCUMENTS.md`](SOURCE_DOCUMENTS.md)). The website's Terms and Privacy
pages are derived from:

- `TERMS OF SERVICE & PRIVACY POLICY.docx` — effective 2026-09-27, v1.0.
  This is the **primary source** for `/terms` and `/privacy`.

The other documents (Client Service Agreement, Scope of Work, NDA, Invoice
template, Independent Promoter Referral Agreement) were read for context only.
None of their internal detail is published.

## What is published

`src/data/legal.ts` holds every published clause as data. No legal text is
written in JSX. `src/components/legal/legal-page.tsx` renders it for both
`/terms` and `/privacy`.

Kept, essentially verbatim from the source (brand name substituted):

- Acceptance of terms.
- Intellectual property and usage rights, including payment-contingent ownership.
- The "as-is" / "as-available" software disclaimer.
- Pricing in NPR, the non-refundable 50% deposit, the 50% final payment, and the
  delivery lock.
- Late-payment terms.
- The limitation of liability and the liability cap.
- The Privacy Policy: information collected, how it is used, no data selling,
  third-party infrastructure, data security, and user deletion rights.

## What was withheld, and why

The owner-mandated **confidentiality firewall** (`SPEC_V3.md` §1, enforced by
`scripts/confidentiality-check.mjs`) forbids publishing internal specifics on the
website. The source legal text contains several such specifics, so the published
edition **redacts** them. Each redaction is replaced by an explicit
`TODO(OWNER)` marker in `src/data/legal.ts` — nothing is deleted silently and
nothing is invented.

| Source content | Why withheld | Published as |
|---|---|---|
| Named referral promoter and the referral commission rate | Firewall: no named individuals, no commission terms | Section 4.4 "Third-party arrangements" — `TODO(OWNER)` |
| Payment account details (eSewa / Khalti / bank / routing) | Firewall: no payment account details of any kind | Section 4.2 "Payment methods" — `TODO(OWNER)` |
| Operator age, guardian and family language | Firewall: no age, guardian, or family language | Section 1.1 generalised to "a single independent developer resident in Nepal" |
| Discord as a community hub | Firewall: Discord was removed | Omitted |
| Client names and identities | Firewall: client identities are confidential | Not applicable to these two pages |

The firewall patterns that force these redactions are in
`scripts/confidentiality-check.mjs`. `pnpm verify` and `pnpm build` fail if any
forbidden term reaches `src/`, `public/`, `README.md`, or `DEPLOY.md`.

## Source-copy corrections applied

- The source's `Section 12 (Community posts)` addition from `SPEC_V4.md` §6.9 is
  **not** published, because the Updates feature does not exist yet. Publishing a
  clause the site cannot honour would be dishonest. It is marked `TODO(OWNER)`.
- `Section 1.1`, `4.2`, `4.3`, and `5.1` were renumbered after the redactions so
  the section numbers stay sequential on the page.

## TODOs for the owner

1. Approve or replace the wording of sections 4.2 and 4.4.
2. Confirm the legal entity line in section 1.1 is acceptable as published.
3. Decide whether to publish a fuller liability cap (the source caps liability at
   NPR 5,000 and mentions the operator's status; the published edition caps at
   the amount actually paid, without the minor-operator language).
4. Publish section 6 when the Updates feature ships.
