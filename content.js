// ============================================================
//  CONTENT — everything personal about Sam lives in this file.
//  Story, creatures, moves, types. Maps live in maps.js.
// ============================================================

const CONFIG = {
  title: "POCKET SAM",
  subtitle: "Mr Chicken's Birthday Quest",
  hero: "Sam",
  from: "Freddie",
  age: "36",                     // shown on the cake and the ending screen
  ballName: "Mug",
  ballEmoji: "☕",
  dexName: "Samdex",
  creatureWord: "critter",
  professor: "Prof. Doverow",
  forcedName: "Mr Chicken",
  profIntro: [
    "Prof. Doverow: Well hello there! Welcome to the Five Valleys!",
    "Prof. Doverow: My name is Doverow. People round here call me the Critter Professor. I live up on the hill, mostly.",
    "Prof. Doverow: From the canal at Stonehouse to the commons above Stroud, these valleys are full of creatures called CRITTERS.",
    "Prof. Doverow: Some are cats. Some are birds. One is, I'm told, a wheel of Double Gloucester.",
    "Prof. Doverow: Now then. Tell me a little about yourself.",
  ],
  nameReaction: [
    "Prof. Doverow: ...",
    "Prof. Doverow: Hmm. No, I don't think that's right.",
    "Prof. Doverow: Your name is MR CHICKEN.",
    "Prof. Doverow: Your wife told me. Everyone calls you that.",
    "Prof. Doverow: Right then, MR CHICKEN! Your very own critter adventure is about to begin!",
  ],
  wakeUp: [
    "...",
    "Sunlight pours into the living room. It's a lovely Stroud valleys morning.",
    "It's your birthday! You've dozed off on the sofa again.",
    "Spook and Marie are play-fighting on the rug. Luce is supervising from the arm of the sofa.",
    "And on the coffee table... a BIRTHDAY CAKE! Thirty-six candles. A proper cuppa beside it, soy milk, just how you like it.",
    "You lean in to blow out the candles...",
    "*CLATTER* Something just came through the letterbox in the hallway.",
  ],
  letter: [
    "There's a letter on the doormat. It's from Tina, Rough Hands' accountant...",
    "\"Dear Sam. Small VAT mix-up. Rough Hands now owes A MASSIVE TAX BILL. Happy birthday! Tina.\"",
    "Your appetite vanishes. No cake until this is sorted.",
    "Tina's office is up in Stroud. But first, Jaz and Kim are just up the road. They'll know what to do.",
  ],
  cakeLocked: [
    "The birthday cake. It smells incredible.",
    "But you can't enjoy it. Not with that VAT bill hanging over Rough Hands.",
    "Not until Tina has been dealt with.",
  ],
  winnieJoins: [
    "Chloe: Oh, and Mr Chicken? Could you take Winnie for a walk? She's been bouncing off the walls.",
    "Winnie spins in three circles and sits on Sam's feet. She's coming whether you like it or not.",
  ],
  tinaDies: [
    "Tina: No... NO! My beautiful numbers...",
    "Tina: I've been... audited...",
    "Tina clutches her calculator, wobbles dramatically, and keels over. X_X",
    "Tina is dead. A little ghost floats up out of her, clutching an invoice, and drifts off through the ceiling.",
    "The invoice flutters down. It's for £0.00.",
    "Rough Hands' VAT is sorted. The cake is safe!",
  ],
  party: [
    "Later that day, back at the bungalow in Adelaide Gardens...",
    "Everyone's here. Chloe and Winnie. Jaz and Kim (and all the pets). Freddie and Georgina (and Ralph and Bonnie, sorry).",
    "There's tea, proper British tea with milk (soy for the birthday boy), and finally... THE CAKE.",
    "Tina makes a surprisingly sturdy coffee table.",
    "Freddie: Happy birthday, Sam! Thirty-six and still faster than all of us.",
    "Chloe: Happy birthday, Mr Chicken.",
    "Jaz: The crystals said today would be a good day. The crystals were right.",
    "Kim: I'm going to pretend I didn't see the body. It's your birthday.",
    "Georgina: Ralph, NO. Not on Tina.",
    "Sam blows out all thirty-six candles. Spook and Marie immediately start play-fighting over the crumbs.",
  ],
  healTip: [
    "*Ring ring* It's Prof. Doverow on the phone.",
    "Prof. Doverow: Mr Chicken! One of your critters has fainted. Don't panic.",
    "Prof. Doverow: Any café will sort them out with a proper cuppa. Rough Hands is the best, obviously.",
    "Prof. Doverow: There are cafés in Stonehouse and Ebley too. Not as good, mind.",
    "Prof. Doverow: Or pop home and put the kettle on, or have a nap in your bed. Check your Journal if you get lost!",
  ],
  catsJoin: "Luce, Spook and Marie hop into their mugs. They joined your team!",
  birthdayMessage:
    "Happy 36th birthday Sam! You defeated Tina, fixed the VAT and saved Rough Hands. Here's to another year of ultras, WODs and way too many cups of tea. Love, Freddie & Georgina (and Ralph and Bonnie, sorry) 🎉",
};

