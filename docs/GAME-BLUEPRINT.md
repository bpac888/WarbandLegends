# Legends game foundation · v0.4

This is a separate local single-player game. It reuses the owner's champion identities and optimized artwork without changing Warband Legends or connecting to its services.

## Connected areas

| Area | Available now | Later refinement |
| --- | --- | --- |
| Title | Layered champion/portal artwork, Enter key and button | Sound and cinematic assets |
| Citadel | Team, campaign entry, collection/portal/quest links | Personalized progression hub |
| Adventure | Campaign and clearly marked future destinations | World regions and schedules |
| Campaign | Three unlocked-in-order encounters, saved battles, rewards | Chapters, bosses, difficulty balance |
| Roster | Owned collection, complete 135-champion codex, filters, detail pages, team selection | Training, ascension, duplicate consumption |
| Summon | Earned seals, delayed animated reveal, rarity odds, saved copies and recent history | Pool rotation and economy tuning |
| Quests | Three one-time starter quests with actual rewards | Repeatable quests and achievements |
| Inventory | Gold, seals, collected copies | Consumables, gear and materials |
| Settings | Name, collection mode, reduced motion, save export/import | Audio and additional preferences |
| Dungeons/Arena/Events/Alliance/Shop | Navigable foundation pages labeled not playable | Their complete game systems |

## Local progression loop

New profiles own five rainbow-team champions, 500 Gold and five Summon Seals. One seal recruits a champion. Rarity chances are Common 50%, Rare 35%, Legendary 13%, Mythical 2%; each champion within its rarity is equally likely. Duplicates become additional copies, retained for later progression. There is no paid currency.

Each campaign's first clear grants 500 Gold and one Seal. A newly completed replay grants 50 Gold, without another Seal. A battle ID is recorded to prevent rewards repeating on normal reload. Quest rewards can be claimed once. Gold is tracked for future systems and has no spending sink yet. This intentionally small prototype economy is not a finished progression system; repeatable seal sources need design before extended collection play.

Open-roster playtesting stays enabled by default so existing access to all 135 heroes is preserved. The Collection tab tracks actual ownership separately from the complete Codex. Disable open roster in Settings for collected-only teams; the team is repaired to five owned heroes when needed.

## Save contract

The existing profile key is retained and migrated to schema version 4. Existing teams, progress and completed stages survive. Old teams also receive owned copies so migration does not remove access. New fields are persisted once; legacy clear rewards are initialized once. Current battle version 3 and prior battle migration remain intact.

Summons are persisted before the reveal animation: navigation cannot erase the recruit. Backups contain profile and current battle, carry a game/version marker, and are validated before confirmation. Import replaces only this browser's independent Legends save. Export before moving browsers or clearing browser data.

These saves are editable local files, suitable for this offline prototype. Online progression or competitive rewards require a new authoritative backend, separate from Warband Legends.

## Presentation and structure

The graphic system uses navy backgrounds, warm gold framing, restrained elemental accents, reusable SVG interface icons and existing local WebP scenes/portraits. Splash montages, circular portal inscriptions, reveal timing, roster framing and mobile layout are composed specifically for this game. No runtime request goes to the original game.

- `src/shell.js`: stateless page views and navigation.
- `src/shell.css`: responsive title, portal and page presentation.
- `src/app.js`: routing, interactions and battle playback.
- `src/progression.js`: pure collection, summon, quest and reward transitions.
- `src/save-files.js`: validated portable save format.
- `src/engine.js` / `src/effects.js`: deterministic combat and effect rules.

Next passes can refine campaign depth and collection progression, then build one planned destination at a time. Existing hero IDs, four rarities, five colors, unified Specials, passives and tile-based mana stay the foundation.
