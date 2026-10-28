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

## Illustrated Adventure — v0.25

Adventure experiments with an illustrated menu: the Campaign kingdom, Special Events portal, dragon-carved Dungeons entrance and Arena are clickable regions in one detailed realm. A second composition is tailored to phones. Large transparent hit areas, visible destination names, keyboard focus and the existing four routes provide navigation without individual cards or text panels. The Shop and Alliance remain outside Adventure.

The bright paintings have no dimming layer. CSS adds slow portal light, a rotating portal ring, waterfall glints, embers and fireflies; these effects cannot intercept input or alter layout. System reduced motion disables motion, and hidden-tab motion pauses. The new stylesheet is scoped to Adventure. Tavern, character artwork/data and combat are unchanged. `npm run test:realm-map` checks destination navigation at six widths, phone artwork selection, hit areas, keyboard entry, reduced motion, pausing and Tavern preservation.

## Campaign Follow-up — v0.25.1

Campaign now has only its title, difficulty tabs and the map. The description, Edit Warband button, realm summary and scrolling hint are removed. The map fills the available screen below the header and tabs, while stage hit targets remain 44 pixels. It centers on the current stage horizontally and vertically on entry. The recurring 50-Gem campaign victory bonus and its progress move to a compact row on Quests; awarding rules and saves are unchanged.

## Illustrated Dungeons — v0.26

Dungeons uses a continuous guardian realm in place of seven information cards. Separate wide and phone paintings depict all seven existing guardians as colossi above miniature fortresses. Each guardian is a large, accessible click region leading to its existing encounter; visible names, descriptions, suggested levels, reward lists and energy labels are removed. Difficulty tabs, completion counts, per-dungeon unlocks and small lock/clear marks remain. Entry uses a compact boss/difficulty confirmation with only Confirm and Close. Energy costs, rewards, encounters, saves, champion portraits and combat remain unchanged.

Slow magical auras, an alchemy orbit, waterfall glints and sparse embers animate locally without moving the painting or changing layout. System reduced motion disables them; hidden tabs pause them. The new styles are scoped to Dungeons.

`npm run test:dungeon-realm` checks the seven painted hit areas at six viewport sizes, simple confirmations, all difficulty locks, reduced motion and hidden-tab pausing. It launches every one of the 21 real dungeon encounters, checks the existing 1/2/3 Energy costs and verifies that abandonment does not grant rewards or progress. It also checks zero-Energy entry rejection.
