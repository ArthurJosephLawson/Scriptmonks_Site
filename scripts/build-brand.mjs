import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SRC = join(__dirname, "..", "logo.png");
const OUT = join(__dirname, "..", "public", "brand");
const INK = [0xe8, 0xf2, 0xf3];
const CORAL = [0xff, 0x7a, 0x65];
const DARK = [0x09, 0x18, 0x1b];
const PAD = 10;
const MARK = { x0: 621, y0: 147, x1: 786, y1: 477 };
const WORD = { x0: 415, y0: 525, x1: 992, y1: 618 };
const SPARKLE_RIGHT_START = 1290;
mkdirSync(OUT, { recursive: true });

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const lum = (x, y) => {
  const i = (y * W + x) * C;
  return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
};
const bg = (lum(5, 5) + lum(W - 6, 5) + lum(5, H - 6) + lum(W - 6, H - 6)) / 4;
const ink = lum(700, 400);
if (bg - ink < 100) throw new Error("Unexpected contrast: re-measure the logo");

const alpha = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (x >= SPARKLE_RIGHT_START - 20) {
      alpha[y * W + x] = 0;
      continue;
    }
    let t = (bg - lum(x, y)) / (bg - ink);
    t = Math.min(1, Math.max(0, (t - 0.08) / 0.92));
    alpha[y * W + x] = Math.round(t * 255);
  }
}

const rect = (b) => ({
  left: b.x0 - PAD,
  top: b.y0 - PAD,
  width: b.x1 - b.x0 + 1 + 2 * PAD,
  height: b.y1 - b.y0 + 1 + 2 * PAD,
});

async function render(r, color, name) {
  const buf = Buffer.alloc(r.width * r.height * 4);
  for (let y = 0; y < r.height; y++) {
    for (let x = 0; x < r.width; x++) {
      const ox = r.left + x;
      const oy = r.top + y;
      if (ox >= SPARKLE_RIGHT_START - 20) {
        const o = (y * r.width + x) * 4;
        buf[o] = color[0];
        buf[o + 1] = color[1];
        buf[o + 2] = color[2];
        buf[o + 3] = 0;
        continue;
      }
      const o = (y * r.width + x) * 4;
      buf[o] = color[0];
      buf[o + 1] = color[1];
      buf[o + 2] = color[2];
      buf[o + 3] = alpha[oy * W + ox];
    }
  }
  const png = await sharp(buf, { raw: { width: r.width, height: r.height, channels: 4 } }).png().toBuffer();
  await sharp(png).toFile(join(OUT, name));
  return png;
}

const full = {
  left: WORD.x0 - PAD,
  top: MARK.y0 - PAD,
  width: WORD.x1 - WORD.x0 + 1 + 2 * PAD,
  height: WORD.y1 - MARK.y0 + 1 + 2 * PAD,
};

const markCoral = await render(rect(MARK), CORAL, "logo-mark-coral.png");
await render(rect(MARK), INK, "logo-mark.png");
await render(rect(WORD), INK, "logo-wordmark.png");
await render(full, INK, "logo-full.png");

const markCoralResized512 = await sharp(markCoral).resize({ height: Math.round(512 * 0.68), fit: "inside" }).png().toBuffer();
const icon512 = sharp({
  create: { width: 512, height: 512, channels: 4, background: { r: DARK[0], g: DARK[1], b: DARK[2], alpha: 1 } },
}).composite([{ input: markCoralResized512, gravity: "center" }]);
await icon512.png().toFile(join(__dirname, "..", "src", "app", "icon.png"));

const markCoralResized180 = await sharp(markCoral).resize({ height: Math.round(180 * 0.68), fit: "inside" }).png().toBuffer();
const icon180 = sharp({
  create: { width: 180, height: 180, channels: 4, background: { r: DARK[0], g: DARK[1], b: DARK[2], alpha: 1 } },
}).composite([{ input: markCoralResized180, gravity: "center" }]);
await icon180.png().toFile(join(__dirname, "..", "src", "app", "apple-icon.png"));
