import { Resend } from "resend";
import {
  BUDGET_LABELS,
  PROJECT_TYPE_LABELS,
  TIMELINE_LABELS,
} from "@/lib/validation";
import type { ProjectOrderPayload } from "@/types/order";

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;vertical-align:top;">${value}</td></tr>`;
}

export function buildOrderHtml(payload: ProjectOrderPayload, ref: string): string {
  const { scope, commercial, brief, contact } = payload;
  const replyHref = `mailto:${contact.email}?subject=${encodeURIComponent(`Re: ${ref} ${brief.title}`)}`;
  const refsHtml = brief.references.length
    ? brief.references
        .map((entry) => `<a href="${escapeHtml(entry)}" style="color:#ff7a65;">${escapeHtml(entry)}</a>`)
        .join("<br />")
    : "—";
  const githubHtml = contact.github
    ? `<a href="https://github.com/${escapeHtml(contact.github)}" style="color:#ff7a65;">${escapeHtml(contact.github)}</a>`
    : "—";

  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;">
<tr><td style="background:#ff7a65;padding:16px 20px;"><span style="color:#111827;font-family:monospace;font-size:14px;font-weight:bold;letter-spacing:0.1em;">NEW ORDER · ${escapeHtml(ref)}</span></td></tr>
<tr><td style="padding:0 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row("Type", escapeHtml(PROJECT_TYPE_LABELS[scope.projectType]))}
${row("Budget", escapeHtml(BUDGET_LABELS[commercial.budget]))}
${row("Timeline", escapeHtml(TIMELINE_LABELS[commercial.timeline]))}
${row("Project", escapeHtml(brief.title))}
${row("Description", escapeHtml(brief.description).replace(/\n/g, "<br />"))}
${row("Name", escapeHtml(contact.name))}
${row("Email", escapeHtml(contact.email))}
${row("GitHub", githubHtml)}
${row("Company", contact.company ? escapeHtml(contact.company) : "—")}
${row("References", refsHtml)}
</table>
<p style="padding:20px 0 8px;"><a href="${escapeHtml(replyHref)}" style="display:inline-block;background:#ff7a65;color:#111827;text-decoration:none;font-family:monospace;font-size:13px;font-weight:bold;letter-spacing:0.08em;padding:12px 20px;border:1px solid #111827;">REPLY TO ${escapeHtml(contact.name)}</a></p>
</td></tr>
</table></body></html>`;
}

export function buildOrderText(payload: ProjectOrderPayload, ref: string): string {
  const { scope, commercial, brief, contact } = payload;
  return [
    `New order ${ref}`,
    `Type: ${PROJECT_TYPE_LABELS[scope.projectType]}`,
    `Budget: ${BUDGET_LABELS[commercial.budget]}`,
    `Timeline: ${TIMELINE_LABELS[commercial.timeline]}`,
    `Project: ${brief.title}`,
    "",
    brief.description,
    "",
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `GitHub: ${contact.github ?? "—"}`,
    `Company: ${contact.company ?? "—"}`,
    `References: ${brief.references.length ? brief.references.join("\n") : "—"}`,
  ].join("\n");
}

export function buildOrderSubject(ref: string, title: string): string {
  return `[ScriptMønks] New order ${ref}: ${clip(title, 60)}`;
}

export async function deliverEmail(
  payload: ProjectOrderPayload,
  ref: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("email: RESEND_API_KEY not set");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Scriptmonks Leads <onboarding@resend.dev>",
    to: [process.env.LEAD_TO_EMAIL ?? "script.monks.mail@gmail.com"],
    replyTo: payload.contact.email,
    subject: buildOrderSubject(ref, payload.brief.title),
    html: buildOrderHtml(payload, ref),
    text: buildOrderText(payload, ref),
  });

  if (error) {
    throw new Error(`email: ${error.message}`);
  }
}

function clip(str: string, max: number): string {
  if (str.length <= max) return str;
  return `${str.slice(0, Math.max(0, max - 1))}…`;
}
