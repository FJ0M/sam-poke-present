// ============================================================
//  PIXEL ART — hand-drawn sprites for Sam's cats, the dogs,
//  the pets and Mr Chicken. Every other critter is
//  auto-pixelated from its emoji by game.js.
//  Grids are rows of chars; "." is transparent and every other
//  char is looked up in the palette. All animals face LEFT
//  (the player's side flips them to face right).
//  Each sprite has frames: [idle, idle 2 (tail/breath), attack].
//  Basic forms are 16x16 (they also walk around the overworld);
//  evolutions grow to 20x20 and 24x24, and get scarier.
// ============================================================

const PAL_BASE = { o: "#1b1530", e: "#ffffff", k: "#1b1530", n: "#f472b6", r: "#ef4444", y: "#facc15", t: "#fb7185", w: "#ffffff", f: "#f8fafc", m: "#7f1d1d" };

// ---------- grid helpers ----------
function overlay(grid, ...layers) {
  const g = grid.map(r => r.split(""));
  for (const layer of layers) layer.forEach((row, y) => [...row].forEach((c, x) => { if (c !== "." && g[y] && x < g[y].length) g[y][x] = c; }));
  return g.map(r => r.join(""));
}
function pad(grid, W, H, ox, oy) { // place grid on a bigger canvas
  const out = Array.from({ length: H }, () => ".".repeat(W).split(""));
  grid.forEach((row, y) => [...row].forEach((c, x) => { if (c !== "." && out[y + oy] && x + ox < W) out[y + oy][x + ox] = c; }));
  return out.map(r => r.join(""));
}
function patch(grid, rows) { const g = grid.slice(); for (const k in rows) g[k] = rows[k]; return g; }
function shift(grid, dx, dy, fromRow = 0, toRow = grid.length - 1, maxX = 99) { // move a band of pixels
  const W = grid[0].length, H = grid.length, src = grid.map(r => r.split("")), out = grid.map(r => r.split(""));
  for (let y = fromRow; y <= toRow; y++) for (let x = 0; x < Math.min(W, maxX); x++) out[y][x] = ".";
  for (let y = fromRow; y <= toRow; y++) for (let x = 0; x < Math.min(W, maxX); x++) {
    const c = src[y][x]; if (c === ".") continue; const nx = x + dx, ny = y + dy;
    if (nx >= 0 && nx < W && ny >= 0 && ny < H) out[ny][nx] = c; }
  return out.map(r => r.join(""));
}
// attack pose: whole body lunges forward, front legs reach out, eyes flash red
function attackPose(grid, legRows = 3) {
  const H = grid.length, W = grid[0].length;
  let g = shift(grid, -1, -1);
  g = shift(g, -1, 0, H - legRows - 1, H - 1, Math.floor(W / 2));
  return g.map(r => r.replace(/e/g, "r"));
}

// ---------- CATS ----------
// Basic cat, standing, head turned to us. b fur, B markings, c chin/muzzle, w legs, i ears, e eyes, n nose, T tail tip
const CAT = [
  "................",
  "................",
  ".o....o.........",
  "oio..oio......o.",
  "oiiooiio.....oTo",
  "obbbbbbbo....obo",
  "obekbbekbo...obo",
  "obkkbbkkbo..obo.",
  "occbnnbccboobbo.",
  ".occmmccbbbbbbo.",
  "..occccbBbBbbbo.",
  "..obcbbbBbBbbbo.",
  "..obbbbbbbbbbbo.",
  "..owwoooooowwo..",
  "..owwo....owwo..",
  "..oooo....oooo..",
];
const CAT_TAIL2 = { 2: ".o....o.........", 3: "oio..oio........", 4: "oiiooiio......o.", 5: "obbbbbbbo....oTo", 6: "obekbbekbo...obo" };
// Lucy's fluff: tufty cheeks, chest ruff and a bushy tail
const FLUFF = ["", "", "", "", "", "", "", "", "b.........", "bc.......", ".b.........", "", "", "", "", ""];

