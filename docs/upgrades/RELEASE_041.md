# 0.41.0 — campaign story and character animations

## Campaign

One concise story follows the same kingdom across its three map states:

- **Normal — The First Crossing:** investigate the failing Beacon; discover that Auroline has been tricked into opening the buried Crown seal. Stopping the engine releases its charge into the flame channels.
- **Hard — The Ashfall March:** evacuate the burning kingdom and preserve its anchors. Cutting the corrupted containment stops the breach spreading but collapses the damaged Crown’s foundations.
- **Nightmare — The World Unmade:** carry water, root, flame, moon and memory across the ruins and close the Worldwound. The survivors can return and rebuild; the ruins are not magically restored.

Five chapters cover all 25 stages on each difficulty. There are 33 short scenes, 76 dialogue turns and approximately 1,100 dialogue words. Campaign scenes use static map artwork and **never load videos**. Dialogue keeps named left/right bubbles and visible Skip/Begin controls.

The Beacon above the citadel is a warning light; the Crown below it is the seal. Auroline acknowledges the deception and helps evacuate the kingdom. The collapse is explained before the decision to cut containment. All five anchors are accounted for at the ending.

The journal image button stays at the bottom left of each campaign map as it scrolls. The journal groups replayable scenes and aftermaths by difficulty. Adventure no longer has the journal or weekly shortcut buttons. Both weekly challenges are now a subsection on Daily Gift; older weekly links redirect there. The guide explains both locations briefly.

## Character video

All 14 characters featured in the supplied trailer now have matching detail-page animations:

Iseldra, Bronze Juggernaut, Vex, Qingluo, Azhar, Asterox, Murgash, Sir Aurel, Yshmir, Gorgythe, Brondak, the Sin Archon, Vharos and Inko.

The five newly cut segments are `prism-gaze`, `ironhorn-rider`, `sin-archon`, `crimson-praetor` and `plasma-skirmisher`. Clips previously assigned to campaign scenes now animate their respective detail pages instead. Summon reveals also use matching clips under the existing Legendary/Mythical eligibility rule. The original final-logo intro and Qingluo Special remain available.

Fifteen silent mobile HD clips total about 13.1 MB, each below 2 MB. Files are fetched on demand; collection grids remain static. Reduced Motion and Character Cinematics settings prevent playback/downloads. Playback failures return to the original portrait. No roster artwork or logo was replaced. The manifest records source cuts, identity, dimensions and hashes.

## Saves and rewards

Old seen flags and chapter claims remain intact. New map-story keys let players see rewritten scenes without resetting saves. Chapters 1–3 retain their existing claim keys; chapters 4–5 add the same once-only gifts at stages 20/25. Reading or replaying grants nothing. Energy is spent only when entering battle. Combat formations and difficulty unlock rules are unchanged.

## Validation

- Full unit suite and production build, including historical roster and portrait checks.
- Phone/desktop story and journal layouts, all 15 chapters and aftermaths, no campaign video requests.
- Actual playback of all 14 matching detail animations and Reduced Motion download prevention.
- Real weekly/campaign Auto victories, reward persistence and cinematic settings.
- Phone/desktop contrast checks for weekly challenges, journal, story and faction previews.

Commands: `npm run check`, `npm run test:map-story`, `npm run test:upgrades`, `npm run test:contrast`.
