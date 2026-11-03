// ============================================================
//  GAME ENGINE — reads CONFIG / TYPES / MOVES / SPECIES / AREAS
//  from content.js. No build step, no dependencies.
// ============================================================
(() => {
"use strict";

const $app = document.getElementById("app");
const SAVE_KEY = "pocketsam-save-v1";
const SPEED = /[?&]fast\b/.test(location.search) ? 0.03 : 1; // ?fast for testing
const MAX_TEAM = 6;
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------- sound: chiptune sfx + music, all synthesized (no audio files) ----------
let actx = null, master = null;
let muted = false;
try { muted = localStorage.getItem("samsters-muted") === "1"; } catch (e) {}
function audio() {
  if (!actx) {
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      master = actx.createGain(); master.gain.value = muted ? 0 : 1; master.connect(actx.destination);
    } catch (e) { return null; }
  }
  if (actx.state === "suspended") actx.resume();
  return actx;
}
function beep(freq = 440, dur = 0.08, type = "square", vol = 0.05, slide = 0, at = 0) {
  if (!audio()) return;
  try {
    const t0 = at || actx.currentTime;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.linearRampToValueAtTime(freq + slide, t0 + dur);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.02);
  } catch (e) { /* no audio, no problem */ }
}
const sfx = {
  tap: () => beep(660, 0.04),
  hit: () => beep(180, 0.15, "sawtooth", 0.06, -120),
  super: () => { beep(300, 0.1, "sawtooth", 0.07, 200); setTimeout(() => beep(500, 0.12, "square", 0.05), 90); },
  faint: () => beep(400, 0.5, "triangle", 0.07, -350),
  level: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.1, "square", 0.05), i * 90)),
  catch: () => [784, 988, 1175].forEach((f, i) => setTimeout(() => beep(f, 0.12, "triangle", 0.07), i * 120)),
  wobble: () => beep(220, 0.1, "triangle", 0.06),
  heal: () => [440, 554, 659, 880].forEach((f, i) => setTimeout(() => beep(f, 0.12, "sine", 0.06), i * 110)),
  bawk: () => { beep(700, 0.07, "square", 0.07, 250); setTimeout(() => beep(1100, 0.07, "square", 0.07, -200), 90);
                setTimeout(() => beep(1300, 0.28, "sawtooth", 0.06, -900), 190); },
};

// Music: [midiNote | null, lengthIn8ths]. All tunes are original except
// "Happy Birthday", which is public domain.
const e8 = (...ns) => ns.map(n => [n, 1]);
const q = (...ns) => ns.map(n => [n, 2]);
const MUSIC = {
  explore: { bpm: 116,
    lead: e8(72,null,76,79, 77,76,74,null, 72,74,76,72, 74,null,null,null, 76,null,79,84, 83,81,79,null, 77,76,74,76, 72,null,null,null),
    bass: q(48,55,48,55, 53,60,53,60, 48,55,48,55, 43,50,43,50) },
  battle: { bpm: 150,
    lead: e8(69,72,76,72, 69,72,76,79, 77,76,74,72, 71,72,74,76, 69,72,76,72, 69,72,76,81, 79,77,76,74, 76,null,76,null),
    bass: q(45,45,52,52, 41,41,43,43, 45,45,52,52, 41,43,40,40) },
  boss: { bpm: 168,
    lead: e8(62,null,62,65, 62,null,68,67, 62,null,62,65, 70,69,68,67, 62,null,62,65, 62,null,68,67, 74,73,72,71, 70,null,69,null),
    bass: q(38,38,38,38, 36,36,37,37, 38,38,38,38, 34,34,37,37) },
  birthday: { bpm: 132,
    lead: [[67,1],[67,1],[69,2],[67,2],[72,2],[71,4], [67,1],[67,1],[69,2],[67,2],[74,2],[72,4],
           [67,1],[67,1],[79,2],[76,2],[72,2],[71,2],[69,4], [77,1],[77,1],[76,2],[72,2],[74,2],[72,6],[null,4]],
    bass: [[48,4],[55,4],[43,4],[55,4],[43,4],[48,4],[48,4],[53,4],[48,4],[43,4],[48,6],[null,4]] },
  home: { bpm: 96,
    lead: e8(76,null,72,null, 74,76,79,null, 77,null,74,null, 72,null,null,null, 74,null,71,null, 72,74,76,null, 74,72,71,72, 67,null,null,null),
    bass: q(48,52,55,52, 53,57,60,57, 43,47,50,47, 48,52,55,48) },
  town: { bpm: 126,
    lead: e8(67,71,74,71, 72,null,71,69, 67,69,71,67, 64,null,null,null, 67,71,74,79, 78,null,76,74, 72,71,69,71, 67,null,null,null),
    bass: q(43,50,43,50, 48,55,48,55, 43,50,43,50, 38,45,43,43) },
  gym: { bpm: 160,
    lead: e8(64,64,67,64, 69,null,67,64, 62,62,64,62, 67,null,64,null, 64,64,67,64, 71,null,69,67, 69,67,64,62, 64,null,64,null),
    bass: q(40,40,40,40, 38,38,38,38, 40,40,40,40, 43,43,38,38) },
  hills: { bpm: 104,
    lead: e8(74,null,76,78, 81,null,78,null, 76,null,74,null, 71,null,73,null, 74,null,76,78, 81,null,83,81, 78,76,74,73, 74,null,null,null),
    bass: q(50,57,50,57, 45,52,45,52, 47,54,47,54, 45,52,50,50) },
  bike: { bpm: 168,
    lead: e8(72,76,79,84, 79,76,72,76, 74,77,81,86, 81,77,74,77, 76,79,83,88, 83,79,76,79, 77,76,74,72, 74,null,79,null),
    bass: q(48,48,55,55, 50,50,57,57, 52,52,59,59, 53,55,48,48) },
  victory: { bpm: 150, loop: false,
    lead: [[72,1],[76,1],[79,1],[84,3],[79,1],[84,6]], bass: [[48,3],[55,3],[48,6]] },
  fanfare: { bpm: 140, loop: false, then: "birthday",
    lead: [[72,1],[72,1],[72,1],[72,3],[68,3],[70,3],[72,2],[70,1],[72,6],[null,2]],
    bass: [[48,6],[44,3],[46,3],[48,6],[null,4]] },
};
let mus = null, wantMusic = null;
function music(name) {
  wantMusic = name;
  if (mus && mus.name === name) return;
  stopMusic();
  if (!actx || muted) return;           // starts on first tap, or when unmuted
  if (!MUSIC[name]) name = "explore";
  if (mus && mus.name === name) return;
  const T = MUSIC[name], step = 60 / T.bpm / 2, t = actx.currentTime + 0.08;
  const st = { name, voices: [
    { seq: T.lead, i: 0, t, type: "square", vol: 0.028 },
    { seq: T.bass, i: 0, t, type: "triangle", vol: 0.07 }] };
  st.timer = setInterval(() => {
    for (const v of st.voices) {
      while (!v.done && v.t < actx.currentTime + 0.2) {
        if (v.i >= v.seq.length) { if (T.loop === false) { v.done = true; break; } v.i = 0; }
        const [n, d] = v.seq[v.i++], dur = d * step;
        if (n != null) beep(440 * Math.pow(2, (n - 69) / 12), dur * 0.85, v.type, v.vol, 0, v.t);
        v.t += dur;
      }
    }
    if (st.voices.every(v => v.done)) { stopMusic(); if (T.then) music(T.then); }
  }, 40);
  mus = st;
}
function stopMusic() { if (mus) { clearInterval(mus.timer); mus = null; } }
function toggleMute() {
  muted = !muted;
  try { localStorage.setItem("samsters-muted", muted ? "1" : "0"); } catch (e) {}
  if (master) master.gain.value = muted ? 0 : 1;
  if (muted) stopMusic(); else { audio(); const w = wantMusic; wantMusic = null; if (w) music(w); }
  const n = document.createElement("div");
  n.className = "sound-toast"; n.textContent = muted ? "🔇 Sound off" : "🔊 Sound on";
  document.getElementById("bezel").appendChild(n);
  setTimeout(() => n.remove(), 1200);
}
// Browsers only allow audio after a tap, so start it on the first one.
document.addEventListener("pointerdown", () => { if (audio() && !mus && wantMusic && !muted) { const w = wantMusic; wantMusic = null; music(w); } }, true);