// Evolution 2 (20x20): crouched to pounce, raised hackles, angry brows, fangs and claws out
const CAT2 = [
  "....................",
  "................oo..",
  "...............oTTo.",
  "o....o.........obo..",
  "oo..oo...o.o.o.obo..",
  "oiooio..obobobobbo..",
  "oiiiiio.obbbbbbbo...",
  "obbbbbbobbbBbBbbo...",
  "ooebbeooobbBbBbbbo..",
  "obekbekbbbbbbbbbbo..",
  "occbnbccbbbbbbbbbo..",
  "ocfmmmfcbbbBbBbbbo..",
  ".ocfmfcbbbbBbBbbbo..",
  "..occcobbbbbbbbbbo..",
  "..obbbbbbbbbbbbbbo..",
  "..obwwoooooooowwbo..",
  "..owwo.......owwo...",
  ".owwwo......owwwo...",
  ".fofof......fofof...",
  "....................",
];
const CAT2_TAIL2 = { 1: "...............oo...", 2: "..............oTTo..", 3: "o....o.........obo..", 4: "oo..oo...o.o.o.obo.." };

// Evolution 3 (24x24): the final boss version. Built from evolution 2 plus horns of fur, a spiked collar,
// a scar over one eye and an aura that matches the cat's type.
function cat3(aura) {
  let g = pad(CAT2, 24, 24, 2, 3);
  g = overlay(g, [
    "........................",
    "........................",
    "..o....o................",
    ".oio..oio...o...o.......",
    ".oiio.oiio.obo.obo.o....",
    "..............o...o.o...",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "....yoyoyoy.............",
  ]);
  g = overlay(g, ["", "", "", "", "", "", "", "", "", "", "", "....s...................", "...s....................", "..s....................."]);
  return overlay(g, aura);
}
const AURA_FIRE = [
  "....................a...",
  "...................aAa..",
  "..a...............aAa...",
  ".aAa...................a",
  "..a...................aA",
  "......................a.",
  "", "", "", "", "", "", "", "", "", "", "", "", "", "",
  "a.....................a.",
  "Aa..................aAa.",
  "aAa..a....a....a...aAAa.",
  ".aAaaAa..aAa..aAa.aAAa..",
];
const AURA_SHADOW = [
  "a.......................",
  ".a....................a.",
  "......................Aa",
  "a.....................a.",
  "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
  "a......................a",
  ".a....................a.",
  "aAa..a...a....a...a..aAa",
  ".aaaAaaaaAaaaaAaaaAaaaa.",
];
const AURA_PSY = [
  "....a.......a...........",
  "...aAa.....aAa..........",
  "....a.......a.......a...",
  "...................aAa..",
  "....................a...",
  "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
  "a......................a",
  "Aa....................aA",
  "a......................a",
];

const CAT_COATS = {
  // Lucy: fluffy, mostly black, white chin and legs, fire behind her eyes
  lucy:   { b: "#2a2633", B: "#3d3848", c: "#f8f5ef", w: "#f8f5ef", i: "#f9a8d4", e: "#fb923c", k: "#fde047", n: "#f9a8d4", m: "#3b3547", T: "#2a2633", a: "#f97316", A: "#facc15", s: "#ef4444", o: "#0b0814" },
  // Spook: sleek all-black, yellow-green eyes
  spook:  { b: "#231f2b", B: "#2f2a3a", c: "#2f2a3a", w: "#231f2b", i: "#6b5a7a", e: "#bef264", k: "#1b1530", n: "#a78bfa", m: "#6b5a7a", T: "#231f2b", a: "#7c3aed", A: "#c4b5fd", s: "#a78bfa", o: "#0b0814" },
  // Marie: tortoiseshell, no white at all
  marie:  { b: "#3a2a22", B: "#e07b24", c: "#b8641f", w: "#3a2a22", i: "#d6a37a", e: "#4ade80", k: "#1b1530", n: "#7a3e1a", m: "#7a3e1a", T: "#e07b24", a: "#f472b6", A: "#fbcfe8", s: "#f472b6" },
};
const AURAS = { lucy: AURA_FIRE, spook: AURA_SHADOW, marie: AURA_PSY };
function catPixels(coat, stage) {
  const pal = { ...PAL_BASE, ...CAT_COATS[coat] };
  if (stage === 1) {
    const g = coat === "lucy" ? overlay(CAT, FLUFF) : CAT;
    return { grid: g, pal, scale: 0.72, frames: [patch(g, CAT_TAIL2), attackPose(g)] };
  }
  if (stage === 2) return { grid: CAT2, pal, scale: 0.86, frames: [patch(CAT2, CAT2_TAIL2), attackPose(CAT2)] };
  const g = cat3(AURAS[coat]);
  const g2 = overlay(cat3(AURAS[coat].slice().reverse().reverse().map(r => r.split("").reverse().join(""))), []);
  return { grid: g, pal, scale: 1, frames: [g2, attackPose(g)] };
}