// Type chart: strong = deals double damage to these; weak = deals half to these.
const TYPES = {
  normal:   { name: "Normal",   emoji: "⚪", color: "#a8a29e", strong: [],                          weak: ["ghost"] },
  fire:     { name: "Fire",     emoji: "🔥", color: "#f97316", strong: ["grass", "evil"],            weak: ["fire", "water", "dragon"] },
  water:    { name: "Water",    emoji: "💧", color: "#3b82f6", strong: ["fire"],                     weak: ["water", "grass", "dragon"] },
  grass:    { name: "Grass",    emoji: "🌿", color: "#22c55e", strong: ["water"],                    weak: ["fire", "grass", "flying", "dragon"] },
  flying:   { name: "Flying",   emoji: "🪶", color: "#7dd3fc", strong: ["grass", "fighting"],        weak: [] },
  fighting: { name: "Fighting", emoji: "👊", color: "#dc2626", strong: ["normal", "dark", "evil"],   weak: ["flying", "psychic", "ghost"] },
  psychic:  { name: "Psychic",  emoji: "🔮", color: "#ec4899", strong: ["fighting", "evil"],         weak: ["psychic", "dark"] },
  dark:     { name: "Dark",     emoji: "🌑", color: "#4b3f5c", strong: ["psychic", "ghost"],         weak: ["fighting", "dark", "evil"] },
  ghost:    { name: "Ghost",    emoji: "👻", color: "#7c3aed", strong: ["ghost", "psychic"],         weak: ["normal", "dark"] },
  dragon:   { name: "Dragon",   emoji: "🐉", color: "#6366f1", strong: ["dragon"],                   weak: [] },
  evil:     { name: "Evil",     emoji: "😈", color: "#111827", strong: ["normal", "grass", "water", "flying"], weak: ["fighting", "fire", "evil"] },
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
  // Lucy's fire line
  "ember-glare": M("Ember Glare", "fire", 45), "fluff-flare": M("Fluff Flare", "fire", 65, 95), "inferno-zoomies": M("Inferno Zoomies", "fire", 90, 85),
  // Spook & Marie
  "play-fight": M("Play Fight", "fighting", 55, 95),
  // the frenchies
  "drool": M("Drool", "water", 40), "fart": M("Fart", "evil", 55, 90), "poo": M("Poo", "evil", 70, 80),
  "bark": M("Bark", "normal", 0, 100, "defDown"), "go-mental": M("Go Mental For No Reason", "normal", 75, 85),
  // old dogs, sphynx, pug
  "grumble": M("Old Dog Grumble", "normal", 0, 95, "defDown"), "creaky-pounce": M("Creaky Pounce", "normal", 50, 90),
  "wrinkle-glare": M("Wrinkle Glare", "psychic", 55, 95), "snort-snuffle": M("Snort Snuffle", "water", 50),
  "lab-tackle": M("Labrador Tackle", "fighting", 60, 95), "eat-everything": M("Eat Everything", "normal", 0, 100, "heal"),
  // Jaz's witchy powers
  "hex": M("Hex", "ghost", 55, 95), "crystal-ball": M("Crystal Ball", "psychic", 0, 100, "atkUp"), "moon-curse": M("Moon Curse", "dark", 70, 90),
  // coffee
  "pour-over": M("Pour Over", "water", 50), "bloom": M("Bloom", "grass", 0, 100, "atkUp"), "cold-brew": M("Cold Brew", "water", 70, 95),
  "ristretto": M("Ristretto", "fire", 75, 90), "over-extract": M("Over-Extract", "dark", 80, 85), "latte-art": M("Latte Art", "psychic", 0, 100, "heal"),
  "french-press": M("French Press", "fighting", 70, 90), "moka-steam": M("Moka Steam", "fire", 60, 95), "single-origin": M("Single Origin", "psychic", 85, 90),
  "decaf": M("Decaf", "normal", 0, 95, "defDown"), "flat-white": M("Flat White", "normal", 65, 100),
  // gym
  "wall-balls": M("50 Wall Balls", "fighting", 85, 85),
  // board games
  "roll-crit": M("Roll a Crit", "normal", 80, 70), "rules-lawyer": M("Rules Lawyer", "psychic", 0, 100, "defDown"), "summon-meeple": M("Summon Meeple", "ghost", 60, 95),
  // Tina's evil office
  "late-fee": M("Late Fee", "evil", 60, 95), "final-demand": M("Final Demand", "evil", 80, 90), "tax-return": M("Tax Return", "evil", 95, 85),
  "red-tape": M("Red Tape", "evil", 0, 100, "defDown"), "bailiff-bite": M("Bailiff Bite", "evil", 75, 90),
};