// ---------- state ----------
let S = null;
function newState() {
  return { started: false, team: [], box: [], balls: 10, flags: {}, visited: {}, world: null, bike: false, seen: {}, caught: {}, finished: false, uid: 1 };
}
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) {} }
function load() {
  try { const raw = localStorage.getItem(SAVE_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
}

// ---------- monsters ----------
const xpNeed = L => Math.floor(1.2 * L * L) + 5;
function knownMoves(sp, level) {
  return SPECIES[sp].moves.filter(([l]) => l <= level).map(([, m]) => m).slice(-4);
}
function makeMon(sp, level) {
  const m = { uid: S ? S.uid++ : 0, sp, level, xp: 0, hp: 1, moves: knownMoves(sp, level) };
  m.hp = stats(m).hp;
  return m;
}
function stats(m) {
  const b = SPECIES[m.sp].base, L = m.level;
  return {
    hp: Math.floor(b.hp * L / 25) + L + 10,
    atk: Math.floor(b.atk * L / 50) + 5,
    def: Math.floor(b.def * L / 50) + 5,
    spd: Math.floor(b.spd * L / 50) + 5,
  };
}
const monName = m => SPECIES[m.sp].name;
const COLLECTABLE = Object.keys(SPECIES).filter(k => SPECIES[k].catchRate > 0 || STARTERS.includes(k) || Object.values(SPECIES).some(s => s.evolve && s.evolve.into === k));
const alive = team => team.filter(m => m.hp > 0);

function effectiveness(moveType, targetType) {
  const t = TYPES[moveType];
  if (t.strong.includes(targetType)) return 2;
  if (t.weak.includes(targetType)) return 0.5;
  return 1;
}
const stageMul = s => s >= 0 ? (2 + s) / 2 : 2 / (2 - s);

// ---------- rendering helpers ----------
// ---------- pixel art ----------
const PIX = {};
function gridToURL({ grid, pal }) {
  const c = document.createElement("canvas"); c.width = 16; c.height = 16;
  const x = c.getContext("2d");
  grid.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== ".") { x.fillStyle = pal[ch]; x.fillRect(i, j, 1, 1); } }));
  return c.toDataURL();
}
// Draws an emoji small, snaps alpha to hard edges and adds a 1px outline,
// so every creature reads as chunky pixel art. opts: tint (hue degrees), badge (2nd emoji), squash (frame 2).
function emojiToURL(emoji, n = 22, opts = {}) {
  const c = document.createElement("canvas"); c.width = c.height = n;
  const x = c.getContext("2d");
  x.textAlign = "center"; x.textBaseline = "middle";
  const font = s => `${s}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  if (opts.tint) x.filter = `hue-rotate(${opts.tint}deg) saturate(1.2)`;
  x.save();
  if (opts.squash) { x.translate(n / 2, n); x.scale(1.06, 0.9); x.translate(-n / 2, -n); }
  x.font = font(Math.floor(n * 0.78));
  x.fillText(emoji, n / 2, n / 2 + 1);
  x.restore();
  x.filter = "none";
  if (opts.badge) { x.font = font(Math.floor(n * 0.42)); x.fillText(opts.badge, n * 0.78, n * 0.8); }
  const img = x.getImageData(0, 0, n, n), d = img.data;
  const solid = new Uint8Array(n * n);
  for (let i = 0; i < n * n; i++) {
    if (d[i * 4 + 3] > 110) { solid[i] = 1; d[i * 4 + 3] = 255;
      for (let k = 0; k < 3; k++) d[i * 4 + k] = Math.round(d[i * 4 + k] / 32) * 32 - (d[i * 4 + k] > 240 ? 1 : 0);
    } else d[i * 4 + 3] = 0;
  }
  for (let y = 0; y < n; y++) for (let xx = 0; xx < n; xx++) {
    const i = y * n + xx; if (solid[i]) continue;
    const nb = (xx > 0 && solid[i - 1]) || (xx < n - 1 && solid[i + 1]) || (y > 0 && solid[i - n]) || (y < n - 1 && solid[i + n]);
    if (nb) { d[i * 4] = 27; d[i * 4 + 1] = 21; d[i * 4 + 2] = 48; d[i * 4 + 3] = 255; }
  }
  x.putImageData(img, 0, 0);
  return c.toDataURL();
}
// Hand-drawn sprites: frame 2 blinks (eyes closed) and squashes a pixel.
function blinkGrid(h) {
  const g = h.grid.map(r => r.replace(/[ek]/g, "b"));
  return { ...h, grid: ["................", ...g.slice(0, 15)].map((r, i) => i === 0 ? r : r) };
}
function pixURL(sp, f = 0) {
  const k = sp + ":" + f;
  if (PIX[k]) return PIX[k];
  const s = SPECIES[sp];
  const hand = typeof HAND_PIXELS !== "undefined" && HAND_PIXELS[sp];
  if (hand) return PIX[k] = gridToURL(f ? blinkGrid(hand()) : hand());
  return PIX[k] = emojiToURL(s.emoji, 22, { tint: s.tint, badge: s.badge, squash: !!f });
}
function pixScale(sp) {
  const hand = typeof HAND_PIXELS !== "undefined" && HAND_PIXELS[sp];
  return hand ? (hand().scale || 1) : 0.95;
}
const pixEmoji = (e, cls = "") => {
  const k = "e:" + e; PIX[k] = PIX[k] || emojiToURL(e);
  return `<img class="pix ${cls}" src="${PIX[k]}" alt="">`;
};
function sprite(sp, cls = "") {
  const s = SPECIES[sp], t = TYPES[s.type];
  const delay = (sp.length * 137 % 900) / 1000;
  return `<div class="sprite ${cls} ${s.boss ? "boss" : ""} ${s.legendary ? "legend" : ""}" style="--tc:${t.color};--sc:${pixScale(sp)}">
    <div class="anim" style="animation-delay:-${delay}s"><img class="pix f1" src="${pixURL(sp, 0)}" alt="${esc(s.name)}"><img class="pix f2" src="${pixURL(sp, 1)}" alt=""></div></div>`;
}
function typeTag(type) {
  const t = TYPES[type];
  return `<span class="tag" style="background:${t.color}">${t.name}</span>`;
}
function hpBar(m) {
  const max = stats(m).hp, pct = Math.max(0, m.hp / max * 100);
  const col = pct > 50 ? "#34d399" : pct > 20 ? "#fbbf24" : "#f87171";
  return `<div class="hpbar"><div style="width:${pct}%;background:${col}"></div></div>`;
}
function screen(html, cls = "") {
  $app.className = cls;
  $app.innerHTML = html;
  $app.scrollTop = 0;
  navSel = null;
}
function on(sel, fn) {
  $app.querySelectorAll(sel).forEach(el => el.addEventListener("click", e => { sfx.tap(); fn(el, e); }));
}

// ---------- title ----------
function titleScreen() {
  music("explore");
  const existing = load();
  screen(`
    <div class="title">
      <div class="title-sprites">${STARTERS.map(s => sprite(s, "bob")).join("")}</div>
      <h1>${esc(CONFIG.title)}</h1>
      <p class="sub">${esc(CONFIG.subtitle)}</p>
      ${existing && existing.started ? `<button class="btn big" id="cont">▶ Continue</button>` : ""}
      <button class="btn big ${existing && existing.started ? "ghost" : ""}" id="new">✨ New game</button>
      <p class="tiny">Made for ${esc(CONFIG.hero)} by ${esc(CONFIG.from)}</p>
      <p class="tiny">Your game saves automatically on this phone. Open it in the same browser each time to keep your progress.</p>
    </div>`, "bg-title");
  on("#cont", () => { S = Object.assign(newState(), existing); WORLD.resume(); });
  on("#new", () => {
    if (existing && existing.started && !confirm("Start over? Your saved game will be replaced.")) return;
    S = newState(); introScreen();
  });
}

const heroName = () => (S && S.name) || CONFIG.hero;
const fill = t => String(t).replace(/\{name\}/g, heroName());

// Shows a list of lines one tap at a time, with a pixel portrait, then calls next().
function talk(lines, portrait, next, i = 0) {
  if (i >= lines.length) return next();
  const line = fill(lines[i]);
  const m = line.match(/^([A-Z][A-Za-z ]{1,20}): (.*)$/);
  screen(`
    <div class="intro" id="next">
      <div class="hero">${portrait}</div>
      <div class="dialog">${m ? `<b class="who">${esc(m[1])}</b>${esc(m[2])}` : esc(line)}<span class="caret">▼</span></div>
      <p class="tiny">tap to continue</p>
    </div>`, "bg-title");
  on("#next", () => talk(lines, portrait, next, i + 1));
}

const profPortrait = () => `<img class="pix portrait" src="${WORLD.look("prof").toDataURL()}" alt="">`;
function introScreen() {
  talk(CONFIG.profIntro, profPortrait(), nameScreen);
}

// The gag: type anything you like... then the professor decides you're MR CHICKEN.
function nameScreen() {
  screen(`
    <div class="intro">
      <div class="hero">${profPortrait()}</div>
      <div class="dialog"><b class="who">${esc(CONFIG.professor)}</b>What's your name?</div>
      <div class="name-box">
        <input id="nm" maxlength="12" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" placeholder="TYPE YOUR NAME" inputmode="text">
        <button class="btn big" id="ok">OK</button>
      </div>
      <p class="tiny" id="hint">&nbsp;</p>
    </div>`, "bg-title");
  const inp = document.getElementById("nm");
  inp.addEventListener("input", () => { inp.value = inp.value.toUpperCase(); if (inp.value) sfx.tap(); });
  setTimeout(() => inp.focus(), 50);
  on("#ok", () => {
    if (!inp.value.trim()) { document.getElementById("hint").textContent = "Go on, type your name!"; return; }
    inp.blur();
    const typed = inp.value.trim();
    S.typedName = typed;
    S.name = CONFIG.forcedName;
    talk([`Prof. Doverow: ${typed}? ${typed}...`, ...CONFIG.nameReaction], profPortrait(), () => {
      sfx.bawk();
      S.started = true; save();
      WORLD.begin();
    });
  });
}

function giveStarters() {
  for (const sp of STARTERS) { const m = makeMon(sp, 5); S.team.push(m); S.seen[sp] = S.caught[sp] = true; }
  save();
}
const areaScreen = toast => WORLD.resume(toast);

// ---------- healing ----------
function healAll() {
  [...S.team, ...S.box].forEach(m => m.hp = stats(m).hp);
  S.balls = Math.max(S.balls, 5);
  save();
}

// ---------- team ----------
function teamScreen(msg) {
  const row = (m, where, i) => {
    const st = stats(m);
    return `<div class="card mon">
      ${sprite(m.sp, "sm")}
      <div class="grow">
        <b>${monName(m)}</b> Lv${m.level} ${typeTag(SPECIES[m.sp].type)}
        ${hpBar(m)}<small>${m.hp}/${st.hp} HP · XP ${m.xp}/${xpNeed(m.level)}</small>
        <small class="moves">${m.moves.map(id => MOVES[id].name).join(" · ")}</small>
      </div>
      <div class="col">
        ${where === "team" && i > 0 ? `<button class="btn sm" data-act="lead" data-i="${i}">⭐ Lead</button>` : ""}
        ${where === "team" && S.team.length > 1 ? `<button class="btn sm ghost" data-act="tobox" data-i="${i}">→ Box</button>` : ""}
        ${where === "box" ? `<button class="btn sm" data-act="toteam" data-i="${i}">← Team</button>` : ""}
      </div>
    </div>`;
  };
  screen(`
    <div class="page">
      <h2>🎒 Team (${S.team.length}/${MAX_TEAM})</h2>
      ${msg ? `<div class="toast">${esc(msg)}</div>` : ""}
      ${S.team.map((m, i) => row(m, "team", i)).join("")}
      ${S.box.length ? `<h3>📦 Box</h3>${S.box.map((m, i) => row(m, "box", i)).join("")}` : ""}
      <button class="btn" id="back">← Back</button>
    </div>`);
  on("[data-act]", el => {
    const i = +el.dataset.i, act = el.dataset.act;
    if (act === "lead") { const [m] = S.team.splice(i, 1); S.team.unshift(m); }
    if (act === "tobox") S.box.push(S.team.splice(i, 1)[0]);
    if (act === "toteam") {
      if (S.team.length >= MAX_TEAM) return teamScreen("Team is full! Move someone to the box first.");
      S.team.push(S.box.splice(i, 1)[0]);
    }
    save(); teamScreen();
  });
  on("#back", () => areaScreen());
}

function dexScreen() {
  const list = Object.keys(SPECIES).filter(k => COLLECTABLE.includes(k) || S.seen[k]);
  screen(`
    <div class="page">
      <h2>📖 ${esc(CONFIG.dexName)}</h2>
      <p class="tiny center">Seen ${Object.keys(S.seen).length} · Caught ${Object.keys(S.caught).length}</p>
      <div class="dex">
        ${list.map((sp, i) => {
          const s = SPECIES[sp], seen = S.seen[sp], caught = S.caught[sp];
          return `<div class="card dexcell ${caught ? "" : seen ? "seen" : "unseen"}">
            <small>#${String(i + 1).padStart(3, "0")}</small>
            ${seen ? sprite(sp, "sm") : `<div class="sprite sm q"><span>?</span></div>`}
            <b>${seen ? s.name : "???"}</b>
            ${caught ? `<small>${esc(s.flavor)}</small>` : seen ? `<small>Seen, not caught</small>` : ""}
          </div>`;
        }).join("")}
      </div>
      <button class="btn" id="back">← Back</button>
    </div>`);
  on("#back", () => areaScreen());
}

// ---------- battle ----------
let B = null;
function startBattle(opts) {
  B = {
    wild: opts.wild, trainer: opts.trainer || null,
    foes: opts.team, fi: 0,
    pi: S.team.findIndex(m => m.hp > 0),
    stage: { p: { atk: 0, def: 0, spd: 0 }, f: { atk: 0, def: 0, spd: 0 } },
    busy: true, participants: new Set(),
  };
  B.foes.forEach(f => S.seen[f.sp] = true);
  music(B.trainer && B.trainer.boss ? "boss" : "battle");
  B.participants.add(S.team[B.pi].uid);
  B.enter = "f"; renderBattle(); B.enter = null;
  (async () => {
    if (B.wild) await say(`A wild ${monName(foe())} appeared!`);
    else {
      await say(`${B.trainer.name} wants to battle!`);
      await say(`${B.trainer.name} sent out ${monName(foe())}!`);
    }
    const ms = document.getElementById("meSprite"); if (ms) { ms.className = ""; void ms.offsetWidth; ms.classList.add("enter-p"); }
    await say(`Go, ${monName(me())}!`);
    menu();
  })();
}
const me = () => S.team[B.pi];
const foe = () => B.foes[B.fi];

function renderBattle() {
  const f = foe(), p = me(), bg = WORLD.battleBg();
  screen(`
    <div class="battle" style="background:linear-gradient(180deg,${bg[0]},${bg[1]})">
      <div class="side foe">
        <div class="plate">
          <b>${monName(f)}</b> <span>Lv${f.level}</span> ${typeTag(SPECIES[f.sp].type)}
          ${hpBar(f)}
          ${B.trainer ? `<small>${B.foes.map(m => m.hp > 0 ? "●" : "○").join(" ")}</small>` : ""}
        </div>
        <div id="foeSprite" class="${B.enter === "f" ? "enter-f" : ""}">${sprite(f.sp)}</div>
      </div>
      <div class="side me">
        <div id="meSprite" class="${B.enter === "p" ? "enter-p" : ""}">${sprite(p.sp, "back")}</div>
        <div class="plate">
          <b>${monName(p)}</b> <span>Lv${p.level}</span> ${typeTag(SPECIES[p.sp].type)}
          ${hpBar(p)}<small>${p.hp}/${stats(p).hp} HP</small>
          <div class="xpbar"><div style="width:${Math.min(100, p.xp / xpNeed(p.level) * 100)}%"></div></div>
        </div>
      </div>
    </div>
    <div class="msg" id="msg"></div>
    <div class="actions" id="actions"></div>`, "in-battle");
}

let sayResolve = null;
function say(text, ms) {
  return new Promise(res => {
    const box = document.getElementById("msg");
    if (!box) return res();
    box.innerHTML = `${esc(text)}<span class="caret">▼</span>`;
    const done = () => { if (sayResolve === done) { sayResolve = null; res(); } };
    sayResolve = done;
    setTimeout(done, (ms || Math.max(1100, text.length * 32)) * SPEED);
  });
}
document.addEventListener("click", e => {
  if (sayResolve && e.target.closest && e.target.closest("#msg")) sayResolve();
});

function setActions(html) {
  const a = document.getElementById("actions");
  if (a) a.innerHTML = html;
}

function menu() {
  B.busy = false;
  document.getElementById("msg").innerHTML = `What will ${esc(monName(me()))} do?`;
  setActions(`
    <button class="btn big" data-a="fight">⚔️ Fight</button>
    <button class="btn big" data-a="ball" ${!B.wild ? "disabled" : ""}>${CONFIG.ballEmoji} Catch (${S.balls})</button>
    <button class="btn big" data-a="team">🔁 Switch</button>
    <button class="btn big" data-a="run">🏃 Run</button>`);
  on("[data-a]", el => {
    if (B.busy) return;
    const a = el.dataset.a;
    if (a === "fight") fightMenu();
    if (a === "ball") turn({ kind: "ball" });
    if (a === "team") switchMenu(false);
    if (a === "run") turn({ kind: "run" });
  });
}

function fightMenu() {
  const p = me();
  setActions(`
    ${p.moves.map(id => {
      const mv = MOVES[id], t = TYPES[mv.type];
      const eff = mv.power ? effectiveness(mv.type, SPECIES[foe().sp].type) : 1;
      return `<button class="btn move" data-m="${id}" style="--tc:${t.color}">
        <b>${mv.name}</b><small>${t.emoji} ${mv.power ? `Pow ${mv.power}` : effectText(mv.effect)}${eff > 1 ? " · 💥 strong!" : eff < 1 ? " · weak" : ""}</small></button>`;
    }).join("")}
    <button class="btn ghost wide" data-back="1">← Back</button>`);
  on("[data-m]", el => { if (!B.busy) turn({ kind: "move", id: el.dataset.m }); });
  on("[data-back]", () => menu());
}
const effectText = e => ({ heal: "Heals", atkUp: "Attack ↑", defDown: "Foe defence ↓", spdUp: "Speed ↑" }[e] || "");

function switchMenu(forced) {
  setActions(`
    ${S.team.map((m, i) => `
      <button class="btn mon-btn" data-s="${i}" ${m.hp <= 0 || i === B.pi ? "disabled" : ""}>
        ${SPECIES[m.sp].emoji} ${monName(m)} Lv${m.level}<small>${m.hp}/${stats(m).hp}</small></button>`).join("")}
    ${forced ? "" : `<button class="btn ghost wide" data-back="1">← Back</button>`}`);
  if (forced) document.getElementById("msg").textContent = "Who's next?";
  on("[data-s]", el => {
    const i = +el.dataset.s;
    if (forced) {
      B.pi = i; B.stage.p = { atk: 0, def: 0, spd: 0 }; B.participants.add(me().uid);
      renderBattle();
      (async () => { await say(`Go, ${monName(me())}!`); menu(); })();
    } else turn({ kind: "switch", i });
  });
  on("[data-back]", () => menu());
}

async function turn(action) {
  B.busy = true;
  setActions("");
  const p = me(), f = foe();

  if (action.kind === "run") {
    if (!B.wild) { await say("You can't run from a trainer battle!"); return menu(); }
    await say("Got away safely!");
    return endBattle("run");
  }
  if (action.kind === "switch") {
    await say(`Come back, ${monName(p)}!`);
    B.pi = action.i; B.stage.p = { atk: 0, def: 0, spd: 0 }; B.participants.add(me().uid);
    renderBattle();
    await say(`Go, ${monName(me())}!`);
    if (await foeAttacks()) return;
    return menu();
  }
  if (action.kind === "ball") {
    if (S.balls <= 0) { await say(`You're out of ${CONFIG.ballName}s! Rest to get more.`); return menu(); }
    S.balls--;
    if (await tryCatch()) return;
    if (await foeAttacks()) return;
    return menu();
  }
  // move
  const pSpd = stats(p).spd * stageMul(B.stage.p.spd), fSpd = stats(f).spd * stageMul(B.stage.f.spd);
  const playerFirst = pSpd >= fSpd || (pSpd === fSpd && Math.random() < 0.5);
  if (playerFirst) {
    if (await useMove("p", action.id)) return;
    if (await foeAttacks()) return;
  } else {
    if (await foeAttacks()) return;
    if (await useMove("p", action.id)) return;
  }
  menu();
}

