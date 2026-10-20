import { chromium } from "playwright";
const BASE = process.argv[2] ?? "http://localhost:3199";
const browser = await chromium.launch();
const page = await browser.newPage();
const js = new Map();
page.on("response", async (res) => {
  const url = res.url();
  if (!url.includes("/_next/static/") || !url.endsWith(".js")) return;
  try {
    const buf = await res.body();
    js.set(url.split("/_next/static/")[1], buf.length);
  } catch {}
});
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await browser.close();
let total = 0;
for (const [, size] of js) total += size;
console.log("route JS requests:", js.size);
for (const [name, size] of [...js].sort((a,b)=>b[1]-a[1]).slice(0,8)) console.log(`  ${(size/1024).toFixed(1).padStart(7)} kB  ${name}`);
console.log(`TOTAL: ${(total/1024).toFixed(1)} kB (uncompressed, all route JS)`);