// Oswald: a Sphynx. Hairless, wrinkly, enormous ears.
const SPHYNX = [
  "o......o........",
  "oo....oo........",
  "oio..oio......o.",
  "oiiooiio.....obo",
  "obbbbbbbo....obo",
  "obzbbbzbbo...obo",
  "obekbbekbo...obo",
  "obkkbbkkbo..obo.",
  "obbbnnbbbooobbo.",
  ".obbmmbbbbzbbbo.",
  "..obbbbbzbbbzbo.",
  "..obzbbbbbzbbbo.",
  "..obbbbbbbbbbbo.",
  "..obboooooobbo..",
  "..obbo....obbo..",
  "..oooo....oooo..",
];

// ---------- DOGS ----------
// French bulldog: bat ears, squashed face, barrel chest. h head, p tan points, c chest, b body
const FRENCHIE = [
  "................",
  ".oo....oo.......",
  "ohio..oiho......",
  "ohiiooiiho......",
  "ohhhhhhhhho.....",
  "ohekhhhhkeho....",
  "ohkkhhhhkkhoooo.",
  "ohpmmnnmmphbbbo.",
  ".ohmmttmmhbbbbbo",
  "..ocpccpccbbbbbo",
  "..occccccbbbbbbo",
  "..occccccbbbbbo.",
  "..obbbbbbbbbbbo.",
  "..owwooooooowwo.",
  "..owwo.....owwo.",
  "..oooo.....oooo.",
];
const FRENCHIE_2 = { 6: "ohkkhhhhkkhoooo.", 7: "ohpmmnnmmphbbbo.", 8: ".ohmmttmmhbbbbbo" };
// Winnie: ginger Jack Russell cross, huge pink-lined ears, dark muzzle, white chest and paws
const WINNIE = [
  "oo......oo......",
  "obo....obo......",
  "obio..oibo......",
  "obiiooiibo......",
  ".obbbbbbbo......",
  ".obdbbbbdbo.....",
  ".obekbbkebo..o..",
  ".obkkbbkkbo.obo.",
  "..obmmmmbo..obo.",
  "..obmnnmbooobbo.",
  "...omttmcbbbbbo.",
  "...occccbbbbbbo.",
  "...occccbbbbbo..",
  "...owoooooowo...",
  "...owo....owo...",
  "...ooo....ooo...",
];
const WINNIE_2 = { 6: ".obekbbkebo.o...", 7: ".obkkbbkkbo.obo." };
// WINNIEEEE (24x24): lightning-fast, ears like jet wings, sweatband, speed lines
function winnieeee() {
  let g = pad(WINNIE, 24, 24, 6, 6);
  g = overlay(g, [
    "......oo..........oo....",
    ".....obbo........obbo...",
    "....obiibo......obiibo..",
    "....obiiibo....obiiibo..",
    ".....obiiibo..obiiibo...",
    "......obiiibooobiiibo...",
    "........................",
    "......rrrrrrrrrrr.......",
    "",
    "",
    "",
    "",
    ".........fo...of........",
  ]);
  return overlay(g, [
    "", "", "", "", "", "",
    "", "", "", "",
    "a.....................a.",
    ".a...................aA.",
    "aa...................a..",
    "",
    "AAA.....................",
    "",
    "aaaa....................",
    "",
    "AAA.....................",
    "", "",
    "aa......................",
  ]);
}
// Chap: big black Labrador. Long body, floppy ears, otter tail, tongue out.
const LAB = [
  "................",
  "................",
  ".oooo...........",
  "oBbbbo..........",
  "oBbbbbo.........",
  "obekbbbooooooo..",
  "obkkbbbbbbbbbbo.",
  "onbbbbbbbbbbbbbo",
  ".omtbbbbbbbbbbbo",
  "..ottbbbbbbbbbo.",
  "..obbbbbbbbbbbo.",
  "...obbbbbbbbbo..",
  "...obbooooobbo..",
  "...obbo...obbo..",
  "...obbo...obbo..",
  "...oooo...oooo..",
];
const LAB_2 = { 6: "obkkbbbbbbbbbbbo", 7: "onbbbbbbbbbbbbo.", 8: ".omtbbbbbbbbbbo." };
// Milo and Lila: really old, small, fluffy, light brown. Grey muzzles, sleepy eyes.
const FLUFFY = [
  "................",
  "................",
  "................",
  "...oooooo.......",
  "..obbbbbbo......",
  ".oebbbbbbbo.....",
  ".obgkbbgkbo.....",
  ".obggnngbbo.....",
  "obbbgttgbbbooo..",
  "obbbbbbbbbbbbbo.",
  "obBbbBbbBbbBbbo.",
  ".obbbbbbbbbbbo..",
  ".obBbbBbbBbbbo..",
  "..obbbbbbbbbo...",
  "..owwo...owwo...",
  "..oooo...oooo...",
];
const FLUFFY_2 = { 6: ".obgobbbgobo.....".slice(0, 16), 13: "..obbbbbbbbbo..." };
// Gerty: small black pug cross. Flat face, curly tail.
const PUG = [
  "................",
  "................",
  "................",
  "..o.....o.......",
  ".obooooobo...oo.",
  ".obbbbbbbo..obbo",
  "obekbbbbkeo.ob.o",
  "obkkbbbbkko..oo.",
  "obbmmnnmmbooobo.",
  ".obmmttmmbbbbbo.",
  "..obbbbbbbbbbbo.",
  "..obbbbbbbbbbbo.",
  "..obbbbbbbbbbo..",
  "..obboooooobbo..",
  "..obbo....obbo..",
  "..oooo....oooo..",
];
const PUG_2 = { 4: ".obooooobo....oo", 5: ".obbbbbbbo...obb", 6: "obekbbbbkeo..ob.", 7: "obkkbbbbkko...o." };