function foeChooseMove() {
  const f = foe(), p = me();
  const opts = f.moves.map(id => {
    const mv = MOVES[id];
    let w = mv.power ? mv.power * effectiveness(mv.type, SPECIES[p.sp].type) : 35;
    if (mv.effect === "heal") w = f.hp < stats(f).hp * 0.4 ? 120 : 5;
    return { id, w };
  });
  const total = opts.reduce((a, o) => a + o.w, 0);
  let r = Math.random() * total;
  for (const o of opts) { if ((r -= o.w) <= 0) return o.id; }
  return opts[0].id;
}
const foeAttacks = () => useMove("f", foeChooseMove());

// returns true if the battle flow was taken over (faint handling / battle end)
async function useMove(who, id) {
  const atkM = who === "p" ? me() : foe(), defM = who === "p" ? foe() : me();
  const aSt = B.stage[who], dSt = B.stage[who === "p" ? "f" : "p"];
  const mv = MOVES[id];
  const prefix = who === "f" ? (B.wild ? "Wild " : "Foe ") : "";
  const atkEl = document.getElementById(who === "p" ? "meSprite" : "foeSprite");
  if (atkEl) { atkEl.className = ""; void atkEl.offsetWidth; atkEl.classList.add(mv.power ? (who === "p" ? "lunge-p" : "lunge-f") : "buff"); }
  await say(`${prefix}${monName(atkM)} used ${mv.name}!`, 900);

  if (Math.random() * 100 > mv.acc) { await say("But it missed!"); return false; }

  if (!mv.power) {
    if (mv.effect === "heal") {
      const max = stats(atkM).hp, amt = Math.ceil(max * 0.4);
      atkM.hp = Math.min(max, atkM.hp + amt); sfx.heal(); renderBattleKeepMsg();
      await say(`${monName(atkM)} feels refreshed!`);
    } else if (mv.effect === "atkUp") { aSt.atk = Math.min(6, aSt.atk + 1); sfx.level(); await say(`${monName(atkM)}'s attack rose!`); }
    else if (mv.effect === "spdUp") { aSt.spd = Math.min(6, aSt.spd + 1); await say(`${monName(atkM)} got faster!`); }
    else if (mv.effect === "defDown") { dSt.def = Math.max(-6, dSt.def - 1); sfx.wobble(); await say(`${monName(defM)}'s defence fell!`); }
    return false;
  }

  const as = stats(atkM), ds = stats(defM);
  const eff = effectiveness(mv.type, SPECIES[defM.sp].type);
  const stab = mv.type === SPECIES[atkM.sp].type ? 1.5 : 1;
  const crit = Math.random() < 0.0625 ? 1.5 : 1;
  const easy = who === "f" ? 0.85 : 1; // a little birthday mercy
  let dmg = ((2 * atkM.level / 5 + 2) * mv.power * (as.atk * stageMul(aSt.atk)) / (ds.def * stageMul(dSt.def))) / 50 + 2;
  dmg = Math.max(1, Math.floor(dmg * stab * eff * crit * easy * (0.85 + Math.random() * 0.15)));
  defM.hp = Math.max(0, defM.hp - dmg);

  const el = document.getElementById(who === "p" ? "foeSprite" : "meSprite");
  eff > 1 ? sfx.super() : sfx.hit();
  renderBattleKeepMsg();
  const hitEl = document.getElementById(who === "p" ? "foeSprite" : "meSprite");
  if (hitEl) { hitEl.className = ""; void hitEl.offsetWidth; hitEl.classList.add("hit"); hitEl.style.setProperty("--hc", TYPES[mv.type].color); }
  if (crit > 1) await say("A critical hit!", 900);
  if (eff > 1) await say("It's super effective!", 900);
  if (eff < 1) await say("It's not very effective...", 900);

  if (defM.hp <= 0) {
    sfx.faint();
    const sp = document.getElementById(who === "p" ? "foeSprite" : "meSprite");
    if (sp) sp.classList.add("faint");
    await say(`${who === "p" ? prefix || (B.wild ? "Wild " : "Foe ") : ""}${monName(defM)} fainted!`);
    if (who === "p") await foeFainted(); else await playerFainted();
    return true;
  }
  return false;
}

