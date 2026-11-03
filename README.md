# POCKET SAM: Mr Chicken's Birthday Quest

A birthday game for Sam. You walk around Stonehouse and Stroud with Sam's three cats, catch Cotswold creatures, battle friends (and their dogs), and defeat Tina the accountant to fix the coffee shop's VAT bill.

It plays in any phone browser, with Game Boy style controls at the bottom of the screen. There's no install and no build step.

## Files

- `content.js` has the story text, types, moves and every creature.
- `maps.js` has the walkable maps (one letter per tile, legend at the top), NPCs, trainers, doors, the train and van stops.
- `pixels.js` has the hand-drawn 16x16 sprites (Sam's cats, Winnie, Ralph, Bonnie, Mr Chicken). Other creatures are auto-pixelated from an emoji.
- `world.js` is the overworld: tile art, character sprites, walking, running, e-bike, van, train, encounters, trainers.
- `game.js` handles battles, catching, levelling, evolutions, saving, menus and chiptune sound.
- `style.css` holds the pixel look and the Game Boy shell.

## Controls

- **D-pad**: walk.
- **A**: talk or interact.
- **B**: hold to run, or go back.
- **START**: menu (team, Samdex, e-bike, save, sound).
- **SELECT**: toggles sound.

On a keyboard use the arrows, Z or Enter for A, X for B, and S for Start.

## Getting around

- The **van** outside the bungalow, in Stroud and on Selsley Common drives you to anywhere you've already visited.
- The **train** runs between Stonehouse and Stroud stations.
- The **e-bike** is in the START menu.

## Testing

Add `?fast` to the URL to make battle text fly by.

## Hosting

This is a static site served by GitHub Pages from the `main` branch root.
