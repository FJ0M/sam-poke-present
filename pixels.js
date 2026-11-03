// ============================================================
//  PIXEL ART — hand-drawn 16x16 sprites for Sam's cats, the
//  dogs and Mr Chicken. Every other creature is auto-pixelated
//  from its emoji by game.js.
//  Each grid is 16 strings of 16 chars; "." is transparent and
//  every other char is looked up in the palette.
// ============================================================

const PAL_BASE = { o: "#1b1530", e: "#ffffff", k: "#1b1530", n: "#f472b6", r: "#ef4444", y: "#facc15", t: "#fb7185", w: "#ffffff" };

// Sitting cat, front on. P = left patch, Q = right patch, b = fur, i = inner ear, m = muzzle
const CAT = [
  "................",
  "................",
  ".oo..........oo.",
  ".oio........oio.",
  ".oiio......oiio.",
  ".oPPPooooooQQQo.",
  "oPPPPbbbbbbQQQQo",
  "oPPbbbbbbbbbbQQo",
  "obbekbbbbbbekbbo",
  "obbkkbbbbbbkkbbo",
  "obbbbbmnnmbbbbbo",
  ".obbbmmmmmmbbbo.",
  "..oobbbbbbbboo..",
  ".obPbbbbbbbbQbo.",
  ".obmmbbbbbbmmbo.",
  "..oooooooooooo..",
];
// stage 2: sweatband (ultra / CrossFit ready)
const CAT_BAND = [
  "", "", "", "", "", "",
  ".rrrrrrrrrrrrrr.",
];
// stage 3: crown and a sparkle
const CAT_CROWN = [
  "y...............",
  "................",
  ".....y.yy.y.....",
  ".....yyyyyy.....",
  ".....yryyry.....",
  "", "",
];
const CAT_COATS = {
  bw:     { b: "#f8f5ef", P: "#24212b", Q: "#24212b", i: "#f9a8d4", m: "#ffffff", e: "#7dd3fc" },
  black:  { b: "#2a2633", P: "#2a2633", Q: "#2a2633", i: "#6b5a7a", m: "#3b3547", e: "#facc15", o: "#0b0814", n: "#f9a8d4" },
  calico: { b: "#fbf3e4", P: "#e07b24", Q: "#2a2633", i: "#f9a8d4", m: "#ffffff", e: "#84cc16" },
};
function overlay(grid, ...layers) {
  const g = grid.map(r => r.split(""));
  for (const layer of layers) layer.forEach((row, y) => [...row].forEach((c, x) => { if (c !== ".") g[y][x] = c; }));
  return g.map(r => r.join(""));
}
function catPixels(coat, stage) {
  const layers = [];
  if (stage >= 2) layers.push(CAT_BAND);
  if (stage >= 3) layers.push(CAT_CROWN);
  return { grid: overlay(CAT, ...layers), pal: { ...PAL_BASE, ...CAT_COATS[coat] }, scale: [0.72, 0.86, 1][stage - 1] };
}

// Jack Russell with floppy ears: E = ears, b = coat, m = muzzle, w = paws
const DOG = [
  "................",
  "................",
  "..ooo......ooo..",
  ".oEEEo....oEEEo.",
  ".oEEEooooooEEEo.",
  ".oEEbbbbbbbbEEo.",
  "..oEbbbbbbbbEo..",
  "..obekbbbbekbo..",
  "..obkkbbbbkkbo..",
  "..obbbmmmmbbbo..",
  "..obbmmnnmmbbo..",
  "...obmmttmmbo...",
  "...obbbbbbbbo...",
  "..obbbbbbbbbbo..",
  "..obwwbbbbwwbo..",
  "...oooooooooo...",
];
// Winnie (from Freddie's photo): ginger Jack Russell cross, huge pink-lined ears, dark muzzle, white chest and paws
const WINNIE = [
  "..oo........oo..",
  ".obio......oibo.",
  ".obiio....oiibo.",
  ".obiiio..oiiibo.",
  "..obbbbbbbbbbo..",
  "..obdbbbbbbdbo..",
  "..obekbbbbkebo..",
  "..obkkbbbbkkbo..",
  "..obbbmmmmbbbo..",
  "...obmmnnmmbo...",
  "...obmmttmmbo...",
  "....occcccco....",
  "...obccccccbo...",
  "..obbccccccbbo..",
  "..obwbccccbwbo..",
  "...oooooooooo...",
];
// French bulldog: big upright bat ears, squashed face, jowls
const FRENCHIE = [
  "..oo........oo..",
  ".ohio......oiho.",
  ".ohiio....oiiho.",
  ".ohhhoooooohhho.",
  "..ohhphhhhphho..",
  ".ohhekhhhhkehho.",
  ".ohhkkhhhhkkhho.",
  ".ohpphmnnmhppho.",
  ".ohpmmmmmmmmpho.",
  "..ohhmmttmmhho..",
  "...occcccccco...",
  "..obccccccccbo..",
  ".obbccccccccbbo.",
  ".obbsccccccsbbo.",
  ".obwbwccccwbwbo.",
  "..oooooooooooo..",
];
// Mr Chicken, in his running headband
const CHICKEN = [
  "................",
  "......rr.r......",
  ".....rrrrr......",
  "....oooooo......",
  "...obbbbbbo.....",
  "...owwwwwwo.....",
  "..yyowkwwwo.....",
  "...yowwwwwwo....",
  "....orwwwwwwoo..",
  "....owwwwwwwwwo.",
  "...owwwwwwwwwwo.",
  "...owwwwwwwwwwo.",
  "....owwwwwwwwo..",
  ".....oooooooo...",
  "......y...y.....",
  ".....yy..yy.....",
];

const HAND_PIXELS = {
  luce:   () => catPixels("bw", 1),     lucy:   () => catPixels("bw", 2),     lucius:     () => catPixels("bw", 3),
  spook:  () => catPixels("black", 1),  spooks: () => catPixels("black", 2),  spookus:    () => catPixels("black", 3),
  marie:  () => catPixels("calico", 1), marigold: () => catPixels("calico", 2), marigoldus: () => catPixels("calico", 3),
  winnie: () => ({ grid: WINNIE, pal: { ...PAL_BASE, b: "#c27a3a", i: "#f4a6a6", d: "#7a4a22", m: "#3b2418", n: "#1b1530", c: "#fbf7f0", w: "#fbf7f0", e: "#ffffff", k: "#2a1a10", t: "#fb7185" }, scale: 0.85 }),
  // from Freddie's photo: Ralph is black and tan with a white chest, Bonnie is blue-grey and tan with a white body
  ralph:  () => ({ grid: FRENCHIE, pal: { ...PAL_BASE, h: "#1f1a1c", i: "#b9a6a0", p: "#c99a62", m: "#4a4244", n: "#111", b: "#1f1a1c", c: "#f4f1ec", s: "#c99a62", w: "#f4f1ec", t: "#fb7185" }, scale: 0.9 }),
  bonnie: () => ({ grid: FRENCHIE, pal: { ...PAL_BASE, h: "#6d6570", i: "#c4b3b8", p: "#c99a62", m: "#544c57", n: "#2a2428", b: "#f4f1ec", c: "#f4f1ec", s: "#6d6570", w: "#f4f1ec", t: "#fb7185" }, scale: 0.85 }),
  mrchicken: () => ({ grid: CHICKEN, pal: { ...PAL_BASE, b: "#3b82f6" } }),
};
const HERO_PIXELS = HAND_PIXELS.mrchicken;