function renderBattleKeepMsg() {
  const msg = document.getElementById("msg")?.innerHTML || "";
  const shakeFoe = document.getElementById("foeSprite")?.classList.contains("shake");
  const shakeMe = document.getElementById("meSprite")?.classList.contains("shake");
  renderBattle();
  document.getElementById("msg").innerHTML = msg;
  if (shakeFoe) document.getElementById("foeSprite").classList.add("shake");
  if (shakeMe) document.getElementById("meSprite").classList.add("shake");
}

async function tryCatch() {
  const f = foe(), max = stats(f).hp, rate = SPECIES[f.sp].catchRate;
  await say(`You threw a ${CONFIG.ballName}!`, 800);
  const el = document.getElementById("foeSprite");
  if (el) el.innerHTML = `<div class="ball-anim">${CONFIG.ballEmoji}</div>`;
  const chance = rate * (1.15 - 0.85 * f.hp / max);
  const ok = Math.random() < chance;
  const wobbles = ok ? 3 : rnd(0, 2);
  for (let i = 0; i < wobbles; i++) { sfx.wobble(); el?.firstChild?.classList.add("wob"); await say("...".slice(0, i + 1), 600); el?.firstChild?.classList.remove("wob"); }
  if (ok) {
    sfx.catch();
    await say(`Gotcha! ${monName(f)} was caught!`);
    S.caught[f.sp] = true;
    f.uid = S.uid++;
    if (S.team.length < MAX_TEAM) S.team.push(f);
    else { S.box.push(f); await say(`Your team is full, so ${monName(f)} went to the box.`); }
    await awardXp(Math.floor(SPECIES[f.sp].xp * f.level / 6));
    await endBattle("catch");
    return true;
  }
  renderBattleKeepMsg();
  await say(pick(["Argh! So close!", "It broke free!", "Almost had it!"]));
  return false;
}

