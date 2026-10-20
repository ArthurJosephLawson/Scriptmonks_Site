// Runs Lighthouse twice: cold (fresh profile) and warm (splash already seen).
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3203";
const profile = mkdtempSync(join(tmpdir(), "lh-profile-"));
const chromePath = chromium.executablePath();

// Seed the profile with sessionStorage so the splash is skipped.
const ctx = await chromium.launchPersistentContext(profile, { headless: true });
const p = await ctx.newPage();
await p.goto(BASE, { waitUntil: "load" });
await p.waitForTimeout(1500);
await ctx.close();

const out = join(profile, "lh.json");
execFileSync(
  "npx",
  ["--yes", "lighthouse", BASE, "--quiet", "--chrome-flags=--headless=new --no-sandbox --user-data-dir=" + profile,
   "--output=json", "--output-path=" + out, "--only-categories=performance,accessibility,best-practices,seo"],
  { stdio: "ignore", env: { ...process.env, CHROME_PATH: chromePath } },
);

const d = JSON.parse(readFileSync(out, "utf8"));
const c = d.categories, a = d.audits;
console.log("=== WARM (splash skipped) ===");
for (const k of ["performance", "accessibility", "best-practices", "seo"])
  console.log(`  ${k.padEnd(15)} ${Math.round((c[k].score || 0) * 100)}`);
for (const k of ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"])
  console.log(`  ${k.padEnd(26)} ${a[k].displayValue}`);
rmSync(profile, { recursive: true, force: true });
