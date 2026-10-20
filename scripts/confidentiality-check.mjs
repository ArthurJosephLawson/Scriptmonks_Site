import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

const PATTERNS = [
  /\b(inesh|kshettri|ksheetri|sheetri|noah|huber)\b/i,
  /promoter|referral|commission|middleman/i,
  /esewa|khalti|account\s*number|routing|swift|neft/i,
  /\bnda\b/i,
  /guardian|sole minor|minor developer|under the age|age of majority/i,
  /discord/i,
  /profit[- ]?shar|revenue[- ]?shar/i,
  /\b9[78]\d{8}\b/,
];

const SKIP = ["node_modules", ".git", ".next", "dist", ".baseline", "screenshots"];
const SCAN = ["src", "public", "README.md", "DEPLOY.md", ".env.example"];

function walk(p, out) {
  try {
    const st = statSync(p);
    if (st.isFile()) {
      out.push(p);
      return;
    }
    if (st.isDirectory()) {
      const base = p.split("/").pop();
      if (SKIP.includes(base)) return;
      for (const f of readdirSync(p)) walk(join(p, f), out);
    }
  } catch {}
}

const files = [];
for (const s of SCAN) walk(join(ROOT, s), files);

const hits = [];
for (const f of files) {
  if (f.endsWith("SPEC_V3.md") || f.endsWith("SPEC.md") || f.endsWith("SPEC_V2.md")) continue;
  try {
    const buf = readFileSync(f);
    const text = buf.toString();
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      for (const pat of PATTERNS) {
        if (pat.test(l)) {
          if (pat.source.includes("profit") && /minor revisions/i.test(l)) continue;
          hits.push({ file: relative(ROOT, f), line: i + 1, text: l.trim().slice(0, 200) });
          break;
        }
      }
    }
  } catch {}
}

if (hits.length) {
  console.log("CONFIDENTIALITY VIOLATIONS:");
  for (const h of hits) console.log(`${h.file}:${h.line}: ${h.text}`);
  process.exit(1);
}
console.log("confidentiality-check: OK");
process.exit(0);