// Kettlebear: a bear doing kettlebell swings. g kettlebell
const KBEAR = [
  "................",
  ".oo....oo.......",
  "obbooooobbo.....",
  "obbbbbbbbbo.....",
  "obekbbbkebo.....",
  "obkkbbbkkbo.....",
  ".obbmnmbbo......",
  "..obmmmbo.......",
  ".obbbbbbbbo.....",
  "obbbbbbbbbbo....",
  "obwbbbbbbwbo....",
  "oooobbbbbbbo....",
  ".oggo.bbbbbbo...",
  "ogGggoobbobbo...",
  "ogggggobbobbo...",
  ".ooooo.oo.oo....",
];
const KBEAR_2 = patch(KBEAR, { 9: "obbbbbbbbbbo.oo.", 10: "obwbbbbbbwbbogGo", 11: "ooobbbbbbbbbogggo".slice(0, 16), 12: "..o.bbbbbbbo.oo.", 13: "...obbbbbbbbo...", 14: "...obbobbobbo...", 15: "....oo..oo......" });

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

// The mug critters are sent out in (Rough Hands green). Drawn at 16x16.
const MUG = [
  "................",
  "................",
  "................",
  "................",
  "..oooooooooo....",
  "..oddddddddo....",
  "..ogggggggggoo..",
  "..oghggggggo.go.",
  "..ohfffffffo.go.",
  "..ogfgrrgfgo.go.",
  "..ogfrrrrfgoogo.",
  "..ohffrrfffogo..",
  "..ogggggggggo...",
  "..oGGGGGGGGo....",
  "...oooooooo.....",
  "................",
];
const MUG_PAL = { ...PAL_BASE, g: "#166534", G: "#14532d", h: "#22a05a", d: "#5b3a1e", f: "#f8fafc", r: "#ef4444" };

