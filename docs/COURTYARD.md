# Tavern Courtyard

The Tavern is a small first-person courtyard. Drag to look around, use the movement arrows (or WASD) to take short steps, and use the curved arrows (or left/right arrow keys) to turn. Home or the Courtyard button returns to the starting position.

Four short paths lead to Adventure, the Altar, Codex and Shop. A distant marker approaches the path; a nearby gold marker opens its page. Turning around reveals the Tavern door. Its wanted poster shows the saved name, portrait, profile level and XP and opens the existing profile editor. The redundant Enter Tavern shortcut is removed; the Courtyard control resets the view. The courtyard/Tavern icon remains in the top navigation on every page, including as the active icon while in the courtyard. The dropped leather pouch opens the existing Daily Gift / Today’s Path page; reward eligibility and once-per-day saves are unchanged. Quests, Bag and Guide remain in the top navigation.

The local Three.js viewer combines a bounded ground plane, a continuous curved background with painted environment vistas, a detailed transparent Tavern facade and projected interaction targets. It adds occasional windblown leaves, birds and two animated townsperson sprites. Motion pauses while dialogs are open or the tab is hidden and respects the device’s reduced-motion preference. A flat illustrated fallback keeps interactions usable when WebGL is unavailable.

Movement is temporary presentation state. It does not spend Energy, change battle teams or write progress. Profile edits update the poster without rebuilding the viewer or moving the camera. Route changes dispose the renderer, textures, geometries, observers and input listeners. The renderer runs at approximately 30 frames per second with bounded pixel density and no real-time shadows or remote dependencies.

Validation: `npm run check`, `npm run test:courtyard`, `npm run test:courtyard-polish` and `npm run test:profile-tools`. Browser coverage includes real touch dragging, walking/turning, all destinations, profile persistence, once-only daily rewards, six viewport sizes including phone landscape, ambient motion, and the WebGL fallback. Existing roster and artwork fingerprints remain part of the production build.

## Current files

The current courtyard is the v0.36 scene with a unified market-to-Adventure panorama. This is the version to preserve when making future changes.

- `src/courtyard.js`: movement, destination positions and fallback artwork.
- `src/courtyard-ui.js` and `src/courtyard.css`: markup and presentation.
- `src/courtyard-view.js`: input, rendering and resource disposal.
- `src/courtyard-scenery.js`: continuous background, shared sky and paving projection.
- `src/courtyard-life.js` and `src/courtyard-birds.js`: pedestrians, leaves and articulated swallows.
- `assets/courtyard/`: only the current scene and fallback images. The Adventure and Shop skyline images remain necessary for the non-WebGL fallback even though the WebGL scene uses the unified panorama.

The wanted poster stays 92 CSS pixels wide while walking. Limestone paving blends into the distant scenery, and the background shares the sky dome's viewing ray. The garden perimeter avoids duplicate buildings beside the foreground Tavern. Pedestrians face their direction of travel, pause when blocked, and fade at route ends. Reduced motion pauses or hides ambient animation.

Superseded courtyard paintings and paving were removed from the current tree during repository cleanup; earlier versions remain available in Git history. The production build validates the artwork referenced by both the current scenery and destination definitions.
