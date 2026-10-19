import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { inflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const bytes = (file: string) => readFileSync(path.join(root, file));
// Git uses CRLF on this Windows checkout and LF on the production builder.
// Text pins differ only in line endings. PNG pins below remain byte-exact.
const text = (file: string) => bytes(file).toString("utf8").replace(/\r\n/g, "\n");
const sha = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");
const SVG_SHA = "725fb048328478fe9bd94d3496b7017e7f571fb9527cd8f523274256731346de";
const PALETTE: Record<string, readonly number[]> = {
  ".": [31, 61, 46, 255], C: [244, 239, 224, 255], G: [201, 169, 97, 255],
};
const MASTER = [
  "................", "................", "................", "................",
  "................", "....CCCCCCCC....", "...CCCCCCCGGC...", "..CCCCCCCGGGGC..",
  "..CCCCCCCGGGGC..", "...CCCCCCCGGC...", "....CCCCCCCC....", "................",
  "................", "................", "................", "................",
];
const PNGS = [
  [180, "309dbd35eb408be0458446b8325a53ebedfbab7854635cc101948d10a071eda7"],
  [192, "dcdf69c78706ae1cfb931dc1061753abdd5eba40e70d7c9fa0b114cbd486a5aa"],
  [512, "6b03390ee64192ea65e60c8e4166a024c669d13f923a722b6fd20728072ac473"],
] as const;

function decodeRgbaPng(data: Buffer) {
  expect([...data.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  const compressed: Buffer[] = [];
  let width = 0, height = 0, ended = false;
  for (let offset = 8; offset < data.length;) {
    const length = data.readUInt32BE(offset), kind = data.toString("ascii", offset + 4, offset + 8);
    expect(offset + 12 + length).toBeLessThanOrEqual(data.length);
    const payload = data.subarray(offset + 8, offset + 8 + length);
    if (kind === "IHDR") {
      width = payload.readUInt32BE(0); height = payload.readUInt32BE(4);
      expect([...payload.subarray(8)]).toEqual([8, 6, 0, 0, 0]);
    } else if (kind === "IDAT") compressed.push(payload);
    else if (kind === "IEND") { ended = true; expect(offset + 12).toBe(data.length); }
    offset += length + 12;
  }
  expect(ended).toBe(true);
  const scanlines = inflateSync(Buffer.concat(compressed));
  expect(scanlines.length).toBe(height * (width * 4 + 1));
  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    expect(scanlines[y * (width * 4 + 1)]).toBe(0);
    scanlines.copy(pixels, y * width * 4, y * (width * 4 + 1) + 1, (y + 1) * (width * 4 + 1));
  }
  return { width, height, pixels };
}
function safePublicPath(href: string) {
  expect(href).toMatch(/^\/[a-z0-9.-]+(?:\?v=20261018)?$/);
  const pathname = href.split("?")[0];
  expect(pathname).not.toContain("..");
  expect(existsSync(path.join(root, "public", pathname.slice(1)))).toBe(true);
}

describe("House uses the frozen shared Pixel Toggle emblem", () => {
  it("ships the exact shared SVG with native crisp edges and no AH monogram or lettering", () => {
    const svg = text("public/icon.svg");
    expect(sha(svg)).toBe(SVG_SHA);
    expect(svg).toContain('viewBox="0 0 16 16"');
    expect(svg).toContain('shape-rendering="crispEdges"');
    expect(svg).toContain('aria-label="Toggle"');
    expect([...new Set(svg.match(/#[0-9A-F]{6}/g))]).toEqual(["#1F3D2E", "#F4EFE0", "#C9A961"]);
    expect(svg).not.toMatch(/<(?:text|tspan|image|filter)\b|\bAH\b|Alex Holmes|data:image/i);
  });

  it.each(PNGS)("ships the exact %spx opaque PNG with only master pixels and the canonical palette", (size, openingHash) => {
    const data = bytes(`public/toggle-pixel-${size}.png`);
    expect(sha(data)).toBe(openingHash);
    const decoded = decodeRgbaPng(data);
    expect([decoded.width, decoded.height]).toEqual([size, size]);
    const expected = Buffer.alloc(size * size * 4);
    const colors = new Set<string>();
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const ink = MASTER[Math.floor(y * 16 / size)][Math.floor(x * 16 / size)];
      expected.set(PALETTE[ink], (y * size + x) * 4);
      const at = (y * size + x) * 4;
      colors.add(decoded.pixels.subarray(at, at + 4).toString("hex"));
    }
    expect(decoded.pixels.equals(expected)).toBe(true);
    expect([...colors].sort()).toEqual(["1f3d2eff", "c9a961ff", "f4efe0ff"]);
  });

  it("changes only the two icon links and preserves all other opening HTML and metadata", () => {
    const html = text("index.html");
    const svgLink = '<link rel="icon" type="image/svg+xml" href="/icon.svg?v=20261018" />';
    const touchLink = '<link rel="apple-touch-icon" sizes="180x180" href="/toggle-pixel-180.png" />';
    expect(html.split(svgLink)).toHaveLength(2);
    expect(html.split(touchLink)).toHaveLength(2);
    const prior = html.replace(svgLink, '<link rel="icon" type="image/svg+xml" href="/icon.svg" />')
      .replace(touchLink, '<link rel="apple-touch-icon" href="/icon.svg" />');
    expect(sha(prior)).toBe("a6e7ce2acf0564ffea6f22cdae36f29632e200862ea115ba95952c12de0d9a40");
    expect(html).toContain('<link rel="manifest" href="/manifest.json" />');
    for (const href of ["/icon.svg?v=20261018", "/toggle-pixel-180.png", "/manifest.json"]) safePublicPath(href);
    expect(html).not.toMatch(/serviceWorker|service-worker/i);
  });

  it("preserves House manifest identity, entry, scope and all non-icon fields with safe shared icon paths", () => {
    const manifest = JSON.parse(text("public/manifest.json"));
    const { icons, ...unchanged } = manifest;
    expect(sha(JSON.stringify(unchanged))).toBe("e4f7011d1f4c942f22c704949888a121af394c1c495fcc51f4fc26d59d4d8238");
    expect(icons).toEqual([
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any", purpose: "any" },
      { src: "/toggle-pixel-192.png", type: "image/png", sizes: "192x192", purpose: "any maskable" },
      { src: "/toggle-pixel-512.png", type: "image/png", sizes: "512x512", purpose: "any maskable" },
    ]);
    icons.forEach((icon: { src: string }) => safePublicPath(icon.src));
  });

  it("keeps every foreground pixel inside the central 80-percent maskable safe circle", () => {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      if (MASTER[y][x] === ".") continue;
      for (const [xx, yy] of [[x, y], [x + 1, y], [x, y + 1], [x + 1, y + 1]]) {
        expect((xx - 8) ** 2 + (yy - 8) ** 2).toBeLessThanOrEqual((16 * 0.4) ** 2);
      }
    }
  });

  it("leaves the existing production asset, route and metadata verifier exact", () => {
    expect(sha(text("scripts/verify-production-build.mjs"))).toBe("a2892c692928f25928ec3e4f8b515f94ad0c475bfc900bbf8b3551feda0c75f7");
  });
});
