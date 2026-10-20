import sharp from "sharp";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const FILES = [
  ...readdirSync(join(ROOT, "public", "brand")).map((f) => join(ROOT, "public", "brand", f)),
  join(ROOT, "src", "app", "icon.png"),
  join(ROOT, "src", "app", "apple-icon.png"),
];

const SRC_W = 1408, SRC_H = 768;
let ok = true;
const rows = [];
for (const f of FILES.sort()) {
  try {
    const img = sharp(f);
    const meta = await img.metadata();
    const w = meta.width || 0, h = meta.height || 0;
    if (w <= 0 || h <= 0) { ok = false; rows.push([f, "BAD", "bad dims", "-", "-"]); continue; }
    if (w > SRC_W || h > SRC_H) { ok = false; rows.push([f, "BAD", `${w}x${h}`, "-", "-"]); continue; }
    if (f.includes("logo-mark") && !f.includes("coral")) {
      const r = w/h;
      if (r < 0.45 || r > 0.65) { ok = false; rows.push([f, "BAD", `${w}x${h}`, "-", "-"]); continue; }
    }
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const cw = info.width, ch = info.height, cc = info.channels;
    const c1 = data[(0)*cw*cc + (0)*cc + 3];
    const c2 = data[(0)*cw*cc + (cw-1)*cc + 3];
    const c3 = data[(ch-1)*cw*cc + (0)*cc + 3];
    const c4 = data[(ch-1)*cw*cc + (cw-1)*cc + 3];
    if (f.includes("logo-")) {
      if (c1 !== 0 || c2 !== 0 || c3 !== 0 || c4 !== 0) { ok = false; rows.push([f, "BAD", `${cw}x${ch}`, "corner-alpha", "-"]); continue; }
    }
    let opaque = 0;
    for (let i = 3; i < data.length; i += cc) if (data[i] > 0) opaque++;
    const pct = (opaque / (cw * ch)) * 100;
    if (f.includes("logo-")) {
      if (pct < 3 || pct > 70) { ok = false; rows.push([f, "BAD", `${cw}x${ch}`, `${pct.toFixed(1)}%`, "-"]); continue; }
      const rightStart = Math.floor(cw * 0.95);
      const bottomStart = Math.floor(ch * 0.8);
      let sparkle = false;
      for (let y = bottomStart; y < ch; y++) {
        for (let x = rightStart; x < cw; x++) {
          if (data[y*cw*cc + x*cc + 3] > 0) { sparkle = true; break; }
        }
        if (sparkle) break;
      }
      if (sparkle) { ok = false; rows.push([f, "BAD", `${cw}x${ch}`, `${pct.toFixed(1)}%`, "sparkle"]); continue; }
    }
    rows.push([f, "OK", `${cw}x${ch}`, `${pct.toFixed(1)}%`, "-"]);
  } catch (e) {
    ok = false;
    rows.push([f, "ERR", "-", "-", String(e)]);
  }
}
console.log("file\tstatus\tdims\topaque\tnote");
for (const r of rows) console.log(r.join("\t"));
process.exit(ok ? 0 : 1);
