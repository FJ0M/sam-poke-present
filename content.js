// ============================================================
//  CONTENT — everything personal about Sam lives in this file.
//  Swap names, jokes, places and creatures here; game.js runs it.
// ============================================================

const CONFIG = {
  title: "SAMSTERS",
  subtitle: "Mr Chicken's Birthday Quest",
  hero: "Sam",
  hero_emoji: "🐔",
  from: "Freddie",
  age: "",                       // e.g. "35" — shown big on the ending screen
  ballName: "Tea Ball",
  ballEmoji: "🍵",
  dexName: "Samdex",
  healPlace: "the coffee shop",
  healEmoji: "☕",
  narrator: "Chloe",
  narratorEmoji: "👩",
  forcedName: "Mr Chicken",
  nameIntro: [
    "Chloe: Hello there! Welcome to the world of SAMSTERS!",
    "Chloe: This world is full of creatures called Samsters. Some are cats. Some are dogs. One is a croissant.",
    "Chloe: But first, tell me a little about yourself.",
  ],
  nameReaction: [
    "Chloe: MR CHICKEN! What a lovely name.",
    "Chloe: ...Oh, don't look at me like that. It's what everyone calls you.",
    "Chloe: Right then, {name}. Your very own Samster adventure is about to begin!",
  ],
  intro: [
    "It was {name}'s birthday, and he woke up ready for a big day of tea, running and cake.",
    "Then the post arrived. A letter from Tina, the coffee shop's accountant...",
    "\"Dear Sam, small VAT mix-up. You now owe A MASSIVE TAX BILL. Happy birthday! Tina.\"",
    "Tina is hiding in her office in Stroud. Only a true Samster trainer can get from Stonehouse to her door and make her fix it.",
    "Luckily, Luce, Spook and Marie are ready to help. Who will lead the way?"
  ],
  birthdayMessage:
    "Happy birthday Sam! You defeated Tina, fixed the VAT and saved the coffee shop. Here's to another year of ultras, WODs and way too many cups of tea. Love, Freddie & Georgina (and Ralph and Bonnie, sorry) 🎉",
};

// Type chart: each type beats the one listed in `beats`.
// Brew fuels you through Gains, Gains outmuscle Cardio, Cardio runs off the Brew.
const TYPES = {
  brew:   { name: "Brew",   emoji: "☕", color: "#c0814a", beats: "gains"  },
  gains:  { name: "Gains",  emoji: "💪", color: "#ef4444", beats: "cardio" },
  cardio: { name: "Cardio", emoji: "🏃", color: "#22b8cf", beats: "brew"   },
  cluck:  { name: "Cluck",  emoji: "🐔", color: "#a58cff", beats: null     },
};

// effect: heal | atkUp | defDown | spdUp
const MOVES = {
  // cluck (neutral)
  "peck":           { name: "Peck",             type: "cluck",  power: 40, acc: 100 },
  "zoomies":        { name: "Zoomies",          type: "cluck",  power: 60, acc: 95 },
  "flap-attack":    { name: "Flap Attack",      type: "cluck",  power: 75, acc: 90 },
  "chicken-dance":  { name: "Chicken Dance",    type: "cluck",  power: 0,  acc: 100, effect: "atkUp" },
  "cat-nap":        { name: "Cat Nap",          type: "cluck",  power: 0,  acc: 100, effect: "heal" },
  "slobber":        { name: "Slobber",          type: "cluck",  power: 0,  acc: 95,  effect: "defDown" },
  "snore":          { name: "Snore",            type: "cluck",  power: 0,  acc: 100, effect: "heal" },
  "judgy-stare":    { name: "Judgy Stare",      type: "cluck",  power: 0,  acc: 95,  effect: "defDown" },
  // brew
  "hot-sip":        { name: "Hot Sip",          type: "brew",   power: 45, acc: 100 },
  "espresso-shot":  { name: "Espresso Shot",    type: "brew",   power: 65, acc: 95 },
  "builders-brew":  { name: "Builder's Brew",   type: "brew",   power: 90, acc: 85 },
  "tea-break":      { name: "Tea Break",        type: "brew",   power: 0,  acc: 100, effect: "heal" },
  // gains
  "wall-ball":      { name: "Wall Ball",        type: "gains",  power: 45, acc: 100 },
  "kettlebell-swing": { name: "Kettlebell Swing", type: "gains", power: 65, acc: 95 },
  "deadlift":       { name: "Deadlift",         type: "gains",  power: 90, acc: 85 },
  "pump-up":        { name: "Pump Up",          type: "gains",  power: 0,  acc: 100, effect: "atkUp" },
  // cardio
  "jog-on":         { name: "Jog On",           type: "cardio", power: 45, acc: 100 },
  "hill-sprint":    { name: "Hill Sprint",      type: "cardio", power: 65, acc: 95 },
  "ultra-marathon": { name: "Ultra Marathon",   type: "cardio", power: 90, acc: 85 },
  "second-wind":    { name: "Second Wind",      type: "cardio", power: 0,  acc: 100, effect: "spdUp" },
  // boss
  "too-many-candles": { name: "Too Many Candles", type: "brew",  power: 80, acc: 90 },
  "midlife-crisis": { name: "Midlife Crisis",   type: "cluck",  power: 85, acc: 90 },
  "vat-bill":       { name: "Massive VAT Bill", type: "cluck",  power: 95, acc: 85 },
  "late-fee":       { name: "Late Filing Fee",  type: "brew",   power: 70, acc: 95 },
  "audit":          { name: "Surprise Audit",   type: "cluck",  power: 0,  acc: 95,  effect: "defDown" },
  "creative-accounting": { name: "Creative Accounting", type: "cluck", power: 0, acc: 100, effect: "heal" },
  "paper-cut":      { name: "Paper Cut",        type: "gains",  power: 60, acc: 100 },
  "decimal-error":  { name: "Decimal Error",    type: "cardio", power: 70, acc: 90 },
};

