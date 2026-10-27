#!/usr/bin/env node
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = Number(process.env.TODO_LEAK_PORT ?? "3099");
const BASE = `http://127.0.0.1:${PORT}`;

const ROUTES = [
  "/",
  "/work",
  "/work/shopledger",
  "/work/routesheet",
  "/work/streamdock",
  "/work/booknook",
  "/work/wolf",
  "/work/deploymonk",
  "/work/lonewolf",
  "/about",
  "/process",
  "/faq",
  "/contact",
  "/terms",
  "/privacy",
  "/info",
  "/order",
];

const BAD = ["TODO(OWNER)", "undefined", "[object Object]", "NaN"];

function stripNonVisible(html) {
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, "");
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  // Remove source maps
  s = s.replace(/\/\/# sourceMappingURL=[^\n\r]+/g, "");
  s = s.replace(/\/\*# sourceMappingURL=[\s\S]*?\*\//g, "");
  s = s.replace(/"sourcesContent"[\s\S]*?"mappings"[^"]*"/g, "");
  s = s.replace(/&#x27;/g, "'");
  s = s.replace(/&amp;/g, "&");
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  return s;
}

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server not ready at ${url}`);
}

async function main() {
  const proc = spawn("pnpm", ["start", "-p", String(PORT)], {
    cwd: process.cwd(),
    stdio: "ignore",
    env: { ...process.env, PORT: String(PORT) },
  });

  try {
    await waitForServer(`${BASE}/`);
    const browser = await chromium.launch();
    const page = await browser.newPage();
    let failed = false;

    for (const route of ROUTES) {
      try {
        await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 30000 });
        const html = await page.content();
        const text = stripNonVisible(html);
        for (const token of BAD) {
          if (text.includes(token)) {
            console.error(`TODO-LEAK: ${route} contains "${token}"`);
            failed = true;
            break;
          }
        }
        if (!failed) {
          console.log(`OK ${route}`);
        }
      } catch (e) {
        console.error(`ERROR ${route}: ${e.message}`);
        failed = true;
      }
    }

    await browser.close();
    if (failed) process.exit(1);
    console.log("todo-leak-check: OK");
  } finally {
    proc.kill("SIGTERM");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
