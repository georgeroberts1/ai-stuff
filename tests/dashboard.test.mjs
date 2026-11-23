import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import config from "../vite.config.js";
import { flatOnTile, geometry } from "../geometry.js";
import { TILES, WALL } from "../tiles.js";

const root = resolve(import.meta.dirname, "..");
const pages = Object.values(config.build.rollupOptions.input);

test("every tile links to a folder with an index.html that Vite builds", () => {
  for (const t of TILES.filter((t) => !/^https?:/.test(t.href))) {
    const page = resolve(root, t.href, "index.html");
    assert.ok(existsSync(page), `${t.title}: ${page} does not exist`);
    assert.ok(pages.includes(page), `${t.title}: ${t.href} is missing from vite.config.js`);
  }
});

test("external tile links use https", () => {
  for (const t of TILES.filter((t) => /^https?:/.test(t.href))) assert.equal(new URL(t.href).protocol, "https:", `${t.title} must link over https`);
});

test("hidden is true or left out", () => {
  for (const t of TILES) assert.ok(t.hidden === undefined || t.hidden === true, `${t.title}: write hidden: true, or remove it`);
});

test("at least one tile is shown", () => {
  assert.ok(TILES.some((t) => !t.hidden), "every tile is hidden");
});

test("every tile has four corners inside the photo", () => {
  for (const t of TILES) {
    assert.equal(t.corners.length, 4, `${t.title} needs four corners`);
    for (const [x, y] of t.corners) {
      assert.ok(x >= 0 && x <= WALL.width && y >= 0 && y <= WALL.height, `${t.title}: (${x}, ${y}) is off the photo`);
    }
  }
});

// On a 390px phone the photo is cropped to start at x=300 and drawn at 390/1100 of its size,
// and each tile's tap circle is 21px in radius. Tiles must stay in the crop and 42px apart there.
const PHONE_CROP_LEFT = 300;
const MIN_CENTRE_GAP = 42 / (390 / 1100);

test("every tile is inside the phone crop", () => {
  for (const t of TILES) {
    for (const [x] of t.corners) assert.ok(x >= PHONE_CROP_LEFT, `${t.title}: x=${x} is cropped off on phones`);
  }
});

test("tile tap circles on a phone do not overlap", () => {
  const centres = TILES.map((t) => {
    const { cx, cy } = geometry(t.corners, WALL);
    return [t.title, (cx / 100) * WALL.width, (cy / 100) * WALL.height];
  });
  for (const [i, [a, ax, ay]] of centres.entries()) {
    for (const [b, bx, by] of centres.slice(i + 1)) {
      assert.ok(Math.hypot(ax - bx, ay - by) >= MIN_CENTRE_GAP, `${a} and ${b} are too close for a phone tap`);
    }
  }
});

test("geometry gives the centre and clip of a tile as percentages of the photo", () => {
  const g = geometry([[0, 0], [100, 0], [100, 50], [0, 50]], { width: 200, height: 100 });
  assert.equal(g.cx, 25);
  assert.equal(g.cy, 25);
  assert.equal(g.clip, "polygon(0% 0%, 50% 0%, 50% 50%, 0% 50%)");
  assert.equal(g.points, "0,0 100,0 100,50 0,50");
});

test("every image in index.html's srcsets exists in public/", () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const files = [...html.matchAll(/\b(img\/[\w.-]+)\s+\d+w/g)].map((m) => m[1]);
  assert.ok(files.length > 0, "found no srcset images");
  for (const f of new Set(files)) assert.ok(existsSync(resolve(root, "public", f)), `${f} is missing from public/`);
});

test("flatOnTile maps its box onto the tile's corners", () => {
  const corners = [[515, 435], [566, 417], [566, 449], [517, 467]];
  const { w, h, matrix } = flatOnTile(corners);
  const m = matrix.match(/matrix3d\((.*)\)/)[1].split(",").map(Number);
  const at = (x, y) => {
    const d = m[3] * x + m[7] * y + m[15];
    return [(m[0] * x + m[4] * y + m[12]) / d, (m[1] * x + m[5] * y + m[13]) / d];
  };
  for (const [[x, y], [u, v]] of [[[0, 0], corners[0]], [[w, 0], corners[1]], [[w, h], corners[2]], [[0, h], corners[3]]]) {
    const [px, py] = at(x, y);
    assert.ok(Math.abs(px - u) < 1e-6 && Math.abs(py - v) < 1e-6, `(${x},${y}) lands at ${px},${py}, not ${u},${v}`);
  }
});
