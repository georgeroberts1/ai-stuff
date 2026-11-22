// Turns a tile's pixel corners on the photo into the shapes the page draws.
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

export const geometry = (corners, { width, height }) => {
  const pctX = (x) => (x / width) * 100;
  const pctY = (y) => (y / height) * 100;
  return {
    points: corners.map(([x, y]) => `${x},${y}`).join(" "),
    clip: `polygon(${corners.map(([x, y]) => `${pctX(x)}% ${pctY(y)}%`).join(", ")})`,
    cx: pctX(mean(corners.map(([x]) => x))),
    cy: pctY(mean(corners.map(([, y]) => y))),
  };
};

// The 3x3 perspective map (row-major, h33 = 1) taking the rectangle (0,0) (w,0) (w,h) (0,h) onto
// four corners given clockwise from top left. Solved from the four point pairs by elimination.
export const homography = (w, h, corners) => {
  const src = [[0, 0], [w, 0], [w, h], [0, h]];
  const m = [];
  src.forEach(([x, y], i) => {
    const [u, v] = corners[i];
    m.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    m.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  });
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(m[r][c]) > Math.abs(m[p][c])) p = r;
    [m[c], m[p]] = [m[p], m[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = m[r][c] / m[c][c];
      for (let k = c; k < 9; k++) m[r][k] -= f * m[c][k];
    }
  }
  const s = m.map((row, i) => row[8] / row[i]);
  return [[s[0], s[1], s[2]], [s[3], s[4], s[5]], [s[6], s[7], 1]];
};

// How a glyph lies flat on its tile: a box the size of the tile (mean edge lengths, in photo
// pixels) and the CSS matrix3d that maps that box onto the tile's corners, scaled by `scale`
// (screen pixels per photo pixel).
export const flatOnTile = (corners, scale = 1) => {
  const len = ([a, b]) => Math.hypot(corners[b][0] - corners[a][0], corners[b][1] - corners[a][1]);
  const w = (len([0, 1]) + len([3, 2])) / 2;
  const h = (len([0, 3]) + len([1, 2])) / 2;
  const H = homography(w, h, corners).map((row, i) => (i < 2 ? row.map((n) => n * scale) : row));
  const m = [H[0][0], H[1][0], 0, H[2][0], H[0][1], H[1][1], 0, H[2][1], 0, 0, 1, 0, H[0][2], H[1][2], 0, H[2][2]];
  return { w, h, matrix: `matrix3d(${m.join(",")})` };
};