function simple(grid, pal, scale, alt, legRows) {
  return () => ({ grid, pal: { ...PAL_BASE, ...pal }, scale, frames: [alt ? (Array.isArray(alt) ? alt : patch(grid, alt)) : grid, attackPose(grid, legRows)] });
}
const HAND_PIXELS = {
  luce:   () => catPixels("lucy", 1),   lucy:     () => catPixels("lucy", 2),   lucius:     () => catPixels("lucy", 3),
  spook:  () => catPixels("spook", 1),  spooks:   () => catPixels("spook", 2),  spookus:    () => catPixels("spook", 3),
  marie:  () => catPixels("marie", 1),  marigold: () => catPixels("marie", 2),  marigoldus: () => catPixels("marie", 3),
  winnie: simple(WINNIE, { b: "#c27a3a", i: "#f4a6a6", d: "#7a4a22", m: "#3b2418", n: "#1b1530", c: "#fbf7f0", w: "#fbf7f0", k: "#2a1a10", t: "#fb7185" }, 0.8, WINNIE_2),
  winnieeee: () => { const g = winnieeee(); return { grid: g, pal: { ...PAL_BASE, b: "#c27a3a", i: "#f4a6a6", d: "#7a4a22", m: "#3b2418", n: "#1b1530", c: "#fbf7f0", w: "#fbf7f0", k: "#2a1a10", t: "#fb7185", a: "#facc15", A: "#fde68a" }, scale: 1, frames: [shift(g, 0, 0).map(r => r.replace(/A/g, "a")), attackPose(g)] }; },
  // from Freddie's photo: Ralph is black and tan with a white chest, Bonnie is blue-grey and tan with a white body
  ralph:  simple(FRENCHIE, { h: "#1f1a1c", i: "#b9a6a0", p: "#c99a62", m: "#4a4244", n: "#111", b: "#1f1a1c", c: "#f4f1ec", w: "#c99a62", t: "#fb7185" }, 0.74, { 13: "..owwoooooowwo..", 14: "..owwo.....owwo." }),
  bonnie: simple(FRENCHIE, { h: "#6d6570", i: "#c4b3b8", p: "#c99a62", m: "#544c57", n: "#2a2428", b: "#f4f1ec", c: "#f4f1ec", w: "#f4f1ec", t: "#fb7185" }, 0.74, { 13: "..owwoooooowwo..", 14: "..owwo.....owwo." }),
  chap:   simple(LAB, { b: "#1c1a1f", B: "#3a3640", e: "#fde68a", k: "#3b2418", n: "#4b4552", m: "#4b4552", t: "#fb7185", o: "#000" }, 0.8, LAB_2),
  milo:   simple(FLUFFY, { b: "#c8a27a", B: "#b08860", g: "#d6d3d1", e: "#e7d3b8", k: "#1b1530", w: "#e7d3b8", n: "#3b2418", t: "#fb7185" }, 0.62, FLUFFY_2, 2),
  lila:   simple(FLUFFY, { b: "#d4b08a", B: "#bf9670", g: "#e7e5e4", e: "#f0dcc2", k: "#1b1530", w: "#f0dcc2", n: "#3b2418", t: "#fb7185" }, 0.62, FLUFFY_2, 2),
  gerty:  simple(PUG, { b: "#1f1c22", m: "#3d3842", n: "#111", e: "#fff", k: "#1b1530", t: "#fb7185" }, 0.66, PUG_2),
  oswald: simple(SPHYNX, { b: "#e8b9b0", T: "#e8b9b0", z: "#c98f86", i: "#f9a8d4", e: "#7dd3fc", k: "#1b1530", n: "#f472b6", m: "#c98f86" }, 0.72, CAT_TAIL2),
  kettlebear: simple(KBEAR, { b: "#7c4a22", w: "#c08a5a", e: "#fff", k: "#1b1530", n: "#1b1530", m: "#3b2418", g: "#374151", G: "#9ca3af" }, 0.86, KBEAR_2),
  mrchicken: () => ({ grid: CHICKEN, pal: { ...PAL_BASE, b: "#3b82f6" } }),
};

// ---------- WINNIEEEE options: Winnie barking fiercely in her harness, with bark lines ----------
// Base pose (24x24, faces left): ears up, brows down, jaws wide open, braced on all fours, tail up.
const WBARK = [
  "........................",
  "....oo.....oo...........",
  "....obo...obo...........",
  "....obio..obio..........",
  "....obiio.obiio......o..",
  "....obiiooobiio.....obo.",
  ".....obbbbbbbbo.....obo.",
  "....obbdbbbbdbbo...obo..",
  "....obooebbooebo...obo..",
  "....obbkkbbbkkbo..obo...",
  "...obbbbbbbbbbbo..obo...",
  "..onmmmbbbbbbbbboooobo..",
  "..ommmmmbbbbbbbbbbbbbo..",
  "..ofrrfrmbbbbbbbbbbbbo..",
  "..orrrrrmbbbbbbbbbbbbo..",
  "...otttmmccbbbbbbbbbbo..",
  "....ooommcccbbbbbbbbbo..",
  "......occccbbbbbbbbbbo..",
  "......occcbbbbbbbbbbbo..",
  "......obbcooooooooobbo..",
  "......owwo.owwo..owwo...",
  "......owwo.owwo..owwo...",
  ".....owwwoowwwo.owwwo...",
  ".....ooooooooo..ooooo...",
];
// harness: H strap, h strap shade, D ring
const HARNESS = ["", "", "", "", "", "", "", "", "", "",
  "...........D............",
  "..........HHhh..........",
  "..........Hh..HH........",
  "..........Hh..Hh........",
  "..........Hh..Hh........",
  "..........Hh..Hh........",
  "..........Hh..Hh........",
  "..........HHHHHh........",
  "..........Hh..Hh........"];