// sp(name, emoji, type, [hp, atk, def, spd], xp, catchRate, moves, extra)
// emoji draws the sprite (auto-pixelated); `tint` hue-shifts it; `badge` adds a small second emoji.
// Hand-drawn sprites in pixels.js override the emoji.
const sp = (name, emoji, type, [hp, atk, def, spd], xp, catchRate, moves, extra = {}) =>
  ({ name, emoji, type, base: { hp, atk, def, spd }, xp, catchRate, moves, ...extra });

const LUCE_MOVES  = [[1,"ember-glare"],[1,"jog-on"],[4,"second-wind"],[9,"fluff-flare"],[13,"hot-sip"],[17,"inferno-zoomies"]];
const SPOOK_MOVES = [[1,"play-fight"],[1,"midnight-hiss"],[4,"judgy-stare"],[9,"shadow-pounce"],[13,"cat-nap"],[17,"witching-hour"]];
const MARIE_MOVES = [[1,"play-fight"],[1,"mind-purr"],[4,"cat-nap"],[9,"third-eye"],[13,"chicken-dance"],[17,"purrnormal"]];

const SPECIES = {
  // --- Sam's cats: you get all three ---
  luce:     sp("Luce", "🐈", "fire", [44,55,42,66], 55, 0, LUCE_MOVES, { evolve: { at: 12, into: "lucy" },
            flavor: "A fluffy black kitten with a white chin and white socks. There's a little flame behind her eyes." }),
  lucy:     sp("Lucy", "🐈", "fire", [60,72,54,82], 90, 0, LUCE_MOVES, { evolve: { at: 22, into: "lucius" },
            flavor: "Mostly black, extremely fluffy, white chin, white leggies. Her eyes smoulder when dinner is late." }),
  lucius:   sp("Lucius", "🐈", "fire", [74,90,66,100], 130, 0, LUCE_MOVES,
            { flavor: "An enormous black floof with blazing eyes. Her white socks have never once been dirty." }),
  spook:    sp("Spook", "🐈‍⬛", "dark", [46,56,46,58], 55, 0, SPOOK_MOVES, { evolve: { at: 12, into: "spooks" },
            flavor: "A tiny black cat. Appears silently whenever a kettle boils. Play-fights Marie daily." }),
  spooks:   sp("Spooks", "🐈‍⬛", "dark", [62,72,58,70], 90, 0, SPOOK_MOVES, { evolve: { at: 22, into: "spookus" },
            flavor: "Haunts Rough Hands at night. Only drinks tea, out of spite." }),
  spookus:  sp("Spookus", "🐈‍⬛", "dark", [80,88,72,80], 130, 0, SPOOK_MOVES,
            { flavor: "Whispered about in Stroud tea rooms. Its stare can cool a cuppa instantly." }),
  marie:    sp("Marie", "🐱", "psychic", [50,54,56,48], 55, 0, MARIE_MOVES, { evolve: { at: 12, into: "marigold" },
            flavor: "A little calico, all orange and black, not a speck of white. Play-fights Spook daily." }),
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
             { flavor: "Escaped from the Rough Hands grinder. Very, very awake." }),
  towpathduck: sp("Towpath Duck", "🦆", "water", [46,46,42,58], 42, 0.7, [[1,"peck"],[1,"spit-take"],[9,"canal-splash"]],
             { flavor: "Races every runner on the Stroudwater Canal towpath. Usually wins." }),
  swanky:    sp("Swanky", "🦢", "water", [60,58,56,48], 55, 0.55, [[1,"wing-slap"],[1,"spit-take"],[11,"canal-splash"],[16,"tidal-bore"]],
             { flavor: "Owns the canal. Has never once paid a licence fee." }),
  kingfizz:  sp("Kingfizz", "🐦", "water", [42,62,40,74], 55, 0.5, [[1,"spit-take"],[1,"wing-slap"],[11,"canal-splash"],[16,"dive-bomb"]],
             { tint: 25, flavor: "A flash of blue and orange over the canal. Blink and you'll miss it." }),
  heronimo:  sp("Heronimo", "🦩", "water", [58,66,52,52], 60, 0.5, [[1,"peck"],[1,"judgy-stare"],[12,"canal-splash"],[17,"tidal-bore"]],
             { tint: 200, flavor: "Stands perfectly still on one leg for hours. Then: chaos." }),
  severnboar:sp("Severn Boar", "🐗", "water", [90,95,80,75], 150, 0.25, [[1,"tidal-bore"],[1,"canal-splash"],[1,"deadlift"],[1,"zoomies"]],
             { badge: "🌊", legendary: true, flavor: "LEGENDARY. ★★★★★ Rides the Severn Bore, the tidal wave that surges UP the River Severn on the biggest spring tides. Surfers chase it for miles. Only seen at Framilode, and only once." }),

  // --- Stroud ---
  scarlemoth:sp("Scarlemoth", "🦋", "fire", [48,62,44,64], 55, 0.55, [[1,"hot-sip"],[1,"wing-slap"],[11,"scarlet-blaze"]],
             { tint: 320, flavor: "Its wings are dyed Stroud Scarlet, like the old mill cloth. Hotter than it looks." }),
  ramsomp:   sp("Ramsomp", "🧄", "grass", [52,56,52,46], 50, 0.6, [[1,"leaf-flick"],[1,"judgy-stare"],[10,"wild-garlic"]],
             { flavor: "Wild garlic from the Stroud woods. You smell it before you see it." }),
  kettlebear:sp("Kettlebear", "🐻", "fighting", [64,70,60,42], 60, 0.5, [[1,"kettlebell-swing"],[1,"pump-up"],[11,"wall-ball"],[17,"deadlift"]],
             { badge: "🏋️", flavor: "A bear that carries a 32kg kettlebell everywhere. Lives at Golden Valley CrossFit." }),
  wallbalrog:sp("Wall Balrog", "🏐", "fighting", [70,72,58,48], 70, 0.4, [[1,"wall-ball"],[1,"pump-up"],[10,"burpee-blitz"],[16,"wall-balls"]],
             { tint: 20, flavor: "A medicine ball with a grudge. Sam hates it. It hates Sam." }),
  boxroo:    sp("Boxroo", "🦘", "fighting", [52,58,46,66], 52, 0.55, [[1,"wall-ball"],[1,"second-wind"],[10,"burpee-blitz"]],
             { flavor: "Box jumps for fun. 400 of them. Before breakfast." }),
  teapotamus:sp("Teapotamus", "🦛", "water", [74,64,66,40], 65, 0.45, [[1,"spit-take"],[1,"tea-break"],[12,"canal-splash"],[17,"tidal-bore"]],
             { flavor: "Holds 400 cups of tea. Sam's dream critter." }),
  // --- coffee critters (around Rough Hands) ---
  arabicub:  sp("Arabicub", "🫘", "grass", [46,50,46,56], 48, 0.6, [[1,"bloom"],[1,"leaf-flick"],[10,"pour-over"]],
             { tint: 90, evolve: { at: 16, into: "geishawk" }, flavor: "A bright, fruity arabica bean. Grows best at altitude. Gets jittery at sea level." }),
  geishawk:  sp("Geishawk", "🦅", "flying", [62,70,58,74], 85, 0.3, [[1,"bloom"],[1,"dive-bomb"],[16,"single-origin"],[20,"thermal-soar"]],
             { badge: "🫘", flavor: "Named after the Geisha variety. Floral, tea-like, eye-wateringly expensive." }),
  robustling:sp("Robustling", "🫘", "dark", [56,62,58,38], 50, 0.6, [[1,"over-extract"],[1,"decaf"],[12,"ristretto"]],
             { tint: 330, flavor: "A robusta bean. Twice the caffeine, half the manners. Makes a great crema." }),
  aeropuss:  sp("Aeropuss", "🐱", "water", [50,56,48,66], 55, 0.5, [[1,"pour-over"],[1,"peck"],[11,"french-press"],[15,"cold-brew"]],
             { badge: "☕", tint: 180, flavor: "Brews by pressing down very hard. Has 47 competition recipes. Will tell you all of them." }),
  v60wl:     sp("V60wl", "🦉", "water", [54,52,56,60], 55, 0.5, [[1,"pour-over"],[1,"bloom"],[12,"cold-brew"],[16,"latte-art"]],
             { tint: 40, flavor: "A cone-shaped owl. Pours in slow spirals. 30 second bloom, never 29." }),
  mokapot:   sp("Moka Potamus", "🫖", "fire", [64,60,66,40], 60, 0.45, [[1,"moka-steam"],[1,"hot-sip"],[12,"espresso-shot"],[17,"ristretto"]],
             { tint: 200, flavor: "An Italian stovetop pot. Gurgles loudly when it's done. Every nonna's favourite." }),
  cremagolem:sp("Crema Golem", "🗿", "normal", [80,70,78,30], 80, 0.3, [[1,"flat-white"],[1,"latte-art"],[14,"french-press"],[18,"single-origin"]],
             { badge: "☕", flavor: "Made entirely of perfect microfoam. Pours a rosetta on anyone who annoys it." }),
  koala:     sp("Koalafied", "🐨", "grass", [56,48,58,34], 50, 0.55, [[1,"leaf-flick"],[1,"cat-nap"],[11,"beechwood-bash"]],
             { flavor: "Escaped from Adelaide Gardens' gum trees. Sleeps 22 hours a day. Highly koalafied barista." }),
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
  ralph:   sp("Ralph", "🐶", "normal", [55,45,50,25], 50, 0, [[1,"slobber"],[1,"snore"],[1,"fart"],[4,"go-mental"],[6,"poo"]],
           { flavor: "Black and tan French bulldog. Snores. Drools. Recently shat on the floor again." }),
  bonnie:  sp("Bonnie", "🐶", "normal", [50,50,45,35], 50, 0, [[1,"drool"],[1,"bark"],[1,"slobber"],[4,"go-mental"],[6,"fart"]],
           { flavor: "Blue-grey French bulldog. Wants to be Sam's best friend. Sam disagrees." }),
  milo:    sp("Milo", "🐩", "normal", [52,46,46,30], 40, 0, [[1,"grumble"],[1,"creaky-pounce"],[1,"snore"]],
           { tint: 15, flavor: "Jaz and Kim's dog. Really old, really small, really fluffy and light brown. Still first to the door." }),
  chap:    sp("Chap", "🐕", "fighting", [60,58,50,44], 45, 0, [[1,"lab-tackle"],[1,"eat-everything"],[1,"slobber"]],
           { tint: 0, flavor: "Jaz and Kim's big black Labrador. A proper gentleman until there's food involved. There's always food involved." }),
  lila:    sp("Lila", "🐩", "psychic", [50,46,46,32], 40, 0, [[1,"grumble"],[1,"wrinkle-glare"],[1,"creaky-pounce"]],
           { tint: 25, flavor: "Jaz and Kim's dog. Old, small, fluffy and light brown. Knows you have a biscuit. Knows which pocket." }),
  gerty:   sp("Gerty", "🐶", "water", [54,50,52,40], 42, 0, [[1,"snort-snuffle"],[1,"slobber"],[1,"bark"]],
           { flavor: "Jaz and Kim's small black pug cross. Snorts like a tiny steam engine." }),
  oswald:  sp("Oswald", "🐈", "dark", [50,54,44,58], 45, 0, [[1,"midnight-hiss"],[1,"wrinkle-glare"],[1,"hex"]],
           { flavor: "Jaz and Kim's sphynx cat. Hairless, wrinkly and warm, like a peach in a jumper. Completely unbothered." }),
  jkrabbit:sp("Name Unknown", "🐇", "fighting", [48,52,48,60], 42, 0, [[1,"wall-ball"],[1,"pump-up"],[1,"zoomies"]],
           { flavor: "Jaz and Kim's rabbit. Nobody knows its name. Not even Jaz and Kim." }),
  winnie:  sp("Winnie", "🐕", "fighting", [85,80,70,90], 120, 0, [[1,"zoomies"],[1,"hill-sprint"],[1,"burpee-blitz"],[1,"ultra-marathon"]],
           { evolve: { at: 1, into: "winnieeee" }, flavor: "Chloe's ginger Jack Russell and Sam's favourite. Unlimited energy, unlimited love." }),
  winnieeee: sp("WINNIEEEE", "🐕", "fighting", [100,98,82,110], 160, 0, [[1,"zoomies"],[1,"hill-sprint"],[1,"burpee-blitz"],[1,"ultra-marathon"]],
           { flavor: "What Winnie becomes on a walk with Sam. Pure joy at 40mph. Ears fully airborne." }),
  // Egg's gym, Brendan & Davide's board games
  meepleon:sp("Meepleon", "♟️", "ghost", [58,60,56,52], 60, 0, [[1,"summon-meeple"],[1,"rules-lawyer"],[1,"roll-crit"]],
           { flavor: "A wooden meeple possessed by a 40-hour Gloomhaven campaign." }),
  dicey:   sp("Dicey", "🎲", "psychic", [52,66,46,62], 60, 0, [[1,"roll-crit"],[1,"rules-lawyer"],[1,"third-eye"]],
           { flavor: "Always rolls a 1 when it matters. Always rolls a 20 when it doesn't." }),

  // --- the villain (all Evil) ---
  receipt:   sp("Receipt Gremlin", "🧾", "evil", [62,62,62,58], 80, 0, [[1,"paper-cut"],[1,"red-tape"],[1,"late-fee"]],
             { flavor: "Every receipt Sam ever lost. They found each other." }),
  spreadsheet: sp("Spreadshriek", "📊", "evil", [66,62,70,52], 85, 0, [[1,"decimal-error"],[1,"red-tape"],[1,"late-fee"]],
             { flavor: "A spreadsheet where every formula is wrong. Screams in error messages." }),
  latefee:   sp("Late Fee", "💸", "evil", [60,70,56,66], 85, 0, [[1,"late-fee"],[1,"hidden-fees"],[1,"red-tape"]],
             { flavor: "Grows by 8% every day you ignore it." }),
  finaldemand: sp("Final Demand", "📮", "evil", [68,72,64,50], 90, 0, [[1,"final-demand"],[1,"paper-cut"],[1,"red-tape"]],
             { flavor: "A red envelope that screams when opened. Lives in Tina's out-tray." }),
  hmrchound: sp("HMRC Hound", "🐺", "evil", [72,78,66,70], 95, 0, [[1,"bailiff-bite"],[1,"audit"],[1,"late-fee"]],
             { tint: 200, flavor: "Sniffs out unpaid VAT from three valleys away." }),
  tina:      sp("Tina", "👩‍💼", "evil", [110,86,82,66], 220, 0, [[1,"vat-bill"],[1,"tax-return"],[1,"audit"],[1,"creative-accounting"]],
             { boss: true, flavor: "Rough Hands' accountant. Messed up the VAT. Blames Sam." }),
};

