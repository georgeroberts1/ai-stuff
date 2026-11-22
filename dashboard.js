import { flatOnTile, geometry } from "./geometry.js";
import { MIRROR, TILES, WALL } from "./tiles.js";

const esc = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const link = (t) => {
  const external = /^https?:/.test(t.href);
  return `href="${esc(t.href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}${t.description ? ` aria-label="${esc(`${t.title}. ${t.description}`)}"` : ""}`;
};

const text = (t) => `<span class="tag-title">${esc(t.title)}</span><span class="tag-blurb">${esc(t.blurb)}</span>`;

const spot = (t, i) => {
  const { points, clip, cx, cy } = geometry(t.corners, WALL);
  return `<div class="spot" data-id="${i}" style="--cx:${cx}%;--cy:${cy}%;--clip:${clip}">
  <svg viewBox="0 0 ${WALL.width} ${WALL.height}" preserveAspectRatio="none" aria-hidden="true"><polygon points="${points}"/></svg>
  <span class="glyph" aria-hidden="true"><span>${esc(t.emoji)}</span></span>
  <button class="pin" type="button" aria-expanded="false" aria-label="Show ${esc(t.title)}"></button>
  <a class="tag" ${link(t)}>${text(t)}</a>
</div>`;
};

const card = (t, i) => `<a class="card" data-id="${i}" ${link(t)}>
  <span class="card-glyph" aria-hidden="true">${esc(t.emoji)}</span>
  <span class="card-text">${text(t)}</span>
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
</a>`;

const mirror = geometry(MIRROR, WALL);
document.querySelector(".mirror").setAttribute("style", `--clip:${mirror.clip};--cx:${mirror.cx}%;--cy:${mirror.cy}%`);

// Hidden tiles stay off the page unless the URL asks for them: ?all shows every tile,
// ?show=Choirmash,Restaurant%20Metrix shows those ones. Previewed tiles are drawn dashed.
const params = new URLSearchParams(location.search);
const wanted = (params.get("show") ?? "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
const shown = TILES.filter((t) => !t.hidden || params.has("all") || wanted.includes(t.title.toLowerCase()));
const mark = (html, t) => (t.hidden ? html.replace(/^<(div|a) class="(spot|card)"/, '<$1 class="$2 preview"') : html);

document.getElementById("spots").innerHTML = shown.map((t, i) => mark(spot(t, i), t)).join("");
document.getElementById("links").innerHTML = shown.map((t, i) => mark(card(t, i), t)).join("");

// Each emoji lies flat on its tile: a tile-shaped box warped onto the tile's four corners, with the
// emoji at one size (GLYPH photo pixels, never under 20 screen pixels) in the middle of it.
const GLYPH = 22;
const layoutGlyphs = () => {
  const layer = document.querySelector(".layer");
  const scale = layer.clientWidth / WALL.width;
  const size = Math.max(GLYPH, 20 / scale);
  document.querySelectorAll(".spot").forEach((el) => {
    const { w, h, matrix } = flatOnTile(shown[Number(el.dataset.id)].corners, scale);
    const glyph = el.querySelector(".glyph");
    glyph.style.cssText = `width:${w}px;height:${h}px;font-size:${size}px;transform:${matrix}`;
  });
};
layoutGlyphs();
new ResizeObserver(layoutGlyphs).observe(document.querySelector(".layer"));

const setOpen = (id) => {
  for (const el of document.querySelectorAll("[data-id]")) el.classList.toggle("open", el.dataset.id === id);
  for (const spotEl of document.querySelectorAll(".spot")) {
    spotEl.querySelector(".pin").setAttribute("aria-expanded", String(spotEl.dataset.id === id));
  }
};

document.addEventListener("click", (e) => {
  const spotEl = e.target.closest(".pin")?.parentElement;
  if (spotEl) setOpen(spotEl.classList.contains("open") ? null : spotEl.dataset.id);
  else if (!e.target.closest(".tag, .card")) setOpen(null);
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const pin = document.activeElement.closest?.(".spot")?.querySelector(".pin");
  setOpen(null);
  pin?.focus();
});