// tactical harness with a grab handle on top
const HARNESS_TAC = overlay(HARNESS, ["", "", "", "", "", "", "", "", "",
  "...........ooo..........",
  "..........oD.o..........",
  "", "", "", "", "",
  "..........HHHHHh........"]);
const BARK_ARCS = ["", "", "", "", "", "",
  "..L.....................",
  ".L......................",
  "L...L...................",
  "L..L....................",
  "L..L....................",
  "L..L....................",
  "L...L...................",
  ".L......................",
  "..L....................."];
const BARK_ZIGZAG = ["", "", "", "",
  "L.......................",
  ".L......................",
  "L.......................",
  ".L......................",
  "L.......................",
  "", "",
  "LL......................",
  "", "",
  "L.......................",
  ".L......................",
  "L.......................",
  ".L......................",
  "L......................."];
const BARK_BURST = ["", "", "",
  "L.......................",
  ".L......................",
  "..L.....................",
  "", "", "", "",
  "LL......................",
  "", "",
  "LLL.....................",
  "", "",
  "LL......................",
  "", "",
  "..L.....................",
  ".L......................",
  "L......................."];
const BARK_RINGS = ["", "", "", "", "", "", "", "",
  ".LL.....................",
  "L..L....................",
  "L..L....................",
  ".LL.....................",
  "", "",
  ".L......................",
  "L.L.....................",
  ".L......................"];
// hackles up along the back (fiercer)
const HACKLES = ["", "", "", "", "", "", "", "", "",
  "...........o.o.o........",
  "..........obobobo.......",];
// taut lead trailing back to the right edge
const LEAD = ["", "", "", "", "", "", "", "",
  ".....................ll.",
  "...................ll..l",
  ".................ll.....",
  "...............ll.......",
  "............Dll........."];
const AURA_ZAP = ["", "",
  "...................A....",
  "..................a.....",
  ".................aA.....",
  "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
  "a......................a",
  "Aa....................aA",
  ".a.....................a"];
const WPAL = { b: "#c27a3a", i: "#f4a6a6", d: "#7a4a22", m: "#3b2418", n: "#1b1530", c: "#fbf7f0", w: "#fbf7f0", k: "#2a1a10", t: "#fb7185", r: "#7f1d1d", f: "#ffffff" };
const WINNIEEEE_OPTIONS = {
  a: { name: "A: Classic bark", grid: overlay(WBARK, HARNESS, BARK_ARCS), pal: { H: "#dc2626", h: "#991b1b", D: "#e5e7eb", L: "#ffffff" } },
  b: { name: "B: Hackles up", grid: overlay(WBARK, HACKLES, HARNESS, BARK_ZIGZAG), pal: { H: "#2563eb", h: "#1e3a8a", D: "#facc15", L: "#fde047" } },
  c: { name: "C: Tactical", grid: overlay(WBARK, HACKLES, HARNESS_TAC, BARK_BURST), pal: { H: "#1f2937", h: "#111827", D: "#9ca3af", L: "#f97316" } },
  d: { name: "D: Straining at the lead", grid: overlay(WBARK, HARNESS, LEAD, BARK_RINGS), pal: { H: "#db2777", h: "#9d174d", D: "#e5e7eb", L: "#ffffff", l: "#78350f" } },
  e: { name: "E: Supercharged", grid: overlay(WBARK, HACKLES, HARNESS, BARK_ARCS, AURA_ZAP), pal: { H: "#facc15", h: "#ca8a04", D: "#1f2937", L: "#fde047", a: "#facc15", A: "#fef08a" } },
};
for (const k in WINNIEEEE_OPTIONS) HAND_PIXELS["winnieeee_" + k] = () => ({ grid: WINNIEEEE_OPTIONS[k].grid, pal: { ...PAL_BASE, ...WPAL, ...WINNIEEEE_OPTIONS[k].pal }, scale: 1, frames: [] });
const HERO_PIXELS = HAND_PIXELS.mrchicken;