const STARTERS = ["luce", "spook", "marie"];

// ---------- Quest journal ----------
// Each quest is done when all its flags are set. Main quests are shown in order: the first unfinished one is "current".
const QUESTS = {
  main: [
    { flags: ["letter"], title: "Check the doormat", hint: "Something came through the letterbox. Head to the hallway." },
    { flags: ["beat_jk"], title: "Visit Jaz & Kim", hint: "Their house is just up the path from Adelaide Gardens, on the way to the High Street." },
    { flags: ["beat_chloe"], title: "See Chloe and Winnie", hint: "Chloe's house is right by Stonehouse station." },
    { flags: ["stroud"], title: "Get to Stroud", hint: "Take the train from Stonehouse station, or walk east through Ebley." },
    { flags: ["beat_fg"], title: "Find Freddie & Georgina", hint: "They're at Rough Hands in the Five Valleys shopping centre, Stroud. With Ralph and Bonnie." },
    { flags: ["beat_tina"], title: "Sort out the VAT bill", hint: "Tina's office is on Stroud High Street." },
    { flags: ["finished"], title: "Eat the cake", hint: "Go home. The cake is waiting." },
  ],
  side: [
    { flags: ["boar"], title: "Catch the five-star bore", hint: "Head west from Stonehouse to Framilode and talk to the surfer." },
    { flags: ["beat_egg"], title: "Survive Egg's WOD", hint: "Golden Valley CrossFit on Merrywalks, Stroud. Egg loves wall balls. Sam does not." },
    { flags: ["beat_bd"], title: "Interrupt the Gloomhaven campaign", hint: "Brendan and Davide, at the big table in Rough Hands." },
    { flags: ["beat_bev", "beat_priya"], title: "Take on the Ebley locals", hint: "Boater Bev on the towpath and Parkrunner Priya by the road." },
    { flags: ["beat_sid"], title: "Out-skate Skater Sid", hint: "He's in the park south of Stroud's railway." },
    { flags: ["beat_bill", "beat_ursula"], title: "Conquer Selsley Common", hint: "Birdwatcher Bill and Ultra Runner Ursula. The lane south from Ebley, over the canal bridge." },
    { caught: 20, title: "Catch 20 critters", hint: "Wild critters hide in tall grass, spinifex and reeds." },
  ],
};


