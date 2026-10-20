// Theme transition proof (SPEC_V4 §3.2): switching theme must interpolate the
// accent, so a sample taken mid-transition differs from both endpoints.
// Run against a dev server: node scripts/check-theme-transition.mjs [baseUrl]
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3199";

function rgb(str) {
  const match = str.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  return match[1].split(",").slice(0, 3).map((n) => Number(n.trim()));
}

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500); // boot splash clears the viewport first

const selector = '[class*="text-accent-coral"]';
await page.waitForSelector(selector);

const start = rgb(await page.$eval(selector, (el) => getComputedStyle(el).color));

await page.evaluate(() => {
  document.documentElement.dataset.theme = "cyan";
});

await new Promise((resolve) => setTimeout(resolve, 250));
const mid = rgb(await page.$eval(selector, (el) => getComputedStyle(el).color));

// Remove the manual override so the final state is the settled cyan again.
await page.evaluate(() => {
  document.documentElement.dataset.theme = "coral";
});
await new Promise((resolve) => setTimeout(resolve, 100));
await page.evaluate(() => {
  document.documentElement.dataset.theme = "cyan";
});

await new Promise((resolve) => setTimeout(resolve, 900));
const end = rgb(await page.$eval(selector, (el) => getComputedStyle(el).color));

await browser.close();

const eq = (a, b) => a && b && a.every((v, i) => Math.abs(v - b[i]) <= 1);

console.log(`start (coral) = rgb(${start?.join(", ")})`);
console.log(`mid   (~150ms) = rgb(${mid?.join(", ")})`);
console.log(`end   (cyan)  = rgb(${end?.join(", ")})`);

const differsFromStart = !eq(mid, start);
const differsFromEnd = !eq(mid, end);

if (differsFromStart && differsFromEnd) {
  console.log("theme-transition: OK — mid-transition sample differs from both endpoints");
  process.exit(0);
}
console.error(
  `theme-transition: FAILED — varies from start: ${differsFromStart}, from end: ${differsFromEnd}`,
);
process.exit(1);
