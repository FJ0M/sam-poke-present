# SAMSTERS: Mr Chicken's Birthday Quest

A birthday game for Sam. Catch creatures, battle friends (and their dogs), and defeat Tina the accountant to fix the coffee shop's VAT bill. Set in Stonehouse and Stroud.

Plays in any phone browser, with Game Boy style controls at the bottom of the screen. No install, no build step.

## Files

- `content.js` has all the personal stuff: story, names, creatures, moves, areas, trainers and the birthday message. Edit this to change the game.
- `pixels.js` has the hand-drawn 16x16 pixel sprites (Sam's cats, Winnie, Ralph, Bonnie, Mr Chicken). Every other creature is auto-pixelated from its emoji.
- `game.js` is the engine: battles, catching, levelling, evolutions, saving, controls, chiptune sound.
- `style.css` holds the pixel look and the Game Boy shell.

## Controls

D-pad moves the cursor, **A** selects or skips text, **B** goes back, **START** opens the team, **SELECT** toggles sound. Tapping the screen works too. On a keyboard use the arrows, Z/Enter for A, X for B, and S for Start.

## Testing

Add `?fast` to the URL to make battle text fly by.

## Hosting

This is a static site served by GitHub Pages from the `main` branch root.
