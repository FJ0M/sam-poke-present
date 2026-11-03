// ============================================================
//  MINIGAMES — little arcade bits that break up the walking.
//   wallBalls(): 50 wall balls at Golden Valley CrossFit (Egg's WOD)
//   inspector(): no ticket on the train, so sneak to the toilet
//  Each one takes over the screen and resolves a promise when done.
//  Input: A (or tap) and the d-pad, routed here while MINI is set.
// ============================================================
(() => {
const $app = document.getElementById("app");
const FAST = /[?&]fast\b/.test(location.search);
const look = (l, d) => window.WORLD.look(l, d);
const sfx = () => window.PS.sfx;

function stage(title, hud) {
  $app.className = "mini";
  $app.innerHTML = `<div class="mini-wrap"><h2 class="mini-title">${title}</h2><canvas id="mg" width="160" height="144"></canvas>
    <div class="mini-hud">${hud}</div><p class="mini-msg" id="mgmsg"></p><button class="btn ghost" id="mgquit" data-back="1">Give up</button></div>`;
  const c = document.getElementById("mg"), x = c.getContext("2d"); x.imageSmoothingEnabled = false;
  return { c, x, msg: t => { const m = document.getElementById("mgmsg"); if (m) m.textContent = t; } };
}
const r = (x, c, X, Y, w, h) => { x.fillStyle = c; x.fillRect(Math.round(X), Math.round(Y), w, h); };

// ---------- WALL BALLS ----------
// Squat, then time the drive: press A when the marker is in the green. Good timing = the ball hits the target.
// Every rep costs stamina; tired legs make the marker faster and the green smaller. Run out and you have to rest.
function wallBalls() {
  return new Promise(done => {
    const CAP = 180, GOAL = 50;
    const S = stage("50 WALL BALLS", `<div class="row"><b id="wbReps">0/${GOAL}</b><span id="wbTime">3:00</span></div>
      <div class="meter"><div class="zone" id="wbZone"></div><div class="cur" id="wbCur"></div></div>
      <div class="row small"><span>Stamina</span><div class="stam"><div id="wbStam"></div></div></div>`);
    let reps = 0, stam = 100, t0 = performance.now(), last = t0, pos = 0, dir = 1, zone = 0.5, phase = "ready", phaseT = 0, ball = null, over = false, tired = 0;
    const lines = { 10: "Sam: I hate wall balls.", 20: "Egg: Chest up! Squat deep!", 25: "Egg: HALFWAY! Big breath!", 35: "Sam: Why did I open a coffee shop next to a CrossFit box", 40: "Sam: Never. Again.", 49: "Egg: ONE MORE!!" };
    const zoneW = () => 0.12 + 0.2 * (stam / 100);
    const newZone = () => { zone = 0.25 + Math.random() * 0.5; };
    newZone();
    S.msg("Press A in the green to drive the ball up to the target!");
    function press() {
      if (over) return;
      if (phase === "rest") { S.msg("Still catching your breath..."); return; }
      if (phase !== "ready") return;
      const off = Math.abs(pos - zone), w = zoneW() / 2;
      const good = off <= w, close = off <= w * 1.8;
      stam -= good ? 4 : close ? 7 : 9;
      ball = { y: 104, vy: good ? -212 : close ? -178 : -140, good, hit: false };
      phase = "throw"; phaseT = 0;
      if (good) sfx().hit(); else sfx().miss();
      S.msg(good ? (off < w * 0.35 ? "Perfect rep!" : "Good rep!") : close ? "No rep! Just under the line." : "No rep! Way short.");
    }
    function finish(win) {
      if (over) return; over = true; window.MINI = null;
      const secs = Math.round((performance.now() - t0) / 1000);
      setTimeout(() => done({ win, reps, secs }), FAST ? 30 : 900);
    }
    window.MINI = { key: k => { if (k === "a") press(); else if (k === "b") finish(false); return true; } };
    document.getElementById("mg").addEventListener("pointerdown", e => { e.preventDefault(); press(); });
    document.getElementById("mgquit").addEventListener("click", () => finish(false));
    const sam = look("sam", "up");
    function loop(now) {
      if (over && phase !== "throw") { draw(now); return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const left = Math.max(0, CAP - (now - t0) / 1000);
      const speed = 0.7 + 1.1 * (1 - stam / 100);
      if (phase === "ready") { pos += dir * speed * dt; if (pos > 1) { pos = 1; dir = -1; } if (pos < 0) { pos = 0; dir = 1; } }
      if (phase === "throw" && ball) {
        ball.vy += 260 * dt; ball.y += ball.vy * dt;
        if (ball.good && !ball.hit && ball.y <= 30) { ball.hit = true; reps++; sfx().beep(660 + reps * 6, 0.05);
          if (lines[reps]) S.msg(lines[reps]); }
        if (ball.y >= 104 && ball.vy > 0) { ball = null; newZone();
          if (reps >= GOAL) { S.msg("50 REPS! Sam collapses onto the floor. Egg is impressed."); phase = "done"; finish(true); }
          else if (stam <= 0) { phase = "rest"; phaseT = 0; S.msg("Gassed! Hands on knees... (resting)"); }
          else phase = "ready"; }
      }
      if (phase === "rest") { phaseT += dt; stam = Math.min(100, stam + 16 * dt); if (phaseT > 2.4) { phase = "ready"; S.msg("Back on the ball. Go!"); } }
      if (!over && left <= 0) { S.msg(`TIME! ${reps} reps. Egg shakes his egg-shaped head.`); finish(false); }
      // HUD
      const q = id => document.getElementById(id);
      if (!q("wbReps")) return;
      q("wbReps").textContent = `${reps}/${GOAL}`;
      q("wbTime").textContent = `${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, "0")}`;
      q("wbStam").style.width = Math.max(0, stam) + "%";
      q("wbStam").style.background = stam > 50 ? "#22c55e" : stam > 20 ? "#facc15" : "#ef4444";
      q("wbZone").style.left = (zone - zoneW() / 2) * 100 + "%"; q("wbZone").style.width = zoneW() * 100 + "%";
      q("wbCur").style.left = pos * 100 + "%";
      draw(now);
      requestAnimationFrame(loop);
    }
    function draw(now) {
      const x = S.x;
      r(x, "#3f4654", 0, 0, 160, 144); // gym wall
      for (let i = 0; i < 160; i += 20) r(x, "#363c49", i, 0, 1, 112);
      r(x, "#ef4444", 50, 28, 60, 3); r(x, "#fff", 50, 31, 60, 1); // 10ft target
      r(x, "#facc15", 2, 4, 40, 9); x.fillStyle = "#1b1530"; x.font = "7px monospace"; x.fillText("GVCF", 6, 11);
      r(x, "#1f2937", 0, 112, 160, 32); for (let i = 0; i < 160; i += 16) r(x, "#273244", i, 112, 8, 32); // rubber floor
      // Sam: squat while waiting, extend on the throw
      const squat = phase === "ready" ? 0.72 : phase === "rest" ? 0.6 : 1;
      const h = 48 * squat;
      x.drawImage(sam, 56, 112 - h, 48, h);
      if (phase === "rest") { r(x, "#93c5fd", 98, 112 - h, 2, 3); r(x, "#93c5fd", 60, 112 - h + 4, 2, 3); }
      // ball
      const by = ball ? ball.y : 112 - h - 6;
      r(x, "#1b1530", 76, by - 1, 10, 10); r(x, "#b91c1c", 77, by, 8, 8); r(x, "#ef4444", 78, by + 1, 3, 2);
      if (ball && ball.hit && ball.y < 40) { r(x, "#fde047", 70, 24, 3, 3); r(x, "#fde047", 88, 22, 3, 3); }
      // Egg watching from the side, arms crossed
      x.drawImage(look("egg", "left"), 124, 80, 32, 32);
    }
    requestAnimationFrame(loop);
  });
}

// ---------- TICKET INSPECTOR ----------
// No ticket. The inspector works down the carriage towards you. While he is checking someone's ticket
// (head down) you can sneak towards the toilet. When he looks up, FREEZE. Reach the toilet and lock it.
function inspector() {
  return new Promise(done => {
    const S = stage("TICKETS PLEASE!", `<p class="tiny">Hold ◀ to sneak to the toilet. Freeze when the inspector looks up!</p>
      <div class="row"><span id="inState">📋 Checking tickets...</span></div>`);
    let samX = 118, insX = 168, state = "walk", stT = 0, stDur = 1.2, warn = false, over = false, last = performance.now(), moving = false, held = false, caughtT = 0;
    const SEATS = [140, 124, 104, 84, 64, 44];
    let nextSeat = 0;
    const end = res => { if (over) return; over = true; window.MINI = null; setTimeout(() => done(res), FAST ? 30 : 1600); };
    window.MINI = { key: () => true }; // the d-pad hold (HELD.dir) or holding the screen moves Sam
    const cv = document.getElementById("mg");
    cv.addEventListener("pointerdown", e => { e.preventDefault(); held = true; });
    const up = () => { held = false; }; cv.addEventListener("pointerup", up); cv.addEventListener("pointerleave", up);
    document.addEventListener("keyup", up, { once: false });
    document.getElementById("mgquit").remove();
    const samImg = { l: look("sam", "left"), d: look("sam", "down") }, ins = { l: look("inspector", "left"), d: look("inspector", "down"), u: look("inspector", "up") };
    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const holding = held || window.HELD?.dir === "left";
      if (!over) {
        stT += dt;
        if (state === "walk") { // looking up the aisle: danger
          insX -= 12 * dt;
          if (nextSeat < SEATS.length && insX <= SEATS[nextSeat]) { state = "check"; stT = 0; stDur = 1.4 + Math.random() * 1.6; nextSeat++; }
        } else if (state === "check") { // head down: safe
          warn = stT > stDur - 0.45;
          if (stT >= stDur) { state = "walk"; stT = 0; warn = false; }
        }
        moving = holding && samX > 10;
        if (moving) { samX -= 22 * dt; held = held && true; }
        if (moving && state === "walk" && insX - samX < 150) { state = "caught"; caughtT = 0; window.PS.sfx.miss(); S.msg("Inspector: OI! You! Tickets please!"); end("caught"); }
        if (insX - samX < 10 && state !== "caught") { state = "caught"; S.msg("Inspector: Ticket please, sir."); end("caught"); }
        if (samX <= 10 && state !== "caught") { state = "hid"; S.msg("Click. ENGAGED. Sam holds his breath..."); end("hid"); }
        const st = document.getElementById("inState");
        if (st) st.textContent = state === "walk" ? "👀 LOOKING! Freeze!" : warn ? "⚠️ He's about to look up!" : state === "check" ? "📋 Checking tickets... sneak!" : "";
      }
      draw(now);
      if (!over || performance.now() - last < 2000) requestAnimationFrame(loop);
    }
    function draw(now) {
      const x = S.x;
      r(x, "#cbd5e1", 0, 0, 160, 144); r(x, "#94a3b8", 0, 0, 160, 30);
      for (let i = 20; i < 160; i += 34) { r(x, "#1e3a5f", i, 6, 24, 16); r(x, (Math.floor(now / 120) + i) % 7 < 3 ? "#bbf7d0" : "#86efac", i + 2, 8, 20, 12); } // windows, fields whizzing by
      r(x, "#475569", 0, 30, 160, 2);
      // seats with passengers
      for (const s of [140, 124, 104, 84, 64, 44]) { r(x, "#1d4ed8", s - 6, 40, 12, 20); r(x, "#1e40af", s - 6, 56, 12, 4); r(x, "#1d4ed8", s - 6, 96, 12, 20); r(x, "#1e40af", s - 6, 112, 12, 4); }
      r(x, "#64748b", 0, 62, 160, 32); // aisle
      // toilet door
      r(x, "#e5e7eb", 0, 36, 14, 58); r(x, "#1b1530", 0, 36, 14, 1); r(x, state === "hid" ? "#ef4444" : "#22c55e", 4, 58, 6, 4);
      x.fillStyle = "#1b1530"; x.font = "6px monospace"; x.fillText("WC", 2, 46);
      // sam and inspector
      x.drawImage(moving ? samImg.l : samImg.d, samX - 8, 62 + (moving && (Math.floor(now / 120) & 1) ? -1 : 0), 24, 24);
      const ii = state === "check" ? ins.d : ins.l;
      x.drawImage(ii, insX - 8, 64, 24, 24);
      if (state === "walk" || state === "caught") { r(x, "#fff", insX - 2, 54, 10, 8); r(x, "#ef4444", insX + 2, 55, 2, 4); r(x, "#ef4444", insX + 2, 60, 2, 1); }
      else if (state === "check") { r(x, "#fefce8", insX + 2, 76, 6, 5); }
      if (state === "hid") { r(x, "#ef4444", 2, 36, 10, 6); }
    }
    requestAnimationFrame(loop);
  });
}

window.MINIGAMES = { wallBalls, inspector };
})();