const LUCE_MOVES  = [[1,"peck"],[1,"jog-on"],[4,"second-wind"],[9,"hill-sprint"],[13,"zoomies"],[17,"ultra-marathon"]];
const SPOOK_MOVES = [[1,"peck"],[1,"hot-sip"],[4,"judgy-stare"],[9,"espresso-shot"],[13,"tea-break"],[17,"builders-brew"]];
const MARIE_MOVES = [[1,"peck"],[1,"wall-ball"],[4,"cat-nap"],[9,"kettlebell-swing"],[13,"pump-up"],[17,"deadlift"]];

// base stats roughly 40-110. moves: [levelLearned, moveId]
const SPECIES = {
  // --- starters: Sam's cats (3 stages each, pixel art in pixels.js) ---
  luce:      { name: "Luce",       emoji: "🐈", type: "cardio", base: { hp: 42, atk: 55, def: 42, spd: 66 }, xp: 55, catchRate: 0.2,
               moves: LUCE_MOVES, evolve: { at: 8, into: "lucy" }, flavor: "A black and white fluffball. Does 3am laps of the house 'for training'." },
  lucy:      { name: "Lucy",       emoji: "🐈", type: "cardio", base: { hp: 58, atk: 72, def: 54, spd: 82 }, xp: 90, catchRate: 0,
               moves: LUCE_MOVES, evolve: { at: 16, into: "lucius" }, flavor: "Sam's running buddy. Fluffier with every mile." },
  lucius:    { name: "Lucius",     emoji: "🐈", type: "cardio", base: { hp: 72, atk: 90, def: 66, spd: 100 }, xp: 130, catchRate: 0,
               moves: LUCE_MOVES, flavor: "Emperor of the ultra trail. Has never once been overtaken. Still wants dinner at 5pm sharp." },
  spook:     { name: "Spook",      emoji: "🐈‍⬛", type: "brew", base: { hp: 48, atk: 52, def: 48, spd: 55 }, xp: 55, catchRate: 0.2,
               moves: SPOOK_MOVES, evolve: { at: 8, into: "spooks" }, flavor: "A tiny black cat. Appears silently whenever a kettle boils." },
  spooks:    { name: "Spooks",     emoji: "🐈‍⬛", type: "brew", base: { hp: 64, atk: 68, def: 60, spd: 66 }, xp: 90, catchRate: 0,
               moves: SPOOK_MOVES, evolve: { at: 16, into: "spookus" }, flavor: "Haunts the coffee shop. Only drinks tea, out of spite." },
  spookus:   { name: "Spookus",    emoji: "🐈‍⬛", type: "brew", base: { hp: 82, atk: 84, def: 74, spd: 78 }, xp: 130, catchRate: 0,
               moves: SPOOK_MOVES, flavor: "A legend whispered about in tea rooms. Its stare can cool a cuppa instantly." },
  marie:     { name: "Marie",      emoji: "🐱", type: "gains", base: { hp: 52, atk: 52, def: 58, spd: 44 }, xp: 55, catchRate: 0.2,
               moves: MARIE_MOVES, evolve: { at: 8, into: "marigold" }, flavor: "A little calico. Sits on Sam's back during push-ups for extra resistance." },
  marigold:  { name: "Marigold",   emoji: "🐱", type: "gains", base: { hp: 68, atk: 66, def: 72, spd: 52 }, xp: 90, catchRate: 0,
               moves: MARIE_MOVES, evolve: { at: 16, into: "marigoldus" }, flavor: "Has her own spot at the CrossFit box. Nobody dares take it." },
  marigoldus:{ name: "Marigoldus", emoji: "🐱", type: "gains", base: { hp: 88, atk: 80, def: 88, spd: 60 }, xp: 130, catchRate: 0,
               moves: MARIE_MOVES, flavor: "PB on every lift. Then naps for 20 hours to recover." },

  // --- wild ---
  chicklet:  { name: "Chicklet",    emoji: "🐣", type: "cluck",  base: { hp: 40, atk: 45, def: 40, spd: 55 }, xp: 40, catchRate: 0.75,
               moves: [[1,"peck"],[1,"chicken-dance"],[8,"flap-attack"]], flavor: "A tiny Mr Chicken in training." },
  beanie:    { name: "Beanie",      emoji: "🫘", type: "brew",   base: { hp: 45, atk: 50, def: 45, spd: 50 }, xp: 40, catchRate: 0.7,
               moves: [[1,"peck"],[1,"hot-sip"],[9,"espresso-shot"]], flavor: "A coffee bean with big dreams of being tea." },
  croissnack:{ name: "Croissnack",  emoji: "🥐", type: "cluck",  base: { hp: 55, atk: 40, def: 50, spd: 30 }, xp: 40, catchRate: 0.7,
               moves: [[1,"peck"],[1,"cat-nap"],[10,"flap-attack"]], flavor: "Flaky. Buttery. Always on the counter at the coffee shop." },
  towpathduck:{ name: "Towpath Duck", emoji: "🦆", type: "cardio", base: { hp: 45, atk: 45, def: 40, spd: 60 }, xp: 40, catchRate: 0.7,
               moves: [[1,"peck"],[1,"jog-on"],[8,"zoomies"],[11,"hill-sprint"]], flavor: "Lives on the Stroudwater Canal. Races every runner on the towpath. Usually wins." },
  moochinhampton:{ name: "Moochinhampton", emoji: "🐄", type: "gains", base: { hp: 80, atk: 65, def: 70, spd: 35 }, xp: 65, catchRate: 0.5,
               moves: [[1,"wall-ball"],[1,"judgy-stare"],[12,"kettlebell-swing"],[16,"deadlift"]], flavor: "Grazes the commons. Refuses to move off the road for anyone." },
  shakey:    { name: "Shakey",      emoji: "🥤", type: "gains",  base: { hp: 50, atk: 50, def: 45, spd: 55 }, xp: 45, catchRate: 0.65,
               moves: [[1,"peck"],[1,"wall-ball"],[9,"kettlebell-swing"]], flavor: "A protein shake that never stops talking about macros." },
  boxroo:    { name: "Boxroo",      emoji: "🦘", type: "cardio", base: { hp: 50, atk: 55, def: 45, spd: 65 }, xp: 50, catchRate: 0.6,
               moves: [[1,"jog-on"],[1,"second-wind"],[10,"hill-sprint"]], flavor: "Box jumps for fun. 400 of them. Before breakfast." },
  kettlebear:{ name: "Kettlebear",  emoji: "🐻", type: "gains",  base: { hp: 65, atk: 70, def: 60, spd: 40 }, xp: 60, catchRate: 0.5,
               moves: [[1,"wall-ball"],[1,"pump-up"],[11,"kettlebell-swing"],[16,"deadlift"]], flavor: "Lives at the CrossFit box. Has never been seen leaving." },
  blisterbug:{ name: "Blisterbug",  emoji: "🐞", type: "cardio", base: { hp: 45, atk: 60, def: 50, spd: 70 }, xp: 55, catchRate: 0.55,
               moves: [[1,"jog-on"],[1,"judgy-stare"],[11,"hill-sprint"],[16,"ultra-marathon"]], flavor: "Appears around mile 40. Every ultra runner knows it." },
  trailgoat: { name: "Trail Goat",  emoji: "🐐", type: "cardio", base: { hp: 60, atk: 65, def: 60, spd: 70 }, xp: 65, catchRate: 0.5,
               moves: [[1,"jog-on"],[1,"zoomies"],[12,"hill-sprint"],[16,"ultra-marathon"]], flavor: "Laughs at your hill repeats. Does them backwards." },
  teapotamus:{ name: "Teapotamus",  emoji: "🦛", type: "brew",   base: { hp: 75, atk: 65, def: 65, spd: 40 }, xp: 70, catchRate: 0.45,
               moves: [[1,"hot-sip"],[1,"tea-break"],[12,"espresso-shot"],[16,"builders-brew"]], flavor: "Holds 400 cups of tea. Sam's dream Samster." },
  cakemimic: { name: "Cakemimic",   emoji: "🎂", type: "cluck",  base: { hp: 75, atk: 70, def: 70, spd: 70 }, xp: 90, catchRate: 0.3,
               moves: [[1,"flap-attack"],[1,"chicken-dance"],[12,"too-many-candles"],[16,"midlife-crisis"]], flavor: "A birthday cake that bites back." },
  mrchicken: { name: "Mr Chicken",  emoji: "🐓", type: "cluck",  base: { hp: 90, atk: 90, def: 80, spd: 85 }, xp: 120, catchRate: 0.2,
               moves: [[1,"flap-attack"],[1,"chicken-dance"],[1,"ultra-marathon"],[1,"deadlift"]], flavor: "LEGENDARY. Runs ultras, lifts heavy, drinks tea. Chloe's favourite." },

  // --- friends' pets ---
  ralph:     { name: "Ralph",       emoji: "🐶", type: "cluck",  base: { hp: 55, atk: 45, def: 50, spd: 25 }, xp: 50, catchRate: 0,
               moves: [[1,"peck"],[1,"snore"],[1,"slobber"],[5,"zoomies"]], flavor: "French bulldog. Snores. Drools. Sam remains unconvinced." },
  bonnie:    { name: "Bonnie",      emoji: "🐶", type: "cluck",  base: { hp: 50, atk: 50, def: 45, spd: 35 }, xp: 50, catchRate: 0,
               moves: [[1,"peck"],[1,"slobber"],[1,"zoomies"],[5,"snore"]], flavor: "French bulldog. Wants to be Sam's best friend. Sam disagrees." },
  jkdog:     { name: "Pack Pup",    emoji: "🐕", type: "cardio", base: { hp: 50, atk: 55, def: 45, spd: 60 }, xp: 50, catchRate: 0,
               moves: [[1,"zoomies"],[1,"jog-on"],[1,"slobber"],[8,"hill-sprint"]], flavor: "One of Jaz and Kim's four dogs. There's always another one." },
  jkcat:     { name: "Kim's Cat",   emoji: "🐈", type: "brew",   base: { hp: 55, atk: 60, def: 50, spd: 60 }, xp: 55, catchRate: 0,
               moves: [[1,"hot-sip"],[1,"judgy-stare"],[1,"espresso-shot"],[1,"cat-nap"]], flavor: "Outnumbered four to one by dogs. Completely unbothered." },
  jkrabbit:  { name: "Jaz's Rabbit",emoji: "🐇", type: "gains",  base: { hp: 55, atk: 60, def: 55, spd: 65 }, xp: 55, catchRate: 0,
               moves: [[1,"wall-ball"],[1,"pump-up"],[1,"kettlebell-swing"],[1,"zoomies"]], flavor: "Does box jumps. Thinks CrossFit was its idea." },
  winnie:    { name: "Winnie",      emoji: "🐕", type: "cardio", base: { hp: 85, atk: 80, def: 70, spd: 90 }, xp: 120, catchRate: 0,
               moves: [[1,"zoomies"],[1,"hill-sprint"],[1,"slobber"],[1,"ultra-marathon"]], flavor: "Chloe's Jack Russell and Sam's favourite. Unlimited energy, unlimited love." },

  // --- the villain ---
  receipt:   { name: "Receipt Gremlin", emoji: "🧾", type: "gains", base: { hp: 65, atk: 65, def: 65, spd: 60 }, xp: 80, catchRate: 0,
               moves: [[1,"paper-cut"],[1,"audit"],[1,"zoomies"],[1,"late-fee"]], flavor: "Every receipt Sam ever lost. They found each other." },
  spreadsheet:{ name: "Spreadshriek", emoji: "📊", type: "cardio", base: { hp: 70, atk: 65, def: 75, spd: 55 }, xp: 85, catchRate: 0,
               moves: [[1,"decimal-error"],[1,"audit"],[1,"paper-cut"],[1,"flap-attack"]], flavor: "A spreadsheet where every formula is wrong. Screams in Excel errors." },
  tina:      { name: "Tina",          emoji: "👩‍💼", type: "cluck", base: { hp: 105, atk: 82, def: 78, spd: 62 }, xp: 220, catchRate: 0, boss: true,
               moves: [[1,"vat-bill"],[1,"late-fee"],[1,"audit"],[1,"creative-accounting"]], flavor: "The coffee shop's accountant. Messed up the VAT. Blames Sam." },
};

