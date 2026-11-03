// ============================================================
//  CONTENT — everything personal about Sam lives in this file.
//  Story, creatures, moves, types. Maps live in maps.js.
// ============================================================

const CONFIG = {
  title: "POCKET SAM",
  subtitle: "Mr Chicken's Birthday Quest",
  hero: "Sam",
  from: "Freddie",
  age: "",                       // e.g. "35", shown big on the ending screen
  ballName: "Tea Ball",
  ballEmoji: "🍵",
  dexName: "Samdex",
  creatureWord: "Samster",
  professor: "Prof. Doverow",
  forcedName: "Mr Chicken",
  profIntro: [
    "Prof. Doverow: Well hello there! Welcome to the Five Valleys!",
    "Prof. Doverow: My name is Doverow. People round here call me the Samster Professor. I live up on the hill, mostly.",
    "Prof. Doverow: From the canal at Stonehouse to the commons above Stroud, these valleys are full of creatures called SAMSTERS.",
    "Prof. Doverow: Some are cats. Some are birds. One is, I'm told, a wheel of Double Gloucester.",
    "Prof. Doverow: Now then. Tell me a little about yourself.",
  ],
  nameReaction: [
    "Prof. Doverow: ...",
    "Prof. Doverow: Hmm. No, I don't think that's right.",
    "Prof. Doverow: Your name is MR CHICKEN.",
    "Prof. Doverow: Your wife told me. Everyone calls you that.",
    "Prof. Doverow: Right then, MR CHICKEN! Your very own Samster adventure is about to begin!",
  ],
  wakeUp: [
    "...",
    "It's your birthday! You've dozed off on the sofa again.",
    "Luce, Spook and Marie are staring at you. It's probably dinner time.",
  ],
  letter: [
    "There's a letter on the doormat. It's from Tina, the coffee shop's accountant...",
    "\"Dear Sam. Small VAT mix-up. You now owe A MASSIVE TAX BILL. Happy birthday! Tina.\"",
    "Tina's office is up in Stroud. Time to go and have a word, with the cats.",
  ],
  catsJoin: "Luce, Spook and Marie joined your team!",
  birthdayMessage:
    "Happy birthday Sam! You defeated Tina, fixed the VAT and saved the coffee shop. Here's to another year of ultras, WODs and way too many cups of tea. Love, Freddie & Georgina (and Ralph and Bonnie, sorry) 🎉",
};

// Type chart: strong = deals double damage to these; weak = deals half to these.
const TYPES = {
  normal:   { name: "Normal",   color: "#a8a29e", strong: [],                   weak: ["ghost"] },
  fire:     { name: "Fire",     color: "#f97316", strong: ["grass"],            weak: ["fire", "water", "dragon"] },
  water:    { name: "Water",    color: "#3b82f6", strong: ["fire"],             weak: ["water", "grass", "dragon"] },
  grass:    { name: "Grass",    color: "#22c55e", strong: ["water"],            weak: ["fire", "grass", "flying", "dragon"] },
  flying:   { name: "Flying",   color: "#7dd3fc", strong: ["grass", "fighting"], weak: [] },
  fighting: { name: "Fighting", color: "#dc2626", strong: ["normal", "dark"],   weak: ["flying", "psychic", "ghost"] },
  psychic:  { name: "Psychic",  color: "#ec4899", strong: ["fighting"],         weak: ["psychic", "dark"] },
  dark:     { name: "Dark",     color: "#4b3f5c", strong: ["psychic", "ghost"], weak: ["fighting", "dark"] },
  ghost:    { name: "Ghost",    color: "#7c3aed", strong: ["ghost", "psychic"], weak: ["normal", "dark"] },
  dragon:   { name: "Dragon",   color: "#6366f1", strong: ["dragon"],           weak: [] },
};

