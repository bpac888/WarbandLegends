# Citadel Visual Refresh — v0.24

The non-battle interface now uses a coordinated fantasy presentation: a luminous jade, teal and amethyst atmosphere, warm metallic controls, illustrated treasure displays and clear typography. Pages keep their existing actions and concise content.

## Presentation

- The old repeating rainbow is replaced by a tonal celestial gradient, slowly drifting light, sparse stars and rotating celestial tracery behind the interface.
- Menu text uses locally bundled **Manrope**; headings use **Cormorant Garamond**. The supplied Warband Legends title lettering is preserved.
- Navigation uses compact jeweled controls with distinct selection/focus states. The header is opaque and does not blur scrolled content. Shop and Daily Path select the Tavern shortcut.
- Tavern destinations keep their bright paintings, with metallic frames and separate nameplates. No new tint, fade or layer covers character artwork.
- Shop departments use a shared tab rail, consistent illustrated item displays, clear prices and aligned purchase controls. Premium offers remain unavailable previews.
- Bag materials use compact illustrated quantity tiles. Quest cards emphasize progress and rewards; ready rewards receive a distinct frame.
- Campaign, Dungeons, Arena, Events and Daily Path share the same surfaces and typography. The campaign map remains scrollable, with its existing stage positions and simple confirmation.
- Codex, Teams, hero information, Settings, the Guide and confirmation dialogs receive coordinated surfaces, spacing and controls. Character portraits are unchanged.

## Motion and Accessibility

Motion uses slow CSS transforms and opacity changes. Route entrances translate by seven pixels without dimming the page; hover feedback is limited to devices with hover input. The Premium banner treasure floats gently and the splash action has an occasional light sweep. No decorative effect changes layout, intercepts clicks or advances game state.

The system reduced-motion preference disables decorative animation and transitions. Background animation pauses while the document is hidden. Decorative elements are hidden from assistive technology and ignore pointer input. Existing button labels, native controls and keyboard navigation are retained, with visible focus rings.

## Preservation and Validation

`src/citadel-theme.css` is scoped to the `menu-theme` body class. `src/menu-atmosphere.js` removes that class and hides the atmosphere whenever the battle screen is rendered. Battle styles, fonts, geometry, controls and effects remain under their original stylesheets. No champion art, abilities, balance rules, resources or saves are changed.

Run `npm run test:menus` with Playwright and Chromium available for browser validation. It covers fifteen routes at 320, 360, 390, 760, 900 and 1440 pixels; Shop departments and purchase previews; Guide topics; collection filters and Teams; event selection; Settings; daily rewards; and campaign stage confirmation and map scrolling. It also compares battle screenshots and computed styles with the menu refresh disabled. The native suite remains available through `npm test`.

## Fonts and Artwork

Both menu font families use the SIL Open Font License. Local license copies are in `assets/fonts/Manrope-OFL.txt` and `assets/fonts/CormorantGaramond-OFL.txt`. The WOFF packaging preserves the downloaded variable font data. Celestial tracery is original vector interface artwork; all existing game paintings, character art, logos and item assets retain their provenance.

## Battle Follow-up — v0.24.1

The Special-ready instruction no longer creates a row beneath the champions. Readiness stays visible on the glowing champion card; the short target-selection/Cancel prompt overlays the board without changing its geometry. Existing dragon-head Blast artwork and jeweled Prism artwork are restored for all five elements, while regular runes retain their distinct elemental silhouettes. `npm run art:build` now rejects reused paintings between normal, Blast and Prism variants. `tests/battle-steady-browser.mjs` checks readiness/targeting geometry and real match-4/match-5 creation on phone, landscape and desktop layouts.

## Menu Guide Follow-up — v0.24.2

The menu Guide now includes an Effects tab beside Factions, with Buffs, Ailments and Instant Actions. All descriptions still come from the combat effect definitions. The split Guide/Effects control and first-battle guide popup are removed from combat; its dock contains only Exit, Speed and Auto. Active status badges still open the affected champion’s current effects. Browser checks cover every effect category at six widths, faction access, fresh battle entry, status inspection and compact battle layouts.
