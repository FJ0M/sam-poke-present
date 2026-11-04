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
const SOLID = new Set("THRwSVM~#fWvkKtbpqdFCon|YajiZEQGUhlmNIJA1234567890!@$".split(""));
const ENC = { ",": "grass", "e": "grass", "r": "reeds" };
const TILE_CACHE = {};
const pick = a => a[Math.floor(Math.random() * a.length)];
function cv(w = TS, h = TS) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function px(x, c, X, Y, w = 1, h = 1) { x.fillStyle = c; x.fillRect(X, Y, w, h); }
// espresso machine helpers: counter under it, and a group head pouring a shot into a cup on the drip tray
function shelf(x) { PAINT["6"](x); px(x, "#7c4a22", 0, 5, 16, 2); px(x, "#9a5d2c", 0, 5, 16, 1); px(x, "#7c4a22", 0, 11, 16, 2); px(x, "#9a5d2c", 0, 11, 16, 1); }
function lmBase(x) { px(x, "#111827", 0, 12, 16, 4); px(x, "#a0672f", 0, 11, 16, 2); px(x, "#c08040", 0, 11, 16, 1); px(x, "#4b5563", 0, 10, 16, 1); }
function lmGroup(x, X, f) { px(x, "#374151", X, 9, 4, 1); px(x, "#111827", X + 3, 9, 3, 1);
  if (f < 3) { px(x, "#6f3a17", X + 1, 10, 1, Math.min(f + 1, 1)); }
  px(x, "#f8fafc", X, 10, 3, 1); if (f > 0) px(x, f === 3 ? "#c08040" : "#7c3a12", X + 1, 10, 1, 1); }