// effect: heal | atkUp | defDown | spdUp
const M = (name, type, power, acc = 100, effect) => ({ name, type, power, acc, effect });
const MOVES = {
  // normal
  "peck": M("Peck", "normal", 40), "jog-on": M("Jog On", "normal", 45), "zoomies": M("Zoomies", "normal", 60, 95),
  "hill-sprint": M("Hill Sprint", "normal", 65, 95), "ultra-marathon": M("Ultra Marathon", "normal", 90, 85),
  "flap-attack": M("Flap Attack", "normal", 75, 90), "cheese-roll": M("Cheese Roll", "normal", 80, 90),
  "chicken-dance": M("Chicken Dance", "normal", 0, 100, "atkUp"), "cat-nap": M("Cat Nap", "normal", 0, 100, "heal"),
  "judgy-stare": M("Judgy Stare", "normal", 0, 95, "defDown"), "slobber": M("Slobber", "normal", 0, 95, "defDown"),
  "snore": M("Snore", "normal", 0, 100, "heal"), "second-wind": M("Second Wind", "normal", 0, 100, "spdUp"),
  "paper-cut": M("Paper Cut", "normal", 60),
  // dark
  "midnight-hiss": M("Midnight Hiss", "dark", 45), "shadow-pounce": M("Shadow Pounce", "dark", 65, 95),
  "witching-hour": M("Witching Hour", "dark", 90, 85), "hidden-fees": M("Hidden Fees", "dark", 70, 95),
  "vat-bill": M("Massive VAT Bill", "dark", 95, 85), "audit": M("Surprise Audit", "dark", 0, 95, "defDown"),
  // psychic
  "mind-purr": M("Mind Purr", "psychic", 45), "third-eye": M("Third Eye", "psychic", 65, 95),
  "purrnormal": M("Purrnormal Activity", "psychic", 90, 85), "decimal-error": M("Decimal Error", "psychic", 70, 90),
  "creative-accounting": M("Creative Accounting", "psychic", 0, 100, "heal"),
  // fire
  "hot-sip": M("Hot Sip", "fire", 45), "espresso-shot": M("Espresso Shot", "fire", 65, 95),
  "builders-brew": M("Builder's Brew", "fire", 90, 85), "scarlet-blaze": M("Stroud Scarlet", "fire", 75, 90),
  // water
  "spit-take": M("Spit Take", "water", 45), "canal-splash": M("Canal Splash", "water", 65, 95),
  "tidal-bore": M("Tidal Bore", "water", 95, 85), "tea-break": M("Tea Break", "water", 0, 100, "heal"),
  // grass
  "leaf-flick": M("Leaf Flick", "grass", 45), "wild-garlic": M("Wild Garlic Breath", "grass", 65, 95),
  "beechwood-bash": M("Beechwood Bash", "grass", 90, 85),
  // flying
  "wing-slap": M("Wing Slap", "flying", 45), "dive-bomb": M("Dive Bomb", "flying", 65, 95),
  "thermal-soar": M("Thermal Soar", "flying", 90, 85),
  // fighting
  "wall-ball": M("Wall Ball", "fighting", 45), "kettlebell-swing": M("Kettlebell Swing", "fighting", 65, 95),
  "burpee-blitz": M("Burpee Blitz", "fighting", 75, 90), "deadlift": M("Deadlift", "fighting", 90, 85),
  "pump-up": M("Pump Up", "fighting", 0, 100, "atkUp"),
  // ghost
  "spooky-wail": M("Spooky Wail", "ghost", 45), "haunt": M("Haunt", "ghost", 65, 95),
  "poltergeist": M("Poltergeist Party", "ghost", 90, 85),
  // dragon
  "dragon-snort": M("Dragon Snort", "dragon", 60), "deerhurst-fury": M("Deerhurst Fury", "dragon", 95, 85),
};

// sp(name, emoji, type, [hp, atk, def, spd], xp, catchRate, moves, extra)
// emoji draws the sprite (auto-pixelated); `tint` hue-shifts it; `badge` adds a small second emoji.
// Hand-drawn sprites in pixels.js override the emoji.
const sp = (name, emoji, type, [hp, atk, def, spd], xp, catchRate, moves, extra = {}) =>
  ({ name, emoji, type, base: { hp, atk, def, spd }, xp, catchRate, moves, ...extra });

const LUCE_MOVES  = [[1,"peck"],[1,"jog-on"],[4,"second-wind"],[9,"hill-sprint"],[13,"zoomies"],[17,"ultra-marathon"]];
const SPOOK_MOVES = [[1,"peck"],[1,"midnight-hiss"],[4,"judgy-stare"],[9,"shadow-pounce"],[13,"cat-nap"],[17,"witching-hour"]];
const MARIE_MOVES = [[1,"peck"],[1,"mind-purr"],[4,"cat-nap"],[9,"third-eye"],[13,"chicken-dance"],[17,"purrnormal"]];