async function awardXp(total) {
  const ids = [...B.participants];
  for (const m of S.team) {
    if (m.hp <= 0) continue;
    const share = ids.includes(m.uid) ? total : Math.floor(total / 2);
    if (!share) continue;
    m.xp += share;
    if (m === me()) await say(`${monName(m)} gained ${share} XP!`, 900);
    while (m.xp >= xpNeed(m.level) && m.level < 50) {
      m.xp -= xpNeed(m.level);
      const before = stats(m).hp;
      m.level++;
      m.hp += stats(m).hp - before;
      sfx.level();
      if (B && m === me()) renderBattleKeepMsg();
      await say(`${monName(m)} grew to level ${m.level}!`);
      const learned = SPECIES[m.sp].moves.filter(([l]) => l === m.level).map(([, id]) => id);
      for (const id of learned) {
        if (m.moves.includes(id)) continue;
        if (m.moves.length >= 4) {
          const old = m.moves.shift();
          await say(`${monName(m)} forgot ${MOVES[old].name}...`, 900);
        }
        m.moves.push(id);
        await say(`...and learned ${MOVES[id].name}!`);
      }
    }
  }
}

async function foeFainted() {
  const f = foe();
  await awardXp(Math.floor(SPECIES[f.sp].xp * f.level / (B.wild ? 6 : 4.5)));
  if (B.fi < B.foes.length - 1 && alive(B.foes).length) {
    B.fi++; B.stage.f = { atk: 0, def: 0, spd: 0 };
    renderBattle();
    B.enter = "f"; renderBattle(); B.enter = null;
    await say(`${B.trainer.name} sent out ${monName(foe())}!`);
    return menu();
  }
  if (B.trainer) {
    music("victory");
    await say(`You beat ${B.trainer.name}!`);
    for (const line of B.trainer.win) await say(line);
  }
  return endBattle("win");
}

