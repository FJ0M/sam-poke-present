// ============================================================
//  WORLD — the walk-around overworld: tiles, characters, NPCs,
//  trainers, warps, the van, the train, the e-bike.
//  Uses helpers that game.js puts on window.PS.
// ============================================================
(() => {
"use strict";
const TS = 16, VW = 10;                       // tile size, viewport width in tiles
let VH = 9;                                   // viewport height: set to fill the phone screen
const P = () => window.PS;
const S = () => window.PS.S();

// ---------- tile painting ----------
// Each tile is painted once onto a 16x16 canvas and cached.
const SOLID = new Set("THRwSVM~#fWvkKtbpqdFCon|YajiZ".split(""));
const ENC = { ",": "grass", "r": "reeds" };
const TILE_CACHE = {};
function cv(w = TS, h = TS) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function px(x, c, X, Y, w = 1, h = 1) { x.fillStyle = c; x.fillRect(X, Y, w, h); }
function seeded(n) { let s = n * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
function grass(x, base = "#7ccf6a", dot = "#5fb24f", seed = 1) {
  px(x, base, 0, 0, 16, 16); const r = seeded(seed);
  for (let i = 0; i < 6; i++) { const X = Math.floor(r() * 14) + 1, Y = Math.floor(r() * 14) + 1; px(x, dot, X, Y); px(x, dot, X + 1, Y - 1); }
}
const PAINT = {
  ".": x => grass(x),
  ",": (x, f) => { grass(x, "#5fb24f", "#4a9a3e", 3);
    for (const [X, Y] of [[1, 4], [6, 2], [11, 5], [3, 11], [9, 10], [13, 13]]) {
      const o = f ? 1 : 0; px(x, "#2f7a2c", X + o, Y, 1, 4); px(x, "#3c8d36", X + 1 + o, Y + 1, 1, 3); px(x, "#2f7a2c", X + 2 + o, Y, 1, 4);
    } },
  "*": x => { grass(x); for (const [X, Y, c] of [[3, 3, "#f472b6"], [10, 4, "#facc15"], [6, 10, "#fff"], [12, 11, "#f472b6"]]) { px(x, c, X, Y, 2, 2); px(x, "#2f7a2c", X, Y + 2, 1, 2); } },
  "=": x => { px(x, "#e8cf96", 0, 0, 16, 16); const r = seeded(7); for (let i = 0; i < 5; i++) px(x, "#cfb27a", Math.floor(r() * 15), Math.floor(r() * 15), 2, 1); },
  "c": x => { px(x, "#b9b4ad", 0, 0, 16, 16); for (let y = 0; y < 16; y += 4) for (let X = (y / 4) % 2 ? 0 : 4; X < 16; X += 8) px(x, "#9a948c", X, y, 1, 4); for (let y = 3; y < 16; y += 4) px(x, "#9a948c", 0, y, 16, 1); },
  "~": (x, f) => { px(x, "#3b82f6", 0, 0, 16, 16); px(x, "#93c5fd", f ? 2 : 6, 4, 4, 1); px(x, "#93c5fd", f ? 9 : 1, 10, 4, 1); px(x, "#60a5fa", f ? 12 : 10, 13, 3, 1); },
  "r": (x, f) => { px(x, "#6fb7c9", 0, 0, 16, 16); px(x, "#3b82f6", 0, 10, 16, 6);
    for (const X of [1, 5, 9, 13]) { px(x, "#4d7c2a", X + (f ? 1 : 0), 2, 1, 10); px(x, "#6b4423", X + (f ? 1 : 0), 1, 1, 3); } },
  "T": x => { grass(x); px(x, "#1f5f2a", 2, 1, 12, 10); px(x, "#2f7a3a", 1, 3, 14, 6); px(x, "#3f9a4a", 4, 2, 5, 4); px(x, "#2f7a3a", 3, 9, 10, 2);
    px(x, "#6b4423", 6, 11, 4, 4); px(x, "#4a2e16", 6, 14, 4, 1); px(x, "#123d1b", 2, 10, 12, 1); },
  "#": x => { grass(x); px(x, "#cdb88a", 0, 4, 16, 10); for (let y = 4; y < 14; y += 3) { px(x, "#a8925f", 0, y, 16, 1); for (let X = (y % 2) * 3; X < 16; X += 6) px(x, "#a8925f", X, y, 1, 3); } px(x, "#e2d3aa", 0, 3, 16, 1); },
  "f": x => { grass(x); px(x, "#8b5a2b", 0, 5, 16, 2); px(x, "#8b5a2b", 0, 10, 16, 2); for (const X of [1, 8, 14]) px(x, "#6b4423", X, 3, 2, 11); },
  "R": x => { px(x, "#b5523b", 0, 0, 16, 16); for (let y = 0; y < 16; y += 4) px(x, "#8f3d2c", 0, y + 3, 16, 1); for (let y = 0; y < 16; y += 4) for (let X = (y / 4) % 2 ? 2 : 6; X < 16; X += 8) px(x, "#8f3d2c", X, y, 1, 3); },
  "H": x => { px(x, "#e9d8a6", 0, 0, 16, 16); px(x, "#d4c08a", 0, 5, 16, 1); px(x, "#d4c08a", 0, 11, 16, 1); px(x, "#c2ad74", 0, 15, 16, 1); },
  "w": x => { PAINT.H(x); px(x, "#4a5568", 3, 3, 10, 9); px(x, "#93c5fd", 4, 4, 8, 7); px(x, "#4a5568", 7, 4, 1, 7); px(x, "#4a5568", 4, 7, 8, 1); px(x, "#dbeafe", 5, 5, 2, 1); },
  "D": x => { PAINT.H(x); px(x, "#5b3a1e", 3, 2, 10, 14); px(x, "#7c4f28", 4, 3, 8, 13); px(x, "#facc15", 10, 9, 1, 1); },
  "S": x => { grass(x); px(x, "#6b4423", 7, 9, 2, 6); px(x, "#8b5a2b", 2, 2, 12, 8); px(x, "#a87842", 3, 3, 10, 6); for (const y of [4, 6]) px(x, "#5b3a1e", 4, y, 8, 1); },
  "V": x => { PAINT["="](x); px(x, "#1b1530", 1, 3, 15, 11); px(x, "#f1f5f9", 2, 4, 13, 8); px(x, "#93c5fd", 10, 5, 4, 3); px(x, "#ef4444", 2, 9, 13, 1); px(x, "#1b1530", 3, 12, 3, 3); px(x, "#1b1530", 11, 12, 3, 3); },
  "M": x => { px(x, "#b9b4ad", 0, 0, 16, 16); px(x, "#ef4444", 0, 1, 16, 4); for (let X = 0; X < 16; X += 4) px(x, "#fff", X, 1, 2, 4); px(x, "#8b5a2b", 1, 6, 14, 8); px(x, "#facc15", 3, 7, 3, 2); px(x, "#22c55e", 8, 7, 3, 2); px(x, "#f97316", 11, 8, 2, 2); },
  "n": x => { grass(x); px(x, "#8b5a2b", 1, 6, 14, 3); px(x, "#6b4423", 1, 9, 14, 1); px(x, "#6b4423", 2, 10, 2, 4); px(x, "#6b4423", 12, 10, 2, 4); },
  // indoors
  "W": x => { px(x, "#c9b38a", 0, 0, 16, 16); px(x, "#a8925f", 0, 12, 16, 4); px(x, "#e2d3aa", 0, 0, 16, 2); },
  "_": x => { px(x, "#d9a066", 0, 0, 16, 16); for (let y = 3; y < 16; y += 4) px(x, "#b97f48", 0, y, 16, 1); px(x, "#b97f48", 5, 0, 1, 3); px(x, "#b97f48", 11, 4, 1, 3); px(x, "#b97f48", 3, 8, 1, 3); px(x, "#b97f48", 9, 12, 1, 3); },
  ":": x => { px(x, "#8fb0c9", 0, 0, 16, 16); for (let i = 0; i < 16; i += 4) { px(x, "#7d9fb9", i, 0, 1, 16); px(x, "#7d9fb9", 0, i, 16, 1); } },
  "s": x => { PAINT[":"](x); px(x, "#7c3aed", 0, 2, 16, 12); px(x, "#9b6bf2", 0, 5, 16, 6); px(x, "#5b21b6", 0, 13, 16, 1); px(x, "#5b21b6", 7, 5, 1, 6); },
  "v": x => { PAINT.W(x); px(x, "#1b1530", 1, 3, 14, 10); px(x, "#38bdf8", 2, 4, 12, 7); px(x, "#facc15", 4, 6, 3, 3); px(x, "#1b1530", 6, 13, 4, 2); },
  "k": x => { PAINT.W(x); px(x, "#e5e7eb", 0, 4, 16, 10); px(x, "#9ca3af", 0, 4, 16, 2); px(x, "#6b7280", 0, 13, 16, 1); },
  "o": x => { PAINT.k(x); px(x, "#374151", 3, 7, 10, 6); px(x, "#f97316", 5, 9, 6, 2); },
  "K": x => { PAINT.k(x); px(x, "#ef4444", 4, 1, 8, 6); px(x, "#b91c1c", 4, 6, 8, 1); px(x, "#1b1530", 11, 2, 3, 1); px(x, "#fff", 6, 0, 1, 1); px(x, "#fff", 8, 0, 1, 1); },
  "t": x => { PAINT["_"](x); px(x, "#8b5a2b", 1, 3, 14, 9); px(x, "#a87842", 2, 4, 12, 7); px(x, "#6b4423", 2, 12, 2, 3); px(x, "#6b4423", 12, 12, 2, 3); },
  "b": x => { PAINT[":"](x); px(x, "#f472b6", 1, 4, 14, 10); px(x, "#fbcfe8", 3, 6, 10, 6); },
  "p": x => { PAINT["_"](x); px(x, "#b45309", 5, 10, 6, 5); px(x, "#16a34a", 3, 2, 10, 8); px(x, "#22c55e", 5, 3, 4, 4); },
  "x": x => { PAINT["_"](x); px(x, "#b91c1c", 1, 3, 14, 10); px(x, "#ef4444", 2, 4, 12, 8); },
  "g": x => { px(x, "#374151", 0, 0, 16, 16); px(x, "#4b5563", 0, 0, 16, 1); px(x, "#4b5563", 0, 0, 1, 16); },
  "q": x => { PAINT.W(x); px(x, "#4b5563", 0, 6, 16, 2); for (const X of [1, 6, 11]) { px(x, "#1f2937", X, 8, 4, 5); px(x, "#6b7280", X + 1, 7, 2, 1); } },
  "d": x => { PAINT["_"](x); px(x, "#78350f", 0, 3, 16, 10); px(x, "#92400e", 1, 4, 14, 8); px(x, "#f1f5f9", 3, 5, 5, 4); px(x, "#facc15", 10, 5, 3, 3); },
  "F": x => { PAINT.W(x); px(x, "#6b7280", 2, 1, 12, 14); for (const y of [3, 8]) { px(x, "#9ca3af", 3, y, 10, 4); px(x, "#1f2937", 7, y + 1, 2, 1); } },
  "C": x => { PAINT.W(x); px(x, "#78350f", 0, 6, 16, 9); px(x, "#a16207", 0, 6, 16, 2); px(x, "#9ca3af", 3, 1, 6, 5); px(x, "#1b1530", 4, 2, 4, 2); px(x, "#fff", 11, 3, 3, 3); },
  // railway, stations, stone buildings, bridges
  "|": x => { px(x, "#8a8178", 0, 0, 16, 16); const r = seeded(11); for (let i = 0; i < 8; i++) px(x, "#6f665e", Math.floor(r() * 15), Math.floor(r() * 15), 1, 1);
    for (const X of [1, 6, 11]) px(x, "#6b4423", X, 2, 3, 12); px(x, "#cbd5e1", 0, 4, 16, 1); px(x, "#cbd5e1", 0, 11, 16, 1); px(x, "#64748b", 0, 5, 16, 1); px(x, "#64748b", 0, 12, 16, 1); },
  "X": x => { PAINT["="](x); px(x, "#cbd5e1", 0, 4, 16, 1); px(x, "#cbd5e1", 0, 11, 16, 1); for (let X = 0; X < 16; X += 4) { px(x, "#fff", X, 0, 2, 2); px(x, "#fff", X + 2, 14, 2, 2); } },
  "P": x => { px(x, "#cbc5bb", 0, 0, 16, 16); px(x, "#facc15", 0, 0, 16, 2); for (let X = 0; X < 16; X += 8) px(x, "#b3aca1", X, 2, 1, 14); px(x, "#b3aca1", 0, 9, 16, 1); },
  "Y": x => { px(x, "#d9c27e", 0, 0, 16, 16); for (let y = 0; y < 16; y += 4) { px(x, "#b89f5b", 0, y + 3, 16, 1); for (let X = (y / 4) % 2 ? 1 : 5; X < 16; X += 8) px(x, "#b89f5b", X, y, 1, 3); } px(x, "#efe0aa", 0, 0, 16, 1); },
  "B": (x, f) => { PAINT["~"](x, f); px(x, "#8b5a2b", 2, 0, 12, 16); px(x, "#a87842", 3, 0, 10, 16); for (let y = 1; y < 16; y += 3) px(x, "#6b4423", 3, y, 10, 1); px(x, "#4a2e16", 1, 0, 1, 16); px(x, "#4a2e16", 14, 0, 1, 16); },
  "L": x => { px(x, "#e7dccb", 0, 0, 16, 16); for (let i = 0; i < 16; i += 8) { px(x, "#cbbfa9", i, 0, 1, 16); px(x, "#cbbfa9", 0, i, 16, 1); } px(x, "#f5efe4", 2, 2, 3, 1); },
  "y": x => { px(x, "#e0f2fe", 0, 0, 16, 16); for (let i = 0; i < 16; i += 4) { px(x, "#bae6fd", i, 0, 1, 16); px(x, "#bae6fd", 0, i, 16, 1); } },
  "a": x => { PAINT.y(x); px(x, "#f8fafc", 0, 2, 16, 13); px(x, "#94a3b8", 0, 14, 16, 1); px(x, "#7dd3fc", 2, 4, 12, 8); px(x, "#cbd5e1", 1, 2, 2, 2); },
  "j": x => { PAINT.W(x); px(x, "#f8fafc", 2, 6, 12, 7); px(x, "#7dd3fc", 4, 8, 8, 3); px(x, "#94a3b8", 7, 3, 2, 4); px(x, "#93c5fd", 4, 1, 8, 4); },
  "i": x => { PAINT.y(x); px(x, "#f8fafc", 4, 1, 8, 5); px(x, "#f8fafc", 3, 7, 10, 7); px(x, "#cbd5e1", 5, 9, 6, 3); px(x, "#94a3b8", 3, 14, 10, 1); },
  "Z": x => { PAINT[":"](x); px(x, "#6b4423", 0, 0, 16, 16); px(x, "#f8fafc", 1, 1, 14, 5); px(x, "#60a5fa", 1, 6, 14, 10); px(x, "#3b82f6", 1, 9, 14, 1); },
};
function tileImg(ch, frame) {
  const k = ch + frame;
  if (TILE_CACHE[k]) return TILE_CACHE[k];
  const c = cv(), x = c.getContext("2d");
  (PAINT[ch] || PAINT["."])(x, frame);
  return TILE_CACHE[k] = c;
}

// ---------- character sprites ----------
// People are drawn from a template and coloured from a palette; animals reuse
// the creature pixel art at small size.
const LOOKS = {
  sam:     { hair: "#5b3a1e", skin: "#f1c27d", shirt: "#ef4444", shirt2: "#b91c1c", legs: "#1f2937", band: "#2563eb" },
  prof:    { hair: "#e5e7eb", skin: "#f1c27d", shirt: "#7c5a2b", shirt2: "#5b3a1e", legs: "#365314", glasses: true },
  freddie: { hair: "#a16207", skin: "#f1c27d", shirt: "#2563eb", shirt2: "#1d4ed8", legs: "#374151" },
  chloe:   { hair: "#7c2d12", skin: "#f1c27d", shirt: "#ec4899", shirt2: "#be185d", legs: "#1f2937", long: true },
  jaz:     { hair: "#1f2937", skin: "#d6a06b", shirt: "#16a34a", shirt2: "#15803d", legs: "#111827", long: true },
  tina:    { hair: "#facc15", skin: "#f1c27d", shirt: "#4b5563", shirt2: "#374151", legs: "#374151", long: true, glasses: true },
  npc1:    { hair: "#111827", skin: "#8d5524", shirt: "#f59e0b", shirt2: "#d97706", legs: "#1e3a8a" },
  npc2:    { hair: "#78350f", skin: "#f1c27d", shirt: "#f1f5f9", shirt2: "#cbd5e1", legs: "#1f2937" },
  npc3:    { hair: "#a3a3a3", skin: "#f1c27d", shirt: "#84cc16", shirt2: "#65a30d", legs: "#78350f", long: true },
  npc4:    { hair: "#78716c", skin: "#e0ac69", shirt: "#0f766e", shirt2: "#115e59", legs: "#365314" },
  npc5:    { hair: "#ea580c", skin: "#f1c27d", shirt: "#a855f7", shirt2: "#7e22ce", legs: "#111827", long: true },
  npc6:    { hair: "#3f3f46", skin: "#c68642", shirt: "#dc2626", shirt2: "#991b1b", legs: "#1f2937" },
};
const ANIMAL_LOOKS = { frenchie: "ralph", frenchie2: "bonnie", winnie: "winnie", cow: "moochinhampton", sheep: "cotswool" };
const SPR_CACHE = {};
function outline(c) {
  const x = c.getContext("2d"), d = x.getImageData(0, 0, c.width, c.height), a = d.data, W = c.width, H = c.height;
  const solid = i => a[i * 4 + 3] > 100, out = [];
  for (let y = 0; y < H; y++) for (let X = 0; X < W; X++) {
    const i = y * W + X; if (solid(i)) continue;
    if ((X > 0 && solid(i - 1)) || (X < W - 1 && solid(i + 1)) || (y > 0 && solid(i - W)) || (y < H - 1 && solid(i + W))) out.push(i);
  }
  for (const i of out) { a[i * 4] = 27; a[i * 4 + 1] = 21; a[i * 4 + 2] = 48; a[i * 4 + 3] = 255; }
  x.putImageData(d, 0, 0);
  return c;
}
function personSprite(look, dir, step, bike) {
  const k = [look, dir, step, bike].join();
  if (SPR_CACHE[k]) return SPR_CACHE[k];
  const L = LOOKS[look] || LOOKS.npc1, c = cv(), x = c.getContext("2d");
  const flip = dir === "right", d = flip ? "left" : dir;
  const lift = step % 2 === 1;
  if (bike) { // the e-bike
    px(x, "#1b1530", 1, 11, 5, 5); px(x, "#9ca3af", 2, 12, 3, 3); px(x, "#1b1530", 10, 11, 5, 5); px(x, "#9ca3af", 11, 12, 3, 3);
    px(x, "#16a34a", 4, 10, 8, 2); px(x, "#22c55e", 6, 9, 3, 1);
  }
  const by = bike ? -2 : 0;
  // legs
  if (!bike) {
    if (d === "left") { px(x, L.legs, 6, 12, 2, lift ? 2 : 3); px(x, L.legs, 8, 12, 2, lift ? 3 : 2); px(x, "#1b1530", 6, 14 - (lift ? 1 : 0), 2, 1); px(x, "#1b1530", 8, 14, 2, 1); }
    else { px(x, L.legs, 5, 12, 2, lift ? 2 : 3); px(x, L.legs, 9, 12, 2, lift ? 3 : 2); px(x, "#1b1530", 5, 14 - (lift ? 1 : 0), 2, 1); px(x, "#1b1530", 9, 14 - (lift ? 0 : 1), 2, 1); }
  }
  // body
  if (d === "left") { px(x, L.shirt, 5, 7 + by, 6, 5); px(x, L.shirt2, 5, 11 + by, 6, 1); px(x, L.skin, 6 + (lift ? 1 : 0), 9 + by, 2, 2); }
  else { px(x, L.shirt, 4, 7 + by, 8, 5); px(x, L.shirt2, 4, 11 + by, 8, 1); px(x, L.skin, 3, 8 + by, 1, 3); px(x, L.skin, 12, 8 + by, 1, 3); }
  // head
  px(x, L.skin, 4, 1 + by, 8, 6);
  px(x, L.hair, 4, 0 + by, 8, 2); px(x, L.hair, 3, 1 + by, 1, 3); px(x, L.hair, 12, 1 + by, 1, 3);
  if (L.long) { px(x, L.hair, 3, 2 + by, 1, 6); px(x, L.hair, 12, 2 + by, 1, 6); }
  if (d === "up") px(x, L.hair, 4, 1 + by, 8, 6);
  else if (d === "down") {
    px(x, "#1b1530", 5, 4 + by, 1, 2); px(x, "#1b1530", 10, 4 + by, 1, 2); px(x, "#e07a6b", 7, 6 + by, 2, 1);
    if (L.glasses) { px(x, "#1b1530", 4, 4 + by, 3, 1); px(x, "#1b1530", 9, 4 + by, 3, 1); }
  } else { px(x, L.hair, 8, 1 + by, 4, 4); px(x, "#1b1530", 5, 4 + by, 1, 2); if (L.glasses) px(x, "#1b1530", 4, 4 + by, 3, 1); }
  if (L.band) px(x, L.band, 4, 1 + by, 8, 1);
  outline(c);
  if (flip) { const f = cv(), fx = f.getContext("2d"); fx.translate(16, 0); fx.scale(-1, 1); fx.drawImage(c, 0, 0); return SPR_CACHE[k] = f; }
  return SPR_CACHE[k] = c;
}
const IMG_CACHE = {};
function animalSprite(look, step) {
  const k = look + step;
  if (IMG_CACHE[k]) return IMG_CACHE[k];
  const c = cv(), x = c.getContext("2d");
  const img = new Image();
  img.onload = () => { x.imageSmoothingEnabled = false; x.drawImage(img, 0, step % 2 ? 1 : 0, 16, 16); };
  img.src = P().pixURL(ANIMAL_LOOKS[look]);
  return IMG_CACHE[k] = c;
}
function charSprite(look, dir, step, bike) { return ANIMAL_LOOKS[look] ? animalSprite(look, step) : personSprite(look, dir, step, bike); }

// ---------- state ----------
let active = false, canvas = null, ctx = null, raf = 0;
let map = null, mapId = null;
let pl = null;                 // { x, y, dir, fx, fy, moving, t0, dur, step }
let npcs = [];
let busy = false;              // dialog / menu / cutscene
let frame = 0;
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const dirOf = (dx, dy) => dx > 0 ? "right" : dx < 0 ? "left" : dy > 0 ? "down" : "up";

function tileAt(x, y) { const r = map.tiles[y]; return r ? r[x] : undefined; }
function npcAt(x, y) { return npcs.find(n => n.visible && Math.round(n.x) === x && Math.round(n.y) === y); }
function flag(f) { return !!(S().flags && S().flags[f]); }
function blocked(x, y, self) {
  const t = tileAt(x, y);
  if (t === undefined || SOLID.has(t)) return true;
  const n = npcAt(x, y); if (n && n !== self) return true;
  if (self && pl && pl.x === x && pl.y === y) return true;
  return false;
}
function lockedAt(x, y) {
  const L = map.locked && map.locked[x + "," + y];
  return L && !flag(L.until) ? L : null;
}

function loadMap(id, x, y, dir) {
  mapId = id; map = MAPS[id];
  const st = S();
  st.world = { map: id, x, y, dir: dir || (pl && pl.dir) || "down" };
  st.visited = st.visited || {};
  if (PLACES[id]) st.visited[id] = true;
  pl = { x, y, dir: st.world.dir, fx: x, fy: y, moving: false, step: 0 };
  npcs = (map.npcs || []).map(n => ({ ...n, ox: n.x, oy: n.y, fx: n.x, fy: n.y, step: 0, visible: !(n.until && flag(n.until)), wanderT: Math.random() * 3000 }));
  if (map.indoor && st.bike) st.bike = false;
  P().music(map.music === "home" ? "home" : map.music || "explore");
  P().save();
}

// ---------- screen ----------
function mount(toast) {
  active = true;
  const ps = P();
  const app = document.getElementById("app");
  VH = Math.max(9, Math.min(17, Math.floor(VW * (app.clientHeight - 6) / Math.max(1, app.clientWidth - 6))));
  ps.screen(`
    <div class="world">
      <canvas id="wc" width="${VW * TS}" height="${VH * TS}"></canvas>
      <div class="w-place" id="wplace">${ps.esc(map.name)}</div>
      <div class="w-box" id="wbox" hidden></div>
      <div class="w-menu" id="wmenu" hidden></div>
    </div>`, "in-world");
  canvas = document.getElementById("wc"); ctx = canvas.getContext("2d"); ctx.imageSmoothingEnabled = false;
  const pl_ = document.getElementById("wplace"); setTimeout(() => pl_ && pl_.classList.add("gone"), 1600);
  cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(loop);
  if (toast) showText([toast]);
}
function unmount() { active = false; cancelAnimationFrame(raf); }

// ---------- dialog & menus ----------
let boxQueue = null;
function showText(lines, opts = {}) {
  return new Promise(res => {
    busy = true;
    const box = document.getElementById("wbox");
    let i = 0;
    const show = () => {
      const line = P().fill(lines[i]);
      const m = line.match(/^([A-Z][A-Za-z.&' ]{1,30}): (.*)$/);
      box.hidden = false;
      box.innerHTML = (m ? `<b class="who">${P().esc(m[1])}</b>${P().esc(m[2])}` : P().esc(line)) + `<span class="caret">▼</span>`;
    };
    show();
    boxQueue = () => {
      i++;
      if (i < lines.length) return show();
      box.hidden = true; boxQueue = null;
      if (!opts.keepBusy) busy = false;
      res();
    };
    box.onclick = () => boxQueue && boxQueue();
  });
}
let menuState = null;
function showMenu(title, items) {
  // items: [{ label, value }] — resolves with value, or null on B
  return new Promise(res => {
    busy = true;
    const el = document.getElementById("wmenu");
    menuState = { items, i: 0, res: v => { el.hidden = true; menuState = null; busy = false; res(v); } };
    const draw = () => {
      el.hidden = false;
      el.innerHTML = (title ? `<div class="w-menu-title">${P().esc(title)}</div>` : "") +
        items.map((it, j) => `<div class="w-item ${j === menuState.i ? "on" : ""}" data-j="${j}">${j === menuState.i ? "▶" : "&nbsp;"} ${P().esc(it.label)}</div>`).join("");
      el.querySelectorAll(".w-item").forEach(d => d.onclick = () => { menuState.i = +d.dataset.j; P().sfx.tap(); menuState.res(items[menuState.i].value); });
    };
    menuState.draw = draw; draw();
  });
}

// ---------- input ----------
function key(k) {
  if (!active) return false;
  if (menuState) {
    if (k === "up") { menuState.i = (menuState.i + menuState.items.length - 1) % menuState.items.length; P().beep(520, .03); menuState.draw(); }
    else if (k === "down") { menuState.i = (menuState.i + 1) % menuState.items.length; P().beep(520, .03); menuState.draw(); }
    else if (k === "a") { P().sfx.tap(); menuState.res(menuState.items[menuState.i].value); }
    else if (k === "b") menuState.res(null);
    return true;
  }
  if (boxQueue) { if (k === "a" || k === "b") { P().sfx.tap(); boxQueue(); } return true; }
  if (busy) return true;
  if (k === "a") { interact(); return true; }
  if (k === "start") { startMenu(); return true; }
  if (k === "select") { P().toggleMute(); return true; }
  return true; // directions are read from HELD each frame
}

// ---------- main loop ----------
let last = 0, waterT = 0;
function loop(now) {
  if (!active) return;
  const dt = Math.min(50, now - last); last = now;
  waterT += dt; if (waterT > 500) { waterT = 0; frame ^= 1; }
  update(now, dt);
  draw();
  raf = requestAnimationFrame(loop);
}
function speed() {
  const st = S();
  if (st.bike && !map.indoor) return 85;
  return (window.HELD && window.HELD.b) ? 110 : 190;
}
function update(now, dt) {
  // player movement
  if (pl.moving) {
    const p = Math.min(1, (now - pl.t0) / pl.dur);
    pl.fx = pl.sx + (pl.x - pl.sx) * p; pl.fy = pl.sy + (pl.y - pl.sy) * p;
    if (p >= 1) { pl.moving = false; pl.fx = pl.x; pl.fy = pl.y; arrived(); }
  } else if (!busy && window.HELD && window.HELD.dir) {
    tryStep(window.HELD.dir, now);
  }
  // npc wander + movement
  for (const n of npcs) {
    if (!n.visible) continue;
    if (n.moving) {
      const p = Math.min(1, (now - n.t0) / 260);
      n.fx = n.sx + (n.x - n.sx) * p; n.fy = n.sy + (n.y - n.sy) * p;
      if (p >= 1) { n.moving = false; n.fx = n.x; n.fy = n.y; if (n.onArrive) { const f = n.onArrive; n.onArrive = null; f(); } }
    } else if (n.wander && !busy) {
      n.wanderT -= dt;
      if (n.wanderT <= 0) {
        n.wanderT = 1500 + Math.random() * 2500;
        const d = Object.keys(DIRS)[Math.floor(Math.random() * 4)], [dx, dy] = DIRS[d];
        n.dir = d;
        const nx = n.x + dx, ny = n.y + dy;
        if (Math.abs(nx - n.ox) <= 2 && Math.abs(ny - n.oy) <= 2 && !blocked(nx, ny, n) && !ENC[tileAt(nx, ny)]) npcMove(n, nx, ny, now);
      }
    }
  }
}
function npcMove(n, x, y, now = performance.now()) { n.sx = n.x; n.sy = n.y; n.x = x; n.y = y; n.t0 = now; n.moving = true; n.step++; }

function tryStep(dir, now) {
  pl.dir = dir;
  const [dx, dy] = DIRS[dir], nx = pl.x + dx, ny = pl.y + dy;
  const t = tileAt(nx, ny);
  // walking off a map edge onto a warp
  if (t === undefined) return;
  const L = lockedAt(nx, ny);
  if (L) { showText(L.text); return; }
  if (blocked(nx, ny)) { if (!pl.bumpT || now - pl.bumpT > 300) { pl.bumpT = now; P().beep(110, .05, "square", .03); } return; }
  pl.sx = pl.x; pl.sy = pl.y; pl.x = nx; pl.y = ny; pl.t0 = now; pl.dur = speed(); pl.moving = true; pl.step++;
}

async function arrived() {
  const st = S();
  st.world = { map: mapId, x: pl.x, y: pl.y, dir: pl.dir };
  const key = pl.x + "," + pl.y;
  // train station doors
  if (map.trains && map.trains[key]) {
    const dest = map.trains[key];
    const v = await showMenu(`Take the train to ${PLACES[dest].label}? (Single: £3.40)`, [{ label: "Yes please", value: 1 }, { label: "No thanks", value: 0 }]);
    if (v) { await travel(dest, "🚆 Choo choo! Next stop: " + PLACES[dest].label + ".", true); return; }
    pl.y += 1; pl.fy = pl.y; return;
  }
  if (map.warps && map.warps[key]) {
    const [to, x, y] = map.warps[key];
    P().beep(330, .08, "triangle", .05);
    await fade(() => { loadMap(to, x, y, pl.dir); });
    return;
  }
  // first time leaving the bungalow: the letter
  if (mapId === "bungalow" && !flag("letter") && pl.y >= 12) {
    st.flags.letter = true; P().save();
    await showText(CONFIG.letter);
  }
  if (checkTrainers()) return;
  const enc = ENC[tileAt(pl.x, pl.y)];
  if (enc && map[enc] && Math.random() < (st.bike ? 0.07 : 0.11)) {
    if (!P().alive().length) return;
    wildBattle(map[enc]);
  }
  P().save();
}

function fade(mid) {
  return new Promise(res => {
    busy = true;
    const w = document.querySelector(".world");
    w && w.classList.add("fading");
    setTimeout(() => { mid(); const pe = document.getElementById("wplace"); if (pe) { pe.textContent = map.name; pe.classList.remove("gone"); setTimeout(() => pe.classList.add("gone"), 1600); } w && w.classList.remove("fading"); busy = false; res(); }, 260);
  });
}
async function travel(dest, msg, byTrain) {
  const [m, x, y] = (byTrain && PLACES[dest].station) || PLACES[dest].at;
  await fade(() => loadMap(m, x, y, "down"));
  if (msg) await showText([msg]);
}

// ---------- interacting ----------
async function interact() {
  const [dx, dy] = DIRS[pl.dir], tx = pl.x + dx, ty = pl.y + dy, key = tx + "," + ty;
  const n = npcAt(tx, ty);
  if (n) {
    n.dir = dirOf(-dx, -dy);
    if (n.trainer && !flag(n.trainer.flag)) return trainerBattle(n);
    if (n.trainer) return showText(n.trainer.after);
    await showText(n.text);
    if (n.heal) { P().healAll(); P().sfx.heal(); }
    return;
  }
  if (map.van === key) return vanMenu();
  const th = map.things && map.things[key];
  if (th) {
    const lines = Array.isArray(th) ? th : th.text;
    await showText(lines);
    if (th.heal) { P().healAll(); P().sfx.heal(); }
    return;
  }
  const L = lockedAt(tx, ty); if (L) return showText(L.text);
}

async function vanMenu() {
  const st = S();
  const items = Object.keys(PLACES).filter(k => st.visited && st.visited[k] && k !== mapId).map(k => ({ label: PLACES[k].label, value: k }));
  if (!items.length) return showText(["Sam's van. It's covered in mud and has a cat hair problem.", "Explore further and the van can take you back to places you've been."]);
  items.push({ label: "Stay here", value: null });
  const v = await showMenu("🚐 Hop in the van. Where to?", items);
  if (v) await travel(v, "Sam parks the van badly. Classic.");
}

async function startMenu() {
  const st = S();
  const items = [
    { label: "Team", value: "team" },
    { label: CONFIG.dexName, value: "dex" },
    ...(!map.indoor ? [{ label: st.bike ? "Get off the e-bike" : "Ride the e-bike", value: "bike" }] : []),
    { label: "Save", value: "save" },
    { label: P().isMuted() ? "Sound: off" : "Sound: on", value: "sound" },
    { label: "Close", value: null },
  ];
  const v = await showMenu(null, items);
  if (v === "team") { unmount(); P().teamScreen(); }
  else if (v === "dex") { unmount(); P().dexScreen(); }
  else if (v === "bike") { st.bike = !st.bike; P().save(); P().beep(st.bike ? 880 : 440, .08); if (st.bike) P().music("bike"); else P().music(map.music); }
  else if (v === "save") { P().save(); await showText(["Game saved! (It also saves by itself as you go.)"]); }
  else if (v === "sound") P().toggleMute();
}

// ---------- trainers ----------
function checkTrainers() {
  for (const n of npcs) {
    if (!n.visible || !n.trainer || !n.sight || flag(n.trainer.flag)) continue;
    const [dx, dy] = DIRS[n.dir];
    for (let i = 1; i <= n.sight; i++) {
      const x = n.x + dx * i, y = n.y + dy * i;
      if (x === pl.x && y === pl.y) { spotted(n, i); return true; }
      if (blocked(x, y, n)) break;
    }
  }
  return false;
}
async function spotted(n, dist) {
  busy = true;
  n.alert = performance.now();
  P().beep(990, .06, "square", .06); setTimeout(() => P().beep(1320, .1, "square", .06), 80);
  await new Promise(r => setTimeout(r, 700));
  n.alert = 0;
  const [dx, dy] = DIRS[n.dir];
  for (let i = 1; i < dist; i++) await new Promise(r => { npcMove(n, n.x + dx, n.y + dy); n.onArrive = r; });
  pl.dir = dirOf(-dx, -dy);
  trainerBattle(n);
}
async function trainerBattle(n) {
  busy = true;
  const T = n.trainer;
  await showText(T.intro, { keepBusy: true });
  unmount();
  P().startBattle({ wild: false, trainer: T, team: T.team.map(([sp, l]) => P().makeMon(sp, l)) });
}
function wildBattle(table) {
  busy = true;
  const total = table.reduce((a, w) => a + (w[3] || 10), 0);
  let r = Math.random() * total, e = table[0];
  for (const w of table) { if ((r -= (w[3] || 10)) <= 0) { e = w; break; } }
  const [sp, lo, hi] = e;
  flash(() => { unmount(); P().startBattle({ wild: true, team: [P().makeMon(sp, lo + Math.floor(Math.random() * (hi - lo + 1)))] }); });
}
function flash(then) {
  const w = document.querySelector(".world");
  w && w.classList.add("encounter");
  P().beep(880, .06, "square", .05); setTimeout(() => P().beep(660, .06, "square", .05), 90); setTimeout(() => P().beep(990, .1, "square", .05), 180);
  setTimeout(then, 650);
}

// ---------- drawing ----------
function draw() {
  const camX = Math.max(0, Math.min(map.tiles[0].length * TS - VW * TS, Math.round(pl.fx * TS - (VW * TS) / 2 + 8)));
  const camY = Math.max(0, Math.min(map.tiles.length * TS - VH * TS, Math.round(pl.fy * TS - (VH * TS) / 2 + 8)));
  const offX = map.tiles[0].length < VW ? Math.floor((VW - map.tiles[0].length) * TS / 2) : 0;
  const offY = map.tiles.length < VH ? Math.floor((VH - map.tiles.length) * TS / 2) : 0;
  ctx.fillStyle = "#1b1530"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const x0 = Math.floor(camX / TS), y0 = Math.floor(camY / TS);
  for (let y = y0; y <= y0 + VH; y++) for (let x = x0; x <= x0 + VW; x++) {
    const t = tileAt(x, y); if (t === undefined) continue;
    ctx.drawImage(tileImg(t, (t === "~" || t === "r" || t === ",") ? frame : 0), x * TS - camX + offX, y * TS - camY + offY);
  }
  // characters, sorted by y
  const list = npcs.filter(n => n.visible).map(n => ({ img: charSprite(n.look, n.dir, n.moving ? n.step : 0), x: n.fx, y: n.fy, alert: n.alert }));
  const st = S();
  const bike = st.bike && !map.indoor;
  list.push({ img: charSprite("sam", pl.dir, pl.moving ? pl.step : 0, bike), x: pl.fx, y: pl.fy, me: true });
  list.sort((a, b) => a.y - b.y);
  for (const c of list) {
    const X = Math.round(c.x * TS - camX + offX), Y = Math.round(c.y * TS - camY + offY) - 3;
    ctx.fillStyle = "rgba(27,21,48,.25)"; ctx.fillRect(X + 3, Y + 16, 10, 2);
    ctx.drawImage(c.img, X, Y);
    if (c.alert) { ctx.fillStyle = "#fff"; ctx.fillRect(X + 5, Y - 12, 6, 10); ctx.fillStyle = "#ef4444"; ctx.fillRect(X + 7, Y - 11, 2, 5); ctx.fillRect(X + 7, Y - 5, 2, 2); }
  }
  // tall grass covers your feet
  if (tileAt(pl.x, pl.y) === "," && !pl.moving) {
    const X = Math.round(pl.fx * TS - camX + offX), Y = Math.round(pl.fy * TS - camY + offY);
    ctx.drawImage(tileImg(",", frame), 0, 10, 16, 6, X, Y + 10, 16, 6);
  }
}

// ---------- entry points used by game.js ----------
const WORLD = {
  key,
  get active() { return active; },
  begin() { // brand new game: wake up on the sofa
    loadMap(START.map, START.x, START.y, START.dir);
    mount();
    (async () => {
      await showText(CONFIG.wakeUp);
      P().giveStarters();
      P().sfx.catch();
      await showText([CONFIG.catsJoin, "Press START for your team and menu. Hold B to run."]);
    })();
  },
  resume(toast) {
    const st = S();
    if (!map || mapId !== (st.world && st.world.map)) {
      const w = st.world || START; loadMap(w.map, w.x, w.y, w.dir);
    } else P().music(st.bike && !map.indoor ? "bike" : map.music);
    busy = false; boxQueue = null; menuState = null;
    mount(toast);
  },
  async afterBattle(result, trainer) {
    const st = S();
    if (result === "lose") {
      loadMap("bungalow", START.x, START.y, "down");
      mount();
      return showText([`${P().heroName()} legged it home to the sofa and had a lie down.`, "Your team is fully rested."]);
    }
    WORLD.resume();
    if (result === "win" && trainer) {
      const n = npcs.find(n => n.trainer && n.trainer.flag === trainer.flag);
      if (n) busy = true;
      if (trainer.reward) await showText([`You got ${trainer.reward} ${CONFIG.ballName}s!`]);
      // NPCs that were waiting on this flag step aside
      for (const m of npcs) if (m.until === trainer.flag) m.visible = false;
    }
  },
  battleBg() {
    if (!map) return ["#bbf7d0", "#86efac"];
    if (map.indoor) return ["#fde68a", "#e9d8a6"];
    if (mapId === "selsley") return ["#bae6fd", "#86efac"];
    if (mapId === "stroud") return ["#e2e8f0", "#cbd5e1"];
    if (mapId === "ebley") return ["#bae6fd", "#a7f3d0"];
    if (mapId === "garden") return ["#e0f2fe", "#bbf7d0"];
    return ["#bae6fd", "#bbf7d0"];
  },
  look: (l, d = "down") => personSprite(l, d, 0, false),
};
window.WORLD = WORLD;
})();
