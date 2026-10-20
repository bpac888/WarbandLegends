# Step 1 validation

Validated with Node.js 24 and Chromium on 2026-10-18 (first foundation and v0.2 roster update).

## Automated checks

`npm run check` runs the combat/data/save suites and builds the production site. These cover seeded boards, legal moves, elemental rules, invalid swaps, intersecting matches, gravity/cascades, Blast/Prism creation and chains, missing colors, same-color stacks, empty lanes, enemy countdowns, dead enemies, signature targeting and mana, healing/cleanse/buffs, immunities, status expiry, revival, win/loss, kit descriptions, deterministic save recovery and malformed saves. Thirty seeded encounters simulate through completion. Initial boards are checked across 100 seeds.

All 135 original IDs were compared with the source definitions; a fixed source-ID digest guards against accidental renaming. Every champion's local portrait exists and the production build verifies its size and path. The source checkout and original remote branch remain unchanged.

## Browser smoke checks

`npm run test:browser` requires Playwright as a development-only tool. To run it on your own machine:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run build
npm run test:browser
```

Optional `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH` environment variables select an existing installation. They are only for local QA and are not hosting configuration.

The browser test loads the built files through an intercepted test origin and verifies home rendering, 135-champion roster/search, encounter start/help, 35 runes, five heroes, three enemies, keyboard swaps and restored focus, drag swaps, save/reload, animation speed, charged-skill targeting, victory unlocks, and 390px/320px layout without horizontal overflow. It checks for browser errors, missing files, and external requests. Eight screenshots are written to ignored `artifacts/` for visual review.

Desktop home/battle and mobile battle screens were visually reviewed. Effects and projectile animation have reduced-motion support. These checks establish the first playable foundation; long-term balance and broader device/user playtesting remain part of the next phase.

## Unified-Special and tile-mana update

Additional checks cover exact 6.5/8/10/12/13.5 standard thresholds, 8/10 and 5/10/15 charging gates, fractional gains, early and full casts, charge spending/caps, no numeric SPD, all source A2/A3 effects surviving in full Specials, passives/rarities/IDs unchanged, 27 champions in every color, the reference stat averages and ranges, and each of 135 champions casting every one of their levels. Mana buffs are checked separately from enemy countdowns. Legacy active battles restart while team/progress and the backup are preserved; completed victories remain idempotent.

Browser coverage includes the Charging roster filter, all-level Special previews, returning to a filtered roster, both charging formats, holding charge, disabled locked levels, zero-move casts, 320px charging dialogs and v1 migration feedback. Visual review includes the mobile charge dialog and filtered roster.

A simple policy using the first legal move and spending ready Specials was simulated for 50 seeds per encounter. Results were 50/50 Ashen Gate wins (8.0 moves average), 50/50 Frozen Pass wins (10.6), and 25/50 Veil Sanctum wins (12.4). This is a regression smoke check, not a claim of final balance or optimal play. It used the original saved starter team after color reassignment; new profiles now start with a rainbow team. Wider player testing remains necessary.

## Status and visual update · v0.3

Twenty additional interaction checks verify Attack Up/Tile Boost separation and multiplication, opposing-effect replacement, same-ID refreshes, blocked-application order, barrier refresh, generic/elemental/Pierce defense layers, mana block and flat gifts, cleanse vs dispel, ward timing, a shared board-move clock, four distinct DoT types, single-target vs area Taunt behavior, basic-attack protection, non-chaining Riposte, actual passive immunities, authored effect validity and v2 save preservation. Combined with the 38 existing combat/roster tests, all 58 pass.

Expanded browser checks verify the effect-guide tabs, effect definitions, tappable mobile active-status details, all 35 loaded vector rune images, and v2 migration preserving HP/charge/board/turn count. Desktop and 320px/390px layouts were visually reviewed. Eight screenshots are produced by the browser test. No missing assets, external runtime calls or browser errors were observed.

The same first-legal-move/ready-Special policy over 50 seeds per encounter in v0.3 yielded 50/50 Ashen Gate wins (7.86 moves average), 50/50 Frozen Pass wins (10.6), and 26/50 Veil Sanctum wins (13.32). These are regression smoke results rather than final player-balance claims.

## Game shell and visual polish · v0.4

All 74 named combat, effect and progression checks pass across three test files, followed by a successful production build. Sixteen new checks cover profile migration, starter ownership, weighted summon boundaries, resource spending, duplicates, failure cases, bounded history, one-time quests, first clears vs replays, collected-only team repair, resource caps and strict backup validation.

`npm run test:shell` uses the same optional Playwright setup as `test:browser`. It verifies keyboard splash entry, collection/codex/detail navigation, delayed portal reveal, prevention of double summoning, persistence after leaving the animation, one-time quest/victory rewards, owned-only teams, settings, backup export/import and invalid-file rejection. It checks fourteen pages at 1440px, 390px and 320px without horizontal overflow, missing assets, external requests or browser errors. The original battle browser suite also passes.

Rendered splash, portal, summon reveal, roster, hub and battle screens were visually reviewed. The polish pass adjusts image crops, circular portal inscriptions, consistent borders, quieter glow, text hierarchy and mobile spacing. Reused WebP artwork retains its original resolution; this pass improves composition and presentation rather than claiming newly generated high-resolution portraits.

## Tile art, full-art roster and identity · v0.5

Six new tests cover Collection vs Codex ownership, combined filters, both charging formats, normalized faction searches, numeric sorting without source mutations and fifteen distinct local WebP/SVG assets. All 80 named checks pass across four native test files; the production build verifies every portrait, tile variant and brand asset.

`npm run test:visuals` loads all 135 codex portraits and verifies natural image size, opacity 1, no filter, full-image containment and labels outside the artwork. It exercises element/type/rarity/faction/mana intersections, faction search, sorting and reset, and checks bright team selection images. A valid battle fixture renders all fifteen color/special combinations, then verifies special asset routing, 390px/320px layouts, portal windup before champion mounting, bright arrival and the reduced-animation preference. No missing assets, external requests or browser errors were observed. The existing battle and game-shell browser suites also pass.

The tile sheet, desktop/mobile roster and codex, special-filled battle board, portal activation/arrival, new logo, title screen and game pages were visually reviewed. Existing tile rules remain unchanged: artwork communicates the existing Blast and Prism mechanics. New images are high-density raster assets in SVG wrappers, not vector artwork.

## Artwork-led experience · v0.6

All 86 named automated checks across five test files pass with the production build. Six new checks cover speed-only card captions, full-art/symbolic roster markup, actual damage targets, healing vs ward plans, enemy basics vs Specials, and campaign locks. Effect planning is checked for state immutability.

`npm run test:experience` covers sidebar removal, seven lane destinations, keyboard previews, straight-column bolts, a three-target area Special, reduced motion, thirteen pages at desktop/390px/320px, symbolic stats, and real map locks. Existing browser scripts remain in the workflow. Screenshots are retained as the `legends-browser-captures` CI artifact.

All four browser suites now pass after service access recovered. The rendered Citadel, Adventure destinations, illustrated campaign, full-art roster, centered battle, lane attacks and area Special impacts were reviewed at desktop and phone sizes. No horizontal overflow, missing assets, external runtime requests or browser errors were observed. The first browser pass caught an accessible-name issue caused by decorative control content; the controls now use hidden SVG icons and explicit labels. The new saved-battle test reloads persisted fixtures before routing, matching the real save-loader lifecycle. The GitHub workflow independently runs all four suites and retains screenshots for review. Combat rules, all 135 champion IDs and the original Warband Legends game remain unchanged.

## Hero progression and development · v0.7

All 98 named native checks pass across six test files, followed by a successful production build. Twelve new progression checks cover all 135 monotonic stat curves and exact max baselines, rarity costs, multi-level XP and caps, unchanged mana/kits, exact gold training, stale confirmations, denied training, duplicate retention, participant/fallen-ally XP, idempotent rewards, repeatable seals, sandbox isolation, fixed encounter strength, captured battle stats, save round-trips and the owner-approved fresh-save namespaces. The previous pre-v0.7 profile migration test now verifies the intentional fresh start.

All five browser suites pass locally: `test:browser`, `test:shell`, `test:visuals`, `test:experience`, and the new `test:development`. The development suite plays an actual encounter via UI swaps and Specials to a real victory; verifies XP/level-up rows and no reward duplication on reload; trains a Rare hero with cancel/confirm and persistent stat growth; checks no copies are consumed; exercises unowned previews and Special navigation; and validates the mode captured at battle entry. Screens are checked at 1440px, 760px, 390px and 320px. Desktop/mobile development, training confirmation, victory growth and campaign rewards were visually reviewed. No horizontal overflow, missing assets, external runtime requests or browser errors were observed. Codex sorting stays based on maximum stats, while Collection sorting uses current development.

`node tools/progression-smoke.mjs` probes a simple first-legal-move/ready-Special policy over 30 seeds at starter levels 1, 10 and 30. Ashen Gate and Frozen Pass were 30/30 at each tested level; Veil Sanctum was 6/30, 13/30 and 24/30 respectively. This shows a modest onboarding path and a harder third encounter that becomes easier with growth. It is a regression probe, not proof of final balance or human difficulty. Broader team compositions, chapter expansion, economy pacing and user playtesting remain future work.

The GitHub workflow includes all five browser suites and captures screenshots in `legends-browser-captures`. Native test count can be shown explicitly with `node --test --test-isolation=none tests/*.test.mjs` (some Node setups summarize isolated test files rather than individual cases).

## Campaign and dungeon expansion · v0.8

All 109 named native tests and the production build pass. Eleven new content tests verify 75 campaign and 21 dungeon identities, every formation and Special, fixed difficulty scaling, per-difficulty sequential unlocks, 21 independent dungeon-tier rewards, repeat payout rules, v0.7 profile/backup migration without data loss, guardian aliases/Wyrm art on reload, sandbox isolation, local art and malformed progression fields.

All six browser suites pass locally, including `test:adventure`. It verifies all three real map images, 25-node maps, stage-group selection, scrolling and responsive layouts at 1440/760/390/320, every reused dungeon illustration, preview/lock controls, a real dungeon fight played by UI swaps and Specials, idempotent rewards/reload, tier unlocks, and real launches/resumes of all 21 dungeon encounters. Screenshots of desktop/mobile maps, dungeons, previews and the Wyrm battle were actually reviewed. The browser pass caught a CSS-relative background path; the battle now resolves asset URLs against the document base. No remaining missing assets, external requests, horizontal page overflow or browser errors were observed.

The first adventure harness was adjusted to eagerly load offscreen lazy images before decoding them; this avoids a test wait unrelated to player image loading. The original game's local checkout remains clean. The source snapshot and art provenance are recorded in RIGHTS.md and docs/ADVENTURES.md. Seeded difficulty smoke results and limitations are in the adventure guide.

## Arena, events and source-game artwork · v0.9

All 123 named native checks and the production build pass. Fourteen new checks cover four-enemy Arena formations and exact lane coverage, one-time rating/token outcomes, LA calendar boundaries and DST, 20 attempts and monthly reset, entry reservations and abandonment, captured-window settlement, defeats, sandbox isolation, token exchange limits, schema-6 migration, malformed saves and atomic ten-pull guarantees.

All seven browser suites pass locally. The new modes suite plays actual Arena and event battles to victory using UI swaps and Specials, confirms all nine rival cards/36 portraits, entry charges and reload safety, exchange cancel/confirm, and atomic ten-pull purchase/skip persistence. Closed windows disable entry, and no event practice control exists. The original-style ritual keeps the champion absent during its 1.5-second activation, then reveals it. New pages were checked at 1440/760/390/320 pixels. Desktop/mobile Arena, Events, Citadel, Altar, ritual activation/arrival and ten-pull results were visually reviewed. No missing assets, external requests, horizontal overflow or browser errors remain. An ambiguous exchange locator found during testing was narrowed to the preview action; game behavior was unaffected.

The workflow independently runs all seven browser suites and retains screenshots. This remains a local-game foundation: Arena uses preset opponents and event timing uses the browser clock, rather than server-authoritative competitive systems. All 135 IDs, existing saves and core combat rules remain intact. The original game's local checkout is clean.

## Authored opening chapter and Special clarity · v0.10

All 136 named native tests and the production build pass. Thirteen new checks cover shared description/execution order for all 152 charge levels, accurate automatic versus selected targets, actual Dispel/debuff/damage and Cleanse/protection/healing log order, representative roles, all opening setups across difficulties, exact half-health boundary, one-time guardian timing, invalid actions, death, special-rune triggers, buff counters and expiry, animation plans, strict state validation, backups/reloads and legacy fights.

All eight browser suites pass locally. The new tactics suite checks the ten reviewed heroes' rendered ordered steps, desktop/tablet/390/320 dossier layouts, encounter previews and tactics controls. It plays a legitimate seeded level-10 guardian fight through public swaps and Specials to victory, captures Overpressure, reloads during the fight, verifies the phase does not recur, and checks progression/rewards settle once. A legacy saved fight keeps its original rules. No page overflow, missing assets, external requests or browser errors remain. Desktop/mobile ordered details, the guardian preview, phase badges and tactics panel were visually reviewed. An initial test assertion was corrected to collect phase-log IDs across actions because the existing chronicle intentionally retains only 80 entries.

A separate development-time comparison exercised all 152 charge levels against the v0.9 resolver with injured allies and buffed enemies. Entire resulting states and frames were exactly equivalent. This confirms the shared ordered-plan refactor preserves existing Special behavior in those probes. No roster data, mana thresholds or hero/passive numbers changed.

The 20-seed opening-chapter smoke probe and its limits are recorded in docs/TACTICS.md. Its simple policy does not evaluate all teams or prove balance. Existing Arena/events/summoning, campaigns/dungeons and development suites still pass. GitHub Actions runs all eight suites and retains screenshots. The original Warband Legends checkout remains clean.

## The Hollow Covenant and charge decisions · v0.11

All 148 named native checks and the production build pass. Twelve new native checks cover the authored stages 6–10 across all difficulties, opening status/charge state, ward counters, actual revival and pre-hit Dispel, escort-based Last Light timing, no stolen attack/charge, Buff Seal/Dispel/expiry, Riposte versus rune damage, special-rune activation, guardian persistence and legacy rules, and all multi-charge comparisons including Vex's single-target/area tradeoff.

All nine browser suites pass locally. The new Covenant suite checks 15 encounter previews across the three difficulty skins, actual enemy charge/kit inspection without spending a turn, Vex's 202%-single versus 190%-area comparison, and desktop/tablet/390/320 layouts. It plays an actual level-10 Obsidian Gate encounter using public board/Special controls, targets escorts to exercise Last Light, reloads after the phase, wins, and confirms a one-time reward and stage-10 progression. Legacy saves retain their captured enemy roster and absence of the new phase. Screenshots of chapter headings, charge comparisons, enemy inspection and the phase were visually reviewed. No missing assets, external requests, browser errors or horizontal overflow remain. A browser selector was scoped to the active dossier to avoid matching retained content in a closed dialog.

A separate comparison against v0.10 confirmed exact initial-state, result-state and frame equivalence across 482 actions in 50 seeded opening-chapter fights. Stage 5 Overpressure remains unchanged. Twenty-seed second-chapter probes using two targeting policies are recorded with their limitations in docs/COVENANT.md. They are not a human balance verdict. Boss/flank HP proportions were adjusted before the final probes so the second phase appears naturally with escort-first play. Hero data, IDs, levels, Special coefficients and passive rules remain unchanged; the original game's local checkout stays clean. GitHub Actions runs all nine browser suites and preserves screenshots.

## Visual finishing pass · v0.12

All 148 existing native checks and the production build pass. No new gameplay or implementation-mirroring tests were added for this reversible presentation pass. All nine existing browser suites pass locally, including real campaign/dungeon/Arena/event/guardian fights, save/reload checks, summoning, filters and detailed champion views.

The pass refines shared color, border, shadow, button and focus treatments; improves secondary text and card spacing; reuses location artwork in Adventure destination cards; and removes excess space above mobile event details. Hero portraits keep their existing full-art, undimmed treatment. The original portal ritual and animation timing are preserved. Screens were checked at 1440/760/390/320 pixels, with actual desktop/mobile screenshots reviewed for the Citadel, Adventure, roster, champion dossier, Events, summoning, menus and battle. No horizontal overflow, missing assets, external runtime requests or browser errors remain.

The owner's latest direction is recorded in NEXT-SESSION.md: retain the existing twenty tactical guides and create no new ones. The combat, encounter, guide, progression and development source files are byte-identical to v0.11. All hero IDs, stats, abilities, saves and progression remain intact; the original Warband Legends checkout remains clean. GitHub Actions independently runs the existing complete checks before main is updated.

## Ascension and awakening · v0.13

All 159 named native checks pass (`node --test --test-isolation=none tests/*.test.mjs`), and `npm run check` passes all 11 test files plus production build. The 11 new checks cover every cap for all 135 heroes, atomic costs, ownership/eligibility, stale confirmations, three additive awakening ranks, unchanged copies/kits, material purchases/drops/storage limits, old-save migration, malformed data, backup round-trips and captured battle stats.

All ten browser suites pass locally: the nine existing suites plus `test:ascension`. The new flow uses real training, ascension, purchase and awakening confirmation controls; cancel/reload preserves resources; Collection current stats and Codex maximum awakened stats differ correctly; all three awakening ranks persist; an existing battle retains old stats while a newly launched battle captures rank 3 stats. Fixtures provide resource-rich/legacy profiles for eligibility tests, not fabricated wins. Existing suites independently play real campaign, dungeon, Arena, event and guardian fights.

Actual desktop/mobile screenshots were reviewed for the material shop, inventory, champion dossier, cap road and awakening confirmations. The ten distinct SVG icons render clearly. Shop/dossier layouts were checked at 1440/760/390/320 px and inventory at 1440/390/320 px. No missing assets, external runtime requests, horizontal page overflow or browser errors were observed. Campaign/dungeon previews now show material drops and victory results show awarded materials.

The first checkpoint's ascension browser test waited for a tutorial button even though its fixture had already seen the tutorial. This was corrected to wait for the battle board; the complete final flow then passed. A malformed null hero snapshot is rejected safely. No hero IDs or source roster baselines changed. Schema 8 migrates prior XP with enough ascensions to preserve earned levels; no further reset occurs. The existing 20 guides are retained and no new guides were added. Warband Legends remains untouched. GitHub Actions includes the new suite and must pass on the exact release commit before main is advanced.

## Palette, battle viewport and portal · v0.14

The new midnight blue/amethyst/warm gold palette covers navigation, surfaces, dialogs, cards, progression and the summoning page while preserving elemental colors and bright, undimmed character art. No combat coefficients, hero data, encounter rules, progression costs or save formats changed; all 135 IDs and the existing 20 guides remain intact.

`npm run check` passes the existing 159 named native checks and production build. All ten prior browser suites passed locally after the redesign, covering real campaign/dungeon/Arena/event/guardian battles, summons and activation timing, filtering, leveling, ascension, awakening and saves.

The new `test:viewport` browser suite checks actual content bounds, not only hidden overflow: every hero card, the scene, board and tools remain inside the viewport. It checks 1440×900, 1366×768, 1280×720, 1024×768, 390×844, 375×667, 320×568, 844×390 and 568×320. Short landscape layouts dock the five heroes beside the board. All 35 tiles remain at least 24 CSS pixels wide in these tested windows. Status rows stay bounded. OS/browser zoom and unusually smaller windows may require further adaptation; the verified dimensions are listed explicitly.

The suite verifies READY labels for a partial charging tier and a regular charged hero, the available-Special count, and a real cast through the public controls: the selected ready cue disappears, mana is spent and the move count stays unchanged. Ready cues use text, gold borders, a filled mana bar and a tap prompt; meaning does not depend on animation or color alone. Reduced animation disables the optional shimmer.

Desktop, phone and short-landscape screenshots were actually inspected. The Astral Gate keeps the original ritual timing, single/ten-summon prices, guarantee and collection behavior, with buttons below the artwork and explicit seal-shortage text. Home/roster/portal/inventory pages were checked at 1440/390/320 widths. No missing assets, external requests or browser errors were observed. GitHub Actions includes all eleven browser suites and preserves captures before main is updated.


## Gems, account journey and UI cleanup · v0.15

All 179 named native checks and the production build pass locally. New checks cover atomic Gem purchases/summons, storage bounds, reward idempotence, 43 quests, authorized fresh saves, account XP/caps, Los Angeles date boundaries, daily claims and clock rollback, saved-team ownership, and all 16 reused art files. All 135 hero IDs and the existing twenty tactical guides remain intact.

All twelve browser suites pass locally: browser, shell, visuals, experience, development, adventure, modes, tactics, economy, viewport, ascension and covenant. The new economy suite buys materials and gold, summons, claims quests, plays two actual campaign victories, claims the calendar and daily chest, changes portraits, and saves/loads teams. Reload checks verify one-time rewards. Existing suites exercise real dungeon, Arena, event and guardian battles, ascension and awakening.

Actual desktop/phone screenshots were reviewed for the Citadel, shop, quests, daily gifts, settings, portal and roster. Shop departments, six-at-a-time mobile quests, reward chips, optional gift previews and consistent blue surfaces simplify the pages. Widths 1440/760/390/320 are covered; the nine battle viewport sizes from v0.14 remain covered. No missing art, external runtime requests, horizontal overflow or browser errors were observed. GitHub Actions runs the same twelve suites and saves screenshots; publication requires success on the exact release commit.

The owner explicitly approved discarding Legends test progress for the new economy. Profile schema 9 uses a new key and does not migrate old currency; the previous migration descriptions above are historical. Original Warband Legends remains unchanged. Equipment is explicitly excluded. See GEMS-QUESTS.md and REUSE-AUDIT.md for current rules and source mapping.


## Individual heroes and visual refresh · v0.16

The current native suite passes 184 named checks, including six new focused checks for independent duplicate development, same-design copies fighting together and round-tripping through a saved battle, Common-hero feeding and donor protection, collection milestones counting unique designs, and v0.15 counted-copy migration. The production build checks every new item image and all 135 source IDs. The previous historical notes about shared duplicate development above describe earlier releases.

The refreshed browser suite uses the actual UI to open two separate copies in Collection, train one by consuming the other, confirm the retained copy/XP in storage, review disabled Premium offers, and load each material image. It checks all three event illustrations and 1440/760/390/320 layouts for overflow and missing assets. The existing browser suites cover real battles, save/reload, summoning, quests, training, ascension and the nine battle viewport sizes. Desktop and phone captures were inspected for battle, events and shop. Premium controls are intentionally disabled and do not call a payment service.

## Roster promotions, feeding and final polish · v0.17

All 191 named native checks and the production build pass locally. The seven new focused checks verify the 14 exact promoted IDs and Rare-tier stats/kits, four Commons per color while keeping 27 total heroes per color, three eight-tile Fast Mythicals, twin-Common summoning with independent copies and 10-call guarantee, required Common feeding, v0.16 save migration, and higher first-clear and quest Gems. Existing combat, quest, dungeon, Arena, event, material, save and duplicate-copy checks continue to pass.

All thirteen browser suites passed locally: browser, shell, visuals, experience, development, adventure, modes, tactics, economy, refresh, viewport, ascension and covenant. The development browser test now consumes an actual Common donor, confirms the target level and persistent save, and completes a real campaign victory. The refresh suite checks independent copies, donor protection, item art, event art and shop/roster layouts. The viewport suite covers nine battle sizes without scrolling. Desktop and phone captures were inspected for the battle, roster, shop, portal, event and hero dossier; the hero dossier review caught and corrected an ascension description that had displayed the feeding limit as the required level.

A final targeted Chromium pass after the CSS and ascension text refinements is recorded in the release review. The GitHub Actions workflow must run the full same suite on the exact release commit before `main` advances. Warband Legends remains untouched.

## Tiered ascension and two Limit Breaks · v0.18

`npm run check` passes the 16 native test files and production build; `node --test --test-isolation=none tests/*.test.mjs` reports 195/195 named checks. Focused tests cover all 135 heroes' ascension caps and immediate stat gains, tier-local display, two +5-level Limit Breaks, role-based battle-opening boons, unchanged full-power Specials, per-copy independence, gold/material costs, legacy profile migration and save validation. The existing Campaign, Arena, dungeon, event, summoning, item and battle tests remain green.

All 13 local Chromium suites passed on the updated progression UI. The final code change adds LB2 opening boons and clarifies max-level copy; the affected ascension, visual and experience suites were rerun against the final build and passed. The ascension suite confirms tier 2 starts visibly at level 1, both Limit Break confirmations, bonus stats and a role boon in a new battle, while an active battle retains its starting state. Desktop and 390px dossier screenshots were reviewed; no missing artwork or horizontal overflow was observed. Publish only after exact-commit GitHub Actions passes on the review branch.
