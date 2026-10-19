# Campaign and Dungeons · v0.8

Legends now adapts Warband Legends’ 25-stage × three-difficulty structure into its own match-3 engine. There are 75 campaign encounters and 21 dungeon encounters, all deterministic and playable with the existing roster and leveling system. No connection to the original game's server or saves is made.

## Campaign

Normal, Hard and Nightmare each have 25 sequential stages and independent cleared-stage progress. Like Warband Legends, stage 1 in every difficulty is available immediately; clearing a stage opens the next stage in that same difficulty. There is no mandatory Normal-clear gate before trying Hard. Stage groups of five keep the encounter cards manageable; the illustrated map has all 25 numbered destinations, guardian markers, previews and touch/keyboard scrolling. Every fifth crossing is a stronger guardian formation.

The normal world-map artwork is retained. Hard and Nightmare are original edited skins of that same map, preserving its major landmarks and geography while adding smoke, damaged buildings, burned forest, ruined bridges and finally a more apocalyptic eclipse landscape. These are new local images, not a color filter. The source game's maps provided the concept, not the pixels for these new campaign skins.

The first three Normal encounter IDs remain `ashen-gate`, `frozen-pass`, `veil-sanctum`. Additional IDs include difficulty and stage number. Existing v0.7 saves upgrade to profile schema 6 without resetting hero XP, ownership, copies, gold, seals, quests or active battles. Contiguous first-three clears map into Normal progress. The existing Legends save keys and combat schema are retained. v0.7 exported profiles remain importable.

Enemy strength is authored in `src/encounters.js` and never scales with the player's level. Hard uses a 1.4 multiplier and Nightmare 1.85 at the same stage. Guardian crossings have an additional modest strength increase. Heroes’ Specials, effects, mana, stats at each level and max-level roster definitions are unchanged.

First campaign clears grant 500 gold, 1 seal and 1.5× the encounter's repeat XP. Replays give that encounter's gold and XP. The first three Normal reward values are unchanged from v0.7; later rewards increase with stage and difficulty. Every fifth campaign victory still grants a repeatable seal. Suggested hero levels are guidance, not entry requirements or guaranteed wins.

## Dungeons

Seven original dungeon illustrations are reused from `frontend/src/assets/dungeons` in the owner's Warband Legends checkout, bundled as optimized local WebP data in SVG wrappers:

- Ashen Crypt — The Cinder Warden
- Obsidian Vault — Arcane Sentinel
- Voidbone Catacombs — Ossuary Herald
- Eclipse Spire — Nightplate Sovereign
- Hellgate Forge — Forge-Wife Eternal
- Prismatic Vat — Apotheon Residue
- Magmaheart Crucible — Magmaheart Wyrm

Each has Normal, Hard and Nightmare fights. Every Normal dungeon starts available. Clear that chamber's Normal to open its Hard tier, then Hard to open Nightmare. Each encounter uses a central guardian (165% base HP) with two themed escorts, seven attack lanes and actual reused champion kits. The Magmaheart Wyrm also reuses the original dedicated boss portrait. Guardian aliases and art survive reloading an in-flight fight.

Dungeon wins grant gold and XP to participating collected heroes. A first clear in each chamber/tier grants one seal and triple repeat gold; repeat clears grant the listed gold and XP. Dungeon clears and total dungeon wins are tracked separately and never unlock campaign stages or advance its five-victory seal milestone. Equipment drops, ascension materials and gear inventories have not been introduced; the reward previews show only implemented rewards.

Open-roster playtesting bypasses map and tier locks, with maximum-level heroes and zero rewards or progress, as before. A battle retains its mode and starting stats even if settings or levels change afterward.

## Verification and limits

The content suite builds all 96 formations, checks valid deterministic states, casts every starter hero's Special, verifies independent locks/rewards, save migration, backup validation, boss appearances and local artwork. Browser checks play a real dungeon through swaps/Specials to victory, validate its XP/gold and idempotent reload, launch every one of the 21 dungeon tiers, and inspect desktop/tablet/mobile maps and dungeon pages.

A simple first-legal-move/ready-Special probe over 15 seeds yielded: Normal stage 1 at level 1: 15 wins; Normal 25 at level 40: 15; Hard 25 at level 65: 12; Nightmare 25 at maximum starter levels: 1; Ashen Crypt Normal at level 1: 15; Prismatic Vat Nightmare at maximum starter levels: 9. None remained stuck after 120 moves. These are smoke results, not final balance or optimal play. The hardest content intentionally needs stronger teams and better decisions; broader roster/pacing tuning remains playtest work.