async function playerFainted() {
  if (alive(S.team).length) return switchMenu(true);
  await say(`${heroName()} is out of usable Samsters!`);
  healAll();
  endBattle("lose");
}

async function endBattle(result) {
  const trainer = B.trainer;
  for (const m of S.team) {
    let ev;
    while ((ev = SPECIES[m.sp].evolve) && m.level >= ev.at && m.hp > 0) await evolve(m, ev.into);
  }
  B = null;
  if (result === "win" && trainer) {
    S.flags[trainer.flag] = true;
    S.balls += trainer.reward || 0;
    if (trainer.boss) { S.finished = true; save(); return endingScreen(); }
  }
  save();
  WORLD.afterBattle(result, trainer);
}

function evolve(m, into) {
  return new Promise(res => {
    const from = monName(m);
    screen(`
      <div class="evolve">
        <p>What? ${esc(from)} is evolving!</p>
        <div class="evo-stage">${sprite(m.sp, "evo-out")}${sprite(into, "evo-in")}</div>
        <p id="evomsg">&nbsp;</p>
      </div>`, "bg-title");
    sfx.level();
    setTimeout(() => {
      const before = stats(m).hp;
      m.sp = into;
      m.hp += stats(m).hp - before;
      sfx.catch();
      document.getElementById("evomsg").textContent = `${from} evolved into ${SPECIES[into].name}!`;
      S.seen[into] = S.caught[into] = true;
      save();
      setTimeout(res, 2200 * SPEED);
    }, 2600 * SPEED);
  });
}

