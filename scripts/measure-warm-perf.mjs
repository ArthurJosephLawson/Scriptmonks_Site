// Warm-visit perf proof: the boot splash is shown once per session (SPEC_V3
// §106), so a repeat visit measures the real site. Run against `pnpm start`.
import { chromium } from "playwright";
const BASE = process.argv[2] ?? "http://localhost:3203";
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
// First visit: seeds sessionStorage sm_boot_v1.
await page.goto(BASE, { waitUntil: "load" });
await page.waitForTimeout(2000);
// Second visit in the same session: splash is skipped.
await page.goto("about:blank");
const t0 = Date.now();
await page.goto(BASE, { waitUntil: "load" });
const loadMs = Date.now() - t0;
const splashVisible = await page.locator("text=booting scriptmønks").count();
console.log(`warm navigation load: ${loadMs} ms`);
console.log(`splash rendered on warm visit: ${splashVisible > 0 ? "YES (bug)" : "no"}`);
await browser.close();
