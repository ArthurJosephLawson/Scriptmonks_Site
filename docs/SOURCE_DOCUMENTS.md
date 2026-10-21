# SOURCE DOCUMENTS — the owner's `DOCCUMENTS/` folder

The owner's internal and legal documents live **outside the repo** at:

```
/home/arthur/Workspace/ScriptMønks/
├── Description.md          # internal/operational company overview
├── DOCCUMENTS/             # the six source documents indexed below
├── DOCS.zip
├── logo.png
└── Web/                    # this repository
```

These files are the **source of truth** for company facts. They are not
committed to the repo, and their confidential content must never reach the
website — see [`LEGAL.md`](LEGAL.md) and the firewall in
`SPEC_V3.md` §1, enforced by `scripts/confidentiality-check.mjs`.

## Index

All six documents are dated **2026-09-27** and are authored as
"Scriptmonks" (the website displays `ScriptMønks`).

| # | File | Type | Version | Length | Purpose | Used by the website? |
|---|---|---|---|---|---|---|
| 1 | `Client Service Agreement.docx` | Master contract | 1.0 | ~11.8k chars | Master engagement terms: parties, operator status, IP, payment, delivery lock | Context only |
| 2 | `SCOPE OF WORK (SOW).docx` | Per-project addendum | 1.0 | ~6.7k chars | Scope and quote for one engagement; binds to the master contract | Context only |
| 3 | `NON-DISCLOSURE AGREEMENT.docx` | NDA | 1.0 | ~6.9k chars | Unilateral confidentiality; all IP stays with Scriptmonks | Context only |
| 4 | `Invoice [TEMPLATE].docx` | Template | — | ~4.3k chars | Billing summary, itemisation, 50/50 milestones | Context only |
| 5 | `INDEPENDENT PROMOTER REFERRAL AGREEMENT (INESH K SHEETRI).docx` | Agreement | 2.0 | ~18.1k chars | Referral arrangement, commission, anti-fraud, account access | **Withheld** — internal |
| 6 | `TERMS OF SERVICE & PRIVACY POLICY.docx` | Public policy | 1.0 | ~9.6k chars | The website's Terms of Service and Privacy Policy | **Primary source** for `/terms` and `/privacy` |

## How each document relates to the repository

- **#6 Terms of Service & Privacy Policy** — the only document whose text is
  published. `src/data/legal.ts` mirrors it, with confidential specifics
  redacted. See [`LEGAL.md`](LEGAL.md) for the exact redaction record.
- **#1, #2, #3, #4** — read to confirm company facts and payment structure. The
  public facts they support (NPR pricing, the 50/50 split, the delivery lock) are
  already reflected in the Terms page and in `src/data/site.ts`.
- **#5 Independent Promoter Referral Agreement** — **must never be published.**
  It names an individual and states a commission rate, both forbidden by the
  confidentiality firewall. It is listed here for completeness only.

## Public facts extracted from these documents

These are the facts the website is allowed to state, and where they appear:

| Fact | Source doc | Where on the site |
|---|---|---|
| Fees in NPR only | #1, #6 | `/terms`, `/faq`, `/order` |
| 50% upfront (non-refundable), 50% before final delivery | #1, #6 | `/terms`, `/faq` |
| IP transfers only after full payment ("delivery lock") | #1, #2, #6 | `/terms` |
| "As-is" software disclaimer for public tools | #6 | `/terms` |
| Liability cap | #1, #6 | `/terms` |
| Data collection, no data selling, deletion rights | #6 | `/privacy` |
| Six-stage client lifecycle | `Description.md` | `/process`, `src/data/site.ts` |
| 4 client commissions delivered, 2 in-house projects | `Description.md` | home metrics, `/work` |

## Facts the documents confirm are **public**

- Brand: `ScriptMønks` (display), `Script_monks` / `script.monks.mail@gmail.com`
  (identifiers).
- Founder: Arthur Joseph Lawson (alias Monk_Mango).
- Country-level currency: NPR.
- Email and Instagram handle as printed in the documents.

## Facts the documents contain that stay **internal**

Referral and commission terms; the named promoter; payment account details
(eSewa/Khalti/bank/routing); the operator's minority status, age, guardian and
family language; Discord; and the full NDA text. These are the patterns the
confidentiality check blocks.

## Keeping this index accurate

If a document is added, removed, or re-versioned, update the table above and the
relevant section of [`LEGAL.md`](LEGAL.md). Never copy a document's confidential
body text into the repository.