// ---------- ending ----------
function endingScreen() {
  const confetti = Array.from({ length: 40 }, () => {
    const e = pick(["🎉", "🎂", "🎈", "✨", "🥳", "🎁"]);
    return `<span class="confetto" style="left:${rnd(0, 100)}%;animation-delay:${(Math.random() * 4).toFixed(2)}s;animation-duration:${(3 + Math.random() * 3).toFixed(2)}s">${e}</span>`;
  }).join("");
  screen(`
    <div class="ending">
      ${confetti}
      <div class="cake">${pixEmoji("🎂")}</div>
      <h1>Happy Birthday<br>${esc(CONFIG.hero)}!</h1>
      <p class="tiny">(also known as Mr Chicken)</p>
      ${CONFIG.age ? `<div class="age">${esc(CONFIG.age)}</div>` : ""}
      <div class="dialog">${esc(CONFIG.birthdayMessage)}</div>
      <div class="team-row">${S.team.map(m => sprite(m.sp, "sm")).join("")}</div>
      <p class="tiny">Collected ${Object.keys(S.caught).length}/${COLLECTABLE.length} Samsters</p>
      <button class="btn big" id="keep">Keep exploring</button>
    </div>`, "bg-party");
  music("fanfare");
  on("#keep", () => areaScreen(`Try to complete the ${CONFIG.dexName}!`));
}

