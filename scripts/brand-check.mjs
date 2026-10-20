#!/usr/bin/env node
// Brand-spelling enforcement (SPEC_V4 §2.5).
// Fails (exit 1, listing file:line) on any visible-copy occurrence of the old
// ASCII brand spelling that is not one of the allowlisted identifier forms.
//
// Allowlisted forms (identifiers, not display names):
//   script.monks.mail@gmail.com, Script_monks, scriptmonks.com,
//   alternateName, keywords, RESEND_FROM, package.json name.
//
// "ScriptMønks" never matches the pattern (ø != o), so the correct display
// name is always safe.

import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const SCAN_DIRS = ["src", "public"];
const SCAN_FILES = ["README.md", "DEPLOY.md", ".env.example"];

const PATTERN = /script[\s_.-]?monks/i;

const ALLOW_LINE = [
  /script\.monks\.mail@gmail\.com/i, // owner email address
  /Script_monks/, // social handles + URLs
  /scriptmonks\.com/, // domain
  /alternateName/, // JSON-LD alternate-name lists
  /keywords/, // metadata keyword lists
  /RESEND_FROM/, // Resend sender line (ASCII deliverability)
];

// Binary assets cannot contain display copy; skip them.
const BINARY_EXT = new Set([
  ".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico", ".woff", ".woff2", ".ttf",
]);

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

function scanFile(file) {
  const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
  if (BINARY_EXT.has(ext)) return [];
  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    return [];
  }
  const violations = [];
  content.split("\n").forEach((line, i) => {
    if (!PATTERN.test(line)) return;
    if (ALLOW_LINE.some((re) => re.test(line))) return;
    violations.push(`${relative(ROOT, file)}:${i + 1}: ${line.trim().slice(0, 100)}`);
  });
  return violations;
}

const files = [
  ...SCAN_DIRS.flatMap((d) => [...walk(join(ROOT, d))]),
  ...SCAN_FILES.map((f) => join(ROOT, f)).filter((f) => {
    try {
      readFileSync(f);
      return true;
    } catch {
      return false;
    }
  }),
];

let violations = [];
for (const file of files) {
  violations = violations.concat(scanFile(file));
}

if (violations.length > 0) {
  console.error("brand-check: FAILED — stale brand spelling (use ScriptMønks for display):");
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}

console.log(`brand-check: OK (${files.length} files scanned, 0 violations)`);
