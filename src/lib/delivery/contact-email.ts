import { Resend } from "resend";
import type { ContactPayload } from "@/types/contact";

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

export function buildContactHtml(payload: ContactPayload, ref: string): string {
  const { kind, name, email, github, message, links } = payload as unknown as ContactPayload & Record<string, unknown>;
  const subjectKind = "General inquiry";
  const replyHref = `mailto:${email}?subject=${encodeURIComponent(`Re: ${ref} ${subjectKind}`)}`;
  const githubHtml = github
    ? `<a href="https://github.com/${escapeHtml(github)}" style="color:#ff7a65;">${escapeHtml(github)}</a>`
    : "—";
  const linksHtml = links.length
    ? links
        .map((entry: unknown) => `<a href="${escapeHtml(String(entry))}" style="color:#ff7a65;">${escapeHtml(String(entry))}</a>`)
        .join("<br />")
    : "—";

  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;">
<tr><td style="background:#ff7a65;padding:16px 20px;"><span style="color:#111827;font-family:monospace;font-size:14px;font-weight:bold;letter-spacing:0.1em;">${escapeHtml(subjectKind.toUpperCase())} · ${escapeHtml(ref)}</span></td></tr>
<tr><td style="padding:0 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row("Kind", escapeHtml(kind))}
${row("Name", escapeHtml(name))}
${row("Email", escapeHtml(email))}
${row("GitHub", githubHtml)}
${row("Links", linksHtml)}
${row("Message", escapeHtml(message).replace(/\n/g, "<br />"))}
</table>
<p style="padding:20px 0 8px;"><a href="${escapeHtml(replyHref)}" style="display:inline-block;background:#ff7a65;color:#111827;text-decoration:none;font-family:monospace;font-size:13px;font-weight:bold;letter-spacing:0.08em;padding:12px 20px;border:1px solid #111827;">REPLY TO ${escapeHtml(name)}</a></p>
</td></tr>
</table></body></html>`;
}

export function buildContactText(payload: ContactPayload, ref: string): string {
  const { kind, name, email, github, message, links } = payload as unknown as ContactPayload & Record<string, unknown>;
  const subjectKind = "General inquiry";
  return [
    `${subjectKind} ${ref}`,
    `Kind: ${kind}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `GitHub: ${github ?? "—"}`,
    `Links: ${links.length ? links.join("\n") : "—"}`,
    "",
    message,
  ].join("\n");
}

function clip(str: string, max: number): string {
  if (str.length <= max) return str;
  return `${str.slice(0, Math.max(0, max - 1))}…`;
}

export function buildContactSubject(subjectKind: string, name: string): string {
  return `[ScriptMønks] ${subjectKind}: ${clip(name, 60)}`;
}

export async function deliverContact(
  payload: ContactPayload,
  ref: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("email: RESEND_API_KEY not set");
  }

  const resend = new Resend(apiKey);
  const subjectKind = "General inquiry";
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Scriptmonks Leads <onboarding@resend.dev>",
    to: [process.env.LEAD_TO_EMAIL ?? "script.monks.mail@gmail.com"],
    replyTo: payload.email,
    subject: buildContactSubject(subjectKind, payload.name),
    html: buildContactHtml(payload, ref),
    text: buildContactText(payload, ref),
  });

  if (error) {
    throw new Error(`email: ${error.message}`);
  }
}