const STARTERS = ["luce", "spook", "marie"];

// Each area has a trainer you must beat to unlock the next one.
// wild: [species, minLevel, maxLevel, weight(optional, default 10)]
const AREAS = [
  { id: "shop", name: "Stonehouse", emoji: "☕", bg: ["#fde68a", "#f5c28b"],
    desc: "Home turf. The coffee shop smells amazing and Sam is, of course, drinking tea. Ducks patrol the canal.",
    wild: [["chicklet",2,4],["beanie",2,4],["croissnack",3,4],["towpathduck",2,4,6]],
    trainer: { name: "Freddie & Georgina", emoji: "👫",
               intro: "Happy birthday Sam! Ralph and Bonnie are SO excited to see you!",
               win: "Ralph is licking your shoe in defeat. He still loves you.",
               team: [["ralph",4],["bonnie",5]] } },
  { id: "box", name: "Stroud CrossFit Box", emoji: "🏋️", bg: ["#fca5a5", "#fdba74"],
    desc: "Up the hill into Stroud. Chalk in the air, chalk on the floor, chalk in Sam's tea.",
    wild: [["shakey",5,8],["boxroo",5,8],["towpathduck",5,7,5],["kettlebear",7,8,5],["luce",6,7,2],["spook",6,7,2],["marie",6,7,2]],
    trainer: { name: "Jaz & Kim", emoji: "👭",
               intro: "Today's WOD: beat all six of our pets. For time!",
               win: "Okay, okay! Everybody back in the car. ALL of you.",
               team: [["jkrabbit",7],["jkdog",7],["jkdog",8],["jkcat",8],["jkdog",8],["jkdog",9]] } },
  { id: "trail", name: "Selsley Common", emoji: "⛰️", bg: ["#86efac", "#7dd3fc"],
    desc: "The Cotswold Way across the Five Valleys. Mud, hills and cows. Sam calls 50 miles of this 'a nice day out'.",
    wild: [["blisterbug",9,12],["trailgoat",9,12],["moochinhampton",9,12],["teapotamus",10,12,4]],
    trainer: { name: "Chloe", emoji: "👩",
               intro: "Morning, Mr Chicken! Winnie's been waiting for you all day. Let's see what you've got!",
               win: "Not bad, Mr Chicken! Now go sort out that VAT bill. Winnie's coming to cheer you on.",
               team: [["chicklet",13],["winnie",14]] } },
  { id: "tower", name: "Tina's Tax Office", emoji: "🏢", bg: ["#cbd5e1", "#a5b4fc"],
    desc: "Up some creaky stairs off Stroud high street. Grey carpet, beige walls, and a filing cabinet that hums menacingly.",
    wild: [["teapotamus",13,16],["moochinhampton",13,16],["kettlebear",13,16],["cakemimic",14,16,4],["mrchicken",16,18,2]],
    trainer: { name: "Tina the Accountant", emoji: "👩‍💼", boss: true,
               intro: "Ah, Sam. About that VAT... it's technically YOUR fault. Now, about my invoice for telling you!",
               win: "Fine! FINE! I'll refile the VAT return. And... happy birthday, Sam. Invoice to follow.",
               team: [["receipt",15],["spreadsheet",16],["tina",18]] } },
];