function seeded(n) { let s = n * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
function grass(x, base = "#7ccf6a", dot = "#5fb24f", seed = 1) {
  px(x, base, 0, 0, 16, 16); const r = seeded(seed), hi = shade(base, 1.12);
  for (let i = 0; i < 7; i++) { const X = Math.floor(r() * 14) + 1, Y = Math.floor(r() * 14) + 1; px(x, dot, X, Y); px(x, dot, X + 1, Y - 1); px(x, dot, X - 1, Y - 1); }
  for (let i = 0; i < 4; i++) px(x, hi, Math.floor(r() * 15), Math.floor(r() * 15), 2, 1);
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
  "V": x => { PAINT["="](x); px(x, "#00000033", 1, 13, 15, 2); px(x, "#cbd5e1", 1, 2, 14, 1); px(x, "#f8fafc", 1, 3, 15, 9); px(x, "#e2e8f0", 1, 10, 15, 2);
    px(x, "#334155", 2, 1, 10, 1); px(x, "#f97316", 3, 0, 4, 1); px(x, "#16a34a", 8, 0, 3, 1);
    px(x, "#1e3a5f", 11, 4, 4, 3); px(x, "#7dd3fc", 12, 4, 2, 1); px(x, "#1e3a5f", 2, 4, 3, 3); px(x, "#94a3b8", 6, 3, 1, 8); px(x, "#64748b", 9, 6, 1, 1);
    px(x, "#f59e0b", 15, 8, 1, 1); px(x, "#0f172a", 2, 11, 4, 3); px(x, "#0f172a", 11, 11, 4, 3); px(x, "#9ca3af", 3, 12, 2, 1); px(x, "#9ca3af", 12, 12, 2, 1); },
  // Adelaide Gardens tourist board
  "1": x => { grass(x); px(x, "#9ca3af", 2, 1, 1, 15); px(x, "#012169", 3, 1, 11, 7); px(x, "#fff", 3, 4, 5, 1); px(x, "#fff", 5, 1, 1, 4); px(x, "#c8102e", 3, 4, 5, 1); px(x, "#c8102e", 5, 1, 1, 3);
    for (const [X, Y] of [[5, 6], [10, 2], [12, 4], [10, 6], [11, 5]]) px(x, "#fff", X, Y); px(x, "#6b7280", 1, 14, 3, 2); },
  "2": x => { PAINT["="](x); px(x, "#00000033", 0, 13, 16, 2); px(x, "#b45309", 0, 6, 16, 6); px(x, "#92400e", 0, 11, 16, 1); px(x, "#b45309", 8, 3, 7, 4); px(x, "#7dd3fc", 9, 4, 5, 2);
    px(x, "#78350f", 1, 4, 6, 2); px(x, "#facc15", 2, 3, 2, 1); px(x, "#e5e7eb", 15, 8, 1, 2); px(x, "#111827", 2, 11, 3, 3); px(x, "#111827", 11, 11, 3, 3); px(x, "#9ca3af", 3, 12, 1, 1); px(x, "#9ca3af", 12, 12, 1, 1); },
  "3": x => { grass(x); px(x, "#16a34a", 3, 4, 10, 10); px(x, "#15803d", 3, 4, 10, 1); px(x, "#14532d", 2, 3, 12, 1); px(x, "#111827", 4, 14, 2, 2); px(x, "#111827", 10, 14, 2, 2);
    for (const X of [5, 7, 9]) px(x, "#fef3c7", X, 0, 1, 3); px(x, "#fef3c7", 5, 0, 5, 1); px(x, "#fff", 6, 8, 4, 2); },
  "4": x => { grass(x); px(x, "#6b7280", 7, 10, 2, 6); px(x, "#111827", 1, 1, 14, 10); px(x, "#facc15", 2, 2, 12, 8);
    px(x, "#111827", 5, 4, 5, 3); px(x, "#111827", 9, 3, 2, 2); px(x, "#111827", 4, 7, 1, 2); px(x, "#111827", 8, 7, 2, 1); px(x, "#111827", 3, 5, 2, 1); },
  "5": x => { grass(x); px(x, "#00000033", 2, 13, 13, 2); px(x, "#92400e", 2, 9, 13, 4); px(x, "#b45309", 2, 9, 13, 1);
    for (const X of [4, 8, 12]) px(x, "#facc15", X, 10, 2, 2); px(x, "#dc2626", 6, 10, 1, 2); px(x, "#dc2626", 10, 10, 1, 2); px(x, "#78350f", 14, 8, 2, 6); },
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
  // Rough Hands: dark green, wood and black
  "6": x => { px(x, "#14532d", 0, 0, 16, 16); px(x, "#166534", 0, 0, 16, 2); for (const X of [3, 8, 13]) px(x, "#0f3d22", X, 2, 1, 10); px(x, "#7c4a22", 0, 12, 16, 4); px(x, "#9a5d2c", 0, 12, 16, 1); px(x, "#111827", 0, 15, 16, 1); },
  "7": x => { PAINT["6"](x); px(x, "#111827", 0, 6, 16, 9); px(x, "#a0672f", 0, 5, 16, 2); px(x, "#c08040", 0, 5, 16, 1); px(x, "#d1d5db", 3, 0, 7, 5); px(x, "#111827", 4, 1, 5, 2); px(x, "#f8fafc", 11, 2, 3, 3); px(x, "#7c4a22", 12, 3, 1, 1); },
  // La Marzocca Linea: three tiles of polished steel on the counter. Animated: shots pour, steam puffs.
  "8": (x, f) => { PAINT["6"](x); lmBase(x); px(x, "#9ca3af", 3, 1, 13, 1); px(x, "#e5e7eb", 3, 2, 13, 7); px(x, "#f8fafc", 4, 2, 2, 6); px(x, "#9ca3af", 3, 9, 13, 1);
    px(x, "#6b7280", 2, 1, 1, 9); lmGroup(x, 9, f); },
  "9": (x, f) => { PAINT["6"](x); lmBase(x); px(x, "#9ca3af", 0, 1, 16, 1); px(x, "#e5e7eb", 0, 2, 16, 7); px(x, "#9ca3af", 0, 9, 16, 1);
    px(x, "#b91c1c", 3, 3, 10, 3); px(x, "#fff", 4, 4, 1, 1); px(x, "#fff", 6, 4, 1, 1); px(x, "#fff", 8, 4, 1, 1); px(x, "#fff", 10, 4, 2, 1);
    for (const X of [2, 11]) { px(x, "#374151", X, 0, 3, 1); px(x, "#fff", X + 1, 0, 1, 1); }
    lmGroup(x, 6, (f + 2) & 3); },
  "0": (x, f) => { PAINT["6"](x); lmBase(x); px(x, "#9ca3af", 0, 1, 12, 1); px(x, "#e5e7eb", 0, 2, 12, 7); px(x, "#9ca3af", 0, 9, 12, 1); px(x, "#6b7280", 12, 1, 1, 9);
    lmGroup(x, 2, (f + 1) & 3);
    px(x, "#9ca3af", 13, 4, 1, 6); px(x, "#9ca3af", 12, 9, 2, 1); px(x, "#cbd5e1", 11, 9, 3, 2); // steam wand and jug
    if (f & 1) { px(x, "#f8fafc", 13, 2 - (f >> 1), 2, 1); px(x, "#e5e7eb", 14, 0, 1, 1); px(x, "#f8fafc", 12, 1, 1, 1); } },
  // Rough Hands back wall: shelves of kit, bags of beans, and a coffee critter peeking out
  "!": x => { shelf(x); px(x, "#f8fafc", 2, 1, 3, 3); px(x, "#9ca3af", 3, 0, 1, 1); px(x, "#111827", 7, 2, 3, 2); px(x, "#fbbf24", 11, 1, 3, 3);
    px(x, "#e5e7eb", 2, 8, 4, 2); px(x, "#9ca3af", 3, 7, 2, 1); px(x, "#111827", 8, 7, 2, 3); px(x, "#a0672f", 11, 8, 3, 2); },
  "@": x => { shelf(x); for (const [X, Y, c] of [[1, 0, "#d6b37a"], [6, 0, "#111827"], [11, 0, "#166534"], [1, 6, "#f8fafc"], [6, 6, "#b45309"], [11, 6, "#d6b37a"]]) {
      px(x, c, X, Y + 1, 4, 4); px(x, shade(c, 0.8), X, Y + 1, 4, 1); px(x, "#fff", X + 1, Y + 3, 2, 1); } },
  "$": (x, f) => { shelf(x); px(x, "#d6b37a", 1, 1, 4, 4); px(x, "#111827", 11, 1, 4, 4);
    px(x, "#6f3a17", 6, 1 + (f & 1), 4, 3); px(x, "#fff", 7, 2 + (f & 1), 1, 1); px(x, "#fff", 9, 2 + (f & 1), 1, 1); px(x, "#16a34a", 7, 0 + (f & 1), 2, 1); // a coffee critter!
    px(x, "#f8fafc", 2, 7, 4, 3); px(x, "#a0672f", 9, 7, 5, 3); },
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
// ---- extra detail and new tiles (drawn over the basic set) ----
Object.assign(PAINT, {
  ".": (x, f, v = 0) => { grass(x, "#7ccf6a", "#5fb24f", 1 + v * 5);
    if (v === 3) { px(x, "#fde047", 4, 5, 1, 1); px(x, "#fff", 11, 10, 1, 1); px(x, "#f9a8d4", 9, 3, 1, 1); }
    if (v === 2) { px(x, "#a8a29e", 10, 11, 2, 1); px(x, "#78716c", 10, 12, 2, 1); } },
  "=": (x, f, v = 0) => { px(x, "#e8cf96", 0, 0, 16, 16); const r = seeded(7 + v * 3);
    for (let i = 0; i < 7; i++) px(x, "#cfb27a", Math.floor(r() * 15), Math.floor(r() * 15), 2, 1);
    for (let i = 0; i < 3; i++) { const X = Math.floor(r() * 14), Y = Math.floor(r() * 14); px(x, "#a8a29e", X, Y, 2, 1); px(x, "#f5e6c0", X, Y - 1, 1, 1); } },
  "T": x => { grass(x); px(x, "rgba(0,0,0,.18)", 2, 13, 12, 3);
    px(x, "#6b4423", 6, 10, 4, 5); px(x, "#4a2e16", 8, 10, 2, 5); px(x, "#8b5a2b", 6, 11, 1, 3);
    px(x, "#1f5f2a", 3, 1, 10, 10); px(x, "#1f5f2a", 1, 3, 14, 6); px(x, "#2f7a3a", 2, 2, 11, 7); px(x, "#3f9a4a", 3, 2, 6, 4);
    px(x, "#5cb85c", 4, 3, 2, 1); px(x, "#5cb85c", 9, 5, 2, 1); px(x, "#5cb85c", 3, 6, 1, 1); px(x, "#123d1b", 2, 9, 12, 1); px(x, "#123d1b", 11, 4, 2, 4); },
  "R": x => { px(x, "#b5523b", 0, 0, 16, 16); for (let y = 0; y < 16; y += 4) { px(x, "#8f3d2c", 0, y + 3, 16, 1); px(x, "#cf6a52", 0, y, 16, 1); }
    for (let y = 0; y < 16; y += 4) for (let X = (y / 4) % 2 ? 2 : 6; X < 16; X += 8) px(x, "#8f3d2c", X, y, 1, 3); },
  "H": x => { px(x, "#e9d8a6", 0, 0, 16, 16); for (let y = 0; y < 16; y += 4) { px(x, "#d4c08a", 0, y + 3, 16, 1); for (let X = (y / 4) % 2 ? 0 : 4; X < 16; X += 8) px(x, "#d4c08a", X, y, 1, 3); } px(x, "#c2ad74", 0, 15, 16, 1); },
  "w": x => { PAINT.H(x); px(x, "#4a5568", 2, 2, 12, 11); px(x, "#93c5fd", 3, 3, 10, 9); px(x, "#bfdbfe", 3, 3, 4, 3); px(x, "#4a5568", 7, 3, 2, 9); px(x, "#4a5568", 3, 7, 10, 1);
    px(x, "#f87171", 3, 3, 2, 8); px(x, "#f87171", 11, 3, 2, 8); px(x, "#f8fafc", 1, 13, 14, 1); px(x, "#16a34a", 3, 12, 3, 1); px(x, "#f472b6", 4, 11, 1, 1); },
  "D": x => { PAINT.H(x); px(x, "#4a2e16", 2, 1, 12, 15); px(x, "#7c4f28", 3, 2, 10, 14); px(x, "#5b3a1e", 4, 3, 3, 5); px(x, "#5b3a1e", 9, 3, 3, 5); px(x, "#5b3a1e", 4, 10, 8, 4);
    px(x, "#facc15", 11, 9, 1, 1); px(x, "#9ca3af", 1, 15, 14, 1); px(x, "#fde68a", 7, 2, 2, 1); },
  "~": (x, f = 0) => { px(x, "#3b82f6", 0, 0, 16, 16); px(x, "#2563eb", 0, 12, 16, 4); px(x, "#60a5fa", 0, 0, 16, 2); const o = f * 4;
    px(x, "#bfdbfe", (2 + o) % 16, 4, 4, 1); px(x, "#93c5fd", (9 + o) % 16, 9, 4, 1); px(x, "#93c5fd", (12 + o) % 16, 13, 3, 1); px(x, "#dbeafe", (5 + o * 2) % 16, 7, 1, 1);
    if (f === 1 || f === 3) px(x, "#eff6ff", (11 + o) % 16, 3, 1, 1); },
  // Adelaide Gardens: red dirt, gum trees, barbie, washing line, surfboard, spinifex
  "O": (x, f, v = 0) => { px(x, "#c2603a", 0, 0, 16, 16); const r = seeded(21 + v * 4);
    for (let i = 0; i < 8; i++) px(x, "#a44c2c", Math.floor(r() * 15), Math.floor(r() * 15), 2, 1);
    for (let i = 0; i < 4; i++) px(x, "#d97a4f", Math.floor(r() * 15), Math.floor(r() * 15), 1, 1); if (v === 3) { px(x, "#6b8e23", 3, 10, 1, 2); px(x, "#6b8e23", 4, 9, 1, 3); px(x, "#6b8e23", 5, 10, 1, 2); } },
  "e": (x, f) => { PAINT.O(x, 0, 1); const o = f ? 1 : 0;
    for (const [X, Y] of [[1, 3], [7, 1], [12, 4], [3, 10], [9, 9], [13, 12]]) { px(x, "#a3a837", X + o, Y, 1, 4); px(x, "#c5c94a", X - 1, Y + 1, 1, 3); px(x, "#7c8a2a", X + 1 + o, Y + 1, 1, 3); px(x, "#7c8a2a", X, Y + 4, 2, 1); } },
  "E": x => { PAINT.O(x); px(x, "rgba(0,0,0,.2)", 2, 13, 12, 3);
    px(x, "#f5f5f4", 7, 7, 2, 8); px(x, "#a8a29e", 8, 7, 1, 8); px(x, "#d6d3d1", 6, 14, 4, 1); px(x, "#f5f5f4", 5, 6, 2, 1); px(x, "#f5f5f4", 9, 5, 2, 1);
    px(x, "#4d6b4a", 1, 1, 14, 6); px(x, "#4d6b4a", 3, 0, 10, 8); px(x, "#6f8f68", 2, 1, 5, 3); px(x, "#6f8f68", 9, 1, 4, 3); px(x, "#93b28a", 3, 1, 2, 1); px(x, "#93b28a", 10, 2, 2, 1);
    for (const X of [1, 4, 11, 14]) px(x, "#3a5237", X, 7, 1, 2); px(x, "#3a5237", 2, 7, 12, 1); },
  "Q": x => { PAINT.E(x); px(x, "#9ca3af", 8, 7, 4, 4); px(x, "#1b1530", 9, 8, 1, 1); px(x, "#1b1530", 11, 8, 1, 1); px(x, "#d1d5db", 7, 6, 2, 2); px(x, "#d1d5db", 11, 6, 2, 2); px(x, "#1b1530", 10, 9, 1, 1); },
  "G": x => { PAINT.O(x); px(x, "#1f2937", 2, 4, 12, 6); px(x, "#374151", 3, 5, 10, 4); px(x, "#9ca3af", 3, 5, 10, 1);
    px(x, "#b45309", 4, 6, 4, 1); px(x, "#b45309", 9, 7, 3, 1); px(x, "#ef4444", 5, 7, 1, 1); px(x, "#1f2937", 3, 10, 1, 5); px(x, "#1f2937", 12, 10, 1, 5); px(x, "#e5e7eb", 6, 1, 1, 2); px(x, "#e5e7eb", 9, 0, 1, 3); },
  "h": x => { PAINT.O(x); px(x, "#9ca3af", 7, 3, 2, 12); px(x, "#d1d5db", 0, 3, 16, 1); px(x, "#d1d5db", 3, 1, 10, 1); px(x, "#d1d5db", 3, 5, 10, 1);
    px(x, "#a3e635", 1, 4, 3, 4); px(x, "#f472b6", 10, 4, 3, 3); px(x, "#facc15", 4, 6, 2, 3); px(x, "#22d3ee", 12, 6, 3, 3); },
  "U": x => { PAINT.O(x); px(x, "#f97316", 6, 0, 4, 15); px(x, "#fdba74", 7, 0, 2, 15); px(x, "#2563eb", 6, 6, 4, 2); px(x, "#1b1530", 7, 15, 2, 1); },
  // Sam's living room: mid-century modern with a classic twist
  "-": x => { px(x, "#b7793f", 0, 0, 16, 16);
    for (let y = 0; y < 16; y += 4) for (let X = 0; X < 16; X += 8) { const o = (y / 4) % 2 ? 4 : 0; px(x, "#9a5f2c", (X + o) % 16, y, 4, 1); px(x, "#9a5f2c", (X + o + 4) % 16, y, 1, 4); px(x, "#c98d50", (X + o + 1) % 16, y + 1, 2, 1); } },
  "u": x => { px(x, "#a61b1b", 0, 0, 16, 16); px(x, "#7f1414", 0, 0, 16, 1); px(x, "#7f1414", 0, 15, 16, 1);
    px(x, "#e8c37a", 7, 3, 2, 1); px(x, "#e8c37a", 6, 4, 4, 1); px(x, "#e8c37a", 5, 5, 6, 1); px(x, "#1e3a8a", 7, 5, 2, 1); px(x, "#e8c37a", 6, 6, 4, 1); px(x, "#e8c37a", 7, 7, 2, 1);
    px(x, "#e8c37a", 1, 11, 1, 1); px(x, "#e8c37a", 14, 11, 1, 1); px(x, "#e8c37a", 3, 12, 10, 1); px(x, "#c2410c", 2, 2, 1, 1); px(x, "#c2410c", 13, 9, 1, 1); },
  "J": x => { PAINT.u(x); px(x, "rgba(0,0,0,.25)", 2, 11, 13, 3); px(x, "#6b4423", 3, 10, 1, 4); px(x, "#6b4423", 12, 10, 1, 4);
    px(x, "#8b5a2b", 2, 4, 12, 7); px(x, "#8b5a2b", 1, 5, 14, 5); px(x, "#b07a43", 3, 5, 9, 1); px(x, "#6b4423", 1, 9, 14, 1);
    px(x, "#f8fafc", 9, 3, 4, 4); px(x, "#92400e", 10, 3, 2, 1); px(x, "#f8fafc", 13, 4, 1, 2); px(x, "#e5e7eb", 10, 0, 1, 2); px(x, "#e5e7eb", 11, 1, 1, 1);
    px(x, "#1d4ed8", 4, 6, 3, 2); px(x, "#facc15", 4, 6, 3, 1); },
  "s": x => { PAINT["-"](x); px(x, "#6b4423", 2, 13, 1, 3); px(x, "#6b4423", 13, 13, 1, 3);
    px(x, "#0f766e", 0, 2, 16, 11); px(x, "#14b8a6", 0, 3, 16, 3); px(x, "#0d5f59", 0, 7, 16, 1); px(x, "#0f766e", 0, 8, 16, 4); px(x, "#0d5f59", 5, 8, 1, 4); px(x, "#0d5f59", 10, 8, 1, 4);
    px(x, "#115e59", 0, 12, 16, 1); px(x, "#facc15", 2, 4, 3, 2); },
  "v": x => { PAINT["-"](x); px(x, "#6b4423", 0, 9, 16, 5); px(x, "#8b5a2b", 0, 9, 16, 1); px(x, "#4a2e16", 7, 10, 2, 3); px(x, "#4a2e16", 1, 14, 1, 2); px(x, "#4a2e16", 14, 14, 1, 2);
    px(x, "#374151", 3, 1, 10, 8); px(x, "#9ca3af", 3, 1, 10, 1); px(x, "#38bdf8", 4, 2, 7, 6); px(x, "#facc15", 5, 4, 2, 2); px(x, "#f97316", 11, 3, 1, 1); px(x, "#f97316", 11, 5, 1, 1); },
  "b": x => { PAINT["-"](x); px(x, "#7c2d12", 1, 4, 14, 10); px(x, "#ea580c", 2, 5, 12, 8); px(x, "#fed7aa", 4, 7, 8, 4); },
  "I": x => { PAINT["-"](x); px(x, "#1f2937", 4, 13, 6, 2); px(x, "#ca8a04", 6, 4, 1, 10); px(x, "#ca8a04", 7, 3, 3, 1); px(x, "#ca8a04", 10, 3, 1, 3); px(x, "#facc15", 9, 6, 4, 3); px(x, "#fef08a", 10, 9, 2, 1); },
  "z": x => { PAINT["-"](x); px(x, "#dc2626", 2, 8, 4, 4); px(x, "#f87171", 3, 9, 1, 1); px(x, "#fca5a5", 6, 11, 3, 1);
    px(x, "#9ca3af", 10, 4, 4, 2); px(x, "#6b7280", 13, 4, 1, 1); px(x, "#f9a8d4", 14, 5, 1, 1); px(x, "#4b5563", 9, 5, 1, 1); px(x, "#a16207", 8, 13, 6, 1); px(x, "#22d3ee", 14, 12, 2, 2); },
  "a": x => { PAINT.y(x); px(x, "#94a3b8", 1, 2, 15, 12); px(x, "#f8fafc", 2, 2, 14, 11); px(x, "#7dd3fc", 4, 4, 12, 7); px(x, "#bae6fd", 5, 5, 4, 1); px(x, "#ca8a04", 2, 13, 2, 3); px(x, "#ca8a04", 2, 5, 1, 3); px(x, "#facc15", 6, 6, 2, 2); px(x, "#f97316", 8, 6, 1, 1); },
  "A": x => { PAINT.y(x); px(x, "#94a3b8", 0, 2, 15, 12); px(x, "#f8fafc", 0, 2, 14, 11); px(x, "#7dd3fc", 0, 4, 12, 7); px(x, "#bae6fd", 3, 8, 4, 1); px(x, "#ca8a04", 12, 13, 2, 3); },
  // street furniture and hedges
  "l": x => { PAINT["."](x); px(x, "#374151", 7, 3, 2, 12); px(x, "#1f2937", 5, 1, 6, 3); px(x, "#fde047", 6, 2, 4, 2); px(x, "#1f2937", 6, 14, 4, 2); },
  "m": x => { PAINT["."](x); px(x, "#b91c1c", 4, 2, 8, 13); px(x, "#ef4444", 5, 2, 3, 13); px(x, "#7f1d1d", 4, 5, 8, 1); px(x, "#1b1530", 5, 6, 6, 1); px(x, "#facc15", 7, 9, 2, 1); px(x, "#1f2937", 3, 14, 10, 2); },
  "N": x => { grass(x); px(x, "#1f6f2c", 0, 3, 16, 11); px(x, "#2f8a3a", 1, 3, 14, 7); px(x, "#4caf50", 2, 4, 3, 2); px(x, "#4caf50", 9, 5, 3, 2); px(x, "#14532d", 0, 12, 16, 2); px(x, "#ef4444", 6, 6, 1, 1); px(x, "#ef4444", 12, 8, 1, 1); },
});
const SWAY = { T: 9, E: 8, Q: 8, "*": 16, p: 10, N: 4, l: 0, I: 0 };
function swayImg(ch, v) { // trees, flowers and plants lean a pixel in the breeze
  const k = "sway" + ch + v;
  if (TILE_CACHE[k]) return TILE_CACHE[k];
  const base = tileImg(ch, 0, v), c = cv(), x = c.getContext("2d"), h = SWAY[ch];
  x.drawImage(base, 0, 0);
  if (h) { x.drawImage(base, 0, 0, 16, h, 1, 0, 16, h); x.drawImage(base, 0, 0, 1, h, 0, 0, 1, h); }
  return TILE_CACHE[k] = c;
}
function tileImg(ch, frame, v = 0) {
  const k = ch + frame + "/" + v;
  if (TILE_CACHE[k]) return TILE_CACHE[k];
  const c = cv(), x = c.getContext("2d");
  (PAINT[ch] || PAINT["."])(x, frame, v);
  return TILE_CACHE[k] = c;
}

// ---------- character sprites ----------
// People are drawn from a template and coloured from a palette; animals reuse
// the creature pixel art at small size.
const LOOKS = {
  // Sam: beanie, glasses, moustache, white tee, green jacket, chinos, white trainers
  sam:      { hair: "#4a2e16", skin: "#f1c27d", hat: "#c2410c", hat2: "#9a3412", glasses: true, tache: true,
              shirt: "#f8fafc", jacket: "#4d7c0f", jacket2: "#365314", legs: "#a8a29e", legs2: "#78716c", shoes: "#f1f5f9" },
  prof:     { hair: "#e5e7eb", skin: "#f1c27d", shirt: "#f8fafc", jacket: "#7c5a2b", jacket2: "#5b3a1e", legs: "#365314", glasses: true, tache: true, tacheCol: "#d1d5db" },
  freddie:  { hair: "#3b2414", skin: "#f1c27d", shirt: "#2563eb", shirt2: "#1d4ed8", legs: "#374151", shoes: "#f1f5f9", beard: true },
  georgina: { hair: "#3f2a14", skin: "#f1c27d", shirt: "#f59e0b", shirt2: "#d97706", legs: "#1f2937", long: true },
  chloe:    { hair: "#7c2d12", skin: "#f1c27d", shirt: "#ec4899", shirt2: "#be185d", legs: "#1f2937", long: true },
  jaz:      { hair: "#0b0b10", skin: "#e8c4a0", shirt: "#1f1b24", jacket: "#111018", jacket2: "#000000", legs: "#111018", shoes: "#3b0764", long: true, fringe: true, aura: "#a855f7" },
  inspector:{ hair: "#57534e", skin: "#e0ac69", shirt: "#f8fafc", jacket: "#7f1d1d", jacket2: "#5b1414", legs: "#1f2937", shoes: "#0b0b10", hat: "#1f2937", hat2: "#b91c1c", tache: true },
  kim:      { hair: "#78350f", skin: "#f1c27d", shirt: "#f8fafc", jacket: "#1e2a4a", jacket2: "#111a33", legs: "#111a33", shoes: "#0b0b10", police: true },
  egg:      { egghead: true, muscle: true, hair: "#5b4030", skin: "#e0a86e", shirt: "#e0a86e", shirt2: "#c48850", legs: "#1f2937", shoes: "#f1f5f9" },
  brendan:  { hair: "#7c2d12", skin: "#f1c27d", shirt: "#065f46", shirt2: "#064e3b", legs: "#1f2937", beard: true },
  davide:   { hair: "#1f2937", skin: "#d6a06b", shirt: "#7c3aed", shirt2: "#5b21b6", legs: "#374151", glasses: true },
  surfer:   { hair: "#fde047", skin: "#e0ac69", shirt: "#0f172a", jacket: "#0f172a", jacket2: "#1e293b", legs: "#0f172a", shoes: "#0f172a", long: true },
  coach:    { hair: "#1b1530", skin: "#c68642", shirt: "#111827", shirt2: "#000000", legs: "#374151", hat: "#dc2626", hat2: "#991b1b", shoes: "#f1f5f9" },
  tina:     { hair: "#facc15", skin: "#f1c27d", shirt: "#f8fafc", jacket: "#4b5563", jacket2: "#374151", legs: "#374151", long: true, glasses: true },
  npc1:     { hair: "#111827", skin: "#8d5524", shirt: "#f59e0b", shirt2: "#d97706", legs: "#1e3a8a" },
  npc2:     { hair: "#78350f", skin: "#f1c27d", shirt: "#f8fafc", jacket: "#1e3a8a", jacket2: "#172554", legs: "#1f2937" },
  npc3:     { hair: "#a3a3a3", skin: "#f1c27d", shirt: "#84cc16", shirt2: "#65a30d", legs: "#78350f", long: true },
  npc4:     { hair: "#78716c", skin: "#e0ac69", shirt: "#0f766e", shirt2: "#115e59", legs: "#365314", hat: "#365314", hat2: "#1a2e05" },
  npc5:     { hair: "#ea580c", skin: "#f1c27d", shirt: "#a855f7", shirt2: "#7e22ce", legs: "#111827", long: true, shoes: "#f472b6" },
  npc6:     { hair: "#3f3f46", skin: "#c68642", shirt: "#dc2626", shirt2: "#991b1b", legs: "#1f2937", hat: "#a16207", hat2: "#713f12", tache: true },
};
const ANIMAL_LOOKS = { frenchie: "ralph", frenchie2: "bonnie", winnie: "winnie", cow: "moochinhampton", sheep: "cotswool",
  milo: "milo", chap: "chap", lila: "lila", gerty: "gerty", oswald: "oswald", bunny: "jkrabbit", roo: "boxroo",
  catluce: "luce", catspook: "spook", catmarie: "marie", koala: "koala" };
const SPR_CACHE = {};
const LOGO = new Image(); LOGO.src = "rh-logo.png";
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
function shade(hex, f = 0.75) {
  const n = parseInt(hex.slice(1), 16), c = v => Math.max(0, Math.min(255, Math.round(v * f)));
  return "#" + [c(n >> 16), c((n >> 8) & 255), c(n & 255)].map(v => v.toString(16).padStart(2, "0")).join("");
}
function personSprite(look, dir, step, bike) {
  const k = [look, dir, step, bike].join();
  if (SPR_CACHE[k]) return SPR_CACHE[k];
  const L = LOOKS[look] || LOOKS.npc1, c = cv(), x = c.getContext("2d");
  const flip = dir === "right", d = flip ? "left" : dir;
  const lift = step % 2 === 1;
  const skin2 = shade(L.skin, 0.82), hair2 = shade(L.hair, 0.7);
  const top = L.jacket || L.shirt, top2 = L.jacket2 || L.shirt2 || shade(top), tee = L.jacket ? L.shirt : null;
  const legs2 = L.legs2 || shade(L.legs), shoes = L.shoes || "#1b1530";
  if (bike) { // the e-bike
    px(x, "#1b1530", 0, 11, 6, 5); px(x, "#9ca3af", 1, 12, 4, 3); px(x, "#e5e7eb", 2, 13, 2, 1);
    px(x, "#1b1530", 10, 11, 6, 5); px(x, "#9ca3af", 11, 12, 4, 3); px(x, "#e5e7eb", 12, 13, 2, 1);
    px(x, "#16a34a", 4, 10, 8, 2); px(x, "#22c55e", 5, 10, 4, 1); px(x, "#1b1530", 7, 12, 2, 2); px(x, "#facc15", 13, 9, 2, 1);
  }
  const by = bike ? -2 : 0, Y = n => n + by;
  // legs and shoes
  if (!bike) {
    if (d === "left") {
      px(x, L.legs, 6, 13, 2, lift ? 1 : 2); px(x, legs2, 8, 13, 2, lift ? 2 : 1);
      px(x, shoes, 5, lift ? 14 : 15, 3, 1); px(x, shoes, 8, lift ? 15 : 14, 3, 1);
    } else {
      px(x, L.legs, 5, 13, 2, lift ? 1 : 2); px(x, L.legs, 9, 13, 2, lift ? 2 : 1); px(x, legs2, 6, 13, 1, 1); px(x, legs2, 10, 13, 1, 1);
      px(x, shoes, 4, lift ? 14 : 15, 3, 1); px(x, shoes, 9, lift ? 15 : 14, 3, 1);
    }
  }
  // body
  if (d === "left") {
    px(x, top, 5, Y(8), 6, 5); px(x, top2, 9, Y(8), 2, 5); px(x, shade(top2, 0.8), 5, Y(12), 6, 1);
    if (tee) px(x, tee, 5, Y(8), 1, 3);
    const sw = lift ? 1 : 0; px(x, top2, 7 + sw, Y(9), 2, 3); px(x, L.skin, 7 + sw, Y(12), 2, 1);
  } else if (d === "up") {
    px(x, top, 4, Y(8), 8, 5); px(x, top2, 4, Y(8), 1, 5); px(x, top2, 11, Y(8), 1, 5); px(x, top2, 7, Y(9), 1, 3);
    px(x, top2, 3, Y(8), 1, 4); px(x, top2, 12, Y(8), 1, 4); px(x, L.skin, 3, Y(12), 1, 1); px(x, L.skin, 12, Y(12), 1, 1);
  } else {
    px(x, top, 4, Y(8), 8, 5); px(x, top2, 4, Y(8), 1, 5); px(x, top2, 11, Y(8), 1, 5);
    if (tee) { px(x, tee, 6, Y(8), 4, 5); px(x, shade(tee, 0.85), 6, Y(12), 4, 1); px(x, top2, 6, Y(8), 1, 5); px(x, top2, 9, Y(8), 1, 5); }
    else { px(x, shade(top, 0.85), 4, Y(12), 8, 1); px(x, L.skin, 7, Y(8), 2, 1); }
    px(x, top, 3, Y(8), 1, 4); px(x, top, 12, Y(8), 1, 4); px(x, L.skin, 3, Y(12), 1, 1); px(x, L.skin, 12, Y(12), 1, 1);
  }
  // shirtless and jacked (Coach Egg): big arms, pecs, abs
  if (L.muscle) {
    const sk2 = shade(L.skin, 0.8);
    if (d === "left") { px(x, L.skin, 6, Y(8), 4, 4); px(x, sk2, 6, Y(11), 3, 1); px(x, sk2, 9, Y(9), 1, 1); }
    else {
      px(x, L.skin, 2, Y(8), 2, 4); px(x, L.skin, 12, Y(8), 2, 4); px(x, sk2, 2, Y(10), 1, 1); px(x, sk2, 13, Y(10), 1, 1);
      if (d === "down") { px(x, sk2, 5, Y(10), 2, 1); px(x, sk2, 9, Y(10), 2, 1); px(x, sk2, 7, Y(9), 2, 1); px(x, sk2, 7, Y(11), 1, 1); px(x, sk2, 8, Y(12), 1, 1); px(x, sk2, 6, Y(12), 1, 1); px(x, sk2, 9, Y(11), 1, 1); }
      else { px(x, sk2, 7, Y(8), 2, 4); px(x, sk2, 5, Y(11), 6, 1); }
    }
  }
  // head
  px(x, L.skin, 4, Y(2), 8, 6); px(x, skin2, 4, Y(7), 8, 1);
  if (d !== "left") { px(x, L.skin, 3, Y(4), 1, 2); px(x, L.skin, 12, Y(4), 1, 2); }
  // egg-shaped head with stubble (Coach Egg)
  if (L.egghead) {
    const sk2 = shade(L.skin, 0.9), stub = "#8a6a4a";
    px(x, L.skin, 6, Y(-1), 4, 1); px(x, L.skin, 5, Y(0), 6, 1); px(x, L.skin, 4, Y(1), 8, 1);
    px(x, shade(L.skin, 1.12), 6, Y(0), 2, 1); px(x, shade(L.skin, 1.12), 5, Y(1), 1, 1); px(x, sk2, 4, Y(7), 8, 1); px(x, L.skin, 5, Y(8), 6, 1);
    for (const [X, Yy] of [[6, 0], [8, 0], [10, 1], [5, 1], [7, 1], [9, 1], [4, 2], [11, 2], [6, 2], [8, 2], [10, 2], [3, 3], [12, 3]]) px(x, stub, X, Y(Yy));
    if (d !== "up") for (const [X, Yy] of [[4, 6], [11, 6], [5, 7], [7, 7], [9, 7], [10, 7], [6, 8], [8, 8], [4, 7], [11, 7]]) px(x, stub, d === "left" ? X - 1 : X, Y(Yy));
    else for (const [X, Yy] of [[5, 4], [7, 3], [9, 4], [10, 5], [6, 5], [8, 6]]) px(x, stub, X, Y(Yy));
  } else {
  // hair
  px(x, L.hair, 4, Y(1), 8, 2); px(x, L.hair, 3, Y(2), 1, 2); px(x, L.hair, 12, Y(2), 1, 2); px(x, shade(L.hair, 1.3), 6, Y(1), 3, 1);
  if (L.long) { px(x, L.hair, 3, Y(3), 1, 6); px(x, L.hair, 12, Y(3), 1, 6); px(x, hair2, 3, Y(8), 1, 1); px(x, hair2, 12, Y(8), 1, 1); }
  if (d === "up") { px(x, L.hair, 4, Y(2), 8, 5); px(x, hair2, 4, Y(6), 8, 1); }
  else if (d === "left") { px(x, L.hair, 8, Y(2), 4, 4); px(x, hair2, 10, Y(5), 2, 1); px(x, L.skin, 3, Y(5), 1, 1); px(x, skin2, 8, Y(4), 1, 2); }
  }
  // hat (beanie): sits over the hair, with a turned-up cuff
  if (L.hat) {
    px(x, L.hat, 5, Y(0), 6, 1); px(x, L.hat, 4, Y(1), 8, 2); px(x, L.hat2, 3, Y(3), 10, 1);
    px(x, shade(L.hat, 1.2), 6, Y(1), 2, 1); for (let i = 4; i < 12; i += 2) px(x, L.hat2, i, Y(1), 1, 2);
  }
  // face
  if (d === "down") {
    if (L.glasses) { px(x, "#1b1530", 4, Y(4), 8, 1); px(x, "#1b1530", 4, Y(5), 1, 1); px(x, "#1b1530", 6, Y(5), 1, 1); px(x, "#1b1530", 9, Y(5), 1, 1); px(x, "#1b1530", 11, Y(5), 1, 1);
      px(x, "#bfdbfe", 5, Y(5), 1, 1); px(x, "#bfdbfe", 10, Y(5), 1, 1); }
    else { px(x, "#1b1530", 5, Y(4), 1, 2); px(x, "#1b1530", 10, Y(4), 1, 2); px(x, "#fff", 5, Y(4), 1, 1); px(x, "#fff", 10, Y(4), 1, 1); }
    if (L.tache) { const t = L.tacheCol || hair2; px(x, t, 5, Y(6), 6, 1); px(x, t, 4, Y(7), 1, 1); px(x, t, 11, Y(7), 1, 1); }
    else px(x, "#e07a6b", 7, Y(6), 2, 1);
    if (!L.tache) { px(x, "#f9a8a8", 4, Y(6), 1, 1); px(x, "#f9a8a8", 11, Y(6), 1, 1); }
  } else if (d === "left") {
    if (L.glasses) { px(x, "#1b1530", 3, Y(4), 4, 1); px(x, "#1b1530", 4, Y(5), 1, 1); px(x, "#1b1530", 6, Y(5), 1, 1); px(x, "#bfdbfe", 5, Y(5), 1, 1); }
    else { px(x, "#1b1530", 5, Y(4), 1, 2); }
    if (L.tache) px(x, L.tacheCol || hair2, 3, Y(6), 3, 1); else px(x, "#e07a6b", 4, Y(6), 1, 1);
  }
  if (L.beard && d !== "up") {
    const b = L.hair, b2 = hair2;
    if (d === "down") { px(x, b, 4, Y(6), 8, 2); px(x, b, 5, Y(8), 6, 1); px(x, b2, 5, Y(6), 6, 1); px(x, "#e07a6b", 7, Y(6), 2, 1); px(x, b, 3, Y(5), 1, 2); px(x, b, 12, Y(5), 1, 2); }
    else { px(x, b, 3, Y(6), 6, 2); px(x, b, 4, Y(8), 4, 1); px(x, b, 8, Y(4), 1, 3); }
  }
  if (L.fringe && d !== "up") { // emo fringe swept over one eye
    if (d === "down") { px(x, L.hair, 4, Y(2), 6, 2); px(x, L.hair, 7, Y(4), 4, 1); px(x, L.hair, 9, Y(5), 2, 1); px(x, "#a855f7", 5, Y(2), 1, 1); }
    else { px(x, L.hair, 3, Y(2), 5, 2); px(x, L.hair, 3, Y(4), 3, 1); }
  }
  if (L.police) { // custodian-style helmet with silver badge
    px(x, "#111a33", 5, Y(-1), 6, 1); px(x, "#111a33", 4, Y(0), 8, 3); px(x, "#1e2a4a", 6, Y(0), 3, 1); px(x, "#cbd5e1", 7, Y(1), 2, 2);
    px(x, "#0b0b10", 3, Y(3), 10, 1);
    if (d !== "up") { px(x, "#cbd5e1", 5, Y(9), 1, 1); px(x, "#facc15", 9, Y(10), 2, 2); }
  }
  outline(c);
  if (flip) { const f = cv(), fx = f.getContext("2d"); fx.translate(16, 0); fx.scale(-1, 1); fx.drawImage(c, 0, 0); return SPR_CACHE[k] = f; }
  return SPR_CACHE[k] = c;
}
// Tina, lying across two tiles as the party table, with cake and cups on top
function propSprite(look) {
  if (SPR_CACHE[look]) return SPR_CACHE[look];
  const c = cv(), x = c.getContext("2d"), L = LOOKS.tina;
  if (look === "tinadeadL") {
    px(x, L.hair, 0, 7, 4, 7); px(x, L.skin, 2, 8, 5, 5); px(x, "#1b1530", 3, 9, 1, 1); px(x, "#1b1530", 5, 9, 1, 1); px(x, "#1b1530", 4, 10, 1, 1); px(x, "#1b1530", 3, 11, 1, 1); px(x, "#1b1530", 5, 11, 1, 1);
    px(x, L.jacket, 7, 7, 9, 7); px(x, L.shirt, 7, 9, 9, 2);
    px(x, "#fde68a", 8, 3, 7, 4); px(x, "#f472b6", 8, 2, 7, 2); px(x, "#ef4444", 11, 0, 1, 2); px(x, "#facc15", 11, 0, 1, 1);
  } else {
    px(x, L.legs, 0, 8, 10, 5); px(x, "#1b1530", 10, 8, 3, 2); px(x, "#1b1530", 10, 11, 3, 2);
    px(x, "#f8fafc", 2, 4, 4, 4); px(x, "#92400e", 3, 4, 2, 1); px(x, "#f8fafc", 7, 4, 4, 4); px(x, "#d97706", 8, 4, 2, 1); px(x, "#e5e7eb", 3, 1, 1, 2); px(x, "#e5e7eb", 8, 1, 1, 2);
  }
  outline(c);
  return SPR_CACHE[look] = c;
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
// a party critter shrunk to fit one tile (big evolutions keep their shape)
function followerSprite(sp, step) {
  const k = "f:" + sp + (step & 1);
  if (IMG_CACHE[k]) return IMG_CACHE[k];
  const c = cv(), x = c.getContext("2d");
  const img = new Image();
  img.onload = () => {
    x.imageSmoothingEnabled = false;
    const s = Math.min(14 / img.width, 14 / img.height), w = Math.max(1, Math.round(img.width * s)), h = Math.max(1, Math.round(img.height * s));
    x.drawImage(img, Math.round((16 - w) / 2), 16 - h - (step & 1), w, h);
  };
  img.src = P().pixURL(sp);
  return IMG_CACHE[k] = c;
}
function charSprite(look, dir, step, bike) { return look.startsWith("tinadead") ? propSprite(look) : ANIMAL_LOOKS[look] ? animalSprite(look, step) : personSprite(look, dir, step, bike); }

// ---------- state ----------
let active = false, canvas = null, ctx = null, raf = 0;
let map = null, mapId = null;
let fol = null;                // lead critter trotting one tile behind Sam
let pl = null;                 // { x, y, dir, fx, fy, moving, t0, dur, step }
let npcs = [];
let view = { camX: 0, camY: 0, offX: 0, offY: 0 };
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
  if (id === "stroud") { st.flags = st.flags || {}; st.flags.stroud = true; }
  pl = { x, y, dir: st.world.dir, fx: x, fy: y, moving: false, step: 0 };
  fol = { x, y, sx: x, sy: y, fx: x, fy: y, dir: "left", step: 0 };
  npcs = (map.npcs || []).map(n => ({ ...n, ox: n.x, oy: n.y, fx: n.x, fy: n.y, step: 0, visible: !(n.until && flag(n.until)) && !(n.after && !flag(n.after)), homeDir: n.dir, brewDir: n.dir, wanderT: Math.random() * 3000 }));
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
  canvas.addEventListener("click", tapToWalk);
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
let last = 0, waterT = 0, swayT = 0, sway = 0, tick = 0;
function loop(now) {
  if (!active) return;
  const dt = Math.min(50, now - last); last = now;
  waterT += dt; if (waterT > 300) { waterT = 0; frame = (frame + 1) & 3; }
  swayT += dt; if (swayT > 650) { swayT = 0; sway ^= 1; tick++; }
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
    fol.fx = fol.sx + (fol.x - fol.sx) * p; fol.fy = fol.sy + (fol.y - fol.sy) * p;
    if (p >= 1) { pl.moving = false; pl.fx = pl.x; pl.fy = pl.y; fol.fx = fol.x; fol.fy = fol.y; arrived(); }
  } else if (!busy && window.HELD && window.HELD.dir) {
    pl.path = null;
    tryStep(window.HELD.dir, now);
  } else if (busy) {
    pl.path = null;
  } else if (pl.path) {
    if (pl.path.length) {
      const [nx, ny] = pl.path.shift(), dir = dirOf(nx - pl.x, ny - pl.y);
      if (Math.abs(nx - pl.x) + Math.abs(ny - pl.y) !== 1) pl.path = null;
      else { tryStep(dir, now); if (!pl.moving) pl.path = null; }
    } else {
      const face = pl.face; pl.path = null; pl.face = null;
      if (face) { pl.dir = face; interact(); }
    }
  }
  // npc wander + movement
  for (const n of npcs) {
    if (!n.visible) continue;
    if (n.moving) {
      const p = Math.min(1, (now - n.t0) / 260);
      n.fx = n.sx + (n.x - n.sx) * p; n.fy = n.sy + (n.y - n.sy) * p;
      if (p >= 1) { n.moving = false; n.fx = n.x; n.fy = n.y; if (n.onArrive) { const f = n.onArrive; n.onArrive = null; f(); } }
    } else if (n.brew) { if (!busy && n.dir !== n.brewDir) { n.lookT = (n.lookT || 1500) - dt; if (n.lookT <= 0) { n.lookT = 0; n.dir = n.brewDir; } } // back to work
    } else if (!n.wander && !n.trainer && !busy && !n.alert && !ANIMAL_LOOKS[n.look] && n.look !== "prof") {
      n.lookT = (n.lookT || 2000 + Math.random() * 4000) - dt;
      if (n.lookT <= 0) { n.lookT = 2500 + Math.random() * 4000; n.dir = n.homeDir && Math.random() < 0.6 ? n.homeDir : ["left", "right", "down"][Math.floor(Math.random() * 3)]; n.homeDir = n.homeDir || n.dir; }
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
  fol.sx = fol.x; fol.sy = fol.y; fol.x = pl.x; fol.y = pl.y; fol.step++;
  if (fol.x !== fol.sx) fol.dir = fol.x > fol.sx ? "right" : "left";
  pl.sx = pl.x; pl.sy = pl.y; pl.x = nx; pl.y = ny; pl.t0 = now; pl.dur = speed(); pl.moving = true; pl.step++;
}

async function arrived() {
  const st = S();
  st.world = { map: mapId, x: pl.x, y: pl.y, dir: pl.dir };
  const key = pl.x + "," + pl.y;
  // train station doors
  if (map.trains && map.trains[key]) {
    const dest = map.trains[key];
    const v = await showMenu(`Take the train to ${PLACES[dest].label}? (Single: £3.40)`, [{ label: "Buy a ticket", value: 1 }, { label: "Sneak on (no ticket)", value: 2 }, { label: "No thanks", value: 0 }]);
    if (v === 2) {
      await showText(["Sam hops on without a ticket. It's his birthday, he's living dangerously.", "...Uh oh. A ticket inspector just got on at the other end!"], { keepBusy: true });
      unmount();
      const res = await window.MINIGAMES.inspector();
      WORLD.resume();
      busy = true;
      await travel(dest, null, true);
      await showText(res === "hid" ? ["You hid in the toilet until " + PLACES[dest].label + ". The inspector never knew.", "Free ride! (Please buy a ticket next time, Sam.)"]
        : ["Inspector: No ticket? That's a £20 penalty fare, sir.", "Sam: ...It's my birthday?", "Inspector: ...Go on then. Happy birthday. Don't do it again.", "🚆 Next stop: " + PLACES[dest].label + "."]);
      st.flags.train_dodge = st.flags.train_dodge || res === "hid";
      return;
    }
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
// ---------- tap to walk ----------
// Tap a tile to walk there. Tap a person, sign or thing to walk up to it and talk/look.
function tapToWalk(e) {
  if (!active || busy || menuState || boxQueue) return;
  const r = canvas.getBoundingClientRect(), cw = canvas.width, ch = canvas.height;
  const sc = Math.min(r.width / cw, r.height / ch), ox = (r.width - cw * sc) / 2, oy = (r.height - ch * sc) / 2;
  const px = (e.clientX - r.left - ox) / sc, py = (e.clientY - r.top - oy) / sc;
  if (px < 0 || py < 0 || px >= cw || py >= ch) return;
  const tx = Math.floor((px + view.camX - view.offX) / TS), ty = Math.floor((py + view.camY - view.offY) / TS);
  if (tileAt(tx, ty) === undefined) return;
  if (tx === pl.x && ty === pl.y) return;
  const things = map.things || {};
  const target = npcAt(tx, ty) || things[tx + "," + ty] || blocked(tx, ty);
  let goals;
  if (!target) goals = [[tx, ty, null]];
  else {
    // stand next to it (or across a counter from it) and face it
    goals = [];
    for (const d of Object.keys(DIRS)) {
      const [dx, dy] = DIRS[d], face = dirOf(-dx, -dy);
      goals.push([tx + dx, ty + dy, face]);
      if ("7890C".includes(tileAt(tx + dx, ty + dy) || ".")) goals.push([tx + 2 * dx, ty + 2 * dy, face]);
    }
  }
  const path = findPath(goals);
  if (!path) { P().beep(110, .05, "square", .03); return; }
  pl.path = path.steps; pl.face = path.face;
  P().beep(660, .03);
}
function findPath(goals) {
  const key = (x, y) => x + "," + y, want = new Map(goals.map(g => [key(g[0], g[1]), g[2]]));
  if (want.has(key(pl.x, pl.y))) return { steps: [], face: want.get(key(pl.x, pl.y)) };
  const prev = new Map([[key(pl.x, pl.y), null]]), q = [[pl.x, pl.y]];
  let n = 0;
  while (q.length && n++ < 4000) {
    const [x, y] = q.shift();
    for (const [dx, dy] of Object.values(DIRS)) {
      const nx = x + dx, ny = y + dy, k = key(nx, ny);
      if (prev.has(k) || blocked(nx, ny) || lockedAt(nx, ny)) continue;
      prev.set(k, [x, y]);
      if (want.has(k)) {
        const steps = []; let c = [nx, ny];
        while (c && !(c[0] === pl.x && c[1] === pl.y)) { steps.unshift(c); c = prev.get(key(c[0], c[1])); }
        return { steps, face: want.get(k) };
      }
      q.push([nx, ny]);
    }
  }
  return null;
}

async function interact() {
  const [dx, dy] = DIRS[pl.dir], tx = pl.x + dx, ty = pl.y + dy, key = tx + "," + ty;
  const n = npcAt(tx, ty) || ("7890C".includes(tileAt(tx, ty)) ? npcAt(tx + dx, ty + dy) : null); // talk across the bar
  if (n) {
    n.dir = dirOf(-dx, -dy);
    if (n.trainer && !flag(n.trainer.flag)) return trainerBattle(n);
    if (n.trainer) return showText(n.trainer.after);
    if (n.event === "boar" && !S().caught.severnboar) return boarEvent(flag("boarSeen"));
    await showText(n.text);
    if (n.heal) { P().healAll(); P().sfx.heal(); }
    return;
  }
  if (map.van === key) return vanMenu();
  const th = map.things && map.things[key];
  if (th && th.cake) {
    if (!flag("letter")) return showText(["The birthday cake! You'd better blow out the candles... wait, what was that noise in the hallway?"]);
    return showText(flag("finished") ? ["The cake. What's left of it. Delicious. Happy birthday, Mr Chicken!"] : CONFIG.cakeLocked);
  }
  if (th && th.critters) {
    await showText(th.text, { keepBusy: true });
    const st = S(), lvl = Math.max(8, Math.min(18, ...st.team.map(m => m.level)));
    const sp = th.critters[Math.floor(Math.random() * th.critters.length)];
    flash(() => { unmount(); P().startBattle({ wild: true, team: [P().makeMon(sp, lvl - 1 + Math.floor(Math.random() * 3))] }); });
    return;
  }
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
  if (!items.length) return showText(["Sam's van. Spotless inside. Not one cat hair. Somehow.", "It's packed with camping gear: a tent, a stove, two folding chairs and a bag of 400 tent pegs.", "Explore further and the van can take you back to places you've been."]);
  items.push({ label: "Stay here", value: null });
  const v = await showMenu("🚐 Spotless van, rammed with camping gear. Where to?", items);
  if (v) await travel(v, pick(["Sam parks the van perfectly. Not a cat hair in sight.", "The camping stove rattles the whole way. Worth it.", "Sam arrives. The folding chairs did not survive the hill."]));
}

async function winnieJoins() {
  const st = S();
  await showText(CONFIG.winnieJoins, { keepBusy: true });
  const lvl = Math.max(5, ...st.team.map(m => m.level));
  const w = P().makeMon("winnie", lvl);
  st.flags.winnie = true; st.seen.winnie = st.caught.winnie = true;
  if (st.team.length < 6) st.team.push(w); else st.box.push(w);
  P().sfx.catch();
  for (const m of npcs) if (m.look === "winnie") m.visible = false;
  await showText([`Winnie joined your team at level ${lvl}!`, "Winnie is so excited she's... she's..."], { keepBusy: true });
  unmount();
  await P().evolve(w, "winnieeee");
  P().save();
  WORLD.resume();
}

// The ending: everyone round at the bungalow, cake and tea, Tina as the coffee table.
async function party() {
  loadMap("bungalow", 8, 6, "down");
  const add = (id, x, y, look, dir) => npcs.push({ id, x, y, ox: x, oy: y, fx: x, fy: y, look, dir, step: 0, visible: true, text: [] });
  npcs = npcs.filter(n => !["c1", "c2", "c3"].includes(n.id));
  add("tina1", 8, 8, "tinadeadL", "down"); add("tina2", 9, 8, "tinadeadR", "down");
  add("chloe", 7, 7, "chloe", "right"); add("winnie", 7, 6, "winnie", "down");
  add("jaz", 10, 7, "jaz", "left"); add("kim", 10, 8, "kim", "left");
  add("freddie", 7, 9, "freddie", "up"); add("georgina", 8, 9, "georgina", "up");
  add("ralph", 6, 10, "frenchie", "up"); add("bonnie", 10, 10, "frenchie2", "up");
  add("c1", 6, 8, "catluce", "right"); add("c2", 9, 9, "catspook", "left"); add("c3", 10, 9, "catmarie", "left");
  npcs.find(n => n.id === "c2").playfight = npcs.find(n => n.id === "c3").playfight = true;
  mount();
  P().music("birthday");
  await showText(CONFIG.party, { keepBusy: true });
  busy = false;
  unmount();
  P().endingScreen();
}

async function startMenu() {
  const st = S();
  const items = [
    { label: "Team", value: "team" },
    { label: "Box", value: "box" },
    { label: CONFIG.dexName, value: "dex" },
    { label: "Journal", value: "journal" },
    { label: "Map", value: "map" },
    ...(!map.indoor ? [{ label: st.bike ? "Get off the e-bike" : "Ride the e-bike", value: "bike" }] : []),
    { label: "Difficulty: " + (P().DIFFS[st.difficulty || "normal"] || P().DIFFS.normal).name, value: "diff" },
    { label: "Save", value: "save" },
    { label: P().isMuted() ? "Sound: off" : "Sound: on", value: "sound" },
    { label: "Close", value: null },
  ];
  const v = await showMenu(null, items);
  if (v === "team") { unmount(); P().teamScreen(); }
  else if (v === "box") { unmount(); P().boxScreen(); }
  else if (v === "dex") { unmount(); P().dexScreen(); }
  else if (v === "journal") { unmount(); P().journalScreen(); }
  else if (v === "map") { unmount(); P().mapScreen(); }
  else if (v === "bike") { st.bike = !st.bike; P().save(); P().beep(st.bike ? 880 : 440, .08); if (st.bike) P().music("bike"); else P().music(map.music); }
  else if (v === "diff") {
    const ds = P().unlockedDiffs();
    if (ds.length < 2) { await showText(["This first run is on Easy.", "Finish the game to win the Easy trophy and unlock Normal mode!"]); return; }
    const d = await showMenu("Pick a difficulty", [...ds.map(d => ({ label: P().DIFFS[d].name + " (" + P().DIFFS[d].blurb + ")", value: d })), { label: "Cancel", value: null }]);
    if (d && d !== st.difficulty) {
      const was = st.diffFloor;
      P().setDifficulty(d);
      await showText([`Difficulty set to ${P().DIFFS[d].name}.`, ...(st.diffFloor !== was ? [`(This run will now earn the ${P().DIFFS[st.diffFloor].name} trophy.)`] : [])]);
    }
  }
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
  if (T.wallballs) {
    const v = await showMenu("Egg: So what'll it be?", [{ label: "50 wall balls", value: "wb" }, { label: "Fight Egg", value: "fight" }]);
    if (v === "wb") {
      unmount();
      const res = await window.MINIGAMES.wallBalls();
      WORLD.resume(); busy = true;
      if (res.win) {
        const st = S(); st.flags[T.flag] = true;
        const lvl = Math.max(10, ...st.team.map(m => m.level));
        const prize = P().makeMon(T.wallballs, lvl);
        st.seen[T.wallballs] = st.caught[T.wallballs] = true;
        if (st.team.length < 6) st.team.push(prize); else st.box.push(prize);
        P().sfx.catch(); P().save();
        await showText([`Egg: ${res.reps} WALL BALLS in ${Math.floor(res.secs / 60)}:${String(res.secs % 60).padStart(2, "0")}! Mr Chicken, I'm... I'm welling up.`,
          `Egg: You've earned this. Take my ${SPECIES[T.wallballs].name}. It's been waiting for someone who suffers like you.`,
          `${SPECIES[T.wallballs].name} joined your team at level ${lvl}!`, "Sam lies on the floor for a while. A long while."]);
        return;
      }
      await showText([`Egg: ${res.reps} reps? That's a no-rep life, Sam.`, "Egg: Right. You'll have to go through me then!"], { keepBusy: true });
    }
  }
  unmount();
  P().startBattle({ wild: false, trainer: T, look: n.look, team: T.team.map(([sp, l]) => P().makeMon(sp, l)) });
}
async function boarEvent(again) {
  await showText(again ? ["Surfer Sian: Missed it? No stress. Big spring tides come in pairs.", "Surfer Sian: Here comes the next one..."] : ["Surfer Sian: Alright, Mr Chicken! Happy birthday!", "Surfer Sian: The tide tables say a FIVE-STAR Severn Bore is due right about... now.",
    "Surfer Sian: Listen!"], { keepBusy: true });
  P().beep(110, .5, "sawtooth", .06); setTimeout(() => P().beep(98, .6, "sawtooth", .06), 300);
  await showText(["A low roar rolls up the River Severn...", "A huge wave surges UPSTREAM! And riding it is...", "...a BOAR?!"], { keepBusy: true });
  if (!P().alive().length) { busy = false; return; }
  S().flags.boarSeen = true; P().save();
  wildBattle([["severnboar", 20, 20]]);
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
  view = { camX, camY, offX, offY };
  ctx.fillStyle = "#1b1530"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const x0 = Math.floor(camX / TS), y0 = Math.floor(camY / TS);
  for (let y = y0; y <= y0 + VH; y++) for (let x = x0; x <= x0 + VW; x++) {
    const t = tileAt(x, y); if (t === undefined) continue;
    const v = (t === "." || t === "=" || t === "O") ? ((x * 7 + y * 13 + ((x * y) >> 1)) & 3) : 0;
    const img = (SWAY[t] && ((sway + x + (y >> 1)) & 1)) ? swayImg(t, v)
      : tileImg(t, (t === "~" || t === "B") ? ((frame + x + y) & 3) : (t === "8" || t === "9" || t === "0" || t === "$") ? frame : (t === "r" || t === "," || t === "e") ? ((frame >> 1) + x) & 1 : 0, v);
    ctx.drawImage(img, x * TS - camX + offX, y * TS - camY + offY);
  }
  // painted shop signs
  ctx.imageSmoothingEnabled = true;
  for (const sg of map.signs || []) { if (!LOGO.complete || !LOGO.naturalWidth) break;
    ctx.drawImage(LOGO, Math.round(sg.x * TS - camX + offX), Math.round(sg.y * TS - camY + offY), Math.round(sg.w * TS), Math.round(sg.w * TS * LOGO.naturalHeight / LOGO.naturalWidth)); }
  ctx.imageSmoothingEnabled = false;
  // characters, sorted by y
  const list = npcs.filter(n => n.visible).map((n, i) => ({ img: charSprite(n.look, n.dir, n.moving ? n.step : (ANIMAL_LOOKS[n.look] ? (tick + i) & 1 : 0)), x: n.fx + (n.playfight ? ((frame & 1) ? 0.08 : -0.08) * (i % 2 ? 1 : -1) : 0), y: n.fy - (n.playfight && (frame & 2) ? 0.1 : 0), alert: n.alert,
    aura: (LOOKS[n.look] || {}).aura, brew: n.dir === (n.brewDir || "up") && n.brew,
    bob: !n.moving && !ANIMAL_LOOKS[n.look] && ((tick + i) % 3 === 0) ? 1 : 0 }));
  const st = S();
  const bike = st.bike && !map.indoor;
  list.push({ img: charSprite("sam", pl.dir, pl.moving ? pl.step : 0, bike), x: pl.fx, y: pl.fy, me: true });
  // your lead critter follows on foot (not when you're on the e-bike, and only once it has somewhere to stand)
  const lead = st.team && st.team.find(m => m.hp > 0);
  if (lead && !bike && fol && !(fol.x === pl.x && fol.y === pl.y))
    list.push({ img: followerSprite(lead.sp, pl.moving ? fol.step : (tick >> 1)), x: fol.fx, y: fol.fy - 0.05, flip: fol.dir === "right" });
  list.sort((a, b) => a.y - b.y);
  for (const c of list) {
    const X = Math.round(c.x * TS - camX + offX), Y = Math.round(c.y * TS - camY + offY) - 3;
    ctx.fillStyle = "rgba(27,21,48,.25)"; ctx.fillRect(X + 3, Y + 16, 10, 2);
    if (c.aura) { ctx.fillStyle = c.aura; for (let i = 0; i < 5; i++) { const a = (frame * 0.8 + i * 1.26), r = 9; ctx.globalAlpha = 0.7; ctx.fillRect(Math.round(X + 7 + Math.cos(a) * r), Math.round(Y + 8 + Math.sin(a) * r * 0.8), 2, 2); } ctx.globalAlpha = 1; }
    if (c.bob) { ctx.drawImage(c.img, 0, 0, 16, 9, X, Y + 1, 16, 9); ctx.drawImage(c.img, 0, 9, 16, 7, X, Y + 9, 16, 7); } // a little breath
    else if (c.flip) { ctx.save(); ctx.translate(X + 16, Y); ctx.scale(-1, 1); ctx.drawImage(c.img, 0, 0); ctx.restore(); }
    else ctx.drawImage(c.img, X, Y);
    if (c.brew) baristaProp(c.brew, X, Y);
    if (c.alert) { ctx.fillStyle = "#fff"; ctx.fillRect(X + 5, Y - 12, 6, 10); ctx.fillStyle = "#ef4444"; ctx.fillRect(X + 7, Y - 11, 2, 5); ctx.fillRect(X + 7, Y - 5, 2, 2); }
  }
  // tall grass covers your feet
  const under = tileAt(pl.x, pl.y);
  if ((under === "," || under === "e") && !pl.moving) {
    const X = Math.round(pl.fx * TS - camX + offX), Y = Math.round(pl.fy * TS - camY + offY);
    ctx.drawImage(tileImg(under, frame), 0, 10, 16, 6, X, Y + 10, 16, 6);
  }
}

// baristas at work: one pulls shots, one steams milk and pours flat whites (back to us, arms up at the machine)
function baristaProp(kind, X, Y) {
  const p = (c, a, b, w = 1, h = 1) => { ctx.fillStyle = c; ctx.fillRect(X + a, Y + b, w, h); };
  const t = (frame + (kind === "milk" ? 2 : 0)) & 3;
  if (kind === "shot") {
    // grind, tamp, lock in the portafilter, hand over the espresso
    if (t === 0) { p("#374151", 4, 10, 4, 2); p("#111827", 2, 10, 2, 1); p("#6f3a17", 5, 9, 2, 1); }
    else if (t === 1) { p("#374151", 6, 11, 4, 2); p("#9ca3af", 7, 8, 2, 3); }
    else { p("#f8fafc", 10, 10, 3, 3); p(t === 3 ? "#c08040" : "#6f3a17", 11, 10, 1, 1); p("#f8fafc", 12, 7 - (frame & 1), 1, 1); }
  } else {
    // steam the milk (jug with puffs), then pour a little heart into a flat white
    if (t < 2) { p("#cbd5e1", 9, 9, 3, 4); p("#9ca3af", 8, 10, 1, 2); p("#f8fafc", 10, 6 - t, 2, 1); p("#e5e7eb", 11, 4 - t, 1, 1); }
    else { p("#cbd5e1", 8, 9, 3, 3); p("#f8fafc", 6, 11, 1, 1); p("#f8fafc", 3, 11, 4, 3); p("#c08040", 4, 11, 2, 1); if (t === 3) { p("#fff", 4, 12, 1, 1); p("#fff", 5, 12, 1, 1); } }
  }
}

// ---------- entry points used by game.js ----------
const WORLD = {
  key,
  debug: () => ({ pl, view, TS }),
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
      await showText([`${P().heroName()} legged it home to the sofa and had a lie down.`, "Your team is fully rested."]);
      if (!st.flags.healtip) { st.flags.healtip = true; delete st.flags.healtipDue; P().save(); await showText(CONFIG.healTip); }
      return;
    }
    WORLD.resume();
    if (result === "win" && trainer) {
      const n = npcs.find(n => n.trainer && n.trainer.flag === trainer.flag);
      if (n) busy = true;
      if (trainer.reward) await showText([`You got ${trainer.reward} ${CONFIG.ballName}s!`]);
      // NPCs that were waiting on this flag step aside
      for (const m of npcs) if (m.until === trainer.flag) m.visible = false;
      for (const m of npcs) if (m.after === trainer.flag) m.visible = true;
      if (trainer.flag === "beat_chloe" && !flag("winnie")) await winnieJoins();
    }
    if (st.flags.healtipDue && !st.flags.healtip) { st.flags.healtip = true; delete st.flags.healtipDue; P().save(); await showText(CONFIG.healTip); }
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
  party,
  npcSpots: () => npcs.filter(n => n.visible !== false).map(n => n.x + "," + n.y),
};
window.WORLD = WORLD;
})();
