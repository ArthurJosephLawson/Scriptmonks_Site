// Navbar behavior check (SPEC_V5 §7.4–§7.6): dropdown hover-intent/keyboard,
// collision awareness, route-change close, mobile sheet mechanics.
// Run: node scripts/check-nav-behavior.mjs [baseUrl]
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3100";

const browser = await chromium.launch();
const results = [];
const ok = (name, pass, detail = "") =>
  results.push(`${pass ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);

// Desktop: dropdown hover-intent + keyboard + Esc + route change
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => sessionStorage.setItem("sm_boot_v1", "seen"));
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForSelector("header a[href='/']");
  const workBtn = page.locator("header button[aria-controls='work-menu']");
  await workBtn.hover();
  await page.waitForTimeout(250);
  ok("WORK dropdown hover-intent opens", (await workBtn.getAttribute("aria-expanded")) === "true");
  const menuBox = await page.locator("#work-menu").boundingBox();
  ok(
    "WORK menu inside viewport",
    !!menuBox && menuBox.x >= 0 && menuBox.x + menuBox.width <= 1440,
    JSON.stringify(menuBox),
  );
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  ok("Esc closes dropdown", (await workBtn.getAttribute("aria-expanded")) === "false");

  const moreBtn = page.locator("header button[aria-controls='more-menu']");
  await moreBtn.click();
  await page.waitForTimeout(150);
  const moreBox = await page.locator("#more-menu").boundingBox();
  ok(
    "MORE menu inside viewport",
    !!moreBox && moreBox.x >= 0 && moreBox.x + moreBox.width <= 1440,
    JSON.stringify(moreBox),
  );

  await page.goto(`${BASE}/contact`, { waitUntil: "load" });
  await page.waitForSelector("header a[href='/contact']");
  const current = await page.locator("header a[href='/contact']").first().getAttribute("aria-current");
  ok("aria-current on active link", current === "page", String(current));

  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForSelector("header button[aria-controls='work-menu']");
  await page.locator("header button[aria-controls='work-menu']").click();
  await page.waitForTimeout(100);
  await page.locator("#work-menu a[href='/work']").click();
  await page.waitForURL("**/work");
  await page.waitForTimeout(300);
  ok("dropdown closed on route change", (await page.locator("#work-menu").count()) === 0);
  await page.close();
}

// Mobile: sheet mechanics (SPEC_V5 §7.5)
{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  await page.addInitScript(() => sessionStorage.setItem("sm_boot_v1", "seen"));
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForSelector("header button[aria-controls='mobile-nav']");
  await page.locator("header button[aria-controls='mobile-nav']").click();
  await page.waitForTimeout(250);
  const sheet = page.locator("#mobile-nav");
  ok("sheet opens", await sheet.isVisible());
  const box = await sheet.boundingBox();
  ok("sheet height = 100dvh - header", !!box && Math.abs(box.height - (844 - 64)) < 2, JSON.stringify(box));
  const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
  ok("body scroll locked", bodyOverflow === "hidden", bodyOverflow);
  const inert = await page.evaluate(() => document.getElementById("main-content")?.hasAttribute("inert"));
  ok("page content inert", inert === true, String(inert));
  const groups = await sheet.locator("p[aria-hidden]").allTextContents();
  ok(
    "group labels",
    ["// NAVIGATE", "// WORK", "// TOOLS", "// FOLLOW"].every((g) => groups.includes(g)),
    JSON.stringify(groups),
  );
  const minHeights = await sheet.evaluate((el) =>
    Array.from(el.querySelectorAll("a[href], button")).map((n) => n.getBoundingClientRect().height),
  );
  ok("items >= 48px", minHeights.every((h) => h >= 47.5), JSON.stringify(minHeights));
  const ctaBox = await sheet.evaluate((el) => {
    const cta = el.querySelector("a[href='/order']");
    return cta ? cta.getBoundingClientRect().toJSON() : null;
  });
  ok(
    "pinned CTA visible in sheet",
    !!ctaBox && ctaBox.bottom <= 844 && ctaBox.height >= 47.5,
    JSON.stringify(ctaBox),
  );
  const focusIn = await page.evaluate(() =>
    document.getElementById("mobile-nav")?.contains(document.activeElement),
  );
  ok("focus moved into sheet", focusIn === true, String(focusIn));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  ok("Esc closes sheet", (await sheet.count()) === 0);
  const overflowAfter = await page.evaluate(() => document.body.style.overflow);
  ok("body overflow restored", overflowAfter === "", JSON.stringify(overflowAfter));
  await page.close();
}

await browser.close();
const failed = results.filter((r) => r.startsWith("FAIL"));
for (const r of results) console.log(r);
console.log(`\nnav-behavior: ${failed.length === 0 ? "OK" : "FAILED"} (${results.length - failed.length}/${results.length})`);
process.exit(failed.length === 0 ? 0 : 1);
