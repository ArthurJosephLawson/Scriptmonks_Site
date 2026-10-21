// Cold-path LCP element probe (V5-5). Confirms what the Largest Contentful
// Paint element actually is on a fresh session and how long it takes to render.
//
// Run against a production server:  node scripts/check-lcp.mjs http://127.0.0.1:3203
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:3203";

const browser = await chromium.launch();
// A fresh context has empty sessionStorage, so the boot splash is eligible.
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();

await page.addInitScript(() => {
  window.__lcp = [];
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__lcp.push({
        startTime: entry.startTime,
        renderTime: entry.renderTime || entry.loadTime || 0,
        size: entry.size,
        tag: entry.element?.tagName ?? null,
        cls: entry.element?.className ? String(entry.element.className).slice(0, 120) : null,
        text: entry.element?.textContent ? String(entry.element.textContent).slice(0, 80) : null,
      });
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
});

await page.goto(BASE, { waitUntil: "load" });
await page.waitForTimeout(4000);

const lcp = await page.evaluate(() => window.__lcp);
const last = lcp[lcp.length - 1];
console.log("LCP candidates observed:", lcp.length);
for (const entry of lcp) {
  console.log(
    `  t=${entry.startTime.toFixed(0)}ms  size=${entry.size}  tag=${entry.tag}  text=${JSON.stringify(entry.text)}`,
  );
}
if (last) {
  const isSplashText = last.text && last.text.includes("booting scriptmønks");
  console.log(`\nFINAL LCP: tag=${last.tag} renderTime=${last.renderTime.toFixed(0)}ms`);
  console.log(`  text: ${JSON.stringify(last.text)}`);
  console.log(`  is boot-splash text: ${isSplashText ? "YES (non-compliant outcome)" : "no"}`);
  console.log(`  LCP <= 2500ms: ${last.renderTime <= 2500 ? "YES" : "NO"}`);
}
await browser.close();