// ---------- Game Boy controls ----------
// D-pad moves a cursor between whatever buttons are on screen, A presses,
// B goes back / skips text, START opens the team, SELECT the Samdex.
// Touching the screen directly still works too.
let navSel = null;
const navItems = () => [...$app.querySelectorAll("button:not([disabled]), input, #next")]
  .filter(el => el.offsetParent !== null);
function navSet(el) {
  if (navSel) navSel.classList.remove("sel");
  navSel = el || null;
  if (navSel) {
    navSel.classList.add("sel");
    const r = navSel.getBoundingClientRect(), f = $app.getBoundingClientRect();
    if (r.top < f.top || r.bottom > f.bottom) navSel.scrollIntoView({ block: "nearest" });
  }
}
function navEnsure() {
  if (navSel && $app.contains(navSel) && !navSel.disabled) return;
  const items = navItems();
  navSet(items.find(el => el.id === "cont") || items.find(el => !el.classList.contains("ghost") && el.dataset.back === undefined && el.id !== "back") || items[0]);
}
new MutationObserver(() => requestAnimationFrame(navEnsure)).observe($app, { childList: true, subtree: true });
function navMove(dir) {
  navEnsure();
  const items = navItems();
  if (!navSel) return;
  const c = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  const o = c(navSel);
  let best = null, bestD = Infinity;
  for (const el of items) {
    if (el === navSel) continue;
    const p = c(el), dx = p.x - o.x, dy = p.y - o.y;
    const ok = dir === "up" ? dy < -4 : dir === "down" ? dy > 4 : dir === "left" ? dx < -4 : dx > 4;
    if (!ok) continue;
    const main = dir === "up" || dir === "down" ? Math.abs(dy) : Math.abs(dx);
    const cross = dir === "up" || dir === "down" ? Math.abs(dx) : Math.abs(dy);
    const d = main + cross * 2.5;
    if (d < bestD) { bestD = d; best = el; }
  }
  if (best) { navSet(best); beep(520, 0.03); }
  else if (dir === "up" || dir === "down") $app.scrollBy({ top: dir === "up" ? -120 : 120, behavior: "smooth" });
}
window.HELD = { dir: null, b: false };
function press(key) {
  if (WORLD.active && !B && WORLD.key(key)) return;
  if (key === "up" || key === "down" || key === "left" || key === "right") return navMove(key);
  if (sayResolve && (key === "a" || key === "b")) return sayResolve();
  if (key === "a") {
    navEnsure();
    if (!navSel) return;
    if (navSel.tagName === "INPUT") { navSel.focus(); return; }
    navSel.click();
    return;
  }
  if (key === "b") {
    const back = $app.querySelector("[data-back], #back");
    if (back) back.click();
    else if ($app.querySelector("#next")) $app.querySelector("#next").click();
    return;
  }
  if (key === "start" && $app.querySelector("#team") && !B) return $app.querySelector("#team").click();
  if (key === "select") return toggleMute();
}
document.querySelectorAll("#pad [data-k]").forEach(btn => {
  let rep = null;
  const fire = () => press(btn.dataset.k);
  btn.addEventListener("pointerdown", e => {
    e.preventDefault(); btn.classList.add("pressed");
    const k = btn.dataset.k;
    if (btn.classList.contains("dp")) HELD.dir = k;
    if (k === "b") HELD.b = true;
    fire();
    if (btn.classList.contains("dp")) rep = setTimeout(function r() { fire(); rep = setTimeout(r, 140); }, 380);
  });
  const up = () => { btn.classList.remove("pressed"); clearTimeout(rep);
    if (HELD.dir === btn.dataset.k) HELD.dir = null; if (btn.dataset.k === "b") HELD.b = false; };
  btn.addEventListener("pointerup", up); btn.addEventListener("pointerleave", up); btn.addEventListener("pointercancel", up);
  btn.addEventListener("contextmenu", e => e.preventDefault());
});
document.addEventListener("keyup", e => {
  const k = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" }[e.key];
  if (k && HELD.dir === k) HELD.dir = null;
  if (e.key === "x" || e.key === "Backspace" || e.key === "Escape") HELD.b = false;
});
document.addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT" && e.key !== "Enter") return;
  const k = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", z: "a", Enter: "a", " ": "a", x: "b", Backspace: "b", Escape: "b", s: "start", a: "select" }[e.key];
  if (!k) return;
  e.preventDefault();
  if (["up", "down", "left", "right"].includes(k)) HELD.dir = k;
  if (k === "b") HELD.b = true;
  if (k === "a" && e.target.tagName === "INPUT") { e.target.blur(); const ok = $app.querySelector("#ok"); if (ok) ok.click(); return; }
  press(k);
});

// ---------- helpers for world.js ----------
window.PS = {
  S: () => S, save, music, sfx, beep, toggleMute, isMuted: () => muted, screen, esc, fill, heroName,
  healAll, makeMon, startBattle, teamScreen, dexScreen, giveStarters, pixURL,
  alive: () => alive(S.team),
};

// ---------- boot ----------
document.title = CONFIG.title;
titleScreen();
})();
