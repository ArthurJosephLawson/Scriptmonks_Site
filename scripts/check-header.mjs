// Navbar layout audit (SPEC_V5 §7.1 + §7.7).
// Diagnose: screenshots + defect metrics for the header at every width.
// Gate: pass with zero defects (scrollWidth, viewport overflow, overlap, CTA).
// Run: node scripts/check-header.mjs <baseUrl> <before|after>
import { mkdirSync } from "node:fs";
import { chromium, devices } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3100";
const PHASE = process.argv[3] ?? "diagnose";
const OUT_DIR = `docs/audit/header-${PHASE}`;
mkdirSync(OUT_DIR, { recursive: true });

const WIDTHS = [320, 375, 414, 768, 1024, 1280, 1440, 1920, 2560];

/** Viewport label: width (+ device emulation when named). */
const CASES = [
  ...WIDTHS.map((width) => ({ label: `w${width}`, viewport: { width, height: 900 } })),
  { label: "iphone-14", device: devices["iPhone 14"] },
  { label: "pixel-7", device: devices["Pixel 7"] },
];

const defects = [];

const browser = await chromium.launch();

for (const testCase of CASES) {
  const context = await browser.newContext(
    testCase.device
      ? { ...testCase.device }
      : { viewport: testCase.viewport },
  );
  // Skip the boot splash so it never covers the header screenshot.
  await context.addInitScript(() => {
    sessionStorage.setItem("sm_boot_v1", "seen");
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForSelector("header a[href='/']");

  const label = testCase.label;

  const result = await page.evaluate(() => {
    const header = document.querySelector("header");
    if (!header) return { error: "no header" };

    /** Elements inside the top bar only (not the collapsible panel). */
    const inTopBar = (el) => {
      const bar = header.firstElementChild;
      return bar && bar.contains(el);
    };

    const visible = (el) => {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0")
        return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    const interactive = Array.from(
      header.querySelectorAll("a, button, [role='menuitem'], [role='button']"),
    ).filter((el) => inTopBar(el) && visible(el));

    const overflowChildren = [];
    for (const el of Array.from(header.querySelectorAll("*"))) {
      if (!visible(el) || !inTopBar(el)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.left < -0.5 || rect.right > window.innerWidth + 0.5) {
        overflowChildren.push({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent ?? "").trim().slice(0, 30),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
        });
      }
    }

    const overlaps = [];
    const leaves = interactive.filter(
      (el) => !interactive.some((other) => other !== el && el.contains(other)),
    );
    for (let i = 0; i < leaves.length; i += 1) {
      for (let j = i + 1; j < leaves.length; j += 1) {
        const a = leaves[i].getBoundingClientRect();
        const b = leaves[j].getBoundingClientRect();
        const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (w > 1 && h > 1) {
          overlaps.push({
            a: (leaves[i].textContent ?? leaves[i].getAttribute("aria-label") ?? "").trim().slice(0, 24),
            b: (leaves[j].textContent ?? leaves[j].getAttribute("aria-label") ?? "").trim().slice(0, 24),
            area: Math.round(w * h),
          });
        }
      }
    }

    const cta = header.querySelector("a[href='/order']");
    const ctaRect = cta?.getBoundingClientRect();
    const ctaVisible =
      !!cta &&
      visible(cta) &&
      ctaRect.left >= 0 &&
      ctaRect.right <= window.innerWidth &&
      ctaRect.top >= 0;

    const bar = header.firstElementChild;
    return {
      headerScrollWidth: header.scrollWidth,
      headerClientWidth: header.clientWidth,
      barHeight: Math.round(bar.getBoundingClientRect().height),
      barScrollWidth: bar.scrollWidth,
      barClientWidth: bar.clientWidth,
      overflowChildren,
      overlaps,
      ctaVisible,
    };
  });

  if (result.error) {
    defects.push({ width: label, kind: "missing-header", detail: result.error });
  } else {
    if (result.headerScrollWidth > result.headerClientWidth + 1) {
      defects.push({
        width: label,
        kind: "header-overflow",
        detail: `scrollWidth ${result.headerScrollWidth} > clientWidth ${result.headerClientWidth}`,
      });
    }
    for (const child of result.overflowChildren) {
      defects.push({ width: label, kind: "child-past-viewport", detail: JSON.stringify(child) });
    }
    for (const pair of result.overlaps) {
      defects.push({ width: label, kind: "interactive-overlap", detail: JSON.stringify(pair) });
    }
    if (!result.ctaVisible) {
      defects.push({ width: label, kind: "cta-not-visible", detail: "primary /order CTA hidden or clipped" });
    }
    console.log(
      `${label.padEnd(10)} header ${result.headerScrollWidth}/${result.clientWidth ?? result.headerClientWidth} bar h=${result.barHeight}px overflow=${result.overflowChildren.length} overlaps=${result.overlaps.length} cta=${result.ctaVisible}`,
    );
  }

  const header = page.locator("header");
  await header.screenshot({ path: `${OUT_DIR}/${label}.png` });
  await context.close();
}

await browser.close();

if (defects.length > 0) {
  console.log(`\nheader-check: FAILED — ${defects.length} defect(s):`);
  for (const defect of defects) {
    console.log(`  [${defect.width}] ${defect.kind}: ${defect.detail}`);
  }
  process.exit(1);
}
console.log("\nheader-check: OK — zero defects at all widths");