const SPECIES = {
  // --- Sam's cats: you get all three ---
  luce:     sp("Luce", "🐈", "normal", [44,55,42,66], 55, 0, LUCE_MOVES, { evolve: { at: 12, into: "lucy" },
            flavor: "A black and white fluffball. Does 3am laps of the bungalow 'for training'." }),
  lucy:     sp("Lucy", "🐈", "normal", [60,72,54,82], 90, 0, LUCE_MOVES, { evolve: { at: 22, into: "lucius" },
            flavor: "Sam's running buddy. Fluffier with every mile." }),
  lucius:   sp("Lucius", "🐈", "normal", [74,90,66,100], 130, 0, LUCE_MOVES,
            { flavor: "Emperor of the Cotswold Way. Never once overtaken. Still wants dinner at 5pm sharp." }),
  spook:    sp("Spook", "🐈‍⬛", "dark", [46,56,46,58], 55, 0, SPOOK_MOVES, { evolve: { at: 12, into: "spooks" },
            flavor: "A tiny black cat. Appears silently whenever a kettle boils." }),
  spooks:   sp("Spooks", "🐈‍⬛", "dark", [62,72,58,70], 90, 0, SPOOK_MOVES, { evolve: { at: 22, into: "spookus" },
            flavor: "Haunts the coffee shop at night. Only drinks tea, out of spite." }),
  spookus:  sp("Spookus", "🐈‍⬛", "dark", [80,88,72,80], 130, 0, SPOOK_MOVES,
            { flavor: "Whispered about in Stroud tea rooms. Its stare can cool a cuppa instantly." }),
  marie:    sp("Marie", "🐱", "psychic", [50,54,56,48], 55, 0, MARIE_MOVES, { evolve: { at: 12, into: "marigold" },
            flavor: "A little calico. Always knows when the treat cupboard is about to open." }),
  marigold: sp("Marigold", "🐱", "psychic", [66,70,70,56], 90, 0, MARIE_MOVES, { evolve: { at: 22, into: "marigoldus" },
            flavor: "Stares at empty corners of the bungalow. Sees things nobody else can." }),
  marigoldus: sp("Marigoldus", "🐱", "psychic", [86,86,84,64], 130, 0, MARIE_MOVES,
            { flavor: "A calico oracle. Predicted the VAT bill weeks ago. Nobody listened." }),

  // --- Stonehouse & the canal ---
  chicklet:  sp("Chicklet", "🐣", "normal", [40,45,40,55], 40, 0.75, [[1,"peck"],[1,"chicken-dance"],[9,"flap-attack"]],
             { flavor: "A tiny Mr Chicken in training." }),
  fezzant:   sp("Fezzant", "🦃", "normal", [50,50,45,40], 42, 0.7, [[1,"peck"],[1,"judgy-stare"],[9,"zoomies"]],
             { tint: 330, flavor: "A Cotswold pheasant. Stands in the middle of every country lane. Will not move." }),
  skylarky:  sp("Skylarky", "🐦", "flying", [40,48,38,68], 42, 0.7, [[1,"wing-slap"],[1,"second-wind"],[10,"dive-bomb"]],
             { tint: 150, flavor: "Sings non-stop over the commons. Only ever larking about." }),
  roastbean: sp("Roastbean", "🫘", "fire", [44,54,42,50], 42, 0.7, [[1,"hot-sip"],[1,"peck"],[10,"espresso-shot"]],
             { flavor: "Escaped from the coffee shop grinder. Very, very awake." }),
  towpathduck: sp("Towpath Duck", "🦆", "water", [46,46,42,58], 42, 0.7, [[1,"peck"],[1,"spit-take"],[9,"canal-splash"]],
             { flavor: "Races every runner on the Stroudwater Canal towpath. Usually wins." }),
  swanky:    sp("Swanky", "🦢", "water", [60,58,56,48], 55, 0.55, [[1,"wing-slap"],[1,"spit-take"],[11,"canal-splash"],[16,"tidal-bore"]],
             { flavor: "Owns the canal. Has never once paid a licence fee." }),
  kingfizz:  sp("Kingfizz", "🐦", "water", [42,62,40,74], 55, 0.5, [[1,"spit-take"],[1,"wing-slap"],[11,"canal-splash"],[16,"dive-bomb"]],
             { tint: 25, flavor: "A flash of blue and orange over the canal. Blink and you'll miss it." }),
  heronimo:  sp("Heronimo", "🦩", "water", [58,66,52,52], 60, 0.5, [[1,"peck"],[1,"judgy-stare"],[12,"canal-splash"],[17,"tidal-bore"]],
             { tint: 200, flavor: "Stands perfectly still on one leg for hours. Then: chaos." }),
  severnboar:sp("Severn Boar", "🐗", "water", [90,95,80,75], 150, 0.12, [[1,"tidal-bore"],[1,"canal-splash"],[1,"deadlift"],[1,"zoomies"]],
             { badge: "🌊", legendary: true, flavor: "LEGENDARY. Rides the great tidal wave up the River Severn twice a day. Surfers follow it for miles." }),

  // --- Stroud ---
  scarlemoth:sp("Scarlemoth", "🦋", "fire", [48,62,44,64], 55, 0.55, [[1,"hot-sip"],[1,"wing-slap"],[11,"scarlet-blaze"]],
             { tint: 320, flavor: "Its wings are dyed Stroud Scarlet, like the old mill cloth. Hotter than it looks." }),
  ramsomp:   sp("Ramsomp", "🧄", "grass", [52,56,52,46], 50, 0.6, [[1,"leaf-flick"],[1,"judgy-stare"],[10,"wild-garlic"]],
             { flavor: "Wild garlic from the Stroud woods. You smell it before you see it." }),
  kettlebear:sp("Kettlebear", "🐻", "fighting", [64,70,60,42], 60, 0.5, [[1,"wall-ball"],[1,"pump-up"],[11,"kettlebell-swing"],[17,"deadlift"]],
             { flavor: "Lives at the CrossFit box. Has never been seen leaving." }),
  boxroo:    sp("Boxroo", "🦘", "fighting", [52,58,46,66], 52, 0.55, [[1,"wall-ball"],[1,"second-wind"],[10,"burpee-blitz"]],
             { flavor: "Box jumps for fun. 400 of them. Before breakfast." }),
  teapotamus:sp("Teapotamus", "🦛", "water", [74,64,66,40], 65, 0.45, [[1,"spit-take"],[1,"tea-break"],[12,"canal-splash"],[17,"tidal-bore"]],
             { flavor: "Holds 400 cups of tea. Sam's dream Samster." }),
  badgerlad: sp("Badgerlad", "🦡", "dark", [60,64,62,46], 58, 0.5, [[1,"midnight-hiss"],[1,"judgy-stare"],[12,"shadow-pounce"]],
             { flavor: "Comes out at night to raid the bins behind the market." }),

  // --- Selsley Common & the hills ---
  forkite:   sp("Forkite", "🦅", "flying", [56,68,50,70], 62, 0.45, [[1,"wing-slap"],[1,"judgy-stare"],[12,"dive-bomb"],[17,"thermal-soar"]],
             { tint: 330, flavor: "A red kite. Circles the valleys on thermals, eyeing your sandwiches." }),
  owlpen:    sp("Owlpen", "🦉", "psychic", [58,60,56,58], 62, 0.45, [[1,"mind-purr"],[1,"wing-slap"],[12,"third-eye"],[17,"purrnormal"]],
             { flavor: "A barn owl from the Owlpen valley. Glides silently. Knows what you did." }),
  wrenegade: sp("Wrenegade", "🐦", "fighting", [38,66,40,76], 55, 0.55, [[1,"wall-ball"],[1,"wing-slap"],[11,"burpee-blitz"]],
             { tint: 60, flavor: "Tiny. Loud. Will fight anything. Respect the wren." }),
  cotswool:  sp("Cotswool", "🐑", "normal", [62,46,62,38], 55, 0.55, [[1,"peck"],[1,"snore"],[10,"zoomies"]],
             { evolve: { at: 18, into: "cotslion" }, flavor: "A Cotswold sheep. Very woolly. Very calm. Very suspicious of runners." }),
  cotslion:  sp("Cotswold Lion", "🦁", "fighting", [84,82,78,58], 100, 0.25, [[1,"zoomies"],[1,"pump-up"],[12,"burpee-blitz"],[18,"deadlift"]],
             { flavor: "What a Cotswool becomes when it's had enough. The mane is all wool." }),
  moochinhampton: sp("Moochinhampton", "🐄", "normal", [80,64,70,34], 62, 0.5, [[1,"peck"],[1,"judgy-stare"],[12,"zoomies"],[16,"cheese-roll"]],
             { flavor: "Grazes the commons. Refuses to move off the road for anyone." }),
  beechling: sp("Beechling", "🌳", "grass", [62,60,64,40], 58, 0.5, [[1,"leaf-flick"],[1,"tea-break"],[12,"wild-garlic"],[17,"beechwood-bash"]],
             { flavor: "A walking beech sapling from the Cotswold woods. Sheds leaves when nervous." }),
  rolley:    sp("Rolley Gloucester", "🧀", "normal", [66,70,60,72], 75, 0.35, [[1,"cheese-roll"],[1,"zoomies"],[14,"flap-attack"]],
             { flavor: "A wheel of Double Gloucester that escaped down Cooper's Hill. Still rolling." }),
  wisp:      sp("Woodchester Wisp", "👻", "ghost", [52,68,48,70], 75, 0.35, [[1,"spooky-wail"],[1,"judgy-stare"],[12,"haunt"],[17,"poltergeist"]],
             { flavor: "Drifts through the unfinished halls of Woodchester Mansion. Rattles the scaffolding at night." }),
  tumpling:  sp("Tumpling", "🪨", "ghost", [70,62,80,36], 70, 0.4, [[1,"spooky-wail"],[1,"cat-nap"],[12,"haunt"]],
             { flavor: "A grumpy stone spirit from Hetty Pegler's Tump. Has been napping for 5,000 years." }),
  wyrm:      sp("Deerhurst Wyrm", "🐉", "dragon", [92,96,82,78], 160, 0.1, [[1,"dragon-snort"],[1,"deerhurst-fury"],[1,"scarlet-blaze"],[1,"thermal-soar"]],
             { legendary: true, flavor: "LEGENDARY. The dragon of Deerhurst, from the old Gloucestershire legend. Very rarely seen above Selsley." }),
  mrchicken: sp("Mr Chicken", "🐓", "normal", [90,90,80,85], 140, 0.15, [[1,"flap-attack"],[1,"chicken-dance"],[1,"ultra-marathon"],[1,"deadlift"]],
             { legendary: true, flavor: "LEGENDARY. Runs ultras, lifts heavy, drinks tea. Chloe's favourite." }),

  // --- friends' pets (trainers only) ---
  ralph:   sp("Ralph", "🐶", "normal", [55,45,50,25], 50, 0, [[1,"peck"],[1,"snore"],[1,"slobber"],[5,"zoomies"]],
           { flavor: "French bulldog. Snores. Drools. Sam remains unconvinced." }),
  bonnie:  sp("Bonnie", "🐶", "normal", [50,50,45,35], 50, 0, [[1,"peck"],[1,"slobber"],[1,"zoomies"],[5,"snore"]],
           { flavor: "French bulldog. Wants to be Sam's best friend. Sam disagrees." }),
  jkdog:   sp("Pack Pup", "🐕", "normal", [50,55,45,60], 50, 0, [[1,"zoomies"],[1,"jog-on"],[1,"slobber"],[8,"hill-sprint"]],
           { flavor: "One of Jaz and Kim's four dogs. There's always another one." }),
  jkcat:   sp("Kim's Cat", "🐈", "dark", [55,60,50,60], 55, 0, [[1,"midnight-hiss"],[1,"judgy-stare"],[1,"shadow-pounce"],[1,"cat-nap"]],
           { tint: 30, flavor: "Outnumbered four to one by dogs. Completely unbothered." }),
  jkrabbit:sp("Jaz's Rabbit", "🐇", "fighting", [55,60,55,65], 55, 0, [[1,"wall-ball"],[1,"pump-up"],[1,"kettlebell-swing"],[1,"zoomies"]],
           { flavor: "Does box jumps. Thinks CrossFit was its idea." }),
  winnie:  sp("Winnie", "🐕", "fighting", [85,80,70,90], 120, 0, [[1,"zoomies"],[1,"hill-sprint"],[1,"burpee-blitz"],[1,"ultra-marathon"]],
           { flavor: "Chloe's Jack Russell and Sam's favourite. Unlimited energy, unlimited love." }),

  // --- the villain ---
  receipt:   sp("Receipt Gremlin", "🧾", "dark", [65,65,65,60], 80, 0, [[1,"paper-cut"],[1,"audit"],[1,"hidden-fees"],[1,"zoomies"]],
             { flavor: "Every receipt Sam ever lost. They found each other." }),
  spreadsheet: sp("Spreadshriek", "📊", "psychic", [70,65,75,55], 85, 0, [[1,"decimal-error"],[1,"audit"],[1,"paper-cut"],[1,"third-eye"]],
             { flavor: "A spreadsheet where every formula is wrong. Screams in error messages." }),
  tina:      sp("Tina", "👩‍💼", "dark", [108,84,80,64], 220, 0, [[1,"vat-bill"],[1,"hidden-fees"],[1,"audit"],[1,"creative-accounting"]],
             { boss: true, flavor: "The coffee shop's accountant. Messed up the VAT. Blames Sam." }),
};

const STARTERS = ["luce", "spook", "marie"];
